import { BlogPost } from "./../types/types"
import { BLOG_DB, COLLECTIONS } from "./db/collections"

// LEGACY STATIC REGISTRY (mostly retired 2026-08-06).
// Do NOT add new posts here: new posts are born in /admin/blog/posts (or via
// scripts/import-static-mdx.mjs) and live in the blog_posts collection.
// The 5 remaining active entries are the listed legacy folder posts that keep
// LIVE functional forms (site API POSTs) and so cannot move into the closed
// MDX registry yet; see plans/legacy-migration-audit.md (local) for their
// options. The commented-out entries below document the unlisted backlog of
// folder posts awaiting a per-post publish/retire decision from BAM.
export const blogPosts: BlogPost[] = [
  {
    slug: "workouts/mai/longevity-protocol-v0",
    title: "Nomad Longevity OS: A Traveler's Phase 1 Protocol",
    description: "A modular 5/15/30/45/60-minute training system for nomads: AM priming, PM recovery, and metabolic engine work for hotel or full-gym access. Built on the NASM OPT Phase 1 model with a strict 4/2/1/1 tempo.",
    publishDate: "2026-04-22",
    readTime: "8 min read",
    category: "Performance",
    featured: true,
    tags: ["Longevity", "Travel Fitness", "NASM", "OPT Model", "Mobility", "Recovery", "Biohacking"],
    excerpt: "Environmental friction derails most travelers' training. Nomad Longevity OS is a beta case-study protocol that replaces willpower with pre-planned If/Then responses: modular routines for AM, PM, hotel, and full gym, plus a Friction Protocol for airport gaps and late hotel arrivals."
  },
  // {
  //   slug: "the-intensity-minutes-that-changed-everything",
  //   title: "The Intensity Minutes That Changed Everything",
  //   description: "Understanding the single metric that predicts 50% mortality reduction—and how to optimize it for your body.",
  //   publishDate: "2025-01-20",
  //   readTime: "7 min read",
  //   category: "Health & Longevity",
  //   featured: true,
  //   tags: ["Fitness Data", "Intensity Minutes", "Heart Rate", "Exercise Science", "Longevity"],
  //   excerpt: "Most people track steps. Elite athletes track something far more powerful. Here's the metric that separates average health from exceptional longevity."
  // },
  // {
  //   slug: "building-a-health-dashboard-for-the-next-70-years",
  //   title: "Building a Health Dashboard for the Next 70 Years",
  //   description: "The complete system for transforming health data into daily decisions—designed to keep my community active and present for decades.",
  //   publishDate: "2025-01-27",
  //   readTime: "8 min read",
  //   category: "Health & Longevity",
  //   featured: true,
  //   tags: ["Data Analytics", "Health Dashboard", "Fitness Technology", "Longevity Science", "Course Launch"],
  //   excerpt: "I built this course because I want the people I love to be there when I break the centenarian speed record. Here's the complete roadmap."
  // },
  // {
  //   slug: "body-dashboard-fitness-metrics-series-part-1",
  //   title: "Your Body’s Dashboard: Part 1 of 3",
  //   description: "Learn a simple way to read your body’s numbers so you can make clearer everyday choices.",
  //   publishDate: "2026-01-05",
  //   readTime: "5 min read",
  //   category: "Health & Data",
  //   featured: true,
  //   tags: ["Health", "Fitness", "Data", "Wearables", "Longevity"],
  //   excerpt: "Most people never learn how to read their body’s “dashboard.” This post shows a simple, three‑step way to use your own health numbers."
  // },
  {
    slug: "ama-sports-broadcasting",
    title: "Pass the Torch: Inspire the Next Generation",
    description: "A call to action for sports media professionals: Share your journey with high school students in a 35-minute virtual AMA and shape the future of broadcasting.",
    publishDate: "2026-01-16",
    readTime: "2 min read",
    category: "Community & Mentorship",
    featured: true,
    tags: ["Sports Broadcasting", "Mentorship", "Education", "Volunteering", "Career Development"],
    excerpt: "35 minutes. Virtual. Massive Impact. Join the roster of industry professionals helping 5A high school students bridge the gap between technical skills and a professional career."
  },
  {
    slug: "rabbit-holes-to-rabbit-holes/technical",
    title: "Rabbit Holes → Business Value: Technical Series",
    description: "Series preview of a developer's journey from mindless scrolling to meaningful problem-solving, starting with a simple shuffle feature that exposed a major architectural flaw.",
    publishDate: "2025-09-20",
    readTime: "3 min read",
    category: "Software Development",
    featured: true,
    tags: ["React", "State Management", "Architecture", "Debugging", "Next.js", "TypeScript"],
    excerpt: "Systematic approach to architectural evolution and business-focused development"
  },
  {
    slug: "elementary-mba-cross-curricular-9-12",
    title: "Revolutionary Cross-Curricular Education",
    description: "Connecting everyday purchases to world trade and history.",
    publishDate: "2025-09-10",
    readTime: "9 min read",
    category: "Education",
    featured: true,
    tags: ["High School", "Geography", "Economics", "Social Studies", "ELA", "Cross-Curricular", "Education"],
    excerpt: "Transform everyday student experiences into comprehensive lessons spanning Geography, Social Studies, Economics, and ELA. Connect coffee shops to Ethiopian highlands, chocolate bars to Maya ceremonies, and tea breaks to Chinese traditions."
  },
  {
    slug: "corvids-of-fishers-educational-series",
    title: "Corvids of Fishers: Educational Series",
    description: "Planet Earth-Style Mini-Documentaries + Standards-Aligned Activities. Bringing wildlife intelligence into your classroom through local corvid (bird) stories",
    publishDate: "2025-08-15",
    readTime: "8 min read",
    category: "Education",
    featured: true,
    tags: ["Corvids", "Birds", "Education", "Fishers", "Indiana", "Science", "Geist Reseviour", "Documentary", "K-5"],
    excerpt: "10 episodes featuring corvids (birds) in Fishers, Indiana with Planet Earth-style narration. Activities meet Indiana Science Standards with cross-curricular connections."
  },
  // {
  //   slug: "a-homeland-shaped-by-the-river-of-the-south-wind",
  //   title: "A Homeland Shaped by the River of the South Wind",
  //   description: "An interactive exploration of Indigenous life along the Arkansas River, featuring the diverse nations that called this waterway home.",
  //   publishDate: "2025-06-15",
  //   readTime: "8 min read",
  //   category: "History & Culture",
  //   featured: false,
  //   tags: ["Indigenous History", "Arkansas River", "Interactive Story", "Cultural Heritage"],
  //   excerpt: "Discover the rich tapestry of Indigenous nations that thrived along the Arkansas River, from the Ute in the headwaters to the Quapaw at its confluence with the Mississippi. An immersive journey through time featuring AI-powered storytelling."
  // },
  // {
  //   slug: "free-spaced-repetition-scheduler",
  //   title: "Free Spaced Repetition Scheduler (FSRS)",
  //   description: "FSRS is a sophisticated algorithm based on the DSR (Difficulty, Stability, Retrievability) model of memory. It provides a powerful, data-driven method for creating highly personalized flashcard review schedules.",
  //   publishDate: "2025-07-07",
  //   readTime: "5 min read",
  //   category: "Learning",
  //   featured: true,
  //   tags: ["Learning Cycle", "Learning Cycle"],
  //   excerpt: "FSRS is a sophisticated algorithm based on the DSR (Difficulty, Stability, Retrievability) model of memory. It provides a powerful, data-driven method for creating highly personalized flashcard review schedules."
  // },
  // {
  //   slug: "centenarian-athletes-an-interactive-infographic-times",
  //   title: "Centenarian Athletes Times: An Interactive Infographic",
  //   description: "A Visual Guide to amazing centenarian athletes that held the record as world's fastest centenarian.",
  //   publishDate: "2025-07-17",
  //   readTime: "5 min read",
  //   category: "Athletics",
  //   featured: false,
  //   tags: ["Athletes", "Sports", "Athletics", "Longevity"],
  //   excerpt: "Ageless Wonders. Discover the incredible stories of centenarian athletes who defy the limits of age."
  // },
  // {
  //   slug: "bowel-as-a-barometer",
  //   title: "The Bowel as a Barometer",
  //   description: "Your Gut's Daily Report Card on Health, Disease Risk, and Longevity.",
  //   publishDate: "2025-06-18",
  //   readTime: "5 min read",
  //   category: "Biology",
  //   featured: false,
  //   tags: ["Human Anatomy", "Health & Wellness", "Digestive System"],
  //   excerpt: "The Gut-Health Bridge. Your bowel habits shape the trillions of microbes in your gut, which in turn influence your entire body."
  // }


  // ========================================
  // BACKLOG: Unpublished blog posts (have page.tsx files but not yet ready for the blog index).
  // Manual review required for each — fill in title/description/publishDate/readTime/category/tags/excerpt,
  // verify the page builds, then uncomment to publish.
  // Auto-generated 2026-04-28 from app/blog/<slug>/page.tsx files lacking registry entries.
  // ========================================
  // {
  //   slug: "-nss-natural-short-sleep-ai",
  //   title: "Nss Natural Short Sleep Ai",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "-routines-architecture-of-well-being",
  //   title: "Routines Architecture Of Well Being",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "-secret-life-of-the-fishers-cottontail",
  //   title: "Secret Life Of The Fishers Cottontail",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "-sleep-for-active-folk",
  //   title: "Sleep For Active Folk",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "ai/anatomy-of-a-critical-partner-ai",
  //   title: "Anatomy Of A Critical Partner Ai",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "ai/anatomy-of-a-critical-partner-ai-keyword-prompts",
  //   title: "Anatomy Of A Critical Partner Ai Keyword Prompts",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "ai/anatomy-of-a-critical-partner-ai-keyword-prompts-v2",
  //   title: "Anatomy Of A Critical Partner Ai Keyword Prompts V2",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "ai/local-ai-agent-tool",
  //   title: "Local Ai Agent Tool",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "ama-sports-media",
  //   title: "Ama Sports Media",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "better-vice-club-ebook",
  //   title: "Better Vice Club Ebook",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "better-vice-club-v1",
  //   title: "Better Vice Club V1",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "better-vice-club-v2",
  //   title: "Better Vice Club V2",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "corvid-digital-student-portfolio-template",
  //   title: "Corvid Digital Student Portfolio Template",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "corvid-interactive-web-content",
  //   title: "Corvid Interactive Web Content",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "endocannabinoid-system-curriculum-infographic",
  //   title: "Endocannabinoid System Curriculum Infographic",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "indiana-corvid-species-analysis",
  //   title: "Indiana Corvid Species Analysis",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "indiana-corvid-species-analysis-copy",
  //   title: "Indiana Corvid Species Analysis Copy",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "journey-into-african-spiritual-traditions",
  //   title: "Journey Into African Spiritual Traditions",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "page.tsx",
  //   title: "Page.tsx",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/part-01",
  //   title: "Part 01",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/part-02",
  //   title: "Part 02",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/part-03",
  //   title: "Part 03",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/part-04",
  //   title: "Part 04",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/part-05",
  //   title: "Part 05",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/professional",
  //   title: "Professional",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/professional/part-01",
  //   title: "Part 01",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/professional/part-02",
  //   title: "Part 02",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/professional/part-03",
  //   title: "Part 03",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/professional/part-04",
  //   title: "Part 04",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/professional/part-05",
  //   title: "Part 05",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/story",
  //   title: "Story",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/story/part-01",
  //   title: "Part 01",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/story/part-02",
  //   title: "Part 02",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/story/part-03",
  //   title: "Part 03",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/story/part-04",
  //   title: "Part 04",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/story/part-05",
  //   title: "Part 05",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/technical/part-02",
  //   title: "Part 02",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/technical/part-03",
  //   title: "Part 03",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/technical/part-04",
  //   title: "Part 04",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "rabbit-holes-to-rabbit-holes/technical/part-05",
  //   title: "Part 05",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "sign-language-learning-app",
  //   title: "Sign Language Learning App",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "spaced-repetition-system-infographic-component",
  //   title: "Spaced Repetition System Infographic Component",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // {
  //   slug: "workouts/stable-explosiveness-lphc-protocol-ver0",
  //   title: "Stable Explosiveness Lphc Protocol Ver0",
  //   description: "TODO: write description",
  //   publishDate: "TODO",
  //   readTime: "TODO",
  //   category: "TODO",
  //   featured: false,
  //   tags: [],
  //   excerpt: "TODO: write excerpt"
  // },
  // Adding posts here is retired: author new posts in /admin/blog/posts.
  // After import, the blog_posts row is the post; editing files here or the
  // old folders changes nothing on the site.
]

