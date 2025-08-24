import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '../../../../lib/db/mongodb'

// GET - Fetch single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const post = await db.collection('blog_posts')
      .findOne({ 
        $or: [
          { _id: new ObjectId(params.postId) },
          { slug: params.postId }
        ]
      })
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment view count for published posts accessed by slug
    if (params.postId === post.slug && post.status === 'published') {
      await db.collection('blog_posts').updateOne(
        { _id: post._id },
        { $inc: { views: 1 } }
      )
    }
    
    return NextResponse.json({ 
      post: {
        ...post,
        id: post._id.toString()
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postData = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const { id, _id, createdAt, ...updateData } = postData
    
    const result = await db.collection('blog_posts').updateOne(
      { _id: new ObjectId(params.postId) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog update error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const result = await db.collection('blog_posts').deleteOne({ 
      _id: new ObjectId(params.postId) 
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}