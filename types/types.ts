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
  // Photo support (central photo library)
  featuredImage?: {
    id: string
    url: string
    thumbnailUrl: string
    title?: string
    alt?: string
  }
  photoIds?: string[] // Photos used in the blog content
  // Content management (unified automated blog)
  content?: string // MDX/CMS-managed content; absent for legacy file-rendered posts
  status?: 'draft' | 'published' // Publishing status
  contentSource?: 'static' | 'cms' // 'static' = rendered from app/blog/<slug> folder; 'cms' = MDX in DB
  // Enhanced metadata
  author?: string
  views?: number
  lastModified?: string
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

export interface BlogPostDraft extends BlogPost {
  id?: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'published'
  contentSource: 'static' | 'cms'
}

export interface PhotoUsage {
  blogPosts: string[]
  galleries: string[]
  portfolio: boolean
}