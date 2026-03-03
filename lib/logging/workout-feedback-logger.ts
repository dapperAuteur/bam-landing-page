// lib/logging/workout-feedback-logger.ts
import { MongoClient } from 'mongodb'

export interface WorkoutFeedbackLog {
  _id?: string
  event: 'workout_feedback_success' | 'workout_feedback_failure' | 'workout_feedback_validation_error' | 'workout_feedback_rate_limit'
  status: 'success' | 'failure'
  email?: string
  reason?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

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

export async function logWorkoutFeedbackEvent(log: Omit<WorkoutFeedbackLog, 'timestamp'>) {
  try {
    const db = await connectToDatabase()
    const collection = db.collection<WorkoutFeedbackLog>('workout_feedback_logs')

    await collection.insertOne({
      ...log,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Failed to log workout feedback event:', error)
  }
}

export async function checkWorkoutFeedbackRateLimit(ipAddress: string): Promise<{ isLimited: boolean; reason?: string }> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('workout_feedback_submissions')

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [hourlyCount, dailyCount] = await Promise.all([
      collection.countDocuments({ ipAddress, submittedAt: { $gte: oneHourAgo } }),
      collection.countDocuments({ ipAddress, submittedAt: { $gte: oneDayAgo } })
    ])

    if (hourlyCount >= 5) {
      return { isLimited: true, reason: 'Hourly submission limit reached (5/hour)' }
    }

    if (dailyCount >= 15) {
      return { isLimited: true, reason: 'Daily submission limit reached (15/day)' }
    }

    return { isLimited: false }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return { isLimited: false }
  }
}
