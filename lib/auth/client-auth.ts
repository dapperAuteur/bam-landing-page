import jwt from 'jsonwebtoken'
import { Db } from 'mongodb'

const CLIENT_JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || ''
const CLIENT_SESSION_EXPIRY_HOURS = 72 // 3 days

export interface ClientTokenPayload {
  projectId: string
  clientEmail: string
  sessionId: string
}

export function generateClientToken(projectId: string, clientEmail: string, sessionId: string): string {
  return jwt.sign(
    { projectId, clientEmail, sessionId } satisfies ClientTokenPayload,
    CLIENT_JWT_SECRET,
    { expiresIn: `${CLIENT_SESSION_EXPIRY_HOURS}h` }
  )
}

export function verifyClientToken(token: string): ClientTokenPayload | null {
  try {
    return jwt.verify(token, CLIENT_JWT_SECRET) as ClientTokenPayload
  } catch {
    return null
  }
}

export async function createClientSession(
  db: Db,
  projectId: string,
  clientEmail: string,
  ipAddress: string
): Promise<{ token: string; sessionId: string }> {
  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const token = generateClientToken(projectId, clientEmail, sessionId)

  await db.collection('client_sessions').insertOne({
    sessionId,
    projectId,
    clientEmail,
    token,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + CLIENT_SESSION_EXPIRY_HOURS * 60 * 60 * 1000),
    ipAddress
  })

  return { token, sessionId }
}

export async function validateClientSession(
  db: Db,
  token: string
): Promise<ClientTokenPayload | null> {
  const payload = verifyClientToken(token)
  if (!payload) return null

  const session = await db.collection('client_sessions').findOne({
    sessionId: payload.sessionId,
    expiresAt: { $gt: new Date() }
  })

  if (!session) return null
  return payload
}
