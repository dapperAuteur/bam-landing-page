// src/components/blog/BlogGrid.tsx - UPDATED
import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '../../types/types'

interface BlogGridProps {
  posts: BlogPost[]
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            All Stories
          </h2>
          <p className="text-xl text-gray-600">
            Exploring the intersection of technology, culture, and human experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
        {/* NEW: Featured image support */}
        {post.featuredImage && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={post.featuredImage.thumbnailUrl}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Photo indicator for posts with additional photos */}
            {post.photoIds && post.photoIds.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                +{post.photoIds.length - 1} photos
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
            {post.featured && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                FEATURED
              </span>
            )}
            {/* NEW: Content source indicator for admin */}
            {post.contentSource === 'cms' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                CMS
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <time dateTime={post.publishDate}>
              {new Date(post.publishDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
            <div className="flex items-center gap-3">
              <span>{post.readTime}</span>
              {/* NEW: Photo count indicator */}
              {post.photoIds && post.photoIds.length > 0 && (
                <span className="flex items-center gap-1 text-blue-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  {post.photoIds.length}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}