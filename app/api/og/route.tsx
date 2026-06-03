import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

// Dynamic Open Graph card generator. Used as the social-share image for blog
// posts that don't have a featured photo (and anywhere else that wants a branded
// 1200×630 card). Query params: ?title=...&category=...&eyebrow=...
// Must stay dynamic so the ?title/?category query params are read at request
// time; CDN-cached for a day via the response headers below.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function clamp(s: string | null, max: number, fallback = ''): string {
  if (!s) return fallback
  const t = s.trim()
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = clamp(searchParams.get('title'), 110, 'Brand Anthony McDonald')
  const category = clamp(searchParams.get('category'), 40)
  const eyebrow = clamp(searchParams.get('eyebrow'), 40, 'brandanthonymcdonald.com')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          padding: '64px 72px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: '#93c5fd',
              letterSpacing: 1,
            }}
          >
            BAM
          </div>
          {category ? (
            <div
              style={{
                fontSize: 22,
                color: '#bfdbfe',
                background: 'rgba(147,197,253,0.15)',
                padding: '6px 16px',
                borderRadius: 999,
              }}
            >
              {category}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 56 : 66,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#cbd5e1' }}>{eyebrow}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, immutable, no-transform, max-age=86400, s-maxage=86400',
      },
    },
  )
}
