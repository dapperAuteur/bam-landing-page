// src/app/admin/logs/page.tsx
'use client'

import { useState, useEffect } from 'react'

// Client-side interfaces (no imports from server modules)
interface BaseLogEntry {
  _id?: string
  context: string
  level: string
  message: string
  timestamp: Date | string
  userId?: string
  requestId?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

interface ContactLog {
  _id?: string
  event: string
  email?: string
  serviceType?: string
  ipAddress: string
  userAgent: string
  status: "success" | "failure" | "spam"
  reason?: string
  formData?: any
  metadata?: Record<string, any>
  timestamp: Date | string
}

interface LogsViewerProps {
  logs: (BaseLogEntry | ContactLog)[]
  loading: boolean
}

const LogsViewer = ({ logs, loading }: LogsViewerProps) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    )
  }

  const getLogIcon = (log: BaseLogEntry | ContactLog) => {
  const isContactLog = 'event' in log
  
  if (isContactLog) {
    switch (log.status) {
      case 'success': return '✅'
      case 'spam': return '⚠️'
      case 'failure': return '❌'
      default: return '📧'
    }
  }

  switch (log.level) {
    case 'error': return '🚨'
    case 'warning': return '⚠️'
    case 'info': return 'ℹ️'
    case 'debug': return '🔍'
    default: return '📝'
  }
}

  const getLogColor = (log: BaseLogEntry | ContactLog) => {
    const isContactLog = 'event' in log
    
    if (isContactLog) {
      switch (log.status) {
        case 'success': return 'text-green-600 bg-green-50'
        case 'spam': return 'text-yellow-600 bg-yellow-50'
        case 'failure': return 'text-red-600 bg-red-50'
        default: return 'text-blue-600 bg-blue-50'
      }
    }

    switch (log.level) {
      case 'error': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      case 'debug': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-2">
      {logs.map((log, index) => {
        const isContactLog = 'event' in log
        return (
          <div key={index} className={`p-4 rounded-lg border ${getLogColor(log)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-lg">{getLogIcon(log)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">
                      {isContactLog ? log.event : `${log.context}.${log.level}`}
                    </span>
                    {isContactLog && log.email && (
                      <span className="text-sm text-gray-600">({log.email})</span>
                    )}
                  </div>
                  <p className="text-sm mb-2">
                    {isContactLog ? 
                      `${log.event.replace('contact_', '').replace('_', ' ')}${log.reason ? ` - ${log.reason}` : ''}` :
                      log.message
                    }
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">IP:</span> {log.ipAddress || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">User Agent:</span> 
                      <span className="truncate ml-1">{log.userAgent || 'N/A'}</span>
                    </div>
                    {isContactLog && log.serviceType && (
                      <div>
                        <span className="font-medium">Service:</span> {log.serviceType}
                      </div>
                    )}
                    {!isContactLog && log.userId && (
                      <div>
                        <span className="font-medium">User ID:</span> {log.userId}
                      </div>
                    )}
                  </div>
                  {(log.metadata && Object.keys(log.metadata).length > 0) && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Metadata</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<(BaseLogEntry | ContactLog)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'all' | 'contact' | 'system'>('all')
  const [selectedLevel, setSelectedLevel] = useState<'all' | string>('all')
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    fetchLogs()
  }, [selectedType, selectedLevel, limit])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: selectedType,
        level: selectedLevel,
        limit: limit.toString()
      })
      
      const response = await fetch(`/api/admin/logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch logs')
      
      const data = await response.json()
      setLogs(data.logs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading logs: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <button
          onClick={fetchLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Log Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'contact' | 'system')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Logs</option>
              <option value="contact">Contact Forms</option>
              <option value="system">System Events</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level/Status
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Levels</option>
              <option value="error">Errors</option>
              <option value="warning">Warnings</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Limit
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value={25}>25 entries</option>
              <option value={50}>50 entries</option>
              <option value={100}>100 entries</option>
              <option value={200}>200 entries</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedType('all')
                setSelectedLevel('all')
                setLimit(50)
              }}
              className="w-full bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Entries</h3>
          <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Contact Logs</h3>
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter(log => 'event' in log).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">System Logs</h3>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter(log => 'level' in log).length}
          </p>
        </div>
      </div>

      {/* Logs Display */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <LogsViewer logs={logs} loading={loading} />
        </div>
      </div>
    </div>
  )
}