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

// Async helper — merges DB overrides with hardcoded data (server components/API routes only)
export async function getSkillsWithOverrides(): Promise<(SkillCategory & { hidden?: boolean; displayOrder?: number })[]> {
  try {
    const clientPromise = (await import('./db/mongodb')).default
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const overrides = await db.collection('content_metadata').find({ type: 'skill' }).toArray()
    const overrideMap = new Map(overrides.map(o => [o.contentId, o]))

    return skillCategories
      .map((cat, i) => {
        const override = overrideMap.get(`skill-${i}`)
        if (!override) return { ...cat, hidden: false, displayOrder: 999 }

        const ovr = override.overrides || {}
        return {
          category: ovr.title ? override.title : cat.category,
          skills: ovr.data && override.data?.skills ? override.data.skills as string[] : cat.skills,
          hidden: override.hidden || false,
          displayOrder: override.displayOrder ?? 999,
        }
      })
      .filter(c => !c.hidden)
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999))
  } catch {
    return skillCategories.map(c => ({ ...c, hidden: false, displayOrder: 999 }))
  }
}