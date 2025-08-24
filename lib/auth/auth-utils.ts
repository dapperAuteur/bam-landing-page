/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import clientPromise from './../db/mongodb'
import { User, AuthUser, SessionData } from './../../types/auth'

// Auth configuration - Type-safe JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. Please add it to your .env.local file.')
}
// TypeScript now knows JWT_SECRET is definitely a string after the check
const SECRET_KEY: string = JWT_SECRET

const JWT_EXPIRES_IN = '7d' // 7 days
const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: AuthUser): string {
  const payload: SessionData = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    loginTime: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  }

  return jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): SessionData | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as SessionData
    
    // Check if token is expired
    if (decoded.expiresAt < Date.now()) {
      return null
    }
    
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Get the current user from the request
 */
export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    
    if (!token) {
      return null
    }

    const sessionData = verifyToken(token)
    if (!sessionData) {
      return null
    }

    // Verify user still exists and is active
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const user = await db.collection<User>('users').findOne({
      _id: new ObjectId(sessionData.userId),
      isActive: true
    })

    if (!user) {
      return null
    }

    return {
      id: user._id!.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request)
  return user !== null
}

/**
 * Check if user is admin
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request)
  return user !== null && user.role === 'admin'
}

/**
 * Create auth cookie
 */
export function createAuthCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}; Path=/`
}

/**
 * Create logout cookie (clears the auth cookie)
 */
export function createLogoutCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const user = await db.collection<User>('users').findOne({
      email: email.toLowerCase(),
      isActive: true
    })

    if (!user) {
      return null
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return null
    }

    // Update last login time
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    )

    return {
      id: user._id!.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return null
  }
}

/**
 * Create admin user (run this once to set up your admin account)
 */
export async function createAdminUser(email: string, password: string, name: string): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    // Check if user already exists
    const existingUser = await db.collection<User>('users').findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const passwordHash = await hashPassword(password)
    
    const user: User = {
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
      name,
      createdAt: new Date(),
      isActive: true
    }

    const result = await db.collection<User>('users').insertOne(user)
    
    return {
      ...user,
      _id: result.insertedId
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
    return null
  }
}

/**
 * Middleware helper to protect routes
 */
export function withAuth(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in to access this resource' },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

/**
 * Middleware helper to protect admin routes
 */
export function withAdminAuth(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return withAuth(async (request, user) => {
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      )
    }
    return handler(request, user)
  })
}