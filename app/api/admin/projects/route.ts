import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import type { ClientProject, ProposalStatus } from '@/types/client-portal'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const projects = await db.collection('client_projects')
      .find({})
      .sort({ updatedAt: -1 })
      .toArray()

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const projectId = `${data.clientName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const now = new Date()

    const project: Omit<ClientProject, '_id'> = {
      projectId,
      type: data.type || 'proposal',
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      projectName: data.projectName,
      description: data.description || '',
      serviceCategory: data.serviceCategory || 'combination',
      media: [],
      proposal: data.proposal || {
        coverLetter: { title: 'Cover Letter', content: '', order: 0 },
        scopeOfWork: { title: 'Scope of Work', content: '', order: 1 },
        deliverables: [],
        pricing: { lineItems: [], subtotal: 0, total: 0, currency: 'USD' },
        timeline: [],
        terms: { title: 'Terms & Conditions', content: '', order: 5 },
        customSections: []
      },
      settings: {
        allowDownloads: true,
        allowFullSize: false,
        allowSocialSharing: false,
        requirePassword: data.accessCode ? true : false,
        showMetadata: false,
        layout: 'grid',
        downloadsPerSession: undefined,
        allowComments: true,
        allowApproval: true,
        showPricing: true,
        showTimeline: true,
        brandColor: data.brandColor || '#2563eb',
        ...data.settings
      },
      accessCode: data.accessCode || undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      status: 'draft' as ProposalStatus,
      statusHistory: [{
        status: 'draft' as ProposalStatus,
        changedAt: now,
        changedBy: 'admin'
      }],
      createdAt: now,
      updatedAt: now
    }

    await db.collection('client_projects').insertOne(project)

    return NextResponse.json({ project, projectId })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
