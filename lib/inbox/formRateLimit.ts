import "server-only";
import clientPromise from "@/lib/db/mongodb";

/**
 * Rate limiting for the Inbox-backed public forms (hire / partner / intake).
 *
 * These routes already verify reCAPTCHA, but a valid token is not a spend
 * limit: each accepted submission writes to Mongo, POSTs to the WitUS Inbox,
 * and fans out email. reCAPTCHA scores what a request looks like; this bounds
 * how often one source can make us do that work.
 *
 * Counts against the `form_submissions` audit collection the handlers already
 * write, so there is no second collection to keep in sync. Limits mirror
 * `checkRateLimit` in lib/logging/contact-logger.ts so the public forms behave
 * consistently.
 */

export const HOUR_LIMIT_PER_IP = 3;
export const DAY_LIMIT_PER_IP = 10;
export const DAY_LIMIT_PER_EMAIL = 5;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export interface FormRateLimitResult {
  isLimited: boolean;
  reason?: string;
  nextAllowedTime?: Date;
}

export async function checkFormRateLimit(
  ipAddress: string,
  email?: string,
  now: Date = new Date()
): Promise<FormRateLimitResult> {
  try {
    const client = await clientPromise;
    const db = client.db("bam_portfolio");
    const submissions = db.collection("form_submissions");

    const oneHourAgo = new Date(now.getTime() - HOUR_MS);
    const oneDayAgo = new Date(now.getTime() - DAY_MS);

    const hourly = await submissions.countDocuments({
      ipAddress,
      submittedAt: { $gte: oneHourAgo },
    });
    if (hourly >= HOUR_LIMIT_PER_IP) {
      return {
        isLimited: true,
        reason: `Exceeded hourly limit of ${HOUR_LIMIT_PER_IP} submissions`,
        nextAllowedTime: new Date(now.getTime() + HOUR_MS),
      };
    }

    const daily = await submissions.countDocuments({
      ipAddress,
      submittedAt: { $gte: oneDayAgo },
    });
    if (daily >= DAY_LIMIT_PER_IP) {
      return {
        isLimited: true,
        reason: `Exceeded daily limit of ${DAY_LIMIT_PER_IP} submissions`,
        nextAllowedTime: new Date(now.getTime() + DAY_MS),
      };
    }

    if (email) {
      const dailyByEmail = await submissions.countDocuments({
        "payload.email": email,
        submittedAt: { $gte: oneDayAgo },
      });
      if (dailyByEmail >= DAY_LIMIT_PER_EMAIL) {
        return {
          isLimited: true,
          reason: `Exceeded daily limit of ${DAY_LIMIT_PER_EMAIL} submissions for this email`,
          nextAllowedTime: new Date(now.getTime() + DAY_MS),
        };
      }
    }

    return { isLimited: false };
  } catch {
    // Fail open. A Mongo blip must not take down the only way a prospective
    // client can reach BAM; reCAPTCHA still stands in front of these routes.
    return { isLimited: false };
  }
}
