import Link from "next/link";
import { getPageMetadata } from "@/lib/seo";

// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for the LangChain Academy course portfolio.
//
// This `COURSES` array is the ONE place course status, ship dates, and links
// live. Each per-course page (app/learn/<slug>/page.tsx) imports from here, so
// flipping a course from "🟡 Coming soon" to "🟢 Live", or correcting a ship
// date, propagates to BOTH the /learn index and that course's landing page
// from a single edit. Do not duplicate this data anywhere else.
// ---------------------------------------------------------------------------

export type CourseCard = {
  slug: string; // e.g. "project-multi-agent-rag"
  title: string;
  tier: "Project" | "Quickstart" | "Foundation";
  status: "🟢 Live" | "🟡 Coming soon";
  pitch: string; // one-line
  stack: string[];
  shipDate?: string; // 🟡 only, rendered as "Ships ~<date>"
  repoUrl: string; // canonical GitHub URL (publishes with the course)
  deployedUrl?: string; // 🟢 only, live demo
};

const GH = "https://github.com/dapperAuteur";

export const COURSES: CourseCard[] = [
  {
    slug: "project-multi-agent-rag",
    title: "Domain-Specialist Multi-Agent with Per-Agent RAG",
    tier: "Project",
    status: "🟢 Live",
    pitch:
      "Build a supervisor that routes each question to a domain specialist, and give every specialist its own RAG index. The architecture behind the CentenarianOS multi-domain coach.",
    stack: ["LangGraph", "LangSmith", "pgvector", "LangSmith Deployment", "Drizzle"],
    repoUrl: `${GH}/centenarian-coach-multiagent`,
    deployedUrl: "https://centenarianos.com",
  },
  {
    slug: "quickstart-durable-hitl",
    title: "Durable HITL with a Postgres Checkpointer",
    tier: "Quickstart",
    status: "🟡 Coming soon",
    pitch:
      "Your human-in-the-loop agent silently loses its state when the worker restarts. Here's the 10-line fix, a Postgres checkpointer that survives the crash.",
    stack: ["LangGraph", "Postgres", "LangSmith"],
    shipDate: "June 10, 2026",
    repoUrl: `${GH}/witus-triage-agent`,
  },
  {
    slug: "foundation-reflection-loops",
    title: "Reflection-Loop Reliability",
    tier: "Foundation",
    status: "🟡 Coming soon",
    pitch:
      "An agent's first answer is usually its worst. Reflection loops let it critique and revise its own output, and let you measure the reliability gain instead of hoping for one.",
    stack: ["LangGraph", "LangSmith", "LangSmith Deployment", "Python", "TypeScript"],
    shipDate: "late July 2026",
    repoUrl: `${GH}/wanderlearn-field-reporter`,
  },
];

