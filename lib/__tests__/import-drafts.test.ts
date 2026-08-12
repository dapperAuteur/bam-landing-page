import { describe, expect, it } from 'vitest'
import {
  buildDraftDoc,
  estimateReadTime,
  extractBody,
  importDrafts,
  parseDraftHeader,
} from '../../scripts/lib/blog-draft-import.mjs'

// A faithful miniature of the docs/Blog Files header convention, including the
// multi-line (indented continuation) Excerpt and the intro prose line.
const SPECIMEN = `<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Sign-In Broke Twice in July. The Fix Was a 158-Line Script.
Slug:    outage-to-invariant
Excerpt: Two production outages, same root cause: a registry saying one thing
         while the runtime believed another, and the link between them living
         in a comment.
Tags:    Postmortem, Reliability, CI, OIDC
Series:  Fit T. Cent Eval Findings (2 of 3)
-->

# Sign-In Broke Twice in July. The Fix Was a 158-Line Script.

I run the identity provider for my own product ecosystem.

## What users saw

A user clicks the button.
`

describe('parseDraftHeader', () => {
  it('parses Title, Slug, Tags, and Series from the comment header', () => {
    const h = parseDraftHeader(SPECIMEN)
    expect(h).not.toBeNull()
    expect(h!.title).toBe('Sign-In Broke Twice in July. The Fix Was a 158-Line Script.')
    expect(h!.slug).toBe('outage-to-invariant')
    expect(h!.tags).toEqual(['Postmortem', 'Reliability', 'CI', 'OIDC'])
    expect(h!.series).toBe('Fit T. Cent Eval Findings (2 of 3)')
  })

  it('joins indented continuation lines of a multi-line Excerpt', () => {
    const h = parseDraftHeader(SPECIMEN)
    expect(h!.excerpt).toBe(
      'Two production outages, same root cause: a registry saying one thing ' +
        'while the runtime believed another, and the link between them living in a comment.',
    )
  })

  it('ignores the intro prose line without treating it as a key or continuation', () => {
    const h = parseDraftHeader(SPECIMEN)
    expect(Object.keys(h!.fields)).not.toContain('draftforthebam-landing-pageblog')
    expect(h!.title.startsWith('Sign-In')).toBe(true)
  })

  it('returns null when there is no header comment', () => {
    expect(parseDraftHeader('# Just a markdown file\n\nBody.')).toBeNull()
  })

  it('returns null when the header lacks a Slug', () => {
    expect(parseDraftHeader('<!--\nTitle: No slug here\n-->\nBody.')).toBeNull()
  })

  it('parses an optional numeric FeaturedOrder and defaults it to null', () => {
    const withOrder = parseDraftHeader('<!--\nTitle: T\nSlug: s\nFeaturedOrder: 3\n-->\nBody.')
    expect(withOrder!.featuredOrder).toBe(3)
    expect(parseDraftHeader(SPECIMEN)!.featuredOrder).toBeNull()
  })

  it('defaults Tags to an empty array', () => {
    const h = parseDraftHeader('<!--\nTitle: T\nSlug: s\n-->\nBody.')
    expect(h!.tags).toEqual([])
  })
})

describe('extractBody', () => {
  it('drops the header and a leading H1 that repeats the title', () => {
    const body = extractBody(SPECIMEN, 'Sign-In Broke Twice in July. The Fix Was a 158-Line Script.')
    expect(body.startsWith('I run the identity provider')).toBe(true)
    expect(body).toContain('## What users saw')
  })

  it('keeps a leading H1 that differs from the title', () => {
    const raw = '<!--\nTitle: Real Title\nSlug: s\n-->\n\n# A different heading\n\nBody.'
    expect(extractBody(raw, 'Real Title').startsWith('# A different heading')).toBe(true)
  })
})

describe('buildDraftDoc', () => {
  const now = '2026-08-06T12:00:00.000Z'

  it('always inserts as an unpublished draft with CMS provenance', () => {
    const h = parseDraftHeader(SPECIMEN)!
    const doc = buildDraftDoc(h, extractBody(SPECIMEN, h.title), now)
    expect(doc.status).toBe('draft')
    expect(doc.contentSource).toBe('cms')
    expect(doc.firstPublishedAt).toBeNull()
    expect(doc.featured).toBe(false)
    expect(doc.publishDate).toBe('2026-08-06')
    expect(doc.series).toBe('Fit T. Cent Eval Findings (2 of 3)')
    expect(doc.description).toBe(doc.excerpt) // excerpt doubles as description fallback
  })

  it('maps an optional FeaturedOrder header key onto the document (null when absent)', () => {
    const withOrder = parseDraftHeader('<!--\nTitle: T\nSlug: s\nFeaturedOrder: 2\n-->\nBody.')!
    expect(buildDraftDoc(withOrder, 'Body.', now).featuredOrder).toBe(2)
    const without = parseDraftHeader(SPECIMEN)!
    expect(buildDraftDoc(without, 'Body.', now).featuredOrder).toBeNull()
  })

  it('estimates readTime from the body length', () => {
    expect(estimateReadTime('word '.repeat(400))).toBe('2 min read')
    expect(estimateReadTime('short body')).toBe('1 min read')
  })
})

