import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { blogPosts } from '@/lib/blogData'
import { BLOG_DB, COLLECTIONS } from '@/lib/db/collections'

// One-time, idempotent migration: fold the legacy blog_metadata override rows +
// the static blogPosts[] registry into the unified blog_posts collection as
// contentSource:'static' rows. Re-runnable — upserts by slug, never duplicates.
// Admin-only. Does NOT fire the outbox (pure backfill; the publish trigger lives
// in the unified save route, Phase 3). Migrated posts keep contentSource:'static'
// and have no `content` — they still render from their app/blog/<slug> folder
// until ported to MDX in Phase 4.
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db(BLOG_DB)
    const metaRows = await db.collection(COLLECTIONS.blogMetadata).find({}).toArray()
    const metaMap = new Map(metaRows.map(m => [m.slug, m]))
    const target = db.collection(COLLECTIONS.blogPosts)

    let created = 0
    let updated = 0
    const now = new Date().toISOString()

    for (const post of blogPosts) {
      const meta = metaMap.get(post.slug)
      const ovr = meta?.overrides || {}

      // Apply any admin overrides recorded in blog_metadata, else the static value.
      const doc = {
        slug: post.slug,
        title: ovr.title && meta?.title ? meta.title : post.title,
        description: ovr.description && meta?.description ? meta.description : post.description,
        publishDate: ovr.publishDate && meta?.publishDate ? meta.publishDate : post.publishDate,
        readTime: ovr.readTime && meta?.readTime ? meta.readTime : post.readTime,
        category: ovr.category && meta?.category ? meta.category : post.category,
        featured: ovr.featured ? !!meta?.featured : post.featured || false,
        tags: ovr.tags && meta?.tags ? meta.tags : post.tags,
        excerpt: ovr.excerpt && meta?.excerpt ? meta.excerpt : post.excerpt,
        featuredOrder: meta?.featuredOrder ?? 999,
        status: meta?.hidden ? 'draft' : 'published',
        contentSource: 'static' as const,
      }

      const existing = await target.findOne({ slug: post.slug })
      if (existing) {
        await target.updateOne({ slug: post.slug }, { $set: { ...doc, updatedAt: now } })
        updated++
      } else {
        await target.insertOne({
          ...doc,
          author: 'Brand Anthony McDonald',
          views: 0,
          createdAt: now,
          updatedAt: now,
        })
        created++
      }
    }

    return NextResponse.json({ success: true, created, updated, total: blogPosts.length })
  } catch (error) {
    console.error('Blog migrate error:', error)
    return NextResponse.json({ error: 'Failed to migrate blog metadata' }, { status: 500 })
  }
}
