/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import clientPromise from './../db/mongodb'
import { User, AuthUser, SessionData } from './../../types/auth'
import { Logger, LogContext } from '@/lib/logging/app-logger'
import { logAuthEvent } from '@/lib/logging/authLogger'
import { AuthEventType } from '@/models/AuthLog'

// Auth configuration - Type-safe JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. Please add it to your .env.local file.')
}
// TypeScript now knows JWT_SECRET is definitely a string after the check
const SECRET_KEY: string = JWT_SECRET

const JWT_EXPIRES_IN = '7d' // 7 days
const COOKIE_NAME = 'session-token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  await Logger.debug(LogContext.AUTH, 'Hashing password', {
    metadata: { saltRounds, passwordLength: password.length }
  })
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    await Logger.debug(LogContext.AUTH, 'Verifying password', {
      metadata: { 
        passwordLength: password.length, 
        hashLength: hash.length,
        hashPrefix: hash.substring(0, 10) + '...'
      }
    })
    
    const isValid = await bcrypt.compare(password, hash)
    
    await Logger.debug(LogContext.AUTH, 'Password verification result', {
      metadata: { isValid }
    })
    
    return isValid
  } catch (error) {
    await Logger.error(LogContext.AUTH, 'Password verification error', {
      metadata: { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    })
    return false
  }
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

  Logger.debug(LogContext.AUTH, 'Generating JWT token', {
    userId: user.id,
    metadata: { 
      userEmail: user.email, 
      userRole: user.role,
      expiresAt: new Date(payload.expiresAt).toISOString()
    }
  })

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN })
  
  Logger.info(LogContext.AUTH, 'JWT token generated successfully', {
    userId: user.id,
    metadata: { 
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 20) + '...'
    }
  })

  return token
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): SessionData | null {
  try {
    Logger.debug(LogContext.AUTH, 'Verifying JWT token', {
      metadata: { 
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 20) + '...'
      }
    })

    const decoded = jwt.verify(token, SECRET_KEY) as SessionData
    
    // Check if token is expired
    if (decoded.expiresAt < Date.now()) {
      Logger.warning(LogContext.AUTH, 'JWT token expired', {
        userId: decoded.userId,
        metadata: { 
          expiresAt: new Date(decoded.expiresAt).toISOString(),
          currentTime: new Date().toISOString(),
          userEmail: decoded.email
        }
      })
      return null
    }
    
    Logger.debug(LogContext.AUTH, 'JWT token verified successfully', {
      userId: decoded.userId,
      metadata: { 
        userEmail: decoded.email,
        userRole: decoded.role,
        loginTime: new Date(decoded.loginTime).toISOString()
      }
    })
    
    return decoded
  } catch (error) {
    Logger.warning(LogContext.AUTH, 'JWT token verification failed', {
      metadata: { 
        error: error instanceof Error ? error.message : String(error),
        tokenLength: token.length,
        errorType: error?.constructor?.name
      }
    })
    return null
  }
}

/**
 * Get the current user from the request
 */
