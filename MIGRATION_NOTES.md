# MIGRATION_NOTES — `/learn` LangChain Academy landing pages

**Branches:** `feat/learn-section` (pages) + `fix/nav-overflow-nesting` (nav),
bundled as `bundle/learn-section-nav-2026-06-03` for one merge.
**Date:** 2026-06-03 · **Stack:** Next.js 16.2.7 App Router, TS, Tailwind 3.4.
No new dependencies (`package.json` unchanged).

> The PRD said "Next 14"; the repo is actually Next 16 (App Router — identical
> patterns). Metadata uses the existing `getPageMetadata()` helper rather than
> hand-rolling the Metadata API.

---

## Files changed (paths only)

**`feat/learn-section`** (pages):
- `app/learn/page.tsx` — `COURSES[]` single source of truth + index + ecosystem-fit diagram
- `app/learn/project-multi-agent-rag/page.tsx`
- `app/learn/quickstart-durable-hitl/page.tsx`
- `app/learn/foundation-reflection-loops/page.tsx`

**`fix/nav-overflow-nesting`** (nav — separate concern, addresses live overflow bug):
- `components/ui/Navigation.tsx`
- `public/flywitus-platypus-logo.png`
- `public/flywitus-platypus-logo.ico`

**Docs:**
- `MIGRATION_NOTES.md`

(Local-only, gitignored `plans/`: plan `2026-06-03-learn-section-langchain-landings.md`;
operator tasks `36`–`39` + `00-descriptions.md` index.)

---

## Rubric self-scoring (§3 of the PRD)

