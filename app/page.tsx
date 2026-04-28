import { Metadata } from 'next'
import Hero from '../components/ui/Hero'
import Services from '../components/ui/Services'
import About from '../components/ui/About'
import Portfolio from '../components/ui/Portfolio'
import Contact from '../components/ui/Contact'

export const metadata: Metadata = {
  title: 'Brand Anthony McDonald | Developer Relations & Business Consultant',
  description: 'Developer Relations, voiceover services and business consulting. Training to be the world\'s fastest centenarian while building the world\'s smallest conglomerate.',
  keywords: 'developer relations, voiceover, business consulting, narrator, audiobook, commercial voice, Brand Anthony McDonald',
  alternates: { canonical: 'https://brandanthonymcdonald.com/' },
  openGraph: {
    title: 'Brand Anthony McDonald | Developer Relations & Business Consultant',
    description: 'Developer Relations, voiceover services and business consulting. Building the WitUS ecosystem while training to become the world\'s fastest centenarian.',
    url: 'https://brandanthonymcdonald.com/',
    siteName: 'Brand Anthony McDonald',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Anthony McDonald',
    description: 'Developer Relations, voiceover, and business consulting — full-stack builder shipping the WitUS ecosystem.',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Contact />
    </main>
  )
}