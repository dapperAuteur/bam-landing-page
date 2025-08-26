export interface EducationFormData {
  name: string
  email: string
  country: string
  state: string
  schoolName: string
  schoolDistrict: string
  city: string
  gradesTeaching: string[] // ["K", "1", "2", "3", "4", "5"]
  customCreationRequest: boolean
  formType: string // "corvids-education", "bobcats-education", etc.
  submittedAt: Date
  status: 'new' | 'reviewed' | 'responded' | 'closed'
}

export interface EducationFormResponse {
  success: boolean
  message: string
  id?: string
  error?: string
  errors?: {
    name?: string
    email?: string
    country?: string
    state?: string
    schoolName?: string
    schoolDistrict?: string
    city?: string
    gradesTeaching?: string
  }
}

export interface EducationSubmission extends EducationFormData {
  _id?: string
  submittedAt: Date
  ipAddress?: string
  userAgent?: string
}