// app/api/admin/contact-logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getRecentContactSubmissions } from '../../../../lib/logging/contact-logger'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here when you implement admin auth
    // For now, anyone can access this endpoint
    // You should add proper authentication before deploying to production

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