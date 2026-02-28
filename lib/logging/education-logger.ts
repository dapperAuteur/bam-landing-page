/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import clientPromise from "./../db/mongodb";
import { getClientIp } from "@/lib/utils/client";
import { EducationFormData, CorvidEducationFormData } from "./../../types/education";

export enum EducationEventType {
  FORM_SUBMISSION = "education_form_submission",
  FORM_VALIDATION_ERROR = "education_form_validation_error",
  FORM_SUCCESS = "education_form_success",
  FORM_FAILURE = "education_form_failure",
  SPAM_DETECTED = "education_spam_detected",
  RATE_LIMIT_EXCEEDED = "education_rate_limit_exceeded"
}

export interface SanitizedEducationFormData {
  name?: string;
  email?: string;
  schoolName?: string;
  schoolDistrict?: string;
  city?: string;
  state?: string;
  country?: string;
  formType?: string;
  gradesTeachingCount?: number;
  customCreationRequest?: boolean;
}

export interface EducationLog {
  _id?: string;
  event: EducationEventType;
  email?: string;
  formType?: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failure" | "spam";
  reason?: string;
  formData?: SanitizedEducationFormData;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Log to MongoDB and console
 */
async function logToMongoDB(logEntry: EducationLog): Promise<string> {
  try {
    const client = await clientPromise;
    const db = client.db('bam_portfolio');
    const educationLogsCollection = db.collection<EducationLog>("education_logs");
    const result = await educationLogsCollection.insertOne(logEntry);
    return result.insertedId.toString();
  } catch (error) {
    console.error("Failed to log to MongoDB:", error);
    return "logging-failed";
  }
}

/**
 * Log an education form event to the database
 */
export async function logEducationEvent({
  request,
  event,
  email = undefined,
  formType = undefined,
  status,
  reason = undefined,
  formData = undefined,
  metadata = {},
}: {
  request: NextRequest;
  event: EducationEventType;
  email?: string;
  formType?: string;
  status: "success" | "failure" | "spam";
  reason?: string;
  formData?: Partial<EducationFormData>;
  metadata?: Record<string, any>;
}): Promise<string> {
  try {
    const message = `Education event: ${event}, status: ${status}${reason ? `, reason: ${reason}` : ''}`;
    
    // Log to console
    console.log(`[EDUCATION] ${message}`, {
      email,
      formType,
      reason,
      event,
      status,
      metadata
    });

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    const logEntry: EducationLog = {
      event,
      email,
      formType,
      ipAddress,
      userAgent,
      status,
      reason,
      formData: formData ? {
        name: formData.name,
        email: formData.email,
        schoolName: formData.schoolName,
        schoolDistrict: formData.schoolDistrict,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        formType: formData.formType,
        gradesTeachingCount: 'gradesTeaching' in formData ? (formData as CorvidEducationFormData).gradesTeaching?.length : undefined,
        customCreationRequest: formData.customCreationRequest
      } : undefined,
      metadata,
      timestamp: new Date(),
    };
    
    return await logToMongoDB(logEntry);
  } catch (error) {
    console.error("Failed to log education event:", error);
    return "logging-failed";
  }
}

/**
 * Check for spam patterns in education form submissions
 */
export async function checkForEducationSpam(
  formData: EducationFormData,
  ipAddress: string
): Promise<{ isSpam: boolean; reason?: string; confidence: number }> {
  try {
    const client = await clientPromise;
    const db = client.db('bam_portfolio');
    const educationLogsCollection = db.collection<EducationLog>("education_logs");
    
    const lookbackTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    let spamScore = 0;
    const reasons: string[] = [];

    // Check submission frequency from same IP
    const submissionsFromIp = await educationLogsCollection.countDocuments({
      ipAddress,
      timestamp: { $gte: lookbackTime },
    });
    
    if (submissionsFromIp >= 5) {
      spamScore += 0.4;
      reasons.push(`${submissionsFromIp} submissions from same IP in 24h`);
    }

    // Check for duplicate school information
    const duplicateSchool = await educationLogsCollection.countDocuments({
      "formData.schoolName": formData.schoolName,
      email: formData.email,
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // 7 days
    });
    
    if (duplicateSchool >= 2) {
      spamScore += 0.3;
      reasons.push("Duplicate school submission detected");
    }

    // Check for suspicious patterns in text
    const suspiciousPatterns = [
      /crypto|bitcoin|investment|loan|money/gi,
      /seo|backlink|rank|google/gi,
      /urgent|immediate|act now|limited time/gi,
      /http|www\.|\.com|\.net/gi
    ];

    const textToCheck = `${formData.name} ${formData.schoolName} ${formData.schoolDistrict}`.toLowerCase();
    const patternMatches = suspiciousPatterns.filter(pattern => pattern.test(textToCheck));
    
    if (patternMatches.length >= 2) {
      spamScore += 0.3;
      reasons.push("Multiple suspicious patterns detected");
    }

    // Check email domain reputation
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'throwaway'];
    
    if (suspiciousDomains.some(domain => emailDomain?.includes(domain))) {
      spamScore += 0.4;
      reasons.push("Temporary email domain detected");
    }

    // Check for unrealistic grade combinations
    if ("gradesTeaching" in formData && formData.gradesTeaching.length > 4) {
      spamScore += 0.2;
      reasons.push("Unusual grade combination");
    }

    return {
      isSpam: spamScore >= 0.6,
      reason: reasons.length > 0 ? reasons.join('; ') : undefined,
      confidence: Math.min(spamScore, 1.0)
    };
  } catch (error) {
    console.error("Failed to check for education spam:", error);
    return { isSpam: false, confidence: 0 };
  }
}