describe('importDrafts insert-only semantics', () => {
  function mockCol(existingSlugs: string[]) {
    const inserted: Record<string, unknown>[] = []
    return {
      inserted,
      findOne: async ({ slug }: { slug: string }) =>
        existingSlugs.includes(slug) ? { slug } : null,
      insertOne: async (doc: Record<string, unknown>) => {
        inserted.push(doc)
        return { insertedId: 'x' }
      },
    }
  }

  const newDraft = { file: 'new-post.md', raw: '<!--\nTitle: New Post\nSlug: new-post\n-->\nBody text.' }
  const existingDraft = { file: 'old-post.md', raw: '<!--\nTitle: Old Post\nSlug: old-post\n-->\nEdited in repo AFTER import.' }
  const headerless = { file: 'notes.md', raw: '# Notes\nNot a draft.' }

  it('inserts new slugs and never overwrites existing ones', async () => {
    const col = mockCol(['old-post'])
    const s = await importDrafts({ entries: [newDraft, existingDraft, headerless], col, log: () => {} })
    expect(s).toMatchObject({ inserted: 1, skippedExisting: 1, skippedInvalid: 1 })
    expect(s.slugsInserted).toEqual(['new-post'])
    expect(col.inserted).toHaveLength(1)
    expect(col.inserted[0]).toMatchObject({ slug: 'new-post', status: 'draft' })
  })

  it('is idempotent: a second run with the slug now present writes nothing', async () => {
    const col = mockCol(['new-post'])
    const s = await importDrafts({ entries: [newDraft], col, log: () => {} })
    expect(s.inserted).toBe(0)
    expect(s.skippedExisting).toBe(1)
    expect(col.inserted).toHaveLength(0)
  })

  it('writes nothing in dry mode but still reports the plan', async () => {
    const col = mockCol([])
    const s = await importDrafts({ entries: [newDraft], col, dry: true, log: () => {} })
    expect(s.inserted).toBe(1)
    expect(col.inserted).toHaveLength(0)
  })
})

describe("--reapply: correcting a draft whose repo file changed", () => {
  // The gap this closes, found 2026-08-12: a draft imported on merge keeps its
  // original text forever, so a post corrected in the repo afterwards still
  // publishes the stale version from the dashboard. That is not hypothetical.
  // A withdrawn claim survived in a draft after the file stating it had been
  // retracted, and would have been published from the admin UI.
  const file = "p.md";
  const raw =
    "<!--\nTitle:   New Title\nSlug:    p\nExcerpt: New excerpt\nTags:    A, B\n-->\n\n# New Title\n\nCorrected body.\n";

  function col(existing: Record<string, unknown> | null) {
    const updates: unknown[] = [];
    return {
      updates,
      findOne: async () => existing,
      insertOne: async () => {
        throw new Error("must not insert over an existing slug");
      },
      updateOne: async (filter: unknown, update: unknown) => {
        updates.push({ filter, update });
        return { modifiedCount: 1 };
      },
    };
  }

  it("overwrites an existing DRAFT when its slug is named", async () => {
    const c = col({ slug: "p", status: "draft", content: "old" });
    const s = await importDrafts({
      entries: [{ file, raw }],
      col: c as never,
      log: () => {},
      reapply: ["p"],
    });
    expect(s.reapplied).toBe(1);
    expect(c.updates).toHaveLength(1);
  });

  // Republishing is an outward action and re-firing the outbox is not cleanup.
  it("refuses a published post even when named", async () => {
    const c = col({ slug: "p", status: "published", content: "old" });
    const s = await importDrafts({
      entries: [{ file, raw }],
      col: c as never,
      log: () => {},
      reapply: ["p"],
    });
    expect(s.reapplied).toBe(0);
    expect(c.updates).toHaveLength(0);
  });

  it("leaves an existing draft alone when not named", async () => {
    const c = col({ slug: "p", status: "draft", content: "old" });
    const s = await importDrafts({
      entries: [{ file, raw }],
      col: c as never,
      log: () => {},
    });
    expect(s.reapplied).toBe(0);
    expect(s.skippedExisting).toBe(1);
    expect(c.updates).toHaveLength(0);
  });
});
