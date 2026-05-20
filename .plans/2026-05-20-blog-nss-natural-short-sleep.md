# Publish "Natural Short Sleepers" — human-written, 6th-grade-readable version + site-wide ecosystem footer

> Slug: `nss-natural-short-sleep` · Date: 2026-05-20 · Branch: `feat/blog-nss-natural-short-sleep-ecosystem-footer`

## Context

Two interrelated pieces of work, bundled into one branch because both ship together:

**A. New human-written blog post.** The repo has [`app/blog/nss-natural-short-sleep-ai/page.tsx`](../app/blog/nss-natural-short-sleep-ai/page.tsx) — a Chart.js infographic with an "Ask AI" modal + "Generate Hypothesis" Gemini call. BAM wants a clean, human-written companion at `/blog/nss-natural-short-sleep` that strips the AI features, writes at a 6th-grade reading level, cites primary peer-reviewed sources with APA inline citations + linked bibliography, includes two graphs, ships with proper metadata, and lands as featured.

**B. Site-wide WitUS ecosystem footer + Rise Wellness callout.** BAM clarified the Rise Wellness callout and ecosystem footer should appear on **every page**, not just this post. The current [`components/ui/Footer.tsx`](../components/ui/Footer.tsx) — dark theme, four columns — mounts globally via [`components/layout/PublicLayout.tsx`](../components/layout/PublicLayout.tsx) on every non-admin route. The right move is to augment that single file rather than add per-page footer blocks.

Reference implementation: [`lang-chain/centenarian-coach-multiagent/src/components/SiteFooter.tsx`](../../../lang-chain/centenarian-coach-multiagent/src/components/SiteFooter.tsx) (light sky-on-white). Canonical recipe + non-negotiable disclaimer copy: [`gemini/witus/public/brand/footer-recipe.md`](../../../gemini/witus/public/brand/footer-recipe.md). Dark-theme adaptation pattern: [`gemini/witus/components/Footer.tsx`](../../../gemini/witus/components/Footer.tsx) (dark slate + teal accents).

Note: this consciously overrides the footer-recipe.md note that bam-landing-page should be a "single-sentence ecosystem mention" — BAM's updated directive takes precedence.

---

## Files to modify

