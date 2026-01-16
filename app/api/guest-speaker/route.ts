import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

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
    const body = await request.json();
    const { name, email, profession, expertise, availability, message } = body;

    // Basic validation
    if (!name || !email || !profession || !expertise) {
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

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! We will be in touch soon.',
    });
  } catch (error) {
    console.error('Guest speaker submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}