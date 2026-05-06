/**
 * Layered-gate wrapper for firing outbox drafts. Every trigger in this app
 * MUST go through fireOutboxDrafts() so the gates stay consistent.
 *
 * Three gates run BEFORE any network call:
 *   1. Master kill-switch (OUTBOX_TRIGGER_ENABLED env). BAM can mute the
 *      whole app instantly via Vercel env edit, no code deploy.
 *   2. BAM-only smoke gate (PRODUCT_OWNER_USER_ID). bam-landing-page is a
 *      single-author site so this is the natural permanent restriction.
 *   3. Per-user opt-in (later) — see witus-outbox plans/future/per-user-opt-in.md.
 *
 * Source template: witus-outbox examples/INTEGRATE.md Step 2.
 */
import { createHash } from "node:crypto";
import { sendToOutbox, type OutboxPlatform } from "./sender-outbox";

const OWNER_USER_ID = process.env.PRODUCT_OWNER_USER_ID;

// Next 14.2 doesn't export after() from next/server (added in Next 15).
// Bare void-promise: on Vercel serverless the function may freeze before the
// outbox POST resolves; acceptable for BAM-only smoke. Swap to
// `import { after } from "next/server"` once Next is upgraded to 15+.
function fireAndForget(fn: () => Promise<unknown>): void {
  void fn().catch(() => {
    /* errors are logged inside fn(); swallow here so unhandled-rejection
       doesn't crash the request. */
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
  if (process.env.OUTBOX_TRIGGER_ENABLED !== "true") return;
  if (args.triggerUserId !== OWNER_USER_ID) return;

  const platforms = args.platforms ?? (["twitter", "bluesky", "linkedin"] as const);
  const placeholderTime =
    args.scheduledAt ?? new Date(Date.now() + 7 * 24 * 60 * 60_000);
  const asDraft = args.asDraft ?? true;

  fireAndForget(async () => {
    for (const platform of platforms) {
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
