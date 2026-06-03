import { MetadataRoute } from 'next'

const BASE = 'https://brandanthonymcdonald.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep admin, auth, API, and private client surfaces out of the index.
        disallow: ['/admin', '/api', '/login', '/client-gallery/', '/portal/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
