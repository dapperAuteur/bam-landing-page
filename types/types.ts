export interface BlogPost {
  slug: string
  title: string
  description: string
  publishDate: string
  readTime: string
  category: string
  featured?: boolean
  tags: string[]
  excerpt: string
}

export interface Experience {
  id: number
  title: string
  company: string
  period?: string
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