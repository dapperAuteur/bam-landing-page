'use client'

import { useState, useEffect } from 'react'
import type { ClientProject, ProposalStatus } from '@/types/client-portal'
import type { ClientMedia, MediaType } from '@/types/client-gallery'
import AccessCodeForm from '@/components/client-gallery/AccessCodeForm'
import MediaCard from '@/components/client-gallery/MediaCard'
import MediaFilter from '@/components/client-gallery/MediaFilter'
import Lightbox from '@/components/client-gallery/Lightbox'

const STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: 'Draft', sent: 'Sent', viewed: 'Viewed',
  approved: 'Approved', rejected: 'Declined', revised: 'Revision Requested'
}

export default function ClientPortalPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ClientProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ClientMedia | null>(null)
  const [activeFilter, setActiveFilter] = useState<MediaType | 'all'>('all')
  const [respondNote, setRespondNote] = useState('')
  const [responding, setResponding] = useState(false)

  useEffect(() => { fetchProject() }, [params.projectId])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/client-portal/${params.projectId}`)
      if (!response.ok) {
        if (response.status === 410) setError('This project link has expired')
        else if (response.status === 404) setError('Project not found')
        else setError('Failed to load project')
        return
      }
      const data = await response.json()
      setProject(data.project)
      setAuthenticated(data.authenticated)
    } catch {
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleAuthenticate = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/client-portal/${params.projectId}/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: code })
      })
      if (response.ok) {
        const data = await response.json()
        setProject(data.project)
        setAuthenticated(true)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const handleRespond = async (status: 'approved' | 'rejected' | 'revised') => {
    setResponding(true)
    try {
      const response = await fetch(`/api/client-portal/${params.projectId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: respondNote })
      })
      if (response.ok) {
        setProject(prev => prev ? { ...prev, status } : null)
        setRespondNote('')
      }
    } catch {
      setError('Failed to submit response')
    } finally {
      setResponding(false)
    }
  }

  const handleDownload = async (item: ClientMedia) => {
    // Use the gallery download endpoint pattern
    try {
      const response = await fetch(item.originalUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = item.title || 'download'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      setError('Download failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto" role="status">
            <span className="sr-only">Loading</span>
          </div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4" role="alert">{error}</p>
          <button onClick={() => { setError(null); fetchProject() }} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!project) return null

  if (project.settings?.requirePassword && !authenticated) {
    return (
      <AccessCodeForm
        eventName={project.projectName}
        clientName={project.clientName}
        onAuthenticate={handleAuthenticate}
      />
    )
  }

  const brandColor = project.settings?.brandColor || '#2563eb'
  const proposal = project.proposal
  const media = project.media || []
  const filteredMedia = activeFilter === 'all' ? media : media.filter(m => (m.mediaType || 'image') === activeFilter)

  return (
    <div className="min-h-screen bg-gray-50" style={{ '--brand-color': brandColor } as React.CSSProperties}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4" style={{ borderBottomColor: brandColor }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {project.settings?.companyName && (
            <p className="text-sm font-medium mb-2" style={{ color: brandColor }}>
              {project.settings.companyName}
            </p>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{project.projectName}</h1>
          <p className="text-gray-600 mt-1">Prepared for {project.clientName}</p>
          {project.description && (
            <p className="text-gray-700 mt-3">{project.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Cover Letter */}
        {proposal?.coverLetter?.content && (
          <ProposalSection title="Cover Letter" content={proposal.coverLetter.content} brandColor={brandColor} />
        )}

        {/* Scope of Work */}
        {proposal?.scopeOfWork?.content && (
          <ProposalSection title="Scope of Work" content={proposal.scopeOfWork.content} brandColor={brandColor} />
        )}

        {/* Deliverables */}
        {proposal?.deliverables && proposal.deliverables.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderBottomColor: brandColor }}>
              Deliverables
            </h2>
            <div className="space-y-3">
              {proposal.deliverables.map((d) => (
                <div key={d.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5" style={{ borderColor: brandColor }}>
                    {d.status === 'completed' || d.status === 'delivered' ? (
                      <svg className="w-full h-full p-0.5" style={{ color: brandColor }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : null}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{d.name}</p>
                    {d.description && <p className="text-sm text-gray-600 mt-1">{d.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing */}
        {project.settings?.showPricing && proposal?.pricing && proposal.pricing.lineItems.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderBottomColor: brandColor }}>
              Pricing
            </h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm text-gray-600">Description</th>
                  <th className="text-right py-2 text-sm text-gray-600 w-20">Qty</th>
                  <th className="text-right py-2 text-sm text-gray-600 w-28">Price</th>
                  <th className="text-right py-2 text-sm text-gray-600 w-28">Total</th>
                </tr>
              </thead>
              <tbody>
                {proposal.pricing.lineItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-bold py-3">Total</td>
                  <td className="text-right font-bold py-3 text-lg" style={{ color: brandColor }}>
                    ${proposal.pricing.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
            {proposal.pricing.notes && (
              <p className="text-sm text-gray-500 mt-3">{proposal.pricing.notes}</p>
            )}
          </section>
        )}

        {/* Timeline */}
        {project.settings?.showTimeline && proposal?.timeline && proposal.timeline.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderBottomColor: brandColor }}>
              Timeline
            </h2>
            <div className="space-y-4">
              {proposal.timeline.map((phase) => (
                <div key={phase.id} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{
                    backgroundColor: phase.status === 'completed' ? brandColor : phase.status === 'active' ? '#fbbf24' : '#d1d5db'
                  }} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{phase.phase}</p>
                    {phase.description && <p className="text-sm text-gray-600">{phase.description}</p>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media Gallery */}
        {media.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderBottomColor: brandColor }}>
              Media
            </h2>
            <MediaFilter media={media} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  allowDownloads={project.settings?.allowDownloads || false}
                  onSelect={setSelectedItem}
                  onDownload={handleDownload}
                  onToggleFavorite={() => {}}
                />
              ))}
            </div>
          </section>
        )}

        {/* Terms */}
        {proposal?.terms?.content && (
          <ProposalSection title="Terms & Conditions" content={proposal.terms.content} brandColor={brandColor} />
        )}

        {/* Approval Section */}
        {project.settings?.allowApproval && !['approved', 'rejected'].includes(project.status) && (
          <section className="bg-white rounded-lg shadow-sm p-6 border-2" style={{ borderColor: brandColor }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Response</h2>
            <textarea
              value={respondNote}
              onChange={(e) => setRespondNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              rows={3}
              placeholder="Add a note (optional)..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleRespond('approved')}
                disabled={responding}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                Approve Proposal
              </button>
              <button
                onClick={() => handleRespond('revised')}
                disabled={responding}
                className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
              >
                Request Revision
              </button>
              <button
                onClick={() => handleRespond('rejected')}
                disabled={responding}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                Decline
              </button>
            </div>
          </section>
        )}

        {/* Status Banner */}
        {['approved', 'rejected'].includes(project.status) && (
          <div className={`p-4 rounded-lg text-center ${
            project.status === 'approved' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p className="text-lg font-medium">
              This proposal has been {STATUS_LABELS[project.status]?.toLowerCase()}.
            </p>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {selectedItem && (
        <Lightbox
          item={selectedItem}
          allowDownloads={project.settings?.allowDownloads || false}
          onClose={() => setSelectedItem(null)}
          onDownload={handleDownload}
          onToggleFavorite={() => {}}
          onAddComment={() => {}}
        />
      )}
    </div>
  )
}

function ProposalSection({ title, content, brandColor }: { title: string; content: string; brandColor: string }) {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2" style={{ borderBottomColor: brandColor }}>
        {title}
      </h2>
      <div className="prose prose-gray max-w-none whitespace-pre-wrap">
        {content}
      </div>
    </section>
  )
}
