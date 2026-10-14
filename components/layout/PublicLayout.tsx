'use client'

import { usePathname } from 'next/navigation'
import Navigation from '../ui/Navigation'
import ShareButton from '../share/ShareButton'
import ConsoltoChat from '../ConsoltoChat'
import Footer from '../ui/Footer'

export default function PublicLayout({
  children,
  witusEndSessionUrl = null,
}: {
  children: React.ReactNode
  /** Server-resolved IdP endsession URL, threaded from app/layout.tsx to the nav's Logout. */
  witusEndSessionUrl?: string | null
}) {
  const pathname = usePathname()
  // /admin keeps the bare shell; /login now gets the full nav + footer so it's
  // navigable like any public page.
  const isAdmin = pathname?.startsWith('/admin')

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
      <Navigation witusEndSessionUrl={witusEndSessionUrl} />
      <div id="main-content">
        {children}
      </div>
      <ConsoltoChat />
      <ShareButton />
      <Footer />
    </>
  )
}
