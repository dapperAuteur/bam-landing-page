import Link from "next/link";
import { getPageMetadata } from "@/lib/seo";
import {
  getCourse,
  CourseStatusBadge,
  ToolChip,
  SiblingCourses,
} from "../page";

const SLUG = "quickstart-durable-hitl";
const course = getCourse(SLUG)!;

export const metadata = getPageMetadata({
  title: `${course.title}, Quickstart Course`,
  description: course.pitch,
  path: `/learn/${SLUG}`,
});

const LESSONS = [
  {
    n: 1,
    title: "The silent failure",
    body: "Watch a human-in-the-loop agent lose its interrupt state the moment the worker restarts, and why in-memory state is the trap.",
  },
  {
    n: 2,
    title: "What a checkpointer persists",
    body: "The LangGraph checkpointer interface: what gets saved, when, and how a thread resumes exactly where it paused.",
  },
  {
    n: 3,
    title: "The 10-line fix",
    body: "Swap the in-memory saver for a Postgres checkpointer, the whole change, wired and explained.",
  },
  {
    n: 4,
    title: "Proving durability",
    body: "Kill the worker mid-interrupt, restart it, and watch the agent resume the human approval it was waiting on.",
  },
];

export default function QuickstartCoursePage() {
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
              Quickstart Course
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Lessons</h2>
            <ol className="space-y-4">
              {LESSONS.map((m) => (
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
                    Repo, README outline ↗
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
              Not shipped yet, want a nudge when it is?
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              This Quickstart ships ~{course.shipDate}. Send a quick note and
              I&apos;ll tell you the day it&apos;s live.
            </p>
            <Link
              href="/hire?utm_campaign=quickstart-notify"
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
