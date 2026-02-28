'use client'

import { useState, useEffect } from 'react'
import type { ClientProject, ProposalContent, PricingLineItem, TimelineItem, DeliverableItem } from '@/types/client-portal'

export default function AdminProjectEditorPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ClientProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'proposal' | 'media' | 'settings'>('proposal')

  useEffect(() => { fetchProject() }, [params.projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${params.projectId}`)
      const data = await response.json()
      setProject(data.project)
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProposal = async (proposal: ProposalContent) => {
    setSaving(true)
    try {
      await fetch(`/api/admin/projects/${params.projectId}/proposal`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal)
      })
      setProject(prev => prev ? { ...prev, proposal } : null)
    } finally {
      setSaving(false)
    }
  }

  const handleMediaUpload = async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('media', file))

    try {
      const response = await fetch(`/api/admin/projects/${params.projectId}/media`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) fetchProject()
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  if (loading) return <div className="p-6">Loading project...</div>
  if (!project) return <div className="p-6 text-red-600">Project not found.</div>

  const proposal = project.proposal || {
    coverLetter: { title: 'Cover Letter', content: '', order: 0 },
    scopeOfWork: { title: 'Scope of Work', content: '', order: 1 },
    deliverables: [],
    pricing: { lineItems: [], subtotal: 0, total: 0, currency: 'USD' },
    timeline: [],
    terms: { title: 'Terms & Conditions', content: '', order: 5 },
    customSections: []
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.projectName}</h1>
          <p className="text-gray-600">{project.clientName} &bull; {project.clientEmail}</p>
        </div>
        <div className="flex gap-2">
          <a href={`/admin/projects/${project.projectId}/analytics`} className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200">
            Analytics
          </a>
          <a href={`/portal/${project.projectId}`} target="_blank" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Preview Portal
          </a>
          <a href="/admin/projects" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Back to Projects
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(['proposal', 'media', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Proposal Tab */}
      {activeTab === 'proposal' && (
        <ProposalEditor proposal={proposal} onSave={saveProposal} saving={saving} />
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="media-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload Media</label>
            <input
              id="media-upload"
              type="file"
              multiple
              accept="image/*,video/*,application/pdf,.pptx,.docx"
              onChange={(e) => e.target.files && handleMediaUpload(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {project.media?.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {project.media.map((item) => (
                <div key={item.id} className="relative bg-gray-100 rounded-lg p-2">
                  {item.mediaType === 'document' ? (
                    <div className="h-24 flex items-center justify-center">
                      <span className="text-xs text-gray-500 uppercase">{item.metadata?.format || 'doc'}</span>
                    </div>
                  ) : (
                    <img src={item.thumbnailUrl} alt={item.title || ''} className="h-24 w-full object-cover rounded" />
                  )}
                  <p className="text-xs text-gray-600 mt-1 truncate">{item.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No media uploaded yet.</p>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <SettingsEditor project={project} onSave={fetchProject} />
      )}
    </div>
  )
}

function ProposalEditor({ proposal, onSave, saving }: { proposal: ProposalContent; onSave: (p: ProposalContent) => void; saving: boolean }) {
  const [draft, setDraft] = useState(proposal)

  const updateSection = (key: 'coverLetter' | 'scopeOfWork' | 'terms', content: string) => {
    setDraft(prev => ({
      ...prev,
      [key]: { ...prev[key], content }
    }))
  }

  const addLineItem = () => {
    const item: PricingLineItem = { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0 }
    const lineItems = [...(draft.pricing?.lineItems || []), item]
    const subtotal = lineItems.reduce((sum, i) => sum + i.total, 0)
    setDraft(prev => ({ ...prev, pricing: { ...prev.pricing!, lineItems, subtotal, total: subtotal } }))
  }

  const updateLineItem = (id: string, field: string, value: any) => {
    const lineItems = (draft.pricing?.lineItems || []).map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: value }
      if (field === 'quantity' || field === 'unitPrice') {
        updated.total = updated.quantity * updated.unitPrice
      }
      return updated
    })
    const subtotal = lineItems.reduce((sum, i) => sum + i.total, 0)
    setDraft(prev => ({ ...prev, pricing: { ...prev.pricing!, lineItems, subtotal, total: subtotal } }))
  }

  const removeLineItem = (id: string) => {
    const lineItems = (draft.pricing?.lineItems || []).filter(i => i.id !== id)
    const subtotal = lineItems.reduce((sum, i) => sum + i.total, 0)
    setDraft(prev => ({ ...prev, pricing: { ...prev.pricing!, lineItems, subtotal, total: subtotal } }))
  }

  const addTimelinePhase = () => {
    const item: TimelineItem = {
      id: Date.now().toString(),
      phase: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'upcoming'
    }
    setDraft(prev => ({ ...prev, timeline: [...(prev.timeline || []), item] }))
  }

  const addDeliverable = () => {
    const item: DeliverableItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      status: 'pending'
    }
    setDraft(prev => ({ ...prev, deliverables: [...(prev.deliverables || []), item] }))
  }

  return (
    <div className="space-y-8">
      {/* Cover Letter */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
        <textarea
          value={draft.coverLetter?.content || ''}
          onChange={(e) => updateSection('coverLetter', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
          rows={6}
          placeholder="Write your cover letter in markdown..."
        />
      </section>

      {/* Scope of Work */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Scope of Work</h3>
        <textarea
          value={draft.scopeOfWork?.content || ''}
          onChange={(e) => updateSection('scopeOfWork', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
          rows={8}
          placeholder="Define the scope of work in markdown..."
        />
      </section>

      {/* Deliverables */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Deliverables</h3>
          <button onClick={addDeliverable} className="text-sm text-blue-600 hover:text-blue-700">+ Add Deliverable</button>
        </div>
        {(draft.deliverables || []).map((d, i) => (
          <div key={d.id} className="flex gap-3 mb-2 items-start">
            <input
              type="text"
              value={d.name}
              onChange={(e) => {
                const items = [...(draft.deliverables || [])]
                items[i] = { ...items[i], name: e.target.value }
                setDraft(prev => ({ ...prev, deliverables: items }))
              }}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Deliverable name"
            />
            <input
              type="text"
              value={d.description}
              onChange={(e) => {
                const items = [...(draft.deliverables || [])]
                items[i] = { ...items[i], description: e.target.value }
                setDraft(prev => ({ ...prev, deliverables: items }))
              }}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Description"
            />
            <button
              onClick={() => setDraft(prev => ({ ...prev, deliverables: prev.deliverables?.filter(x => x.id !== d.id) }))}
              className="text-red-500 hover:text-red-700 px-2"
            >
              &times;
            </button>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Pricing</h3>
          <button onClick={addLineItem} className="text-sm text-blue-600 hover:text-blue-700">+ Add Line Item</button>
        </div>
        <div className="space-y-2">
          {(draft.pricing?.lineItems || []).map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Description"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm"
                min="0"
              />
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                className="w-28 border border-gray-300 rounded-md px-3 py-2 text-sm"
                min="0"
                step="0.01"
                placeholder="Price"
              />
              <span className="text-sm font-medium w-24 text-right">${item.total.toFixed(2)}</span>
              <button onClick={() => removeLineItem(item.id)} className="text-red-500 hover:text-red-700">&times;</button>
            </div>
          ))}
          {(draft.pricing?.lineItems?.length || 0) > 0 && (
            <div className="flex justify-end border-t pt-2 mt-2">
              <span className="text-lg font-bold">Total: ${draft.pricing?.total?.toFixed(2) || '0.00'}</span>
            </div>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Timeline</h3>
          <button onClick={addTimelinePhase} className="text-sm text-blue-600 hover:text-blue-700">+ Add Phase</button>
        </div>
        {(draft.timeline || []).map((phase, i) => (
          <div key={phase.id} className="flex gap-3 mb-2 items-center">
            <input
              type="text"
              value={phase.phase}
              onChange={(e) => {
                const items = [...(draft.timeline || [])]
                items[i] = { ...items[i], phase: e.target.value }
                setDraft(prev => ({ ...prev, timeline: items }))
              }}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Phase name"
            />
            <input
              type="date"
              value={phase.startDate}
              onChange={(e) => {
                const items = [...(draft.timeline || [])]
                items[i] = { ...items[i], startDate: e.target.value }
                setDraft(prev => ({ ...prev, timeline: items }))
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={phase.endDate}
              onChange={(e) => {
                const items = [...(draft.timeline || [])]
                items[i] = { ...items[i], endDate: e.target.value }
                setDraft(prev => ({ ...prev, timeline: items }))
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button
              onClick={() => setDraft(prev => ({ ...prev, timeline: prev.timeline?.filter(x => x.id !== phase.id) }))}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </section>

      {/* Terms */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
        <textarea
          value={draft.terms?.content || ''}
          onChange={(e) => updateSection('terms', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
          rows={6}
          placeholder="Terms and conditions in markdown..."
        />
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={() => onSave(draft)}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Proposal'}
        </button>
      </div>
    </div>
  )
}

function SettingsEditor({ project, onSave }: { project: ClientProject; onSave: () => void }) {
  const [settings, setSettings] = useState(project.settings)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/projects/${project.projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })
      onSave()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'allowDownloads', label: 'Allow Downloads' },
          { key: 'allowComments', label: 'Allow Comments' },
          { key: 'allowApproval', label: 'Allow Client Approval' },
          { key: 'showPricing', label: 'Show Pricing' },
          { key: 'showTimeline', label: 'Show Timeline' },
          { key: 'requirePassword', label: 'Require Password' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center">
            <input
              type="checkbox"
              checked={(settings as any)[key] || false}
              onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
              className="rounded border-gray-300 mr-2"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="brandColor" className="block text-sm font-medium text-gray-700 mb-1">Brand Color</label>
          <input
            id="brandColor"
            type="color"
            value={settings.brandColor || '#2563eb'}
            onChange={(e) => setSettings(prev => ({ ...prev, brandColor: e.target.value }))}
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            id="companyName"
            type="text"
            value={settings.companyName || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="BAM Consulting"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
