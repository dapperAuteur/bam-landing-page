export interface Experience {
  id: number
  title: string
  company: string
  period: string
  type: string
  description: string
  achievements: string[]
  technologies: string[]
  featured?: boolean
}

export interface Project {
  title: string
  description: string
  type: string
  technologies: string[]
  impact: string
  featured?: boolean
  link?: string
}

export interface SkillCategory {
  category: string
  skills: string[]
}