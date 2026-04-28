import "server-only";

export interface RecaptchaVerifyResult {
  ok: boolean;
  score?: number;
  action?: string;
  reason?: string;
}

const MIN_SCORE = 0.5;

export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction: string
): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { ok: false, reason: "missing-secret" };
  }
  if (!token) {
    return { ok: false, reason: "missing-token" };
  }

  const params = new URLSearchParams({ secret, response: token });
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    return { ok: false, reason: `verify-http-${res.status}` };
  }

  const data = (await res.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  if (!data.success) {
    return {
      ok: false,
      reason: `recaptcha-failed:${(data["error-codes"] || []).join(",")}`,
    };
  }
  if (data.action && data.action !== expectedAction) {
    return {
      ok: false,
      score: data.score,
      action: data.action,
      reason: "action-mismatch",
    };
  }
  if (typeof data.score === "number" && data.score < MIN_SCORE) {
    return {
      ok: false,
      score: data.score,
      action: data.action,
      reason: "low-score",
    };
  }

  return { ok: true, score: data.score, action: data.action };
}
