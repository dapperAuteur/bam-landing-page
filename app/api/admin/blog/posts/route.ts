import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { fireOutboxDrafts } from '@/lib/outbox-trigger'
import { buildBlogCaption } from '@/lib/blog/caption'
import { BLOG_DB, COLLECTIONS } from '@/lib/db/collections'

export const dynamic = 'force-dynamic'

async function requireAdmin(): Promise<{ userId: string } | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'admin') return null
  return { userId: session.user.id }
}

// GET — list every post in the unified blog_posts collection (admin view).
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const client = await clientPromise
  const db = client.db(BLOG_DB)
  const posts = await db
    .collection(COLLECTIONS.blogPosts)
    .find({})
    .sort({ status: 1, featuredOrder: 1, publishDate: -1 })
    .toArray()

  return NextResponse.json({ posts: posts.map(p => ({ ...p, id: p._id.toString() })) })
}

// POST — create a new CMS/MDX post. Publishing it on create fires the outbox
// (coming-soon drafts) once, and revalidates the public blog.
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  if (!body.slug || !body.title) {
    return NextResponse.json({ error: 'slug and title are required' }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db(BLOG_DB)
  const collection = db.collection(COLLECTIONS.blogPosts)

  const existing = await collection.findOne({ slug: body.slug })
  if (existing) {
    return NextResponse.json({ error: 'A post with that slug already exists' }, { status: 409 })
  }

  const now = new Date().toISOString()
  const status: 'draft' | 'published' = body.status === 'published' ? 'published' : 'draft'
  const doc = {
    slug: body.slug,
    title: body.title,
    description: body.description ?? '',
    excerpt: body.excerpt ?? '',
    category: body.category ?? 'Uncategorized',
    tags: Array.isArray(body.tags) ? body.tags : [],
    readTime: body.readTime ?? '',
    publishDate: body.publishDate ?? now.slice(0, 10),
    featured: !!body.featured,
    featuredOrder: typeof body.featuredOrder === 'number' ? body.featuredOrder : 999,
    featuredImage: body.featuredImage ?? null,
    photoIds: Array.isArray(body.photoIds) ? body.photoIds : [],
    content: body.content ?? '',
    status,
    contentSource: 'cms' as const,
    author: body.author ?? 'Brand Anthony McDonald',
    views: 0,
    firstPublishedAt: status === 'published' ? now : null,
    createdAt: now,
    updatedAt: now,
  }

  const result = await collection.insertOne(doc)

  if (status === 'published') {
    fireOutboxDrafts({
      triggerUserId: admin.userId,
      externalRefBase: `bam-blog-${doc.slug}`,
      caption: buildBlogCaption(doc),
      mediaUrls: doc.featuredImage?.url ? [doc.featuredImage.url] : [],
      platforms: ['linkedin', 'twitter', 'bluesky'],
      asDraft: true,
    })
    revalidatePath('/blog')
    revalidatePath(`/blog/${doc.slug}`)
    revalidatePath('/feed.xml')
    revalidatePath('/feed.json')
  }

  return NextResponse.json({ success: true, id: result.insertedId.toString() })
}
