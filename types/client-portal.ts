import type { ClientMedia, GallerySettings } from './client-gallery'

export type ProjectType = 'gallery' | 'proposal' | 'deliverable' | 'mixed'
export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'revised'
export type ServiceCategory =
  | 'voiceover'
  | 'ai-consulting'
  | 'business-consulting'
  | 'sports-photography'
  | 'photography'
  | 'content-creation'
  | 'dev-relations'
  | 'combination'

export interface ClientProject {
  _id?: string
  projectId: string
  type: ProjectType
  clientName: string
  clientEmail: string
  projectName: string
  description?: string
  serviceCategory: ServiceCategory
  media: ClientMedia[]
  proposal?: ProposalContent
  settings: ProjectSettings
  accessCode?: string
  expiresAt?: Date
  status: ProposalStatus
  statusHistory: StatusChange[]
  createdAt: Date
  updatedAt: Date
}

export interface ProposalContent {
  coverLetter?: RichTextBlock
  scopeOfWork?: RichTextBlock
  deliverables?: DeliverableItem[]
  pricing?: PricingSection
  timeline?: TimelineItem[]
  terms?: RichTextBlock
  customSections?: CustomSection[]
}

export interface RichTextBlock {
  title: string
  content: string // Stored as markdown
  order: number
}

export interface DeliverableItem {
  id: string
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'delivered'
  dueDate?: string
  attachedMediaIds?: string[]
}

export interface PricingSection {
  lineItems: PricingLineItem[]
  subtotal: number
  tax?: number
  discount?: number
  total: number
  currency: string
  notes?: string
}

export interface PricingLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface TimelineItem {
  id: string
  phase: string
  description: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'completed'
}

export interface CustomSection {
  id: string
  title: string
  content: string // Markdown
  order: number
  type: 'text' | 'media-gallery' | 'checklist'
}

export interface ProjectSettings extends GallerySettings {
  allowComments: boolean
  allowApproval: boolean
  showPricing: boolean
  showTimeline: boolean
  brandColor?: string
  logoUrl?: string
  companyName?: string
}

export interface StatusChange {
  status: ProposalStatus
  changedAt: Date
  changedBy: string // 'admin' or client email
  note?: string
}

export interface ClientSession {
  _id?: string
  sessionId: string
  projectId: string
  clientEmail: string
  token: string
  createdAt: Date
  expiresAt: Date
  ipAddress: string
}
