// src/app/api/admin/logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/db/mongodb'

// Server-side interfaces
interface BaseLogEntry {
  _id?: string
  context: string
  level: string
  message: string
  timestamp: Date
  userId?: string
  requestId?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

interface ContactLog {
  _id?: string
  event: string
  email?: string
  serviceType?: string
  ipAddress: string
  userAgent: string
  status: "success" | "failure" | "spam"
  reason?: string
  formData?: any
  metadata?: Record<string, any>
  timestamp: Date
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const level = searchParams.get('level') || 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 500)
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db()

    let logs: (BaseLogEntry | ContactLog)[] = []

    // Fetch contact logs
    if (type === 'all' || type === 'contact') {
      const contactLogs = await db.collection<ContactLog>('contact_logs')
        .find({})
        .sort({ timestamp: -1 })
        .limit(type === 'contact' ? limit : Math.ceil(limit / 2))
        .skip(type === 'contact' ? skip : 0)
        .toArray()
      
      logs.push(...contactLogs)
    }

    // Fetch system logs
    if (type === 'all' || type === 'system') {
      const systemQuery: any = {}
      
      // Filter by log level for system logs
      if (level !== 'all') {
        systemQuery.level = level
      }

      const systemLogs = await db.collection<BaseLogEntry>('system_logs')
        .find(systemQuery)
        .sort({ timestamp: -1 })
        .limit(type === 'system' ? limit : Math.ceil(limit / 2))
        .skip(type === 'system' ? skip : 0)
        .toArray()
      
      logs.push(...systemLogs)
    }

    // Sort combined logs by timestamp
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply final limit if fetching both types
    if (type === 'all') {
      logs = logs.slice(0, limit)
    }

    // Get total counts for pagination
    const totalCounts = await Promise.all([
      type === 'all' || type === 'contact' 
        ? db.collection('contact_logs').countDocuments()
        : Promise.resolve(0),
      type === 'all' || type === 'system'
        ? db.collection('system_logs').countDocuments(
            level !== 'all' ? { level } : {}
          )
        : Promise.resolve(0)
    ])

    const totalContactLogs = totalCounts[0]
    const totalSystemLogs = totalCounts[1]
    const totalLogs = type === 'contact' 
      ? totalContactLogs 
      : type === 'system' 
        ? totalSystemLogs 
        : totalContactLogs + totalSystemLogs

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total: totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
        hasNextPage: page * limit < totalLogs,
        hasPrevPage: page > 1
      },
      counts: {
        contact: totalContactLogs,
        system: totalSystemLogs,
        total: totalLogs
      }
    })

  } catch (error) {
    console.error('Failed to fetch logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}