import { Project } from "./../types/types"

export const projects: Project[] = [
  {
    title: "Science Clickbait Decoder",
    description: "RAG-based tool using Python FastAPI, Next.js, and MongoDB with Hugging Face SciBERT for natural language processing.",
    type: "Open Source Project",
    technologies: ["Python", "FastAPI", "Next.js", "MongoDB", "Hugging Face", "SciBERT"],
    impact: "Helps users identify and decode misleading science headlines using AI",
    featured: true,
    link: "https://github.com/yourusername/science-clickbait-decoder"
  },
  {
    title: "FDA Food Recall App",
    description: "Application that tracks and alerts users about FDA food recalls with real-time data integration.",
    type: "Consumer Safety Tool",
    technologies: ["JavaScript", "API Integration", "Real-time Data", "Food Safety"],
    impact: "Provides critical food safety information to consumers",
    featured: true
  },
  {
    title: "FreeCodeCamp Curriculum Development",
    description: "Developed project-based computer science curriculum focused on practical application with automated progress tracking.",
    type: "Educational Content",
    technologies: ["Curriculum Design", "JavaScript", "Full-Stack Development", "Education"],
    impact: "Helped 100+ developers transition to tech careers"
  },
  {
    title: "Automated Training Systems",
    description: "Designed and implemented automated training and evaluation systems integrating multiple third-party services.",
    type: "EdTech Platform",
    technologies: ["LMS Integration", "Automation", "Training Systems", "Performance Tracking"],
    impact: "13 consecutive months of efficiency improvements"
  }
  // 🔥 TO ADD A NEW PROJECT: Same format as above!
]

// Helper functions for filtering and displaying data
export const getFeaturedProjects = () => projects.filter(proj => proj.featured)
