/**
 * Layered-gate wrapper for firing outbox drafts. Every trigger in this app
 * MUST go through fireOutboxDrafts() so the gates stay consistent.
 *
 * Gates (run BEFORE any network call):
 *   1. Master kill-switch (OUTBOX_TRIGGER_ENABLED env). Mutes NON-ADMIN saves
 *      only — admin (matching PRODUCT_OWNER_USER_ID) bypasses every gate.
 *   2. BAM-only gate. bam-landing-page is single-author so this is the
 *      natural permanent restriction; admin bypasses by definition.
 *   3. Per-user opt-in (later) — see witus-outbox plans/future/per-user-opt-in.md.
 *
 * Diagnostic logging pattern lifted verbatim from
 * `plans/ecosystem/2026-05-06-outbox-trigger-debugging.md` so silence-during-
 * smoke can never be the bug here. Captions, media URLs, secrets, and full
 * user ids never appear in logs (Charter §3 PII rule).
 */
import { createHash } from "node:crypto";
import { sendToOutbox, type OutboxPlatform } from "./sender-outbox";

const OWNER_USER_ID = process.env.PRODUCT_OWNER_USER_ID;

// Next 14.2 doesn't export after() from next/server (added in Next 15). The
// debugging-notes playbook explicitly sanctions a synchronous fire-and-forget
// IIFE as the fallback. Errors are logged inside fn(); swallow at the boundary
// so an unhandled rejection doesn't crash the request.
function fireAndForget(fn: () => Promise<unknown>): void {
  void fn().catch(() => {
    /* errors are logged inside fn() */
  });
}

export function fireOutboxDrafts(args: {
  triggerUserId: string;
  externalRefBase: string;
  caption: string;
  mediaUrls?: string[];
  platforms?: readonly OutboxPlatform[];
  scheduledAt?: Date;
  asDraft?: boolean;
}): void {
  const isAdmin = args.triggerUserId === OWNER_USER_ID;
  const debug = process.env.OUTBOX_TRIGGER_DEBUG === "true";
  const shouldLog = isAdmin || debug;

  if (shouldLog) {
    console.log("[outbox-trigger] called", {
      external_ref_base: args.externalRefBase,
      user_prefix: args.triggerUserId.slice(0, 6),
      is_admin: isAdmin,
      enabled: process.env.OUTBOX_TRIGGER_ENABLED === "true",
      owner_set: Boolean(OWNER_USER_ID),
      url: process.env.OUTBOX_INGEST_URL ?? "(unset)",
      slug: process.env.OUTBOX_SOURCE_SLUG ?? "(unset)",
      secret_set: Boolean(process.env.OUTBOX_INGEST_SECRET),
    });
  }

  if (!isAdmin && process.env.OUTBOX_TRIGGER_ENABLED !== "true") {
    if (shouldLog) console.log("[outbox-trigger] skipped: kill-switch off (non-admin)");
    return;
  }
  if (!isAdmin) {
    if (debug) {
      console.log("[outbox-trigger] skipped: triggerUserId !== OWNER_USER_ID", {
        user_prefix: args.triggerUserId.slice(0, 6),
        owner_prefix: OWNER_USER_ID?.slice(0, 6) ?? "(unset)",
      });
    }
    return;
  }

  const platforms = args.platforms ?? (["twitter", "bluesky", "linkedin"] as const);
  const placeholderTime =
    args.scheduledAt ?? new Date(Date.now() + 7 * 24 * 60 * 60_000);
  const asDraft = args.asDraft ?? true;

  console.log("[outbox-trigger] gates passed, scheduling fire-and-forget", {
    platforms,
    external_ref_base: args.externalRefBase,
    as_draft: asDraft,
  });

  fireAndForget(async () => {
    console.log("[outbox-trigger] dispatch running", {
      external_ref_base: args.externalRefBase,
    });
    for (const platform of platforms) {
      try {
        const result = await sendToOutbox({
          outboxUrl: process.env.OUTBOX_INGEST_URL!,
          sourceSlug: process.env.OUTBOX_SOURCE_SLUG!,
          hmacSecret: process.env.OUTBOX_INGEST_SECRET!,
          submission: {
            external_ref: `${args.externalRefBase}-${platform}`,
            platform,
            caption: args.caption,
            media_urls: args.mediaUrls ?? [],
            scheduled_at: placeholderTime.toISOString(),
            as_draft: asDraft,
          },
        });
        if (!result.ok) {
          console.error("[outbox-trigger] failed", {
            source: process.env.OUTBOX_SOURCE_SLUG,
            platform,
            external_ref_base: args.externalRefBase,
            http_status: result.status,
          });
        } else {
          console.log("[outbox-trigger] sent", {
            platform,
            external_ref_base: args.externalRefBase,
            http_status: result.status,
            record_status: result.recordStatus,
          });
        }
      } catch (err) {
        console.error("[outbox-trigger] threw", {
          source: process.env.OUTBOX_SOURCE_SLUG,
          platform,
          external_ref_base: args.externalRefBase,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  });
}

/** Stable user-id hash for external_ref. SHA-256 truncated to 8 chars. */
export function hashUserId(userId: string): string {
  return createHash("sha256").update(userId).digest("hex").slice(0, 8);
}

/**
 * Anonymized handle for captions. NEVER full email or full name. Use the
 * user's chosen handle if any; otherwise initials + 4-char hash.
 */
export function anonymizedHandle(user: {
  handle?: string | null;
  email: string;
}): string {
  if (user.handle) return `@${user.handle}`;
  const local = user.email.split("@")[0] ?? "user";
  const initials =
    local
      .split(/[._-]/)
      .map((s) => s.charAt(0).toUpperCase())
      .filter((c) => c.length > 0)
      .join("") || "U";
  const hash = createHash("sha256").update(user.email).digest("hex").slice(0, 4);
  return `${initials}-${hash}`;
}
