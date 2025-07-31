'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container-max">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            BAM
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
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
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <Link href="/#services" className="block py-2 text-gray-700 hover:text-blue-600">
              Services
            </Link>
            <Link href="/experience" className="block py-2 text-gray-700 hover:text-blue-600">
              Experience
            </Link>
            <Link href="/blog" className="block py-2 text-gray-700 hover:text-blue-600">
              Blog
            </Link>
            <Link href="/#about" className="block py-2 text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link href="/#portfolio" className="block py-2 text-gray-700 hover:text-blue-600">
              Portfolio
            </Link>
            <Link href="/#contact" className="block py-2 text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}