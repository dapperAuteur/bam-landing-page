import { NextRequest } from 'next/server'
// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// All your other utility functions EXCEPT the auth ones
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