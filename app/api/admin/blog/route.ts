import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { blogPosts } from '@/lib/blogData'
import { fireOutboxDrafts } from '@/lib/outbox-trigger'

const PUBLIC_BASE_URL = 'https://brandanthonymcdonald.com'

function buildBlogCaption(post: {
  slug: string
  title: string
  excerpt: string
}): string {
  return [
    `New post: "${post.title}"`,
    '',
    post.excerpt,
    '',
    `${PUBLIC_BASE_URL}/blog/${post.slug}`,
  ].join('\n')
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const posts = await db.collection('blog_metadata')
      .find({})
      .sort({ featuredOrder: 1, publishDate: -1 })
      .toArray()

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Failed to fetch blog metadata:', error)
    return NextResponse.json({ error: 'Failed to fetch blog metadata' }, { status: 500 })
  }
}

// POST - Sync blog metadata from code (blogData.ts) into MongoDB.
// Query: ?asHidden=true → new rows insert hidden, no outbox trigger fires.
// Use this for backfilling many posts at once without flooding the outbox.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const asHidden = request.nextUrl.searchParams.get('asHidden') === 'true'

    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const collection = db.collection('blog_metadata')

    let created = 0
    let updated = 0

    for (const post of blogPosts) {
      const existing = await collection.findOne({ slug: post.slug })

      if (existing) {
        // Update non-overridden fields only
        const updates: Record<string, unknown> = { updatedAt: new Date() }
        const overrides = existing.overrides || {}

        if (!overrides.title) updates.title = post.title
        if (!overrides.description) updates.description = post.description
        if (!overrides.publishDate) updates.publishDate = post.publishDate
        if (!overrides.readTime) updates.readTime = post.readTime
        if (!overrides.category) updates.category = post.category
        if (!overrides.featured) updates.featured = post.featured || false
        if (!overrides.tags) updates.tags = post.tags
        if (!overrides.excerpt) updates.excerpt = post.excerpt

        await collection.updateOne(
          { slug: post.slug },
          { $set: updates }
        )
        updated++
      } else {
        // Insert new entry. asHidden=true backfills the row hidden so it
        // shows up in admin but isn't publicly visible — operator un-hides
        // later via PUT, which is the publish edge that fires the trigger.
        await collection.insertOne({
          slug: post.slug,
          title: post.title,
          description: post.description,
          publishDate: post.publishDate,
          readTime: post.readTime,
          category: post.category,
          featured: post.featured || false,
          tags: post.tags,
          excerpt: post.excerpt,
          hidden: asHidden,
          featuredOrder: 999,
          overrides: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        created++

        // Only fire on insert when the row was inserted publicly visible.
        // Backfill mode (asHidden) defers the trigger to the un-hide step.
        if (!asHidden) {
          fireOutboxDrafts({
            triggerUserId: session.user.id,
            externalRefBase: `bam-blog-${post.slug}`,
            caption: buildBlogCaption(post),
            mediaUrls: [],
            platforms: ['linkedin', 'twitter', 'bluesky'],
          })
        }
      }
    }

    return NextResponse.json({ success: true, created, updated, total: blogPosts.length, asHidden })
  } catch (error) {
    console.error('Failed to sync blog metadata:', error)
    return NextResponse.json({ error: 'Failed to sync blog metadata' }, { status: 500 })
  }
}
