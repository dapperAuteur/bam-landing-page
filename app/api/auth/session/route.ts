// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from './../../../../lib/auth/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null
      }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: !!user,
      user: user || undefined
    })

  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({
      authenticated: false,
      user: undefined
    })
  }
}