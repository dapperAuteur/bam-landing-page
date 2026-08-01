import { NextRequest, NextResponse } from 'next/server'
import { getClientIp } from '@/lib/utils/client'
import {
  checkGeminiRateLimit,
  parseGeminiRequest,
} from '@/lib/ai/gemini-proxy'

/**
 * Server-side proxy for the interactive Gemini demos on the blog.
 *
 * These widgets used to call generativelanguage.googleapis.com straight from the
 * browser with NEXT_PUBLIC_GEMINI_API_KEY, which inlines the key into the public
 * JS bundle for anyone to lift. The key now lives server-side only, and the
 * browser talks to this route instead.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    // Deliberately vague to the client; the detail goes to the server log.
    console.error('[api/ai/gemini] GEMINI_API_KEY is not configured')
    return NextResponse.json(
      { error: 'AI features are not configured right now.' },
      { status: 503 }
    )
  }

  const limit = checkGeminiRateLimit(getClientIp(request))
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = parseGeminiRequest(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const { prompt, model, systemInstruction } = parsed.value

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Header auth, not a query string: keeps the key out of any URL that
          // could end up in a log or an error message.
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          ...(systemInstruction
            ? { systemInstruction: { parts: [{ text: systemInstruction }] } }
            : {}),
        }),
      }
    )

    if (!upstream.ok) {
      // Upstream error bodies can echo the request URL, so never forward them.
      console.error('[api/ai/gemini] upstream error', upstream.status)
      return NextResponse.json(
        { error: 'The AI service returned an error. Please try again.' },
        { status: 502 }
      )
    }

    const result = await upstream.json()
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text

    if (typeof text === 'string' && text.length > 0) {
      return NextResponse.json({ text })
    }

    const blockReason = result?.promptFeedback?.blockReason
    if (blockReason) {
      return NextResponse.json(
        { error: `Blocked: ${blockReason}. Please rephrase.` },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'No usable content was returned. Please try again.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[api/ai/gemini] request failed', error)
    return NextResponse.json(
      { error: 'Could not reach the AI service. Please try again.' },
      { status: 502 }
    )
  }
}
