import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { sendGalleryShareEmail } from '@/lib/email/email-service'
import { submitToInbox } from '@/lib/inbox/signedFetch'
import type { ClientGallery } from '@/types/client-gallery'

export const dynamic = 'force-dynamic'

function baseUrl(): string {
  return (process.env.NEXTAUTH_URL?.replace(/\/$/, '') || 'https://brandanthonymcdonald.com');
}

// POST — email the client their gallery link and log the share to the WitUS Inbox.
export async function POST(request: NextRequest, props: { params: Promise<{ galleryId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { message } = (await request.json().catch(() => ({}))) as { message?: string }

  const client = await clientPromise
  const db = client.db('bam_portfolio')
  const gallery = (await db
    .collection('client_galleries')
    .findOne({ galleryId: params.galleryId })) as ClientGallery | null

  if (!gallery) {
    return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
  }
  if (!gallery.clientEmail) {
    return NextResponse.json(
      { error: 'This gallery has no client email to send to.' },
      { status: 400 }
    )
  }

  const galleryUrl = `${baseUrl()}/client-gallery/${gallery.galleryId}`
  const note = typeof message === 'string' && message.trim() ? message.trim().slice(0, 1000) : undefined

  // 1) Deliver the email (SMTP — point SMTP_HOST at Mailgun's SMTP). Returns
  //    false (logged) if SMTP isn't configured; we surface that to the admin.
  const emailSent = await sendGalleryShareEmail(
    gallery.clientEmail,
    gallery.clientName || 'there',
    gallery.eventName || 'your gallery',
    galleryUrl,
    gallery.settings?.requirePassword ? gallery.accessCode : undefined,
    note
  )

  // 2) Log the share to the WitUS Inbox so the client thread lives there too.
  //    Non-fatal: a missing/unreachable Inbox must not block delivery.
  let inboxLogged = false
  try {
    const res = await submitToInbox({
      form_type: 'gallery-shared',
      submitter_email: gallery.clientEmail,
      submitter_name: gallery.clientName,
      payload: {
        galleryId: gallery.galleryId,
        eventName: gallery.eventName,
        galleryUrl,
        photoCount: gallery.photos?.length ?? 0,
        sharedBy: session.user?.email ?? session.user?.name ?? 'admin',
        note: note ?? null,
        emailSent,
      },
    })
    inboxLogged = res.ok
  } catch (err) {
    console.error('[gallery-share] Inbox log failed:', err instanceof Error ? err.message : err)
  }

  // 3) Stamp the share on the gallery for the admin UI.
  await db.collection('client_galleries').updateOne(
    { galleryId: gallery.galleryId },
    {
      $set: { lastSharedAt: new Date(), updatedAt: new Date() },
      $inc: { shareCount: 1 },
    }
  )

  if (!emailSent) {
    return NextResponse.json(
      {
        success: false,
        emailSent,
        inboxLogged,
        error: 'Email not sent — SMTP/Mailgun is not configured (see operator task).',
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true, emailSent, inboxLogged, galleryUrl })
}
