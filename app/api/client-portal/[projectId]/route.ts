import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'
import { validateClientSession } from '@/lib/auth/client-auth'
import { trackPortalView } from '@/lib/analytics/portal-analytics'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const project = await db.collection('client_projects').findOne({ projectId: params.projectId })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check expiration
    if (project.expiresAt && new Date(project.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This project link has expired' }, { status: 410 })
    }

    // If password required, check for client session token
    if (project.settings?.requirePassword) {
      const token = request.cookies.get('client-session')?.value
      if (token) {
        const session = await validateClientSession(db, token)
        if (session && session.projectId === params.projectId) {
          // Authenticated — return full project
          return NextResponse.json({ project: sanitizeProject(project), authenticated: true })
        }
      }
      // Not authenticated — return minimal info (no media, no proposal details)
      return NextResponse.json({
        project: {
          projectId: project.projectId,
          projectName: project.projectName,
          clientName: project.clientName,
          type: project.type,
          serviceCategory: project.serviceCategory,
          settings: { requirePassword: true }
        },
        authenticated: false
      })
    }

    // Track view
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

    return NextResponse.json({ project: sanitizeProject(project), authenticated: true })
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return NextResponse.json({ error: 'Failed to load project' }, { status: 500 })
  }
}

function sanitizeProject(project: any) {
  const { accessCode, _id, ...safe } = project
  return safe
}
