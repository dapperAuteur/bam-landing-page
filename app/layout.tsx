import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Inter } from 'next/font/google'
import Navigation from '../components/ui/Navigation'
import {Providers} from "@/components/providers/SessionProvider"
import ShareButton from '../components/share/ShareButton'
import ConsoltoChat from "./../components/ConsoltoChat";
import Footer from 'components/ui/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Brand Anthony McDonald | Voiceover Artist & Business Consultant',
  description: 'Professional voiceover services and business consulting. Training to be the world\'s fastest centenarian.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add to your API route temporarily
console.log('MongoDB URI:', process.env.MONGODB_URI?.substring(0, 20) + '...')
  return (
    <html lang="en">
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