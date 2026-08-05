import "server-only";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db/mongodb";
import { Logger, LogContext } from "@/lib/logging/logger";
import { getClientIp, isValidEmail } from "@/lib/utils/client";
import { verifyRecaptcha } from "@/lib/recaptcha/verify";
import { checkFormRateLimit } from "@/lib/inbox/formRateLimit";
import { submitToInbox } from "@/lib/inbox/signedFetch";

export const SURVEY_FORM_TYPE = "client-intake";

export const PLATFORM_OPTIONS = [
  "web",
  "ios",
  "android",
  "desktop",
  "voice",
  "embedded",
  "other",
] as const;
export type Platform = (typeof PLATFORM_OPTIONS)[number];

export const BUDGET_OPTIONS = [
  "under_5k",
  "5k_15k",
  "15k_50k",
  "50k_150k",
  "150k_plus",
  "discuss",
] as const;
export type BudgetRange = (typeof BUDGET_OPTIONS)[number];

export const URGENCY_OPTIONS = ["exploring", "soon", "actively_recruiting"] as const;
export type Urgency = (typeof URGENCY_OPTIONS)[number];

export const NEXT_STEP_OPTIONS = ["call", "async", "either"] as const;
export type NextStep = (typeof NEXT_STEP_OPTIONS)[number];

export interface SurveyFormBody {
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  projectName?: string;
  oneLinePitch?: string;
  coreProblem?: string;
  users?: string;
  platforms?: string[];
  mustHaves?: string;
  niceToHaves?: string;
  integrations?: string;
  targetDate?: string;
  budgetRange?: string;
  urgency?: string;
  decisionMakers?: string;
  nextStep?: string;
  referrer?: string;
  notes?: string;
  utm_source?: string;
  utm_campaign?: string;
  recaptchaToken?: string;
}

export interface SurveyRouteResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

const FIELD_LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  role: { max: 160 },
  company: { max: 160 },
  projectName: { max: 200 },
  oneLinePitch: { min: 5, max: 240 },
  coreProblem: { min: 20, max: 500 },
  users: { max: 300 },
  mustHaves: { min: 10, max: 1000 },
  niceToHaves: { max: 1000 },
  integrations: { max: 1000 },
  targetDate: { max: 80 },
  decisionMakers: { max: 400 },
  referrer: { max: 200 },
  notes: { max: 2000 },
} as const;

