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
