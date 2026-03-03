'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, AlertTriangle, Download, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface WorkoutFeedbackSubmission {
  _id: string
  activity: {
    category: string
    duration: string | null
    frictionScenarioIndex?: number
  }
  moodBefore: number
  moodAfter: number
  difficulty: string
  instructionPreference: string
  feedback?: string
  email?: string
  protocolVersion: string
  submittedAt: string
  status: 'new' | 'reviewed' | 'responded' | 'closed'
  ipAddress?: string
  userAgent?: string
  adminNotes?: string
}

interface WorkoutFeedbackStats {
  totalSubmissions: number
  newSubmissions: number
  avgMoodBefore: number
  avgMoodAfter: number
  avgMoodImprovement: number
  difficultyDistribution: Array<{ difficulty: string; count: number }>
  instructionPrefDistribution: Array<{ preference: string; count: number }>
  categoryDistribution: Array<{ category: string; count: number }>
}

const CATEGORY_LABELS: Record<string, string> = {
  AM: 'AM Priming',
  PM: 'PM Recovery',
  WORKOUT: 'Metabolic Engine',
  friction: 'Friction Protocol'
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easier: 'Too Easy',
  'just-right': 'Just Right',
  harder: 'Too Hard'
}

const INSTRUCTION_LABELS: Record<string, string> = {
  'text-is-fine': 'Text Is Clear',
  'need-images': 'Need Images',
  'need-video': 'Need Video'
}

const MOOD_BEFORE_LABELS = ['', 'Exhausted', 'Low Energy', 'Neutral', 'Good', 'Fired Up']
const MOOD_AFTER_LABELS = ['', 'Worse', 'No Change', 'Slightly Better', 'Good', 'Energized']

