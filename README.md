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

- **Landing page** — Hero, services, about, portfolio, contact form with reCAPTCHA v3
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

### Environment Variables

Copy **[`.env.example`](./.env.example)** to `.env.local` and fill it in — that file is the canonical, commented list. The groups are:

- **Database** — `MONGODB_URI` (plus legacy aliases `MONGODB_CONNECTION_STRING` / `MONGO_URI` / `DATABASE_URL`, kept in sync)
- **Auth** — `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `JWT_SECRET`
- **Admin** — `ADMIN_EMAIL`, `ADMIN_API_KEY`
- **reCAPTCHA v3** — `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`
- **Email (SMTP / Mailgun)** — `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- **Cloudinary** — `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **WitUS Inbox** — `INBOX_INGEST_URL`, `INBOX_INGEST_SECRET`, `INBOX_SOURCE_SLUG`
- **WitUS Outbox** — `OUTBOX_INGEST_URL`, `OUTBOX_INGEST_SECRET`, `OUTBOX_SOURCE_SLUG`, `OUTBOX_TRIGGER_ENABLED`, `PRODUCT_OWNER_USER_ID`
- **AI** — `GEMINI_API_KEY`

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

## Docs

See the [`/docs`](./docs/) directory for site-management guides:

- [MANAGE_BLOG.md](./docs/MANAGE_BLOG.md) — Authoring posts in the MDX CMS admin
- [MANAGE_SITE.md](./docs/MANAGE_SITE.md) — Adding experiences, projects, and skills
- [MANAGE_SHARE.md](./docs/MANAGE_SHARE.md) — Social sharing features

## Privacy

See [PRIVACY.md](./PRIVACY.md) for the privacy policy covering data collection and handling on this platform.
