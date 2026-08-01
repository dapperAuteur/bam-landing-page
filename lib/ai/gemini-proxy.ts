/**
 * Shared logic for the server-side Gemini proxy (`app/api/ai/gemini/route.ts`).
 *
 * Split out from the route handler so the validation and rate-limit rules can be
 * unit-tested without a running server or a real API key.
 */

/**
 * Only models the interactive blog demos actually use. An allowlist (rather than
 * passing the caller's string through) keeps the endpoint from becoming an open
 * proxy to arbitrary Google endpoints if someone posts a crafted model name.
 */
export const ALLOWED_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.5-flash-preview-05-20',
] as const

export type AllowedModel = (typeof ALLOWED_MODELS)[number]

export const DEFAULT_MODEL: AllowedModel = 'gemini-2.0-flash'

/** Demo widgets send short prompts; this bounds token spend per request. */
export const MAX_PROMPT_CHARS = 4000

export type GeminiProxyRequest = {
  prompt: string
  model: AllowedModel
  /** Server-supplied only — callers cannot set this (see parseGeminiRequest). */
  systemInstruction?: string
}

export type ParseResult =
  | { ok: true; value: GeminiProxyRequest }
  | { ok: false; error: string }

/**
 * Validate an untrusted request body.
 *
 * Note what is deliberately NOT accepted: `systemInstruction`. The persona for
 * each demo lives server-side in SYSTEM_PROMPTS below, keyed by a short id, so a
 * caller cannot rewrite the system prompt of a widget running on our key.
 */
export function parseGeminiRequest(body: unknown): ParseResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Body must be a JSON object' }
  }

  const { prompt, model, persona } = body as Record<string, unknown>

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    return { ok: false, error: 'prompt is required' }
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return { ok: false, error: `prompt exceeds ${MAX_PROMPT_CHARS} characters` }
  }

  let resolvedModel: AllowedModel = DEFAULT_MODEL
  if (model !== undefined) {
    if (typeof model !== 'string' || !ALLOWED_MODELS.includes(model as AllowedModel)) {
      return { ok: false, error: 'Unsupported model' }
    }
    resolvedModel = model as AllowedModel
  }

  let systemInstruction: string | undefined
  if (persona !== undefined) {
    if (typeof persona !== 'string' || !(persona in SYSTEM_PROMPTS)) {
      return { ok: false, error: 'Unknown persona' }
    }
    systemInstruction = SYSTEM_PROMPTS[persona as PersonaId]
  }

  return { ok: true, value: { prompt: prompt.trim(), model: resolvedModel, systemInstruction } }
}

/**
 * Server-held system prompts, keyed by the id a client sends as `persona`.
 *
 * `chief-strategist` was previously inlined in the client bundle;
 * `keyword-coach` reads SYSTEM_PROMPT from the environment, which is what the v2
 * page intended -- it read `process.env.SYSTEM_PROMPT` in a client component,
 * where it is always undefined, so that page has been shipping no system prompt
 * at all. Reading it here is the first time that env var actually takes effect.
 */
export const SYSTEM_PROMPTS = {
  'chief-strategist':
    "You are a demo of the 'Chief Strategist' AI coach. Your goal is to help a user become the world's fastest centenarian. Your persona is direct, blunt, and objective. Always explain the 'why' behind your advice. You must respond to the user's command keyword. For 'Plan', create a short schedule. For 'Critique', give brief feedback. For 'Deconstruct', break down a skill simply. For 'Meal', create a simple recipe from ingredients. Keep all responses concise and illustrative for this demo.",
  'keyword-coach': process.env.SYSTEM_PROMPT || '',
} as const

export type PersonaId = keyof typeof SYSTEM_PROMPTS

/**
 * In-memory sliding-window limiter.
 *
 * Deliberately not Mongo-backed: these are public demo widgets and a DB write
 * per keystroke-driven request is not worth it. CAVEAT: on Vercel Fluid Compute
 * the counter is per function instance, not global, so this damps casual abuse
 * rather than enforcing a hard global ceiling. If this endpoint ever guards real
 * spend, move the counter to Redis/Mongo.
 */
const WINDOW_MS = 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 10

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function checkGeminiRateLimit(
  key: string,
  now: number = Date.now()
): { allowed: boolean; retryAfterSeconds: number } {
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    }
  }

  bucket.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

/** Test seam — the module-level map otherwise leaks state between test cases. */
export function __resetGeminiRateLimit(): void {
  buckets.clear()
}
