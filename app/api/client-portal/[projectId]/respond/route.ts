import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'
import { validateClientSession } from '@/lib/auth/client-auth'
import type { ProposalStatus } from '@/types/client-portal'

const ALLOWED_CLIENT_STATUSES: ProposalStatus[] = ['approved', 'rejected', 'revised']

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')

    // Verify client is authenticated
    const project = await db.collection('client_projects').findOne({ projectId: params.projectId })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check settings allow approval
    if (!project.settings?.allowApproval) {
      return NextResponse.json({ error: 'Approval not enabled for this project' }, { status: 403 })
    }

    const { status, note } = await request.json()

    if (!ALLOWED_CLIENT_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid response status' }, { status: 400 })
    }

    const changedBy = project.clientEmail || 'client'

    await db.collection('client_projects').updateOne(
      { projectId: params.projectId },
      {
        $set: { status, updatedAt: new Date() },
        $push: {
          statusHistory: {
            status,
            changedAt: new Date(),
            changedBy,
            note: note || undefined
          }
        } as any
      }
    )

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Failed to process response:', error)
    return NextResponse.json({ error: 'Failed to process response' }, { status: 500 })
  }
}
