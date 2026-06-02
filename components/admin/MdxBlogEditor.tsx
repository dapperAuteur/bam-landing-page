'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface MdxBlogEditorProps {
  // 'new' (or undefined) = create; otherwise a blog_posts _id to edit.
  postId?: string
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
  featuredOrder: number
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
  featuredOrder: 999,
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
          featuredOrder: post.featuredOrder ?? 999,
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
        featuredOrder: Number(form.featuredOrder) || 999,
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
          <label className={label}>Category</label>
          <input className={input} value={form.category} onChange={e => set('category', e.target.value)} />
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
            <input className={`${input} w-20`} type="number" value={form.featuredOrder} onChange={e => set('featuredOrder', Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div>
        <label className={label}>Content (MDX)</label>
        <p className="text-xs text-gray-500 mb-1">
          Markdown + components: <code>&lt;Chart&gt;</code>, <code>&lt;CodeBlock&gt;</code>,
          <code> &lt;YouTubeEmbed&gt;</code>, fenced code blocks.
        </p>
        <textarea
          className={`${input} font-mono`}
          rows={20}
          value={form.content}
          onChange={e => set('content', e.target.value)}
        />
      </div>

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
