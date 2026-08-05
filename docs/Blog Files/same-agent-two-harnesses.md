<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Built the Same Human-in-the-Loop Agent Twice: LangGraph, Then the Claude Agent SDK
Slug:    same-agent-two-harnesses
Excerpt: My production triage agent classifies inbox submissions, enriches
         them with DB tools, and waits for my approval before doing anything
         irreversible. I rebuilt it on the Claude Agent SDK: same four tools,
         same Zod schemas, same fixtures. Here's what actually changed, with
         a committed 5-case parity run, the permission trap the SDK warned me
         about, and the trade-off nobody should skip: the SDK is Claude-only.
Tags:    AI Agents, Claude Agent SDK, LangGraph, MCP, Human-in-the-loop, Comparison
-->

# I Built the Same Human-in-the-Loop Agent Twice: LangGraph, Then the Claude Agent SDK

I run a triage agent against my product ecosystem's shared inbox. It reads a
form submission, classifies it (bug report? billing? spam?), pulls context
with two read-only database tools, proposes one action, and then stops: if
the action would text me or close a submission, a human has to approve it
first. It's built on LangGraph and it works.

Then I rebuilt the whole thing on the Claude Agent SDK. Same four tools,
same Zod input schemas, same Drizzle queries, byte-identical fixture file.
Not a toy port of a tutorial agent: the same real system, twice, by the same
person. That's the only comparison format I trust, because every difference
I'm about to describe is something I hit, not something I read.

## The shape of the port

In LangGraph, the pipeline is literal code: a state graph with six nodes,
`classify -> enrich -> propose -> human_approval -> execute | log_rejection`,
each stage its own structured-output LLM call that I dispatch.

In the Agent SDK, all of that collapsed into one system prompt and one
`query()` call. The harness owns the loop; Claude decides when to call which
tool and when it's done. My "graph" is now three STAGE paragraphs of prose,
and I verify the model follows them by reading transcripts, not by reading
edges. It does follow them, every committed run. But "the model complied" is
an observation, and "the graph enforces it" is a guarantee. That's the
trade at the center of everything else.

The tools were the easy part, and that surprised me. LangChain's `tool()`
and the SDK's `tool()` are the same idea with shuffled arguments; the Zod
schemas and SQL moved over nearly verbatim. The SDK serves them to the model
as an in-process MCP server, so my four functions became
`mcp__triage__get_product_status` and friends without a separate server
process. If you've defined tools in any modern framework, you already know
how to do this.

## The approval gate is where the frameworks disagree

LangGraph pauses with `interrupt()` and persists the paused graph in a
Postgres checkpointer. The approval can arrive tomorrow, from a different
process, through my operator dashboard. Resume is `Command({ resume })`.

The SDK holds the tool call in a callback. When Claude reaches for
`tag_and_file`, the harness calls my `canUseTool` function; mine prompts y/n
at the terminal and returns `{ behavior: "allow" }` or
`{ behavior: "deny", message }`. The entire gate, both tools, is about 60
lines. The catch: it's in-process. The session waits while the human
decides. For a CLI operator, fine. For my production flow, where I approve
from my phone hours later, the checkpointed interrupt is the right
architecture and the callback isn't, at least not without building an
out-of-band transport on top.

The deny path won me over anyway. My deny message goes back to the model as
tool feedback, and in the committed transcript the model did exactly the
right thing: kept `mark_spam` as its recorded proposal, fell back to
`no_action`, wrote a note explaining the denial, and did not retry. In
LangGraph I wired a rejection branch by hand. In the SDK it's a sentence in
the deny message.

One trap, and I appreciated how loudly the SDK flagged it: my first build
put the read-only tools in `allowedTools` and kept the callback for the
mutating pair. At startup the SDK warned me
(`CLAUDE_SDK_CAN_USE_TOOL_SHADOWED`) that bare allow rules approve calls
before the callback ever runs. A permission check that can never fire is a
security hole you'd find the hard way. I moved all four decisions into the
callback. A harness that tells you when you've misconfigured it is worth
something.

## The receipts: a 5-case parity run

I ran the same five fixture submissions through both agents and committed
the diff. Categories: 5/5 agreement. Actions: 4/5. The disagreement is the
interesting part. For a high-priority bug report from a longtime customer,
the LangGraph agent proposed drafting a reply for me to review; the SDK
agent classified it identically, then proposed escalating and actually
called the SMS tool, which my gate held for approval. Same tools, same
data, different models, different appetite for waking me up. That's not a
framework difference, it's a model-judgment difference, and it's exactly
the kind of behavior my eval harness owns going forward. These five cases
join its dataset.

Getting the parity run to exist taught me things the happy path wouldn't
have. The SDK's docs paraphrased the permission callback's contract one way
while the installed type declarations said another; the types were right.
The structured-output flag rejected Zod's default JSON Schema dialect until
I emitted draft-7. And on the LangGraph side, the parity work surfaced a
real latent bug in my production agent: with a fallback provider chain
configured, the wrapped model silently loses `withStructuredOutput` and
every classification fail-softs. My fallback chain, the thing I built for
reliability, was quietly the least reliable path in the system. An
observation like that pays for the whole exercise.

## What each harness actually bought

The SDK port is about 1,300 lines of agent-scoped code against roughly
2,300 for the LangGraph equivalent. But the missing thousand lines aren't
free: they were the durable approval queue, per-node model configuration,
and hand-assembled context blocks that keep token usage flat. The SDK
absorbed my loop, my retries, my structured-output enforcement, and gave me
per-session cost as a first-class field. LangSmith still gives the LangGraph
build better per-stage telemetry than transcripts give the SDK build.

And the one nobody should let a comparison post skip: **the Agent SDK is
Claude-native.** My LangGraph agent runs on seven providers; its whole eval
history is a Gemini/Claude A/B story, and during this very parity run its
side executed free on Mistral after Gemini's daily quota ran out. That story
does not port. The MCP tools are portable; the harness is not. If provider
choice is a requirement, that single fact decides your framework before any
of the ergonomics matter.

## Where I landed

Different jobs, different harnesses. The SDK is what I'd reach for when the
loop is the commodity and the tools plus the gate are the product: I got a
working, permission-gated, MCP-served agent in a weekend, and the harness
caught one of my mistakes for me. LangGraph is what I'd reach for when the
control flow IS the product: durable pauses, explicit branches, provider
freedom, per-stage everything.

Both repos are public, both are small enough to read in a sitting, and the
parity table, transcripts, and full 12-point comparison are committed next
to the code. If you only read one artifact, read the transcript where the
model gets denied and adapts. That's the behavior that makes
human-in-the-loop agents worth building.
