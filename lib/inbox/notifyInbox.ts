import "server-only";
import type { NextRequest } from "next/server";
import { Logger, LogContext } from "@/lib/logging/logger";
import { submitToInbox, type InboxSubmission } from "@/lib/inbox/signedFetch";

/**
 * Non-blocking Inbox dispatch for forms whose system of record is MongoDB
 * (contact, education, guest-speaker). A failure is logged and swallowed — the
 * caller's success path is unaffected, the visitor still sees success, and the
 * submission is already persisted in MongoDB.
 *
 * Contrast `handleIntakeSubmission`, which is blocking: the Inbox is the system
 * of record for the hire/partner intake forms, so it returns 502 on failure.
 */
export async function notifyInbox(
  submission: InboxSubmission,
  request: NextRequest
): Promise<void> {
  try {
    await submitToInbox(submission);
  } catch (error) {
    await Logger.error(
      LogContext.SYSTEM,
      `Inbox dispatch failed (${submission.form_type})`,
      {
        request,
        metadata: { error: error instanceof Error ? error.message : String(error) },
      }
    );
  }
}
