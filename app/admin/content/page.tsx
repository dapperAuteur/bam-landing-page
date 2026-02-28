'use client'

import { useState, useEffect } from 'react'
import type { ContentMetadata } from '@/types/blog-admin'

type ContentType = 'project' | 'experience' | 'skill'

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('project')
  const [items, setItems] = useState<ContentMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentMetadata | null>(null)

  useEffect(() => {
    fetchItems(activeTab)
  }, [activeTab])

  const fetchItems = async (type: ContentType) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/content?type=${type}`)
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncFromCode = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab })
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Synced ${activeTab}s: ${data.created} new, ${data.updated} updated (${data.total} total in code)`)
        fetchItems(activeTab)
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(false)
    }
  }

  const toggleField = async (contentId: string, field: 'featured' | 'hidden', currentValue: boolean) => {
    try {
      await fetch(`/api/admin/content/${encodeURIComponent(contentId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue })
      })
      setItems(prev => prev.map(item =>
        item.contentId === contentId ? { ...item, [field]: !currentValue } : item
      ))
    } catch (error) {
      console.error(`Failed to toggle ${field}:`, error)
    }
  }

  const saveEdit = async (item: ContentMetadata) => {
    try {
      await fetch(`/api/admin/content/${encodeURIComponent(item.contentId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          featured: item.featured,
          hidden: item.hidden,
          displayOrder: item.displayOrder,
          data: item.data,
        })
      })
      setItems(prev => prev.map(i => i.contentId === item.contentId ? item : i))
      setEditingItem(null)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const stats = {
    total: items.length,
    featured: items.filter(i => i.featured).length,
    hidden: items.filter(i => i.hidden).length,
  }

  const tabLabels: Record<ContentType, string> = {
    project: 'Projects',
    experience: 'Experience',
    skill: 'Skills',
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage portfolio projects, experience, and skills</p>
        </div>
        <button
          onClick={syncFromCode}
          disabled={syncing}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : `Sync ${tabLabels[activeTab]} from Code`}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(Object.entries(tabLabels) as [ContentType, string][]).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === type
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total {tabLabels[activeTab]}</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Featured</p>
          <p className="text-2xl font-bold text-green-600">{stats.featured}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Hidden</p>
          <p className="text-2xl font-bold text-red-600">{stats.hidden}</p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No {tabLabels[activeTab].toLowerCase()} metadata in database yet.</p>
          <button
            onClick={syncFromCode}
            disabled={syncing}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync from Code to Get Started'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {items.map(item => (
            <div key={item.contentId} className="p-4 flex items-center gap-4 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                  {item.hidden && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Hidden</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {activeTab === 'project' && item.data?.type ? (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                      {String(item.data.type)}
                    </span>
                  ) : null}
                  {activeTab === 'experience' && item.data?.company ? (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                      {String(item.data.company)}
                    </span>
                  ) : null}
                  {activeTab === 'skill' && item.data?.skills ? (
                    <span className="text-xs text-gray-500 truncate">
                      {(item.data.skills as string[]).join(', ')}
                    </span>
                  ) : null}
                  {item.description && (
                    <span className="text-gray-400 truncate max-w-[300px]">{item.description}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {activeTab !== 'skill' && (
                  <button
                    onClick={() => toggleField(item.contentId, 'featured', item.featured)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      item.featured
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {item.featured ? 'Featured' : 'Feature'}
                  </button>
                )}

                <button
                  onClick={() => toggleField(item.contentId, 'hidden', item.hidden)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    item.hidden
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {item.hidden ? 'Hidden' : 'Hide'}
                </button>

                <button
                  onClick={() => setEditingItem({ ...item })}
                  className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditContentModal
          item={editingItem}
          type={activeTab}
          onSave={saveEdit}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  )
}

function EditContentModal({
  item,
  type,
  onSave,
  onCancel,
}: {
  item: ContentMetadata
  type: ContentType
  onSave: (item: ContentMetadata) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(item)
  const [techInput, setTechInput] = useState(
    Array.isArray(item.data?.technologies)
      ? (item.data.technologies as string[]).join(', ')
      : Array.isArray(item.data?.skills)
        ? (item.data.skills as string[]).join(', ')
        : ''
  )

  const handleSave = () => {
    const updatedData = { ...form.data }
    if (type === 'skill') {
      updatedData.skills = techInput.split(',').map(s => s.trim()).filter(Boolean)
      updatedData.category = form.title
    } else if (type === 'project' || type === 'experience') {
      updatedData.technologies = techInput.split(',').map(s => s.trim()).filter(Boolean)
      updatedData.title = form.title
      if (form.description) updatedData.description = form.description
    }
    onSave({ ...form, data: updatedData })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Edit {type === 'project' ? 'Project' : type === 'experience' ? 'Experience' : 'Skill Category'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'skill' ? 'Category Name' : 'Title'}
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {type !== 'skill' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}

          {type === 'project' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={(form.data?.type as string) || ''}
                    onChange={e => setForm({ ...form, data: { ...form.data, type: e.target.value } })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                  <input
                    type="text"
                    value={(form.data?.impact as string) || ''}
                    onChange={e => setForm({ ...form, data: { ...form.data, impact: e.target.value } })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  value={(form.data?.link as string) || ''}
                  onChange={e => setForm({ ...form, data: { ...form.data, link: e.target.value } })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {type === 'experience' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={(form.data?.company as string) || ''}
                  onChange={e => setForm({ ...form, data: { ...form.data, company: e.target.value } })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  value={(form.data?.type as string) || ''}
                  onChange={e => setForm({ ...form, data: { ...form.data, type: e.target.value } })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'skill' ? 'Skills (comma-separated)' : 'Technologies (comma-separated)'}
            </label>
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 999 })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Lower number = displayed first</p>
            </div>
            <div className="flex items-end gap-4 pb-1">
              {type !== 'skill' && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="rounded"
                  />
                  Featured
                </label>
              )}
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
