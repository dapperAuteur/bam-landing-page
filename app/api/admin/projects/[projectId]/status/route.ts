import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import type { ProposalStatus } from '@/types/client-portal'

const VALID_STATUSES: ProposalStatus[] = ['draft', 'sent', 'viewed', 'approved', 'rejected', 'revised']

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status, note } = await request.json()

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const result = await db.collection('client_projects').updateOne(
      { projectId: params.projectId },
      {
        $set: { status, updatedAt: new Date() },
        $push: {
          statusHistory: {
            status,
            changedAt: new Date(),
            changedBy: 'admin',
            note: note || undefined
          }
        } as any
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
