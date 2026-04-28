import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects | Brand Anthony McDonald",
  description:
    "The WitUS ecosystem — eight interlinked products under one philosophy. CentenarianOS, Work.WitUS, FlashLearnAI, Wanderlearn, Fly.WitUS, WitUS Inbox, plus brandanthonymcdonald.com.",
  openGraph: {
    title: "Projects | Brand Anthony McDonald",
    description:
      "Full-stack ecosystem of shipped products — CentenarianOS, Work.WitUS, FlashLearnAI, Wanderlearn, Fly.WitUS, WitUS Inbox.",
    url: "https://brandanthonymcdonald.com/projects",
    type: "website",
  },
};

interface ProjectCard {
  name: string;
  url?: string;
  status: "🟢" | "🟡" | "🟠";
  tagline: string;
  stack: string;
  detail: string;
}

const tierAProjects: ProjectCard[] = [
  {
    name: "witus.online",
    url: "https://witus.online",
    status: "🟢",
    tagline: "Parent brand site for the WitUS ecosystem — philosophy-first landing page connecting CentenarianOS and Work.WitUS under \"Live Long. Work Free.\"",
    stack: "Next.js 16 · Tailwind v4 · Vercel · fully static",
    detail: "Solo build. Required vercel.json for framework auto-detection — a real operational detail worth noting.",
  },
  {
    name: "CentenarianOS",
    url: "https://centenarianos.com",
    status: "🟢",
    tagline: "Multi-decade personal operating system: planner, nutrition, focus engine, health metrics, workouts, finance, travel, equipment, correlations, data hub, blog, recipes, LMS academy, and AI coach in a single modular monolith.",
    stack: "Next.js 14 · Supabase (RLS, real-time) · Stripe (subs + Connect) · Gemini · Cloudinary · IndexedDB",
    detail: "84+ DB migrations across 14 modules. Offline-first sync with conflict resolution.",
  },
  {
    name: "Work.WitUS",
    url: "https://work.witus.online",
    status: "🟢",
    tagline: "Contractor management platform: jobs, time entries, AI-extracted invoices, document scanner for pay stubs and receipts, multi-day non-consecutive scheduling, mileage/expenses, push notifications, public job board, and a course academy.",
    stack: "Next.js 15 · Supabase (shared with CentenarianOS) · Stripe · Gemini 2.5 Flash · PWA",
    detail: "Shares a Supabase database with CentenarianOS — coordinating migrations across two products is its own discipline.",
  },
  {
    name: "FlashLearnAI",
    url: "https://flashlearnai.witus.online",
    status: "🟢",
    tagline: "AI flashcard platform: generate sets from topics, PDFs, YouTube videos, audio, or images; SM-2 spaced repetition; three study modes; Versus-mode ELO ratings; teams, classrooms, public API, white-label app.",
    stack: "Next.js 15 · React 19 · MongoDB · NextAuth · PowerSync · Stripe metered billing",
    detail: "Public REST API: 30 endpoints across 26 paths under /api/v1/, with an OpenAPI spec served at /api/v1/openapi. White-label sold separately.",
  },
  {
    name: "Wanderlearn",
    url: "https://wanderlearn.witus.online",
    status: "🟢",
    tagline: "Immersive 360°/drone place-based learning; every course anchored to a real location captured first-hand. Cross-linked into Centenarian Academy and Fly.WitUS via a shared Cloudinary tenant.",
    stack: "Next.js · Cloudinary · Supabase",
    detail: "Flagship course: MUCHO Museo del Chocolate, Mexico City.",
  },
  {
    name: "Fly.WitUS",
    url: "https://fly.witus.online",
    status: "🟢",
    tagline: "UAS pre-flight checklist and mission log for FAA Part 107 compliance: 8-section checklist (50+ items), NOAA weather auto-fetch, battery/flight logging, FAA-compliant PDF export.",
    stack: "Next.js · IndexedDB · NOAA API · offline-first PWA",
    detail: "Real Part 107 use case driving the schema.",
  },
  {
    name: "WitUS Inbox",
    status: "🟢",
    tagline: "Cross-product submission triage and reply surface. Ingests signed webhooks from every WitUS product, stores canonical records, lets me read and reply from one dashboard.",
    stack: "Next.js 16 · Drizzle · Neon Postgres · NextAuth · Mailgun · Mobile Text Alerts SMS",
    detail: "The connective tissue for the ecosystem. Internal-facing — no public URL.",
  },
  {
    name: "brandanthonymcdonald.com",
    url: "https://brandanthonymcdonald.com",
    status: "🟢",
    tagline: "Personal portfolio + blog + client portal with per-project custom URLs and JWT-authenticated sessions; admin dashboard manages content, projects, gallery, contacts, and analytics.",
    stack: "Next.js 14 · MongoDB Atlas · NextAuth · Cloudinary · reCAPTCHA v3 · Gemini",
    detail: "70+ articles. Active client portal in production.",
  },
];

const tierBProjects: ProjectCard[] = [
  {
    name: "Tour Manager OS",
    status: "🟠",
    tagline: "Touring musicians' platform replacing spreadsheets and printed itineraries: digital advance sheets, auto-generated daily itineraries, real-time per-show P&L, merch management with Stripe checkout, fan engagement, family collaboration, per-tour document hub.",
    stack: "Next.js · Supabase · Stripe · PWA · WCAG 2.1 AA",
    detail: "In-progress build.",
  },
  {
    name: "Centenarian Athlete Academy (CAA)",
    status: "🟠",
    tagline: "High-performance LMS for NASM CPT/CES/CNC certification candidates; Choose-Your-Own-Adventure video navigation, Gemini transcript embeddings + pgvector similarity for recommendations, hierarchical content gating with Cloudinary signed URLs, $100 one-time Stripe purchase.",
    stack: "Next.js 14 · Supabase pgvector · Cloudinary · Gemini · Stripe",
    detail: "Gated study locker, visual journey trail.",
  },
];

