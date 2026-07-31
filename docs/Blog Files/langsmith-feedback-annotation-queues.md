<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Dataset That Grows Itself: Feedback and Annotation Queues
Slug:    langsmith-feedback-annotation-queues
Excerpt: A thumbs-down should not just vanish. Here is how Fit T. Cent turns user
         feedback into a review queue and then into permanent regression tests,
         so the coach gets measurably harder to break over time.
Tags:    LangSmith, Evaluation, Feedback, RAG, Multi-agent
Series:  Fit T. Cent Observability (3 of 6)
-->

# The Dataset That Grows Itself: Feedback and Annotation Queues

The previous post put automatic scoring on the coach's live traffic. Scoring
tells you something is wrong. This post is about what you do next, and how to
make sure the same mistake can never quietly come back.

## A thumbs-down is a test case in disguise

When a user taps thumbs-down on a coach answer, that is the single most valuable
signal the system can get: a real person, with a real question, telling you the
output missed. The worst thing you can do with it is let it disappear into an
analytics counter. The best thing you can do is turn it into a permanent test.

Fit T. Cent links every answer to its trace. When tracing is on, the coach knows
the LangSmith run id for the answer on screen. So a thumbs-down can attach
feedback to that exact run with one SDK call:

```ts
await client.createFeedback(runId, "user_score", { score: 0 });
```

Now the rating lives on the trace, next to the inputs, the retrieved documents,
and the generated answer. You can open it later and see exactly what happened.

## The annotation queue is the triage desk

Low-scored runs (from user thumbs-down and from the online evaluators in the last
post) get routed into an annotation queue: a focused review list, not a firehose
of every trace. A human skims the queue, confirms whether each one is a real
failure, and labels it. This is the step that keeps the loop honest, because not
every thumbs-down is a model problem. Some are user expectations, some are
genuinely out of scope. The queue separates signal from noise.

## Promotion: from "bad answer" to "regression test"

Here is the payoff. From the queue, a confirmed failure is promoted into the
evaluation dataset with a one-line note about why it is there. The next time the
eval suite runs, that case is checked automatically, forever. The fall-prevention
question is now a permanent member of the dataset; if a future change reintroduces
the bug, the experiment score drops and we see it before shipping.

This is what people mean by a dataset that grows itself. You do not sit down and
imagine every way the system could fail. You let real usage surface the failures,
and you capture each one as it appears. Over months, the dataset becomes a precise
map of the system's real-world edges, written by your users.

## Why the loop beats raw intuition

Without this, you fix a bug, feel good, and move on, and three refactors later it
silently returns. With it, every fix is pinned in place by a test that came from a
real failure. The coach does not just get fixed; it gets monotonically harder to
break.

## Takeaways

- Attach feedback to the run id so a rating is forever tied to its trace.
- Use an annotation queue to triage, so humans review signal, not noise.
- Promote confirmed failures into the dataset. The bug you fix today becomes the
  test that protects you tomorrow.

Next: iterating the prompt that decides which specialists to consult, without a
redeploy for every word you change.
