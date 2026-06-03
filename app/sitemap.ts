import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blogData'

const baseUrl = 'https://brandanthonymcdonald.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Unified source — includes migrated/CMS posts, not just the static array.
  const posts = await getAllBlogPosts()
  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified ? new Date(post.lastModified) : new Date(post.publishDate),
    changeFrequency: 'monthly',
    priority: post.featured ? 0.8 : 0.6,
  }))

  const now = new Date()
  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/photography`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/galleries`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/experience`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/intake`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ]

  return [...staticUrls, ...blogUrls]
}
