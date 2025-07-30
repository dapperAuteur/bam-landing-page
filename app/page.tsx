import { Metadata } from 'next'
import Hero from './../components/Hero'
import Services from './../components/Services'
import About from './../components/About'
import Portfolio from './../components/Portfolio'
import Contact from './../components/Contact'
import Footer from './../components/Footer'

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