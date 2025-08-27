import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { Logger, LogContext } from '../../../../../lib/logging/logger'

// MongoDB connection
let client: MongoClient
let adminKey: string | undefined
let token: string;

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

// Admin authentication
function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  // const adminKey = process.env.ADMIN_API_KEY
  adminKey = process.env.ADMIN_API_KEY
  
  if (!adminKey || !authHeader) return false
  
  // const token = authHeader.replace('Bearer ', '')
  token = authHeader.replace('Bearer ', '')
  return token === adminKey
}

export async function GET(request: NextRequest) {
  try {
    // Validate admin authentication
    if (!validateAdminAuth(request)) {
      await Logger.error(LogContext.SYSTEM, 'Admin education stats error', {
      request,
      metadata: {
        error: String("Unauthorized"),
        adminKey: adminKey,
        token: token
      }
    })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await Logger.info(LogContext.SYSTEM, "Admin education stats request", { request })

    const db = await connectToDatabase()
    const educationCollection = db.collection('education_submissions')
    
    // Get query parameters
    const searchParams = new URL(request.url).searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const lookbackTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    // Basic counts
    const [
      totalSubmissions,
      newSubmissions,
      reviewedSubmissions,
      respondedSubmissions,
      closedSubmissions
    ] = await Promise.all([
      educationCollection.countDocuments({ submittedAt: { $gte: lookbackTime } }),
      educationCollection.countDocuments({ 
        submittedAt: { $gte: lookbackTime },
        status: 'new' 
      }),
      educationCollection.countDocuments({ 
        submittedAt: { $gte: lookbackTime },
        status: 'reviewed' 
      }),
      educationCollection.countDocuments({ 
        submittedAt: { $gte: lookbackTime },
        status: 'responded' 
      }),
      educationCollection.countDocuments({ 
        submittedAt: { $gte: lookbackTime },
        status: 'closed' 
      })
    ])

    // Custom requests count
    const customRequests = await educationCollection.countDocuments({
      submittedAt: { $gte: lookbackTime },
      customCreationRequest: true
    })

    // Top form types
    const formTypeAggregation = await educationCollection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      { $group: { _id: "$formType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray()

    const topFormTypes = formTypeAggregation.map(item => ({
      formType: item._id || "Unknown",
      count: item.count
    }))

    // Submissions by day
    const submissionsByDayAggregation = await educationCollection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    const submissionsByDay = submissionsByDayAggregation.map(item => ({
      date: item._id,
      count: item.count
    }))

    // Top states/countries
    const stateAggregation = await educationCollection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray()

    const topStates = stateAggregation.map(item => ({
      state: item._id || "Unknown",
      count: item.count
    }))

    // Grade distribution
    const gradeAggregation = await educationCollection.aggregate([
      { $match: { submittedAt: { $gte: lookbackTime } } },
      { $unwind: "$gradesTeaching" },
      { $group: { _id: "$gradesTeaching", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray()

    const gradeDistribution = gradeAggregation.map(item => ({
      grade: item._id,
      count: item.count
    }))

    // Recent submissions preview
    const recentSubmissions = await educationCollection
      .find({}, {
        projection: {
          _id: 1,
          name: 1,
          email: 1,
          schoolName: 1,
          formType: 1,
          submittedAt: 1,
          status: 1,
          customCreationRequest: 1
        }
      })
      .sort({ submittedAt: -1 })
      .limit(5)
      .toArray()

    const stats = {
      totalSubmissions,
      newSubmissions,
      reviewedSubmissions,
      respondedSubmissions,
      closedSubmissions,
      customRequests,
      topFormTypes,
      submissionsByDay,
      topStates,
      gradeDistribution,
      recentSubmissions: recentSubmissions.map(sub => ({
        ...sub,
        _id: sub._id.toString()
      }))
    }

    return NextResponse.json(stats)

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, 'Admin education stats error', {
      request,
      metadata: { error: String(error) }
    })

    return NextResponse.json(
      { error: 'Failed to fetch education statistics' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}