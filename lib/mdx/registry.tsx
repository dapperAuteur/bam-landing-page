import React from 'react'
import Link from 'next/link'
import { CodeBlock } from '@/components/blog/CodeBlock'
import { YouTubeEmbed } from '@/components/blog/YouTubeEmbed'
import { SeriesTableOfContents } from '@/components/blog/SeriesNavigation'
import Chart from '@/components/blog/Chart'
import PhotoCarousel from '@/components/ui/PhotoCarousel'

// The CLOSED component registry for DB-authored MDX. MDX can only render base
// HTML elements (styled below) plus the named components registered here — it
// cannot import arbitrary modules. This is the security boundary that replaces
// phase2's dangerouslySetInnerHTML renderer. Keep additions deliberate.

// Fenced code (```lang) compiles to <pre><code class="language-lang">…</code></pre>.
// Delegate to the interactive CodeBlock (Prism highlight + copy button).
function Pre({ children }: { children?: React.ReactNode }) {
  const codeEl = React.isValidElement(children) ? children : null
  const className = (codeEl?.props?.className as string) ?? ''
  const match = /language-(\w+)/.exec(className)
  const raw = codeEl?.props?.children
  const code = typeof raw === 'string' ? raw : String(raw ?? '')

  if (match) {
    return <CodeBlock code={code} language={match[1]} />
  }
  return (
    <pre className="my-6 overflow-x-auto rounded-xl bg-[#1E1E1E] p-4 text-sm text-gray-100">
      {children}
    </pre>
  )
}

function Anchor({ href = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  // Persistent underline (not just on hover) so inline links are distinguishable
  // from body text without relying on color alone — WCAG "link-in-text-block".
  const cls = 'text-blue-700 underline underline-offset-2 hover:text-blue-800'
  if (href.startsWith('/')) {
    return <Link href={href} className={cls} {...props} />
  }
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  )
}

export const mdxComponents = {
  // Named interactive components authors can use in MDX
  Chart,
  Carousel: PhotoCarousel,
  CodeBlock,
  YouTubeEmbed,
  SeriesTableOfContents,

  // Base-element styling for consistent prose
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 mb-4 text-2xl font-bold text-gray-900 scroll-mt-24" {...p} />
  ),
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 scroll-mt-24" {...p} />
  ),
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 leading-relaxed text-gray-700" {...p} />
  ),
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-gray-700" {...p} />
  ),
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-gray-700" {...p} />
  ),
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 border-l-4 border-blue-200 pl-4 italic text-gray-600" {...p} />
  ),
  code: (p: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-pink-700" {...p} />
  ),
  pre: Pre,
  a: Anchor,
  img: (p: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-6 rounded-xl" alt={p.alt ?? ''} {...p} />
  ),
  table: (p: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...p} />
    </div>
  ),
  th: (p: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-gray-300 px-3 py-2 font-semibold" {...p} />
  ),
  td: (p: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-gray-100 px-3 py-2" {...p} />
  ),
}
