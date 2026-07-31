<!--
Draft for the bam-landing-page blog. Authored for the database-backed blog;
paste the body into the admin blog editor (app/admin/blog) and use the fields
below. Staged here as a draft; not committed.

Title:   When the Coach Says "No Sources," But the Sources Are Right There
Slug:    when-the-coach-says-no-sources
Excerpt: A grounded multi-agent coach refused a fall-prevention question even
         though the studies were in its knowledge base. Here is the retrieval
         bug, the two-line fix, and how LangSmith made the diagnosis a
         ten-minute job.
Tags:    RAG, Retrieval, LangGraph, LangSmith, Multi-agent
-->

# When the Coach Says "No Sources," But the Sources Are Right There

## The symptom

A user asked Fit T. Cent, our multi-agent longevity coach, a simple question:

> What may I do to prevent falls as I age?

The coach came back with a polite non-answer. The specialists, it said, "were not able to locate source material that directly covers fall prevention, balance training, proprioceptive exercises, or lower-body strengthening protocols for older adults," and it suggested asking a physical therapist instead.

That would be a perfectly honest answer if the coach truly had nothing to say. The trouble is that our knowledge base contains dozens of peer-reviewed studies on exactly this topic. One of them is literally titled "A best practice fall prevention exercise program to improve balance, strength..." The sources were there. The coach just could not find them.

## Why a false "I don't know" is a real bug

Fit T. Cent is built on a strict rule: every claim in an answer must trace back to a retrieved source. That grounding discipline is the whole point of a health coach, because a fluent answer that is not backed by evidence is a liability, not a feature.

But grounding is only as good as retrieval. If the retriever misses documents that are sitting right there, the coach does the responsible thing (it refuses to make things up) for the wrong reason. A confident "no sources" erodes trust just as much as a confident wrong answer. So we treated it as a bug, not as a content request.

## Ruling out the boring explanations first

Two quick checks told us where not to look.

1. Is the content actually in the corpus? A search of the seeded knowledge files showed about 28 workout documents and about 30 corrective-exercise documents that mention falls, balance, gait, or aging. So this was not a content gap.
2. Was the corpus seeded into the live database? Yes. The operator had run the seed before asking the question. So it was not a stale-database gap either.

The content existed, and it was loaded. The failure was happening inside retrieval itself.

## The two real causes

**Cause one: the rewritten question drifted.** Our architecture uses a supervisor that rewrites the user's question into a focused sub-question for each specialist. "Prevent falls as I age" became:

> What strength training and exercise programming approaches are most effective for reducing fall risk in older adults?

That is a reasonable rewrite, but notice what it emphasizes: "strength training and exercise programming approaches." When you turn that sentence into an embedding (a numeric fingerprint of its meaning), it lands near generic strength-science papers, not near the balance and fall-prevention studies. The rewrite, meant to sharpen the question, quietly pulled retrieval off target. The short, plain user phrase "prevent falls as I age" actually embeds much closer to the fall-prevention research than the polished rewrite does.

**Cause two: the cutoff was too tight.** Each specialist retrieved only the top 5 nearest documents. Combine that small number with the drift above, and the few on-point fall studies ranked just past the edge and never made it into the answer.

## The fix

Two small changes, applied to every specialist.

1. Retrieve on the user's original words too, not just the rewritten sub-question, and merge the results by source. The original phrasing is a second, differently-aimed shot at the corpus.
2. Raise the cutoff from 5 to 8, so studies that rank sixth or seventh still make it in.

In code, the retriever went from a single query to a small merge:

```ts
const queries =
  alsoQuery && alsoQuery !== query ? [query, alsoQuery] : [query];
const seen = new Set<string>();
const out: Citation[] = [];
for (const q of queries) {
  const matches = await matchCoachKb(await embed(q), "workout_kb", 8);
  for (const m of matches) {
    if (seen.has(m.source)) continue;
    seen.add(m.source);
    out.push({ source: m.source, snippet: m.content, agent: "workout" });
  }
}
```

The user's original query is threaded through each specialist's state so the retrieve step can use both phrasings.

## The result

Same question, after the change. Both the workout and corrective specialists contributed, and the answer was specific and grounded:

> Preventing falls as you age comes down to consistently training the physical qualities that keep you stable and reactive: strength, core control, balance, and movement quality. Resistance training is one of the most important tools available... Research shows that even a modest program of single-set resistance exercises performed just twice a week for 12 weeks produced meaningful strength gains in older adults...
>
> Core stability training adds another important layer, because it develops the neuromuscular control and dynamic stability that help your body respond quickly to unexpected shifts in balance. Pairing core work with multicomponent neuromuscular training (which combines strength, balance, agility, plyometrics, and flexibility) has strong evidence for improving lower-extremity biomechanics and functional performance...

That is the answer the corpus could support all along.

## How LangSmith turns this into a ten-minute fix

The hardest part of a retrieval bug is that it is invisible from the outside. You see a bad answer, but you cannot see which documents the retriever pulled or how close they scored. This is exactly where tracing and evaluation earn their keep, and it is why Fit T. Cent ships with LangSmith wired in.

**1. Trace the failing run.** With tracing on, every coach run records a tree of steps. Open the failing run, expand the retrieve node, and you see the actual documents it returned and their similarity scores. The diagnosis ("it pulled motor-adaptation and muscle-fiber papers instead of balance studies") takes seconds, with no print statements and no guessing.

**2. Turn the bug into a test.** Add the failing question to the evaluation dataset with a short note about why it is there. This is the growing-dataset loop: every real failure becomes a permanent regression check.

**3. Measure the fix with an experiment.** A single command pushes that dataset to LangSmith and runs the evaluators: routing correctness, citation presence, and an LLM-as-judge grounding score that measures what fraction of the answer traces back to a retrieved snippet. The result is a tracked experiment you can open, diff, and inspect run by run. Run it before and after the change and compare the two side by side: the grounding score on the fall-prevention case jumps from near zero (a refusal grounds in nothing) to high. Now you have proof, not vibes.

**4. Watch for cost and regressions.** Retrieving on two queries instead of one doubles the embedding calls per specialist. LangSmith's latency and cost view shows the real impact so you can decide whether the recall gain is worth it (here it clearly is). Running evaluators on production traces, not just the offline dataset, catches the next drift before a user has to report it.

The pattern is general: tracing answers "what did it actually do," and evaluation answers "did my change make it better or just different." Together they convert a frustrating "why did it say that" into a trace you can read and a number you can move.

## Takeaways

- A confident "no sources" is a retrieval bug until you prove otherwise. Check that the content exists and is loaded before you touch the model.
- Query rewriting helps reasoning but can hurt retrieval. Retrieve on the user's own words too.
- A small top-k is a sharp cliff. Widening it is cheap recall.
- Observability is not optional for RAG. Without a trace of what the retriever returned, you are debugging blind.

Fit T. Cent is open source, and the design decisions behind it (per-agent retrieval, type-enforced specialist isolation, and the evaluation loop above) are walked through in the course that ships with the repo.
