export interface ContactFormData {
  name: string
  email: string
  serviceType: string
  projectDetails: string
  submittedAt: Date
  status: 'new' | 'reviewed' | 'responded' | 'closed'
  ipAddress?: string
  userAgent?: string
}

export interface ContactFormResponse {
  success: boolean
  message: string
  id?: string
  error?: string
}