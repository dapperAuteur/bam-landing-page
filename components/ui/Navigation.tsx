'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Linkedin, Github } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const {data: session } = useSession();


  const handleLogout = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 ">
      <div className="mx-2 container-max">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            BAM
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/experience" className="text-gray-700 hover:text-blue-600 transition-colors">
              Experience
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/#portfolio" className="text-gray-700 hover:text-blue-600 transition-colors">
              Portfolio
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
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

            {/* Auth Buttons */}
            {session ? (
              <div className="flex items-center space-x-4">
                {session && (
                  <div>
                    <Link href="/admin/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                      Contacts
                    </Link>
                    <span className="text-gray-600 text-sm">/</span>
                    <Link href="/admin/logs" className="text-blue-600 hover:text-blue-800 font-medium">
                      Logs
                    </Link>
                    <span className="text-gray-600 text-sm">/</span>
                    <Link href="/admin/galleries" className="text-blue-600 hover:text-blue-800 font-medium">
                      Galleries
                    </Link>
                  </div>
                )}
                <span className="text-gray-600 text-sm">
                  {session?.user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
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
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/#services" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <Link href="/experience" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Experience
            </Link>
            <Link href="/blog" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Blog
            </Link>
            <Link href="/#about" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/#portfolio" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Portfolio
            </Link>
            <Link href="/#contact" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            
            {/* Mobile Auth */}
            <div className="pt-2 border-t border-gray-200">
              {session ? (
                <>
                  <div className="py-2 text-gray-600 text-sm">
                    Welcome, {session?.user?.name}
                  </div>
                  {session && (
                    <Link 
                      href="/admin/contact" 
                      className="block py-2 text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => setIsOpen(false)}
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