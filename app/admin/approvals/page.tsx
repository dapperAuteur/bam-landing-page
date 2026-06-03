'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ClientGallery, ClientMedia } from '@/types/client-gallery'

type StatusFilter = 'all' | 'approved' | 'rejected' | 'pending'

function statusOf(p: ClientMedia): Exclude<StatusFilter, 'all'> {
  return p.approvalStatus === 'approved' || p.approvalStatus === 'rejected' ? p.approvalStatus : 'pending'
}

export default function AdminApprovalsPage() {
  const [galleries, setGalleries] = useState<ClientGallery[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/galleries')
        if (res.ok) {
          const data = await res.json()
          setGalleries((data.galleries ?? []).filter((g: ClientGallery) => g.settings?.allowApprovals))
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const totals = useMemo(() => {
    let approved = 0, rejected = 0, pending = 0
    for (const g of galleries) for (const p of g.photos ?? []) {
      const s = statusOf(p)
      if (s === 'approved') approved++; else if (s === 'rejected') rejected++; else pending++
    }
    return { approved, rejected, pending }
  }, [galleries])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Photo Approvals</h1>
      <p className="text-sm text-gray-500 mb-4">What clients have approved or rejected across approval-enabled galleries.</p>

      <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">✅ {totals.approved} approved</span>
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-800">❌ {totals.rejected} rejected</span>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">⏳ {totals.pending} pending</span>
        <span className="ml-auto" />
        {(['all', 'approved', 'rejected', 'pending'] as StatusFilter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full ${filter === f ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : galleries.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No galleries have approvals enabled yet. Turn on "Let Client Approve/Reject Photos" on a gallery.</p>
      ) : (
        <div className="space-y-8">
          {galleries.map(g => {
            const photos = (g.photos ?? []).filter(p => filter === 'all' || statusOf(p) === filter)
            if (photos.length === 0) return null
            return (
              <section key={g.galleryId}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">{g.eventName}</h2>
                    <p className="text-xs text-gray-500">{g.clientName} · {g.clientEmail}</p>
                  </div>
                  <Link href={`/client-gallery/${g.galleryId}`} target="_blank" className="text-sm text-blue-600 hover:text-blue-800">Open gallery →</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map(p => {
                    const s = statusOf(p)
                    return (
                      <div key={p.id} className="rounded-lg border bg-white overflow-hidden">
                        <div className="relative aspect-square bg-gray-200">
                          <Image src={p.thumbnailUrl} alt={p.title || 'photo'} fill className="object-cover" />
                          <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded text-white ${s === 'approved' ? 'bg-green-600' : s === 'rejected' ? 'bg-red-600' : 'bg-gray-500'}`}>
                            {s === 'approved' ? '✅ Approved' : s === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                          </span>
                        </div>
                        <div className="p-2 text-xs text-gray-600">
                          {p.approvedBy ? <p className="truncate">by <span className="font-medium text-gray-800">{p.approvedBy}</span></p> : s !== 'pending' && <p className="text-gray-400">by (anonymous)</p>}
                          {p.approvedAt && <p className="text-gray-400">{new Date(p.approvedAt).toLocaleString()}</p>}
                          {p.comments && p.comments.length > 0 && (
                            <p className="mt-1 text-gray-700">💬 {p.comments.length}: <span className="italic">{p.comments[p.comments.length - 1].text}</span></p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
