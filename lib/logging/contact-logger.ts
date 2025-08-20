/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import clientPromise from "./../db/mongodb";
import { getClientIp } from "./../utils/utils";
import { ContactFormData } from "./../../types/contact";

// Since you already have a logger.ts file, we'll create a simplified version
// You can integrate this with your existing Logger class later

export enum ContactEventType {
  FORM_SUBMISSION = "contact_form_submission",
  FORM_VALIDATION_ERROR = "contact_form_validation_error",
  FORM_SUCCESS = "contact_form_success",
  FORM_FAILURE = "contact_form_failure",
  SPAM_DETECTED = "contact_spam_detected",
  RATE_LIMIT_EXCEEDED = "contact_rate_limit_exceeded"
}

export interface SanitizedContactFormData {
  name?: string;
  email?: string;
  serviceType?: string;
  projectDetailsLength?: number;
}

export interface ContactLog {
  _id?: string;
  event: ContactEventType;
  email?: string;
  serviceType?: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failure" | "spam";
  reason?: string;
  formData?: SanitizedContactFormData;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Simple logging function that logs to console and MongoDB
 * You can integrate this with your existing Logger class
 */
async function logToMongoDB(logEntry: ContactLog): Promise<string> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const contactLogsCollection = db.collection<ContactLog>("contact_logs");
    const result = await contactLogsCollection.insertOne(logEntry);
    return result.insertedId.toString();
  } catch (error) {
    console.error("Failed to log to MongoDB:", error);
    return "logging-failed";
  }
}

/**
 * Log a contact form event to the database
 */
export async function logContactEvent({
  request,
  event,
  email = undefined,
  serviceType = undefined,
  status,
  reason = undefined,
  formData = undefined,
  metadata = {},
}: {
  request: NextRequest;
  event: ContactEventType;
  email?: string;
  serviceType?: string;
  status: "success" | "failure" | "spam";
  reason?: string;
  formData?: Partial<ContactFormData>;
  metadata?: Record<string, any>;
}): Promise<string> {
  try {
    const message = `Contact event: ${event}, status: ${status}${reason ? `, reason: ${reason}` : ''}`;
    
    // Log to console for now - you can integrate with your Logger class
    console.log(`[CONTACT] ${message}`, {
      email,
      serviceType,
      reason,
      event,
      status,
      metadata
    });

    // Store in contact-specific collection
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    const logEntry: ContactLog = {
      event,
      email,
      serviceType,
      ipAddress,
      userAgent,
      status,
      reason,
      formData: formData ? {
        name: formData.name,
        email: formData.email,
        serviceType: formData.serviceType,
        // Don't store full project details for privacy
        projectDetailsLength: formData.projectDetails?.length
      } : undefined,
      metadata,
      timestamp: new Date(),
    };
    
    return await logToMongoDB(logEntry);
  } catch (error) {
    console.error("Failed to log contact event:", error);
    return "logging-failed";
  }
}

/**
 * Check for spam patterns in contact form submissions
 */
export async function checkForSpam(
  formData: ContactFormData,
  ipAddress: string
): Promise<{ isSpam: boolean; reason?: string; confidence: number }> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const contactLogsCollection = db.collection<ContactLog>("contact_logs");
    
    // Look back 24 hours
    const lookbackTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    let spamScore = 0;
    const reasons: string[] = [];

    // Check submission frequency from same IP
    const submissionsFromIp = await contactLogsCollection.countDocuments({
      ipAddress,
      timestamp: { $gte: lookbackTime },
    });
    
    if (submissionsFromIp >= 5) {
      spamScore += 0.4;
      reasons.push(`${submissionsFromIp} submissions from same IP in 24h`);
    }

    // Check for duplicate content
    const duplicateContent = await contactLogsCollection.countDocuments({
      "formData.projectDetailsLength": formData.projectDetails.length,
      email: formData.email,
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // 7 days
    });
    
    if (duplicateContent >= 2) {
      spamScore += 0.3;
      reasons.push("Duplicate content detected");
    }

    // Check for suspicious patterns in text
    const suspiciousPatterns = [
      /crypto|bitcoin|investment|loan|money/gi,
      /seo|backlink|rank|google/gi,
      /urgent|immediate|act now|limited time/gi,
      /http|www\.|\.com|\.net/gi
    ];

    const textToCheck = `${formData.name} ${formData.projectDetails}`.toLowerCase();
    const patternMatches = suspiciousPatterns.filter(pattern => pattern.test(textToCheck));
    
    if (patternMatches.length >= 2) {
      spamScore += 0.3;
      reasons.push("Multiple suspicious patterns detected");
    }

    // Check email domain reputation (basic check)
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'throwaway'];
    
    if (suspiciousDomains.some(domain => emailDomain?.includes(domain))) {
      spamScore += 0.4;
      reasons.push("Temporary email domain detected");
    }

    // Very short project details
    if (formData.projectDetails.length < 20) {
      spamScore += 0.2;
      reasons.push("Very brief project description");
    }

    return {
      isSpam: spamScore >= 0.6,
      reason: reasons.length > 0 ? reasons.join('; ') : undefined,
      confidence: Math.min(spamScore, 1.0)
    };
  } catch (error) {
    console.error("Failed to check for spam:", error);
    return { isSpam: false, confidence: 0 };
  }
}

