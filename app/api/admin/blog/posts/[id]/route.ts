import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
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

function byId(id: string) {
  // Accept either a Mongo _id or a slug.
  return ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug: id }
}

// GET — fetch a single post for the editor.
export async function GET(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const client = await clientPromise
  const db = client.db(BLOG_DB)
  const post = await db.collection(COLLECTIONS.blogPosts).findOne(byId(params.id))
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  return NextResponse.json({ post: { ...post, id: post._id.toString() } })
}

// PUT — update a post. On the first draft→published transition, fire the outbox
// (coming-soon drafts) exactly once and revalidate the public blog.
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const client = await clientPromise
  const db = client.db(BLOG_DB)
  const collection = db.collection(COLLECTIONS.blogPosts)

  const existing = await collection.findOne(byId(params.id))
  if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Strip immutable / server-managed fields from the incoming payload.
  const { id: _id0, _id, createdAt, firstPublishedAt: _fp, views: _v, contentSource: _cs, ...updates } = body

  const now = new Date().toISOString()
  const willPublish =
    updates.status === 'published' && existing.status !== 'published' && !existing.firstPublishedAt

  const set: Record<string, unknown> = { ...updates, updatedAt: now }
  if (willPublish) set.firstPublishedAt = now

  await collection.updateOne({ _id: existing._id }, { $set: set })

  const slug = (updates.slug as string) ?? existing.slug
  if (willPublish) {
    fireOutboxDrafts({
      triggerUserId: admin.userId,
      externalRefBase: `bam-blog-${slug}`,
      caption: buildBlogCaption({
        slug,
        title: (updates.title as string) ?? existing.title,
        excerpt: (updates.excerpt as string) ?? existing.excerpt ?? '',
      }),
      mediaUrls: existing.featuredImage?.url ? [existing.featuredImage.url] : [],
      platforms: ['linkedin', 'twitter', 'bluesky'],
      asDraft: true,
    })
  }

  // Any edit to a published post should refresh its ISR cache.
  if (willPublish || existing.status === 'published') {
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/feed.xml')
    revalidatePath('/feed.json')
  }

  return NextResponse.json({ success: true, published: willPublish })
}

// DELETE — remove a post and refresh the blog listing.
export async function DELETE(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const client = await clientPromise
  const db = client.db(BLOG_DB)
  const existing = await db.collection(COLLECTIONS.blogPosts).findOne(byId(params.id))
  if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  await db.collection(COLLECTIONS.blogPosts).deleteOne({ _id: existing._id })
  revalidatePath('/blog')
  revalidatePath(`/blog/${existing.slug}`)
  revalidatePath('/feed.xml')
  revalidatePath('/feed.json')
  return NextResponse.json({ success: true })
}
