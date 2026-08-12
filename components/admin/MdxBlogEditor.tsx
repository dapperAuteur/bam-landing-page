'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoPicker from '@/components/ui/PhotoPicker'
import CategoryCombobox from '@/components/admin/CategoryCombobox'
import type { CategoryOption } from '@/lib/blog/categories'
import type { Photo } from '@/types/photo'

interface MdxBlogEditorProps {
  // 'new' (or undefined) = create; otherwise a blog_posts _id to edit.
  postId?: string
}

interface FeaturedImage {
  id: string
  url: string
  thumbnailUrl: string
  title?: string
  alt?: string
}

interface FormState {
  title: string
  slug: string
  description: string
  excerpt: string
  category: string
  tags: string // comma-separated in the form
  readTime: string
  publishDate: string
  featured: boolean
  // Featured rail position as typed; '' = no order chosen (saved as null).
  featuredOrder: string
  featuredImage: FeaturedImage | null
  content: string // MDX source
  status: 'draft' | 'published'
}

const EMPTY: FormState = {
  title: '',
  slug: '',
  description: '',
  excerpt: '',
  category: '',
  tags: '',
  readTime: '',
  publishDate: '',
  featured: false,
  featuredOrder: '',
  featuredImage: null,
  content: '',
  status: 'draft',
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9/]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function MdxBlogEditor({ postId }: MdxBlogEditorProps) {
  const router = useRouter()
  const isNew = !postId || postId === 'new'
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<'single' | 'carousel' | 'featured'>('single')
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  function insertAtCursor(text: string) {
    const el = contentRef.current
    const pos = el ? el.selectionStart : form.content.length
    set('content', form.content.slice(0, pos) + text + form.content.slice(pos))
    setPickerOpen(false)
  }

  // Set the post's featured image (hero + social-share card) from the library.
  function setFeatured(photo: Photo) {
    set('featuredImage', {
      id: photo.id,
      url: photo.originalUrl,
      thumbnailUrl: photo.thumbnailUrl,
      title: photo.title,
      alt: photo.alt || photo.title,
    })
    setPickerOpen(false)
  }

  function onPick(photo: Photo) {
    if (pickerMode === 'featured') setFeatured(photo)
    else insertPhoto(photo)
  }

  // Single photo → markdown image (renders via the MDX `img` registry component).
  function insertPhoto(photo: Photo) {
    insertAtCursor(`\n\n![${photo.alt || photo.title || 'photo'}](${photo.originalUrl})\n\n`)
  }

  // Multiple photos → an MDX <Carousel> (serializable images prop).
  function insertCarousel(photos: Photo[]) {
    if (photos.length === 0) return
    const images = photos
      .map(p => `    { url: ${JSON.stringify(p.originalUrl)}, alt: ${JSON.stringify(p.alt || p.title || '')} }`)
      .join(',\n')
    insertAtCursor(`\n\n<Carousel images={[\n${images}\n]} />\n\n`)
  }

  // Categories already in use, fetched once so the picker can show what exists before a
  // near-duplicate gets typed. A failure here leaves the picker empty, which degrades to
  // the old free-text behavior rather than blocking the editor.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/blog/categories')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data.categories)) setCategories(data.categories)
      } catch {
        // Non-fatal: the author can still type a category.
      } finally {
        if (!cancelled) setCategoriesLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (isNew) return
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/blog/posts/${postId}`)
        if (!res.ok) throw new Error('Failed to load post')
        const { post } = await res.json()
        setForm({
          title: post.title ?? '',
          slug: post.slug ?? '',
          description: post.description ?? '',
          excerpt: post.excerpt ?? '',
          category: post.category ?? '',
          tags: (post.tags ?? []).join(', '),
          readTime: post.readTime ?? '',
          publishDate: post.publishDate ?? '',
          featured: !!post.featured,
          // 999 is the legacy "no order chosen" sentinel; show it as blank.
          featuredOrder: post.featuredOrder == null || post.featuredOrder === 999 ? '' : String(post.featuredOrder),
          featuredImage: post.featuredImage ?? null,
          content: post.content ?? '',
          status: post.status === 'published' ? 'published' : 'draft',
        })
        setSlugTouched(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    })()
  }, [postId, isNew])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  async function save(status: 'draft' | 'published') {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        ...form,
        status,
        slug: form.slug || slugify(form.title),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        featuredOrder: form.featuredOrder.trim() === '' || Number.isNaN(Number(form.featuredOrder))
          ? null
          : Number(form.featuredOrder),
      }
      const res = await fetch(
        isNew ? '/api/admin/blog/posts' : `/api/admin/blog/posts/${postId}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      router.push('/admin/blog/posts')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>

  const input = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'New post' : 'Edit post'}</h1>
        <span className={`text-xs px-2 py-1 rounded-full ${form.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {form.status}
        </span>
      </div>

      {error && <div className="rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={label}>Title</label>
          <input
            className={input}
            value={form.title}
            onChange={e => {
              set('title', e.target.value)
              if (!slugTouched && isNew) set('slug', slugify(e.target.value))
            }}
          />
        </div>
        <div>
          <label className={label}>Slug</label>
          <input
            className={input}
            value={form.slug}
            onChange={e => { setSlugTouched(true); set('slug', e.target.value) }}
          />
        </div>
        <div>
          <label className={label} id="category-label">Category</label>
          <CategoryCombobox
            value={form.category}
            onChange={value => set('category', value)}
            options={categories}
            loading={categoriesLoading}
            inputClassName={input}
            labelId="category-label"
          />
          <p className="text-xs text-gray-500 mt-1">
            One category per post. Type to filter what already exists; tags handle the rest.
          </p>
        </div>
        <div className="md:col-span-2">
          <label className={label}>Description</label>
          <input className={input} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Excerpt</label>
          <textarea className={input} rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
        </div>
        <div>
          <label className={label}>Tags (comma-separated)</label>
          <input className={input} value={form.tags} onChange={e => set('tags', e.target.value)} />
        </div>
        <div>
          <label className={label}>Read time</label>
          <input className={input} placeholder="6 min read" value={form.readTime} onChange={e => set('readTime', e.target.value)} />
        </div>
        <div>
          <label className={label}>Publish date</label>
          <input className={input} type="date" value={form.publishDate} onChange={e => set('publishDate', e.target.value)} />
        </div>
        <div className="flex items-center gap-4 pt-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
            Featured
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Order</span>
            <input
              className={`${input} w-20`}
              type="number"
              min={1}
              placeholder="none"
              title="Featured rail position (1 = first). Leave blank for no chosen order."
              value={form.featuredOrder}
              onChange={e => set('featuredOrder', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Featured image (post hero + social-share card) */}
      <div>
        <label className={label}>Featured image</label>
        <div className="flex items-center gap-4">
          {form.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.featuredImage.thumbnailUrl} alt={form.featuredImage.alt || ''} className="h-20 w-32 object-cover rounded-md border" />
          ) : (
            <div className="h-20 w-32 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">None</div>
          )}
          <button
            type="button"
            onClick={() => { setPickerMode('featured'); setPickerOpen(true) }}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {form.featuredImage ? 'Change' : 'Set'} featured image
          </button>
          {form.featuredImage && (
            <button type="button" onClick={() => set('featuredImage', null)} className="text-sm text-red-600 hover:text-red-800">Remove</button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Shown as the post hero and as the Open Graph / Twitter card image when shared.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={label}>Content (MDX)</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setPickerMode('single'); setPickerOpen(true) }}
              className="text-sm px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              🖼️ Insert photo
            </button>
            <button
              type="button"
              onClick={() => { setPickerMode('carousel'); setPickerOpen(true) }}
              className="text-sm px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              🎠 Insert carousel
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          Markdown + components: <code>&lt;Chart&gt;</code>, <code>&lt;Carousel&gt;</code>,
          <code> &lt;CodeBlock&gt;</code>, <code>&lt;YouTubeEmbed&gt;</code>, fenced code blocks.
        </p>
        <textarea
          ref={contentRef}
          className={`${input} font-mono`}
          rows={20}
          value={form.content}
          onChange={e => set('content', e.target.value)}
        />
      </div>

      <PhotoPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        allowMultiple={pickerMode === 'carousel'}
        onSelect={onPick}
        onSelectMultiple={insertCarousel}
        title={pickerMode === 'carousel' ? 'Build a carousel' : pickerMode === 'featured' ? 'Set featured image' : 'Insert a photo'}
        description={pickerMode === 'carousel'
          ? 'Pick multiple photos for a carousel in the post.'
          : pickerMode === 'featured'
          ? 'Pick the post hero / social-share image.'
          : 'Pick a photo from your library to insert into the post.'}
      />

      <div className="flex items-center gap-3 border-t pt-4">
        <button
          disabled={saving || !form.title}
          onClick={() => save('draft')}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Save draft
        </button>
        <button
          disabled={saving || !form.title}
          onClick={() => save('published')}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {form.status === 'published' ? 'Update (published)' : 'Publish'}
        </button>
        <button
          disabled={saving}
          onClick={() => router.push('/admin/blog/posts')}
          className="px-4 py-2 rounded-md text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        {saving && <span className="text-sm text-gray-500">Saving…</span>}
      </div>
    </div>
  )
}
