import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { mdxComponents } from './registry'

// Server-only MDX compiler for DB-stored post content. Runs in RSC; the compiler
// never ships to the client. Compile cost is amortized by ISR at the route level
// (revalidate / on-demand revalidatePath on publish) — never per-visitor.
//
// Throws on malformed MDX — callers (the [slug] route) should try/catch and
// fall back to notFound() so one bad post can't crash the route.
export async function renderMdx(source: string): Promise<React.ReactElement> {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false, // metadata lives in DB columns, not MDX frontmatter
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ],
      },
    },
  })
  return content
}

// Convenience wrapper: returns null instead of throwing, for callers that prefer
// to render a fallback rather than 404 on a broken post.
export async function renderMdxSafe(source: string): Promise<React.ReactElement | null> {
  try {
    return await renderMdx(source)
  } catch (error) {
    console.error('[mdx] failed to compile post content:', error)
    return null
  }
}
