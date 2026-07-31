<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   What Does the Answer Cost? Latency and Spend Dashboards
Slug:    langsmith-monitoring-dashboards
Excerpt: Improving recall doubled the coach's embedding calls. Good trade, but
         only because we could see it. Here is how we watch cost and latency per
         node and per provider, so quality decisions stay honest.
Tags:    LangSmith, Cost, Latency, Observability, Multi-agent
Series:  Fit T. Cent Observability (5 of 6)
-->

# What Does the Answer Cost? Latency and Spend Dashboards

A few posts ago we fixed the coach's recall by retrieving on two queries instead
of one. That was the right move for quality. It also doubled the embedding calls
on every specialist. "Right move" is a claim, and claims about cost should be
backed by a chart, not a feeling.

## Multi-agent systems hide their costs

When one user question fans out to a supervisor, three or four specialists, and a
synthesizer, a single "answer" is really a dozen model and retrieval calls. The
cost and the latency are spread across all of them, which makes both easy to lose
track of. You notice the bill at the end of the month, and by then you cannot say
which change caused it.

Because the coach is fully traced, the raw material is already there: every run
records its latency and token usage, broken down by step. A dashboard just turns
that stream into something you can read at a glance.

## Three charts worth having

1. **Latency, per node.** Total time per run is the headline, but the useful view
   is per node: supervisor, each specialist, synthesizer. That is how you learn the
   honest truth, for example that one specialist's retrieval-plus-compose dominates
   the wall clock, so that is where optimization pays.
2. **Token cost, split by provider.** The coach lets you switch model providers
   from its admin panel. Spend shifts when you do. Splitting the cost chart by
   provider makes the price of "switch to the bigger model" visible immediately,
   instead of as a surprise later.
3. **Error and timeout rate.** Fan-out means more places to fail. A simple error
   rate chart catches a flaky provider or a slow tool before it becomes a pattern
   of bad user experiences.

## Tag your runs so the charts can group

The coach already carries a couple of runtime settings: which provider is active,
and whether it is serving the public corpus, the private one, or both. Tagging
runs with those values lets the dashboard group by them. Now you can answer
questions like "is the private corpus slower to retrieve against" or "what did the
provider switch actually cost," because the data is sliced the way your decisions
are made.

## Then set a budget

A dashboard you have to remember to look at is half a tool. The other half is an
alert: a threshold on p95 latency and on daily spend, so a runaway cost or a
latency regression pings you instead of waiting to be discovered. The dual-query
change passed this test easily, the recall gain was large and the added embedding
cost small, but we only get to say that because the numbers were on screen.

## Takeaways

- In a fan-out system, cost and latency hide across many calls. Break them down
  per node.
- Split spend by provider so model choices have a visible price.
- Tag runs with your real levers (provider, corpus mode) so charts match decisions.
- Pair every dashboard with a budget alert, or you will only see problems in
  hindsight.

Last in the series: deploying the graph itself, and stepping through it visually
when something goes wrong.
