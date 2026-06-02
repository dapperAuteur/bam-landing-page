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
