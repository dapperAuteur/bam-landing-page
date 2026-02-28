'use client'

import { usePathname } from 'next/navigation'
import Navigation from '../ui/Navigation'
import ShareButton from '../share/ShareButton'
import ConsoltoChat from '../ConsoltoChat'
import Footer from '../ui/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') || pathname === '/login'

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      {children}
      <ConsoltoChat />
      <ShareButton />
      <Footer />
    </>
  )
}
