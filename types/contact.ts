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
  errors?: {
    name?: string
    email?: string
    serviceType?: string
    projectDetails?: string
  }
}

export interface ContactSubmission extends ContactFormData {
  _id?: string
  submittedAt: Date
  ipAddress?: string
  userAgent?: string
}