function ProjectCardView({ project }: { project: ProjectCard }) {
  const heading = (
    <span className="flex items-baseline gap-2 flex-wrap">
      <span className="text-xl font-bold text-gray-900">{project.name}</span>
      <span className="text-sm">{project.status}</span>
    </span>
  );
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            {heading}
          </a>
        ) : (
          heading
        )}
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">{project.tagline}</p>
      <p className="text-xs font-mono text-gray-500 bg-gray-50 px-3 py-2 rounded mb-3 break-words">
        {project.stack}
      </p>
      <p className="text-sm text-gray-600 italic">{project.detail}</p>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <main className="bg-gray-50">
      {/* Page header */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white pt-32 pb-16">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
            <p className="text-xl text-blue-100 mb-2">
              The WitUS ecosystem — eight interlinked products under one philosophy.
            </p>
            <p className="text-lg text-blue-200">
              I ship full-stack products, write about the work, teach it, and operate the platforms.
              The same person who designs the architecture answers the support tickets.
            </p>
          </div>
        </div>
      </section>

      {/* Hire-me anchored section (target for the e-hire short link) */}
      <section id="hire-me" className="section-padding scroll-mt-20">
        <div className="container-max">
          <div className="max-w-4xl mx-auto bg-white border-2 border-blue-200 rounded-2xl p-8 md:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Hiring
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Looking to hire?
              </h2>
            </div>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              I&apos;m targeting <strong>Developer Relations, Tech Support Engineer,</strong> and
              full-stack <strong>AI-product</strong> roles. The projects below are the evidence —
              shipped products with public URLs, public APIs, real users, and real production
              incidents I&apos;ve recovered from.
            </p>
            <p className="text-gray-700 mb-6">
              Send a quick brief: role, team, stack, timeline, comp range if you have it.
              I respond personally within 24 hours during the work week.
            </p>
            <Link
              href="/hire"
              className="inline-block btn-primary bg-blue-600 text-white hover:bg-blue-700 text-lg"
            >
              Send a hiring brief →
            </Link>
          </div>
        </div>
      </section>

      {/* Partner-with-me anchored section (target for the e-partner short link) */}
      <section id="partner-with-me" className="section-padding pt-0 scroll-mt-20">
        <div className="container-max">
          <div className="max-w-4xl mx-auto bg-white border-2 border-purple-200 rounded-2xl p-8 md:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Partnerships
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Partner with me
              </h2>
            </div>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              I&apos;m open to <strong>integrations, co-marketing, grants,</strong> and{" "}
              <strong>joint ventures</strong> across the ecosystem — especially anything that
              makes one of the products below more useful, or expands its audience.
            </p>
            <p className="text-gray-700 mb-6">
              Tell me what you&apos;re imagining and which product(s) it touches. If it&apos;s a
              fit, you&apos;ll hear back fast.
            </p>
            <Link
              href="/partner"
              className="inline-block btn-primary bg-purple-600 text-white hover:bg-purple-700 text-lg"
            >
              Start a partnership conversation →
            </Link>
          </div>
        </div>
      </section>

      {/* Tier A — shipped */}
      <section id="live-shipped" className="section-padding pt-0 scroll-mt-20">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Live &amp; shipped
              </h2>
              <p className="text-gray-600 text-lg">
                Tier A — products with public URLs and active users. Solo builder/operator on
                each.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {tierAProjects.map((project) => (
                <ProjectCardView key={project.name} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tier B — in progress */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Live + actively in-progress
              </h2>
              <p className="text-gray-600 text-lg">
                Tier B — deployed and being iterated on toward broader launch.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {tierBProjects.map((project) => (
                <ProjectCardView key={project.name} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How the ecosystem connects */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The ecosystem isn&apos;t accidental
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              <a
                href="https://witus.online"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                witus.online
              </a>{" "}
              hands users off to{" "}
              <a
                href="https://centenarianos.com"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                centenarianos.com
              </a>{" "}
              and{" "}
              <a
                href="https://work.witus.online"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                work.witus.online
              </a>
              . FlashLearnAI, Wanderlearn, and Fly.WitUS plug into both via shared Supabase,
              shared Cloudinary, and the WitUS Inbox webhook bus. I think in platforms, not
              features — and I have receipts.
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`B4C LLC / AwesomeWebStore.com   ← legal entity
└── WitUS.online                ← parent brand
    ├── CentenarianOS.com       ← multi-decade personal OS
    ├── Work.WitUS.Online       ← contractor management
    ├── FlashLearnAI            ← AI flashcards + public API
    ├── Wanderlearn             ← 360°/drone place-based learning
    ├── Fly.WitUS               ← UAS pre-flight + flight log
    └── WitUS Inbox             ← cross-product webhook triage`}
            </pre>
          </div>
        </div>
      </section>

      {/* Closing CTAs */}
      <section className="section-padding pt-0 pb-24">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Where to next?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/hire"
                className="btn-primary bg-blue-600 text-white hover:bg-blue-700"
              >
                Hire me
              </Link>
              <Link
                href="/partner"
                className="btn-primary bg-purple-600 text-white hover:bg-purple-700"
              >
                Partner with me
              </Link>
              <Link
                href="/blog"
                className="btn-secondary border-2 border-gray-300 text-gray-700 hover:border-gray-500"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
