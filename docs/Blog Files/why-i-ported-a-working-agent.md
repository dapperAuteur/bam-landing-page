<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Why I Ported a Working Agent to a Second Framework
Slug:    why-i-ported-a-working-agent
Excerpt: My triage agent worked fine on LangGraph. I rebuilt it on the Claude
         Agent SDK anyway. The port cost a weekend and paid for itself three
         ways: a lock-in audit for a three-agent ecosystem, a migration
         playbook with real parity data, and two production bugs the original
         had been hiding.
Tags:    AI Agents, Claude Agent SDK, LangGraph, Strategy, Ecosystem, WitUS
-->

# Why I Ported a Working Agent to a Second Framework

I run three LangGraph agents in production across my ecosystem: a triage agent that classifies inbound form submissions with a human approval gate, a field reporter that drafts travel lessons and critiques its own work, and a multi-specialist health coach. They work. Nothing was on fire.

So the reasonable question about my newest repo, a rebuild of the triage agent on the Claude Agent SDK, is: why port a working system to a second framework at all?

Because "it works" answers a different question than "what does it cost me to depend on it." This post is the ecosystem case for paying a weekend to find out.

## Reason one: a lock-in audit you can only run empirically

Every framework choice is a quiet accumulation of dependency. After three agents on LangGraph, I owed myself an honest answer to a question no blog comparison could settle: if I ever needed to move, what actually moves, and what has to be rebuilt?

The port answered it with specifics instead of vibes. My Zod schemas and database tools transferred nearly verbatim; that layer turns out to be mine, not the framework's. The orchestration layer (graph topology, state channels, checkpointing) did not transfer at all; the SDK owns its loop, and my flowchart dissolved into a system prompt plus tool permissions. And one thing cannot port on principle: my Gemini-versus-Claude A/B setup, because the Agent SDK is Claude-native. That last fact is neither good nor bad. It is a price tag, and now I know the number instead of guessing it.

The audit generalizes. The parts of my other two agents that would survive a migration are now identifiable by inspection, which changes how I build new ones: judgment and schemas in portable modules, framework glue kept thin.

## Reason two: the same agent, measured twice

Because both implementations answer the same requests against the same database, I could run them head to head on identical fixtures. Five cases: agreement on every classification, agreement on four of five proposed actions. The one disagreement was not a bug. Facing a high-priority bug report, the LangGraph build drafted a reply while the SDK build escalated to a human. Two defensible judgments, surfaced only because two systems looked at the same input.

That parity harness is now a permanent asset. Any future framework question in this ecosystem ("should the coach move? is version N+1 safe?") starts from a template that already exists: fixtures in, decisions out, diff the table. Migration debates become measurements. I also now have real per-run cost numbers for the SDK version, which turns "the new framework is probably fine" into a line item.

## Reason three: the port audited the original

The surprise dividend. Rebuilding a system forces you to re-read it with fresh suspicion, and the port surfaced two latent bugs in the production LangGraph agent that had been invisible precisely because they live in failure paths. Its provider-fallback wrapper silently drops structured-output parsing, so a fallback run degrades quietly instead of loudly. And one configured fallback model id no longer exists at its provider, meaning the safety net had a hole exactly where it would be needed. Both are filed and will be fixed in the original.

I keep relearning this lesson in different costumes: the second implementation of anything is an audit of the first. I saw it when an eval harness graded my coach, when an MCP server exposed drift in an API spec, and now when a framework port exposed a fallback path that only pretended to work.

## What the ecosystem actually gained

One weekend bought: a costed answer to the lock-in question for a three-agent portfolio, a reusable migration-evaluation harness with baseline data, two production bugs found before they mattered, transcripts of a human approval gate working on a second runtime, and a build whose write-tools default to dry-run, which is how I wish I had built the original.

The port is not replacing the production agent. It is the control group my ecosystem did not have: proof that the architecture is bigger than the framework it happens to run on, and a standing answer to "what if we had to move" that cost two days instead of being discovered during an emergency.

If you run agents in production, you do not need my conclusion. You need your own parity table. The repo is MIT licensed and the harness pattern fits in an afternoon.
