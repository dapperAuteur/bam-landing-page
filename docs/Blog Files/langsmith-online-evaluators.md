<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Catch the Regression Before the User Does: Online Evaluators
Slug:    langsmith-online-evaluators
Excerpt: Offline evals only run when you remember to run them. Here is how we put
         a continuous quality monitor on Fit T. Cent's production traffic, so a
         bad answer trips an alert instead of a complaint.
Tags:    LangSmith, Evaluation, RAG, Observability, Multi-agent
Series:  Fit T. Cent Observability (2 of 6)
-->

# Catch the Regression Before the User Does: Online Evaluators

In the last post, a retrieval bug made the coach refuse a question it had plenty
of evidence to answer. We found it because a user told us. That is the part worth
fixing next: the feedback loop should not depend on a user being annoyed enough
to report a problem.

## Offline evals are necessary but not sufficient

Fit T. Cent ships with an evaluation suite you can run on demand. It pushes a
dataset of questions to LangSmith, runs the coach on each, and scores routing,
citations, and grounding. That is great before a release. The catch is the words
"on demand." Offline evals only protect you when someone runs them, and they only
cover the questions you thought to include.

Production traffic is different. It is full of phrasings you did not anticipate,
and it arrives at 2 AM when no one is running anything.

## Online evaluators score real traffic, continuously

An online evaluator is the same scoring logic, attached to the live trace stream
instead of a fixed dataset. Every coach run (or a sample of them) gets scored as
it happens. We started with two:

1. **Grounding.** The same LLM-as-judge we use offline: what fraction of the
   answer's claims trace back to a retrieved snippet? An ungrounded but confident
   answer is the most dangerous failure mode for a health coach, so this is the
   number we watch hardest.
2. **Empty-retrieval flag.** A cheap, deterministic check: did any specialist
   come back with zero sources, or does the answer contain a refusal phrase like
   "not able to locate source material"? That single rule would have caught the
   fall-prevention bug the moment it shipped.

## From score to signal

A score sitting in a dashboard is not yet useful. The second half is an
automation: when grounding drops below a threshold, or the empty-retrieval flag
trips, the run is pushed to a review queue and an alert goes out. Now the loop is
closed without a human in the path. The system tells you "this answer was weak,"
links you straight to the trace, and you decide what to do.

## Why this matters more for multi-agent systems

A single-model app fails loudly: it errors, or it says something obviously wrong.
A multi-agent coach fails quietly. The supervisor routes, a specialist retrieves
the wrong documents, the composer dutifully grounds in them, and the synthesizer
produces fluent prose that is subtly off. Nothing throws. Online evaluators are
how you make a quiet failure loud enough to notice.

## Takeaways

- Offline evals guard releases; online evaluators guard production.
- Start with two evaluators: a grounding judge and a dead-simple empty-retrieval
  flag. The cheap deterministic one earns its keep immediately.
- A score is not an alert. Wire the threshold to a destination you actually read.

Next in the series: turning the alerts and the thumbs-down button into a dataset
that grows itself.
