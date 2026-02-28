'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
// import { useAuth } from './../../contexts/AuthContext'
import { signOut, useSession } from 'next-auth/react'


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { isAuthenticated, isAdmin, isLoading, logout } = useAuth()
  const { data: session, status } = useSession();
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === '/login') {
      return
    }

    // Wait for session to load before making auth decisions
    if (status === 'loading') {
      return
    }

    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    // If authenticated but not admin, redirect to home
    if (session && session.user?.role !== 'admin') {
      router.push('/')
      return
    }
  }, [session, status, router, pathname])

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show login page if on login route
  if (pathname === '/login') {
    return children
  }

  // Show unauthorized if not authenticated or not admin
  if (status === 'unauthenticated' || !session || session.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Render admin layout with navigation
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                BAM Admin Panel
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <nav className="flex space-x-1">
                {[
                  { href: '/admin/contact', label: 'Contact', match: '/admin/contact' },
                  { href: '/admin/logs', label: 'Logs', match: '/admin/logs' },
                  { href: '/admin/galleries', label: 'Galleries', match: '/admin/galleries' },
                  { href: '/admin/projects', label: 'Projects', match: '/admin/projects' },
                  { href: '/admin/blog', label: 'Blog', match: '/admin/blog' },
                  { href: '/admin/content', label: 'Content', match: '/admin/content' },
                  { href: '/admin/guide', label: 'Guide', match: '/admin/guide' },
                ].map(({ href, label, match }) => (
                  <a
                    key={href}
                    href={href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname?.startsWith(match)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-700">
                  Welcome, Admin
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}