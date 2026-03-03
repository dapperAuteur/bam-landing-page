import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { Logger, LogContext } from '../../../../../../lib/logging/logger'

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

function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.ADMIN_API_KEY

  if (!adminKey || !authHeader) return false

  const token = authHeader.replace('Bearer ', '')
  return token === adminKey
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!validateAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const collection = db.collection('workout_feedback_submissions')

    const submission = await collection.findOne({ _id: new ObjectId(id) })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...submission,
      _id: submission._id.toString()
    })

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin get workout feedback submission error', {
      request,
      metadata: { error: String(error), id: params.id }
    })

    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!validateAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    const body = await request.json()
    const { status, notes } = body

    const validStatuses = ['new', 'reviewed', 'responded', 'closed']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: new, reviewed, responded, closed' },
        { status: 400 }
      )
    }

    await Logger.info(LogContext.SYSTEM, `Admin update workout feedback: ${id}`, {
      request,
      metadata: { status, notes }
    })

    const db = await connectToDatabase()
    const collection = db.collection('workout_feedback_submissions')

    const updateData: Record<string, unknown> = {
      updatedAt: new Date()
    }

    if (status) {
      updateData.status = status
    }

    if (notes !== undefined) {
      updateData.adminNotes = notes
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const updatedSubmission = await collection.findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      submission: {
        ...updatedSubmission,
        _id: updatedSubmission?._id.toString()
      }
    })

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin update workout feedback error', {
      request,
      metadata: { error: String(error), id: params.id }
    })

    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!validateAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    await Logger.info(LogContext.SYSTEM, `Admin delete workout feedback: ${id}`, { request })

    const db = await connectToDatabase()
    const collection = db.collection('workout_feedback_submissions')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    })

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin delete workout feedback error', {
      request,
      metadata: { error: String(error), id: params.id }
    })

    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
