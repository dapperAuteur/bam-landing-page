// lib/auth/edge-auth-utils.ts
// Edge Runtime compatible auth utilities for middleware

import { SessionData } from './../../types/auth'

/**
 * Simple base64 decode that works in Edge Runtime
 */
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  
  // Add padding if needed
  while (str.length % 4) {
    str += '='
  }
  
  try {
    // Use built-in atob (available in Edge Runtime)
    return atob(str)
  } catch {
    return ''
  }
}

/**
 * Parse JWT payload without verification (for middleware only)
 * Note: This doesn't verify the signature - only use for basic checks
 */
function parseJwtPayload(token: string): SessionData | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = base64UrlDecode(parts[1])
    if (!payload) {
      return null
    }

    const data = JSON.parse(payload) as SessionData
    
    // Check if token is expired
    if (data.expiresAt && data.expiresAt < Date.now()) {
      return null
    }

    return data
  } catch {
    return null
  }
}

/**
 * Basic token validation for Edge Runtime (middleware)
 * Only checks structure and expiration, not signature
 */
export function validateTokenBasic(token: string): { valid: boolean; isAdmin: boolean } {
  if (!token) {
    return { valid: false, isAdmin: false }
  }

  const payload = parseJwtPayload(token)
  
  if (!payload) {
    return { valid: false, isAdmin: false }
  }

  return {
    valid: true,
    isAdmin: payload.role === 'admin'
  }
}

/**
 * Extract user info from token (Edge Runtime safe)
 */
export function getTokenPayload(token: string): SessionData | null {
  return parseJwtPayload(token)
}