<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Tuning the Router Without a Redeploy: Prompt Playground and Versioning
Slug:    langsmith-prompt-versioning
Excerpt: The coach was sending a falls question to the wrong specialist. Fixing
         that meant changing a prompt, and changing prompts blind is how you trade
         one bug for another. Here is the measured way to do it.
Tags:    LangSmith, Prompts, Routing, Multi-agent, Evaluation
Series:  Fit T. Cent Observability (4 of 6)
-->

# Tuning the Router Without a Redeploy: Prompt Playground and Versioning

When we fixed the fall-prevention retrieval bug, a second issue was hiding behind
it. The coach's supervisor routed "how do I prevent falls as I age" mostly to the
workout specialist, when the corrective-exercise specialist holds the most balance
and fall research. The answer got better once retrieval improved, but the routing
was still not ideal. Fixing routing means changing a prompt, and that is its own
kind of trap.

## Why editing prompts blind is dangerous

A prompt is the least version-controlled, least tested part of most AI systems.
Someone tweaks a sentence, it seems better on the one example they tried, they
ship it, and three other behaviors quietly shift. With a multi-agent router the
blast radius is large: the routing prompt decides which specialists even get
consulted, so a careless edit can starve a whole domain of questions.

The fix is to treat prompts like code: edit them against real inputs, version
every change, and measure before you ship.

## The Playground: edit against the real trace

LangSmith's Playground lets you open the actual supervisor step from a real traced
run. The inputs are already loaded: the user's question and the current routing
prompt. You change a line, re-run, and see the new routing decision immediately.
No redeploy, no waiting, no guessing about what the inputs were. You are not
testing your prompt against an imagined example; you are testing it against the
exact case that misbehaved.

## The Prompt Hub: versions you can diff and roll back

Every promising candidate gets saved to the Prompt Hub under a name like
`coach-supervisor-routing`. Each save is a version. You can diff two versions to
see precisely what changed, and you can roll back instantly if a "better" prompt
turns out worse in the wild. Prompts stop being a mystery string buried in the
codebase and become a tracked artifact with history.

## Measure before you promote

This is the step that separates tuning from flailing. Before a new routing prompt
ships, run it against the evaluation dataset. The coach's routing evaluator already
scores whether the correct specialists were selected for each case. So the question
"did my prompt change help" gets a number, not a vibe: the routing score on the
falls and balance cases should go up, and nothing else should go down. If a change
fixes one case and breaks two, the experiment shows it, and you do not ship it.

## A note on where prompts should live

There is a real choice here. You can pull the chosen prompt from the Hub at runtime
(so you can change behavior without a deploy), or keep prompts in code and use the
Hub purely as the iteration and version workspace. For a system that doubles as a
teaching artifact, we lean toward code as the source of truth (reproducible, diffed
in normal pull requests) and the Hub as the place you experiment. Different products
will weigh that differently; the point is to decide deliberately.

## Takeaways

- Prompts deserve the same discipline as code: real inputs, versions, tests.
- The Playground edits against the actual failing trace, so you tune the real case.
- The Prompt Hub gives you diffs and rollbacks.
- Always score a prompt change against the dataset before promoting it.

Next: what all of this costs, and how to watch latency and spend as the system
grows.
