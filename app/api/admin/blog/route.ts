import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { blogPosts } from '@/lib/blogData'

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

// POST - Sync blog metadata from code (blogData.ts) into MongoDB
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
        // Insert new entry
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
          hidden: false,
          featuredOrder: 999,
          overrides: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        created++
      }
    }

    return NextResponse.json({ success: true, created, updated, total: blogPosts.length })
  } catch (error) {
    console.error('Failed to sync blog metadata:', error)
    return NextResponse.json({ error: 'Failed to sync blog metadata' }, { status: 500 })
  }
}