1. **[`components/ui/Footer.tsx`](../components/ui/Footer.tsx)** — augment the existing dark-themed footer in place. Don't replace; preserve the existing voice (BAM's bio, services list, social links, "Discipline and focus" footer line). Add:
   - **Rise Wellness callout** as the first block inside the existing container, above the current 4-column grid. Use the canonical markup byte-identical to [`gemini/witus/components/Footer.tsx:163-278`](../../../gemini/witus/components/Footer.tsx#L163-L278), swapping container surface tokens to bam-landing-page's palette: dark background already inherited; border `border-indigo-500/30`, surface `bg-indigo-500/5`, eyebrow `text-indigo-300`, link/focus `text-indigo-300`, quote border `border-indigo-500/40`. Replace `[YOUR APP NAME]` tokens (subtitle + non-negotiable disclaimer) with **`Brand Anthony McDonald`** — both spots, no other edits to the disclaimer.
   - **"WitUS Ecosystem" column** as a 5th item in the existing nav grid. Update the grid class from `grid-cols-2 md:grid-cols-4` to `grid-cols-2 md:grid-cols-5` (or `lg:grid-cols-5` with `md:grid-cols-3` as a step) — verify the visual balance during dev-server check. Column contents: sibling-product list, ten links, all `target="_blank" rel="noopener noreferrer"`. Match dark-theme link classes already in use: `text-gray-300 hover:text-white transition-colors`.

   Canonical sibling-product list (mirror of the recipe, 10 items):
   ```ts
   const SIBLING_PRODUCTS = [
     { name: "WitUS.online", href: "https://witus.online" },
     { name: "WitUS Inbox", href: "https://inbox.witus.online" },
     { name: "CentenarianOS", href: "https://centenarianos.com" },
     { name: "Work.WitUS", href: "https://work.witus.online" },
     { name: "Tour Manager OS", href: "https://tour.witus.online" },
     { name: "Wanderlearn", href: "https://wanderlearn.witus.online" },
     { name: "Fly.WitUS", href: "https://fly.witus.online" },
     { name: "FlashLearnAI", href: "https://flashlearnai.witus.online" },
     { name: "Learn.WitUS", href: "https://centenarianos.com/academy" },
     { name: "AwesomeWebStore", href: "https://awesomewebstore.com" },
   ];
   ```

   - **Update the existing "Connect" column** with a Rise Wellness link below the existing Contact item (per the recipe's Partners & Legal column — minor addition, no removal).
   - **Update the bottom-border copyright/tagline line** to add a small "Part of the WitUS ecosystem · A B4C LLC / AwesomeWebStore.com brand" line below the existing "Discipline and focus…" tagline. Keep the existing tagline; this is additive.

   Keep the file as a default-export server component (no `"use client"` needed; everything is static markup).

2. **[`lib/blogData.ts`](../lib/blogData.ts)** — insert a new entry at the top of the `blogPosts` array:
   ```ts
   {
     slug: "nss-natural-short-sleep",
     title: "Why Some People Sleep Less and Still Feel Great",
     description: "A plain-language tour of what science knows about natural short sleepers — the rare people who thrive on 4 to 6.5 hours of sleep — and the five genes researchers have linked to the trait.",
     publishDate: "2026-05-20",
     readTime: "8 min read",
     category: "Health & Longevity",
     featured: true,
     tags: ["Sleep", "Genetics", "Longevity", "Natural Short Sleepers", "SIK3", "DEC2"],
     excerpt: "Most adults need 7 to 9 hours of sleep. A tiny group of people — about 1 in 100 — feel great on far less. Here's what scientists have found in their genes, written for curious readers of any age."
   }
   ```

## Files to create

3. **[`app/blog/nss-natural-short-sleep/page.tsx`](../app/blog/nss-natural-short-sleep/page.tsx)** — `"use client"` (needs Chart.js refs). Format matches the canonical featured-post pattern established by [`app/blog/gitkraken-accidental-rebase/page.tsx`](../app/blog/gitkraken-accidental-rebase/page.tsx) and [`app/blog/ama-sports-broadcasting/page.tsx`](../app/blog/ama-sports-broadcasting/page.tsx): a self-contained `<article className="max-w-4xl mx-auto px-4 py-12">` with its own header (back-to-blog link, eyebrow category, h1 title, subtitle, date/read-time line). **Does NOT use `BlogPostWrapper`** — that component is only invoked by the dynamic `app/blog/[slug]/page.tsx` fallback route, which the current featured posts bypass. Two `<canvas>` blocks with `useRef<HTMLCanvasElement>` + `useEffect` Chart instantiation; destroy on unmount. APA inline citations `(Author, Year)` are `<a href="#bib-...">` links; bibliography section at the bottom has matching `id="bib-..."` anchors and links each entry's URL with `target="_blank" rel="noopener noreferrer"`. **No footer block in the post** — the site-wide `Footer.tsx` (mounted in `PublicLayout`) handles ecosystem + Rise Wellness on every page.

   Brand palette match (per [`app/blog/gitkraken-accidental-rebase/page.tsx`](../app/blog/gitkraken-accidental-rebase/page.tsx)): `text-blue-600` for accent links/eyebrow; `text-gray-900` for titles; `text-gray-700 leading-relaxed` for body. Citation `<a>` links can use `text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline`. Charts use the same purple/indigo accents the `-ai` version uses for color continuity between the two posts.

4. **[`app/blog/nss-natural-short-sleep/layout.tsx`](../app/blog/nss-natural-short-sleep/layout.tsx)** — copy of [`app/blog/nss-natural-short-sleep-ai/layout.tsx`](../app/blog/nss-natural-short-sleep-ai/layout.tsx) with the slug argument changed from `"-nss-natural-short-sleep-ai"` to `"nss-natural-short-sleep"`. Wires `getBlogMetadata` + `getBlogJsonLd` from [`lib/seo.ts`](../lib/seo.ts). This layout-level metadata approach is required because the page is a client component (can't `export const metadata` from a `"use client"` file). The `getBlogMetadata` helper looks up the entry in `lib/blogData.ts` by slug and produces the full `Metadata` object (title, description, OG, Twitter, canonical URL).

## Files NOT touched

- [`app/blog/nss-natural-short-sleep-ai/page.tsx`](../app/blog/nss-natural-short-sleep-ai/page.tsx) and its `layout.tsx` stay as-is — BAM asked for a new version, not a replacement.
- [`components/layout/PublicLayout.tsx`](../components/layout/PublicLayout.tsx) — already mounts `Footer` site-wide. No change needed.

---

## Post content outline (~1,200–1,800 words, 6th-grade reading level)

Each numbered section becomes a `<section>` inside the article. Inline citations use APA `(Author, Year)` linking to `#bib-<id>`.

1. **Quick intro (1 paragraph)** — what a natural short sleeper is, plain language.
2. **Two kinds of "less sleep"** — short sleepers vs. insomnia (one healthy, one a problem). (Cite [`Familial natural short sleep — Wikipedia`](https://en.wikipedia.org/wiki/Familial_natural_short_sleep) for the framing; back it with the primary He et al. 2009 + Shi et al. 2019 papers below.)
3. **How rare is it?** — ~1–3% of adults. (Cite He et al., 2009; UCSF press release as secondary.)
4. **Graph 1: Sleep hours compared** — horizontal bar chart, three bars: "Typical adult (CDC)" 8h, "Natural short sleeper (actigraphy, Chen et al., 2025)" 6.3h, "Some short sleepers self-report" 4h.
5. **Five genes scientists have found**, one short paragraph each:
   - **DEC2** (BHLHE41), 2009 — He et al., *Science*.
   - **ADRB1**, 2019 — Shi et al., *Neuron*.
   - **NPSR1**, 2019 — Xing et al., *Science Translational Medicine*.
   - **GRM1**, 2021 — Shi et al.
   - **SIK3-N783Y**, 2025 — Chen et al., *PNAS*.
6. **Graph 2: Timeline of gene discoveries** — Chart.js horizontal scatter/timeline 2009 → 2025 with one labeled point per gene. (Fall back to a styled flex/grid timeline if scatter labeling is fiddly at implementation time.)
7. **The newest study** — 70-year-old woman, ~6.3h actigraphy, mouse model confirming causation, what SIK3 kinase activity does to synaptic protein phosphorylation (Chen et al., 2025).
8. **What this could mean for the rest of us** — possible future medicines that mimic the mutation to make sleep more *efficient* (not necessarily shorter). (Chen et al., 2025; Funato et al., 2016 — original *Sleepy* SIK3 mouse, *Nature*.)
9. **A safety note** — most adults still need 7–9 hours; don't try to short-sleep yourself. (CDC; AASM consensus statement, Watson et al., 2015.)
10. **Bibliography** — `<section id="bibliography">` with linked APA entries. Anchor IDs: `#bib-chen2025`, `#bib-he2009`, `#bib-shi2019-adrb1`, `#bib-xing2019`, `#bib-shi2021-grm1`, `#bib-funato2016`, `#bib-cdc`, `#bib-aasm`.

### Graph implementation

Chart.js v4 (`"chart.js": "^4.5.0"` already in [`package.json`](../package.json)). Same `import { Chart, registerables } from 'chart.js'; Chart.register(...registerables)` pattern the `-ai` version uses. Each chart in its own `useEffect` with `useRef<HTMLCanvasElement>` and a cleanup that destroys the chart instance. Use bam-landing-page's purple/indigo accent palette to match the brand.

---

## Primary sources for bibliography

All verified via web search. At implementation time, run a quick `WebFetch` on each URL to confirm it still resolves; if any 404s, swap to PMC/PubMed canonical.

| Anchor ID | APA citation | URL |
|---|---|---|
| `bib-chen2025` | Chen, A., et al. (2025). The SIK3-N783Y mutation is associated with the human natural short sleep trait. *PNAS, 122*(19). | https://www.pnas.org/doi/10.1073/pnas.2500356122 (PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC12088394/) |
| `bib-he2009` | He, Y., et al. (2009). The transcriptional repressor DEC2 regulates sleep length in mammals. *Science, 325*(5942), 866–870. | https://www.science.org/doi/10.1126/science.1174443 |
| `bib-shi2019-adrb1` | Shi, G., et al. (2019). A rare mutation of β1-adrenergic receptor affects sleep/wake behaviors. *Neuron, 103*(6), 1044–1055. | https://pmc.ncbi.nlm.nih.gov/articles/PMC6763376/ |
| `bib-xing2019` | Xing, L., et al. (2019). Mutant neuropeptide S receptor reduces sleep duration with preserved memory consolidation. *Science Translational Medicine, 11*(514). | https://www.science.org/doi/10.1126/scitranslmed.aax2014 |
| `bib-shi2021-grm1` | Shi, G., et al. (2021). Mutations in metabotropic glutamate receptor 1 contribute to natural short sleep trait. *Current Biology*. | Confirm DOI/URL via PubMed at implementation time. |
| `bib-funato2016` | Funato, H., et al. (2016). Forward-genetics analysis of sleep in randomly mutagenized mice. *Nature, 539*, 378–383. | https://pubmed.ncbi.nlm.nih.gov/27074515/ |
| `bib-cdc` | Centers for Disease Control and Prevention. (2024). How much sleep do I need? | https://www.cdc.gov/sleep/about/index.html |
| `bib-aasm` | Watson, N. F., et al. (2015). Recommended amount of sleep for a healthy adult: AASM and Sleep Research Society joint consensus statement. *Sleep, 38*(6), 843–844. | https://aasm.org/recommended-amount-sleep-healthy-adult-aasm-srs/ |

---

## Branching + handoff

Per [`CLAUDE.md`](../CLAUDE.md) branch-hygiene rule:

1. Verify on `main`; branch `feat/blog-nss-natural-short-sleep-ecosystem-footer`.
2. Make the four file changes (1 modify + 1 modify + 2 create).
3. Run `npm run lint && npm run build`. Fix anything.
4. Run `npm run dev`. Verify:
   - **Every page** (`/`, `/blog`, `/projects`, `/partner`) — Rise Wellness callout renders above the existing footer grid, ecosystem column shows all 10 sibling-product links, `[YOUR APP NAME]` token is "Brand Anthony McDonald" in both the subtitle and the non-negotiable disclaimer.
   - **`/blog/nss-natural-short-sleep`** — header shows category eyebrow, h1 title, subtitle, date, read time. Both Chart.js graphs render. Inline `(Author, Year)` citations are clickable and scroll to bibliography. All bibliography URLs open in a new tab and resolve.
   - **`/blog`** — new post appears in Featured Stories grid.
   - **`/admin/*`** — footer correctly does NOT appear (admin routes bypass `PublicLayout`).
   - Mobile (< 768px) — ecosystem column collapses cleanly; Rise Wellness callout responsive.
5. View page source on any page — JSON-LD person schema unchanged; on the blog post page, the article-schema JSON-LD populated.
6. Stage explicitly (no `git add -A`): the four files. Commit, push to origin, stop. BAM reviews + merges via GitHub UI.

Single concern? Two concerns: site-wide footer change + new blog post. Both ship together because the post relies on the footer being site-wide. Per branch-hygiene rule, that means this branch ships them together and BAM does one merge. No bundle needed.

---

## Format-compatibility checklist

Explicit confirmation that the new post is a drop-in fit for the current blog system:

- **Routing:** lives at `app/blog/nss-natural-short-sleep/page.tsx` → Next.js App Router serves `/blog/nss-natural-short-sleep` directly. Same convention as `gitkraken-accidental-rebase`, `ama-sports-broadcasting`, `nss-natural-short-sleep-ai`, and the other featured posts.
- **Featured grid:** entry in `lib/blogData.ts` with `featured: true` → [`/blog/page.tsx`](../app/blog/page.tsx) filters `featuredPosts = allPosts.filter(p => p.featured)` and renders via [`FeaturedPost`](../components/blog/FeaturedPost.tsx), which links to `/blog/${post.slug}`. New post will land in the gradient card grid alongside Penn Relays, GitKraken, etc.
- **Metadata + SEO:** `layout.tsx` uses the same `getBlogMetadata(slug)` + `getBlogJsonLd(slug)` helpers as the other client-component blog posts (`nss-natural-short-sleep-ai`, `endocannabinoid-system-curriculum-infographic-sources`, `-routines-architecture-of-well-being`, `bowel-as-a-barometer`, `ama-sports-broadcasting`). Title, description, OG, canonical URL, Twitter card, and Article JSON-LD all auto-populate from the `blogData.ts` registry entry.
- **Category filter / non-featured grid:** if `featured` is ever toggled to `false`, the post auto-appears in the [`BlogCategoryFilter`](../components/blog/BlogCategoryFilter.tsx) section under its category (`Health & Longevity`). No additional wiring needed.
- **Site-wide chrome:** Navigation header, Rise Wellness callout, ecosystem footer, ConsoltoChat widget, ShareButton all come from [`PublicLayout`](../components/layout/PublicLayout.tsx). The post is wrapped automatically — no manual import needed in `page.tsx`.

## What this plan deliberately does NOT include

- **A reusable `WitusEcosystemFooter` component.** Now that the footer is site-wide via the existing `Footer.tsx`, extracting a second component is wasted abstraction. The single `Footer.tsx` is the canonical mount point on bam-landing-page.
- **`BlogPostWrapper` usage.** The dynamic `app/blog/[slug]/page.tsx` route uses it, but no current featured post does — the convention is self-contained `<article>` blocks. Matching that convention keeps the new post indistinguishable from its peers.
- **Touching `app/blog/[slug]/page.tsx`.** It tries to `require()` from a non-existent repo-root `/blog/` directory and is effectively dead code on the current routes. Leaving it alone — separate concern, separate branch if BAM wants it cleaned up.
- **Refactoring the `-ai` version.** It stays. Two posts on the same topic — one infographic-with-AI, one plain-language-with-citations — is intentional.
- **Backporting changes to other repos.** The ecosystem footer in other repos is each repo's own job; the recipe in `gemini/witus/public/brand/footer-recipe.md` is the canonical reference for them.
- **A user-task file.** No operator action outside the editor for this work. BAM merges via the standard GitHub UI flow.
