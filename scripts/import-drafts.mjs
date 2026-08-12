#!/usr/bin/env node
// Draft auto-importer: scan docs/Blog Files/*.md for the HTML-comment header
// convention (Title/Slug/Excerpt/Tags/Series) and insert each NEW slug into
// the unified blog_posts collection as status:'draft'. Existing slugs are
// never touched: the admin DB is the authority after first import; repo files
// are birth certificates, not ongoing mirrors. Publishing stays an admin
// dashboard action, so the outbox fires on publish exactly as before.
//
//   node scripts/import-drafts.mjs                 # apply (insert new drafts)
//   node scripts/import-drafts.mjs --dry           # preview, write nothing
//   node scripts/import-drafts.mjs --only=my-slug  # limit to one slug
//   node scripts/import-drafts.mjs --reapply=my-slug,other-slug
//                                                  # overwrite EXISTING DRAFTS
//                                                  # from their repo files
//   node scripts/import-drafts.mjs --if-vercel-prod
//
// --if-vercel-prod is the post-deploy hook mode (wired as the package.json
// "postbuild" script, which npm runs automatically after "build"): it no-ops
// unless VERCEL_ENV === 'production', and it NEVER exits non-zero, so a Mongo
// hiccup cannot fail a production build. Vercel must be using the default
// `npm run build` build command for postbuild to fire; a dashboard override
// that calls `next build` directly would skip it (run the script manually in
// that case).
//
// Result: merge a draft branch, the production deploy's postbuild inserts it,
// and the post appears in /admin/blog/posts as a draft.
import { config } from 'dotenv'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { MongoClient } from 'mongodb'
import { importDrafts, parseDraftHeader } from './lib/blog-draft-import.mjs'

// Next stores secrets in .env.local; load it (then .env as fallback).
config({ path: '.env.local' })
config()

const DRY = process.argv.includes('--dry')
const HOOK = process.argv.includes('--if-vercel-prod')
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice('--only='.length)
// Comma-separated slugs whose EXISTING DRAFT should be overwritten from its
// repo file. Opt-in per slug, refuses published posts, and disabled in hook
// mode so a production deploy can never silently rewrite a draft.
const REAPPLY = (process.argv.find(a => a.startsWith('--reapply=')) || '')
  .slice('--reapply='.length)
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
const DIR = join(process.cwd(), 'docs', 'Blog Files')

if (HOOK && process.env.VERCEL_ENV !== 'production') {
  console.log(`import-drafts: skipping (VERCEL_ENV=${process.env.VERCEL_ENV ?? 'unset'}, not production).`)
  process.exit(0)
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not set (load .env.local)')

  const entries = readdirSync(DIR, { withFileTypes: true })
    .filter(d => d.isFile() && d.name.endsWith('.md'))
    .map(d => ({ file: d.name, raw: readFileSync(join(DIR, d.name), 'utf8') }))
    .filter(e => !ONLY || parseDraftHeader(e.raw)?.slug === ONLY)

  if (entries.length === 0) {
    console.log(ONLY ? `No draft in docs/Blog Files/ matching --only=${ONLY}` : 'No .md drafts in docs/Blog Files/')
    return
  }
  if (ONLY) console.log(`Limiting to --only=${ONLY}\n`)

  const client = new MongoClient(uri)
  await client.connect()
  try {
    const col = client.db('bam_portfolio').collection('blog_posts')
    if (REAPPLY.length && HOOK) {
      console.log('import-drafts: --reapply is ignored in hook mode; a deploy must not rewrite drafts.')
    }
    const s = await importDrafts({
      entries,
      col,
      dry: DRY,
      reapply: HOOK ? [] : REAPPLY,
    })
    console.log(
      `\n${DRY ? '[dry] ' : ''}inserted ${s.inserted} draft${s.inserted === 1 ? '' : 's'}, ` +
      `re-applied ${s.reapplied}, ` +
      `skipped ${s.skippedExisting} existing, ${s.skippedInvalid} without a header (of ${entries.length} files).`,
    )
    if (s.inserted > 0 && !DRY) {
      console.log('New drafts are in /admin/blog/posts. Publish from the dashboard; the outbox fires there.')
    }
  } finally {
    await client.close()
  }
}

try {
  await main()
} catch (err) {
  console.error(`import-drafts: ${err instanceof Error ? err.message : err}`)
  // In hook mode a failed import must not fail the production build.
  process.exit(HOOK ? 0 : 1)
}
