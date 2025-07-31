import { Project } from "./../types/types"

export const projects: Project[] = [
  {
    title: "FlashLearn AI",
    description: "AI/ML flashcard web app that uses spaced recall to help students learn and retain information. Repo: https://github.com/dapperAuteur/flashlearn-ai",
    type: "Open Source Project",
    technologies: ["NextJS", "Gemini AI", "TensorFlow", "MongoDB", "ChartJS", "UpStash", "Tailwind CSS"],
    impact: "Helps users identify weaknesses in their knowledge and improve their learning.",
    featured: true,
    link: "https://flashlearnai.witus.online/"
  },
  {
    title: "Online Fitness Assessment Tool",
    description: "A Tool to help CPT deliver online fitness assessments and track progress. Allow users to give self-assessments and track progress. Repo: https://github.com/dapperAuteur/fit-t-cent-assessments",
    type: "Fitness Tool",
    technologies: ["MediaPipe", "Gemini AI", "Firebase"],
    impact: "Helping Certified Personal Trainers deliver quality fitness assessments virtually.",
    featured: true,
    link: "https://assessments.thecalisthenics.com/"
  },
  {
    title: "Foundations of Fitness and Health Metrics",
    description: "A comprehensive 5-week curriculum integrating peer-reviewed research, collaborative learning, and practical application to transform health data into actionable longevity insights.",
    type: "Online Self-Paced Class",
    technologies: ["LMS Integration", "Automation", "Curriculum Design", "Peer-Reviewed Research", "Collaborative Learning"],
    impact: "Helping students take control of their fitness and health.",
    featured: true,
    link: "https://fitness-data-analytics-course-lp.witus.online"
  },
  {
    title: "Endocannabinoid System Curriculum",
    description: "A comprehensive 5-week curriculum integrating peer-reviewed research, collaborative learning, and practical application to understand and activate the ECS.",
    type: "Online Self-Paced Class",
    technologies: ["LMS Integration", "Automation", "Curriculum Design", "Peer-Reviewed Research", "Collaborative Learning"],
    impact: "Helping students find alternatives to cannabis use.",
    featured: true,
    link: "https://ecs-specialization.betterbud.club"
  },
  {
    title: "AwesomeWebStore.com",
    description: "Online store for all official BAM merchandise. You may also watch all my live streams here.",
    type: "Open Source Project",
    technologies: ["Shopify", "Consolto", "Pabbly Connect", "Adilo Big Command"],
    impact: "Helping BAM reach his goals.",
    featured: true,
    link: "https://l.awews.com/merch"
  },
  {
    title: "Elementary MBA",
    description: "Financial literacy curriculum designed to help students understand how and why businesses make decisions",
    type: "Online Self-Paced Class",
    technologies: ["LMS Integration", "Automation", "Curriculum Design", "Peer-Reviewed Research", "Collaborative Learning"],
    impact: "Taught to over 100 3rd-5th graders with STEM and coding course work.",
    featured: true,
    link: "https://github.com/dapperAuteur/kys-rag"
  },
  {
    title: "ElementaryMBA Dashboard",
    description: "Web app to show users a snapshot of their financial health and help them understand the impact of paying of loans early. Repo: https://github.com/dapperAuteur/temba-fin-dashboard.",
    type: "Financial Dashboard",
    technologies: ["NextJS", "ChartJS", "MongoDB", "Prisma"],
    impact: "Compliment to Elementary MBA curriculum.",
    featured: true,
    link: "https://github.com/dapperAuteur/temba-fin-dashboard"
  },
  {
    title: "Science Clickbait Decoder",
    description: "RAG-based tool using Python FastAPI, Next.js, and MongoDB with Hugging Face SciBERT for natural language processing. Repo: https://github.com/dapperAuteur/kys-rag.",
    type: "Open Source Project",
    technologies: ["Python", "FastAPI", "Next.js", "MongoDB", "Hugging Face", "SciBERT"],
    impact: "Helps users identify and decode misleading science headlines using AI",
    featured: false,
    link: "https://github.com/dapperAuteur/kys-rag"
  },
  {
    title: "FDA Food Recall App",
    description: "Application that tracks and alerts users about FDA food recalls with real-time data integration. Repo: https://github.com/TechByChoice/food-recall-app.",
    type: "Consumer Safety Tool",
    technologies: ["JavaScript", "API Integration", "Real-time Data", "Food Safety"],
    impact: "Provides critical food safety information to consumers",
    featured: false,
    link: "https://github.com/TechByChoice/food-recall-app"
  },
  {
    title: "Automated Training Systems",
    description: "Designed and implemented automated training and evaluation systems integrating multiple third-party services.",
    type: "EdTech Platform",
    technologies: ["LMS Integration", "Automation", "Training Systems", "Performance Tracking"],
    impact: "13 consecutive months of efficiency improvements",
    featured: false
  }
  // 🔥 TO ADD A NEW PROJECT: Same format as above!
]

// Helper functions for filtering and displaying data
export const getFeaturedProjects = () => projects.filter(proj => proj.featured)
