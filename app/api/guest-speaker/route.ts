import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { logGuestSpeakerEvent } from '../../../lib/logging/guest-speaker-logger';

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

export async function POST(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const body = await request.json();
    const { name, email, profession, expertise, availability, message } = body;

    // Basic validation
    if (!name || !email || !profession || !expertise) {
      await logGuestSpeakerEvent({
        event: 'guest_speaker_failure',
        status: 'failure',
        reason: 'Missing required fields',
        ipAddress,
        userAgent,
        metadata: { body }
      });

      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection<GuestSpeakerSubmission>('guest_speaker_submissions');

    const submission: GuestSpeakerSubmission = {
      name,
      email,
      profession,
      expertise,
      availability: availability || '',
      message: message || '',
      submittedAt: new Date(),
    };

    await collection.insertOne(submission);

    await logGuestSpeakerEvent({
      event: 'guest_speaker_success',
      status: 'success',
      name,
      email,
      ipAddress,
      userAgent,
      metadata: { profession, expertise }
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
      timestamp: new Date() // Fallback if needed, though logger handles it
    } as any);

    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}