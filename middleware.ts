import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth/auth-utils'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for non-admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check authentication for all other admin routes
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token
  const sessionData = verifyToken(token)
  
  if (!sessionData || sessionData.role !== 'admin') {
    // Redirect to login if invalid token or not admin
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow access for valid admin users
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}