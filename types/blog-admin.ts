export interface BlogMetadata {
  _id?: string
  slug: string
  title: string
  description: string
  publishDate: string
  readTime: string
  category: string
  featured: boolean
  tags: string[]
  excerpt: string
  hidden: boolean
  featuredOrder: number
  overrides: Record<string, boolean>
  createdAt: Date
  updatedAt: Date
}

export interface ContentMetadata {
  _id?: string
  contentId: string
  type: 'project' | 'experience' | 'skill'
  title: string
  description?: string
  featured: boolean
  hidden: boolean
  displayOrder: number
  overrides: Record<string, boolean>
  data: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}
