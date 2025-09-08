// src/types/education.ts - Refactored to support multiple form types

// Base interface with common fields
export interface BaseEducationFormData {
  name: string
  email: string
  formType: string
  customCreationRequest?: boolean
}

// Original Corvids form interface (backward compatible)
export interface CorvidEducationFormData extends BaseEducationFormData {
  country: string
  state: string
  city: string
  schoolName: string
  schoolDistrict: string
  gradesTeaching: string[] // ["K", "1st", "2nd", "3rd", "4th", "5th"]
  formType: 'corvids-education'
}

// Learn.WitUS.Online Version 1 form (educator focus)
export interface LearnWitUSV1FormData extends BaseEducationFormData {
  phone?: string
  country?: string
  state?: string
  city?: string
  schoolName?: string
  schoolDistrict?: string
  roleInEducation: string[]
  gradesWorking: string[]
  subjectInterests: string[]
  topicInterests: string[]
  customContentInterest: boolean
  howDidYouHear?: string
  additionalQuestions?: string
  formType: 'learn-witus-v1'
}

// Learn.WitUS.Online Version 2 form (media/stakeholder focus)
export interface LearnWitUSV2FormData extends BaseEducationFormData {
  phone?: string
  organization: string
  position?: string
  location?: string
  country?: string
  state?: string
  city?: string
  schoolName?: string
  schoolDistrict?: string
  roleInEducation: string[]
  gradesWorking: string[]
  subjectInterests: string[]
  topicInterests: string[]
  primaryInterest: string
  timeline?: string
  customContentInterest: boolean
  mediaInquiry: boolean
  additionalQuestions?: string
  formType: 'learn-witus-v2'
}

// Union type for all education forms
export type EducationFormData = CorvidEducationFormData | LearnWitUSV1FormData | LearnWitUSV2FormData

// Enhanced submission interface that accommodates all form types
export interface EducationSubmission {
  _id?: string
  name: string
  email: string
  phone?: string
  organization?: string
  position?: string
  location?: string
  country?: string
  state?: string
  city?: string
  schoolName?: string
  schoolDistrict?: string
  roleInEducation?: string[]
  gradesTeaching?: string[] // For corvids backward compatibility
  gradesWorking?: string[]
  subjectInterests?: string[]
  topicInterests?: string[]
  primaryInterest?: string
  timeline?: string
  customCreationRequest?: boolean
  customContentInterest?: boolean
  mediaInquiry?: boolean
  howDidYouHear?: string
  additionalQuestions?: string
  formType: string
  submittedAt: Date
  status: 'new' | 'reviewed' | 'responded' | 'closed'
  ipAddress?: string
  userAgent?: string
}

// Enhanced response interface with better error handling
export interface EducationFormResponse {
  success: boolean
  message: string
  id?: string
  error?: string
  errors?: {
    name?: string
    email?: string
    phone?: string
    organization?: string
    position?: string
    country?: string
    state?: string
    city?: string
    schoolName?: string
    schoolDistrict?: string
    roleInEducation?: string
    gradesTeaching?: string
    gradesWorking?: string
    subjectInterests?: string
    topicInterests?: string
    primaryInterest?: string
    customContentInterest?: string
    [key: string]: string | undefined // Allow for additional error fields
  }
}

// Type guards for form identification
export function isCorvidEducationForm(data: EducationFormData): data is CorvidEducationFormData {
  return data.formType === 'corvids-education'
}

export function isLearnWitUSV1Form(data: EducationFormData): data is LearnWitUSV1FormData {
  return data.formType === 'learn-witus-v1'
}

export function isLearnWitUSV2Form(data: EducationFormData): data is LearnWitUSV2FormData {
  return data.formType === 'learn-witus-v2'
}

// Helper function to get form display name
export function getFormDisplayName(formType: string): string {
  switch (formType) {
    case 'corvids-education':
      return 'Corvids Educational Series'
    case 'learn-witus-v1':
      return 'Learn.WitUS.Online (Educator)'
    case 'learn-witus-v2':
      return 'Learn.WitUS.Online (Media/Partnership)'
    default:
      return 'Educational Content Request'
  }
}

// Helper function to get required fields by form type
export function getRequiredFields(formType: string): string[] {
  const baseRequired = ['name', 'email']
  
  switch (formType) {
    case 'corvids-education':
      return [...baseRequired, 'country', 'state', 'city', 'schoolName', 'schoolDistrict', 'gradesTeaching']
    case 'learn-witus-v1':
      return [...baseRequired, 'schoolName']
    case 'learn-witus-v2':
      return [...baseRequired, 'organization', 'primaryInterest']
    default:
      return baseRequired
  }
}