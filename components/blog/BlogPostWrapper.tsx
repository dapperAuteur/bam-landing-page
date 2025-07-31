import Link from 'next/link'
import { BlogPost } from './../../types/types'

interface BlogPostWrapperProps {
  post: BlogPost
  children: React.ReactNode
}

export default function BlogPostWrapper({ post, children }: BlogPostWrapperProps) {
  return (
    <div className="min-h-screen pt-28">
      {/* Navigation breadcrumb */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container-max">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{post.title}</span>
          </div>
        </div>
      </nav>

      {/* Blog post metadata header */}
      <section className="bg-white py-8 border-b">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
              {post.featured && (
                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-bold">
                  FEATURED
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <time dateTime={post.publishDate}>
                Published {new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>{post.readTime}</span>
              <span>By Brand Anthony McDonald</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The actual blog post content */}
      <main>
        {children}
      </main>

      {/* Back to blog navigation */}
      <section className="bg-gray-50 py-12">
        <div className="container-max">
          <div className="text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}