import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { Logger, LogContext } from '../../../../../lib/logging/logger'
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

    await Logger.info(LogContext.SYSTEM, 'Admin workout feedback stats request', { request })

    const db = await connectToDatabase()
    const collection = db.collection('workout_feedback_submissions')

    const searchParams = new URL(request.url).searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const lookbackTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    // Basic counts
    const [totalSubmissions, newSubmissions] = await Promise.all([
      collection.countDocuments({ submittedAt: { $gte: lookbackTime } }),
      collection.countDocuments({ submittedAt: { $gte: lookbackTime }, status: 'new' })
    ])

    // Average mood ratings
    const moodAggregation = await collection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      {
        $group: {
          _id: null,
          avgMoodBefore: { $avg: '$moodBefore' },
          avgMoodAfter: { $avg: '$moodAfter' }
        }
      }
    ]).toArray()

    const avgMoodBefore = moodAggregation[0]?.avgMoodBefore || 0
    const avgMoodAfter = moodAggregation[0]?.avgMoodAfter || 0

    // Difficulty distribution
    const difficultyAggregation = await collection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()

    const difficultyDistribution = difficultyAggregation.map(item => ({
      difficulty: item._id || 'Unknown',
      count: item.count
    }))

    // Instruction preference distribution
    const instructionAggregation = await collection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      { $group: { _id: '$instructionPreference', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()

    const instructionPrefDistribution = instructionAggregation.map(item => ({
      preference: item._id || 'Unknown',
      count: item.count
    }))

    // Category distribution
    const categoryAggregation = await collection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      { $group: { _id: '$activity.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()

    const categoryDistribution = categoryAggregation.map(item => ({
      category: item._id || 'Unknown',
      count: item.count
    }))

    // Submissions by day
    const submissionsByDayAggregation = await collection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    const submissionsByDay = submissionsByDayAggregation.map(item => ({
      date: item._id,
      count: item.count
    }))

    // Recent submissions preview
    const recentSubmissions = await collection
      .find({}, {
        projection: {
          _id: 1,
          activity: 1,
          moodBefore: 1,
          moodAfter: 1,
          difficulty: 1,
          instructionPreference: 1,
          email: 1,
          submittedAt: 1,
          status: 1
        }
      })
      .sort({ submittedAt: -1 })
      .limit(5)
      .toArray()

    return NextResponse.json({
      totalSubmissions,
      newSubmissions,
      avgMoodBefore: Math.round(avgMoodBefore * 10) / 10,
      avgMoodAfter: Math.round(avgMoodAfter * 10) / 10,
      avgMoodImprovement: Math.round((avgMoodAfter - avgMoodBefore) * 10) / 10,
      difficultyDistribution,
      instructionPrefDistribution,
      categoryDistribution,
      submissionsByDay,
      recentSubmissions: recentSubmissions.map(sub => ({
        ...sub,
        _id: sub._id.toString()
      }))
    })

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin workout feedback stats error', {
      request,
      metadata: { error: String(error) }
    })

    return NextResponse.json(
      { error: 'Failed to fetch workout feedback statistics' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
