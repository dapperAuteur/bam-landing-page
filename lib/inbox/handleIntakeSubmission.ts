import "server-only";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db/mongodb";
import { Logger, LogContext } from "@/lib/logging/logger";
import { getClientIp, isValidEmail } from "@/lib/utils/client";
import { verifyRecaptcha } from "@/lib/recaptcha/verify";
import { submitToInbox } from "@/lib/inbox/signedFetch";

export type IntakeFormType = "hire" | "partner";

export interface IntakeFormBody {
  name?: string;
  email?: string;
  roleOrTitle?: string;
  company?: string;
  link?: string;
  message?: string;
  utm_source?: string;
  utm_campaign?: string;
  recaptchaToken?: string;
}

export interface IntakeRouteResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

const FIELD_LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  roleOrTitle: { max: 160 },
  company: { max: 160 },
  link: { max: 500 },
  message: { min: 10, max: 4000 },
} as const;

function sanitize(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

function validate(body: IntakeFormBody): {
  ok: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const name = (body.name || "").trim();
  if (name.length < FIELD_LIMITS.name.min) errors.name = "Name is required (min 2 characters).";
  if (name.length > FIELD_LIMITS.name.max) errors.name = `Name cannot exceed ${FIELD_LIMITS.name.max} characters.`;

  const email = (body.email || "").trim();
  if (!email) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
  else if (email.length > FIELD_LIMITS.email.max) errors.email = "Email is too long.";

  const message = (body.message || "").trim();
  if (message.length < FIELD_LIMITS.message.min) errors.message = `Please provide at least ${FIELD_LIMITS.message.min} characters.`;
  if (message.length > FIELD_LIMITS.message.max) errors.message = `Message cannot exceed ${FIELD_LIMITS.message.max} characters.`;

  if (body.roleOrTitle && body.roleOrTitle.length > FIELD_LIMITS.roleOrTitle.max) {
    errors.roleOrTitle = `Role/title cannot exceed ${FIELD_LIMITS.roleOrTitle.max} characters.`;
  }
  if (body.company && body.company.length > FIELD_LIMITS.company.max) {
    errors.company = `Company cannot exceed ${FIELD_LIMITS.company.max} characters.`;
  }
  if (body.link && body.link.length > FIELD_LIMITS.link.max) {
    errors.link = "Link is too long.";
  }
  if (body.link) {
    try {
      // Allow bare hostnames by attempting URL parse; reject anything that doesn't have a protocol once normalized.
      const candidate = body.link.startsWith("http") ? body.link : `https://${body.link}`;
      // eslint-disable-next-line no-new
      new URL(candidate);
    } catch {
      errors.link = "Please provide a valid URL.";
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

interface AuditRecord {
  formType: IntakeFormType;
  inboxId?: string;
  inboxStatus: "ok" | "error";
  inboxError?: string;
  payload: Record<string, unknown>;
  submittedAt: Date;
  ipAddress: string;
  userAgent: string;
  recaptchaScore?: number;
}

export async function handleIntakeSubmission(
  request: NextRequest,
  formType: IntakeFormType,
  recaptchaAction: string
): Promise<NextResponse<IntakeRouteResponse>> {
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  let body: IntakeFormBody;
  try {
    body = (await request.json()) as IntakeFormBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request format." },
      { status: 400 }
    );
  }

  const recaptcha = await verifyRecaptcha(body.recaptchaToken, recaptchaAction);
  if (!recaptcha.ok) {
    await Logger.warning(LogContext.SYSTEM, `${formType} form: reCAPTCHA rejected`, {
      request,
      metadata: { reason: recaptcha.reason, score: recaptcha.score },
    });
    return NextResponse.json(
      { success: false, message: "Could not verify the request. Please reload and try again." },
      { status: 400 }
    );
  }

  const validation = validate(body);
  if (!validation.ok) {
    return NextResponse.json(
      {
        success: false,
        message: "Please fix the errors above and try again.",
        errors: validation.errors,
      },
      { status: 400 }
    );
  }

  const sanitized = {
    name: sanitize(body.name || ""),
    email: sanitize(body.email || "").toLowerCase(),
    role_or_title: sanitize(body.roleOrTitle || ""),
    company: sanitize(body.company || ""),
    link: sanitize(body.link || ""),
    message: sanitize(body.message || ""),
    source: sanitize(body.utm_source || ""),
    campaign: sanitize(body.utm_campaign || ""),
  };

  const audit: AuditRecord = {
    formType,
    inboxStatus: "ok",
    payload: sanitized,
    submittedAt: new Date(),
    ipAddress,
    userAgent,
    recaptchaScore: recaptcha.score,
  };

  try {
    const inboxResult = await submitToInbox({
      form_type: formType,
      submitter_email: sanitized.email,
      submitter_name: sanitized.name,
      priority: "normal",
      payload: sanitized,
    });
    audit.inboxId = inboxResult.id;
  } catch (error) {
    audit.inboxStatus = "error";
    audit.inboxError = error instanceof Error ? error.message : String(error);
    await Logger.error(LogContext.SYSTEM, `${formType} form: Inbox dispatch failed`, {
      request,
      metadata: { error: audit.inboxError },
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("bam_portfolio");
    await db.collection("form_submissions").insertOne(audit);
  } catch (error) {
    await Logger.error(LogContext.SYSTEM, `${formType} form: audit-log write failed`, {
      request,
      metadata: { error: error instanceof Error ? error.message : String(error) },
    });
  }

  if (audit.inboxStatus === "error") {
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong sending your message. Please try again, or email contact@brandanthonymcdonald.com directly.",
      },
      { status: 502 }
    );
  }

  await Logger.info(LogContext.SYSTEM, `${formType} form: submission accepted`, {
    request,
    metadata: { inboxId: audit.inboxId, email: sanitized.email },
  });

  return NextResponse.json({
    success: true,
    message:
      "Thanks — your message is in. I respond personally within 24 hours during the work week.",
  });
}
