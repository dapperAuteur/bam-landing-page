// app/api/admin/guest-speaker/logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getRecentGuestSpeakerLogs } from '../../../../../lib/logging/guest-speaker-logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const logs = await getRecentGuestSpeakerLogs(limit)
    return NextResponse.json(logs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}
