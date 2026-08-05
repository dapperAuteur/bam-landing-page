<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Turned My Product's Public API Into an MCP Server
Slug:    public-api-to-mcp-server
Excerpt: FlashLearnAI already had a versioned API with self-service keys and
         metered billing. One evening of work made it speak MCP, so any AI
         assistant can generate decks and run study sessions. Here's the
         part that took actual thought: trimming outputs for a model reader,
         mapping two different 429s, and proving the API key can never leak.
Tags:    MCP, Model Context Protocol, API Design, TypeScript, FlashLearnAI, DevRel
-->

# I Turned My Product's Public API Into an MCP Server

FlashLearnAI is my AI flashcard product, and its public API is the most grown-up surface in my ecosystem: versioned `/api/v1`, an OpenAPI 3.1 spec served from the API itself, self-service keys, metered billing with burst and monthly limits. Humans with HTTP clients were well served. AI assistants were not: if you wanted Claude to make you a deck and quiz you on it, you were pasting curl output into a chat window.

The Model Context Protocol is the standard fix for that. MCP is an open protocol that standardizes how applications provide context and tools to LLMs (Model Context Protocol, 2026). An MCP server exposes tools with typed schemas; any MCP client (Claude Code, Claude Desktop, a growing list of others) can discover and call them. So I built `flashlearn-mcp`: a thin TypeScript server that wraps my own public API. One config line, and "make me a deck about the SM-2 algorithm and start a study session" becomes seven tool calls that actually hit production.

This post is about the three parts that took real design thought: trimming responses for a model reader, mapping errors so a model can recover, and proving the API key can never leak. Plus the part I did not expect: what wrapping your own API teaches you about it.

## The shape of the thing

The server is deliberately thin. Seven tools, each one a zod input schema, a typed fetch to `/api/v1`, and a compact result:

- `list_sets` and `get_set` to browse decks
- `generate_cards`, the flagship: AI deck generation
- `create_study_session` and `submit_review`, the spaced-repetition loop
- `get_usage`, billing visibility for the key you brought
- `ping`, configuration sanity without an API call

I used the official TypeScript SDK, and here the "read the docs at build time" rule earned its keep. My planning notes, written five days earlier, named the package `@modelcontextprotocol/sdk`. By build day the SDK's own README declared v2 the stable line, split into `@modelcontextprotocol/server` and `@modelcontextprotocol/client`, targeting the 2026-07-28 revision of the spec (Model Context Protocol, 2026). Coding from memory would have shipped me onto the maintenance track of a protocol that is actively moving.

Two MCP resources ride along: a getting-started document, and the API's live OpenAPI spec, fetched from the public `/api/v1/openapi` endpoint. The spec that documents the API is itself context a client can hand to a model. I like that loop.

## Trimming: the API's reader changed, so the responses had to

A public API returns everything a UI might want. A model reads tool output inside a context window where every field costs tokens and every irrelevant field is a distraction. Same data, different reader, different contract.

Here is one card from `get_set` as the API returns it:

```json
{
  "id": "68b2...", "front": "What is SM-2?", "back": "A spaced-repetition scheduling algorithm.",
  "externalId": "ces:glossary:sm2",
  "options": [{ "id": "a", "text": "An algorithm" }, { "id": "b", "text": "A rocket" }],
  "correctOptionId": "a",
  "frontImage": "https://cdn...", "frontImageAlt": "diagram",
  "backImage": null, "backImageAlt": null,
  "frontVideo": null, "frontVideoAlt": null, "backVideo": null, "backVideoAlt": null
}
```

And as the MCP tool returns it:

```json
{ "id": "68b2...", "front": "What is SM-2?", "back": "A spaced-repetition scheduling algorithm." }
```

Fourteen fields down to three. A model quizzing a user needs the question, the answer, and an id to report results against. It cannot render images, it should not be handed `correctOptionId` (that is the answer key for a mode the wrapper does not run), and eight null media fields are pure token spend. Across a 20-card deck the trim is the difference between a session payload the model skims and one it wades through.

