<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Four Rules I Measured, Then Refused to Put in the Build
Slug:    guards-i-refused-to-build
Excerpt: A guard that cries wolf gets allowlisted into uselessness, which is
         worse than no guard. So before adding a rule to my lint, I ran it
         against the whole catalog and counted. Four of the rules I most
         wanted turned out to have zero true positives, no defensible
         threshold, or no answer that was not a judgment call.
Tags:    AI Agents, Testing, Quality, Engineering Judgment, Static Analysis, WitUS
Series:  Building an LMS With Agents (2 of 4)
-->

# The Four Rules I Measured, Then Refused to Put in the Build

[The previous post](/blog/guards-beat-instructions) argued that when you have several AI agents writing content in parallel, the only thing they genuinely share is the build, so anything you need to be true should be enforced there rather than in a prompt.

The obvious next move is to keep adding rules. That move is a trap, and this post is about the specific way it fails.

## The failure mode has a name in my repo

It is written into the header of `scripts/check-figures.ts`:

> Whether a caption is INSIGHTFUL is a judgment and is deliberately not gated: a guard that cries wolf gets allowlisted into uselessness, which is worse than no guard.

That is the whole risk in one sentence. A guard that produces false positives does not get fixed. It gets an allowlist, then the allowlist gets a habit, then someone adds an entry to make their branch green, and now you have a file that costs CI time and proves nothing. You would have been better off with no guard, because at least then nobody believes the property holds.

So the rule I ended up with is: **before a rule goes in the build, run it over the whole corpus and count what it catches.** Not a sample. The whole thing.

## The guard this was written for

Learners kept reporting the same defect wearing different clothes. A typed fill-in used for a civics date where multiple choice belongs. A typed open-answer drill on interpretive cultural history. A "check yourself" question left as a paragraph, which grades nothing and records nothing. Each got fixed one at a time until I noticed they were one root cause: the assessment **widget** did not fit the content wrapped inside it.

So I sat down to write `check-assessment-fit.ts` with eight candidate rules. Four shipped. Four did not, and the four that did not are the more interesting half.

## The four I refused, verbatim from the file

This block is in the header of `scripts/check-assessment-fit.ts`, because the reasoning is worth more than the rules would have been:

```
 * WHAT WAS DELIBERATELY REJECTED (measured against the catalog, not assumed)
 * -------------------------------------------------------------------------
 * - "A long free-text fill-in cannot be graded by string equality." Measured: the whole catalog has
 *   4 items whose shortest accepted answer runs 5+ words, and all four are Portuguese TRANSLATION
 *   drills where typing the sentence is the entire exercise. Zero true positives, four false ones.
 * - "Many `accept` variants mean the answer is unspellable." No threshold separates them: the
 *   best-authored bank in the repo (ai-b1-prompt-engineering) carries a four-variant accept list
 *   and is correct authoring.
 * - "The fill-in answer is a proper noun." Capitalisation is not a signal: sentence-initial words,
 *   acronyms and language courses all break it. That is judgment.
 * - "These options are not mutually exclusive" / "a reveal would fit better than scoring here."
 *   Pure judgment. Both are prompts in the advisory audit route instead.
```

Four different reasons to reject, and they are not interchangeable:

**Rule one had zero true positives.** I was certain about this one. A typed answer five or more words long cannot be graded by string equality, so it must be the wrong widget. The catalog contains four such items. All four are Portuguese translation drills where typing the sentence *is* the exercise. The rule was 0 for 4. If I had shipped it on conviction, the first thing it would have done is fail a correctly-authored language course.

**Rule two had no defensible threshold.** "A long list of accepted spellings means the answer is unspellable, so use multiple choice." Plausible. But the best-authored bank in the repo carries four accepted variants and is exactly right to. Two is fine, four is fine, and I could not name the number where it stops being fine without inventing it.

**Rule three had a signal that was not a signal.** "The answer is a proper noun" sounds mechanical. Capitalisation breaks on sentence-initial words, on acronyms, and on every language course in the catalog.

**Rule four was a judgment wearing a rule's clothes.** "Are these options mutually exclusive" has no mechanical form at all. I wanted it because it is the most useful of the eight. That is precisely why it does not belong in a build gate.

## Where the judgment went instead

None of that work is thrown away. It moved to the other side of a line I do not cross, stated in `src/lib/assessment-fit.ts`:

```ts
// This module holds ONLY the mechanically-decidable half, as pure text predicates with no I/O and
// no dependencies, so both halves of the guardrail can share one definition of the rules:
//
//   • scripts/check-assessment-fit.ts  — DETERMINISTIC, runs in `pnpm lint`, a ratchet. It walks
//     the authored course modules with the TypeScript AST to find each quiz explanation, option and
//     exercise item, then asks the predicates below whether that string is a violation.
//   • POST /api/courses/[id]/audit-assessment-fit — SEMANTIC, advisory, an instructor-tools button.
//     "Does this widget genuinely fit this content?" is a judgment, and per CLAUDE.md an LLM
//     verdict may never gate a commit, so that half can never run in lint.
```

