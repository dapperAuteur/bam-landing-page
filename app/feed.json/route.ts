import { getAllBlogPosts } from '@/lib/blogData'

// JSON Feed 1.1 companion to /feed.xml — same unified data source, same ISR cadence.
export const revalidate = 3600

const baseUrl = 'https://brandanthonymcdonald.com'

export async function GET() {
  const posts = await getAllBlogPosts()

  const ordered = [...posts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  )

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Brand Anthony McDonald — Blog',
    home_page_url: `${baseUrl}/blog`,
    feed_url: `${baseUrl}/feed.json`,
    description:
      'Longevity, athletics, software, and the WitUS ecosystem — essays by Brand Anthony McDonald.',
    language: 'en-us',
    authors: [{ name: 'Brand Anthony McDonald', url: baseUrl }],
    items: ordered.map((post) => ({
      id: `${baseUrl}/blog/${post.slug}`,
      url: `${baseUrl}/blog/${post.slug}`,
      title: post.title,
      summary: post.excerpt || post.description || '',
      content_text: post.excerpt || post.description || '',
      date_published: new Date(post.publishDate).toISOString(),
      tags: post.category ? [post.category] : undefined,
    })),
  }

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
