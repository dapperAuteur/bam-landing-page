'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { Linkedin, Github, ChevronDown } from 'lucide-react'

type NavItem = { href: string; label: string }

// Logically nested groups — keeps the inline bar narrow so it doesn't overflow
// horizontally (the old flat 9-link bar scrolled sideways once the authenticated
// Admin button was added).
const WORK: NavItem[] = [
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/photography', label: 'Photography' },
]
const LEARN: NavItem[] = [
  { href: '/learn', label: 'Courses' },
  { href: '/blog/legacy', label: 'Blog' },
]
const COMPANY: NavItem[] = [
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
]
const ADMIN: NavItem[] = [
  { href: '/admin/blog/posts', label: 'Blog posts' },
  { href: '/admin/photos', label: 'Photos' },
  { href: '/admin/galleries', label: 'Galleries' },
  { href: '/admin/approvals', label: 'Approvals' },
  { href: '/admin/contact', label: 'Contacts' },
  { href: '/admin/logs', label: 'Logs' },
]

/** Desktop hover/focus dropdown — mirrors the existing Admin dropdown pattern. */
function NavDropdown({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </button>
      <div className="absolute left-0 mt-1 w-52 rounded-md border border-gray-200 bg-white shadow-lg py-1 z-50 hidden group-hover:block group-focus-within:block">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

/** Mobile grouped section — a small heading + its links. */
function MobileGroup({
  heading,
  items,
  onNavigate,
}: {
  heading: string
  items: NavItem[]
  onNavigate: () => void
}) {
  return (
    <div className="py-1">
      <p className="px-1 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {heading}
      </p>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block py-2 pl-3 text-gray-700 hover:text-blue-600"
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const close = () => setIsOpen(false)

  const handleLogout = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 ">
      <div className="mx-2 container-max">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center" aria-label="Brand Anthony McDonald — Home">
            <Image
              src="/flywitus-platypus-logo.png"
              alt="Brand Anthony McDonald"
              width={55}
              height={40}
              priority
              sizes="55px"
              className="h-9 w-auto md:h-10"
            />
          </Link>

          {/* Desktop Menu — switches at xl so the hamburger covers the whole
              1024–1280px band where the old bar used to overflow. */}
          <div className="hidden xl:flex items-center space-x-5 2xl:space-x-8">
            <NavDropdown label="Work" items={WORK} />
            <NavDropdown label="Learn" items={LEARN} />
            <NavDropdown label="Company" items={COMPANY} />
            <Link
              href="/intake"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Start a project
            </Link>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a href="https://l.awews.com/brand-am-linkedin" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://i.brandanthonymcdonald.com/github-profile" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://i.brandanthonymcdonald.com/bluesky" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Bluesky">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.164 3.208-4.318.6-8.084 2.057-3.915 7.235 4.522 5.178 6.278-1.466 7.127-3.39.849 1.924 2.236 8.46 7.127 3.39 4.169-5.178.403-6.635-3.915-7.235 2.564.268 5.379-.581 6.164-3.208.246-.829.624-5.789.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C12.046 4.746 9.087 8.685 12 10.8z"/></svg>
              </a>
            </div>

            {/* Auth — admin controls collapse into one dropdown so the
                authenticated bar is no wider than the logged-out one. */}
            {session ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  aria-haspopup="true"
                >
                  Admin
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </button>
                <div className="absolute right-0 mt-1 w-52 rounded-md border border-gray-200 bg-white shadow-lg py-1 z-50 hidden group-hover:block group-focus-within:block">
                  <p className="px-4 py-1.5 text-xs text-gray-400 truncate">Signed in as {session?.user?.name}</p>
                  {ADMIN.map(item => (
                    <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="xl:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu — same logical groups as desktop, plus the admin
            section (which previously only exposed a single "Admin Panel" link). */}
        {isOpen && (
          <div id="mobile-menu" className="xl:hidden py-4 divide-y divide-gray-100">
            <MobileGroup heading="Work" items={WORK} onNavigate={close} />
            <MobileGroup heading="Learn" items={LEARN} onNavigate={close} />
            <MobileGroup heading="Company" items={COMPANY} onNavigate={close} />
            <div className="py-2">
              <Link
                href="/intake"
                className="block py-2 pl-1 font-medium text-blue-600 hover:text-blue-800"
                onClick={close}
              >
                Start a project
              </Link>
            </div>

            {/* Mobile Auth */}
            <div className="pt-2">
              {session ? (
                <>
                  <p className="py-2 pl-1 text-sm text-gray-500 truncate">
                    Signed in as {session?.user?.name}
                  </p>
                  <MobileGroup heading="Admin" items={ADMIN} onNavigate={close} />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 pl-1 text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 pl-1 text-blue-600 hover:text-blue-800 font-medium"
                  onClick={close}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
