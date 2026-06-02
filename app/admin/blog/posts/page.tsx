'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PostRow {
  id: string
  slug: string
  title: string
  category?: string
  status?: 'draft' | 'published'
  contentSource?: 'static' | 'cms'
  featured?: boolean
}

export default function MdxBlogPostsDashboard() {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'cms'>('all')

  useEffect(() => { void load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog/posts')
      if (!res.ok) throw new Error('Failed to load posts')
      const { posts } = await res.json()
      setPosts(posts)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== id))
    else alert('Delete failed')
  }

  const shown = posts.filter(p =>
    filter === 'all' ? true :
    filter === 'cms' ? p.contentSource === 'cms' :
    p.status === filter,
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog posts</h1>
          <p className="text-sm text-gray-500">Unified blog (MDX). Legacy override admin lives at <Link href="/admin/blog" className="underline">/admin/blog</Link>.</p>
        </div>
        <Link href="/admin/blog/posts/new" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
          New post
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'published', 'draft', 'cms'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm ${filter === f ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <div className="text-gray-500">Loading…</div>}
      {error && <div className="rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>}

      {!loading && !error && (
        <div className="divide-y rounded-lg border bg-white">
          {shown.map(p => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">{p.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status ?? 'draft'}</span>
                  {p.contentSource === 'static' && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">static</span>}
                  {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">featured</span>}
                </div>
                <div className="text-xs text-gray-500 truncate">/blog/{p.slug} · {p.category}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/blog/${p.slug}`} target="_blank" className="text-sm text-gray-500 hover:text-gray-700">View</Link>
                <Link href={`/admin/blog/posts/${p.id}/edit`} className="text-sm text-blue-600 hover:text-blue-800">Edit</Link>
                <button onClick={() => remove(p.id, p.title)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          ))}
          {shown.length === 0 && <div className="px-4 py-8 text-center text-gray-400 text-sm">No posts.</div>}
        </div>
      )}
    </div>
  )
}
