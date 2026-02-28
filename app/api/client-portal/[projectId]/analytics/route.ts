import { NextRequest, NextResponse } from 'next/server'
import {
  trackSectionView,
  trackTimeSpent,
  trackMediaView,
  trackMediaDownload,
  PortalEventType
} from '@/lib/analytics/portal-analytics'

const VALID_EVENTS = new Set([
  PortalEventType.PROPOSAL_SECTION_VIEWED,
  PortalEventType.PROPOSAL_TIME_SPENT,
  PortalEventType.MEDIA_VIEWED,
  PortalEventType.MEDIA_DOWNLOADED
])

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { event, properties } = await request.json()

    if (!event || !VALID_EVENTS.has(event)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const projectId = params.projectId

    switch (event) {
      case PortalEventType.PROPOSAL_SECTION_VIEWED:
        await trackSectionView(projectId, properties?.sectionId, properties?.clientEmail)
        break
      case PortalEventType.PROPOSAL_TIME_SPENT:
        await trackTimeSpent(projectId, properties?.durationSeconds, properties?.clientEmail)
        break
      case PortalEventType.MEDIA_VIEWED:
        await trackMediaView(projectId, properties?.mediaId, properties?.mediaType)
        break
      case PortalEventType.MEDIA_DOWNLOADED:
        await trackMediaDownload(projectId, properties?.mediaId, properties?.mediaType)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics event failed:', error)
    // Never fail the client request for analytics
    return NextResponse.json({ success: true })
  }
}
