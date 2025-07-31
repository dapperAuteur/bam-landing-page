import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPostBySlug } from '../../../lib/blogData'
import BlogPostWrapper from './../../../components/blog/BlogPostWrapper'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: `${post.title} | Brand Anthony McDonald`,
    description: post.description,
    keywords: post.tags.join(', '),
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  // Import the actual blog post component dynamically
  let BlogPostComponent: React.ComponentType
  
  try {
    // This will import the page.tsx from the blog post folder
    // For example: /blog/a-homeland-shaped-by-the-river-of-the-south-wind/page.tsx
    BlogPostComponent = require(`../../../blog/${params.slug}/page.tsx`).default
  } catch (error) {
    console.error(`Blog post component not found for slug: ${params.slug}`, error)
    notFound()
  }

  return (
    <BlogPostWrapper post={post}>
      <BlogPostComponent />
    </BlogPostWrapper>
  )
}