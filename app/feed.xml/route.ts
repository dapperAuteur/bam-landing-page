import { getAllBlogPosts } from '@/lib/blogData'

// Auto-updating RSS 2.0 feed. Reads the same unified data layer the blog renders
// from, so it's always current. ISR refreshes hourly; the admin save routes also
// call revalidatePath('/feed.xml') on publish/edit for immediate refresh.
export const revalidate = 3600

const baseUrl = 'https://brandanthonymcdonald.com'

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await getAllBlogPosts()

  // Newest first by publish date (feed order, independent of the featured-first listing order).
  const ordered = [...posts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  )

  const lastBuildDate = ordered.length
    ? new Date(ordered[0].publishDate).toUTCString()
    : new Date().toUTCString()

  const items = ordered
    .map((post) => {
      const link = `${baseUrl}/blog/${post.slug}`
      const description = post.excerpt || post.description || ''
      const pubDate = new Date(post.publishDate).toUTCString()
      const category = post.category ? `\n      <category>${escapeXml(post.category)}</category>` : ''
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>${category}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Brand Anthony McDonald — Blog</title>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Longevity, athletics, software, and the WitUS ecosystem — essays by Brand Anthony McDonald.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
