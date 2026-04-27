# bam-landing-page — agent instructions

Repo for `brandanthonymcdonald.com` — BAM's portfolio + class-lead landing pages (Corvids of Fishers, Eastern Cottontail, Elementary MBA 9-12, AMA sports broadcasting) + workout feedback form.

**Stack:** Next.js 14 App Router + MongoDB + NextAuth v4. Not Next 16 yet — use `middleware.ts` (current) and plan the switch to `proxy.ts` when the Next 16 upgrade happens.

---

**Read order before writing any code:**

1. [`./plans/ecosystem/README.md`](./plans/ecosystem/README.md) — ecosystem platform index + Redundancy Test
2. [`./plans/ecosystem/bam-landing-page.md`](./plans/ecosystem/bam-landing-page.md) — this product's one-job definition + integration points
3. [`./plans/00-descriptions.md`](./plans/00-descriptions.md) — non-negotiables, coding style, git workflow, verification
4. [`./plans/user-tasks/00-descriptions.md`](./plans/user-tasks/00-descriptions.md) — operator task queue; pointer to canonical witus queue for ecosystem tasks
5. Workflow descriptors: bugs · future · validate · reports (in `./plans/`)
6. The specific `./plans/NN-*.md` plan you are executing

**Hard rules (grep in [`./plans/00-descriptions.md`](./plans/00-descriptions.md)):**

- Mobile-first 360px, ARIA-compliant, keyboard-reachable, focus rings visible
- TypeScript strict. Server Components by default
- Next 14 today: `middleware.ts` for auth gating. When this repo upgrades to Next 16, rename to `proxy.ts`
- Secrets only via a validated env module (plan required — `lib/env.ts` does not exist yet). Never commit `.env*` except `.env.example`
- HMAC-signed webhooks for cross-repo traffic (5-min skew, constant-time compare)
- PII-safe DB writes through a try/catch wrapper (plan required — `lib/db-safe.ts` does not exist yet). No raw inserts on PII tables from route handlers
- Side-effect libs (email, SMS, external APIs) must degrade to dev-log fallback when env vars are missing — preview deploys must never send real outbound traffic
- `plans/` and `social-media/` are gitignored. Never commit `.env*` except `.env.example`
- Every plan ships on its own branch (`<type>/<NN>-<slug>`). **Never push to `main`** — BAM reviews and pushes
- **Cross-repo edits:** branch in the sibling, user-task in origin queue for BAM to merge + push

**If you are changing something the ecosystem docs call out as another platform's job (finance, flight logs, LMS, etc.): stop and ask.**
