import Link from "next/link";
import { getPageMetadata } from "@/lib/seo";
import {
  getCourse,
  CourseStatusBadge,
  ToolChip,
  SiblingCourses,
} from "../page";

const SLUG = "foundation-reflection-loops";
const course = getCourse(SLUG)!;

export const metadata = getPageMetadata({
  title: `${course.title} — Foundation Course`,
  description: course.pitch,
  path: `/learn/${SLUG}`,
});

const MODULES = [
  {
    n: 1,
    title: "Why the first answer is the worst",
    body: "Where single-pass generation fails, and why reliability — not capability — is usually the gap.",
  },
  {
    n: 2,
    title: "The reflection loop",
    body: "Generate, critique, revise: the core loop, built in LangGraph as an explicit cycle you can inspect.",
  },
  {
    n: 3,
    title: "Stopping criteria",
    body: "When to stop reflecting — convergence, budgets, and guards against loops that revise forever.",
  },
  {
    n: 4,
    title: "Measuring reliability",
    body: "Turn 'it feels better' into a number with LangSmith evals — datasets, scorers, and before/after deltas.",
  },
  {
    n: 5,
    title: "Cost vs. reliability",
    body: "Every reflection pass costs tokens and latency. Decide where the curve stops paying off.",
  },
  {
    n: 6,
    title: "Deploying a reflection agent",
    body: "Ship it with LangSmith Deployment, in both Python and TypeScript, with the loop observable in production.",
  },
];

// The six minimum papers the course rests on (APA 7, links resolve).
const READING = [
  {
    cite: "Shinn, N., et al. (2023). Reflexion: Language agents with verbal reinforcement learning.",
    url: "https://arxiv.org/abs/2303.11366",
  },
  {
    cite: "Madaan, A., et al. (2023). Self-Refine: Iterative refinement with self-feedback.",
    url: "https://arxiv.org/abs/2303.17651",
  },
  {
    cite: "Yao, S., et al. (2023). Tree of Thoughts: Deliberate problem solving with large language models.",
    url: "https://arxiv.org/abs/2305.10601",
  },
  {
    cite: "Wei, J., et al. (2022). Chain-of-thought prompting elicits reasoning in large language models.",
    url: "https://arxiv.org/abs/2201.11903",
  },
  {
    cite: "Bai, Y., et al. (2022). Constitutional AI: Harmlessness from AI feedback.",
    url: "https://arxiv.org/abs/2212.08073",
  },
  {
    cite: "Yao, S., et al. (2022). ReAct: Synergizing reasoning and acting in language models.",
    url: "https://arxiv.org/abs/2210.03629",
  },
];

export default function FoundationCoursePage() {
  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white pt-32 pb-16">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <CourseStatusBadge status={course.status} />
            </div>
            <p className="text-sm uppercase tracking-wide text-blue-200 mb-2">
              Foundation Course
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-blue-100 mb-4">{course.pitch}</p>
            {course.shipDate && (
              <p className="text-blue-200 font-medium">Ships ~{course.shipDate}</p>
            )}
          </div>
        </div>
      </section>

      {/* Outline */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course outline</h2>
            <ol className="space-y-4">
              {MODULES.map((m) => (
                <li
                  key={m.n}
                  className="flex gap-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <span
                    className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm"
                    aria-hidden="true"
                  >
                    {m.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{m.title}</h3>
                    <p className="text-gray-700 mt-1 leading-relaxed">{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Reading list */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              The literature this course rests on
            </h2>
            <p className="text-gray-600 mb-4">
              Six papers, the minimum reading behind the reflection-loop patterns
              taught here.
            </p>
            <ul className="space-y-3">
              {READING.map((r) => (
                <li key={r.url} className="text-gray-700 leading-relaxed">
                  {r.cite}{" "}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-words"
                  >
                    {r.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tools + Links */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tools used</h2>
              <div className="flex flex-wrap gap-2">
                {course.stack.map((tool) => (
                  <ToolChip key={tool} label={tool} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Links</h2>
              <ul className="space-y-2">
                <li>
                  <a
                    href={course.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Repo — README outline ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Notify CTA */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="max-w-4xl mx-auto bg-white border-2 border-amber-200 rounded-2xl p-8 md:p-10 shadow-md text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Not shipped yet — want a nudge when it is?
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              The Foundation course ships ~{course.shipDate}. Send a quick note
              and I&apos;ll tell you the day it&apos;s live.
            </p>
            <Link
              href="/hire?utm_campaign=foundation-notify"
              className="inline-block btn-primary bg-blue-600 text-white hover:bg-blue-700 text-lg"
            >
              Notify me when it ships →
            </Link>
          </div>
        </div>
      </section>

      <SiblingCourses currentSlug={SLUG} />
    </main>
  );
}
