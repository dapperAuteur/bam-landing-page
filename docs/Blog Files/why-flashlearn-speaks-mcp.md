<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Why My Flashcard App Now Speaks MCP: The Ecosystem Case
Slug:    why-flashlearn-speaks-mcp
Excerpt: FlashLearnAI had a real public API for two years: keys, metered
         billing, OpenAPI. Then the way software consumes software changed.
         Here is why the first MCP server in my 22-product ecosystem wraps
         this app, what it buys the whole platform, and the pattern I plan
         to repeat.
Tags:    MCP, Ecosystem, Strategy, FlashLearnAI, API Design, WitUS
-->

# Why My Flashcard App Now Speaks MCP: The Ecosystem Case

I run a 22-product ecosystem under the WitUS brand, and as of this week one of those products has a new front door. FlashLearnAI, my spaced-repetition flashcard platform, now ships an MCP server: a small package that lets any AI assistant (Claude Code, Claude Desktop, and a growing list of others) generate decks, run study sessions, and check usage with one line of configuration.

The build itself was an evening of work, and I wrote up the engineering in a separate post. This one answers the question that matters more: why this product, why this protocol, and what it buys the rest of the ecosystem.

## The consumer of APIs changed

FlashLearnAI has had a real public API for a long time: versioned routes, self-service keys, metered billing, an OpenAPI spec. I built it because I believe a learning platform should be a platform, something other people's software can build on.

Here is what changed underneath that bet. The "other people's software" consuming APIs in 2026 is, increasingly, an AI assistant acting on someone's behalf. A student does not open my developer docs; they tell their assistant "make me a deck on the Krebs cycle and quiz me Thursday." If my API can only be reached by a developer writing integration code, I am invisible to that interaction.

MCP (the Model Context Protocol) is the industry's answer to that gap: an open standard for describing tools so any compatible assistant can discover and call them. I think of it as the USB-C moment for product APIs. I already had the electricity; MCP is the plug shape everyone's devices now expect.

## Why FlashLearnAI got it first

Picking the first MCP surface in a 22-product ecosystem was a deliberate choice, not an accident of enthusiasm.

**It had the strongest contract to wrap.** An MCP server is only as trustworthy as the API beneath it. FlashLearnAI's API already had authentication, rate limits, quotas, and a spec. Wrapping a mature contract meant the MCP work was translation, not invention. Starting with the weakest API would have meant building two things at once and doing both badly.

**Its use case is native to assistants.** "Generate cards about X, then start a study session" is exactly the shape of request people already make to AI assistants. Some of my products serve workflows a chat interface handles poorly. This one fits like it was designed for it, because in a sense the underlying learning loop (generate, study, review, repeat) always was conversational.

**It exercises the billing path.** My API uses metered billing, and an assistant calling tools on a user's behalf is a new kind of consumer for that meter. I wanted the first MCP surface to test how usage-based pricing feels when the "user" is an agent, while the stakes are flashcards rather than payroll.

## What the ecosystem gets out of it

The direct win is distribution: FlashLearnAI is now reachable from inside the tools people already live in, without me building a single new UI.

The larger win is the template. The build produced reusable answers to questions every future WitUS MCP surface will face: how to trim API responses so a model reader gets signal instead of bloat, how to map rate-limit versus quota errors so an agent retries the right one and never the wrong one, and how to prove with tests that a user's API key cannot leak into a transcript. Those patterns now exist as working, tested code that the next server copies instead of rediscovering.

There is also an audit effect I did not fully anticipate. Writing a second, machine-facing description of my API surfaced two places where the OpenAPI spec and the actual routes disagreed. A contract nobody re-reads drifts quietly. A contract that a second consumer depends on gets honest fast.

## The pattern I plan to repeat

The obvious next candidates are the products whose value is already programmatic: WitUS Inbox (imagine an assistant triaging your form submissions with you) and the coach agents. Each will get the same treatment only when its underlying API has earned it, because the lesson of doing this once is that MCP amplifies whatever contract you already have. A good API becomes more valuable. A sloppy one becomes more visibly sloppy.

That is the honest version of the strategy: MCP is not a growth hack. It is a bet that the assistant-mediated interaction is now a first-class channel, and that products built API-first for years are the ones positioned to collect on that bet with an evening of work instead of a rewrite.

The server is open source, MIT licensed, and one `claude mcp add` away once it lands on npm. If you run a product with a real API, the evening of work is probably worth it for the audit alone.
