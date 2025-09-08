// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { Logger, LogContext } from '@/lib/logging/app-logger'

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 15)
  
  try {
    // Log the session check attempt
    await Logger.info(LogContext.AUTH, 'NextAuth session check initiated', {
      request,
      requestId,
      metadata: {
        url: request.nextUrl.href,
        cookies: request.cookies.getAll().map(cookie => cookie.name),
        hasNextAuthToken: !!request.cookies.get('next-auth.session-token')
      }
    })

    // Get session using NextAuth
    const session = await getServerSession(authOptions)
    
    if (!session) {
      await Logger.warning(LogContext.AUTH, 'NextAuth session not found', {
        request,
        requestId,
        metadata: {
          reason: 'no_valid_session',
          cookiesPresent: request.cookies.getAll().map(cookie => cookie.name)
        }
      })

      return NextResponse.json({
        authenticated: false,
        user: null,
        error: 'No valid session found'
      }, { status: 401 })
    }

    // Success! Log the successful session check
    await Logger.info(LogContext.AUTH, 'NextAuth session found', {
      request,
      requestId,
      metadata: {
        userEmail: session.user?.email,
        userId: session.user?.id || 'unknown',
        sessionExpires: session.expires
      }
    })

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user?.id || session.user?.email, // Fallback to email if no ID
        email: session.user?.email,
        name: session.user?.name,
        role: session.user?.role || 'user' // Add role if you have it
      }
    })

  } catch (error) {
    await Logger.error(LogContext.AUTH, 'NextAuth session check error', {
      request,
      requestId,
      metadata: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    })

    return NextResponse.json({
      authenticated: false,
      user: null,
      error: 'Session check failed'
    }, { status: 500 })
  }
}