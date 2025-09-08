// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, Db } from 'mongodb'
import { ContactFormData, ContactFormResponse, ContactSubmission } from '../../../types/contact'
import { 
  logContactEvent, 
  checkForSpam, 
  checkRateLimit, 
  ContactEventType 
} from '../../../lib/logging/contact-logger'
import { Logger, LogContext, LogLevel } from './../../../lib/logging/logger'
import { getClientIp } from '@/lib/utils/client'

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

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Form validation function
function validateFormData(data: ContactFormData): { isValid: boolean; errors: any } {
  const errors: any = {}

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  }
  if (data.name && data.name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters'
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  // Service type validation
  const allowedServiceTypes = [
    'Voiceover Services',
    'AI Consulting', 
    'Business Consulting',
    'Sports Photography',
    'Photography',
    'Content Creation',
    'Combination Project'
  ]
  if (!data.serviceType || !allowedServiceTypes.includes(data.serviceType)) {
    errors.serviceType = 'Please select a valid service type'
  }

  // Project details validation
  if (!data.projectDetails || data.projectDetails.trim().length < 10) {
    errors.projectDetails = 'Project details must be at least 10 characters long'
  }
  if (data.projectDetails && data.projectDetails.trim().length > 2000) {
    errors.projectDetails = 'Project details cannot exceed 2000 characters'
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

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ipAddress = getClientIp(request)
  
  try {
    // Log the initial request
    await Logger.info(LogContext.SYSTEM, "Contact form submission started", {
      request,
      metadata: { ipAddress }
    })

    // Parse request body
    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      await logContactEvent({
        request,
        event: ContactEventType.FORM_FAILURE,
        status: "failure",
        reason: "Invalid JSON in request body",
        metadata: { parseError: String(parseError) }
      })

      return NextResponse.json({
        success: false,
        message: 'Invalid request format. Please try again.'
      } as ContactFormResponse, { status: 400 })
    }
    
    // Extract and sanitize form data
    const formData: ContactFormData = {
      name: sanitizeInput(body.name || ''),
      email: sanitizeInput(body.email || '').toLowerCase(),
      serviceType: body.serviceType || '',
      projectDetails: sanitizeInput(body.projectDetails || ''),
      submittedAt: new Date(), // Initialize with a Date object
      status: 'closed'
    }

    // Check rate limiting first
    const rateLimitCheck = await checkRateLimit(ipAddress, formData.email)
    if (rateLimitCheck.isLimited) {
      await logContactEvent({
        request,
        event: ContactEventType.RATE_LIMIT_EXCEEDED,
        email: formData.email,
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
      } as ContactFormResponse, { status: 429 })
    }

    // Validate form data
    const validation = validateFormData(formData)
    if (!validation.isValid) {
      await logContactEvent({
        request,
        event: ContactEventType.FORM_VALIDATION_ERROR,
        email: formData.email,
        serviceType: formData.serviceType,
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
      } as ContactFormResponse, { status: 400 })
    }

    // Check for spam
    const spamCheck = await checkForSpam(formData, ipAddress)
    if (spamCheck.isSpam) {
      await logContactEvent({
        request,
        event: ContactEventType.SPAM_DETECTED,
        email: formData.email,
        serviceType: formData.serviceType,
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
        message: 'Thank you for your inquiry! I\'ll get back to you within 24 hours.'
      } as ContactFormResponse)
    }

    // Connect to database
    const database = await connectToDatabase()
    const collection = database.collection<ContactSubmission>('contact_submissions')

    // Prepare submission data
    const submission: ContactSubmission = {
      ...formData,
      submittedAt: new Date(),
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    // Insert into database
    const result = await collection.insertOne(submission)

    if (result.insertedId) {
      // Log successful submission
      await logContactEvent({
        request,
        event: ContactEventType.FORM_SUCCESS,
        email: formData.email,
        serviceType: formData.serviceType,
        status: "success",
        formData,
        metadata: { 
          submissionId: result.insertedId.toString(),
          durationMs: Date.now() - startTime,
          projectDetailsLength: formData.projectDetails.length
        }
      })

      await Logger.info(LogContext.SYSTEM, `New contact submission: ${result.insertedId}`, {
        request,
        metadata: {
          email: formData.email,
          serviceType: formData.serviceType,
          submissionId: result.insertedId.toString()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Thank you for your inquiry! I\'ll get back to you within 24 hours.'
      } as ContactFormResponse)
    } else {
      throw new Error('Failed to save submission to database')
    }

  } catch (error) {
    // Log the error
    await Logger.error(LogContext.SYSTEM, 'Contact form error', {
      request,
      metadata: { 
        error: String(error),
        durationMs: Date.now() - startTime
      }
    })

    await logContactEvent({
      request,
      event: ContactEventType.FORM_FAILURE,
      status: "failure",
      reason: "Server error",
      metadata: { 
        error: String(error),
        durationMs: Date.now() - startTime
      }
    })
    
    // Handle different types of errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid form data. Please try again.'
      } as ContactFormResponse, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Sorry, there was a server error. Please try again later or email me directly at contact@brandanthonymcdonald.com'
    } as ContactFormResponse, { status: 500 })
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