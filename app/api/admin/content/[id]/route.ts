import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { fireOutboxDrafts } from '@/lib/outbox-trigger'

const PUBLIC_BASE_URL = 'https://brandanthonymcdonald.com'

function slugifyTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function buildProjectCaption(p: Record<string, unknown>, fallbackTitle: string): string {
  const title = (p.title as string) || fallbackTitle
  const description = (p.description as string) || ''
  const technologies = Array.isArray(p.technologies) ? (p.technologies as string[]) : []
  const link = (p.link as string) || `${PUBLIC_BASE_URL}/`
  return [
    `New project: "${title}"`,
    description,
    technologies.length ? `Stack: ${technologies.join(', ')}` : '',
    link,
  ].filter(Boolean).join('\n')
}

function buildExperienceCaption(e: Record<string, unknown>, fallbackTitle: string): string {
  const title = (e.title as string) || fallbackTitle
  const company = (e.company as string) || ''
  const period = (e.period as string) || ''
  const description = (e.description as string) || ''
  const lead = company ? `${title} — ${company}` : title
  return [
    period ? `${lead} (${period})` : lead,
    description,
    `${PUBLIC_BASE_URL}/experience`,
  ].filter(Boolean).join('\n')
}

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

    // Look up prior state so we can detect hidden:true → false (the publish edge).
    const existing = await db.collection('content_metadata').findOne({ contentId })

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

    // Hidden → visible flip is the closest analogue to "publish" for portfolio
    // content. Use post-update title/data when caller edited them in the same
    // request; otherwise fall back to the existing row.
    const becameVisible = existing?.hidden === true && body.hidden === false
    if (becameVisible) {
      const type = existing?.type as string | undefined
      const title = (updates.title ?? existing?.title ?? contentId) as string
      const data = (updates.data ?? existing?.data ?? {}) as Record<string, unknown>
      if (type === 'project') {
        fireOutboxDrafts({
          triggerUserId: session.user.id,
          externalRefBase: `bam-project-${slugifyTitle(title)}`,
          caption: buildProjectCaption(data, title),
          mediaUrls: [],
          platforms: ['linkedin', 'twitter', 'bluesky'],
        })
      } else if (type === 'experience') {
        fireOutboxDrafts({
          triggerUserId: session.user.id,
          externalRefBase: `bam-speaking-${contentId}`,
          caption: buildExperienceCaption(data, title),
          mediaUrls: [],
          platforms: ['linkedin', 'twitter', 'bluesky'],
        })
      }
    }

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
