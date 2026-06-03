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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow focus:text-blue-700"
      >
        Skip to content
      </a>
      <Navigation />
      <div id="main-content">
        {children}
      </div>
      <ConsoltoChat />
      <ShareButton />
      <Footer />
    </>
  )
}
