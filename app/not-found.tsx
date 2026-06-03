import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

// 404 — a requested page/resource doesn't exist. Always offers a clear way back.
export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center">
        <p className="text-6xl font-bold text-blue-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">This page wandered off</h1>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/blog/legacy"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Read the blog
          </Link>
          <Link
            href="/intake"
            className="rounded-md border border-gray-300 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Start a project
          </Link>
        </div>
      </div>
    </main>
  )
}
