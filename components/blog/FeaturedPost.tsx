// src/components/blog/FeaturedPost.tsx - UPDATED
import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '../../types/types'

interface FeaturedPostProps {
  post: BlogPost
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        {/* NEW: Featured image support */}
        {post.featuredImage && (
          <div className="aspect-[2/1] relative overflow-hidden">
            <Image
              src={post.featuredImage.url || post.featuredImage.thumbnailUrl}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Overlay content */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-yellow-500 text-yellow-900 text-sm px-3 py-1 rounded-full font-bold">
                  FEATURED
                </span>
                <span className="bg-white/90 text-gray-800 text-sm px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                {post.title}
              </h2>
            </div>
          </div>
        )}
        
        <div className="p-8">
          {/* Show badges if no featured image */}
          {!post.featuredImage && (
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-bold">
                FEATURED
              </span>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
            </div>
          )}
          
          {/* Title if no featured image */}
          {!post.featuredImage && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
          )}
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <time dateTime={post.publishDate}>
                {new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>{post.readTime}</span>
              {/* NEW: Photo indicator */}
              {post.photoIds && post.photoIds.length > 0 && (
                <span className="flex items-center gap-1 text-blue-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  {post.photoIds.length} photos
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
