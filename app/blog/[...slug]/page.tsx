import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPostBySlug, getAllBlogPosts } from '@/lib/blogData'
import BlogPostWrapper from '@/components/blog/BlogPostWrapper'
import { renderMdxSafe } from '@/lib/mdx/render'

// ISR: MDX compile happens at build / on-demand revalidate, never per-visitor.
export const revalidate = 3600

interface BlogPostPageProps {
  params: { slug: string[] }
}

// Prerender only the CMS/MDX posts this catch-all actually renders. Legacy
// 'static' posts are served by their own app/blog/<slug> folder route (Next
// prioritizes a concrete folder over this catch-all), so they are NOT listed here.
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts
    .filter(p => p.contentSource === 'cms' && p.content)
    .map(p => ({ slug: p.slug.split('/') }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const slug = params.slug.join('/')
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Blog Post Not Found' }
  }

  // Prefer the post's featured photo; otherwise fall back to a generated,
  // branded OG card so EVERY post has a strong social image.
  const generatedOg = `/api/og?title=${encodeURIComponent(post.title)}${post.category ? `&category=${encodeURIComponent(post.category)}` : ''}`
  const ogImages = post.featuredImage?.url
    ? [{ url: post.featuredImage.url, alt: post.featuredImage.alt || post.title }]
    : [{ url: generatedOg, alt: post.title }]

  return {
    title: `${post.title} | Brand Anthony McDonald`,
    description: post.description,
    keywords: post.tags?.join(', '),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `/blog/${slug}`,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ogImages.map(i => i.url),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = params.slug.join('/')
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // CMS/MDX posts render their stored MDX content. Drafts are not public.
  if (post.contentSource === 'cms' && post.content) {
    if (post.status && post.status !== 'published') {
      notFound()
    }
    const rendered = await renderMdxSafe(post.content)
    if (!rendered) {
      notFound() // malformed MDX — don't crash the route
    }
    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.publishDate,
      dateModified: post.lastModified || post.publishDate,
      author: { '@type': 'Person', name: post.author || 'Brand Anthony McDonald' },
      publisher: { '@type': 'Person', name: 'Brand Anthony McDonald' },
      keywords: post.tags?.join(', '),
      url: `https://brandanthonymcdonald.com/blog/${slug}`,
      mainEntityOfPage: `https://brandanthonymcdonald.com/blog/${slug}`,
      ...(post.featuredImage?.url ? { image: post.featuredImage.url } : {}),
    }
    return (
      <BlogPostWrapper post={post}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        {rendered}
      </BlogPostWrapper>
    )
  }

  // Legacy 'static' posts are served by their own folder route; if we reach here
  // for one (no MDX content), there's nothing to render.
  notFound()
}