export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  const requestId = Math.random().toString(36).substring(2, 15)
  
  try {
    await Logger.debug(LogContext.AUTH, 'Getting current user from request', {
      request,
      requestId,
      metadata: { 
        cookieNames: request.cookies.getAll().map(c => c.name),
        url: request.url,
        method: request.method
      }
    })

    const token = request.cookies.get(COOKIE_NAME)?.value
    
    if (!token) {
      await Logger.debug(LogContext.AUTH, 'No auth token found in cookies', {
        request,
        requestId,
        metadata: { 
          cookieName: COOKIE_NAME,
          availableCookies: request.cookies.getAll().map(c => c.name)
        }
      })
      return null
    }

    await Logger.debug(LogContext.AUTH, 'Auth token found, verifying', {
      request,
      requestId,
      metadata: { 
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 20) + '...'
      }
    })

    const sessionData = verifyToken(token)
    if (!sessionData) {
      await Logger.warning(LogContext.AUTH, 'Invalid or expired token', {
        request,
        requestId,
        metadata: { 
          tokenLength: token.length,
          reason: 'token_verification_failed'
        }
      })
      return null
    }

    await Logger.debug(LogContext.AUTH, 'Token verified, checking user in database', {
      request,
      requestId,
      userId: sessionData.userId,
      metadata: { 
        userEmail: sessionData.email,
        userRole: sessionData.role
      }
    })

    // Verify user still exists and is active
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    let userObjectId: ObjectId
    try {
      userObjectId = new ObjectId(sessionData.userId)
    } catch (error) {
      await Logger.error(LogContext.AUTH, 'Invalid user ID format in token', {
        request,
        requestId,
        metadata: { 
          userId: sessionData.userId,
          error: error instanceof Error ? error.message : String(error)
        }
      })
      return null
    }

    const user = await db.collection<User>('users').findOne({
      _id: userObjectId,
      isActive: true
    })

    if (!user) {
      await Logger.warning(LogContext.AUTH, 'User not found or inactive in database', {
        request,
        requestId,
        userId: sessionData.userId,
        metadata: { 
          userEmail: sessionData.email,
          reason: 'user_not_found_or_inactive'
        }
      })
      return null
    }

    await Logger.info(LogContext.AUTH, 'User successfully authenticated', {
      request,
      requestId,
      userId: user._id!.toString(),
      metadata: { 
        userEmail: user.email,
        userRole: user.role,
        userName: user.name,
        lastLoginAt: user.lastLoginAt?.toISOString()
      }
    })

    return {
      id: user._id!.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }
  } catch (error) {
    await Logger.error(LogContext.AUTH, 'Error getting current user', {
      request,
      requestId,
      metadata: { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        errorType: error?.constructor?.name
      }
    })
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const user = await getCurrentUser(request)
    const authenticated = user !== null
    
    await Logger.debug(LogContext.AUTH, 'Authentication check result', {
      request,
      userId: user?.id,
      metadata: { 
        authenticated,
        userEmail: user?.email
      }
    })
    
    return authenticated
  } catch (error) {
    await Logger.error(LogContext.AUTH, 'Error checking authentication', {
      request,
      metadata: { 
        error: error instanceof Error ? error.message : String(error)
      }
    })
    return false
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    const user = await getCurrentUser(request)
    const isAdminUser = user !== null && user.role === 'admin'
    
    await Logger.debug(LogContext.AUTH, 'Admin check result', {
      request,
      userId: user?.id,
      metadata: { 
        isAdmin: isAdminUser,
        userEmail: user?.email,
        userRole: user?.role
      }
    })
    
    return isAdminUser
  } catch (error) {
    await Logger.error(LogContext.AUTH, 'Error checking admin status', {
      request,
      metadata: { 
        error: error instanceof Error ? error.message : String(error)
      }
    })
    return false
  }
}

/**
 * Create auth cookie
 */
