import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/authOptions"
import { NextResponse } from "next/server"

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

export async function assertAdminOrUnauthorized(): Promise<NextResponse | null> {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
