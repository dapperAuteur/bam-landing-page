import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'
import { createClientSession } from '@/lib/auth/client-auth'
import { trackPortalView } from '@/lib/analytics/portal-analytics'

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { accessCode } = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const project = await db.collection('client_projects').findOne({ projectId: params.projectId })

    if (!project || project.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid access code' }, { status: 401 })
    }

    // Create client session
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { token } = await createClientSession(db, params.projectId, project.clientEmail, ipAddress)

    // Track view if first time
    if (project.status === 'sent') {
      await db.collection('client_projects').updateOne(
        { projectId: params.projectId, status: 'sent' },
        {
          $set: { status: 'viewed', updatedAt: new Date() },
          $push: {
            statusHistory: {
              status: 'viewed',
              changedAt: new Date(),
              changedBy: 'client'
            }
          } as any
        }
      )
    }

    // Track analytics (non-blocking)
    trackPortalView(params.projectId, project.clientEmail || '', request).catch(() => {})

    const { accessCode: _, _id, ...safeProject } = project

    const response = NextResponse.json({ success: true, project: safeProject })

    // Set session cookie (httpOnly, 3 days)
    response.cookies.set('client-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 72 * 60 * 60, // 3 days
      path: `/portal/${params.projectId}`
    })

    return response
  } catch (error) {
    console.error('Authentication failed:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
