import { getPageMetadata } from "@/lib/seo";
import {
  getCourse,
  CourseStatusBadge,
  ToolChip,
  SiblingCourses,
} from "../page";

const SLUG = "project-multi-agent-rag";
const course = getCourse(SLUG)!;

// Drop the Cloudinary intro-video URL here when it lands (see user-task #36).
// Leave null to render the accessible "coming soon" placeholder.
const INTRO_VIDEO_URL: string | null = null;

export const metadata = getPageMetadata({
  title: `${course.title}, Project Course`,
  description: course.pitch,
  path: `/learn/${SLUG}`,
});

const MODULES = [
  {
    n: 1,
    title: "The supervisor pattern",
    body: "Route each question to the right domain specialist with a LangGraph supervisor instead of one overloaded prompt.",
  },
  {
    n: 2,
    title: "Per-agent RAG",
    body: "Give every specialist its own pgvector index, domain-scoped retrieval instead of one shared store that bleeds context.",
  },
  {
    n: 3,
    title: "Retrieval that respects domains",
    body: "Chunking, embeddings, and metadata filters tuned per specialist so the nutrition agent never answers from the finance corpus.",
  },
  {
    n: 4,
    title: "State and handoffs",
    body: "Pass context between agents cleanly, shared state, reducers, and handoffs that don't leak one domain into another.",
  },
  {
    n: 5,
    title: "Evaluating a multi-agent system",
    body: "Use LangSmith traces and datasets to score the system per-agent, so a regression in one specialist is visible before it ships.",
  },
  {
    n: 6,
    title: "Shipping it",
    body: "LangSmith Deployment, Drizzle-backed persistence, and the path from notebook to the live Fit T. Cent coach.",
  },
];

// Papers the course rests on (APA 7, links resolve, Block 5 citation rule).
const READING = [
  {
    cite: "Lewis, P., et al. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks.",
    url: "https://arxiv.org/abs/2005.11401",
  },
  {
    cite: "Karpukhin, V., et al. (2020). Dense passage retrieval for open-domain question answering.",
    url: "https://arxiv.org/abs/2004.04906",
  },
  {
    cite: "Yao, S., et al. (2022). ReAct: Synergizing reasoning and acting in language models.",
    url: "https://arxiv.org/abs/2210.03629",
  },
  {
    cite: "Asai, A., et al. (2023). Self-RAG: Learning to retrieve, generate, and critique through self-reflection.",
    url: "https://arxiv.org/abs/2310.11511",
  },
];

export default function ProjectCoursePage() {
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
              Project Course
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-blue-100">{course.pitch}</p>
          </div>
        </div>
      </section>

      {/* Intro video */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <figure>
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-900 shadow-sm">
                {INTRO_VIDEO_URL ? (
                  <video
                    controls
                    preload="metadata"
                    className="h-full w-full"
                    aria-label="Course intro video"
                  >
                    <source src={INTRO_VIDEO_URL} type="video/mp4" />
                    Your browser doesn&apos;t support embedded video.
                  </video>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-gray-300">
                    <span className="text-4xl" aria-hidden="true">
                      ▶
                    </span>
                    <p className="font-semibold">Course intro video, coming soon</p>
                    <p className="text-sm text-gray-400">
                      The recorded walkthrough is being uploaded.
                    </p>
                  </div>
                )}
              </div>
              <figcaption className="mt-3 text-sm text-gray-600">
                A walkthrough of the multi-agent architecture behind{" "}
                <strong>Fit T. Cent</strong>, &ldquo;Get Fit and Learn
                Tryin&rsquo;&rdquo;, the live coach inside CentenarianOS.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Outline */}
      <section className="section-padding pt-0">
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
                    Course repo ↗
                  </a>
                </li>
                {course.deployedUrl && (
                  <li>
                    <a
                      href={course.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Live coach, Fit T. Cent on CentenarianOS ↗
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href="https://smith.langchain.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    LangSmith ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reading list */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What this course rests on
            </h2>
            <p className="text-gray-600 mb-4">
              The literature behind the multi-agent RAG patterns taught here.
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

      {/* Sibling courses */}
      <SiblingCourses currentSlug={SLUG} />
    </main>
  );
}
