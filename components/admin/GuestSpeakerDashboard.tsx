// components/admin/GuestSpeakerDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { GuestSpeakerLog } from '../../lib/logging/guest-speaker-logger'

interface GuestSpeakerStats {
  totalSubmissions: number
  successfulSubmissions: number
  spamSubmissions: number
  failedSubmissions: number
  submissionsByDay: Array<{ date: string; count: number }>
}

export default function GuestSpeakerDashboard() {
  const [logs, setLogs] = useState<GuestSpeakerLog[]>([])
  const [stats, setStats] = useState<GuestSpeakerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<7 | 30 | 90>(30)

  useEffect(() => {
    fetchData()
  }, [selectedTimeframe])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const logsResponse = await fetch('/api/admin/guest-speaker/logs?limit=50')
      if (!logsResponse.ok) throw new Error('Failed to fetch logs')
      const logsData = await logsResponse.json()
      setLogs(logsData)

      const statsResponse = await fetch(`/api/admin/guest-speaker/stats?days=${selectedTimeframe}`)
      if (!statsResponse.ok) throw new Error('Failed to fetch stats')
      const statsData = await statsResponse.json()
      setStats(statsData)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'spam': return 'text-yellow-600 bg-yellow-100'
      case 'failure': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Guest Speaker Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(Number(e.target.value) as 7 | 30 | 90)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Submissions</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Successful</h3>
            <p className="text-2xl font-bold text-green-600">{stats.successfulSubmissions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Failed</h3>
            <p className="text-2xl font-bold text-red-600">{stats.failedSubmissions}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No activity found.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {log.event.replace('guest_speaker_', '').toUpperCase()}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500 space-y-1">
                        {log.name && <p>Name: {log.name}</p>}
                        {log.email && <p>Email: {log.email}</p>}
                        {log.reason && <p>Reason: {log.reason}</p>}
                        <p>IP: {log.ipAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
