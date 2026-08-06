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
  // Position in the featured rail. null = no order chosen (sorts after
  // ordered posts, newest first). 999 is the legacy "unset" sentinel and is
  // treated the same as null.
  featuredOrder?: number | null
}

// Lightweight fuzzy matcher — case-insensitive subsequence with bonuses for
// consecutive runs and word-boundary starts. Returns null when the query's
// characters don't all appear in order. No external dependency.
function fuzzyScore(query: string, text: string): number | null {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (!q) return 0
  let score = 0
  let ti = 0
  let prevMatched = false
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi]
    let found = -1
    for (let i = ti; i < t.length; i++) {
      if (t[i] === ch) { found = i; break }
    }
    if (found === -1) return null
    score += 1
    if (prevMatched && found === ti) score += 4 // consecutive run
    if (found === 0 || /[\s\-/_.]/.test(t[found - 1])) score += 3 // word boundary
    ti = found + 1
    prevMatched = true
  }
  return score
}

export default function MdxBlogPostsDashboard() {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'cms'>('all')
  const [query, setQuery] = useState('')

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

  // Inline featured-rail ordering: commit on blur / Enter. Blank clears the
  // order (the post falls back to the newest-first tail of the rail).
  async function saveOrder(id: string, value: string) {
    const trimmed = value.trim()
    const parsed = trimmed === '' ? null : Number.parseInt(trimmed, 10)
    const order = parsed !== null && Number.isNaN(parsed) ? null : parsed
    const prev = posts.find(p => p.id === id)?.featuredOrder ?? null
    if (order === prev) return
    setPosts(ps => ps.map(p => (p.id === id ? { ...p, featuredOrder: order } : p)))
    const res = await fetch(`/api/admin/blog/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featuredOrder: order }),
    })
    if (!res.ok) {
      setPosts(ps => ps.map(p => (p.id === id ? { ...p, featuredOrder: prev } : p)))
      alert('Saving the featured order failed')
    }
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== id))
    else alert('Delete failed')
  }

  const byStatus = posts.filter(p =>
    filter === 'all' ? true :
    filter === 'cms' ? p.contentSource === 'cms' :
    p.status === filter,
  )

  // Fuzzy-rank by query across title, slug, and category; best field score wins.
  const q = query.trim()
  const shown = !q
    ? byStatus
    : byStatus
        .map(p => {
          const scores = [
            fuzzyScore(q, p.title),
            fuzzyScore(q, p.slug),
            p.category ? fuzzyScore(q, p.category) : null,
          ].filter((s): s is number => s !== null)
          return { p, score: scores.length ? Math.max(...scores) : null }
        })
        .filter((r): r is { p: PostRow; score: number } => r.score !== null)
        .sort((a, b) => b.score - a.score)
        .map(r => r.p)

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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex gap-2">
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
        <div className="relative sm:ml-auto w-full sm:w-72">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Fuzzy search title, slug, category…"
            aria-label="Search posts"
            className="w-full rounded-md border border-gray-300 pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>
      {!loading && !error && (
        <p className="text-xs text-gray-400 mb-2">
          {shown.length} {shown.length === 1 ? 'post' : 'posts'}{query ? ` matching “${query}”` : ''}
        </p>
      )}

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
                  {p.featured && (
                    <label className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="sr-only">Featured order for {p.title}</span>
                      <input
                        type="number"
                        min={1}
                        placeholder="order"
                        title="Featured rail position (1 = first). Leave blank for no chosen order."
                        defaultValue={p.featuredOrder == null || p.featuredOrder === 999 ? '' : p.featuredOrder}
                        onBlur={e => void saveOrder(p.id, e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                        className="w-16 rounded-md border border-gray-300 px-2 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                  )}
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
