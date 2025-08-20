// app/api/admin/contact-stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getContactStats } from '../../../../lib/logging/contact-logger'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here when you implement admin auth
    // For now, anyone can access this endpoint
    // You should add proper authentication before deploying to production

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