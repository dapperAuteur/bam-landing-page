<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Crash Test and the Dashboard Light: Offline Evals vs Online Evaluators
Slug:    offline-evals-vs-online-evaluators
Excerpt: My eval harness catches problems in the lab. Should the same checks
         also run against live traffic? What porting one criterion from offline
         to online actually buys, costs, and replaces.
Tags:    Evals, LangSmith, Observability, AI Agents, Decision Log
Series:  Fit T. Cent Eval Findings (3 of 3)
-->

# The Crash Test and the Dashboard Light: Offline Evals vs Online Evaluators

The first two posts in this series were about *what* my eval harness caught (uncited advice, missed safety escalations) and *how hard* to enforce the fixes. This one is about **where the checking should live** — because "test your AI" turns out to mean two different activities, and confusing them wastes money in one direction and misses failures in the other.

## Two kinds of checking

**Offline evals — the crash-test lab.** A frozen set of test cases (mine has 21 for the coach), run on demand, scored against explicit properties by deterministic code plus an LLM judge, compared against a stored baseline. Nothing here touches real users. Like crash-testing: you learn an enormous amount, on your schedule, at a cost you control — but only about the crashes you thought to stage.

**Online evaluators — the dashboard light.** Checks that run against **live traffic**: real user questions, sampled as they happen, scored in the background (in my stack, LangSmith online evaluators — small LLM-as-judge jobs attached to production traces). Nothing blocks; you get a signal on what's *actually* happening, including the questions no test-writer imagined. Like the check-engine light: it won't stop the car, but it tells you something's wrong *while you're driving*, not at next year's inspection.

The two answer different questions. Offline: *"did my change make things better, and did anything regress?"* — impossible to answer from live traffic, because live traffic never asks the same 21 questions twice. Online: *"is the thing I fixed staying fixed for real users?"* — impossible to answer from the lab, because the lab only contains my imagination.

## The concrete decision

I'm porting the **cite-or-drop criterion** — every substantive recommendation carries a citation — from the offline harness's rubric into a LangSmith online evaluator that samples production traces. The question I owed myself before doing it: what does this buy over each alternative?

**Vs. not doing it (offline only).** The offline harness proves the fix worked *on August 3rd's 21 questions*. Then the world moves: I'll tweak a prompt for an unrelated reason in October, a provider will silently update a model, users will ask question-shapes my fixtures never staged. Offline-only means I discover the regression at the *next* deliberate eval run — which history says happens when something already feels wrong. The online evaluator turns "feels wrong" into a dated, quantified drift line: citation coverage was ~95% through September, dipped to 80% the week I changed X. That's the difference between an autopsy and a diagnosis.

**Vs. relying on the mechanical check alone.** Fair challenge: if post 1's interlock ships, uncited advice *can't* reach users — so what's left to watch? Two things. First, the interlock is a heuristic (sentence-split + coverage), and the online judge checks something subtler: whether citations are *apt*, not merely present — the gaming failure the interlock can't see. Second, the online evaluator *measures the interlock itself*: how often the revision loop fires in production is exactly the latency-cost data the interlock decision needs. The gate and the gauge aren't rivals; the gauge is how you find out the gate is working.

**Vs. human review (annotation queues).** I already have LangSmith annotation queues — me, reading sampled traces. Humans catch things judges can't name yet; that stays. But human review doesn't scale and doesn't run at 2am. The honest division of labor: automated online evaluator for the *known, named* criteria; human queue for discovering criteria I haven't named. Each feeds the other — annotation findings become tomorrow's evaluator criteria.

## What it costs

Real talk, since this series is partly a decision log:

- **Judge tokens on live traffic.** Every sampled trace costs a small judge call, forever. The lever is the **sampling rate** — at my current traffic (this is an admin-gated app; the audience is me and a waitlist) even 100% sampling is pocket change, and the config knob exists for the day that changes.
- **A rubric to keep in sync.** The offline rubric and the online evaluator's prompt now express the same criterion in two places. Drift between them would make the numbers quietly incomparable — the same disease my product registry had before I gave it a CI check. Mitigation: derive both from one source, or at minimum cross-reference them in comments so no one edits one without the other.
- **The judge-consistency trap** (from the economics discussion that shaped this cycle): my offline baseline is judged by a strong model; if the online evaluator uses a cheap judge, the two numbers will disagree — by up to tens of points, as my free-vs-strong judge comparison showed — without either being "wrong." Rule: never compare a number across judges; track each judge's line against itself.

## The pattern worth stealing

If you're building anything agent-shaped, the full loop looks like this, and each stage earned its place in my stack this month:

1. **Offline harness** — staged cases, frozen baseline, regression diffs. (Proves changes.)
2. **Mechanical gates** — in-code enforcement of the properties that must never fail. (Prevents the known worst cases.)
3. **Online evaluators** — the same named criteria, sampled against reality. (Detects drift and gaming.)
4. **Human annotation** — discovers the criteria you haven't named yet. (Feeds stage 1.)

Lab, seatbelt, dashboard, mechanic. None replaces another; each covers the failure mode the others structurally can't see.

## Further reading

- LangSmith evaluation docs (online evaluators, datasets, annotation queues): https://docs.smith.langchain.com
- Anthropic. (2024). *Building effective agents.* https://www.anthropic.com/research/building-effective-agents
- Posts 1 and 2 of this series: the mechanical-check decision and the safety-escalation line. The full eval teardown, with before/after numbers, lands after the re-run.
