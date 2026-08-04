<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Ask the Model Nicely, or Make the Mistake Impossible?
Slug:    prompt-fixes-vs-mechanical-checks
Excerpt: My eval harness caught my AI coach giving uncited advice in 9 of 21
         test cases. There are two ways to fix that — ask harder, or build a
         gate the mistake can't get through. Here's how I think about choosing.
Tags:    AI Agents, Evals, Reliability, Citations, Decision Log
Series:  Fit T. Cent Eval Findings (1 of 3)
-->

# Ask the Model Nicely, or Make the Mistake Impossible?

My eval harness just handed me a number I didn't love: my multi-agent health coach cited its sources properly in only **57% of test cases**. The specialists retrieve and cite well for the core answer — then tack on friendly closing advice ("treat sleep with the same priority as training") with no citation behind it. Nine of twenty-one cases.

Now I have to fix it, and the fix comes in two sizes. This post is me thinking out loud about which size to pick — because the choice between them is one of the most useful ideas in software engineering, and it applies far beyond AI.

## The two sizes of fix

**Size 1 — the prompt fix.** I edit each specialist's instructions: *"Cite-or-drop: every substantive recommendation either carries a citation from your retrieval set, or you cut it."* This is asking the model, firmly, to behave. Cost: nearly free. Ten minutes of editing, no new code, no added latency.

**Size 2 — the mechanical check.** Same prompt edit, *plus* a small piece of ordinary code that runs before a specialist's answer leaves its subgraph: split the answer into sentences, check every claim-bearing sentence against the citation list, and if uncited claims remain, send the answer back for one revision. Cost: real code to write and test, and sometimes an extra model call of latency when a revision triggers.

A **subgraph**, if you're new here, is one specialist's private workflow inside the larger agent — think of each specialist as a department with its own little assembly line.

## "Make illegal states unrepresentable"

The phrase I keep reaching for comes from the programming-languages world — popularized by Yaron Minsky at Jane Street: **make illegal states unrepresentable**. Instead of writing rules that say "please don't create a bad state," design the system so the bad state *can't be constructed at all*.

Everyday version: a seatbelt chime versus a car that won't shift out of park until you buckle. The chime asks. The interlock makes the unbuckled drive-away *not a thing that can happen*. Or: a spell-checker underlining your typo versus a web form that won't submit until the email field contains an email. Ask versus enforce.

The prompt fix is the chime. The mechanical check is the interlock.

I've been here before, outside of AI. Last month I traced two production sign-in outages to drift between my product registry and my OAuth client list. I didn't fix it by writing "keep these in sync" in a doc — I wrote a build check that fails CI when they drift. The class of outage is now unrepresentable. That fix has already paid for itself in sleep.

## Why prompts alone are a chime

LLMs are probabilistic. A prompt instruction shifts the *distribution* of behavior — usually a lot. But "usually" is the operative word: the model complies on most runs and lapses on some, and you don't control which. For low-stakes style preferences, that's fine. For a property I'm publicly claiming ("my coach cites its sources"), *usually* means my eval will keep finding the 9-of-21 tail forever, just at a lower rate.

The mechanical check changes the category of the guarantee. Uncited advice doesn't reach the user *even on the model's worst day* — it gets caught by boring, deterministic code that doesn't have days.

## The honest case against the mechanical check

If the interlock were free, everyone would build it every time. It isn't:

- **Latency.** A triggered revision adds a model call to that specialist's turn. If revisions trigger often, users feel it.
- **A new moving part.** Sentence-splitting and claim-detection are heuristics — code I must test, tune, and maintain. A dumb claim-detector that flags "drink water" as needing a citation would make answers *worse* (stilted, over-hedged) while my dashboards said things were better.
- **Metric fixation risk.** Checks aimed at a metric can teach the system to satisfy the letter and miss the spirit — citations slapped onto sentences to pass the gate, whether or not the source really supports the claim. (The eval's independent judge is my defense here: it checks whether citations are *apt*, not just present.)

## The alternatives map

| Option | What it is | Why I'm not choosing it (or am I?) |
|---|---|---|
| Prompt-only | Cite-or-drop instruction, nothing else | Cheapest; may work. But the failure was *systematic*, not a fluke, and I'd be re-measuring forever |
| Prompt + mechanical check | The interlock: coverage check + one forced revision | The candidate. Guarantee changes category; costs latency + a heuristic to maintain |
| Second-model verifier | A separate LLM judges each answer's citations before release | Stronger claim-detection than a heuristic, but doubles cost/latency on *every* turn, and now a model guards a model |
| Fine-tuning | Train the behavior in | Heavyweight, slow loop, and I lose the ability to adjust with a text edit |
| Do nothing + monitor | Accept 57%, watch the dashboard | Defensible for cosmetic issues. Not for the property that IS the product's credibility — a *cited* health coach |

## Where I land (pending my own review)

Prompt fix ships regardless — it's free and it'll move the number. The real decision is the interlock, and my instinct says yes: this is a health product, citations are its spine, and the failure showed up in 43% of cases. That's not a flake; that's a distribution. Distributions get fences, not requests.

The plan: ship both, re-run the same 21-case eval against the frozen baseline, and let the before/after numbers — including how often the revision loop actually triggers — make the final argument. If the revision rate is high enough to hurt latency, that's its own finding, and its own post.

## References

Minsky, Y. (2011). *Effective ML.* Jane Street Tech Blog. https://blog.janestreet.com/effective-ml-revisited/

Anthropic. (2024). *Building effective agents.* https://www.anthropic.com/research/building-effective-agents
