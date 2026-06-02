#!/usr/bin/env node
// Read-only inventory for the JSX -> MDX migration (Phase 4).
// Buckets every app/blog/<slug>/page.tsx by complexity so we know what converts
// mechanically (Tier A) vs. needs a hand-assisted rewrite (Tier B).
//
//   node scripts/classify-blog-posts.mjs
//
// Heuristic: a post is "rich" (Tier B) if its page.tsx uses React state/effects,
// Chart.js, or interactive widgets. Otherwise it's "simple" (Tier A).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const BLOG_DIR = join(process.cwd(), 'app', 'blog')
const RICH = /\buseState\b|\buseEffect\b|\buseRef\b|\buseReducer\b|<Chart\b|chart\.js|react-chartjs-2|new Chart\(|onClick=|<CodeBlock\b|<SeriesTableOfContents\b|<Tabs\b|Modal/

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (entry === 'page.tsx') out.push(p)
  }
  return out
}

const pages = walk(BLOG_DIR)
  // skip the dynamic render route itself
  .filter(p => !p.includes('[...slug]') && !p.includes('[slug]'))

const rows = pages.map(p => {
  const src = readFileSync(p, 'utf8')
  const slug = p.slice(BLOG_DIR.length + 1).replace(/\/page\.tsx$/, '')
  const lines = src.split('\n').length
  const tier = RICH.test(src) ? 'B (rich)' : 'A (simple)'
  const signals = [
    /useState/.test(src) && 'useState',
    /useEffect|useRef/.test(src) && 'effect/ref',
    /Chart|chart\.js|react-chartjs-2/.test(src) && 'chart',
    /onClick=/.test(src) && 'onClick',
    /<CodeBlock\b/.test(src) && 'CodeBlock',
    /<SeriesTableOfContents\b|SeriesNavigation/.test(src) && 'series',
  ].filter(Boolean).join(',')
  return { slug, tier, lines, signals }
})

const a = rows.filter(r => r.tier.startsWith('A')).sort((x, y) => x.lines - y.lines)
const b = rows.filter(r => r.tier.startsWith('B')).sort((x, y) => x.lines - y.lines)

console.log(`\nTotal blog page.tsx files: ${rows.length}`)
console.log(`  Tier A (simple, mechanical):  ${a.length}`)
console.log(`  Tier B (rich, hand-assisted): ${b.length}\n`)

console.log('=== Tier A — easiest first (good migration pilots) ===')
for (const r of a) console.log(`  [${String(r.lines).padStart(4)} ln] ${r.slug}${r.signals ? '  («' + r.signals + '»)' : ''}`)

console.log('\n=== Tier B — rich (need <Chart>/<Tabs>/etc. rewrite) ===')
for (const r of b) console.log(`  [${String(r.lines).padStart(4)} ln] ${r.slug}  «${r.signals}»`)