The reason an LLM verdict can never gate a commit is not that models are bad at judgment. It is that they are non-deterministic, so the same tree could pass and then fail, and a build that flips on an unchanged tree is a build people learn to re-run until it goes green.

So the semantic half is a button an instructor presses. It is allowed to be wrong. It is not allowed to block anyone.

## The rules that survived had to be narrowed too

Passing the "is it mechanical" test is not enough. Here is the first shipped rule, in full, from `src/lib/assessment-fit.ts`:

```ts
// The DEFINITE article is required, which is what keeps ordinary prose out: "an owner always has a
// third option a tariff threat cannot touch" is a sentence about choices in the world, while "the
// third option reverses the real direction" is a pointer at a screen slot. Only the nouns "option"
// and "choice" count. "The first answer" is deliberately excluded: the AI courses use it to mean
// the model's first reply, which has nothing to do with option order.
const POSITIONAL_EXPLANATION =
  /\bthe\s+(?:first|second|third|fourth|fifth|sixth|last|final|top|bottom)\s+(?:option|choice)s?\b/i;

/**
 * A bare letter reference can only ever mean a slot: "option B", "answers A and C".
 *
 * The LETTER stays case-sensitive on purpose, and the whole pattern therefore cannot take the `i`
 * flag. A lowercase "a" is the indefinite article: "an owner always has a third option a tariff
 * threat cannot touch" would match "option a" and flag a perfectly ordinary sentence. Only the noun
 * varies in case, for a sentence-initial "Option B".
```

Every clause in those two comments is a false positive I found by running the draft over the corpus and reading what it caught. The definite article, the excluded noun "answer", the case sensitivity on the letter: three narrowings, each one costing real recall, each one bought by looking at output instead of reasoning about it.

The same sentence about the tariff threat appears in both comments because it is the sentence that broke both drafts. It is a quiz explanation in `scripts/data/labor-mexico-course.ts`, there is exactly one of it in the whole catalog, and it was worth two rule changes.

## What the surviving four actually check

Each is a runtime fact about a string, not an opinion:

| Rule | What is true at runtime |
|---|---|
| `positional-explanation` | Options shuffle every attempt, so "the first option is wrong" describes an order no learner saw |
| `positional-option` | Same shuffle, so an option reading "all of the above" points at nothing |
| `closed-set-fill-in` | A typed drill graded by string equality, on a bare number that multiple choice tests better |
| `prose-self-check` | A question left in prose is never graded and never recorded |

The third one has an explicit opt-out, `computedAnswer: true`, for the case where producing the number by hand genuinely is the skill. Every good guard needs one of those, and it needs to be a deliberate keystroke rather than an allowlist entry.

Measured this morning:

```
$ pnpm check:assessment-fit
Scanned 1031 files: 82 assessment-fit finding(s) (10 positional-explanation, 0 positional-option,
72 closed-set-fill-in, 0 prose-self-check); 59 file(s) grandfathered, 0 violation(s).
```

82 findings, all of them frozen in a per-file, per-rule ceiling. Nothing new can ship broken. 59 files still owe the fix.

## The part I am least comfortable with: guards have blind spots too

Restraint about which rules to add does not save you from a rule that is right but does not run. This comment sits in `scripts/seed-courses.ts`, and I put it there after finding both halves of it the hard way:

```ts
  // A GUARD BLIND SPOT worth knowing: `check-series-codes` only parses literal `seedAuthoredCourse({...})`
  // calls, so it cannot see codes set through this loop (they arrive as variables). The complementary
  // gap exists in `check-standards-coverage`, which only sees the shorthand `{ slug: "..." }` form and
  // not the literal calls. Between them every course is covered by one guard and no course by both.
```

The size of that gap is measurable, so here it is. `scripts/seed-courses.ts` contains 226 distinct course slugs. The regex the standards guard uses to find them is:

```ts
const registered = [
  ...new Set([...seed.matchAll(/\{\s*slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1])),
];
```

That matches 138 of them. When the guard reports "133/138 courses aligned," the denominator is not the catalog. It is the subset of the catalog written in one of two registration styles. Eighty-eight courses are invisible to it, and several `BACKLOG` entries in that file are annotated `INERT` for exactly this reason: someone wrote down the standards decision for a course the guard will never ask about.

I have not fixed it, and I want to be clear that "I wrote a guard" is not the same claim as "the property holds." The guard holds over what it can parse. Knowing the shape of what it cannot parse is the difference between a guardrail and a comfort blanket.

## Three things worth stealing

**Measure the candidate rule against the whole corpus before you ship it.** Not a sample, and not your intuition about the corpus. Half my candidate rules died on contact with the actual data, and the one I was most certain about went 0 for 4.

**Split deterministic from semantic, and let the semantic half be advisory.** The judgment calls are usually the valuable ones. They just cannot be allowed to block anyone, because a non-deterministic gate teaches people to re-run the build.

**Write down what the guard cannot see, in the file it cannot see.** A blind spot you have documented is a known limitation. The same blind spot undocumented is a false sense of coverage, and false coverage is how the standards ratchet ended up with a denominator I could not defend.

Next in this series: [the part none of this touches](/blog/verification-is-the-bottleneck), which is whether any of the content is true.
