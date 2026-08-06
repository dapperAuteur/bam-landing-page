#!/usr/bin/env node
// Legacy blog retirement audit (2026-08-06). Enumerates every app/blog/<slug>/
// folder post (page.tsx = live route, _page.tsx = deactivated), cross-references
// lib/blogData.ts (active vs commented entries), and flags every capability a
// post uses that is outside the unified MDX renderer's closed registry
// (lib/mdx/registry.tsx: Chart, Carousel, CodeBlock, YouTubeEmbed,
// SeriesTableOfContents + styled base HTML elements).
//
//   node scripts/audit-legacy-blog.mjs           # human-readable table
//   node scripts/audit-legacy-blog.mjs --json    # machine-readable
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const BLOG = join(ROOT, 'app', 'blog')
const SPECIAL = new Set(['[...slug]', 'legacy'])

// --- collect posts (live page.tsx and deactivated _page.tsx), any nesting depth
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) {
      if (!SPECIAL.has(name)) walk(p, out)
    } else if (name === 'page.tsx' || name === '_page.tsx') {
      const slug = relative(BLOG, dir).split('\\').join('/')
      if (slug === '') continue // the /blog index itself
      out.push({ slug, file: p, active: name === 'page.tsx' })
    }
  }
  return out
}

// --- blogData entries: active (uncommented) vs commented-out
const blogDataSrc = readFileSync(join(ROOT, 'lib', 'blogData.ts'), 'utf8')
const activeSlugs = new Map() // slug -> entry text
{
  // strip comments, then find slug fields inside the array literal
  const uncommented = blogDataSrc.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  const arr = uncommented.slice(uncommented.indexOf('blogPosts: BlogPost[] = ['), uncommented.indexOf('\n]'))
  for (const m of arr.matchAll(/slug:\s*"([^"]+)"/g)) activeSlugs.set(m[1], true)
}
const commentedSlugs = new Set()
for (const m of blogDataSrc.matchAll(/\/\/\s*slug:\s*"([^"]+)"/g)) commentedSlugs.add(m[1])

// --- non-registry capability signals per post source
const SIGNALS = [
  ['useState', /\buseState\b/],
  ['useEffect/useRef', /\buse(Effect|Ref)\b/],
  ['onClick', /\bonClick=/],
  ['chart.js-imperative', /from ['"]chart\.js['"]/],
  ['InsightModal', /InsightModal/],
  ['AudioPlayer', /AudioPlayer/],
  ['VideoPlaceholder', /VideoPlaceholder/],
  ['CodeBlock(ui)', /components\/ui\/CodeBlock/],
  ['CodeBlock(blog)', /components\/blog\/CodeBlock/],
  ['SeriesProgress', /SeriesProgress/],
  ['heroicons', /@heroicons/],
  ['framer-motion', /framer-motion/],
  ['recaptcha', /GoogleReCaptcha/],
  ['external-script', /<script[^>]*src=/],
  ['form/input', /<(form|input|textarea|select)\b/],
  ['localStorage', /localStorage/],
  ['dangerouslySetInnerHTML', /dangerouslySetInnerHTML/],
]
// asset references (local files) — co-located or /public paths
const ASSET_RE = /src=\{?["'`](\/[^"'`]+\.(png|jpe?g|gif|svg|webp|mp3|mp4|webm))/g

const posts = walk(BLOG).sort((a, b) => a.slug.localeCompare(b.slug))
const rows = posts.map(({ slug, file, active }) => {
  const src = readFileSync(file, 'utf8')
  const signals = SIGNALS.filter(([, re]) => re.test(src)).map(([n]) => n)
  const assets = [...src.matchAll(ASSET_RE)].map(m => m[1])
  const listing = activeSlugs.has(slug) ? 'listed' : commentedSlugs.has(slug) ? 'commented' : 'no-entry'
  const registryCompatible = signals.length === 0
  return { slug, route: active, listing, lines: src.split('\n').length, signals, assets, registryCompatible }
})

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2))
} else {
  for (const r of rows) {
    console.log(
      `${r.route ? 'LIVE ' : 'INERT'} ${r.listing.padEnd(9)} ${String(r.lines).padStart(5)} ln  ${r.slug}` +
      (r.signals.length ? `  «${r.signals.join(',')}»` : '  (registry-clean)') +
      (r.assets.length ? `  assets: ${r.assets.join(', ')}` : '')
    )
  }
  const live = rows.filter(r => r.route)
  console.log(`\n${rows.length} folder posts total: ${live.length} live routes, ${rows.length - live.length} deactivated (_page.tsx).`)
  console.log(`Live+listed: ${live.filter(r => r.listing === 'listed').length}; live unlisted: ${live.filter(r => r.listing !== 'listed').length}.`)
}
