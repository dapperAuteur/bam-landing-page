/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import clientPromise from "./../db/mongodb";
import { getClientIp } from "./../utils/utils";

// Log severity levels
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error"
}

// Context types to organize logs
export enum LogContext {
  AUTH = "auth",
  FLASHCARD = "flashcard",
  AI = "ai",
  USER = "user",
  STUDY = "study",
  SYSTEM = "system",
  CONTACT = "contact"
}

// Base log entry interface
export interface BaseLogEntry {
  context: LogContext;
  level: LogLevel;
  message: string;
  timestamp: Date;
  userId?: string;
  requestId?: string; // Correlation ID
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// Centralized Logger
export class Logger {
  // Store configuration options
  private static config = {
    logToConsole: process.env.NODE_ENV !== "production",
    logToDatabase: true,
    minLevel: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG
  };

  // Generate a unique request ID
  private static generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Core logging method
  static async log({
    context,
    level,
    message,
    userId = undefined,
    requestId = undefined,
    request = undefined,
    metadata = {}
  }: {
    context: LogContext;
    level: LogLevel;
    message: string;
    userId?: string;
    requestId?: string;
    request?: NextRequest;
    metadata?: Record<string, any>;
  }): Promise<string | null> {
    // Skip logs below minimum level
    if (!this.shouldLog(level)) {
      return null;
    }

    // Generate requestId if not provided
    if (!requestId) {
      requestId = this.generateRequestId();
    }

    // Extract client info if request is provided
    let ipAddress: string | undefined;
    let userAgent: string | undefined;
    
    if (request) {
      ipAddress = getClientIp(request);
      userAgent = request.headers.get("user-agent") || "unknown";
      metadata.ipAddress = ipAddress;
      metadata.userAgent = userAgent;
    }

    // Sanitize metadata to prevent serialization errors
    try {
      metadata = JSON.parse(JSON.stringify(metadata));
    } catch (e) {
      console.error("Failed to sanitize metadata:", e);
      metadata = { sanitizationError: "Failed to serialize metadata" };
    }

    // Create log entry
    const logEntry: BaseLogEntry = {
      context,
      level,
      message,
      timestamp: new Date(),
      userId,
      requestId,
      metadata,
      ipAddress,
      userAgent
    };

    // Log to console if enabled
    if (this.config.logToConsole) {
      this.logToConsole(logEntry);
    }

    // Log to database if enabled
    if (this.config.logToDatabase) {
      return await this.logToDatabase(logEntry);
    }

    return requestId;
  }

  // Determine if this log level should be recorded
  private static shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.minLevel);
    const logLevelIndex = levels.indexOf(level);
    
