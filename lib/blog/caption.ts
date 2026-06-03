const PUBLIC_BASE_URL = 'https://brandanthonymcdonald.com'

// Social caption for a newly-published blog post (outbox coming-soon drafts).
export function buildBlogCaption(post: { slug: string; title: string; excerpt: string }): string {
  return [
    `New post: "${post.title}"`,
    '',
    post.excerpt,
    '',
    `${PUBLIC_BASE_URL}/blog/${post.slug}`,
  ].join('\n')
}

// Social caption for a newly-created MARKETING gallery (outbox coming-soon
// drafts). Client-delivery galleries never go through here — they're private.
export function buildGalleryCaption(gallery: {
  galleryId: string
  eventName: string
  description?: string
}): string {
  return [
    `New gallery: "${gallery.eventName}"`,
    '',
    gallery.description || 'A fresh set of photos is up.',
    '',
    `${PUBLIC_BASE_URL}/client-gallery/${gallery.galleryId}`,
  ].join('\n')
}
