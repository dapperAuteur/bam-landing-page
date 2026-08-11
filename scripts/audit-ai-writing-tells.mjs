// AI-writing-tells auditor (read-only).
//
// Scans blog content — the migrated MDX bodies (scripts/migrations/*.mdx, served
// from the DB) and the remaining hand-built folder posts (app/blog/**/page.tsx) —
// for phrases and patterns characteristic of LLM-generated prose, and prints a
// ranked report so the worst offenders can be triaged and rewritten by hand.
//
// Usage:
//   node scripts/audit-ai-writing-tells.mjs            # ranked table to stdout
//   node scripts/audit-ai-writing-tells.mjs --md       # markdown report to stdout
//
// It NEVER edits anything. Scores are heuristic — a high score means "worth a
// human look," not "definitely AI."

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const MD = process.argv.includes('--md')

// --- Marker sets. Weight reflects how strongly the phrase signals LLM prose. ---
// HIGH: near-diagnostic clichés. MED: common-but-telling. Patterns are matched
// case-insensitively as whole phrases.
const HIGH = [
  'delve into', 'delved into', 'in today’s fast-paced', "in today's fast-paced",
  'a testament to', 'stands as a testament', 'rich tapestry', 'tapestry of',
  'navigating the complexities', 'navigate the complexities', 'in the realm of',
  'treasure trove', 'unlock the power', 'unlock the potential', 'unlock the secrets',
  'embark on a journey', 'ever-evolving', 'ever-changing landscape', 'needless to say',
  'without further ado', 'when it comes to', 'harness the power', 'look no further',
  'dive into the world', 'in the world of', 'at the end of the day', 'it goes without saying',
  'the power of', 'unleash the', 'paving the way', 'a game-changer', 'game changer',
  'in conclusion', 'last but not least',
]
const MED = [
  'it’s important to note', "it's important to note", 'it’s worth noting', "it's worth noting",
  'it is worth noting', 'that being said', 'moreover', 'furthermore', 'additionally,',
  'in summary', 'leverage', 'seamless', 'seamlessly', 'robust', 'elevate your',
  'cutting-edge', 'boasts', 'plays a crucial role', 'plays a pivotal role',
  'plays a vital role', 'plays a key role', 'foster a', 'underscore', 'pivotal',
  'myriad', 'showcase', 'holistic', 'first and foremost', 'on the other hand',
]
const LOW = [
  'let’s dive', "let's dive", 'let’s explore', "let's explore", 'let’s take a look',
  "let's take a look", 'firstly', 'secondly', 'thirdly', 'in this article', 'in this post',
  'in this guide', 'by the end of this', 'keep in mind', 'whether you’re a', "whether you're a",
  'remember,', 'crucial', 'vital', 'comprehensive', 'vibrant',
]

const WEIGHTS = { HIGH: 3, MED: 2, LOW: 1 }

function countPhrase(text, phrase) {
  // Whole-phrase, case-insensitive, word-ish boundaries.
  const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(?<![a-z])${esc}(?![a-z])`, 'gi')
  return (text.match(re) || []).length
}

// Strip a .tsx/.mdx file down to a rough prose blob.
function extractText(raw, isMdx) {
  let t = raw
  if (isMdx) {
    t = t.replace(/^---[\s\S]*?---/, '')        // frontmatter
    t = t.replace(/```[\s\S]*?```/g, ' ')        // fenced code
  } else {
    t = t.replace(/^\s*import .*$/gm, ' ')       // imports
    t = t.replace(/className=("[^"]*"|'[^']*'|\{[^}]*\})/g, ' ') // class strings
    t = t.replace(/<\/?[A-Za-z][^>]*>/g, ' ')    // JSX tags
    t = t.replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')  // JSX comments
  }
  t = t.replace(/`[^`]*`/g, ' ')                 // inline code/backticks
  t = t.replace(/https?:\/\/\S+/g, ' ')          // urls
  return t
}

function wordCount(text) {
  return (text.match(/[A-Za-z][A-Za-z'’-]*/g) || []).length
}

function analyze(raw, isMdx) {
  const text = extractText(raw, isMdx)
  const words = wordCount(text)
  const hits = {}
  let score = 0
  for (const [tier, list] of [['HIGH', HIGH], ['MED', MED], ['LOW', LOW]]) {
    for (const p of list) {
      const n = countPhrase(text, p)
      if (n) { hits[p] = (hits[p] || 0) + n; score += n * WEIGHTS[tier] }
    }
  }
  // Em-dash density (per 1000 words) — heavy "—" use is a known tell.
  const emDashes = (text.match(/—/g) || []).length
  const emPer1k = words ? (emDashes / words) * 1000 : 0
  if (emPer1k > 8) score += Math.round((emPer1k - 8) / 2)
  const per1k = words ? (score / words) * 1000 : 0
  return { words, score, per1k, emDashes, emPer1k, hits }
}

// --- Walk the content sources. ---
function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (name.startsWith('_')) continue
      walk(full, out)
    } else if (name === 'page.tsx' && !name.startsWith('_')) {
      out.push(full)
    }
  }
}

const files = []
// 1) migrated MDX (DB-served bodies)
const migDir = join(ROOT, 'scripts/migrations')
for (const f of readdirSync(migDir)) {
  if (f.endsWith('.mdx')) files.push(join(migDir, f))
}
// 2) remaining folder posts
walk(join(ROOT, 'app/blog'), files)

const rows = []
for (const f of files) {
  const isMdx = f.endsWith('.mdx')
  const raw = readFileSync(f, 'utf8')
  const slug = f
    .replace(join(ROOT, 'app/blog') + '/', '')
    .replace('/page.tsx', '')
    .replace(join(ROOT, 'scripts/migrations') + '/', 'migrated:')
    .replace('.mdx', '')
  const a = analyze(raw, isMdx)
  if (a.words < 50) continue // skip stubs
  rows.push({ slug, ...a })
}

rows.sort((x, y) => y.per1k - x.per1k)

if (MD) {
  console.log('# AI-writing-tells audit\n')
  console.log(`Scanned ${rows.length} posts. Sorted by weighted tells per 1,000 words (higher = more AI-flavored).\n`)
  console.log('| Rank | Post | Words | Score | /1k | Top tells |')
  console.log('|---|---|---|---|---|---|')
  rows.forEach((r, i) => {
    const top = Object.entries(r.hits).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([p, n]) => `${p}×${n}`).join('; ')
    console.log(`| ${i + 1} | ${r.slug} | ${r.words} | ${r.score} | ${r.per1k.toFixed(1)} | ${top || '—'} |`)
  })
} else {
  console.log(`\nAI-writing-tells audit — ${rows.length} posts, sorted by tells/1k words\n`)
  rows.forEach((r, i) => {
    const top = Object.entries(r.hits).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([p, n]) => `${p}×${n}`).join(', ')
    console.log(
      `${String(i + 1).padStart(3)}. ${r.per1k.toFixed(1).padStart(5)}/1k  score=${String(r.score).padStart(3)}  ` +
      `words=${String(r.words).padStart(4)}  em—=${r.emDashes}  ${r.slug}`
    )
    if (top) console.log(`      tells: ${top}`)
  })
}