export function createAuthCookie(token: string): string {
  Logger.debug(LogContext.AUTH, 'Creating auth cookie', {
    metadata: { 
      cookieName: COOKIE_NAME,
      maxAge: COOKIE_MAX_AGE,
      tokenLength: token.length
    }
  })
  
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}; Path=/`
}

/**
 * Create logout cookie (clears the auth cookie)
 */
export function createLogoutCookie(): string {
  Logger.info(LogContext.AUTH, 'Creating logout cookie', {
    metadata: { 
      cookieName: COOKIE_NAME,
      action: 'clear_cookie'
    }
  })
  
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string, request?: NextRequest): Promise<AuthUser | null> {
  const requestId = Math.random().toString(36).substring(2, 15)
  
  try {
    await Logger.info(LogContext.AUTH, 'User authentication attempt', {
      request,
      requestId,
      metadata: { 
        email: email.toLowerCase(),
        passwordLength: password.length
      }
    })

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const user = await db.collection<User>('users').findOne({
      email: email.toLowerCase(),
      isActive: true
    })

    if (!user) {
      await Logger.warning(LogContext.AUTH, 'Authentication failed: User not found', {
        request,
        requestId,
        metadata: { 
          email: email.toLowerCase(),
          reason: 'user_not_found'
        }
      })

      // Log failed authentication
      if (request) {
        await logAuthEvent({
          request,
          event: AuthEventType.LOGIN_FAILURE,
          email: email.toLowerCase(),
          status: 'failure',
          reason: 'user_not_found',
          metadata: { requestId }
        })
      }

      return null
    }

    await Logger.debug(LogContext.AUTH, 'User found, verifying password', {
      request,
      requestId,
      userId: user._id!.toString(),
      metadata: { 
        userEmail: user.email,
        userRole: user.role,
        userCreatedAt: user.createdAt?.toISOString()
      }
    })

    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      await Logger.warning(LogContext.AUTH, 'Authentication failed: Invalid password', {
        request,
        requestId,
        userId: user._id!.toString(),
        metadata: { 
          userEmail: user.email,
          reason: 'invalid_password'
        }
      })

      // Log failed authentication
      if (request) {
        await logAuthEvent({
          request,
          event: AuthEventType.LOGIN_FAILURE,
          userId: user._id!.toString(),
          email: user.email,
          status: 'failure',
          reason: 'invalid_password',
          metadata: { requestId }
        })
      }

      return null
    }

    // Update last login time
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    )

    await Logger.info(LogContext.AUTH, 'User authentication successful', {
      request,
      requestId,
      userId: user._id!.toString(),
      metadata: { 
        userEmail: user.email,
        userRole: user.role,
        userName: user.name
      }
    })

    // Log successful authentication
    if (request) {
      await logAuthEvent({
        request,
        event: AuthEventType.LOGIN,
        userId: user._id!.toString(),
        email: user.email,
        status: 'success',
        metadata: { requestId }
      })
    }

    return {
      id: user._id!.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }
  } catch (error) {
    await Logger.error(LogContext.AUTH, 'Error authenticating user', {
      request,
      requestId,
      metadata: { 
        email: email.toLowerCase(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        errorType: error?.constructor?.name
      }
    })

    // Log failed authentication due to system error
    if (request) {
      await logAuthEvent({
        request,
        event: AuthEventType.LOGIN_FAILURE,
        email: email.toLowerCase(),
        status: 'failure',
        reason: 'system_error',
        metadata: { 
          requestId, 
          error: error instanceof Error ? error.message : String(error) 
        }
      })
    }

    return null
  }
}

/**
 * Create admin user (run this once to set up your admin account)
 */
export async function createAdminUser(email: string, password: string, name: string): Promise<User | null> {
  try {
    await Logger.info(LogContext.AUTH, 'Creating admin user', {
      metadata: { 
        email: email.toLowerCase(),
        name,
        passwordLength: password.length
      }
    })

    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    // Check if user already exists
    const existingUser = await db.collection<User>('users').findOne({ email: email.toLowerCase() })
    if (existingUser) {
      await Logger.warning(LogContext.AUTH, 'Admin user creation failed: User already exists', {
        metadata: { 
          email: email.toLowerCase(),
          existingUserId: existingUser._id?.toString()
        }
      })
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
    
    await Logger.info(LogContext.AUTH, 'Admin user created successfully', {
      userId: result.insertedId.toString(),
      metadata: { 
        userEmail: user.email,
        userName: user.name,
        userRole: user.role
      }
    })
    
    return {
      ...user,
      _id: result.insertedId
    }
  } catch (error) {
    await Logger.error(LogContext.AUTH, 'Error creating admin user', {
      metadata: { 
        email: email.toLowerCase(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    })
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
      await Logger.warning(LogContext.AUTH, 'Route access denied: User not authenticated', {
        request,
        metadata: { 
          url: request.url,
          method: request.method
        }
      })

      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in to access this resource' },
        { status: 401 }
      )
    }

    await Logger.debug(LogContext.AUTH, 'Route access granted: User authenticated', {
      request,
      userId: user.id,
      metadata: { 
        userEmail: user.email,
        userRole: user.role,
        url: request.url
      }
    })

    return handler(request, user)
  }
}

/**
 * Middleware helper to protect admin routes
 */
export function withAdminAuth(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return withAuth(async (request, user) => {
    if (user.role !== 'admin') {
      await Logger.warning(LogContext.AUTH, 'Admin route access denied: Insufficient permissions', {
        request,
        userId: user.id,
        metadata: { 
          userEmail: user.email,
          userRole: user.role,
          url: request.url,
          requiredRole: 'admin'
        }
      })

      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      )
    }

    await Logger.debug(LogContext.AUTH, 'Admin route access granted', {
      request,
      userId: user.id,
      metadata: { 
        userEmail: user.email,
        userRole: user.role,
        url: request.url
      }
    })

    return handler(request, user)
  })
}