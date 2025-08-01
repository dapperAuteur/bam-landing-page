import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '../components/ui/Navigation'
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
      <body className={inter.className}>
        <Navigation />
        {children}
        <ConsoltoChat />
        <ShareButton />
      </body>
    </html>
  )
}