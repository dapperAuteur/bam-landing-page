'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  PencilIcon, 
  EyeIcon, 
  PhotoIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { BlogPost, BlogPostDraft } from '../../types/types'
import { blogPosts } from '../../lib/blogData' // Your existing static posts

interface AdminBlogPost extends BlogPost {
  source: 'static' | 'cms'
  id?: string
}

export default function BlogAdminDashboard() {
  const [cmsBlogs, setCmsBlogs] = useState<BlogPostDraft[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'static'>('all')

  useEffect(() => {
    fetchCmsBlogs()
  }, [])

  const fetchCmsBlogs = async () => {
    try {
      const response = await fetch('/api/blog')
      if (response.ok) {
        const data = await response.json()
        setCmsBlogs(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to fetch CMS blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Combine static and CMS posts
  const allPosts: AdminBlogPost[] = [
    // CMS posts
    ...cmsBlogs.map(post => ({
      ...post,
      source: 'cms' as const,
      contentSource: 'cms' as const
    })),
    // Static posts  
    ...blogPosts.map(post => ({
      ...post,
      source: 'static' as const,
      contentSource: 'static' as const,
      status: 'published' as const
    }))
  ]

  const filteredPosts = allPosts.filter(post => {
    switch (filter) {
      case 'published':
        return post.status === 'published'
      case 'draft':
        return post.status === 'draft'
      case 'static':
        return post.source === 'static'
      default:
        return true
    }
  })

  const getStatusColor = (status: string, source: string) => {
    if (source === 'static') return 'bg-blue-100 text-blue-800'
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string, source: string) => {
    if (source === 'static') return 'Static File'
    return status === 'published' ? 'Published' : 'Draft'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your blog posts, including both CMS-managed and static file posts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{allPosts.length}</div>
          <div className="text-sm text-gray-500">Total Posts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {allPosts.filter(p => p.status === 'published').length}
          </div>
          <div className="text-sm text-gray-500">Published</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {allPosts.filter(p => p.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-500">Drafts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {allPosts.filter(p => p.photoIds && p.photoIds.length > 0).length}
          </div>
          <div className="text-sm text-gray-500">With Photos</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All Posts' },
          { key: 'published', label: 'Published' },
          { key: 'draft', label: 'Drafts' },
          { key: 'static', label: 'Static Files' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {label}
            <span className="ml-1 text-xs">
              ({key === 'all' ? allPosts.length : 
                key === 'static' ? allPosts.filter(p => p.source === 'static').length :
                allPosts.filter(p => p.status === key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No blog posts found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={`${post.source}-${post.slug}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {post.featuredImage && (
                          <img
                            src={post.featuredImage.thumbnailUrl}
                            alt={post.featuredImage.alt || post.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {post.excerpt}
                          </p>
                          {post.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${getStatusColor(post.status || 'published', post.source)}`}>
                        {getStatusText(post.status || 'published', post.source)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <PhotoIcon className="h-4 w-4 mr-1" />
                        {post.photoIds?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.publishDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        title="View post"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      
                      {post.source === 'cms' ? (
                        <Link
                          href={`/admin/blog/${post.id || post.slug}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          title="Edit post"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span 
                          className="text-gray-400 inline-flex items-center cursor-not-allowed"
                          title="Static file posts cannot be edited through admin"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Post Types:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-gray-700">Static File Posts - Managed in code, cannot be edited through admin</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-700">CMS Posts - Managed through admin interface with photo support</span>
          </div>
        </div>
      </div>
    </div>
  )
}