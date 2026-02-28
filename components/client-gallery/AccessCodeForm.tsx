'use client'

import { useState } from 'react'

interface AccessCodeFormProps {
  eventName: string
  clientName: string
  onAuthenticate: (code: string) => Promise<boolean>
}

export default function AccessCodeForm({ eventName, clientName, onAuthenticate }: AccessCodeFormProps) {
  const [accessCode, setAccessCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessCode.trim()) return

    setLoading(true)
    setError(null)

    const success = await onAuthenticate(accessCode.trim())
    if (!success) {
      setError('Invalid access code')
      setAccessCode('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Access Protected Gallery</h1>
        <div className="mb-4 text-center">
          <h2 className="text-lg font-semibold text-gray-800">{eventName}</h2>
          <p className="text-gray-600">{clientName}</p>
        </div>
        {error && (
          <p className="text-red-600 text-sm text-center mb-4" role="alert">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="access-code" className="block text-sm font-medium text-gray-700 mb-1">
              Access Code
            </label>
            <input
              id="access-code"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter access code"
              required
              disabled={loading}
              aria-describedby={error ? 'access-error' : undefined}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !accessCode.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Access Gallery'}
          </button>
        </form>
      </div>
    </div>
  )
}
