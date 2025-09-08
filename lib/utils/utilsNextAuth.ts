import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/authOptions"
import { NextRequest } from "next/server"

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