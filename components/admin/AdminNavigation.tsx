'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { 
//   HomeIcon, 
//   PhotoIcon, 
//   DocumentTextIcon, 
//   CogIcon,
//   Bars3Icon,
//   XMarkIcon,
//   FolderIcon
// } from '@heroicons/react/24/outline'
import { useState } from 'react'

// const navigation = [
//   { name: 'Dashboard', href: '/admin', icon: HomeIcon },
//   { name: 'Photo Library', href: '/admin/photos', icon: PhotoIcon },
//   { name: 'Client Galleries', href: '/admin/galleries', icon: FolderIcon },
//   { name: 'Logs Viewer', href: '/admin/logs', icon: DocumentTextIcon },
//   { name: 'Settings', href: '/admin/settings', icon: CogIcon },
// ]
// Update src/components/admin/AdminNavigation.tsx to include blog management
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Photo Library', href: '/admin/photos', icon: PhotoIcon },
  { name: 'Client Galleries', href: '/admin/galleries', icon: FolderIcon },
  { name: 'Blog Posts', href: '/admin/blog', icon: DocumentTextIcon }, // NEW
  { name: 'Logs Viewer', href: '/admin/logs', icon: ClipboardDocumentListIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
]

// Add the import for the new icon
import { 
  HomeIcon, 
  PhotoIcon, 
  DocumentTextIcon, 
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  FolderIcon,
  ClipboardDocumentListIcon // NEW
} from '@heroicons/react/24/outline'
export default function AdminNavigation() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent pathname={pathname} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <SidebarContent pathname={pathname} />
          </div>
        </div>
      </div>
    </>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <h2 className="text-lg font-semibold text-gray-900">BAM Admin</h2>
      </div>
      <nav className="mt-8 flex-1" aria-label="Sidebar">
        <div className="px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} 
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}