// app/api/workout-feedback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, Db } from 'mongodb'
import { WorkoutFeedbackFormData, WorkoutFeedbackResponse, WorkoutFeedbackSubmission } from '../../../types/workout-feedback'
import { logWorkoutFeedbackEvent, checkWorkoutFeedbackRateLimit } from '../../../lib/logging/workout-feedback-logger'
import { getClientIp } from '@/lib/utils/client'

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

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

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
  return { success: result.success, score: result.score }
}

const VALID_CATEGORIES = ['AM', 'PM', 'WORKOUT', 'friction'] as const
const VALID_DURATIONS: Record<string, string[]> = {
  AM: ['5', '15', '30'],
  PM: ['5', '15', '30'],
  WORKOUT: ['5', '15', '45']
}
const VALID_MOOD_RATINGS = [1, 2, 3, 4, 5]
const VALID_DIFFICULTIES = ['easier', 'just-right', 'harder']
const VALID_INSTRUCTION_PREFS = ['text-is-fine', 'need-images', 'need-video']

function validateFormData(data: WorkoutFeedbackFormData): { isValid: boolean; errors: Partial<Record<keyof WorkoutFeedbackFormData, string>> } {
  const errors: Partial<Record<keyof WorkoutFeedbackFormData, string>> = {}

  // Activity validation
  if (!data.activity || !VALID_CATEGORIES.includes(data.activity.category as typeof VALID_CATEGORIES[number])) {
    errors.activity = 'Please select a valid activity category'
  } else if (data.activity.category === 'friction') {
    if (data.activity.frictionScenarioIndex === undefined || data.activity.frictionScenarioIndex < 0 || data.activity.frictionScenarioIndex > 3) {
      errors.activity = 'Please select which scenario you followed'
    }
  } else {
    const validDurations = VALID_DURATIONS[data.activity.category]
    if (!data.activity.duration || !validDurations?.includes(data.activity.duration)) {
      errors.activity = 'Please select which duration you completed'
    }
  }

  // Mood validation
  if (!data.moodBefore || !VALID_MOOD_RATINGS.includes(data.moodBefore)) {
    errors.moodBefore = 'Please rate how you felt before'
  }
  if (!data.moodAfter || !VALID_MOOD_RATINGS.includes(data.moodAfter)) {
    errors.moodAfter = 'Please rate how you felt after'
  }

  // Difficulty validation
  if (!data.difficulty || !VALID_DIFFICULTIES.includes(data.difficulty)) {
    errors.difficulty = 'Please select a difficulty preference'
  }

  // Instruction preference validation
  if (!data.instructionPreference || !VALID_INSTRUCTION_PREFS.includes(data.instructionPreference)) {
    errors.instructionPreference = 'Please select your instruction format preference'
  }

  // Optional feedback length check
  if (data.feedback && data.feedback.length > 1000) {
    errors.feedback = 'Feedback cannot exceed 1000 characters'
  }

  // Optional email validation
  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export async function POST(request: NextRequest) {
  const ipAddress = getClientIp(request)

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      await logWorkoutFeedbackEvent({
        event: 'workout_feedback_failure',
        status: 'failure',
        reason: 'Invalid JSON in request body',
        ipAddress
      })

      return NextResponse.json({
        success: false,
        message: 'Invalid request format. Please try again.'
      } as WorkoutFeedbackResponse, { status: 400 })
    }

    // Check rate limiting
    const rateLimitCheck = await checkWorkoutFeedbackRateLimit(ipAddress)
    if (rateLimitCheck.isLimited) {
      await logWorkoutFeedbackEvent({
        event: 'workout_feedback_rate_limit',
        status: 'failure',
        reason: rateLimitCheck.reason,
        ipAddress
      })

      return NextResponse.json({
        success: false,
        message: 'Too many submissions. Please try again later.'
      } as WorkoutFeedbackResponse, { status: 429 })
    }

    // Verify reCAPTCHA
    const { token, ...formFields } = body
    if (token) {
      const recaptchaResult = await verifyRecaptcha(token)
      if (!recaptchaResult.success || (recaptchaResult.score && recaptchaResult.score < 0.5)) {
        await logWorkoutFeedbackEvent({
          event: 'workout_feedback_failure',
          status: 'failure',
          reason: 'reCAPTCHA verification failed',
          ipAddress,
          metadata: { recaptchaScore: recaptchaResult.score }
        })

        return NextResponse.json({
          success: true,
          message: 'Thank you for your feedback! It helps us make these protocols better.'
        } as WorkoutFeedbackResponse)
      }
    }

    // Build form data
    const formData: WorkoutFeedbackFormData = {
      activity: {
        category: formFields.activity?.category || '',
        duration: formFields.activity?.duration || null,
        frictionScenarioIndex: formFields.activity?.frictionScenarioIndex
      },
      moodBefore: formFields.moodBefore,
      moodAfter: formFields.moodAfter,
      difficulty: formFields.difficulty || '',
      instructionPreference: formFields.instructionPreference || '',
      feedback: formFields.feedback ? sanitizeInput(formFields.feedback) : undefined,
      email: formFields.email ? sanitizeInput(formFields.email).toLowerCase() : undefined,
      protocolVersion: formFields.protocolVersion || 'unknown'
    }

    // Validate
    const validation = validateFormData(formData)
    if (!validation.isValid) {
      await logWorkoutFeedbackEvent({
        event: 'workout_feedback_validation_error',
        status: 'failure',
        reason: 'Form validation failed',
        email: formData.email,
        ipAddress,
        metadata: { validationErrors: validation.errors }
      })

      return NextResponse.json({
        success: false,
        message: 'Please check the form for errors and try again.',
        errors: validation.errors
      } as WorkoutFeedbackResponse, { status: 400 })
    }

    // Connect and insert
    const database = await connectToDatabase()
    const collection = database.collection<WorkoutFeedbackSubmission>('workout_feedback_submissions')

    const submission: WorkoutFeedbackSubmission = {
      ...formData,
      submittedAt: new Date(),
      status: 'new',
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    const result = await collection.insertOne(submission)

    if (result.insertedId) {
      await logWorkoutFeedbackEvent({
        event: 'workout_feedback_success',
        status: 'success',
        email: formData.email,
        ipAddress,
        metadata: {
          submissionId: result.insertedId.toString(),
          category: formData.activity.category,
          duration: formData.activity.duration
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Thank you for your feedback! It helps us make these protocols better.'
      } as WorkoutFeedbackResponse)
    } else {
      throw new Error('Failed to save submission to database')
    }

  } catch (error) {
    await logWorkoutFeedbackEvent({
      event: 'workout_feedback_failure',
      status: 'failure',
      reason: 'Server error',
      ipAddress,
      metadata: { error: String(error) }
    })

    return NextResponse.json({
      success: false,
      message: 'Sorry, there was a server error. Please try again later.'
    } as WorkoutFeedbackResponse, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
