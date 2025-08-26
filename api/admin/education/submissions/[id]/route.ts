import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { Logger, LogContext } from './../../../../../lib/logging/logger'

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

// GET individual submission
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

    await Logger.info(LogContext.SYSTEM, `Admin get education submission: ${id}`, { request })

    const db = await connectToDatabase()
    const educationCollection = db.collection('education_submissions')
    
    const submission = await educationCollection.findOne({ _id: new ObjectId(id) })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...submission,
      _id: submission._id.toString()
    })

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin get education submission error', {
      request,
      metadata: { error: String(error), id: params.id }
    })

    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}

// PATCH (update) individual submission
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

    // Validate status
    const validStatuses = ['new', 'reviewed', 'responded', 'closed']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: new, reviewed, responded, closed' },
        { status: 400 }
      )
    }

    await Logger.info(LogContext.SYSTEM, `Admin update education submission: ${id}`, {
      request,
      metadata: { status, notes }
    })

    const db = await connectToDatabase()
    const educationCollection = db.collection('education_submissions')
    
    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    }

    if (status) {
      updateData.status = status
    }

    if (notes !== undefined) {
      updateData.adminNotes = notes
    }

    const result = await educationCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Get the updated submission
    const updatedSubmission = await educationCollection.findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      submission: {
        ...updatedSubmission,
        _id: updatedSubmission?._id.toString()
      }
    })

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin update education submission error', {
      request,
      metadata: { error: String(error), id: params.id }
    })

    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

// DELETE individual submission
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

    await Logger.info(LogContext.SYSTEM, `Admin delete education submission: ${id}`, { request })

    const db = await connectToDatabase()
    const educationCollection = db.collection('education_submissions')
    
    const result = await educationCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    })

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin delete education submission error', {
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