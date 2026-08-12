import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { BLOG_DB, COLLECTIONS } from '@/lib/db/collections'
import { sortCategoryCounts, type CategoryOption } from '@/lib/blog/categories'

export const dynamic = 'force-dynamic'

/**
 * Same gate as the sibling admin blog routes (see app/api/admin/blog/posts/route.ts).
 *
 * The check is repeated inside the handler on purpose. `middleware.ts` matches
 * `/api/admin/:path*` and lib/auth/authorize.ts requires role=admin there, but a route
 * handler does not inherit any layout's auth check, and middleware coverage is a config
 * line that can be edited out from a distance. Both gates, always.
 */
async function requireAdmin(): Promise<{ userId: string } | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'admin') return null
  return { userId: session.user.id }
}

/**
 * GET: the distinct categories in use, with post counts, count descending then
 * alphabetical.
 *
 * Read-only. This route exists so the editor can show the author what already exists
 * before a near-duplicate gets typed. It never writes, renames, or merges anything.
 */
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const client = await clientPromise
  const db = client.db(BLOG_DB)

  const grouped = await db
    .collection(COLLECTIONS.blogPosts)
    .aggregate<{ _id: unknown; count: number }>([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ])
    .toArray()

  // Posts written before the field was required can carry null, undefined, or ''.
  // Those are not a category, so they are dropped rather than shown as a blank option.
  // Values that differ only by surrounding whitespace are one category, so their counts
  // are summed instead of producing two identical-looking rows.
  const byName = new Map<string, number>()
  for (const group of grouped) {
    if (typeof group._id !== 'string') continue
    const name = group._id.trim()
    if (!name) continue
    byName.set(name, (byName.get(name) ?? 0) + group.count)
  }

  const categories: CategoryOption[] = Array.from(byName, ([name, count]) => ({ name, count }))

  // Sorted in JS, not in the aggregation: Mongo sorts strings by byte order, which puts
  // every capitalized name before every lowercase one. localeCompare is what a human
  // scanning the dropdown expects.
  return NextResponse.json({ categories: sortCategoryCounts(categories) })
}
