// Blog draft checks (read-only): the ledger's "today's checks" as one command.
//
// A draft in docs/Blog Files/ passes when:
//   - its header parses (Title / Slug / Excerpt / Tags, read by the importer),
//   - its body compiles as MDX (the same compiler and remark-gfm the site uses),
//   - its prose has no em dash, en dash, or double hyphen used as a dash,
//   - its prose has none of the AI-writing-tells phrases (HIGH, MED or LOW).
// Code (fenced and inline) and URLs are not prose, so dashes there are fine.
//
// Usage:
//   node scripts/check-blog-drafts.mjs                 # every draft; exit 1 if any fail
//   node scripts/check-blog-drafts.mjs a.md b.md       # just these files
//   node scripts/check-blog-drafts.mjs --verbose       # also print each hit in context

import { readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { extractBody, parseDraftHeader } from './lib/blog-draft-import.mjs'
import { HIGH, LOW, MED } from './lib/ai-writing-tells.mjs'

const DIR = join(process.cwd(), 'docs', 'Blog Files')
const VERBOSE = process.argv.includes('--verbose')
const args = process.argv.slice(2).filter(a => !a.startsWith('--'))
const files = args.length > 0 ? args : readdirSync(DIR).filter(f => f.endsWith('.md')).map(f => join(DIR, f))

/** Prose only: drop fenced code, inline code, URLs, and MDX/HTML comments. */
function prose(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
}

/** Em/en dashes anywhere in prose; `--` between words (not table rules or horizontal rules). */
function dashHits(text) {
  const hits = []
  for (const line of prose(text).split('\n')) {
    if (/^\s*\|?\s*:?-{3,}/.test(line) || /^\s*-{3,}\s*$/.test(line)) continue
    for (const m of line.matchAll(/[—–]|(?<![-!<])--(?![->])/g)) {
      hits.push(line.slice(Math.max(0, m.index - 30), m.index + 30).trim())
    }
  }
  return hits
}

function tellHits(text) {
  const t = prose(text)
  const hits = []
  for (const phrase of [...HIGH, ...MED, ...LOW]) {
    const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const n = (t.match(new RegExp(`(?<![a-z])${esc}(?![a-z])`, 'gi')) || []).length
    if (n > 0) hits.push(`"${phrase}" ×${n}`)
  }
  return hits
}

let failed = 0
for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const header = parseDraftHeader(raw)
  const problems = []

  if (!header?.slug || !header?.title) problems.push('no parseable header')
  const body = extractBody(raw, header?.title)
  const headerText = header ? [header.title, header.excerpt, header.description].filter(Boolean).join('\n') : ''

  const dashes = [...dashHits(headerText), ...dashHits(body)]
  if (dashes.length > 0) problems.push(`dashes (${dashes.length})`)
  const tells = tellHits(`${headerText}\n${body}`)
  if (tells.length > 0) problems.push(`AI-tell phrases: ${tells.join(', ')}`)

  try {
    await compile(body, { remarkPlugins: [remarkGfm] })
  } catch (err) {
    problems.push(`MDX does not compile: ${String(err?.reason ?? err?.message ?? err).split('\n')[0]}`)
  }

  if (problems.length > 0) {
    failed++
    console.log(`FAIL ${basename(file)}: ${problems.join('; ')}`)
    if (VERBOSE) for (const d of dashes) console.log(`       dash: …${d}…`)
  }
}

console.log(`\n${files.length - failed} of ${files.length} drafts pass; ${failed} fail.`)
process.exit(failed > 0 ? 1 : 0)
