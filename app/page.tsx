import { Metadata } from 'next'
import Hero from '../components/ui/Hero'
import Services from '../components/ui/Services'
import About from '../components/ui/About'
import Portfolio from '../components/ui/Portfolio'
import Contact from '../components/ui/Contact'
import Footer from '../components/ui/Footer'

export const metadata: Metadata = {
  title: 'Brand Anthony McDonald | Voice Over Artist & Business Consultant',
  description: 'Professional voice over services and business consulting. Training to be the world\'s fastest centenarian while building the world\'s smallest conglomerate.',
  keywords: 'voice over, business consulting, narrator, audiobook, commercial voice, brand anthony mcdonald',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Contact />
      <Footer />
    </main>
  )
}