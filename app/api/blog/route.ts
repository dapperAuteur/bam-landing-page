import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/db/mongodb'
import { BlogPostDraft } from '../../../types/types'

// GET - Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')
    
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }
    
    const posts = await db.collection('blog_posts')
      .find(query)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    const total = await db.collection('blog_posts').countDocuments(query)
    
    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        id: post._id.toString()
      })),
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + posts.length < total
      }
    })
  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const postData = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const newPost = {
      ...postData,
      contentSource: 'cms',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: postData.author || 'Brand Anthony McDonald',
      views: 0
    }
    
    const result = await db.collection('blog_posts').insertOne(newPost)
    const postId = result.insertedId.toString()
    
    return NextResponse.json({ 
      success: true, 
      postId,
      post: {
        ...newPost,
        id: postId
      }
    })
  } catch (error) {
    console.error('Blog creation error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}