// app/api/admin/contact-logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import { getRecentContactSubmissions } from '../../../../lib/logging/contact-logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const logs = await getRecentContactSubmissions(limit)
    
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Failed to fetch contact logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact logs' },
      { status: 500 }
    )
  }
}