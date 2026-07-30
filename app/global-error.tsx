'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

// Last-resort boundary — catches errors thrown in the ROOT layout itself, where
// the normal error.tsx can't render. It must supply its own <html>/<body> and
// can't rely on the app's layout/components. Plain anchors, inline styles only.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surfaced in Vercel logs...
    console.error('[global-error]', error)
    // ...plus Sentry for a real stack trace. A no-op when no DSN is configured, and the
    // beforeSend scrub in lib/sentry-scrub.ts strips credentials before anything is sent.
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f9fafb',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          color: '#111827',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <p style={{ fontSize: 56, fontWeight: 700, color: '#2563eb', margin: 0 }}>500</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '12px 0 8px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#4b5563', margin: 0 }}>
            The site hit an unexpected error. Please try again, or return to the homepage.
          </p>
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={reset}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 20px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: '1px solid #d1d5db',
                borderRadius: 6,
                padding: '10px 20px',
                fontWeight: 600,
                color: '#374151',
                textDecoration: 'none',
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
