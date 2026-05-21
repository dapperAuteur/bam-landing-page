// lib/logging/guest-speaker-logger.ts
import { MongoClient } from 'mongodb'

export interface GuestSpeakerLog {
  _id?: string
  event: 'guest_speaker_success' | 'guest_speaker_failure' | 'guest_speaker_spam'
  status: 'success' | 'failure' | 'spam'
  email?: string
  name?: string
  reason?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  metadata?: any
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

export async function logGuestSpeakerEvent(log: Omit<GuestSpeakerLog, 'timestamp'>) {
  try {
    const db = await connectToDatabase()
    const collection = db.collection<GuestSpeakerLog>('guest_speaker_logs')
    
    await collection.insertOne({
      ...log,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Failed to log guest speaker event:', error)
  }
}

/**
 * Rate-limit guest-speaker submissions. Mirrors `checkRateLimit` in
 * contact-logger.ts: 3/hour and 10/day per IP, 5/day per email. Spam-flagged
 * rows are excluded from the counts so a blocked spammer can't lock out a
 * shared IP. Fails open (isLimited: false) if the DB read errors.
 */
export async function checkGuestSpeakerRateLimit(
  ipAddress: string,
  email?: string
): Promise<{ isLimited: boolean; reason?: string; nextAllowedTime?: Date }> {
  try {
    const db = await connectToDatabase()
    const logs = db.collection<GuestSpeakerLog>('guest_speaker_logs')

    const hourLimit = 3
    const dayLimit = 10
    const emailDayLimit = 5

    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const hourlySubmissions = await logs.countDocuments({
      ipAddress,
      timestamp: { $gte: oneHourAgo },
      status: { $ne: 'spam' },
    })
    if (hourlySubmissions >= hourLimit) {
      return {
        isLimited: true,
        reason: `Exceeded hourly limit of ${hourLimit} submissions`,
        nextAllowedTime: new Date(oneHourAgo.getTime() + 60 * 60 * 1000),
      }
    }

    const dailySubmissions = await logs.countDocuments({
      ipAddress,
      timestamp: { $gte: oneDayAgo },
      status: { $ne: 'spam' },
    })
    if (dailySubmissions >= dayLimit) {
      return {
        isLimited: true,
        reason: `Exceeded daily limit of ${dayLimit} submissions`,
        nextAllowedTime: new Date(oneDayAgo.getTime() + 24 * 60 * 60 * 1000),
      }
    }

    if (email) {
      const emailDailySubmissions = await logs.countDocuments({
        email,
        timestamp: { $gte: oneDayAgo },
        status: { $ne: 'spam' },
      })
      if (emailDailySubmissions >= emailDayLimit) {
        return {
          isLimited: true,
          reason: `Exceeded daily limit of ${emailDayLimit} submissions per email`,
          nextAllowedTime: new Date(oneDayAgo.getTime() + 24 * 60 * 60 * 1000),
        }
      }
    }

    return { isLimited: false }
  } catch (error) {
    console.error('Failed to check guest speaker rate limit:', error)
    return { isLimited: false }
  }
}

export async function getRecentGuestSpeakerLogs(limit: number = 50): Promise<GuestSpeakerLog[]> {
  const db = await connectToDatabase()
  const collection = db.collection<GuestSpeakerLog>('guest_speaker_logs')
  
  return collection
    .find({})
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()
}

export async function getGuestSpeakerStats(days: number = 30) {
  const db = await connectToDatabase()
  const collection = db.collection<GuestSpeakerLog>('guest_speaker_logs')
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const logs = await collection
    .find({ timestamp: { $gte: startDate } })
    .toArray()

  const totalSubmissions = logs.length
  const successfulSubmissions = logs.filter(l => l.status === 'success').length
  const failedSubmissions = logs.filter(l => l.status === 'failure').length
  const spamSubmissions = logs.filter(l => l.status === 'spam').length

  // Group by day
  const submissionsByDay = logs.reduce((acc, log) => {
    const date = log.timestamp.toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalSubmissions,
    successfulSubmissions,
    failedSubmissions,
    spamSubmissions,
    submissionsByDay: Object.entries(submissionsByDay).map(([date, count]) => ({ date, count }))
  }
}
