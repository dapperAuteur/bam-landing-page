'use client'

import { useState, useEffect } from 'react'
import type { ClientProject, ServiceCategory, ProposalStatus } from '@/types/client-portal'

const SERVICE_LABELS: Record<ServiceCategory, string> = {
  'voiceover': 'Voiceover',
  'ai-consulting': 'AI Consulting',
  'business-consulting': 'Business Consulting',
  'sports-photography': 'Sports Photography',
  'photography': 'Photography',
  'content-creation': 'Content Creation',
  'dev-relations': 'Dev Relations',
  'combination': 'Combination'
}

const STATUS_COLORS: Record<ProposalStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  revised: 'bg-purple-100 text-purple-800'
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ClientProject[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchProjects()
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, { method: 'DELETE' })
      if (response.ok) fetchProjects()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleStatusUpdate = async (projectId: string, status: ProposalStatus) => {
    try {
      await fetch(`/api/admin/projects/${projectId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchProjects()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (loading) return <div className="p-6">Loading projects...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Client Projects</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Project
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <CreateProjectForm
              onSave={handleCreate}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      {/* Status Pipeline */}
      <div className="flex gap-2 text-sm">
        {(['draft', 'sent', 'viewed', 'approved', 'rejected'] as ProposalStatus[]).map(status => {
          const count = projects.filter(p => p.status === status).length
          return (
            <span key={status} className={`px-3 py-1 rounded-full ${STATUS_COLORS[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
            </span>
          )
        })}
      </div>

      {/* Projects List */}
      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.projectId} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold">{project.projectName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[project.status]}`}>
                    {project.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {SERVICE_LABELS[project.serviceCategory] || project.serviceCategory}
                  </span>
                </div>
                <p className="text-gray-600">{project.clientName} &bull; {project.clientEmail}</p>
                {project.description && (
                  <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                  {project.media?.length > 0 && ` • ${project.media.length} media files`}
                </p>

                {/* Status Actions */}
                {project.status === 'draft' && (
                  <button
                    onClick={() => handleStatusUpdate(project.projectId, 'sent')}
                    className="mt-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mark as Sent
                  </button>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(`/portal/${project.projectId}`, '_blank')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Preview
                </button>
                <a
                  href={`/admin/projects/${project.projectId}`}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(project.projectId)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects created yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Create your first project
          </button>
        </div>
      )}
    </div>
  )
}

function CreateProjectForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectName: '',
    description: '',
    serviceCategory: 'combination' as ServiceCategory,
    type: 'proposal' as const,
    accessCode: '',
    brandColor: '#2563eb'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
          <input
            id="clientName"
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
          <input
            id="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
        <input
          id="projectName"
          type="text"
          value={formData.projectName}
          onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
          <select
            id="serviceCategory"
            value={formData.serviceCategory}
            onChange={(e) => setFormData(prev => ({ ...prev, serviceCategory: e.target.value as ServiceCategory }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            {Object.entries(SERVICE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
          <select
            id="projectType"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="proposal">Proposal</option>
            <option value="gallery">Gallery</option>
            <option value="deliverable">Deliverable</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">Access Code (Optional)</label>
          <input
            id="accessCode"
            type="text"
            value={formData.accessCode}
            onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Leave empty for no password"
          />
        </div>
        <div>
          <label htmlFor="brandColor" className="block text-sm font-medium text-gray-700 mb-1">Brand Color</label>
          <input
            id="brandColor"
            type="color"
            value={formData.brandColor}
            onChange={(e) => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Create Project
        </button>
      </div>
    </form>
  )
}