The other trims follow the same logic. Listing descriptions are capped at 160 characters. `rating` and `createdAt` are dropped from listings because they do not help a model choose a deck. Every trim is documented in the README, because a wrapper that silently reshapes data is a debugging trap for the next person.

Each tool also declares an `outputSchema` and returns `structuredContent` next to the text block, so clients that want machine-readable results get them validated, not scraped out of prose.

## Error mapping: the model is the operator now

When a human hits a 401 they read the docs. When a model hits a tool error, the error text is the only documentation it has in hand. The SDK's design leans into this: a tool failure is an ordinary result with `isError: true`, and the model reads it and adapts. So every error in `flashlearn-mcp` is written to be acted on:

- 401: "API key missing or invalid. Mint or rotate a key at flashlearnai.witus.online/developer/keys and set FLASHLEARN_API_KEY."
- 404 on a set: check the id, try `list_sets`.
- Missing key entirely: the server still starts and lists tools (so hosts can connect), but every call names the fix.

The interesting case is 429, because my API returns two of them. A burst 429 (`RATE_LIMIT_EXCEEDED`) means you called too fast; the client retries once with a capped backoff and usually succeeds. A quota 429 (`QUOTA_EXCEEDED`) means the monthly generation budget is gone; retrying is pointless by definition, so the wrapper never does, and the error tells the model to check `get_usage`. Same status code, opposite correct behaviors, distinguishable only by the error code in the body. If your API multiplexes meanings onto one status code, your MCP wrapper is where that decision comes due.

## The key must never leak, and a test proves it

The server holds a billing-attached secret and its entire job is to emit text into a model's context. That text gets logged, replayed in transcripts, and sometimes pasted into bug reports. So "never log the key" is not a habit here, it is an invariant with a test suite.

Two fences. First, the client never interpolates the key into anything except the `Authorization` header. Second, every outgoing error message passes through a redaction function that scrubs the key if it appears, because I do not control upstream text: a proxy or a badly behaved error page could echo the request headers back at me. The test suite serializes entire tool results (not just the message field) and asserts the key is absent on the happy path, the 401 path, the 429 path, and a network failure. The nastiest case is deliberate: a mock API returns an error message containing the key, and the output must come back with `[redacted]` where the secret was. Thirty-three tests run against the real server through a real in-process MCP client, with only the HTTP boundary mocked.

## What the wrapper revealed about the API

This was the unplanned payoff. Wrapping your own API makes you its most literal-minded consumer, and literal-minded consumers find things:

1. The OpenAPI spec's `UsageResponse` schema documents the usage object as the entire 200 body. The route code wraps it in the standard `{ data, meta }` envelope like every other endpoint. Every human consumer had quietly absorbed the envelope; the typed client refused to.
2. The spec says `POST /api/v1/generate` returns 201. When a public deck for the topic already exists, the route returns 200 and reuses it. Correct behavior, undocumented status.

Neither is a bug in the product. Both are drift between contract and code, and both are now filed against the API repo, where the rule is that the spec is the contract and the spec gets fixed. A wrapper is a free spec audit.

## What v1 is not

stdio transport only: the host launches the server as a local process, which is the right trust model for a key-holding wrapper on your own machine. A hosted Streamable HTTP version is the v2 line in the README, not a half-built directory in the repo. No OAuth, because the product's developer surface is API keys today, and the wrapper should not pretend otherwise. No admin or webhook endpoints exposed: read, generate, study, usage. Least privilege applies to models too.

The whole thing is MIT on GitHub. If you have a public API with decent bones, the MCP wrapper is an evening of work, and the evening will teach you something about the API you thought you knew.

## References

Model Context Protocol. (2026). *Specification, revision 2026-07-28*. https://modelcontextprotocol.io/specification/2026-07-28

Model Context Protocol. (2026). *TypeScript SDK documentation*. https://ts.sdk.modelcontextprotocol.io/v2/
