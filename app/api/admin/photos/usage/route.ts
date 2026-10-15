import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { BLOG_DB } from '@/lib/db/collections'
import { rebuildPhotoUsage } from '@/lib/photos/references'

export const dynamic = 'force-dynamic'

// POST — rebuild every library photo's usedIn.blogs / usedIn.galleries from the
// posts and galleries themselves (admin). `?dry=1` reports without writing.
// Safe to rerun: it writes only the photos whose counts are wrong.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dry = new URL(request.url).searchParams.get('dry') === '1'
    const client = await clientPromise
    const result = await rebuildPhotoUsage(client.db(BLOG_DB), { dry })
    return NextResponse.json({ success: true, dry, ...result })
  } catch (error) {
    console.error('Photo usage recount failed:', error instanceof Error ? error.name : 'unknown')
    return NextResponse.json({ error: 'Recount failed' }, { status: 500 })
  }
}
