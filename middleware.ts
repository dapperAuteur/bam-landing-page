// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateTokenBasic } from './lib/auth/edge-auth-utils'

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

  // Basic token validation (structure and expiration only)
  const { valid, isAdmin } = validateTokenBasic(token)
  
  if (!valid || !isAdmin) {
    // Redirect to login if invalid token or not admin
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow access for valid admin users
  // Note: Full token verification (including signature) happens in components/API routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}