function sanitize(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

function inEnum<T extends readonly string[]>(value: string | undefined, options: T): value is T[number] {
  return !!value && (options as readonly string[]).includes(value);
}

function validate(body: SurveyFormBody): {
  ok: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const name = (body.name || "").trim();
  if (name.length < FIELD_LIMITS.name.min) errors.name = "Name is required (min 2 characters).";
  else if (name.length > FIELD_LIMITS.name.max)
    errors.name = `Name cannot exceed ${FIELD_LIMITS.name.max} characters.`;

  const email = (body.email || "").trim();
  if (!email) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
  else if (email.length > FIELD_LIMITS.email.max) errors.email = "Email is too long.";

  const oneLinePitch = (body.oneLinePitch || "").trim();
  if (oneLinePitch.length < FIELD_LIMITS.oneLinePitch.min)
    errors.oneLinePitch = `Please give a one-sentence pitch (at least ${FIELD_LIMITS.oneLinePitch.min} characters).`;
  else if (oneLinePitch.length > FIELD_LIMITS.oneLinePitch.max)
    errors.oneLinePitch = `Keep the pitch under ${FIELD_LIMITS.oneLinePitch.max} characters.`;

  const coreProblem = (body.coreProblem || "").trim();
  if (coreProblem.length < FIELD_LIMITS.coreProblem.min)
    errors.coreProblem = `Please describe the problem (at least ${FIELD_LIMITS.coreProblem.min} characters).`;
  else if (coreProblem.length > FIELD_LIMITS.coreProblem.max)
    errors.coreProblem = `Keep the problem description under ${FIELD_LIMITS.coreProblem.max} characters.`;

  const mustHaves = (body.mustHaves || "").trim();
  if (mustHaves.length < FIELD_LIMITS.mustHaves.min)
    errors.mustHaves = `Please list the top must-have features (at least ${FIELD_LIMITS.mustHaves.min} characters).`;
  else if (mustHaves.length > FIELD_LIMITS.mustHaves.max)
    errors.mustHaves = `Keep the must-haves under ${FIELD_LIMITS.mustHaves.max} characters.`;

  const optionalLimits: Array<[keyof typeof FIELD_LIMITS, string | undefined, string]> = [
    ["role", body.role, "Role"],
    ["company", body.company, "Company"],
    ["projectName", body.projectName, "Project name"],
    ["users", body.users, "Users description"],
    ["niceToHaves", body.niceToHaves, "Nice-to-haves"],
    ["integrations", body.integrations, "Integrations"],
    ["targetDate", body.targetDate, "Target date"],
    ["decisionMakers", body.decisionMakers, "Decision-makers"],
    ["referrer", body.referrer, "Referrer"],
    ["notes", body.notes, "Notes"],
  ];
  for (const [key, value, label] of optionalLimits) {
    const limit = (FIELD_LIMITS as Record<string, { max: number }>)[key].max;
    if (value && value.length > limit) {
      errors[key] = `${label} cannot exceed ${limit} characters.`;
    }
  }

  if (Array.isArray(body.platforms)) {
    const invalid = body.platforms.find((p) => !inEnum(p, PLATFORM_OPTIONS));
    if (invalid) errors.platforms = "Unknown platform value.";
  } else if (body.platforms !== undefined) {
    errors.platforms = "Platforms must be a list.";
  }

  if (body.budgetRange && !inEnum(body.budgetRange, BUDGET_OPTIONS)) {
    errors.budgetRange = "Unknown budget option.";
  }
  if (body.urgency && !inEnum(body.urgency, URGENCY_OPTIONS)) {
    errors.urgency = "Unknown urgency option.";
  }
  if (body.nextStep && !inEnum(body.nextStep, NEXT_STEP_OPTIONS)) {
    errors.nextStep = "Unknown next-step option.";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

interface AuditRecord {
  formType: "intake";
  inboxId?: string;
  inboxStatus: "ok" | "error";
  inboxError?: string;
  payload: Record<string, unknown>;
  submittedAt: Date;
  ipAddress: string;
  userAgent: string;
  recaptchaScore?: number;
}

export async function handleSurveySubmission(
  request: NextRequest,
  recaptchaAction: string
): Promise<NextResponse<SurveyRouteResponse>> {
  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  let body: SurveyFormBody;
  try {
    body = (await request.json()) as SurveyFormBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request format." },
      { status: 400 }
    );
  }

  const recaptcha = await verifyRecaptcha(body.recaptchaToken, recaptchaAction);
  if (!recaptcha.ok) {
    await Logger.warning(LogContext.SYSTEM, "intake form: reCAPTCHA rejected", {
      request,
      metadata: { reason: recaptcha.reason, score: recaptcha.score },
    });
    return NextResponse.json(
      { success: false, message: "Could not verify the request. Please reload and try again." },
      { status: 400 }
    );
  }

  // After reCAPTCHA (a valid token is not a spend limit) and before the Inbox
  // POST + email fan-out that an accepted submission triggers.
  const rateLimit = await checkFormRateLimit(ipAddress, (body.email || "").trim().toLowerCase());
  if (rateLimit.isLimited) {
    await Logger.warning(LogContext.SYSTEM, "intake form: rate limited", {
      request,
      metadata: { reason: rateLimit.reason, nextAllowedTime: rateLimit.nextAllowedTime },
    });
    return NextResponse.json(
      { success: false, message: "Too many submissions. Please try again later." },
      { status: 429 }
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
    role: sanitize(body.role || ""),
    company: sanitize(body.company || ""),
    project_name: sanitize(body.projectName || ""),
    one_line_pitch: sanitize(body.oneLinePitch || ""),
    core_problem: sanitize(body.coreProblem || ""),
    users: sanitize(body.users || ""),
    platforms: Array.isArray(body.platforms)
      ? body.platforms.filter((p): p is Platform => inEnum(p, PLATFORM_OPTIONS))
      : [],
    must_haves: sanitize(body.mustHaves || ""),
    nice_to_haves: sanitize(body.niceToHaves || ""),
    integrations: sanitize(body.integrations || ""),
    target_date: sanitize(body.targetDate || ""),
    budget_range: inEnum(body.budgetRange, BUDGET_OPTIONS) ? body.budgetRange : "",
    urgency: inEnum(body.urgency, URGENCY_OPTIONS) ? body.urgency : "",
    decision_makers: sanitize(body.decisionMakers || ""),
    next_step: inEnum(body.nextStep, NEXT_STEP_OPTIONS) ? body.nextStep : "",
    referrer: sanitize(body.referrer || ""),
    notes: sanitize(body.notes || ""),
    utm_source: sanitize(body.utm_source || ""),
    utm_campaign: sanitize(body.utm_campaign || ""),
  };

  const audit: AuditRecord = {
    formType: "intake",
    inboxStatus: "ok",
    payload: sanitized,
    submittedAt: new Date(),
    ipAddress,
    userAgent,
    recaptchaScore: recaptcha.score,
  };

  try {
    const inboxResult = await submitToInbox({
      form_type: SURVEY_FORM_TYPE,
      submitter_email: sanitized.email,
      submitter_name: sanitized.name,
      priority: "normal",
      payload: sanitized,
    });
    audit.inboxId = inboxResult.id;
  } catch (error) {
    audit.inboxStatus = "error";
    audit.inboxError = error instanceof Error ? error.message : String(error);
    await Logger.error(LogContext.SYSTEM, "intake form: Inbox dispatch failed", {
      request,
      metadata: { error: audit.inboxError },
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("bam_portfolio");
    await db.collection("form_submissions").insertOne(audit);
  } catch (error) {
    await Logger.error(LogContext.SYSTEM, "intake form: audit-log write failed", {
      request,
      metadata: { error: error instanceof Error ? error.message : String(error) },
    });
  }

  if (audit.inboxStatus === "error") {
    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong sending your intake. Please try again, or email contact@brandanthonymcdonald.com directly.",
      },
      { status: 502 }
    );
  }

  await Logger.info(LogContext.SYSTEM, "intake form: submission accepted", {
    request,
    metadata: { inboxId: audit.inboxId, email: sanitized.email },
  });

  return NextResponse.json({
    success: true,
    message:
      "Thanks, your intake is in. I'll review and come back with a thoughtful first response within 24 hours during the work week.",
  });
}