// Synchronous helpers — static array only (safe for client components / fallback)
export const getFeaturedPosts = () => blogPosts.filter(post => post.featured)
export const getPostsByCategory = (category: string) => blogPosts.filter(post => post.category === category)
export const getAllCategories = () => Array.from(new Set(blogPosts.map(post => post.category)))
export const getPostBySlugSync = (slug: string) => blogPosts.find(post => post.slug === slug)

export type BlogPostWithMeta = BlogPost & { hidden?: boolean; featuredOrder?: number }

// SINGLE SOURCE OF TRUTH (server components / API routes only).
// Merges three inputs, deduped by slug:
//   1. static blogPosts[] + blog_metadata overrides (legacy model)
//   2. blog_posts CMS rows (the unified automated blog) — these WIN on collision
// When blog_posts is empty (pre-migration) this returns exactly the legacy
// static+override result, so there is no behavior change until posts are migrated.
export async function getAllBlogPosts(): Promise<BlogPostWithMeta[]> {
  try {
    const clientPromise = (await import('./db/mongodb')).default
    const client = await clientPromise
    const db = client.db(BLOG_DB)

    // 1) Legacy: static posts with blog_metadata overrides applied
    const overrides = await db.collection(COLLECTIONS.blogMetadata).find({}).toArray()
    const overrideMap = new Map(overrides.map(o => [o.slug, o]))
    const staticMerged: BlogPostWithMeta[] = blogPosts.map(post => {
      const override = overrideMap.get(post.slug)
      if (!override) return { ...post, hidden: false, featuredOrder: 999, contentSource: 'static' as const }

      const ovr = override.overrides || {}
      return {
        ...post,
        ...(ovr.title ? { title: override.title } : {}),
        ...(ovr.description ? { description: override.description } : {}),
        ...(ovr.featured ? { featured: override.featured } : {}),
        ...(ovr.category ? { category: override.category } : {}),
        ...(ovr.tags ? { tags: override.tags } : {}),
        ...(ovr.excerpt ? { excerpt: override.excerpt } : {}),
        ...(ovr.readTime ? { readTime: override.readTime } : {}),
        ...(ovr.publishDate ? { publishDate: override.publishDate } : {}),
        hidden: override.hidden || false,
        featuredOrder: override.featuredOrder ?? 999,
        contentSource: 'static' as const,
      }
    })

    // 2) CMS rows from the unified blog_posts collection. status:'draft' => hidden from public.
    const cmsRows = await db.collection(COLLECTIONS.blogPosts).find({}).toArray()
    const cmsPosts: BlogPostWithMeta[] = cmsRows.map(row => {
      const { _id, ...rest } = row as Record<string, unknown>
      const post = rest as unknown as BlogPost & { status?: string; featuredOrder?: number }
      return {
        ...post,
        hidden: post.status === 'draft',
        featuredOrder: post.featuredOrder ?? 999,
        contentSource: post.contentSource ?? 'cms',
      }
    })

    // 3) Merge by slug — CMS row wins on collision
    const bySlug = new Map<string, BlogPostWithMeta>()
    for (const p of staticMerged) bySlug.set(p.slug, p)
    for (const p of cmsPosts) bySlug.set(p.slug, { ...bySlug.get(p.slug), ...p })

    return Array.from(bySlug.values())
      .filter(post => !post.hidden)
      .sort((a, b) => {
        if (a.featured && b.featured) return (a.featuredOrder || 999) - (b.featuredOrder || 999)
        return 0
      })
  } catch {
    // Fallback to hardcoded data if DB unavailable
    return blogPosts.map(p => ({ ...p, hidden: false, featuredOrder: 999, contentSource: 'static' as const }))
  }
}

// Back-compat alias — existing caller app/blog/page.tsx keeps working unchanged.
export const getBlogPostsWithOverrides = getAllBlogPosts

// Single-post lookup (server). CMS row wins; falls back to the static registry.
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const clientPromise = (await import('./db/mongodb')).default
    const client = await clientPromise
    const db = client.db(BLOG_DB)
    const cms = await db.collection(COLLECTIONS.blogPosts).findOne({ slug })
    if (cms) {
      const { _id, ...rest } = cms as Record<string, unknown>
      return rest as unknown as BlogPost
    }
  } catch {
    // fall through to static registry
  }
  return blogPosts.find(post => post.slug === slug) ?? null
}
