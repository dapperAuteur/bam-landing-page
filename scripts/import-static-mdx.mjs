#!/usr/bin/env node
// Phase 4 batch importer: load converted MDX from scripts/migrations/<slug>.mdx
// into the unified blog_posts collection (sets content + contentSource:'cms').
// Idempotent. Does NOT fire the outbox (migrating existing posts, not announcing).
//
//   node scripts/import-static-mdx.mjs            # apply all .mdx in scripts/migrations/
//   node scripts/import-static-mdx.mjs --dry      # show what would change, write nothing
//
// Filenames map to slugs by replacing '__' with '/'. e.g.
//   scripts/migrations/workouts__lphc.mdx  ->  slug "workouts/lphc"
//
// AFTER running this for a post, "activate" it by deleting that post's
// app/blog/<slug>/ folder (a concrete folder shadows the [...slug] MDX route).
import { config } from 'dotenv'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { MongoClient } from 'mongodb'

// Next stores secrets in .env.local; load it (then .env as fallback).
config({ path: '.env.local' })
config()

const DRY = process.argv.includes('--dry')
const DIR = join(process.cwd(), 'scripts', 'migrations')
const uri = process.env.MONGODB_URI
if (!uri) { console.error('MONGODB_URI not set (load .env.local)'); process.exit(1) }

const files = readdirSync(DIR).filter(f => f.endsWith('.mdx'))
if (files.length === 0) { console.log('No .mdx files in scripts/migrations/'); process.exit(0) }

const client = new MongoClient(uri)
await client.connect()
const col = client.db('bam_portfolio').collection('blog_posts')

let updated = 0, missing = 0
for (const file of files) {
  const slug = file.replace(/\.mdx$/, '').replace(/__/g, '/')
  const content = readFileSync(join(DIR, file), 'utf8')
  const existing = await col.findOne({ slug })
  if (!existing) {
    console.warn(`  ⚠ no blog_posts row for "${slug}" — run the Phase 0 migration first, or create it in the editor. Skipping.`)
    missing++
    continue
  }
  // These are LIVE posts (their folder serves them publicly today), so migrating
  // means they stay public -> status:'published'. We write directly here, NOT via
  // the Phase 3 API, so the outbox does NOT fire (this is a migration, not a new
  // announcement). Posts you want kept out of the listing simply shouldn't be
  // migrated yet.
  console.log(`  ${DRY ? '[dry] ' : ''}${slug}: ${content.length} chars MDX -> contentSource:cms, status:published`)
  if (!DRY) {
    await col.updateOne(
      { slug },
      { $set: { content, contentSource: 'cms', status: 'published', updatedAt: new Date().toISOString() } },
    )
    updated++
  }
}

console.log(`\n${DRY ? 'Would update' : 'Updated'} ${DRY ? files.length - missing : updated} post(s); ${missing} missing.`)
console.log('Next: delete each migrated post\'s app/blog/<slug>/ folder so the MDX route serves it.')
await client.close()
