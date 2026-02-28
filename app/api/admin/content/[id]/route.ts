import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentId = decodeURIComponent(params.id)
    const body = await request.json()

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    const overrideUpdates: Record<string, boolean> = {}

    const editableFields = ['title', 'description', 'featured', 'hidden', 'displayOrder', 'data']

    for (const field of editableFields) {
      if (field in body) {
        updates[field] = body[field]
        if (!['hidden', 'displayOrder'].includes(field)) {
          overrideUpdates[`overrides.${field}`] = true
        }
      }
    }

    await db.collection('content_metadata').updateOne(
      { contentId },
      { $set: { ...updates, ...overrideUpdates } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update content metadata:', error)
    return NextResponse.json({ error: 'Failed to update content metadata' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentId = decodeURIComponent(params.id)

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    await db.collection('content_metadata').deleteOne({ contentId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete content metadata:', error)
    return NextResponse.json({ error: 'Failed to delete content metadata' }, { status: 500 })
  }
}
