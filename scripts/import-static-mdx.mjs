#!/usr/bin/env node
// Phase 4 batch importer: load converted MDX from scripts/migrations/<slug>.mdx
// into the unified blog_posts collection. Idempotent. Does NOT fire the outbox
// (migrating existing live posts, not announcing new ones).
//
//   node scripts/import-static-mdx.mjs            # apply all .mdx in scripts/migrations/
//   node scripts/import-static-mdx.mjs --dry      # show what would change, write nothing
//   node scripts/import-static-mdx.mjs --only=my-slug   # just one post (safest for a new post)
//
// Filenames map to slugs by replacing '__' with '/'. e.g.
//   scripts/migrations/workouts__lphc.mdx  ->  slug "workouts/lphc"
//
// Each .mdx MAY start with YAML-ish frontmatter. It is REQUIRED for posts that
// don't already have a blog_posts row (the ~47 folder-only posts), so we can
// create the row; for posts that already have a row it's optional (overrides).
//
//   ---
//   title: My Post
//   description: ...
//   excerpt: ...
//   category: Software Development
//   tags: [Git, DX]
//   readTime: 5 min read
//   publishDate: 2026-04-27
//   featured: false
//   ---
//   ## Body in MDX...
//
// Migrated posts are set status:'published' (they're already live via their
// folder). AFTER running this, "activate" each by deleting its app/blog/<slug>/
// folder so the [...slug] MDX route serves it.
import { config } from 'dotenv'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { MongoClient } from 'mongodb'

// Next stores secrets in .env.local; load it (then .env as fallback).
config({ path: '.env.local' })
config()

const DRY = process.argv.includes('--dry')
// --only=<slug> limits the run to one post. Without it every .mdx in the
// directory is re-applied, which overwrites the DB copy of posts that may have
// been edited in the admin since their .mdx was written. Prefer --only when
// publishing a single new post.
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice('--only='.length)
const DIR = join(process.cwd(), 'scripts', 'migrations')
const uri = process.env.MONGODB_URI
if (!uri) { console.error('MONGODB_URI not set (load .env.local)'); process.exit(1) }

// Minimal frontmatter parser (no deps). Returns { data, body }.
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

const META_KEYS = ['title', 'description', 'excerpt', 'category', 'tags', 'readTime', 'publishDate', 'featured']

const files = readdirSync(DIR)
  .filter(f => f.endsWith('.mdx'))
  .filter(f => !ONLY || f.replace(/\.mdx$/, '').replace(/__/g, '/') === ONLY)
if (files.length === 0) {
  console.log(ONLY ? `No .mdx in scripts/migrations/ matching --only=${ONLY}` : 'No .mdx files in scripts/migrations/')
  process.exit(0)
}
if (ONLY) console.log(`Limiting to --only=${ONLY}\n`)

const client = new MongoClient(uri)
await client.connect()
const col = client.db('bam_portfolio').collection('blog_posts')

let created = 0, updated = 0, skipped = 0
for (const file of files) {
  const slug = file.replace(/\.mdx$/, '').replace(/__/g, '/')
  const { data, body } = parseFrontmatter(readFileSync(join(DIR, file), 'utf8'))
  const existing = await col.findOne({ slug })
  const now = new Date().toISOString()

  if (existing) {
    const set = { content: body, contentSource: 'cms', status: 'published', updatedAt: now }
    for (const k of META_KEYS) if (k in data) set[k] = data[k]
    console.log(`  ${DRY ? '[dry] ' : ''}UPDATE ${slug} (${body.length} chars)`)
    if (!DRY) { await col.updateOne({ slug }, { $set: set }); updated++ }
  } else {
    if (!data.title) {
      console.warn(`  ⚠ SKIP ${slug}: no blog_posts row and no frontmatter title to create one.`)
      skipped++
      continue
    }
    const doc = {
      slug,
      title: data.title,
      description: data.description ?? '',
      excerpt: data.excerpt ?? '',
      category: data.category ?? 'Uncategorized',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readTime: data.readTime ?? '',
      publishDate: data.publishDate ?? now.slice(0, 10),
      featured: data.featured === true,
      featuredOrder: 999,
      content: body,
      contentSource: 'cms',
      status: 'published',
      author: 'Brand Anthony McDonald',
      views: 0,
      firstPublishedAt: now,
      createdAt: now,
      updatedAt: now,
    }
    console.log(`  ${DRY ? '[dry] ' : ''}CREATE ${slug} (${body.length} chars)`)
    if (!DRY) { await col.insertOne(doc); created++ }
  }
}

console.log(`\n${DRY ? '[dry] ' : ''}created ${created}, updated ${updated}, skipped ${skipped} (of ${files.length}).`)
console.log('Next: delete each migrated post\'s app/blog/<slug>/ folder so the MDX route serves it.')
await client.close()
