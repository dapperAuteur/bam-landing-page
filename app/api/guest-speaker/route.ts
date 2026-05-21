import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import {
  logGuestSpeakerEvent,
  checkGuestSpeakerRateLimit,
} from '../../../lib/logging/guest-speaker-logger';
import { notifyInbox } from '@/lib/inbox/notifyInbox';
import { verifyRecaptcha } from '@/lib/recaptcha/verify';
import { getClientIp } from '@/lib/utils/client';

interface GuestSpeakerSubmission {
  name: string;
  email: string;
  profession: string;
  expertise: string;
  availability: string;
  message: string;
  submittedAt: Date;
}

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('bam_portfolio');
}

// Strip angle brackets and trim — same one-liner the contact/education routes use.
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export async function POST(request: NextRequest) {
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const body = await request.json();

    // 1. reCAPTCHA v3 — reject failed / low-score tokens before doing any work.
    const recaptcha = await verifyRecaptcha(body.recaptchaToken, 'guest_speaker_submit');
    if (!recaptcha.ok) {
      await logGuestSpeakerEvent({
        event: 'guest_speaker_spam',
        status: 'spam',
        reason: `reCAPTCHA rejected: ${recaptcha.reason}`,
        ipAddress,
        userAgent,
        metadata: { score: recaptcha.score },
      });
      return NextResponse.json(
        {
          success: false,
          message: 'Security verification failed. Please reload the page and try again.',
        },
        { status: 403 }
      );
    }

    // 2. Sanitize every field.
    const name = sanitizeInput(body.name || '');
    const email = sanitizeInput(body.email || '').toLowerCase();
    const profession = sanitizeInput(body.profession || '');
    const expertise = sanitizeInput(body.expertise || '');
    const availability = sanitizeInput(body.availability || '');
    const message = sanitizeInput(body.message || '');

    // 3. Validate required fields.
    if (!name || !email || !profession || !expertise) {
      await logGuestSpeakerEvent({
        event: 'guest_speaker_failure',
        status: 'failure',
        reason: 'Missing required fields',
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // 4. Rate-limit by IP + email.
    const rateLimit = await checkGuestSpeakerRateLimit(ipAddress, email);
    if (rateLimit.isLimited) {
      await logGuestSpeakerEvent({
        event: 'guest_speaker_failure',
        status: 'failure',
        reason: rateLimit.reason,
        name,
        email,
        ipAddress,
        userAgent,
        metadata: { nextAllowedTime: rateLimit.nextAllowedTime },
      });
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    // 5. Persist to MongoDB (the system of record for this form).
    const db = await connectToDatabase();
    const collection = db.collection<GuestSpeakerSubmission>('guest_speaker_submissions');
    const submission: GuestSpeakerSubmission = {
      name,
      email,
      profession,
      expertise,
      availability,
      message,
      submittedAt: new Date(),
    };
    await collection.insertOne(submission);

    // 6. Mirror the submission into the WitUS Inbox. Non-blocking: a failed
    // dispatch is logged but does not affect the visitor's success response.
    await notifyInbox(
      {
        form_type: 'guest-speaker',
        submitter_email: email,
        submitter_name: name,
        priority: 'normal',
        payload: { name, email, profession, expertise, availability, message },
      },
      request
    );

    await logGuestSpeakerEvent({
      event: 'guest_speaker_success',
      status: 'success',
      name,
      email,
      ipAddress,
      userAgent,
      metadata: { profession, expertise, recaptchaScore: recaptcha.score },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! We will be in touch soon.',
    });
  } catch (error) {
    console.error('Guest speaker submission error:', error);
    await logGuestSpeakerEvent({
      event: 'guest_speaker_failure',
      status: 'failure',
      reason: error instanceof Error ? error.message : 'Unknown error',
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
