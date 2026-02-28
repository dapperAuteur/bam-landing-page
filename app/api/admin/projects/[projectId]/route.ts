import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { v2 as cloudinary } from 'cloudinary'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const project = await db.collection('client_projects').findOne({ projectId: params.projectId })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const { _id, projectId, createdAt, statusHistory, ...updateData } = data

    const result = await db.collection('client_projects').updateOne(
      { projectId: params.projectId },
      { $set: { ...updateData, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const project = await db.collection('client_projects').findOne({ projectId: params.projectId })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Clean up Cloudinary assets
    if (project.media?.length > 0) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      })
      try {
        await cloudinary.api.delete_resources_by_prefix(`bam-photography/projects/${params.projectId}`)
      } catch (err) {
        console.error('Cloudinary cleanup error:', err)
      }
    }

    await db.collection('client_projects').deleteOne({ projectId: params.projectId })
    // Also clean up sessions
    await db.collection('client_sessions').deleteMany({ projectId: params.projectId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
