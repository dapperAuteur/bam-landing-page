import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { PortalEventType } from '@/lib/analytics/portal-analytics'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    // Get all analytics events for this project
    const events = await db.collection('analytics_events')
      .find({ 'properties.projectId': params.projectId })
      .sort({ timestamp: -1 })
      .toArray()

    // Aggregate by event type
    const eventCounts: Record<string, number> = {}
    for (const event of events) {
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1
    }

    // Views over time (group by day)
    const viewEvents = events.filter(e => e.eventType === PortalEventType.PROPOSAL_VIEWED)
    const viewsByDay: Record<string, number> = {}
    for (const event of viewEvents) {
      const day = new Date(event.timestamp).toISOString().split('T')[0]
      viewsByDay[day] = (viewsByDay[day] || 0) + 1
    }

    // Section engagement
    const sectionEvents = events.filter(e => e.eventType === PortalEventType.PROPOSAL_SECTION_VIEWED)
    const sectionViews: Record<string, number> = {}
    for (const event of sectionEvents) {
      const sectionId = event.properties?.sectionId || 'unknown'
      sectionViews[sectionId] = (sectionViews[sectionId] || 0) + 1
    }

    // Time spent (total seconds)
    const timeEvents = events.filter(e => e.eventType === PortalEventType.PROPOSAL_TIME_SPENT)
    const totalTimeSeconds = timeEvents.reduce((sum, e) => sum + (e.properties?.durationSeconds || 0), 0)

    // Media engagement
    const mediaViewEvents = events.filter(e => e.eventType === PortalEventType.MEDIA_VIEWED)
    const mediaDownloadEvents = events.filter(e => e.eventType === PortalEventType.MEDIA_DOWNLOADED)

    // Recent activity (last 20 events)
    const recentActivity = events.slice(0, 20).map(e => ({
      eventType: e.eventType,
      timestamp: e.timestamp,
      properties: e.properties
    }))

    return NextResponse.json({
      summary: {
        totalViews: eventCounts[PortalEventType.PROPOSAL_VIEWED] || 0,
        totalSectionViews: sectionEvents.length,
        totalTimeSpentSeconds: totalTimeSeconds,
        totalMediaViews: mediaViewEvents.length,
        totalMediaDownloads: mediaDownloadEvents.length,
        totalEvents: events.length
      },
      viewsByDay: Object.entries(viewsByDay)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      sectionViews: Object.entries(sectionViews)
        .map(([section, count]) => ({ section, count }))
        .sort((a, b) => b.count - a.count),
      recentActivity
    })
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
