'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PhotoIcon, RectangleGroupIcon, EyeIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import PhotoPicker from './../ui/PhotoPicker'
import { Photo } from './../../types/photo'
import { BlogPostDraft } from './../../types/types'
import { getAllCategories } from './../../lib/blogData'

interface BlogEditorProps {
  postId?: string
  initialData?: Partial<BlogPostDraft>
}

export default function BlogEditor({ postId, initialData }: BlogEditorProps) {
  const router = useRouter()
  const [post, setPost] = useState<Partial<BlogPostDraft>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    description: '',
    category: '',
    tags: [],
    photoIds: [],
    status: 'draft',
    featured: false,
    contentSource: 'cms',
    author: 'Brand Anthony McDonald',
    readTime: '5 min read',
    publishDate: new Date().toISOString().split('T')[0],
    ...initialData
  })
  
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [photoPickerMode, setPhotoPickerMode] = useState<'single' | 'multiple' | 'featured'>('single')
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const cursorPositionRef = useRef<number>(0)

  // Get existing categories from static blog posts
  const existingCategories = getAllCategories()

  useEffect(() => {
    if (postId && postId !== 'new') {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    if (!postId || postId === 'new') return
    
    try {
      const response = await fetch(`/api/blog/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data.post)
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
    }
  }

  // Track cursor position in textarea
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(prev => ({ ...prev, content: e.target.value }))
    cursorPositionRef.current = e.target.selectionStart
  }, [])

  // Insert single photo at cursor position
  const handleSinglePhotoSelect = useCallback((photo: Photo) => {
    const textarea = contentTextareaRef.current
    if (!textarea || !post.content) return

    const cursorPos = cursorPositionRef.current
    const beforeCursor = post.content.substring(0, cursorPos)
    const afterCursor = post.content.substring(cursorPos)
    
    // Create markdown image syntax
    const imageMarkdown = `\n![${photo.title || 'Image'}](${photo.originalUrl} "${photo.description || ''}")\n`
    
    const newContent = beforeCursor + imageMarkdown + afterCursor
    
    setPost(prev => ({
      ...prev,
      content: newContent,
      photoIds: [...new Set([...(prev.photoIds || []), photo.id])]
    }))

    // Set cursor position after inserted image
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = cursorPos + imageMarkdown.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
        textarea.focus()
      }
    }, 0)
  }, [post.content])

  // Insert multiple photos as a gallery
  const handleMultiplePhotosSelect = useCallback((photos: Photo[]) => {
    const textarea = contentTextareaRef.current
    if (!textarea || !post.content) return

    const cursorPos = cursorPositionRef.current
    const beforeCursor = post.content.substring(0, cursorPos)
    const afterCursor = post.content.substring(cursorPos)
    
    // Create gallery HTML (will be processed by BlogContentRenderer)
    let galleryMarkdown = '\n<!-- Photo Gallery Start -->\n<div class="blog-photo-gallery">\n'
    
    photos.forEach(photo => {
      galleryMarkdown += `  <div class="gallery-item">\n`
      galleryMarkdown += `    <img src="${photo.thumbnailUrl}" alt="${photo.title || 'Gallery image'}" data-full="${photo.originalUrl}" />\n`
      if (photo.title || photo.description) {
        galleryMarkdown += `    <div class="caption">\n`
        if (photo.title) galleryMarkdown += `      <h4>${photo.title}</h4>\n`
        if (photo.description) galleryMarkdown += `      <p>${photo.description}</p>\n`
        galleryMarkdown += `    </div>\n`
      }
      galleryMarkdown += `  </div>\n`
    })
    
    galleryMarkdown += '</div>\n<!-- Photo Gallery End -->\n'
    
    const newContent = beforeCursor + galleryMarkdown + afterCursor
    
    setPost(prev => ({
      ...prev,
      content: newContent,
      photoIds: [...new Set([...(prev.photoIds || []), ...photos.map(p => p.id)])]
    }))

    // Set cursor position after gallery
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = cursorPos + galleryMarkdown.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
        textarea.focus()
      }
    }, 0)
  }, [post.content])

  // Set featured image
  const handleFeaturedImageSelect = useCallback((photo: Photo) => {
    setPost(prev => ({
      ...prev,
      featuredImage: {
        id: photo.id,
        url: photo.originalUrl,
        thumbnailUrl: photo.thumbnailUrl,
        title: photo.title,
        alt: photo.title || 'Featured image'
      },
      photoIds: [...new Set([...(prev.photoIds || []), photo.id])]
    }))
  }, [])

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }, [])

  // Save blog post
  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    setSaving(true)
    try {
      const postData = {
        ...post,
        status,
        publishDate: status === 'published' ? new Date().toISOString().split('T')[0] : post.publishDate,
        slug: post.slug || generateSlug(post.title || ''),
        updatedAt: new Date().toISOString(),
        createdAt: post.createdAt || new Date().toISOString()
      }

      const url = postId && postId !== 'new' ? `/api/blog/${postId}` : '/api/blog'
      const method = postId && postId !== 'new' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Blog post saved successfully!')
        
        // Redirect to blog admin or the post itself
        if (status === 'published') {
          router.push(`/blog/${postData.slug}`)
        } else {
          router.push('/admin/blog')
        }
      }
    } catch (error) {
      console.error('Failed to save blog post:', error)
    } finally {
      setSaving(false)
    }
  }

  const openPhotoPicker = (mode: 'single' | 'multiple' | 'featured') => {
    setPhotoPickerMode(mode)
    setShowPhotoPicker(true)
  }

  const handlePreview = () => {
    if (post.content) {
      setPreviewMode(!previewMode)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {postId && postId !== 'new' ? 'Edit Blog Post' : 'New Blog Post'}
          </h1>
          <p className="text-gray-600">
            Create and manage blog posts with photos from your library
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            disabled={!post.content}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            <CloudArrowUpIcon className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving || !post.title || !post.content}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Featured Image</h2>
              <button
                onClick={() => openPhotoPicker('featured')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {post.featuredImage ? 'Change Image' : 'Select Image'}
              </button>
            </div>
            
            {post.featuredImage ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={post.featuredImage.thumbnailUrl}
                  alt={post.featuredImage.alt || 'Featured image'}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPost(prev => ({ ...prev, featuredImage: undefined }))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No featured image selected</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Content</h2>
              
              {/* Photo Insertion Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => openPhotoPicker('single')}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  title="Insert single photo"
                >
                  <PhotoIcon className="w-4 h-4" />
                  Add Photo
                </button>
                <button
                  onClick={() => openPhotoPicker('multiple')}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  title="Insert photo gallery"
                >
                  <RectangleGroupIcon className="w-4 h-4" />
                  Add Gallery
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="border border-gray-300 rounded-md p-4 min-h-96 prose max-w-none">
                {/* This would use your BlogContentRenderer component */}
                <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br>') || '' }} />
              </div>
            ) : (
              <textarea
                ref={contentTextareaRef}
                value={post.content || ''}
                onChange={handleContentChange}
                onSelect={(e) => {
                  cursorPositionRef.current = e.currentTarget.selectionStart
                }}
                rows={20}
                className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm resize-y"
                placeholder="Write your blog post content here...

You can write in Markdown format. Use the buttons above to insert photos from your library.

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2"
              />
            )}

            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Tips:</p>
              <ul className="space-y-1">
                <li>• Position your cursor where you want to insert a photo, then click "Add Photo"</li>
                <li>• Use "Add Gallery" to insert multiple photos as a grid</li>
                <li>• All inserted photos are automatically tracked for usage</li>
                <li>• Use the Preview button to see how your content will look</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Post Info */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 className="text-lg font-semibold">Post Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={post.title || ''}
                onChange={(e) => {
                  setPost(prev => ({ 
                    ...prev, 
                    title: e.target.value,
                    slug: prev.slug || generateSlug(e.target.value)
                  }))
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter your blog post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={post.slug || ''}
                onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
                placeholder="blog-post-url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={post.excerpt || ''}
                onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Brief description of your post..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={post.description || ''}
                onChange={(e) => setPost(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="SEO description..."
              />
            </div>
          </div>

          {/* Category and Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 className="text-lg font-semibold">Organization</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={post.category || ''}
                onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select category</option>
                {existingCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="custom">+ Add New Category</option>
              </select>
              {post.category === 'custom' && (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"
                  placeholder="Enter new category"
                  onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={post.tags?.join(', ') || ''}
                onChange={(e) => setPost(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="photography, tutorial, tips"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={post.featured || false}
                onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded border-gray-300 mr-2"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                Featured post
              </label>
            </div>
          </div>

          {/* Publishing */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h3 className="text-lg font-semibold">Publishing</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publish Date
              </label>
              <input
                type="date"
                value={post.publishDate || ''}
                onChange={(e) => setPost(prev => ({ ...prev, publishDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={post.readTime || ''}
                onChange={(e) => setPost(prev => ({ ...prev, readTime: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="5 min read"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="text-sm">
                Current: <span className={`px-2 py-1 rounded ${
                  post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          {/* Photo Usage Summary */}
          {post.photoIds && post.photoIds.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Photos used in this post ({post.photoIds.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.photoIds.map(photoId => (
                  <span
                    key={photoId}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {photoId.substring(0, 8)}...
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Picker Modal */}
      <PhotoPicker
        isOpen={showPhotoPicker}
        onClose={() => setShowPhotoPicker(false)}
        onSelect={photoPickerMode === 'featured' ? handleFeaturedImageSelect : handleSinglePhotoSelect}
        onSelectMultiple={photoPickerMode === 'multiple' ? handleMultiplePhotosSelect : undefined}
        allowMultiple={photoPickerMode === 'multiple'}
        excludeGalleries={true} // Don't show client-only photos in blog
        filterTags={['portfolio', 'blog']} // Only show photos suitable for content
        title={photoPickerMode === 'featured' ? 'Select Featured Image' : 
               photoPickerMode === 'multiple' ? 'Select Photos for Gallery' : 'Select Photo'}
      />
    </div>
  )
}