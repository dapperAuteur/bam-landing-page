import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { projects } from '@/lib/projectData'
import { experiences } from '@/lib/experienceData'
import { skillCategories } from '@/lib/skillCategoryData'
import { fireOutboxDrafts } from '@/lib/outbox-trigger'

const PUBLIC_BASE_URL = 'https://brandanthonymcdonald.com'

function slugifyTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function buildProjectCaption(p: Record<string, unknown>): string {
  const title = (p.title as string) || 'New project'
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

function buildExperienceCaption(e: Record<string, unknown>): string {
  const title = (e.title as string) || 'New engagement'
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const type = request.nextUrl.searchParams.get('type')
    if (!type || !['project', 'experience', 'skill'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const items = await db.collection('content_metadata')
      .find({ type })
      .sort({ displayOrder: 1 })
      .toArray()

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Failed to fetch content metadata:', error)
    return NextResponse.json({ error: 'Failed to fetch content metadata' }, { status: 500 })
  }
}

// POST - Sync content metadata from code into MongoDB
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await request.json()
    if (!type || !['project', 'experience', 'skill'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const collection = db.collection('content_metadata')

    let created = 0
    let updated = 0
    let sourceItems: { contentId: string; title: string; data: Record<string, unknown> }[] = []

    if (type === 'project') {
      sourceItems = projects.map((p, i) => ({
        contentId: `project-${i}`,
        title: p.title,
        data: { ...p },
      }))
    } else if (type === 'experience') {
      sourceItems = experiences.map(e => ({
        contentId: `experience-${e.id}`,
        title: e.title,
        data: { ...e },
      }))
    } else if (type === 'skill') {
      sourceItems = skillCategories.map((s, i) => ({
        contentId: `skill-${i}`,
        title: s.category,
        data: { ...s },
      }))
    }

    for (const item of sourceItems) {
      const existing = await collection.findOne({ contentId: item.contentId, type })

      if (existing) {
        const overrides = existing.overrides || {}
        const updates: Record<string, unknown> = { updatedAt: new Date() }

        if (!overrides.title) updates.title = item.title
        if (!overrides.data) updates.data = item.data
        if (!overrides.featured) {
          updates.featured = (item.data as Record<string, unknown>).featured || false
        }

        await collection.updateOne(
          { contentId: item.contentId, type },
          { $set: updates }
        )
        updated++
      } else {
        await collection.insertOne({
          contentId: item.contentId,
          type,
          title: item.title,
          description: (item.data as Record<string, unknown>).description as string || '',
          featured: (item.data as Record<string, unknown>).featured as boolean || false,
          hidden: false,
          displayOrder: 999,
          overrides: {},
          data: item.data,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        created++

        // New row inserts hidden:false → publicly visible immediately. Fire
        // outbox drafts based on type. Skill rows have no recipe; skip.
        if (type === 'project') {
          fireOutboxDrafts({
            triggerUserId: session.user.id,
            externalRefBase: `bam-project-${slugifyTitle(item.title)}`,
            caption: buildProjectCaption(item.data),
            mediaUrls: [],
            platforms: ['linkedin', 'twitter', 'bluesky'],
          })
        } else if (type === 'experience') {
          fireOutboxDrafts({
            triggerUserId: session.user.id,
            externalRefBase: `bam-speaking-${item.contentId}`,
            caption: buildExperienceCaption(item.data),
            mediaUrls: [],
            platforms: ['linkedin', 'twitter', 'bluesky'],
          })
        }
      }
    }

    return NextResponse.json({ success: true, created, updated, total: sourceItems.length })
  } catch (error) {
    console.error('Failed to sync content metadata:', error)
    return NextResponse.json({ error: 'Failed to sync content metadata' }, { status: 500 })
  }
}
