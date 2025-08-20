import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Inter } from 'next/font/google'
import Navigation from '../components/ui/Navigation'
import { AuthProvider } from './../contexts/AuthContext'
import ShareButton from '../components/share/ShareButton'
import ConsoltoChat from "./../components/ConsoltoChat";

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
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navigation />
          {children}
          <Analytics />
          <ConsoltoChat />
          <ShareButton />
        </body>
      </AuthProvider>
    </html>
  )
}