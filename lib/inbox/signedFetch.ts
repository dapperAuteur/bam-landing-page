import "server-only";
import { createHmac } from "node:crypto";

export interface InboxSubmission {
  form_type: string;
  submitter_email?: string;
  submitter_name?: string;
  priority?: "high" | "normal";
  payload: Record<string, unknown>;
}

export interface InboxResponse {
  ok: boolean;
  id?: string;
}

function signPayload(secret: string, rawBody: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  return { timestamp, signature };
}

export async function submitToInbox(
  submission: InboxSubmission
): Promise<InboxResponse> {
  const url = process.env.INBOX_INGEST_URL;
  const secret = process.env.INBOX_INGEST_SECRET;
  const source = process.env.INBOX_SOURCE_SLUG;

  if (!url || !secret || !source) {
    throw new Error(
      "Missing Inbox env: INBOX_INGEST_URL, INBOX_INGEST_SECRET, INBOX_SOURCE_SLUG"
    );
  }

  const body: InboxSubmission = {
    priority: "normal",
    ...submission,
  };
  const rawBody = JSON.stringify(body);
  const { timestamp, signature } = signPayload(secret, rawBody);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Witus-Source": source,
      "X-Witus-Timestamp": timestamp,
      "X-Witus-Signature": signature,
    },
    body: rawBody,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Inbox ingest failed: ${res.status} ${text}`);
  }

  return (await res.json()) as InboxResponse;
}