| # | Criterion | Score | Evidence |
|---|---|---|---|
| L1 | Routes render, no 404s, links resolve, ext = new-tab + noopener | **4/5** | All 4 routes `200`; every external link curl-verified `200` (3 product sites, 3 course repos, arXiv ×6, smith.langchain.com); every `target="_blank"` paired with `rel="noopener noreferrer"` (counts equal per page). Full content shape present **except** the Project intro video — a deliberate, PRD-sanctioned placeholder pending the Cloudinary URL (task #36). → 5 when the video lands. |
| L2 | Status badges via single source of truth | **5/5** | One `COURSES[]` array at the top of `app/learn/page.tsx`; each per-course page imports `getCourse(slug)`. A 🟡→🟢 flip or ship-date edit propagates to the index **and** the course page from one edit. Badges accurate: Project 🟢 Live, Quickstart + Foundation 🟡 with ship dates. |
| L3 | Reuses existing conventions | **5/5** | Reuses `getPageMetadata()` (canonical/OG), the `/projects` card chrome (`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md`), the gradient hero, and `.section-padding`/`.container-max`/`.btn-primary`. `tsc` clean; no new deps. |
| L4 | Mobile-responsive + accessible | **4/5** | Lighthouse (below): **desktop ≥90 on all four pages, all categories.** Mobile ≥90 on `/learn` + Foundation; the two course-page mobile dips are the **global** Consolto (563 KiB) + GTM (267 KiB) scripts under 4× CPU throttle (shell-wide, also on `/projects`), not page code. a11y: **0 page-level violations**; the single `color-contrast` violation is the pre-existing dark **Footer** (`text-gray-500` on `#151c31`). → 5 on prod-mobile confirm (task #39). |
| L5 | Ecosystem-fit substantive | **5/5** | The `/learn` ecosystem section names **CentenarianOS / WitUS Inbox / Wanderlearn**, maps each course→product with the live product URL and a "teaches the pattern that powers this product" line, and names the **Fit T. Cent** coach. Accessible course→product diagram (semantic `<ul>` of mappings; connector is `aria-hidden`). |
| L6 | Tested before publish | **5/5** | Built locally (build green, all 4 routes static `○`). Tested on the bundle: route status (4×`200`), link/noopener audit, external-link resolution, Lighthouse desktop+mobile. Walkthrough recorded below. |

**Every criterion ≥ 4 → meets the "Exceeding" bar.** The two 4/5s each have a
documented, operator-task path to 5 (video #36, prod-mobile #39).

---

## Lighthouse (bundle, `npm run start`, localhost)

| Page | Desktop (P/A/B/S) | Mobile (P/A/B/S) |
|---|---|---|
| `/learn` | 99 / 96 / 93 / 100 | 92 / 96 / 93 / 100 |
| `/learn/project-multi-agent-rag` | 100 / 93 / 93 / 100 | 73 / 93 / 93 / 100 |
| `/learn/quickstart-durable-hitl` | 100 / 96 / 93 / 100 | 77 / 96 / 93 / 100 |
| `/learn/foundation-reflection-loops` | 99 / 93 / 93 / 100 | 92 / 93 / 93 / 100 |

**Reading the numbers honestly:**
- **Desktop: all ≥90, every category.** A 77→99 perf jump came from fixing the
  logo's intrinsic dims (`width=1184`→`55`) so `next/image` stops serving a
  1200px asset into a 40px slot (`uses-responsive-images` now passes).
- **Mobile perf dips (project 73, quickstart 77)** are dominated by **global,
  shell-wide third-party JS** — Consolto chat widget (563 KiB) + Google Tag
  Manager (267 KiB) — blocking the main thread (TBT ~810 ms) under 4× CPU
  throttle. The `/learn` page code is static and light. The same drag is on
  `/projects`. Localhost simulate is pessimistic vs. the Vercel CDN; **task #39**
  re-measures on production, and the lever (if still needed) is deferring those
  global scripts in the shared layout — a separate site-wide perf concern.
- **B = 93 everywhere** is a global `errors-in-console` deduction: `next-auth`
  `CLIENT_FETCH_ERROR` (no auth env locally) + a Consolto cookie issue. Not
  from `/learn`.

## axe-core a11y

`@axe-core/cli` was blocked by a ChromeDriver 149 vs. installed Chrome 148
mismatch, so a11y was measured via **Lighthouse's Accessibility category (axe-core
under the hood)**. **Page-level violations on the four `/learn` routes: 0.** The
one site-wide `color-contrast` violation is the shared dark **Footer**
(`#6b7280` on `#151c31`, ratio 3.49) — pre-existing, present on every route,
not introduced by this branch. (Optional follow-up: bump the footer text to
`gray-400`/`gray-300` as a global a11y fix.)

---

## Test-reader walkthrough

- `/learn` → three course cards render with correct tier + status badges →
  "Open course →" navigates to each landing → each landing's "The rest of the
  portfolio" links back to its two siblings. No dead internal links.
- Ecosystem-fit: each course node links to its landing; each product node opens
  centenarianos.com / inbox.witus.online / wanderlearn.witus.online in a new tab.
- External links (course repos, arXiv reading lists, LangSmith, GitHub org) all
  resolve `200` and open in a new tab with `rel="noopener noreferrer"`.
- Project landing shows the **Fit T. Cent** tagline by the intro-video figure
  (placeholder) and the live-coach link.
- Nav: below 1280px the bar collapses into the hamburger with **no horizontal
  scroll**, logged in **and** out (the reported authenticated-overflow bug).
  Work ▾ / Learn ▾ / Company ▾ open on hover + keyboard focus; the hamburger now
  exposes the full admin list; the signed-in name truncates; the logo image
  renders.

---

## Blocked on operator tasks

- **#36** — upload the Project intro video to Cloudinary; drop the URL into
  `INTRO_VIDEO_URL` (lifts L1 → 5).
- **#37** — review + merge `bundle/learn-section-nav-2026-06-03` → main, redeploy.
- **#38** — sign off on the cover-letter copy citing `/learn`.
- **#39** — confirm `/learn` mobile Lighthouse on the production deploy
  (lifts L4 → 5; the dips are global third-party scripts, not `/learn`).