/**
 * Check rate limiting for contact form submissions
 */
export async function checkRateLimit(
  ipAddress: string,
  email?: string
): Promise<{ isLimited: boolean; reason?: string; nextAllowedTime?: Date }> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const contactLogsCollection = db.collection<ContactLog>("contact_logs");
    
    // Rate limits
    const hourLimit = 3; // 3 per hour per IP
    const dayLimit = 10; // 10 per day per IP
    const emailDayLimit = 5; // 5 per day per email
    
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Check hourly limit by IP
    const hourlySubmissions = await contactLogsCollection.countDocuments({
      ipAddress,
      timestamp: { $gte: oneHourAgo },
      status: { $ne: "spam" } // Don't count spam in rate limits
    });
    
    if (hourlySubmissions >= hourLimit) {
      return {
        isLimited: true,
        reason: `Exceeded hourly limit of ${hourLimit} submissions`,
        nextAllowedTime: new Date(oneHourAgo.getTime() + 60 * 60 * 1000)
      };
    }

    // Check daily limit by IP
    const dailySubmissions = await contactLogsCollection.countDocuments({
      ipAddress,
      timestamp: { $gte: oneDayAgo },
      status: { $ne: "spam" }
    });
    
    if (dailySubmissions >= dayLimit) {
      return {
        isLimited: true,
        reason: `Exceeded daily limit of ${dayLimit} submissions`,
        nextAllowedTime: new Date(oneDayAgo.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    // Check daily limit by email
    if (email) {
      const emailDailySubmissions = await contactLogsCollection.countDocuments({
        email,
        timestamp: { $gte: oneDayAgo },
        status: { $ne: "spam" }
      });
      
      if (emailDailySubmissions >= emailDayLimit) {
        return {
          isLimited: true,
          reason: `Exceeded daily limit of ${emailDayLimit} submissions per email`,
          nextAllowedTime: new Date(oneDayAgo.getTime() + 24 * 60 * 60 * 1000)
        };
      }
    }

    return { isLimited: false };
  } catch (error) {
    console.error("Failed to check rate limit:", error);
    return { isLimited: false };
  }
}

/**
 * Get recent contact submissions for monitoring
 */
export async function getRecentContactSubmissions(limit: number = 50): Promise<ContactLog[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const contactLogsCollection = db.collection<ContactLog>("contact_logs");
    
    const logs = await contactLogsCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return logs;
  } catch (error) {
    console.error("Failed to get recent contact submissions:", error);
    return [];
  }
}

interface ServiceTypeAggregationResult {
  _id: string | null;
  count: number;
}

interface SubmissionsByDayAggregationResult {
  _id: string;
  count: number;
}

/**
 * Get contact submission statistics
 */
export async function getContactStats(days: number = 30): Promise<{
  totalSubmissions: number;
  successfulSubmissions: number;
  spamSubmissions: number;
  failedSubmissions: number;
  topServiceTypes: Array<{ serviceType: string; count: number }>;
  submissionsByDay: Array<{ date: string; count: number }>;
}> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const contactLogsCollection = db.collection<ContactLog>("contact_logs");
    
    const lookbackTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Get basic counts
    const [totalSubmissions, successfulSubmissions, spamSubmissions, failedSubmissions] = await Promise.all([
      contactLogsCollection.countDocuments({ timestamp: { $gte: lookbackTime } }),
      contactLogsCollection.countDocuments({ timestamp: { $gte: lookbackTime }, status: "success" }),
      contactLogsCollection.countDocuments({ timestamp: { $gte: lookbackTime }, status: "spam" }),
      contactLogsCollection.countDocuments({ timestamp: { $gte: lookbackTime }, status: "failure" })
    ]);

    // Get top service types
    const serviceTypeAggregation = await contactLogsCollection.aggregate<ServiceTypeAggregationResult>([
      { $match: { timestamp: { $gte: lookbackTime }, status: "success" } },
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    const topServiceTypes = serviceTypeAggregation.map((item) => ({
      serviceType: item._id || "Unknown",
      count: item.count
    }));

    // Get submissions by day
    const submissionsByDayAggregation = await contactLogsCollection.aggregate<SubmissionsByDayAggregationResult>([
      { $match: { timestamp: { $gte: lookbackTime } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const submissionsByDay = submissionsByDayAggregation.map((item) => ({
      date: item._id,
      count: item.count
    }));

    return {
      totalSubmissions,
      successfulSubmissions,
      spamSubmissions,
      failedSubmissions,
      topServiceTypes,
      submissionsByDay
    };
  } catch (error) {
    console.error("Failed to get contact stats:", error);
    return {
      totalSubmissions: 0,
      successfulSubmissions: 0,
      spamSubmissions: 0,
      failedSubmissions: 0,
      topServiceTypes: [],
      submissionsByDay: []
    };
  }
}