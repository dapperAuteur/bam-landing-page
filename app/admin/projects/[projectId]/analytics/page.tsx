'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface AnalyticsData {
  summary: {
    totalViews: number
    totalSectionViews: number
    totalTimeSpentSeconds: number
    totalMediaViews: number
    totalMediaDownloads: number
    totalEvents: number
  }
  viewsByDay: Array<{ date: string; count: number }>
  sectionViews: Array<{ section: string; count: number }>
  recentActivity: Array<{ eventType: string; timestamp: string; properties: Record<string, string | number | null | undefined> }>
}

const EVENT_LABELS: Record<string, string> = {
  proposal_viewed: 'Viewed Proposal',
  proposal_section_viewed: 'Viewed Section',
  proposal_time_spent: 'Time on Page',
  media_viewed: 'Viewed Media',
  media_downloaded: 'Downloaded Media',
  proposal_approved: 'Approved',
  proposal_rejected: 'Declined',
  proposal_revision_requested: 'Requested Revision',
  proposal_comment: 'Commented',
  proposal_shared: 'Shared'
}

const SECTION_LABELS: Record<string, string> = {
  coverLetter: 'Cover Letter',
  scopeOfWork: 'Scope of Work',
  deliverables: 'Deliverables',
  pricing: 'Pricing',
  timeline: 'Timeline',
  terms: 'Terms',
  media: 'Media Gallery'
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  if (minutes < 60) return `${minutes}m ${remaining}s`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}

export default function ProjectAnalyticsPage({ params }: { params: { projectId: string } }) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/projects/${params.projectId}/analytics`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params.projectId])

  if (loading) return <div className="p-6">Loading analytics...</div>
  if (!data) return <div className="p-6 text-red-600">Failed to load analytics.</div>

  const { summary, viewsByDay, sectionViews, recentActivity } = data

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Project Analytics</h1>
        <a
          href={`/admin/projects/${params.projectId}`}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Project
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Views" value={summary.totalViews} />
        <SummaryCard label="Time Spent" value={formatDuration(summary.totalTimeSpentSeconds)} />
        <SummaryCard label="Media Views" value={summary.totalMediaViews} />
        <SummaryCard label="Downloads" value={summary.totalMediaDownloads} />
      </div>

      {/* Views Over Time */}
      {viewsByDay.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Views Over Time</h2>
          <div className="bg-white rounded-lg shadow p-4" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} name="Views" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Section Engagement */}
      {sectionViews.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Section Engagement</h2>
          <div className="bg-white rounded-lg shadow p-4" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionViews.map(s => ({ ...s, section: SECTION_LABELS[s.section] || s.section }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="section" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Recent Activity */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="bg-white rounded-lg shadow divide-y">
            {recentActivity.map((event, i) => (
              <div key={i} className="px-4 py-3 flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {EVENT_LABELS[event.eventType] || event.eventType}
                  </span>
                  {event.properties?.sectionId ? (
                    <span className="text-xs text-gray-500 ml-2">
                      ({SECTION_LABELS[String(event.properties.sectionId)] || String(event.properties.sectionId)})
                    </span>
                  ) : null}
                  {event.properties?.durationSeconds ? (
                    <span className="text-xs text-gray-500 ml-2">
                      ({formatDuration(Number(event.properties.durationSeconds))})
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No activity recorded yet.</p>
        )}
      </section>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}
