// src/lib/logging/app-logger.ts
import { NextRequest } from "next/server";
import clientPromise from "../db/mongodb";
import { getClientIp } from "@/lib/utils/client";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info", 
  WARNING = "warning",
  ERROR = "error"
}

export enum LogContext {
  AUTH = "auth",
  GALLERY = "gallery",
  CONTACT = "contact", 
  SYSTEM = "system",
  ADMIN = "admin"
}

export interface BaseLogEntry {
  context: LogContext;
  level: LogLevel;
  message: string;
  timestamp: Date;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class Logger {
  private static config = {
    logToConsole: process.env.NODE_ENV !== "production",
    logToDatabase: true,
    minLevel: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG
  };

  private static generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

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
    if (!this.shouldLog(level)) {
      return null;
    }

    if (!requestId) {
      requestId = this.generateRequestId();
    }

    let ipAddress: string | undefined;
    let userAgent: string | undefined;
    
    if (request) {
      ipAddress = getClientIp(request);
      userAgent = request.headers.get("user-agent") || "unknown";
      metadata.ipAddress = ipAddress;
      metadata.userAgent = userAgent;
    }

    try {
      metadata = JSON.parse(JSON.stringify(metadata));
    } catch (e) {
      console.error("Failed to sanitize metadata:", e);
      metadata = { sanitizationError: "Failed to serialize metadata" };
    }

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

    if (this.config.logToConsole) {
      this.logToConsole(logEntry);
    }

    if (this.config.logToDatabase) {
      return await this.logToDatabase(logEntry);
    }

    return requestId;
  }

  private static shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.minLevel);
    const logLevelIndex = levels.indexOf(level);
    return logLevelIndex >= configLevelIndex;
  }

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

  private static async logToDatabase(logEntry: BaseLogEntry): Promise<string> {
    try {
      const client = await clientPromise;
      const db = client.db('bam_portfolio');
      const result = await db.collection("system_logs").insertOne(logEntry);
      return result.insertedId.toString();
    } catch (error) {
      console.error("Failed to log to database:", error);
      console.error("Original log entry:", logEntry);
      return "logging-failed";
    }
  }

  // Convenience methods
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

// Gallery-specific logging helpers
export class GalleryLogger {
  static async logGalleryAccess(galleryId: string, clientEmail: string, request?: NextRequest) {
    return Logger.info(LogContext.GALLERY, `Gallery accessed: ${galleryId}`, {
      request,
      metadata: { galleryId, clientEmail }
    });
  }

  static async logGalleryAuthentication(galleryId: string, success: boolean, request?: NextRequest) {
    return Logger.info(LogContext.AUTH, `Gallery authentication: ${success ? 'success' : 'failed'}`, {
      request,
      metadata: { galleryId, success }
    });
  }

  static async logPhotoDownload(galleryId: string, photoId: string, request?: NextRequest) {
    return Logger.info(LogContext.GALLERY, `Photo downloaded: ${photoId}`, {
      request,
      metadata: { galleryId, photoId }
    });
  }

  static async logGalleryError(galleryId: string, error: string, request?: NextRequest) {
    return Logger.error(LogContext.GALLERY, `Gallery error: ${error}`, {
      request,
      metadata: { galleryId, error }
    });
  }
}