import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import { Inter } from 'next/font/google'
import Navigation from '../components/ui/Navigation'
import {Providers} from "@/components/providers/SessionProvider"
import ShareButton from '../components/share/ShareButton'
import ConsoltoChat from "./../components/ConsoltoChat";
import Footer from 'components/ui/Footer'

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Anthony McDonald | Developer Relations, Voiceover & Consulting',
    description: 'Developer advocacy, professional voiceover, and strategic consulting.',
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
          <Navigation />
          {children}
          <ConsoltoChat />
          <ShareButton />
          <Footer/>
        </body>
      </Providers>
    </html>
  )
}
