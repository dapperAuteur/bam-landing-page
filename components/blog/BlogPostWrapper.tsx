// src/components/blog/BlogPostWrapper.tsx - UPDATED
import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '../../types/types'

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

      {/* NEW: Featured image hero */}
      {post.featuredImage && (
        <section className="relative">
          <div className="aspect-[21/9] relative overflow-hidden">
            <Image
              src={post.featuredImage.url || post.featuredImage.thumbnailUrl}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Hero content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="container-max">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="bg-yellow-500 text-yellow-900 text-sm px-3 py-1 rounded-full font-bold">
                        FEATURED
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    {post.title}
                  </h1>
                  
                  {post.description && (
                    <p className="text-xl text-gray-200 mb-6 max-w-3xl">
                      {post.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog post metadata header (modified for when there's a featured image) */}
      <section className={`bg-white py-8 ${post.featuredImage ? '' : 'border-b'}`}>
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            {/* Only show title and description if no featured image */}
            {!post.featuredImage && (
              <>
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
                
                {post.description && (
                  <p className="text-xl text-gray-600 mb-6">
                    {post.description}
                  </p>
                )}
              </>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <time dateTime={post.publishDate}>
                Published {new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>{post.readTime}</span>
              <span>By {post.author || 'Brand Anthony McDonald'}</span>
              {/* NEW: Photo count */}
              {post.photoIds && post.photoIds.length > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  {post.photoIds.length} photos
                </span>
              )}
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