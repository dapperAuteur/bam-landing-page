import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import { Inter } from 'next/font/google'
import {Providers} from "@/components/providers/SessionProvider"
import PublicLayout from '@/components/layout/PublicLayout'
import { PostHogProvider } from '@/lib/analytics/posthog-provider'
import { witusEndSessionUrl } from '@/lib/auth/witus-config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://brandanthonymcdonald.com'),
  title: 'Brand Anthony McDonald | Developer Relations, Voiceover Artist & Business Consultant',
  description: 'Developer advocacy, professional voiceover, and strategic consulting. Building tools and documenting the journey to become the world\'s fastest centenarian.',
  openGraph: {
    title: 'Brand Anthony McDonald | Developer Relations, Voiceover & Consulting',
    description: 'Developer advocacy, professional voiceover, and strategic consulting. Building tools and documenting the journey to become the world\'s fastest centenarian.',
    url: 'https://brandanthonymcdonald.com',
    siteName: 'Brand Anthony McDonald',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/api/og?title=Brand%20Anthony%20McDonald&category=Portfolio&eyebrow=Developer%20Relations%20%C2%B7%20Voiceover%20%C2%B7%20Consulting',
        width: 1200,
        height: 630,
        alt: 'Brand Anthony McDonald',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Anthony McDonald | Developer Relations, Voiceover & Consulting',
    description: 'Developer advocacy, professional voiceover, and strategic consulting.',
    images: ['/api/og?title=Brand%20Anthony%20McDonald&category=Portfolio&eyebrow=Developer%20Relations%20%C2%B7%20Voiceover%20%C2%B7%20Consulting'],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Brand Anthony McDonald: Blog' }],
      'application/feed+json': [{ url: '/feed.json', title: 'Brand Anthony McDonald: Blog' }],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Brand Anthony McDonald',
    url: 'https://brandanthonymcdonald.com',
    jobTitle: 'Developer Relations, Voiceover Artist & Business Consultant',
    description: 'Developer advocate, voiceover artist, and strategic business consultant.',
    sameAs: [
      'https://l.awews.com/brand-am-linkedin',
      'https://i.brandanthonymcdonald.com/github-profile',
      'https://i.brandanthonymcdonald.com/bluesky',
    ],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Analytics />
      <Providers>
        <body className={inter.className}>
          {/* Renders nothing — it only initialises PostHog and reports route views.
              The key is read HERE, in the Server Component, and passed down; `?? null`
              is what puts the provider in its supported keyless state (local dev, and
              any deploy before NEXT_PUBLIC_POSTHOG_KEY is set) rather than initialising
              with undefined. Sits at the root so route tracking covers every page.
              Separate from <Analytics /> above, which is Vercel's own and untouched. */}
          <PostHogProvider
            apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY ?? null}
            apiHost="/ingest"
          />
          {/* `witusEndSessionUrl` is read HERE, in the Server Component, for the same
              reason as the PostHog key above: a client component cannot see a non-
              NEXT_PUBLIC env var. It reaches the nav's Logout button, which uses it to end
              the shared WitUS session after destroying the local one. `null` when this
              deploy is not a configured OIDC client, which keeps sign-out purely local. */}
          <PublicLayout witusEndSessionUrl={witusEndSessionUrl}>
            {children}
          </PublicLayout>
        </body>
      </Providers>
    </html>
  )
}
