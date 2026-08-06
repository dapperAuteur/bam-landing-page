#!/usr/bin/env node
// Structural parity check for the legacy blog retirement (no DB access).
// For every scripts/migrations/<slug>.mdx this asserts the [...slug] route
// WOULD serve it once imported:
//   1. frontmatter parses with the importer's exact parser semantics and
//      carries the keys the importer needs to create a row (title,
//      description, excerpt, category, tags, readTime, publishDate)
//   2. publishDate is YYYY-MM-DD (wrong shapes reorder the index and feeds)
//   3. the MDX compiles with the production compiler settings (remark-gfm,
//      rehype-slug, rehype-autolink-headings), so renderMdxSafe will not 404 it
//   4. every capitalized JSX component used is in the closed registry
//      (Chart, Carousel, CodeBlock, YouTubeEmbed, SeriesTableOfContents)
//   5. slugs are unique, don't hit reserved routes, and no live
//      app/blog/<slug>/page.tsx folder still shadows the catch-all route
//      (a leftover folder means the post was converted but not "activated")
//
// Run AFTER folder deletion; exits 1 on any failure. DOES NOT touch Mongo —
// the applying import against prod is a post-merge operator step.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const ROOT = process.cwd()
const DIR = join(ROOT, 'scripts', 'migrations')
const REGISTRY = new Set(['Chart', 'Carousel', 'CodeBlock', 'YouTubeEmbed', 'SeriesTableOfContents'])
const RESERVED = new Set(['legacy']) // concrete routes under /blog that a slug must not equal
const REQUIRED = ['title', 'description', 'excerpt', 'category', 'tags', 'readTime', 'publishDate']
// Pre-frontmatter-contract migrations whose blog_posts row already exists and
// already carries the metadata (frontmatter is optional for existing rows).
const FRONTMATTER_EXEMPT = new Set(['gitkraken-accidental-rebase.mdx'])

// Same parser semantics as scripts/import-static-mdx.mjs (kept in sync by hand;
// both are line-oriented `key: value` with [a, b] tag lists).
function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { data: {}, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: raw }
  const fm = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\s*\n/, '')
  const data = {}
  for (const line of fm.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim()
    if (key === 'tags') {
      val = val.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    } else if (val === 'true' || val === 'false') {
      val = val === 'true'
    } else {
      val = val.replace(/^["']|["']$/g, '')
    }
    data[key] = val
  }
  return { data, body }
}

const files = readdirSync(DIR).filter(f => f.endsWith('.mdx')).sort()
let failures = 0
const fail = (slug, msg) => { failures++; console.error(`  FAIL ${slug}: ${msg}`) }

const seen = new Set()
for (const file of files) {
  const failuresBefore = failures
  const slug = file.replace(/\.mdx$/, '').replace(/__/g, '/')
  const raw = readFileSync(join(DIR, file), 'utf8')
  const { data, body } = parseFrontmatter(raw)

  // 1+2: frontmatter completeness and date shape
  if (!FRONTMATTER_EXEMPT.has(file)) {
    for (const k of REQUIRED) {
      if (!(k in data) || data[k] === '' || (k === 'tags' && !Array.isArray(data[k]))) fail(slug, `frontmatter missing/empty: ${k}`)
    }
  }
  if (data.publishDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.publishDate)) fail(slug, `publishDate not YYYY-MM-DD: ${data.publishDate}`)

  // 3: compiles under production compiler settings
  try {
    await compile(body, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
    })
  } catch (e) {
    fail(slug, `MDX does not compile: ${e.message}`)
  }

  // 4: only registry components (capitalized JSX tags)
  const used = new Set([...body.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)].map(m => m[1]))
  for (const c of used) if (!REGISTRY.has(c)) fail(slug, `non-registry component <${c}>`)

  // 5: slug uniqueness, reserved names, folder shadowing
  if (seen.has(slug)) fail(slug, 'duplicate slug')
  seen.add(slug)
  if (RESERVED.has(slug.split('/')[0]) || slug === '') fail(slug, 'reserved/empty slug')
  if (existsSync(join(ROOT, 'app', 'blog', ...slug.split('/'), 'page.tsx'))) {
    fail(slug, 'live app/blog folder still shadows the [...slug] route (delete it to activate)')
  }
  if (failures === failuresBefore) console.log(`  ok   ${slug}`)
}

console.log(`\n${files.length} migration files checked, ${failures} failure(s).`)
process.exit(failures ? 1 : 0)
