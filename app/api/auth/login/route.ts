// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken, createAuthCookie } from './../../../../lib/auth/auth-utils'
import { LoginRequest, LoginResponse } from './../../../../types/auth'

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    console.log('email :>> ', email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      } as LoginResponse, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      } as LoginResponse, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken(user)
    
    // Create response with auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user
    } as LoginResponse)

    // Set HTTP-only cookie
    response.headers.set('Set-Cookie', createAuthCookie(token))

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    } as LoginResponse, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}