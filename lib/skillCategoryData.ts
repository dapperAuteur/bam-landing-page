import { SkillCategory } from "../types/types"

// 🔥 ADD NEW SKILLS HERE
export const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: ["Python", "JavaScript", "TypeScript", "HTML/CSS"]
  },
  {
    category: "AI/ML & Data",
    skills: ["RAG Systems", "Weaviate", "Verba", "Ollama", "Hugging Face", "LLMs", "SciBERT"]
  },
  {
    category: "APIs & Frameworks",
    skills: ["REST APIs", "FastAPI", "Next.js", "React.js", "Node.js", "GraphQL"]
  },
  {
    category: "Developer Tools",
    skills: ["Postman", "Docker", "MongoDB", "AWS", "Git", "GitHub"]
  },
  {
    category: "Education & Content",
    skills: ["LMS Platforms", "Technical Writing", "Curriculum Development", "Video Production"]
  },
  {
    category: "Community & Advocacy",
    skills: ["Community Building", "Public Speaking", "Event Management", "Technical Training"]
  }
  // 🔥 TO ADD A NEW SKILL CATEGORY: Same format as above!
]

// Helper functions for filtering and displaying data