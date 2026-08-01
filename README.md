# BAM — Brand Anthony McDonald

Personal brand platform and portfolio for Brand Anthony McDonald: developer advocate, voiceover artist, business consultant, and content creator. Lives at **[brandanthonymcdonald.com](https://brandanthonymcdonald.com)** and is part of the WitUS ecosystem.

## About

A full-stack Next.js App Router application that combines a public portfolio + blog with a private admin dashboard, a client portal, and a photo-delivery system.

**What it does:**
- Showcases professional services: developer advocacy, voiceover, technical education, brand consulting, and content creation
- Hosts 70+ blog articles on a unified **MDX CMS** (rich, interactive posts authored from the admin and rendered from MongoDB), with RSS + JSON feeds
- Provides a client portal for project-based access with per-project custom URLs
- Runs a **photo system**: a central library, private **client galleries with per-photo approvals**, and public **marketing galleries**
- Routes client + publishing activity through the **WitUS Inbox** (submissions/comments/approvals) and **WitUS Outbox** (coming-soon social drafts on publish)
- Features an admin dashboard for managing content, photos, galleries, projects, contacts, and analytics

## Features

- **Landing page** — Hero, services, about, portfolio, contact form with reCAPTCHA v3 and rate limiting
- **Blog (MDX CMS)** — 70+ posts in a unified `blog_posts` collection; authored in the admin MDX editor; rendered via `@mdx-js/mdx` with a closed component registry (`<Chart>`, `<Carousel>`, `<CodeBlock>`, `<YouTubeEmbed>`, …); ISR-cached. See [docs/MANAGE_BLOG.md](./docs/MANAGE_BLOG.md).
- **Feeds** — `/feed.xml` (RSS 2.0) and `/feed.json` (JSON Feed), auto-updating from the same data layer
- **Photo library** — upload once at `/admin/photos`, reuse across galleries, blog, and portfolio (Cloudinary-backed)
- **Galleries** — private **client** galleries (access code, downloads, like/comment, **per-photo approve/reject**) and public **marketing** galleries at `/galleries`; admin can **send the gallery link to the client by email** and review approvals at `/admin/approvals`
- **Client portal** — project-based access at `/portal/[projectId]` with JWT-authenticated sessions
- **Admin dashboard** — manage blog posts, photos, galleries, projects, contacts, education submissions, and workout feedback
- **Ecosystem integration** — signed-webhook dispatch to the WitUS Inbox (client/contact activity) and Outbox (social drafts)
- **SEO + a11y** — per-page metadata, Article JSON-LD, robots, sitemap, skip-link, single-`<main>` landmarks
- **Graceful errors** — branded 404 (`not-found`) and 500 (`error` / `global-error`) pages that route users back into the app
- **Analytics** — Vercel Analytics + per-project engagement tracking
- **Error monitoring**: server, edge, and browser crashes report to Better Stack through the Sentry SDK, with a scrubber (`lib/sentry-scrub.ts`) that strips credentials and visitor PII before anything leaves the process. Inert until a DSN is set. See [Error monitoring](#error-monitoring).
- **Health check**: `/api/health` pings MongoDB on every request and is never cached, so an uptime monitor can tell a live app apart from a cached homepage. See [Health check](#health-check).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS, Framer Motion |
| Database | MongoDB Atlas (official `mongodb` driver) |
| Blog rendering | `@mdx-js/mdx` (`evaluate` + `react/jsx-runtime`) |
| Auth | NextAuth v4 + JWT |
| Storage / media | Cloudinary |
| Email | Nodemailer over SMTP (Mailgun in production) |
| AI | Google Gemini API |
| Ecosystem | WitUS Inbox + Outbox (HMAC-signed webhooks) |
| Analytics | Vercel Analytics |
| Error monitoring | Better Stack, via the Sentry SDK (`@sentry/nextjs`) |
| Tests | Vitest |
| UI | Radix UI, Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Cloudinary account
- Google reCAPTCHA v3 keys
- An SMTP provider (Mailgun in production) for outbound email
- Google Gemini API key

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Tests:

```bash
npm test        # one pass
npm run test:watch
```

### Environment Variables

Copy **[`.env.example`](./.env.example)** to `.env.local` and fill it in — that file is the canonical, commented list. The groups are:

- **Database** — `MONGODB_URI` (plus legacy aliases `MONGODB_CONNECTION_STRING` / `MONGO_URI` / `DATABASE_URL`, kept in sync)
- **Auth** — `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `JWT_SECRET`
- **Admin** — `ADMIN_EMAIL`, `ADMIN_API_KEY`
- **reCAPTCHA v3** — `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`. Required: every public form (contact, hire, partner, intake, education, guest speaker, workout feedback) verifies a token server-side and rejects submissions without one.
- **Email (SMTP / Mailgun)** — `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- **Cloudinary** — `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **WitUS Inbox** — `INBOX_INGEST_URL`, `INBOX_INGEST_SECRET`, `INBOX_SOURCE_SLUG`
- **WitUS Outbox** — `OUTBOX_INGEST_URL`, `OUTBOX_INGEST_SECRET`, `OUTBOX_SOURCE_SLUG`, `OUTBOX_TRIGGER_ENABLED`, `PRODUCT_OWNER_USER_ID`
- **AI** — `GEMINI_API_KEY`
- **Error monitoring (optional)**: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, and optionally `SENTRY_ENVIRONMENT` / `NEXT_PUBLIC_SENTRY_ENVIRONMENT` / `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN`

## Error monitoring

Crash reporting goes to **Better Stack**, which ingests over the Sentry protocol, so the client is the
standard `@sentry/nextjs` SDK. Wiring:

| File | Runtime |
|---|---|
| `instrumentation.ts` | loads the server/edge config, plus `onRequestError` for App Router request failures |
| `sentry.server.config.ts` | Node runtime (route handlers, RSC) |
| `sentry.edge.config.ts` | edge runtime (`middleware.ts`, the admin guard) |
| `instrumentation-client.ts` | browser, plus `onRouterTransitionStart` |
| `app/global-error.tsx` | root-layout crashes, via `Sentry.captureException` |
| `lib/sentry-scrub.ts` | the `beforeSend` scrub applied to all four runtimes |

**It is inert until a DSN is set.** Every init is guarded on `SENTRY_DSN` (server/edge) or
`NEXT_PUBLIC_SENTRY_DSN` (browser); with neither set the SDK never initializes and the site behaves
exactly as it did before. Tracing and session replay are pinned to `0`: errors only, no performance
spend, and no recording of a visitor's session on a site that has client galleries and a client portal.

**What is scrubbed.** A crash report is a copy of whatever the process was holding when it broke, so
`lib/sentry-scrub.ts` removes it before send: inline URI credentials (the Mongo connection string
carries its password in the URL), secret query params in both `request.url` and the separate
`request.query_string`, cookie and `Authorization` headers, forwarded-IP headers, JWTs, `Bearer`
credentials, env-var-shaped labelled secrets (`NEXTAUTH_SECRET=...`), email addresses, and any
secret-named key found anywhere in `extra`, `tags`, `contexts`, `breadcrumbs`, or a form body. It is
deliberately key-aware and matches whole name segments, so `authorName`, `keyboard`, `design`,
`state`, and `error.code` all survive: an unreadable report is not a safe report, it is just useless.
`contexts.trace` is exempt because Sentry needs it to stitch an event together.

`npm test` covers both directions (secret removed, context kept). If you change the scrubber, run it.

Source maps upload only when `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` are all set;
without them the build skips the upload and you get minified stack traces, not a failed build.

## Health check

**Point uptime monitors at `/api/health`, not at `/`.** The homepage can answer `200` straight out of
the CDN cache while MongoDB is unreachable, so a monitor on `/` can stay green through an outage that
breaks every page that reads data. `/api/health` cannot: it runs a real `ping` against MongoDB on
every request and sets `Cache-Control: no-store` (plus `force-dynamic` and `revalidate = 0`).

| | |
|---|---|
| Route | `GET /api/health` (also answers `HEAD` with the same status and no body) |
| Auth | None. Public, so a monitor needs no credentials. |
| Healthy | `200` · `{"ok":true,"checks":{"db":"ok"}}` |
| Unhealthy | `503` · `{"ok":false,"error":"database_unreachable"}` |
| Timeout | 4s. A database that has not answered by then counts as unreachable and returns `503`. |

**What it checks: the database, and nothing else.** No Cloudinary, Gemini, SMTP, or WitUS
Inbox/Outbox call happens here. Those are real dependencies, but a vendor outage must not turn the
uptime monitor red while the site is still serving every page it owns.

**What it tells an attacker: one bit.** The response carries no version, no env values, no counts,
and no portal or client-gallery data. The failure body is a fixed literal and the handler's `catch`
has no binding at all, because a Mongo error quotes the connection string and that string carries its
password inline. For the same reason the failure log line is a bare constant with no error object
interpolated: passing the error to `console.error` would only move the leak to the log sink. The
tradeoff is real and deliberate: when this returns `503` you learn *that* the database is unreachable,
never *why*, so diagnose the cause from Better Stack crash reports or the Mongo Atlas console.

`npm test` covers both directions, including that a credential-bearing failure reaches neither the
response nor the logs. If you change the handler, run it.

The NextAuth middleware does not touch this route: its matcher is `/admin/:path*` and
`/api/admin/:path*` only.

## Key Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/experience` | Work experience timeline |
| `/projects` | WitUS ecosystem projects |
| `/blog` · `/blog/[...slug]` | Blog listing · post (MDX/CMS) |
| `/feed.xml` · `/feed.json` | RSS · JSON feeds |
| `/photography` | Public photography showcase |
| `/galleries` | Public marketing galleries |
| `/client-gallery/[galleryId]` | Client gallery viewer (access-code gated) |
| `/portal/[projectId]` | Client project portal |
| `/intake` · `/hire` · `/partner` | Client intake forms |
| `/admin/*` | Admin dashboard (protected): `blog/posts`, `photos`, `galleries`, `approvals`, `projects`, `contact`, `logs` |
| `/login` | Login page |
| `/api/health` | Uptime probe: pings MongoDB, never cached. See [Health check](#health-check). |

## Docs

See the [`/docs`](./docs/) directory for site-management guides:

- [MANAGE_BLOG.md](./docs/MANAGE_BLOG.md) — Authoring posts in the MDX CMS admin
- [MANAGE_SITE.md](./docs/MANAGE_SITE.md) — Adding experiences, projects, and skills
- [MANAGE_SHARE.md](./docs/MANAGE_SHARE.md) — Social sharing features

## Privacy

See [PRIVACY.md](./PRIVACY.md) for the privacy policy covering data collection and handling on this platform.
