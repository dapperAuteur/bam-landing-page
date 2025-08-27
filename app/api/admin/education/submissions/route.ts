import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { Logger, LogContext } from '../../../../../lib/logging/logger'
import { EducationSubmission } from '../../../../../types/education'

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

export async function GET(request: NextRequest) {
  try {
    if (!validateAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await Logger.info(LogContext.SYSTEM, "Admin education submissions request", { request })

    const db = await connectToDatabase()
    const educationCollection = db.collection<EducationSubmission>('education_submissions')
    
    // Parse query parameters
    const searchParams = new URL(request.url).searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') // 'new', 'reviewed', 'responded', 'closed'
    const formType = searchParams.get('formType')
    const customOnly = searchParams.get('customOnly') === 'true'
    const searchQuery = searchParams.get('search') // search in name, email, school
    
    // Build MongoDB query
    const query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (formType) {
      query.formType = formType
    }
    
    if (customOnly) {
      query.customCreationRequest = true
    }
    
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { schoolName: { $regex: searchQuery, $options: 'i' } },
        { schoolDistrict: { $regex: searchQuery, $options: 'i' } },
        { city: { $regex: searchQuery, $options: 'i' } },
        { state: { $regex: searchQuery, $options: 'i' } }
      ]
    }

    // Get total count
    const totalCount = await educationCollection.countDocuments(query)
    
    // Get paginated submissions
    const submissions = await educationCollection
      .find(query)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Convert ObjectIds to strings
    const serializedSubmissions = submissions.map(submission => ({
      ...submission,
      _id: submission._id?.toString()
    }))

    const response = {
      submissions: serializedSubmissions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        status,
        formType,
        customOnly,
        searchQuery
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin education submissions error', {
      request,
      metadata: { error: String(error) }
    })

    return NextResponse.json(
      { error: 'Failed to fetch education submissions' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}