import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { mdxComponents } from './registry'

// Server-only MDX compiler for DB-stored post content. Compiles + evaluates with
// @mdx-js/mdx directly (the maintained core) rather than next-mdx-remote — the
// latter's 5.x is flagged by an advisory and its 6.x requires React 19, which
// silently drops all MDX expressions on this React 18 app. @mdx-js/mdx@3 works on
// React 18 and is not under advisory. Runs in RSC; the compiler never ships to the
// client. Compile cost is amortized by ISR at the route (revalidate / on-demand).
//
// Throws on malformed MDX — callers (the [...slug] route) should try/catch and
// fall back to notFound() so one bad post can't crash the route.
export async function renderMdx(source: string): Promise<React.ReactElement> {
  const { default: MDXContent } = await evaluate(source, {
    ...runtime,
    baseUrl: import.meta.url,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  })
  return <MDXContent components={mdxComponents} />
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
