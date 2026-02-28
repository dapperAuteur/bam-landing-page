'use client'

import { useState, useEffect } from 'react'
import type { BlogMetadata } from '@/types/blog-admin'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showFilter, setShowFilter] = useState<'all' | 'featured' | 'hidden'>('all')
  const [editingPost, setEditingPost] = useState<BlogMetadata | null>(null)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncFromCode = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/admin/blog', { method: 'POST' })
      const data = await response.json()
      if (response.ok) {
        alert(`Synced: ${data.created} new, ${data.updated} updated (${data.total} total in code)`)
        fetchPosts()
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(false)
    }
  }

  const toggleField = async (slug: string, field: 'featured' | 'hidden', currentValue: boolean) => {
    try {
      await fetch(`/api/admin/blog/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue })
      })
      setPosts(prev => prev.map(p =>
        p.slug === slug ? { ...p, [field]: !currentValue } : p
      ))
    } catch (error) {
      console.error(`Failed to toggle ${field}:`, error)
    }
  }

  const saveEdit = async (post: BlogMetadata) => {
    try {
      await fetch(`/api/admin/blog/${encodeURIComponent(post.slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          description: post.description,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          readTime: post.readTime,
          publishDate: post.publishDate,
          featured: post.featured,
          hidden: post.hidden,
          featuredOrder: post.featuredOrder,
        })
      })
      setPosts(prev => prev.map(p => p.slug === post.slug ? post : p))
      setEditingPost(null)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const categories = Array.from(new Set(posts.map(p => p.category))).sort()

  const filteredPosts = posts.filter(post => {
    if (search && !post.title.toLowerCase().includes(search.toLowerCase()) &&
        !post.slug.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== 'all' && post.category !== categoryFilter) return false
    if (showFilter === 'featured' && !post.featured) return false
    if (showFilter === 'hidden' && !post.hidden) return false
    return true
  })

  const stats = {
    total: posts.length,
    featured: posts.filter(p => p.featured).length,
    hidden: posts.filter(p => p.hidden).length,
    categories: categories.length,
  }

  if (loading) return <div className="p-6">Loading blog posts...</div>

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage blog post metadata, featured status, and visibility</p>
        </div>
        <button
          onClick={syncFromCode}
          disabled={syncing}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : 'Sync from Code'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: stats.total, color: 'blue' },
          { label: 'Featured', value: stats.featured, color: 'green' },
          { label: 'Hidden', value: stats.hidden, color: 'red' },
          { label: 'Categories', value: stats.categories, color: 'purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          </div>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No blog metadata in database yet.</p>
          <button
            onClick={syncFromCode}
            disabled={syncing}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync from Code to Get Started'}
          </button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-[200px]"
            />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex gap-1">
              {(['all', 'featured', 'hidden'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setShowFilter(filter)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    showFilter === filter
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-white rounded-lg shadow divide-y">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No posts match your filters</div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.slug} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                      {post.hidden && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Hidden</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">{post.category}</span>
                      <span>{post.publishDate}</span>
                      <span>{post.readTime}</span>
                      <span className="text-gray-400 truncate">{post.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Featured Toggle */}
                    <button
                      onClick={() => toggleField(post.slug, 'featured', post.featured)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        post.featured
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={post.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {post.featured ? 'Featured' : 'Feature'}
                    </button>

                    {/* Hidden Toggle */}
                    <button
                      onClick={() => toggleField(post.slug, 'hidden', post.hidden)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        post.hidden
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={post.hidden ? 'Show post' : 'Hide post'}
                    >
                      {post.hidden ? 'Hidden' : 'Hide'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditingPost({ ...post })}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>

                    {/* View */}
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <EditModal
          post={editingPost}
          categories={categories}
          onSave={saveEdit}
          onCancel={() => setEditingPost(null)}
        />
      )}
    </div>
  )
}

function EditModal({
  post,
  categories,
  onSave,
  onCancel,
}: {
  post: BlogMetadata
  categories: string[]
  onSave: (post: BlogMetadata) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(post)
  const [tagsInput, setTagsInput] = useState(post.tags.join(', '))

  const handleSave = () => {
    onSave({
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Blog Post</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                list="categories"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <datalist id="categories">
                {categories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
              <input
                type="text"
                value={form.readTime}
                onChange={e => setForm({ ...form, readTime: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
              <input
                type="date"
                value={form.publishDate}
                onChange={e => setForm({ ...form, publishDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Order</label>
              <input
                type="number"
                value={form.featuredOrder}
                onChange={e => setForm({ ...form, featuredOrder: parseInt(e.target.value) || 999 })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Lower number = shown first among featured posts</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={e => setForm({ ...form, hidden: e.target.checked })}
                className="rounded"
              />
              Hidden
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
