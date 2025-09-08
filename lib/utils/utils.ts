/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth/authOptions"
import { authOptions } from '@/lib/auth/authOptions'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    throw new Error("Admin access required")
  }
  return user
}

// For API route protection
export function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.ADMIN_API_KEY
  
  if (!adminKey || !authHeader) return false
  
  const token = authHeader.replace('Bearer ', '')
  return token === adminKey
}

/**
 * Extract client IP address from NextRequest
 * Handles various proxy headers and edge cases
 */
export function getClientIp(request: NextRequest): string {
  // Check forwarded headers first (for proxies, load balancers, CDNs)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  // Check other common proxy headers
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp

  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
  if (cfConnectingIp) return cfConnectingIp

  const fastlyClientIp = request.headers.get('fastly-client-ip') // Fastly
  if (fastlyClientIp) return fastlyClientIp

  // Fallback to direct connection (when not behind proxy)
  if (request.ip) return request.ip

  // Final fallback
  return 'unknown'
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Generate a random ID for tracking
 */
export function generateTrackingId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Format date for logging
 */
export function formatLogDate(date: Date): string {
  return date.toISOString()
}

/**
 * Deep clone an object safely (handles circular references)
 */
export function safeClone(obj: any): any {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (error) {
    console.warn('Failed to clone object:', error)
    return {}
  }
}

/**
 * Check if request is from a bot/crawler
 */
export function isBot(userAgent: string): boolean {
  if (!userAgent) return false
  
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /http/i,
    /python/i,
    /postman/i,
    /insomnia/i
  ]
  
  return botPatterns.some(pattern => pattern.test(userAgent))
}

/**
 * Get user agent details
 */
export function parseUserAgent(userAgent: string): {
  browser?: string
  os?: string
  device?: string
  isBot: boolean
} {
  if (!userAgent) {
    return { isBot: false }
  }

  const result: any = {
    isBot: isBot(userAgent)
  }

  // Simple browser detection
  if (/Chrome/i.test(userAgent)) result.browser = 'Chrome'
  else if (/Firefox/i.test(userAgent)) result.browser = 'Firefox'
  else if (/Safari/i.test(userAgent)) result.browser = 'Safari'
  else if (/Edge/i.test(userAgent)) result.browser = 'Edge'

  // Simple OS detection
  if (/Windows/i.test(userAgent)) result.os = 'Windows'
  else if (/Macintosh|Mac OS/i.test(userAgent)) result.os = 'macOS'
  else if (/Linux/i.test(userAgent)) result.os = 'Linux'
  else if (/Android/i.test(userAgent)) result.os = 'Android'
  else if (/iPhone|iPad/i.test(userAgent)) result.os = 'iOS'

  // Simple device detection
  if (/Mobile/i.test(userAgent)) result.device = 'Mobile'
  else if (/Tablet/i.test(userAgent)) result.device = 'Tablet'
  else result.device = 'Desktop'

  return result
}

/**
 * Rate limiting helper
 */
export function createRateLimiter(windowMs: number, maxRequests: number) {
  const requests = new Map()

  return (identifier: string): { allowed: boolean; resetTime?: Date } => {
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [key, timestamps] of Array.from(requests.entries())) {
      requests.set(key, timestamps.filter((t: number) => t > windowStart))
      if (requests.get(key).length === 0) {
        requests.delete(key)
      }
    }

    // Check current requests for this identifier
    const userRequests = requests.get(identifier) || []
    
    if (userRequests.length >= maxRequests) {
      const resetTime = new Date(Math.min(...userRequests) + windowMs)
      return { allowed: false, resetTime }
    }

    // Add current request
    userRequests.push(now)
    requests.set(identifier, userRequests)

    return { allowed: true }
  }
}

/**
 * Format error for logging
 */
export function formatError(error: any): {
  message: string
  stack?: string
  name?: string
  code?: string
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: (error as any).code
    }
  }
  
  if (typeof error === 'string') {
    return { message: error }
  }
  
  return { message: String(error) }
}

/**
 * Check if environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Get current timestamp in milliseconds
 */
export function getTimestamp(): number {
  return Date.now()
}

/**
 * Calculate duration between two timestamps
 */
export function calculateDuration(startTime: number, endTime: number = Date.now()): number {
  return endTime - startTime
}