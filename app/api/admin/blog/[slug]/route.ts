import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slug = decodeURIComponent(params.slug)
    const body = await request.json()

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    // Build update object and track overrides
    const updates: Record<string, unknown> = { updatedAt: new Date() }
    const overrideUpdates: Record<string, boolean> = {}

    const editableFields = ['title', 'description', 'publishDate', 'readTime', 'category', 'featured', 'tags', 'excerpt', 'hidden', 'featuredOrder']

    for (const field of editableFields) {
      if (field in body) {
        updates[field] = body[field]
        // Track non-structural fields as overrides
        if (!['hidden', 'featuredOrder'].includes(field)) {
          overrideUpdates[`overrides.${field}`] = true
        }
      }
    }

    await db.collection('blog_metadata').updateOne(
      { slug },
      { $set: { ...updates, ...overrideUpdates } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update blog metadata:', error)
    return NextResponse.json({ error: 'Failed to update blog metadata' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slug = decodeURIComponent(params.slug)

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    await db.collection('blog_metadata').deleteOne({ slug })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete blog metadata:', error)
    return NextResponse.json({ error: 'Failed to delete blog metadata' }, { status: 500 })
  }
}
