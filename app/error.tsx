'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// Route-segment error boundary — catches runtime/server (500-class) errors in any
// page below the root layout. Must be a Client Component. Offers a retry (reset)
// plus a clear path back to the app so a failure is never a dead end.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surfaced in Vercel logs; digest correlates to the server-side stack.
    console.error('[app-error]', error)
  }, [error])

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center">
        <p className="text-6xl font-bold text-blue-600">500</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-gray-600">
          A hiccup on our end interrupted that request. You can try again, or head back to the app.
        </p>
        {error?.digest && (
          <p className="mt-2 text-xs text-gray-400">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/blog"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </main>
  )
}
