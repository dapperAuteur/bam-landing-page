// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createLogoutCookie } from './../../../../lib/auth/auth-utils'

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear auth cookie
    response.headers.set('Set-Cookie', createLogoutCookie())

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}