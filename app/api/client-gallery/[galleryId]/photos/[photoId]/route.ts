// app/api/client-gallery/[galleryId]/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from './../../../../../../lib/db/mongodb'
import { notifyInbox } from '@/lib/inbox/notifyInbox'

export async function POST(
  request: NextRequest, 
  { params }: { params: { galleryId: string; photoId: string } }
) {
  try {
    const { action, comment, isFavorite, reviewer } = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const by = typeof reviewer === 'string' && reviewer.trim() ? reviewer.trim().slice(0, 80) : undefined

    // Client approval: set this photo's approvalStatus (no auth — this is the
    // public, access-code-gated client viewer acting on its own gallery).
    if (action === 'approve' || action === 'reject') {
      const result = await db.collection('client_galleries').updateOne(
        { galleryId: params.galleryId, 'photos.id': params.photoId },
        {
          $set: {
            'photos.$.approvalStatus': action === 'approve' ? 'approved' : 'rejected',
            'photos.$.approvedAt': new Date(),
            'photos.$.approvedBy': by ?? null,
            updatedAt: new Date(),
          } as any,
        }
      )
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }

      // Route the approve/reject decision into the WitUS Inbox so every client
      // touchpoint (shares, comments, approvals) lands in one thread. Non-blocking.
      const gallery = await db
        .collection('client_galleries')
        .findOne(
          { galleryId: params.galleryId },
          { projection: { clientName: 1, clientEmail: 1, eventName: 1 } }
        )
      await notifyInbox(
        {
          form_type: 'gallery-approval',
          submitter_name: by ?? (gallery?.clientName as string | undefined),
          submitter_email: gallery?.clientEmail as string | undefined,
          payload: {
            galleryId: params.galleryId,
            photoId: params.photoId,
            eventName: gallery?.eventName ?? null,
            decision: action === 'approve' ? 'approved' : 'rejected',
            reviewer: by ?? null,
          },
        },
        request
      )

      return NextResponse.json({ success: true })
    }

    if (action === 'comment' && comment) {
      // FIXED: Use type assertion for MongoDB operation
      const result = await db.collection('client_galleries').updateOne(
        { galleryId: params.galleryId, 'photos.id': params.photoId },
        {
          $push: {
            'photos.$.comments': {
              text: comment,
              timestamp: new Date(),
              id: Date.now().toString(),
              author: by ?? null,
            }
          } as any
        }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }

      // Route the client's comment into the WitUS Inbox so the conversation
      // lives alongside every other client touchpoint. Non-blocking — a missing
      // or unreachable Inbox never fails the client's comment (already saved).
      const gallery = await db
        .collection('client_galleries')
        .findOne(
          { galleryId: params.galleryId },
          { projection: { clientName: 1, clientEmail: 1, eventName: 1 } }
        )
      await notifyInbox(
        {
          form_type: 'gallery-comment',
          submitter_name: by ?? (gallery?.clientName as string | undefined),
          submitter_email: gallery?.clientEmail as string | undefined,
          payload: {
            galleryId: params.galleryId,
            photoId: params.photoId,
            eventName: gallery?.eventName ?? null,
            comment: String(comment).slice(0, 2000),
            author: by ?? null,
          },
        },
        request
      )
    }

    if (action === 'favorite') {
      const result = await db.collection('client_galleries').updateOne(
        { galleryId: params.galleryId, 'photos.id': params.photoId },
        { $set: { 'photos.$.isFavorite': isFavorite } as any }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }
    }
    
    if (action === 'like') {
      const result = await db.collection('client_galleries').updateOne(
        { galleryId: params.galleryId, 'photos.id': params.photoId },
        { $inc: { 'photos.$.likes': 1 } as any }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating photo:', error)
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}