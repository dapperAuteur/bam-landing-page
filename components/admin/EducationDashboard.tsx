'use client'

import { useState, useEffect } from 'react'
import { Book, Users, TrendingUp, AlertTriangle, Download, Eye } from 'lucide-react'

interface EducationSubmission {
  _id: string
  name: string
  email: string
  country: string
  state: string
  schoolName: string
  schoolDistrict: string
  city: string
  gradesTeaching: string[]
  customCreationRequest: boolean
  formType: string
  submittedAt: string
  status: 'new' | 'reviewed' | 'responded' | 'closed'
  ipAddress?: string
  userAgent?: string
}

interface EducationStats {
  totalSubmissions: number
  newSubmissions: number
  customRequests: number
  topFormTypes: Array<{ formType: string; count: number }>
  recentSubmissions: EducationSubmission[]
}

export default function EducationDashboard() {
  const [stats, setStats] = useState<EducationStats | null>(null)
  const [submissions, setSubmissions] = useState<EducationSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<EducationSubmission | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'custom'>('all')

  useEffect(() => {
    fetchEducationData()
  }, [])

  const fetchEducationData = async () => {
    try {
      setLoading(true)
      
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY

      if (!adminKey) {
        throw new Error('Configuration Error: NEXT_PUBLIC_ADMIN_API_KEY is missing in environment variables.')
      }
      
      const [statsResponse, submissionsResponse] = await Promise.all([
        fetch('/api/admin/education/stats', {
          headers: { 'Authorization': `Bearer ${adminKey}` }
        }),
        fetch('/api/admin/education/submissions', {
          headers: { 'Authorization': `Bearer ${adminKey}` }
        })
      ])

      console.log('API Response Status:', {
        stats: statsResponse.status,
        submissions: submissionsResponse.status
      })

      if (!statsResponse.ok || !submissionsResponse.ok) {
        throw new Error('Failed to fetch education data')
      }

      const statsData = await statsResponse.json()
      const submissionsData = await submissionsResponse.json()

      setStats(statsData)
      setSubmissions(submissionsData.submissions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      console.error('Education dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (id: string, newStatus: EducationSubmission['status']) => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY
      
      await fetch(`/api/admin/education/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      setSubmissions(prev =>
        prev.map(sub =>
          sub._id === id ? { ...sub, status: newStatus } : sub
        )
      )
    } catch (err) {
      console.error('Failed to update submission status:', err)
    }
  }

  const exportSubmissions = () => {
    const csv = [
      ['Name', 'Email', 'School', 'District', 'City', 'State', 'Country', 'Grades', 'Form Type', 'Custom Request', 'Submitted', 'Status'].join(','),
      ...submissions.map(sub => [
        sub.name,
        sub.email,
        sub.schoolName,
        sub.schoolDistrict,
        sub.city,
        sub.state,
        sub.country,
        sub.gradesTeaching?.join(';') || '',
        sub.formType,
        sub.customCreationRequest ? 'Yes' : 'No',
        new Date(sub.submittedAt).toLocaleDateString(),
        sub.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `education-submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'new') return sub.status === 'new'
    if (filter === 'custom') return sub.customCreationRequest
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Education Form Submissions</h2>
          <p className="text-gray-600">Manage curriculum access requests and custom content inquiries</p>
        </div>
        <button
          onClick={exportSubmissions}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Custom Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.customRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Form</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.topFormTypes[0]?.formType?.replace('-education', '') || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({submissions.length})
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'new'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          New ({submissions.filter(s => s.status === 'new').length})
        </button>
        <button
          onClick={() => setFilter('custom')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'custom'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Custom Requests ({submissions.filter(s => s.customCreationRequest).length})
        </button>
      </div>

      {/* Submissions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Educator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                School Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Form Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => (
              <tr key={submission._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {submission.name}
                      </div>
                      <div className="text-sm text-gray-500">{submission.email}</div>
                      <div className="text-xs text-gray-400">
                        Grades: {submission.gradesTeaching?.join(', ') || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{submission.schoolName}</div>
                  <div className="text-sm text-gray-500">{submission.schoolDistrict}</div>
                  <div className="text-xs text-gray-400">
                    {submission.city}, {submission.state}, {submission.country}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {submission.formType.replace('-education', '')}
                  </div>
                  {submission.customCreationRequest && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Custom Request
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={submission.status}
                    onChange={(e) => updateSubmissionStatus(submission._id, e.target.value as EducationSubmission['status'])}
                    className={`text-sm rounded-full px-3 py-1 font-medium ${
                      submission.status === 'new'
                        ? 'bg-yellow-100 text-yellow-800'
                        : submission.status === 'reviewed'
                        ? 'bg-blue-100 text-blue-800'
                        : submission.status === 'responded'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No submissions found</p>
          </div>
        )}
      </div>

      {/* Modal for viewing submission details */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div><strong>Name:</strong> {selectedSubmission.name}</div>
              <div><strong>Email:</strong> {selectedSubmission.email}</div>
              <div><strong>School:</strong> {selectedSubmission.schoolName}</div>
              <div><strong>District:</strong> {selectedSubmission.schoolDistrict}</div>
              <div><strong>Location:</strong> {selectedSubmission.city}, {selectedSubmission.state}, {selectedSubmission.country}</div>
              <div><strong>Grades Teaching:</strong> {selectedSubmission.gradesTeaching?.join(', ') || 'N/A'}</div>
              <div><strong>Form Type:</strong> {selectedSubmission.formType}</div>
              <div><strong>Custom Content Request:</strong> {selectedSubmission.customCreationRequest ? 'Yes' : 'No'}</div>
              <div><strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</div>
              <div><strong>IP Address:</strong> {selectedSubmission.ipAddress || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}