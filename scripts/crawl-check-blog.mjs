#!/usr/bin/env node
// Post-import crawl check for migrated blog posts (user-task runbook step).
// For every scripts/migrations/<slug>.mdx, fetches /blog/<slug> and asserts
// HTTP 200 plus the frontmatter title appearing in the HTML (title match is
// skipped for files without a frontmatter title, e.g. the pre-contract
// gitkraken migration, which gets a 200-only check).
//
//   node scripts/crawl-check-blog.mjs                                  # prod
//   node scripts/crawl-check-blog.mjs --base=http://localhost:3000     # local
//
// Base URL default matches the canonical site URL used in the [...slug]
// route's JSON-LD. Read-only; safe to run any time.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = (process.argv.find(a => a.startsWith('--base=')) || '--base=https://brandanthonymcdonald.com').slice('--base='.length)
const DIR = join(process.cwd(), 'scripts', 'migrations')

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')

let failures = 0
const files = readdirSync(DIR).filter(f => f.endsWith('.mdx')).sort()
for (const file of files) {
  const slug = file.replace(/\.mdx$/, '').replace(/__/g, '/')
  const raw = readFileSync(join(DIR, file), 'utf8')
  const title = (raw.match(/^title:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '')
  const url = `${BASE}/blog/${slug}`
  try {
    const res = await fetch(url, { redirect: 'follow' })
    if (res.status !== 200) {
      failures++
      console.error(`  FAIL ${slug}: HTTP ${res.status}`)
      continue
    }
    if (title) {
      const html = decode(await res.text())
      if (!html.includes(title)) {
        failures++
        console.error(`  FAIL ${slug}: 200 but title not found ("${title}")`)
        continue
      }
    }
    console.log(`  ok   ${slug}${title ? '' : ' (200-only, no frontmatter title)'}`)
  } catch (e) {
    failures++
    console.error(`  FAIL ${slug}: fetch error ${e.message}`)
  }
}
console.log(`\n${files.length} URLs checked against ${BASE}, ${failures} failure(s).`)
process.exit(failures ? 1 : 0)