export function getCourse(slug: string): CourseCard | undefined {
  return COURSES.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------------
// Shared presentational helpers (imported by per-course pages too)
// ---------------------------------------------------------------------------

/** Status pill driven by the `status` field, emoji + label, never invented. */
export function CourseStatusBadge({
  status,
  className = "",
}: {
  status: CourseCard["status"];
  className?: string;
}) {
  const isLive = status === "🟢 Live";
  const tone = isLive
    ? "bg-green-100 text-green-800"
    : "bg-amber-100 text-amber-800";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${tone} ${className}`}
    >
      {status}
    </span>
  );
}

/** Monospace chip used for "Tools used" / stack lists. */
export function ToolChip({ label }: { label: string }) {
  return (
    <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2.5 py-1 rounded">
      {label}
    </span>
  );
}

/** "The rest of the portfolio", links to the other two courses. */
export function SiblingCourses({ currentSlug }: { currentSlug: string }) {
  const siblings = COURSES.filter((c) => c.slug !== currentSlug);
  return (
    <section className="section-padding pt-0">
      <div className="container-max">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The rest of the portfolio
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {siblings.map((c) => (
              <Link
                key={c.slug}
                href={`/learn/${c.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {c.tier}
                  </span>
                  <CourseStatusBadge status={c.status} />
                </div>
                <p className="font-semibold text-gray-900">{c.title}</p>
                <span className="text-blue-600 text-sm font-medium">
                  Open course →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Maps each course to the running WitUS product it powers (ecosystem-fit §).
const ECOSYSTEM = [
  {
    slug: "project-multi-agent-rag",
    course: "Project, Multi-Agent RAG",
    product: "CentenarianOS",
    productUrl: "https://centenarianos.com",
    line: "The per-agent-RAG supervisor this course builds is Fit T. Cent, “Get Fit and Learn Tryin’”, the multi-domain coach inside CentenarianOS.",
  },
  {
    slug: "quickstart-durable-hitl",
    course: "Quickstart, Durable HITL",
    product: "WitUS Inbox",
    productUrl: "https://inbox.witus.online",
    line: "The Postgres-checkpointer pattern this course teaches is the durable human-in-the-loop behind the WitUS Inbox triage agent.",
  },
  {
    slug: "foundation-reflection-loops",
    course: "Foundation, Reflection Loops",
    product: "Wanderlearn",
    productUrl: "https://wanderlearn.witus.online",
    line: "The reflection loop this course measures is what produces and revises the field lessons inside Wanderlearn.",
  },
];

// ---------------------------------------------------------------------------
// Index card view, mirrors the /projects ProjectCardView card chrome.
// ---------------------------------------------------------------------------

function CourseCardView({ course }: { course: CourseCard }) {
  return (
    <article className="flex flex-col bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {course.tier}
        </span>
        <CourseStatusBadge status={course.status} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
      <p className="text-gray-700 mb-4 leading-relaxed">{course.pitch}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {course.stack.map((tool) => (
          <ToolChip key={tool} label={tool} />
        ))}
      </div>
      {course.shipDate && (
        <p className="text-sm text-amber-700 font-medium mb-4">
          Ships ~{course.shipDate}
        </p>
      )}
      <div className="mt-auto pt-2">
        <Link
          href={`/learn/${course.slug}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Open course →
        </Link>
      </div>
    </article>
  );
}

export const metadata = getPageMetadata({
  title: "Learn, Production Agent Engineering Courses",
  description:
    "Three courses on production agent engineering, Project, Quickstart, and Foundation tiers, each paired with a running WitUS product: CentenarianOS, WitUS Inbox, and Wanderlearn. Built on LangGraph and LangSmith.",
  path: "/learn",
});

export default function LearnIndexPage() {
  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white pt-32 pb-16">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Three courses on production agent engineering, paired with a real
              ecosystem of running agents.
            </h1>
            <p className="text-xl text-blue-100 mb-2">
              A Project, a Quickstart, and a Foundation course, each one teaches
              a pattern that already runs in production.
            </p>
            <p className="text-lg text-blue-200">
              Build the system, not the toy. Every course ships a forkable repo
              and points at the live product it powers.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1, Courses */}
      <section id="courses" className="section-padding scroll-mt-20">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                The courses
              </h2>
              <p className="text-gray-600 text-lg">
                One live now, two shipping soon. Status reflects course reality;
                this page is the source of truth.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {COURSES.map((course) => (
                <CourseCardView key={course.slug} course={course} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2, Ecosystem fit */}
      <section id="ecosystem-fit" className="section-padding pt-0">
        <div className="container-max">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                How these courses fit the WitUS ecosystem
              </h2>
              <p className="text-gray-600 text-lg">
                These aren&apos;t demos built for a syllabus. Each course extracts
                the pattern from a product that&apos;s already serving real users,
                so the &quot;production&quot; in &quot;production agent engineering&quot;
                is literal.
              </p>
            </div>

            {/* Course → Product diagram (accessible: a list of mappings, the
                connector is decorative). Stacks on mobile, paired on md+. */}
            <ul className="space-y-4" aria-label="Each course and the product it powers">
              {ECOSYSTEM.map((row) => (
                <li
                  key={row.slug}
                  className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Course node */}
                    <Link
                      href={`/learn/${row.slug}`}
                      className="flex-1 block rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 font-semibold hover:bg-blue-100 transition-colors"
                    >
                      {row.course}
                    </Link>
                    {/* Connector (decorative) */}
                    <span
                      aria-hidden="true"
                      className="self-center text-2xl text-gray-400 md:rotate-0 rotate-90"
                    >
                      →
                    </span>
                    {/* Product node */}
                    <a
                      href={row.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 block rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-purple-900 font-semibold hover:bg-purple-100 transition-colors"
                    >
                      {row.product} ↗
                    </a>
                  </div>
                  <p className="text-gray-700 mt-3 leading-relaxed">{row.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="max-w-4xl mx-auto bg-white border-2 border-blue-200 rounded-2xl p-8 md:p-10 shadow-md text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Want to talk about agent engineering, or hire for it?
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              The courses are free and the repos are forkable. If you&apos;re
              hiring for developer education or agent work, or you just want to
              compare notes, reach out.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/hire"
                className="inline-block btn-primary bg-blue-600 text-white hover:bg-blue-700 text-lg"
              >
                Get in touch →
              </Link>
              <a
                href={GH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block btn-secondary text-lg"
              >
                Source on GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
