import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { level, context, message, metadata } = await request.json()

    // Validate the log data
    if (!level || !context || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: level, context, message' },
        { status: 400 }
      )
    }

    // For now, just log to console with a structured format
    // You can later integrate this with your main logging system
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      context: context.toUpperCase(),
      message: `[CLIENT] ${message}`,
      metadata,
      source: 'client-side'
    }

    console.log(JSON.stringify(logEntry))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log client message:', error)
    return NextResponse.json(
      { error: 'Failed to log message' },
      { status: 500 }
    )
  }
}