/**
 * Check rate limiting for education form submissions
 */
export async function checkEducationRateLimit(
  ipAddress: string,
  email?: string
): Promise<{ isLimited: boolean; reason?: string; nextAllowedTime?: Date }> {
  try {
    const client = await clientPromise;
    const db = client.db('bam_portfolio');
    const educationLogsCollection = db.collection<EducationLog>("education_logs");
    
    const hourLimit = 3;
    const dayLimit = 10;
    const emailDayLimit = 5;
    
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Check hourly limit by IP
    const hourlySubmissions = await educationLogsCollection.countDocuments({
      ipAddress,
      timestamp: { $gte: oneHourAgo },
      status: { $ne: "spam" }
    });
    
    if (hourlySubmissions >= hourLimit) {
      return {
        isLimited: true,
        reason: `Exceeded hourly limit of ${hourLimit} submissions`,
        nextAllowedTime: new Date(oneHourAgo.getTime() + 60 * 60 * 1000)
      };
    }

    // Check daily limit by IP
    const dailySubmissions = await educationLogsCollection.countDocuments({
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
      const emailDailySubmissions = await educationLogsCollection.countDocuments({
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
    console.error("Failed to check education rate limit:", error);
    return { isLimited: false };
  }
}

/**
 * Get recent education submissions for monitoring
 */
export async function getRecentEducationSubmissions(limit: number = 50): Promise<EducationLog[]> {
  try {
    const client = await clientPromise;
    const db = client.db('bam_portfolio');
    const educationLogsCollection = db.collection<EducationLog>("education_logs");
    
    const logs = await educationLogsCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return logs;
  } catch (error) {
    console.error("Failed to get recent education submissions:", error);
    return [];
  }
}

/**
 * Get education submission statistics
 */
export async function getEducationStats(days: number = 30): Promise<{
  totalSubmissions: number;
  successfulSubmissions: number;
  spamSubmissions: number;
  failedSubmissions: number;
  topFormTypes: Array<{ formType: string; count: number }>;
  submissionsByDay: Array<{ date: string; count: number }>;
}> {
  try {
    const client = await clientPromise;
    const db = client.db('bam_portfolio');
    const educationLogsCollection = db.collection<EducationLog>("education_logs");
    
    const lookbackTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const [totalSubmissions, successfulSubmissions, spamSubmissions, failedSubmissions] = await Promise.all([
      educationLogsCollection.countDocuments({ timestamp: { $gte: lookbackTime } }),
      educationLogsCollection.countDocuments({ timestamp: { $gte: lookbackTime }, status: "success" }),
      educationLogsCollection.countDocuments({ timestamp: { $gte: lookbackTime }, status: "spam" }),
      educationLogsCollection.countDocuments({ timestamp: { $gte: lookbackTime }, status: "failure" })
    ]);

    const formTypeAggregation = await educationLogsCollection.aggregate([
      { $match: { timestamp: { $gte: lookbackTime }, status: "success" } },
      { $group: { _id: "$formType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    const topFormTypes = formTypeAggregation.map(item => ({
      formType: item._id || "Unknown",
      count: item.count
    }));

    const submissionsByDayAggregation = await educationLogsCollection.aggregate([
      { $match: { timestamp: { $gte: lookbackTime } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const submissionsByDay = submissionsByDayAggregation.map(item => ({
      date: item._id,
      count: item.count
    }));

    return {
      totalSubmissions,
      successfulSubmissions,
      spamSubmissions,
      failedSubmissions,
      topFormTypes,
      submissionsByDay
    };
  } catch (error) {
    console.error("Failed to get education stats:", error);
    return {
      totalSubmissions: 0,
      successfulSubmissions: 0,
      spamSubmissions: 0,
      failedSubmissions: 0,
      topFormTypes: [],
      submissionsByDay: []
    };
  }
}