// src/app/api/education/route.ts - Updated to handle all form types

import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, Db } from 'mongodb'
import { 
  EducationFormData, 
  EducationFormResponse, 
  EducationSubmission,
  CorvidEducationFormData,
  LearnWitUSV1FormData,
  LearnWitUSV2FormData
} from '../../../types/education'
import { 
  logEducationEvent, 
  checkForEducationSpam, 
  checkEducationRateLimit, 
  EducationEventType 
} from '../../../lib/logging/education-logger'
import { Logger, LogContext } from './../../../lib/logging/logger'
import { getClientIp } from '../../../lib/utils/utils'

// MongoDB connection
let client: MongoClient
let db: Db

async function connectToDatabase() {
  if (!client) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }
    
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('bam_portfolio')
  }
  return db
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Enhanced form validation for all form types
function validateFormData(data: EducationFormData): { isValid: boolean; errors: any } {
  const errors: any = {}

  // Common validation for all forms
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  }
  if (data.name && data.name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters'
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  // Form-specific validation
  switch (data.formType) {
    case 'corvids-education':
      const corvidData = data as CorvidEducationFormData
      if (!corvidData.schoolName || corvidData.schoolName.trim().length < 2) {
        errors.schoolName = 'School name is required'
      }
      if (!corvidData.schoolDistrict || corvidData.schoolDistrict.trim().length < 2) {
        errors.schoolDistrict = 'School district is required'
      }
      if (!corvidData.city || corvidData.city.trim().length < 2) {
        errors.city = 'City is required'
      }
      if (!corvidData.state || corvidData.state.trim().length < 2) {
        errors.state = 'State is required'
      }
      if (!corvidData.country || corvidData.country.trim().length < 2) {
        errors.country = 'Country is required'
      }
      if (!corvidData.gradesTeaching || corvidData.gradesTeaching.length === 0) {
        errors.gradesTeaching = 'Please select at least one grade level'
      }
      break

    case 'learn-witus-v1':
      const v1Data = data as LearnWitUSV1FormData
      if (!v1Data.schoolName || v1Data.schoolName.trim().length < 2) {
        errors.schoolName = 'School name is required'
      }
      if (v1Data.roleInEducation && v1Data.roleInEducation.length === 0) {
        errors.roleInEducation = 'Please select at least one role'
      }
      break

    case 'learn-witus-v2':
      const v2Data = data as LearnWitUSV2FormData
      if (!v2Data.organization || v2Data.organization.trim().length < 2) {
        errors.organization = 'Organization is required'
      }
      if (!v2Data.primaryInterest || v2Data.primaryInterest.trim().length === 0) {
        errors.primaryInterest = 'Please select your primary interest'
      }
      break
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sanitize user input
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    throw new Error('RECAPTCHA_SECRET_KEY not configured')
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`
  })

  const result = await response.json()
  return {
    success: result.success,
    score: result.score
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ipAddress = getClientIp(request)
  
  try {
    await Logger.info(LogContext.SYSTEM, "Education form submission started", {
      request,
      metadata: { ipAddress }
    })

    // Parse request body
    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      await logEducationEvent({
        request,
        event: EducationEventType.FORM_FAILURE,
        status: "failure",
        reason: "Invalid JSON in request body",
        metadata: { parseError: String(parseError) }
      })

      return NextResponse.json({
        success: false,
        message: 'Invalid request format. Please try again.'
      } as EducationFormResponse, { status: 400 })
    }
    
    // Verify reCAPTCHA first (if token provided)
    const { token, ...formFields } = body
    if (token) {
      const recaptchaResult = await verifyRecaptcha(token)
      if (!recaptchaResult.success || (recaptchaResult.score && recaptchaResult.score < 0.5)) {
        await logEducationEvent({
          request,
          event: EducationEventType.SPAM_DETECTED,
          status: "spam",
          reason: "reCAPTCHA verification failed",
          metadata: { 
            recaptchaScore: recaptchaResult.score,
            durationMs: Date.now() - startTime
          }
        })

        return NextResponse.json({
          success: false,
          message: 'Security verification failed. Please try again.'
        } as EducationFormResponse, { status: 403 })
      }
    }
    
    // Extract and sanitize form data based on form type
    const formType = sanitizeInput(formFields.formType || 'corvids-education')
    let formData: EducationFormData

    switch (formType) {
      case 'corvids-education':
        formData = {
          name: sanitizeInput(formFields.name || ''),
          email: sanitizeInput(formFields.email || '').toLowerCase(),
          country: sanitizeInput(formFields.country || ''),
          state: sanitizeInput(formFields.state || ''),
          city: sanitizeInput(formFields.city || ''),
          schoolName: sanitizeInput(formFields.schoolName || ''),
          schoolDistrict: sanitizeInput(formFields.schoolDistrict || ''),
          gradesTeaching: Array.isArray(formFields.gradesTeaching) ? formFields.gradesTeaching : [],
          customCreationRequest: Boolean(formFields.customCreationRequest),
          formType: 'corvids-education'
        } as CorvidEducationFormData
        break

      case 'learn-witus-v1':
        formData = {
          name: sanitizeInput(formFields.name || ''),
          email: sanitizeInput(formFields.email || '').toLowerCase(),
          phone: formFields.phone ? sanitizeInput(formFields.phone) : undefined,
          country: formFields.country ? sanitizeInput(formFields.country) : undefined,
          state: formFields.state ? sanitizeInput(formFields.state) : undefined,
          city: formFields.city ? sanitizeInput(formFields.city) : undefined,
          schoolName: formFields.schoolName ? sanitizeInput(formFields.schoolName) : undefined,
          schoolDistrict: formFields.schoolDistrict ? sanitizeInput(formFields.schoolDistrict) : undefined,
          roleInEducation: Array.isArray(formFields.roleInEducation) ? formFields.roleInEducation : [],
          gradesWorking: Array.isArray(formFields.gradesWorking) ? formFields.gradesWorking : [],
          subjectInterests: Array.isArray(formFields.subjectInterests) ? formFields.subjectInterests : [],
          topicInterests: Array.isArray(formFields.topicInterests) ? formFields.topicInterests : [],
          customContentInterest: Boolean(formFields.customContentInterest),
          howDidYouHear: formFields.howDidYouHear ? sanitizeInput(formFields.howDidYouHear) : undefined,
          additionalQuestions: formFields.additionalQuestions ? sanitizeInput(formFields.additionalQuestions) : undefined,
          formType: 'learn-witus-v1'
        } as LearnWitUSV1FormData
        break

      case 'learn-witus-v2':
        formData = {
          name: sanitizeInput(formFields.name || ''),
          email: sanitizeInput(formFields.email || '').toLowerCase(),
          phone: formFields.phone ? sanitizeInput(formFields.phone) : undefined,
          organization: sanitizeInput(formFields.organization || ''),
          position: formFields.position ? sanitizeInput(formFields.position) : undefined,
          location: formFields.location ? sanitizeInput(formFields.location) : undefined,
          roleInEducation: Array.isArray(formFields.roleInEducation) ? formFields.roleInEducation : [],
          gradesWorking: Array.isArray(formFields.gradesWorking) ? formFields.gradesWorking : [],
          subjectInterests: Array.isArray(formFields.subjectInterests) ? formFields.subjectInterests : [],
          topicInterests: Array.isArray(formFields.topicInterests) ? formFields.topicInterests : [],
          primaryInterest: sanitizeInput(formFields.primaryInterest || ''),
          timeline: formFields.timeline ? sanitizeInput(formFields.timeline) : undefined,
          customContentInterest: Boolean(formFields.customContentInterest),
          mediaInquiry: Boolean(formFields.mediaInquiry),
          additionalQuestions: formFields.additionalQuestions ? sanitizeInput(formFields.additionalQuestions) : undefined,
          formType: 'learn-witus-v2'
        } as LearnWitUSV2FormData
        break

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid form type specified.'
        } as EducationFormResponse, { status: 400 })
    }

    // Check rate limiting
    const rateLimitCheck = await checkEducationRateLimit(ipAddress, formData.email)
    if (rateLimitCheck.isLimited) {
      await logEducationEvent({
        request,
        event: EducationEventType.RATE_LIMIT_EXCEEDED,
        email: formData.email,
        formType: formData.formType,
        status: "failure",
        reason: rateLimitCheck.reason,
        formData,
        metadata: { 
          nextAllowedTime: rateLimitCheck.nextAllowedTime,
          durationMs: Date.now() - startTime
        }
      })

      return NextResponse.json({
        success: false,
        message: 'Too many submissions. Please try again later.'
      } as EducationFormResponse, { status: 429 })
    }

    // Validate form data
    const validation = validateFormData(formData)
    if (!validation.isValid) {
      await logEducationEvent({
        request,
        event: EducationEventType.FORM_VALIDATION_ERROR,
        email: formData.email,
        formType: formData.formType,
        status: "failure",
        reason: "Form validation failed",
        formData,
        metadata: { 
          validationErrors: validation.errors,
          durationMs: Date.now() - startTime
        }
      })

      return NextResponse.json({
        success: false,
        message: 'Please check the form for errors and try again.',
        errors: validation.errors
      } as EducationFormResponse, { status: 400 })
    }

    // Check for spam
    const spamCheck = await checkForEducationSpam(formData, ipAddress)
    if (spamCheck.isSpam) {
      await logEducationEvent({
        request,
        event: EducationEventType.SPAM_DETECTED,
        email: formData.email,
        formType: formData.formType,
        status: "spam",
        reason: spamCheck.reason,
        formData,
        metadata: { 
          spamConfidence: spamCheck.confidence,
          durationMs: Date.now() - startTime
        }
      })

      // Return success to user (don't reveal spam detection)
      return NextResponse.json({
        success: true,
        message: 'Thank you for your interest! Please check your email for more information.'
      } as EducationFormResponse)
    }

    // Connect to database
    const database = await connectToDatabase()
    const collection = database.collection<EducationSubmission>('education_submissions')

    // Prepare submission data for database
    const submission: EducationSubmission = {
      ...formData,
      submittedAt: new Date(),
      status: 'new',
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    // Insert into database
    const result = await collection.insertOne(submission)

    if (result.insertedId) {
      // Log successful submission
      await logEducationEvent({
        request,
        event: EducationEventType.FORM_SUCCESS,
        email: formData.email,
        formType: formData.formType,
        status: "success",
        formData,
        metadata: { 
          submissionId: result.insertedId.toString(),
          durationMs: Date.now() - startTime
        }
      })

      await Logger.info(LogContext.SYSTEM, `New education submission: ${result.insertedId}`, {
        request,
        metadata: {
          email: formData.email,
          formType: formData.formType,
          submissionId: result.insertedId.toString()
        }
      })

      // Custom success messages based on form type
      let successMessage = 'Thank you for your interest! We\'ll be in touch soon.'
      
      switch (formData.formType) {
        case 'corvids-education':
          successMessage = 'Thank you for your interest! Redirecting to download page...'
          break
        case 'learn-witus-v1':
          successMessage = 'Thank you! We\'ll be in touch with access information soon.'
          break
        case 'learn-witus-v2':
          successMessage = 'Thank you! We\'ll connect with you soon with more information.'
          break
      }

      return NextResponse.json({
        success: true,
        message: successMessage,
        id: result.insertedId.toString()
      } as EducationFormResponse)
    } else {
      throw new Error('Failed to save submission to database')
    }

  } catch (error) {
    // Log the error
    await Logger.error(LogContext.SYSTEM, 'Education form error', {
      request,
      metadata: { 
        error: String(error),
        durationMs: Date.now() - startTime
      }
    })

    await logEducationEvent({
      request,
      event: EducationEventType.FORM_FAILURE,
      status: "failure",
      reason: "Server error",
      metadata: { 
        error: String(error),
        durationMs: Date.now() - startTime
      }
    })
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid form data. Please try again.'
      } as EducationFormResponse, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Sorry, there was a server error. Please try again later.'
    } as EducationFormResponse, { status: 500 })
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}