export default function WorkoutFeedbackDashboard() {
  const [stats, setStats] = useState<WorkoutFeedbackStats | null>(null)
  const [submissions, setSubmissions] = useState<WorkoutFeedbackSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<WorkoutFeedbackSubmission | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'needs-video'>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY

      if (!adminKey) {
        throw new Error('Configuration Error: NEXT_PUBLIC_ADMIN_API_KEY is missing in environment variables.')
      }

      const [statsResponse, submissionsResponse] = await Promise.all([
        fetch('/api/admin/workout-feedback/stats', {
          headers: { 'Authorization': `Bearer ${adminKey}` }
        }),
        fetch('/api/admin/workout-feedback/submissions', {
          headers: { 'Authorization': `Bearer ${adminKey}` }
        })
      ])

      if (!statsResponse.ok || !submissionsResponse.ok) {
        throw new Error('Failed to fetch workout feedback data')
      }

      const statsData = await statsResponse.json()
      const submissionsData = await submissionsResponse.json()

      setStats(statsData)
      setSubmissions(submissionsData.submissions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      console.error('Workout feedback dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (id: string, newStatus: WorkoutFeedbackSubmission['status']) => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY

      await fetch(`/api/admin/workout-feedback/submissions/${id}`, {
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
      ['Category', 'Duration', 'Mood Before', 'Mood After', 'Difficulty', 'Instruction Pref', 'Feedback', 'Email', 'Submitted', 'Status'].join(','),
      ...submissions.map(sub => [
        CATEGORY_LABELS[sub.activity.category] || sub.activity.category,
        sub.activity.duration || 'N/A',
        `${sub.moodBefore} (${MOOD_BEFORE_LABELS[sub.moodBefore]})`,
        `${sub.moodAfter} (${MOOD_AFTER_LABELS[sub.moodAfter]})`,
        DIFFICULTY_LABELS[sub.difficulty] || sub.difficulty,
        INSTRUCTION_LABELS[sub.instructionPreference] || sub.instructionPreference,
        `"${(sub.feedback || '').replace(/"/g, '""')}"`,
        sub.email || 'N/A',
        new Date(sub.submittedAt).toLocaleDateString(),
        sub.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workout-feedback-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'new') return sub.status === 'new'
    if (filter === 'needs-video') return sub.instructionPreference === 'need-video'
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
          <h2 className="text-2xl font-bold text-gray-900">Workout Feedback</h2>
          <p className="text-gray-600">Nomad Longevity OS protocol feedback from beta testers</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchData}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Refresh
          </button>
          <button
            onClick={exportSubmissions}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">New / Unreviewed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              {stats.avgMoodImprovement >= 0 ? (
                <ArrowUpRight className="h-8 w-8 text-green-600" />
              ) : (
                <ArrowDownRight className="h-8 w-8 text-red-600" />
              )}
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Mood Change</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgMoodImprovement > 0 ? '+' : ''}{stats.avgMoodImprovement}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Category</p>
                <p className="text-xl font-bold text-gray-900">
                  {CATEGORY_LABELS[stats.categoryDistribution[0]?.category] || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribution quick view */}
      {stats && (stats.difficultyDistribution.length > 0 || stats.instructionPrefDistribution.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.difficultyDistribution.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Difficulty Feedback</h3>
              <div className="space-y-2">
                {stats.difficultyDistribution.map(item => (
                  <div key={item.difficulty} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{DIFFICULTY_LABELS[item.difficulty] || item.difficulty}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.instructionPrefDistribution.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Instruction Format Requests</h3>
              <div className="space-y-2">
                {stats.instructionPrefDistribution.map(item => (
                  <div key={item.preference} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{INSTRUCTION_LABELS[item.preference] || item.preference}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          onClick={() => setFilter('needs-video')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'needs-video'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Wants Video ({submissions.filter(s => s.instructionPreference === 'need-video').length})
        </button>
      </div>

      {/* Submissions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mood
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructions
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
            {filteredSubmissions.map((submission) => {
              const moodDelta = submission.moodAfter - submission.moodBefore;
              return (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {CATEGORY_LABELS[submission.activity.category] || submission.activity.category}
                    </div>
                    <div className="text-sm text-gray-500">
                      {submission.activity.duration ? `${submission.activity.duration} min` : 'Scenario'}
                    </div>
                    {submission.email && (
                      <div className="text-xs text-gray-400">{submission.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {submission.moodBefore} → {submission.moodAfter}
                    </div>
                    <div className={`text-xs font-medium ${
                      moodDelta > 0 ? 'text-green-600' : moodDelta < 0 ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {moodDelta > 0 ? `+${moodDelta}` : moodDelta === 0 ? 'No change' : moodDelta}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      submission.difficulty === 'easier' ? 'bg-green-100 text-green-800' :
                      submission.difficulty === 'just-right' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {DIFFICULTY_LABELS[submission.difficulty] || submission.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      submission.instructionPreference === 'text-is-fine' ? 'bg-gray-100 text-gray-800' :
                      submission.instructionPreference === 'need-images' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {INSTRUCTION_LABELS[submission.instructionPreference] || submission.instructionPreference}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={submission.status}
                      onChange={(e) => updateSubmissionStatus(submission._id, e.target.value as WorkoutFeedbackSubmission['status'])}
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
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No submissions found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Feedback Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Activity</p>
                  <p className="text-sm text-gray-900">
                    {CATEGORY_LABELS[selectedSubmission.activity.category] || selectedSubmission.activity.category}
                    {selectedSubmission.activity.duration && ` — ${selectedSubmission.activity.duration} min`}
                    {selectedSubmission.activity.frictionScenarioIndex !== undefined && ` — Scenario ${selectedSubmission.activity.frictionScenarioIndex + 1}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Protocol Version</p>
                  <p className="text-sm text-gray-900">{selectedSubmission.protocolVersion}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Mood Before</p>
                  <p className="text-sm text-gray-900">
                    {selectedSubmission.moodBefore}/5 ({MOOD_BEFORE_LABELS[selectedSubmission.moodBefore]})
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Mood After</p>
                  <p className="text-sm text-gray-900">
                    {selectedSubmission.moodAfter}/5 ({MOOD_AFTER_LABELS[selectedSubmission.moodAfter]})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Difficulty</p>
                  <p className="text-sm text-gray-900">
                    {DIFFICULTY_LABELS[selectedSubmission.difficulty] || selectedSubmission.difficulty}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Instruction Preference</p>
                  <p className="text-sm text-gray-900">
                    {INSTRUCTION_LABELS[selectedSubmission.instructionPreference] || selectedSubmission.instructionPreference}
                  </p>
                </div>
              </div>

              {selectedSubmission.feedback && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Open Feedback</p>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 mt-1">{selectedSubmission.feedback}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                  <p className="text-sm text-gray-900">{selectedSubmission.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Submitted</p>
                  <p className="text-sm text-gray-900">{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">IP Address</p>
                <p className="text-sm text-gray-900">{selectedSubmission.ipAddress || 'N/A'}</p>
              </div>

              {selectedSubmission.adminNotes && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Admin Notes</p>
                  <p className="text-sm text-gray-900 bg-blue-50 rounded-lg p-3 mt-1">{selectedSubmission.adminNotes}</p>
                </div>
              )}
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
