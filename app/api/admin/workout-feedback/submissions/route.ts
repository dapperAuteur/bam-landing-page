import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { Logger, LogContext } from '../../../../../lib/logging/logger'
import { WorkoutFeedbackSubmission } from '../../../../../types/workout-feedback'
import { assertAdminOrUnauthorized } from '@/lib/utils/utilsNextAuth'

let client: MongoClient

async function connectToDatabase() {
  if (!client) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db('bam_portfolio')
}

export async function GET(request: NextRequest) {
  try {
    const unauthorized = await assertAdminOrUnauthorized()
    if (unauthorized) return unauthorized

    await Logger.info(LogContext.SYSTEM, 'Admin workout feedback submissions request', { request })

    const db = await connectToDatabase()
    const collection = db.collection<WorkoutFeedbackSubmission>('workout_feedback_submissions')

    const searchParams = new URL(request.url).searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const searchQuery = searchParams.get('search')

    // Build query
    const query: Record<string, unknown> = {}

    if (status) {
      query.status = status
    }

    if (category) {
      query['activity.category'] = category
    }

    if (difficulty) {
      query.difficulty = difficulty
    }

    if (searchQuery) {
      query.$or = [
        { email: { $regex: searchQuery, $options: 'i' } },
        { feedback: { $regex: searchQuery, $options: 'i' } }
      ]
    }

    const totalCount = await collection.countDocuments(query)

    const submissions = await collection
      .find(query)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const serializedSubmissions = submissions.map(submission => ({
      ...submission,
      _id: submission._id?.toString()
    }))

    return NextResponse.json({
      submissions: serializedSubmissions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        status,
        category,
        difficulty,
        searchQuery
      }
    })

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin workout feedback submissions error', {
      request,
      metadata: { error: String(error) }
    })

    return NextResponse.json(
      { error: 'Failed to fetch workout feedback submissions' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
