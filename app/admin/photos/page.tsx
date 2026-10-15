'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { describePhotoUsage } from '@/lib/photos/usage'
import type { Photo, PhotoCategory } from '@/types/photo'

const CATEGORIES: PhotoCategory[] = ['sports', 'events', 'portraits', 'products', 'other']
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<PhotoCategory | 'all'>('all')
  const [notice, setNotice] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [recounting, setRecounting] = useState(false)

  // upload form state
  const [category, setCategory] = useState<PhotoCategory>('other')
  const [tags, setTags] = useState('')
  const [portfolio, setPortfolio] = useState(false)

  useEffect(() => { void load() }, [filter])

  async function load() {
    setLoading(true)
    try {
      const qs = filter === 'all' ? '' : `?category=${filter}`
      const res = await fetch(`/api/photos${qs}`)
      if (!res.ok) throw new Error('Failed to load photos')
      const data = await res.json()
      setPhotos(data.photos ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load photos')
    } finally {
      setLoading(false)
    }
  }

  async function upload(files: FileList) {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append('files', f))
      fd.append('category', category)
      fd.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)))
      fd.append('portfolio', String(portfolio))
      const res = await fetch('/api/photos', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function remove(id: string) {
    setConfirmingId(null)
    setError(null)
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPhotos(prev => prev.filter(p => p.id !== id))
      return
    }
    // A 409 names the posts and galleries still using the photo.
    const data = await res.json().catch(() => ({}))
    setError(typeof data.error === 'string' ? data.error : 'Delete failed')
  }

  // Rebuild every card's usage from the posts and galleries themselves.
  async function recount() {
    setRecounting(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/photos/usage', { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Recount failed')
      const fixed =
        data.changed === 0 ? 'Every count was already right.' : `Fixed ${data.changed} count${data.changed === 1 ? '' : 's'}.`
      setNotice(`Checked ${data.photos} photos: ${data.blogLinks} blog uses, ${data.galleryLinks} gallery uses. ${fixed}`)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Recount failed')
    } finally {
      setRecounting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Photo Library</h1>
      <p className="text-sm text-gray-500 mb-6">
        Central library: reuse photos across galleries, the blog, and the portfolio. Each card says where its photo is
        used, and a photo still in use can&apos;t be deleted.
      </p>

      {/* Upload */}
      <div className="rounded-lg border bg-white p-4 mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as PhotoCategory)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="wedding, outdoor" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
            <input type="checkbox" checked={portfolio} onChange={e => setPortfolio(e.target.checked)} />
            Show in portfolio
          </label>
          <label className={`px-4 py-2 rounded-md text-white cursor-pointer ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {uploading ? 'Uploading…' : 'Upload photos'}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={e => e.target.files && e.target.files.length > 0 && upload(e.target.files)}
            />
          </label>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', ...CATEGORIES] as const).map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1 rounded-full text-sm ${filter === c ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>{c}</button>
        ))}
        <button
          type="button"
          onClick={recount}
          disabled={recounting}
          className={`ml-auto min-h-11 px-3 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60 ${FOCUS}`}
        >
          {recounting ? 'Recounting…' : 'Recount usage'}
        </button>
      </div>

      {error && <div role="alert" className="rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm mb-4">{error}</div>}
      <div role="status" aria-live="polite">
        {notice && <p className="rounded-md bg-green-50 text-green-800 px-4 py-2 text-sm mb-4">{notice}</p>}
      </div>
      {loading ? (
        <p role="status" className="text-gray-500">Loading…</p>
      ) : photos.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No photos yet. Upload some above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map(p => {
            const usage = describePhotoUsage(p.usedIn)
            const name = p.title || 'photo'
            return (
              <div key={p.id} className="relative group rounded-lg overflow-hidden bg-gray-200 aspect-square">
                <Image src={p.thumbnailUrl} alt={p.alt || p.title || 'photo'} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded">{p.category}</span>
                  {p.usedIn?.portfolio && <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded">portfolio</span>}
                </div>
                {confirmingId === p.id ? (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className={`min-h-11 px-3 rounded bg-red-600 text-white text-xs ${FOCUS}`}
                    >
                      Delete for good
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      className={`min-h-11 px-3 rounded bg-white text-gray-900 text-xs ${FOCUS}`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Always visible on touch screens; on wider screens it shows on hover or keyboard focus.
                  <button
                    type="button"
                    onClick={() => setConfirmingId(p.id)}
                    aria-label={`Delete ${name}`}
                    className={`absolute top-2 right-2 min-h-11 px-3 rounded bg-red-600 text-white text-xs transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 ${FOCUS}`}
                  >
                    Delete
                  </button>
                )}
                <p
                  className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-2 py-1 text-xs text-white"
                  title={usage.blogs.length > 0 ? `Posts: ${usage.blogs.join(', ')}` : undefined}
                >
                  {usage.summary}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
