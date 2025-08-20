'use client'

import { useState, useEffect } from 'react'
import { ContactLog } from '../../lib/logging/contact-logger'

interface ContactStats {
  totalSubmissions: number
  successfulSubmissions: number
  spamSubmissions: number
  failedSubmissions: number
  topServiceTypes: Array<{ serviceType: string; count: number }>
  submissionsByDay: Array<{ date: string; count: number }>
}

export default function ContactDashboard() {
  const [logs, setLogs] = useState<ContactLog[]>([])
  const [stats, setStats] = useState<ContactStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<7 | 30 | 90>(30)

  useEffect(() => {
    fetchData()
  }, [selectedTimeframe])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch recent logs
      const logsResponse = await fetch('/api/admin/contact-logs?limit=50')
      if (!logsResponse.ok) throw new Error('Failed to fetch logs')
      const logsData = await logsResponse.json()
      setLogs(logsData)

      // Fetch statistics
      const statsResponse = await fetch(`/api/admin/contact-stats?days=${selectedTimeframe}`)
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

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'contact_form_success':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'contact_spam_detected':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'contact_rate_limit_exceeded':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">Error loading dashboard: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contact Form Dashboard</h1>
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

      {/* Statistics Cards */}
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
            <h3 className="text-sm font-medium text-gray-500">Spam Detected</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.spamSubmissions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Failed</h3>
            <p className="text-2xl font-bold text-red-600">{stats.failedSubmissions}</p>
          </div>
        </div>
      )}

      {/* Top Service Types */}
      {stats && stats.topServiceTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Service Types</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats.topServiceTypes.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{service.serviceType}</span>
                  <span className="text-sm font-medium text-gray-900">{service.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No contact form activity in the selected timeframe.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-1 rounded-full ${getStatusColor(log.status)}`}>
                      {getEventIcon(log.event)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {log.event.replace('contact_', '').replace('_', ' ')}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500 space-y-1">
                        {log.email && <p>Email: {log.email}</p>}
                        {log.serviceType && <p>Service: {log.serviceType}</p>}
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