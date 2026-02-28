// app/api/admin/contact-stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import { getContactStats } from '../../../../lib/logging/contact-logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const stats = await getContactStats(days)
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch contact stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact stats' },
      { status: 500 }
    )
  }
}