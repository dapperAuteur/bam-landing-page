import { BlogPost } from "./../types/types"

// 🔥 BLOG POST REGISTRY - Add new blog posts here!
export const blogPosts: BlogPost[] = [
  {
    slug: "why-i-track-every-step-toward-100",
    title: "Why I Track Every Step Toward 100",
    description: "How discovering 4 simple metrics changed my path to becoming the world's fastest centenarian. How they can transform your health too.",
    publishDate: "2025-12-29",
    readTime: "4 min read",
    category: "Health & Longevity",
    featured: true,
    tags: ["Health Metrics", "Wearable Technology", "Longevity", "Data Analytics", "Personal Training"],
    excerpt: "Six years of study led me to one truth: the data your body produces daily holds the key to extraordinary aging. Here's what I learned."
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
    slug: "rabbit-holes-to-rabbit-holes/technical/part-01",
    title: "Rabbit Holes to Rabbit Holes: Part 1 - The Shuffle That Broke Everything",
    description: "A developer's journey from mindless scrolling to meaningful problem-solving, starting with a simple shuffle feature that exposed a major architectural flaw.",
    publishDate: "2025-09-24",
    readTime: "6 min read",
    category: "Software Development",
    featured: true,
    tags: ["React", "State Management", "Architecture", "Debugging", "Next.js", "TypeScript"],
    excerpt: "I was spending hours perfecting my ability to mindlessly scroll. I decided to redirect that rabbit hole energy somewhere more productive. It started with what I thought was a simple feature: randomizing study cards."
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
  {
    slug: "eastern-cottontail-educational-projects",
    title: "Eastern Cottontail Educational Projects",
    description: "PBS-Style Mini-Documentaries + Standards-Aligned Activities. Bringing wildlife into your classroom through local rabbits stories",
    publishDate: "2025-08-20",
    readTime: "8 min read",
    category: "Education",
    featured: true,
    tags: ["Rabbits", "Education", "Fishers", "Indiana", "Science", "Geist Reseviour", "Documentary", "K-5"],
    excerpt: "Ready to Bring Wildlife Learning to Your Classroom? Connect your students with local wildlife through engaging, standards-aligned projects"
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
  {
    slug: "bodys-gatekeeper",
    title: "The Body's Gatekeeper",
    description: "Loss of bowel control is a serious medical condition, not a personal failing. Effective treatments exist. The most important step is to break the silence and talk to a healthcare provider.",
    publishDate: "2025-06-16",
    readTime: "5 min read",
    category: "Biology",
    featured: false,
    tags: ["Human Anatomy", "Health & Wellness", "Digestive System"],
    excerpt: "A Visual Guide to Understanding Bowel Control: Gas vs. Stool. The Anatomy of Continence Meet the key players responsible for keeping you in control."
  },
  {
    slug: "centenarian-athletes-an-interactive-infographic",
    title: "Centenarian Athletes An Interactive Infographic",
    description: "A Visual Guide to amazing centenarian athletes that held the record as world's fastest centenarian.",
    publishDate: "2025-07-16",
    readTime: "5 min read",
    category: "Athletics",
    featured: false,
    tags: ["Athletes", "Sports", "Athletics", "Longevity"],
    excerpt: "Ageless Wonders. Discover the incredible stories of centenarian athletes who defy the limits of age."
  },
  {
    slug: "diaphragmatic-breathing",
    title: "The Power of Breath: A Guide to Diaphragmatic Breathing",
    description: "More Than Just a Deep Breath. Often called 'belly breathing,' this is the practice of engaging your diaphragm, a large muscle at the base of your lungs designed to do ~80% of the work of breathing. It contrasts with shallow 'chest breathing,' which uses smaller neck and shoulder muscles, leading to tension and inefficiency. Learning this technique is about re-learning your body's natural, optimal way to breathe.",
    publishDate: "2025-07-08",
    readTime: "5 min read",
    category: "Voiceover",
    featured: true,
    tags: ["Breathing", "Voiceover", "Health", "Longevity"],
    excerpt: "Unlock health, longevity, and vocal excellence by mastering your body's most fundamental rhythm."
  },
  {
    slug: "endocannabinoid-system-curriculum-infographic-sources",
    title: "The Endocannabinoid System: A Comprehensive Educational Curriculum",
    description: "This curriculum provides evidence-based education on the endocannabinoid system, designed for healthcare professionals, researchers, and wellness practitioners seeking to integrate ECS knowledge into their practice.",
    publishDate: "2025-06-07",
    readTime: "5 min read",
    category: "Endocannabinoid System",
    featured: true,
    tags: ["Science", "Endocannabinoid System", "Health", "Longevity", "Fitness", "Educatoin", "Neurology"],
    excerpt: "This curriculum provides evidence-based education on the endocannabinoid system, designed for healthcare professionals, researchers, and wellness practitioners seeking to integrate ECS knowledge into their practice."
  },
  {
    slug: "enduring-power-of-hoodoo",
    title: "The Enduring Power of Hoodoo",
    description: "A spiritual tradition of resistance, resilience, and empowerment.",
    publishDate: "2025-07-07",
    readTime: "5 min read",
    category: "Spirituality",
    featured: true,
    tags: ["Spirituality", "Africa", "USA", "African-American", "Rootwork", "Conjure", "Hoodoo", "Tradition", "History"],
    excerpt: "Hoodoo, also known as Rootwork or Conjure, is an African-American spiritual tradition focused on personal empowerment and achieving tangible results in everyday life. It is a system of folk magic, not an organized religion."
  },
  {
    slug: "exodus",
    title: "An Exodus in the Land of Promise",
    description: "The Great Migration of African Americans, 1910-1970.",
    publishDate: "2025-07-07",
    readTime: "10 min read",
    category: "US History",
    featured: false,
    tags: ["US History", "World History", "USA", "African-American", "Harlem Renaissance", "Migration", "Refugees", "Jim Crow South", "History"],
    excerpt: "The Great Migration was a courageous act of agency by six million African Americans to escape the oppressive Jim Crow South. They fled a system of legal segregation, political disenfranchisement, economic exploitation through sharecropping, and the constant terror of racial violence. As one migrant wrote, they sought to go 'where a man is a man.'"
  },
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
  {
    slug: "interactive-indiana-corvid-species-analysis",
    title: "Interactive Corvid Analysis",
    description: "An AI-Enhanced Infographic for Indiana Species",
    publishDate: "2025-05-07",
    readTime: "5 min read",
    category: "Birds",
    featured: false,
    tags: ["Nature", "Birds", "Animals"],
    excerpt: "An AI-Enhanced Infographic for Indiana Species"
  },
  {
    slug: "making-sense-of-statistics",
    title: "Making Sense of Statistics",
    description: "A Guide to Understanding & Explaining Data",
    publishDate: "2025-05-07",
    readTime: "7 min read",
    category: "Statistics",
    featured: false,
    tags: ["Statistics", "Math", "Critical Thinking"],
    excerpt: "Statistics help us describe data and draw inferences. These are the building blocks."
  },
  {
    slug: "lester-wright-sr-the-man-who-outran-time",
    title: "Lester Wright Sr.: The Man Who Outran Time",
    description: "The Man Who Outran Time",
    publishDate: "2025-06-20",
    readTime: "5 min read",
    category: "Centenarian",
    featured: false,
    tags: ["Centenarian", "Athletics"],
    excerpt: "Shattered the 100m world record for the M100 age group with a time of 26.34 seconds."
  },
  {
    slug: "scientific-study-infographic",
    title: "Understanding Scientific Studies",
    description: "The design of a study determines the strength of its conclusions. Understanding the type is the first step to critical appraisal.",
    publishDate: "2025-07-20",
    readTime: "5 min read",
    category: "Science",
    featured: false,
    tags: ["Science", "Critical Thinking"],
    excerpt: "The design of a study determines the strength of its conclusions. Understanding the type is the first step to critical appraisal."
  },
  {
    slug: "sacred-act-of-burning-hair",
    title: "The Sacred Act of Burning Hair",
    description: "An interactive infographic tracing a profound spiritual practice from its African origins to its enduring presence in the diaspora.",
    publishDate: "2025-03-29",
    readTime: "5 min read",
    category: "Rituals",
    featured: false,
    tags: ["Culture", "Rituals"],
    excerpt: "An interactive infographic tracing a profound spiritual practice from its African origins to its enduring presence in the diaspora."
  },
  {
    slug: "skeptics-guide-to-statistics",
    title: "The Skeptics Guide to Statistics",
    description: "How Data Can Be Misused & What to Look For. Misinformation isn't always about fake data. Often, it's about presenting real data in a misleading way. Here are the most common traps.",
    publishDate: "2025-01-10",
    readTime: "5 min read",
    category: "Statistics",
    featured: false,
    tags: ["Statistics", "Critical Thinking", "Math"],
    excerpt: "Misinformation isn't always about fake data. Often, it's about presenting real data in a misleading way. Here are the most common traps."
  },
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

  // 🔥 TO ADD A NEW BLOG POST:
  // 1. Create a folder in /blog/[your-blog-title-slug]/
  // 2. Add your page.tsx file to that folder
  // 3. Add an entry here with the same slug
  // 4. The blog listing will automatically pick it up!
]

// Helper functions
export const getFeaturedPosts = () => blogPosts.filter(post => post.featured)
export const getPostsByCategory = (category: string) => blogPosts.filter(post => post.category === category)
export const getAllCategories = () => Array.from(new Set(blogPosts.map(post => post.category)))
export const getPostBySlug = (slug: string) => blogPosts.find(post => post.slug === slug)
