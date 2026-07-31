// app/api/admin/guest-speaker/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getGuestSpeakerStats } from '../../../../../lib/logging/guest-speaker-logger'
import { assertAdminOrUnauthorized } from '@/lib/utils/utilsNextAuth'

export async function GET(request: NextRequest) {
  try {
    const unauthorized = await assertAdminOrUnauthorized()
    if (unauthorized) return unauthorized

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const stats = await getGuestSpeakerStats(days)
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
