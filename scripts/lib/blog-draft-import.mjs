// Core logic for the blog draft auto-importer. Side-effect free so unit tests
// can exercise it directly; the CLI wrapper is scripts/import-drafts.mjs.
//
// Draft convention (docs/Blog Files/*.md): the file opens with an HTML comment
// carrying the post header, then the body follows the closing marker.
//
//   <!--
//   Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
//   Title:   Sign-In Broke Twice in July. The Fix Was a 158-Line Script.
//   Slug:    outage-to-invariant
//   Excerpt: Two production outages, same root cause: a registry saying one
//            thing while the runtime believed another.
//   Tags:    Postmortem, Reliability, CI
//   Series:  Fit T. Cent Observability (3 of 6)
//   -->
//
// Recognized keys: Title, Slug, Excerpt, Tags, Series, plus optional
// Description, Category, and FeaturedOrder. Values may continue across lines
// when the continuation line is indented (see Excerpt above). Unknown keys are
// preserved in the returned map so future header fields need no parser change.

/**
 * Parse the HTML-comment header at the top of a draft file.
 * Returns null when the file does not start with the header convention.
 */
// ﻿ = optional byte-order mark some editors prepend.
const HEADER_RE = /^﻿?\s*<!--([\s\S]*?)-->/

export function parseDraftHeader(raw) {
  const m = raw.match(HEADER_RE)
  if (!m) return null

  const fields = {}
  let lastKey = null
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z][A-Za-z ]*?):\s+(.*)$/)
    if (kv) {
      lastKey = kv[1].trim().toLowerCase().replace(/ /g, '')
      fields[lastKey] = kv[2].trim()
    } else if (lastKey && /^\s+\S/.test(line)) {
      // Indented continuation of the previous key (multi-line Excerpt etc.).
      fields[lastKey] += ' ' + line.trim()
    } else {
      // Prose line (the "Paste the body into..." sentence) resets continuation.
      lastKey = null
    }
  }

  if (!fields.slug || !fields.title) return null

  const order = Number.parseInt(fields.featuredorder ?? '', 10)
  return {
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt ?? '',
    tags: fields.tags
      ? fields.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [],
    series: fields.series ?? null,
    description: fields.description ?? '',
    category: fields.category ?? '',
    featuredOrder: Number.isNaN(order) ? null : order,
    fields, // raw key map, for forward compatibility
  }
}

/** Body = everything after the header comment, minus a leading H1 that repeats the title. */
export function extractBody(raw, title) {
  const m = raw.match(HEADER_RE)
  let body = m ? raw.slice(m[0].length) : raw
  body = body.replace(/^\s*\n/, '').trimEnd()
  // The post page renders post.title as the H1, so a duplicate markdown H1
  // would show the title twice. Strip it only when it matches the title.
  const h1 = body.match(/^#\s+(.+)\n?/)
  if (h1 && title && h1[1].trim().toLowerCase() === title.trim().toLowerCase()) {
    body = body.slice(h1[0].length).replace(/^\s*\n/, '')
  }
  return body
}

/** Rough reading-time estimate matching the site's "N min read" format. */
export function estimateReadTime(body) {
  const words = body.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

/**
 * Build the blog_posts document for a new draft. Shape mirrors the admin
 * POST /api/admin/blog/posts create path, except status is always 'draft'
 * (publishing stays an admin dashboard action so the outbox fires there).
 */
export function buildDraftDoc(header, body, now = new Date().toISOString()) {
  return {
    slug: header.slug,
    title: header.title,
    description: header.description || header.excerpt || '',
    excerpt: header.excerpt || '',
    category: header.category || 'Uncategorized',
    tags: header.tags,
    ...(header.series ? { series: header.series } : {}),
    readTime: estimateReadTime(body),
    publishDate: now.slice(0, 10),
    featured: false,
    // Optional FeaturedOrder header key; null = no rail position chosen.
    featuredOrder: header.featuredOrder ?? null,
    featuredImage: null,
    photoIds: [],
    content: body,
    status: 'draft',
    contentSource: 'cms',
    author: 'Brand Anthony McDonald',
    views: 0,
    firstPublishedAt: null,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Insert-only import. `entries` is [{ file, raw }]; `col` needs findOne/insertOne.
 *
 * The safety rule: a slug that already exists in blog_posts is NEVER touched.
 * The admin DB is the authority after first import; repo files are birth
 * certificates, not ongoing mirrors. A merge must not clobber admin edits.
 *
 * `reapply` is the one exception, and it is opt-in per slug: pass a list of
 * slugs to overwrite the body and title of an EXISTING DRAFT from its repo
 * file. Published posts are refused. Nothing re-applies unless named.
 */
export async function importDrafts({ entries, col, dry = false, log = console.log, now = new Date().toISOString(), reapply = [] }) {
  const summary = { inserted: 0, skippedExisting: 0, skippedInvalid: 0, reapplied: 0, slugsInserted: [], slugsReapplied: [] }

  for (const { file, raw } of entries) {
    const header = parseDraftHeader(raw)
    if (!header) {
      log(`  SKIP ${file}: no draft header (Title/Slug comment block) found`)
      summary.skippedInvalid++
      continue
    }

    const existing = await col.findOne({ slug: header.slug })
    if (existing) {
      // Opt-in re-apply for a DRAFT whose repo file has since been corrected.
      //
      // The insert-only rule below is right for the common case and stays the
      // default. It has one failure mode this handles: a draft imported on
      // merge, then corrected in the repo, keeps the ORIGINAL text forever, so
      // publishing from the dashboard publishes the stale version. That is not
      // hypothetical. A withdrawn claim survived in a draft after the file that
      // stated it had been retracted.
      //
      // Never touches a published post, because republishing is an outward
      // action and re-firing the outbox is not a cleanup. Never runs in hook
      // mode. Only the slugs named on the command line.
      if (reapply.includes(header.slug)) {
        if (existing.status !== 'draft') {
          log(`  REFUSE ${header.slug}: status is '${existing.status}', not 'draft'. Re-apply only touches drafts.`)
          summary.skippedExisting++
          continue
        }
        const body = extractBody(raw, header.title)
        log(`  ${dry ? '[dry] ' : ''}REAPPLY ${header.slug}: overwriting draft body and title (${existing.content?.length ?? 0} -> ${body.length} chars)`)
        if (!dry) {
          await col.updateOne(
            { slug: header.slug, status: 'draft' },
            { $set: { title: header.title, excerpt: header.excerpt, tags: header.tags, content: body, updatedAt: now } },
          )
        }
        summary.reapplied++
        summary.slugsReapplied.push(header.slug)
        continue
      }
      log(`  SKIP ${header.slug}: already in blog_posts (admin DB is the authority; file not re-applied)`)
      summary.skippedExisting++
      continue
    }

    const body = extractBody(raw, header.title)
    const doc = buildDraftDoc(header, body, now)
    log(`  ${dry ? '[dry] ' : ''}INSERT ${header.slug} as draft (${body.length} chars)`)
    if (!dry) await col.insertOne(doc)
    summary.inserted++
    summary.slugsInserted.push(header.slug)
  }

  return summary
}
