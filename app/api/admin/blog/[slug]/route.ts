import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { fireOutboxDrafts } from '@/lib/outbox-trigger'

const PUBLIC_BASE_URL = 'https://brandanthonymcdonald.com'

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

    // Look up prior state so we can detect hidden:true → false (the publish edge).
    const existing = await db.collection('blog_metadata').findOne({ slug })

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

    // Hidden → visible flip is the closest analogue to "publish" in this CMS.
    // Use the post-update title/excerpt (caller may have edited copy in the
    // same request) but pull the slug-keyed identity from the URL param.
    const becameVisible =
      existing?.hidden === true && body.hidden === false
    if (becameVisible) {
      const title = (updates.title ?? existing?.title ?? slug) as string
      const excerpt = (updates.excerpt ?? existing?.excerpt ?? '') as string
      fireOutboxDrafts({
        triggerUserId: session.user.id,
        externalRefBase: `bam-blog-${slug}`,
        caption: [
          `New post: "${title}"`,
          '',
          excerpt,
          '',
          `${PUBLIC_BASE_URL}/blog/${slug}`,
        ].join('\n'),
        mediaUrls: [],
        platforms: ['linkedin', 'twitter', 'bluesky'],
      })
    }

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