    return logLevelIndex >= configLevelIndex;
  }

  // Format and print log to console
  private static logToConsole(logEntry: BaseLogEntry): void {
    const timestamp = logEntry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${logEntry.level.toUpperCase()}] [${logEntry.context}]`;
    
    switch (logEntry.level) {
      case LogLevel.ERROR:
        console.error(`${prefix} ${logEntry.message}`, logEntry.metadata);
        break;
      case LogLevel.WARNING:
        console.warn(`${prefix} ${logEntry.message}`, logEntry.metadata);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${logEntry.message}`, logEntry.metadata);
        break;
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${logEntry.message}`, logEntry.metadata);
        break;
    }
  }

  // Save log to database
  private static async logToDatabase(logEntry: BaseLogEntry): Promise<string> {
    try {
      const client = await clientPromise;
      const db = client.db();
      
      const result = await db.collection("system_logs").insertOne(logEntry);
      return result.insertedId.toString();
    } catch (error) {
      // If database logging fails, output to console as fallback
      console.error("Failed to log to database:", error);
      console.error("Original log entry:", logEntry);
      return "logging-failed";
    }
  }

  // Convenience methods for different log levels
  static async debug(context: LogContext, message: string, options: Record<string, any> = {}): Promise<string | null> {
    const { userId, requestId, request, metadata, ...rest } = options;
    const finalMetadata = { ...(metadata || {}), ...rest };
    return this.log({ context, level: LogLevel.DEBUG, message, userId, requestId, request, metadata: finalMetadata });
  }

  static async info(context: LogContext, message: string, options: Record<string, any> = {}): Promise<string | null> {
    const { userId, requestId, request, metadata, ...rest } = options;
    const finalMetadata = { ...(metadata || {}), ...rest };
    return this.log({ context, level: LogLevel.INFO, message, userId, requestId, request, metadata: finalMetadata });
  }

  static async warning(context: LogContext, message: string, options: Record<string, any> = {}): Promise<string | null> {
    const { userId, requestId, request, metadata, ...rest } = options;
    const finalMetadata = { ...(metadata || {}), ...rest };
    return this.log({ context, level: LogLevel.WARNING, message, userId, requestId, request, metadata: finalMetadata });
  }

  static async error(context: LogContext, message: string, options: Record<string, any> = {}): Promise<string | null> {
    const { userId, requestId, request, metadata, ...rest } = options;
    const finalMetadata = { ...(metadata || {}), ...rest };
    return this.log({ context, level: LogLevel.ERROR, message, userId, requestId, request, metadata: finalMetadata });
  }
}

// Analytics-focused logger
export class AnalyticsLogger {
  // Event types for analytics
  static EventType = {
    AI_GENERATED: "ai_generated",
    AI_PROMPT_SUBMITTED: "ai_prompt_submitted",
    FLASHCARD_CREATED: "flashcard_created",
    FLASHCARD_SET_SAVED: "flashcard_set_saved",
    FLASHCARD_STUDIED: "flashcard_studied",
    LIST_EXPORTED: "list_exported",
    LIST_IMPORTED: "list_imported",
    SHARED_FLASHCARDS_USED: "shared_flashcards_used",
    SHARED_FLASHCARDS_VIEWED: "shared_flashcards_viewed",
    USER_LOGIN: "user_login",
    USER_SIGNUP: "user_signup",
    CONTACT_FORM_SUBMISSION: "contact_form_submission",
    CONTACT_FORM_SUCCESS: "contact_form_success",
    CONTACT_FORM_FAILURE: "contact_form_failure"
  };

  // Record an analytics event
  static async trackEvent({
    userId,
    eventType,
    properties = {},
    request = undefined
  }: {
    userId?: string;
    eventType: string;
    properties?: Record<string, any>;
    request?: NextRequest;
  }): Promise<string | null> {
    // Get request data if available
    if (request) {
      properties.ipAddress = getClientIp(request);
      properties.userAgent = request.headers.get("user-agent") || "unknown";
    }

    // Add timestamp if not provided
    if (!properties.timestamp) {
      properties.timestamp = new Date();
    }

    // Sanitize properties to prevent serialization errors
    try {
      properties = JSON.parse(JSON.stringify(properties));
    } catch (e) {
      console.error("Failed to sanitize analytics properties:", e);
      properties = { sanitizationError: "Failed to serialize properties" };
    }

    // First log through the main logger for operational visibility
    const logContext = this.getContextFromEventType(eventType);
    const requestId = await Logger.info(
      logContext,
      `Analytics event: ${eventType}`,
      { userId, metadata: properties, request }
    );

    try {
      // Then store in analytics-specific collection
      const client = await clientPromise;
      const db = client.db();
      
      const analyticsEvent = {
        userId,
        eventType,
        properties,
        timestamp: new Date(),
        requestId
      };
      
      const result = await db.collection("analytics_events").insertOne(analyticsEvent);
      return result.insertedId.toString();
    } catch (error) {
      // Log the failure but don't throw - analytics should never break the app
      await Logger.error(
        LogContext.SYSTEM,
        `Failed to store analytics event: ${eventType}`,
        { metadata: { error: String(error), properties } }
      );
      return null;
    }
  }

  // Map event types to log contexts
  private static getContextFromEventType(eventType: string): LogContext {
    if (eventType.startsWith("flashcard_")) return LogContext.FLASHCARD;
    if (eventType.startsWith("ai_")) return LogContext.AI;
    if (eventType.startsWith("user_")) return LogContext.USER;
    if (eventType.startsWith("contact_")) return LogContext.CONTACT;
    return LogContext.SYSTEM;
  }

  // Specific tracking methods for common events
  static async trackContactSubmission(
    email: string,
    serviceType: string,
    success: boolean,
    request?: NextRequest
  ): Promise<string | null> {
    const eventType = success ? this.EventType.CONTACT_FORM_SUCCESS : this.EventType.CONTACT_FORM_FAILURE;
    
    return this.trackEvent({
      eventType,
      properties: {
        email,
        serviceType,
        success
      },
      request
    });
  }
}