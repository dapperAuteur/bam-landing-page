import { AnalyticsLogger } from '@/lib/logging/logger'
import type { NextRequest } from 'next/server'

// Extend AnalyticsLogger event types for portal tracking
export const PortalEventType = {
  PROPOSAL_VIEWED: 'proposal_viewed',
  PROPOSAL_SECTION_VIEWED: 'proposal_section_viewed',
  PROPOSAL_TIME_SPENT: 'proposal_time_spent',
  MEDIA_VIEWED: 'media_viewed',
  MEDIA_DOWNLOADED: 'media_downloaded',
  PROPOSAL_APPROVED: 'proposal_approved',
  PROPOSAL_REJECTED: 'proposal_rejected',
  PROPOSAL_REVISION_REQUESTED: 'proposal_revision_requested',
  PROPOSAL_COMMENT: 'proposal_comment',
  PROPOSAL_SHARED: 'proposal_shared'
} as const

export type PortalEventTypeValue = typeof PortalEventType[keyof typeof PortalEventType]

export async function trackPortalView(
  projectId: string,
  clientEmail: string,
  request?: NextRequest
): Promise<void> {
  await AnalyticsLogger.trackEvent({
    eventType: PortalEventType.PROPOSAL_VIEWED,
    properties: { projectId, clientEmail },
    request
  })
}

export async function trackSectionView(
  projectId: string,
  sectionId: string,
  clientEmail?: string
): Promise<void> {
  await AnalyticsLogger.trackEvent({
    eventType: PortalEventType.PROPOSAL_SECTION_VIEWED,
    properties: { projectId, sectionId, clientEmail }
  })
}

export async function trackTimeSpent(
  projectId: string,
  durationSeconds: number,
  clientEmail?: string
): Promise<void> {
  await AnalyticsLogger.trackEvent({
    eventType: PortalEventType.PROPOSAL_TIME_SPENT,
    properties: { projectId, durationSeconds, clientEmail }
  })
}

export async function trackMediaView(
  projectId: string,
  mediaId: string,
  mediaType: string
): Promise<void> {
  await AnalyticsLogger.trackEvent({
    eventType: PortalEventType.MEDIA_VIEWED,
    properties: { projectId, mediaId, mediaType }
  })
}

export async function trackMediaDownload(
  projectId: string,
  mediaId: string,
  mediaType: string
): Promise<void> {
  await AnalyticsLogger.trackEvent({
    eventType: PortalEventType.MEDIA_DOWNLOADED,
    properties: { projectId, mediaId, mediaType }
  })
}

export async function trackProposalResponse(
  projectId: string,
  status: string,
  clientEmail: string,
  note?: string
): Promise<void> {
  const eventType = status === 'approved'
    ? PortalEventType.PROPOSAL_APPROVED
    : status === 'rejected'
      ? PortalEventType.PROPOSAL_REJECTED
      : PortalEventType.PROPOSAL_REVISION_REQUESTED

  await AnalyticsLogger.trackEvent({
    eventType,
    properties: { projectId, clientEmail, note }
  })
}

export async function trackProposalShared(
  projectId: string,
  clientEmail: string,
  portalUrl: string
): Promise<void> {
  await AnalyticsLogger.trackEvent({
    eventType: PortalEventType.PROPOSAL_SHARED,
    properties: { projectId, clientEmail, portalUrl }
  })
}
