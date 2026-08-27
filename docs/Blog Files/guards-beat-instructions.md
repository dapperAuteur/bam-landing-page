<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   "Write Good Quizzes" Is Not a Specification. A Failing Build Is.
Slug:    guards-beat-instructions
Excerpt: My course-authoring guides covered distractor design from the
         repository's second day. Nobody ignored them. Four weeks later I
         measured, and 307 of 355 quiz banks could be passed by clicking the
         longest option without reading the question. The instruction was
         written down. The property was not in the build.
Tags:    AI Agents, Testing, Assessment, Quality, Engineering Judgment, WitUS
Series:  Building an LMS With Agents (1 of 4)
-->

# "Write Good Quizzes" Is Not a Specification. A Failing Build Is.

I have spent about two months building Learn.WitUS.Online, a multi-tenant LMS, mostly with AI agents working in parallel. The repository is at 1,947 commits since its first one on 2026-06-28. As of today it audits 260 courses.

Distractor design was in the course-authoring guides from 2026-06-29, the repository's second day (commit `ce9a73c`), and every agent brief since has carried a set of non-negotiables that includes the quiz rules. Nobody ignored any of it. Not one agent ever wrote a question with three joke distractors and one real answer.

Four weeks later I measured, and 307 of 355 quiz banks could be passed by a learner who clicked the longest option without reading the question.

## The thing an instruction cannot do

The reason is not that agents ignore instructions. It is that "do not make the correct answer obvious" describes an outcome, and the outcome is a statistical property of a whole array of questions that nobody, human or model, can perceive while writing any single one of them.

Here is the mechanism, and it is entirely innocent. The correct answer is the one the author cared about, so it collects the qualifier, the date, and the "because" clause. The three wrong answers only have to be wrong, so they stay short. Question by question, that is good writing. Bank by bank, it is a tell.

The first measurement, on 2026-07-24, looked like this:

| | |
|---|---|
| Quiz banks of 8 or more questions | **355** |
| Over the 60% limit | **307** |
| At 90-100% | **~155** |
| Files affected | **138** |
| Questions involved | roughly **4,000** |

That is not a few bad agents. It is a house authoring habit, and it was strongest in exactly the courses that had been generated fastest.

## What shuffling does and does not fix

The sibling defect is the position tell: the correct answer sitting at the same index over and over, so a learner scores well by clicking C every time. That one has a one-line fix, and the fix is now the default in `src/lib/quiz.ts`:

```ts
    // Shuffle by DEFAULT, so a retake never shows the correct answer in the same slot it was last
    // time (a learner who saw it at "C" cannot coast on position). Scoring is by original index
    // server-side and questionKey is prompt-derived, so shuffling changes no score and no history.
    // A bank opts OUT only with an explicit `shuffleOptions: false`, reserved for the rare question
    // whose options must keep a fixed order; the catalog avoids positional options ("all of the
    // above", "A and B") as an authoring rule, so that case is essentially theoretical here.
    shuffleOptions: content.shuffleOptions ?? true,
```

Shuffling defeats a position tell completely. It does **nothing** to a length tell, because length travels with the option text wherever the shuffle moves it. A learner who has noticed that the fat answer is usually right does not care what slot it is in.

That distinction is why there are two guards instead of one. Same class of defect, two symptoms, and the cheap fix for one is irrelevant to the other.

## The metric had to be honest before anyone would keep it

My first draft of the length check counted "questions where the correct option is strictly longest." That is the obvious metric and it is wrong, because it scores a one-character edge exactly like a seventy-seven-character edge. A guard that fires on a difference no learner can see gets dismissed as noise in about a week, and then it gets disabled.

What shipped measures the expected score of the strategy "always pick the visibly longest option," which is the number a learner actually gets. From `scripts/check-longest-option.ts`:

```ts
/** Length difference a learner cannot see: options within this of the longest read as the same size. */
const MIN_VISIBLE_GAP = 8;
/** ...or within this fraction of the longest, so the gap scales with how long the options are. */
const VISIBLE_FRACTION = 0.1;

/** How many options a learner scanning for "the longest" would actually be choosing between, and
 *  therefore what always-pick-longest scores on this question. */
function longestStrategyValue(lens: number[], correct: number): { value: number; visible: number } {
  const max = Math.max(...lens);
  const margin = Math.max(MIN_VISIBLE_GAP, max * VISIBLE_FRACTION);
  const visible = lens.filter((l) => l >= max - margin).length;
  return { value: lens[correct] >= max - margin ? 1 / visible : 0, visible };
}
```

A bank whose options are all about the same length scores roughly `1/options`, which is exactly what guessing scores. A bank whose right answer is visibly the fattest scores 1.0. The limit is `max(0.60, 1/options + 0.25)`, deliberately identical to the position guard, so a true/false bank is judged against 75% instead of failing for being true/false.

Tightening the metric this way moved the result from 316 failing banks to 313. That non-result is itself the finding: **the gaps were large, not marginal.** Nobody was being convicted on a rounding error.

## The ratchet, which is the actual design decision

Failing 138 files on the day the guard ships means the guard gets commented out of `pnpm lint` the same afternoon. So the guard records the current state and refuses regressions:

```ts
/**
 * Files authored before this guard existed, with the score measured when it was added. They do not
 * fail, but they may not get worse. DELETE an entry once its file is fixed; the list shrinking is
 * the progress bar. Do not add to this list to make new content pass.
 */
const GRANDFATHERED: Record<string, number> = {
};
```

That empty object is the whole story of the last five weeks. It held 138 entries on 2026-07-24. Six of the eleven purpose-built guards in this repo work this way, and each one carries some version of that comment, including the sentence forbidding the obvious abuse.

The mechanic matters more than the metric. A recorded score is a **ceiling**, not an exemption: if a grandfathered file gets worse, it fails. Debt can only shrink. And a file with no entry has to be clean, so every new course an agent writes is held to the finished standard on its first commit, while the backlog gets paid down at whatever pace is affordable.

## What the fix actually looks like

There is no one-line repair. The distractors have to earn their length, which means giving them the same specificity the right answer has. Here is a real hunk from `scripts/data/chess-course.ts`, commit `9a7da5d`:

```diff
           {
             prompt: "Are the familiar point values (queen 9, rook 5, pawn 1...) part of the FIDE Laws of Chess?",
             options: [
-              "Yes, Article 3 lists them",
-              "Yes, but only for tie-breaks",
-              "No, they're a coaching convention; the rulebook assigns no values",
-              "No, FIDE uses a different official scale",
+              "Yes, Article 3 lists them as Q9 R5 B3 N3 P1",
+              "Yes, but only for tie-breaks and adjudication",
+              "No, it's a coaching convention, not in the Laws",
+              "No, but FIDE's official scale ranks bishop over 3",
             ],
             correctIndex: 2,
```

The correct answer got shorter. The wrong ones got specific enough to be worth considering, and each is still definitively wrong. That commit took the chess banks from 100/96/95/93/83/53 percent to 22/24/23/26/25/27.

Two rules govern every one of those edits, and both are about not damaging learner data:

- **Edit option text in place.** Never reorder options, never move `correctIndex`. Stored attempts keep the chosen index, so a reorder silently rewrites what past learners answered on the results replay.
- **Never edit the prompt.** `questionKey` hashes the prompt alone, so a reword starts a fresh per-question history for everyone who already answered it. Option text is not hashed, which is exactly why this fix is safe and the tempting one is not.

The thing you must not do is pad the distractors with filler. That trades a length tell for a nonsense tell, and the padding reads as wrong on sight.

## Where it stands, measured today

```
$ pnpm check:quiz-balance
Scanned 1031 files: 751 quiz banks, 711 of 8+ questions (625 shuffle, 476 skewed), 0 violations.

$ pnpm check:longest-option
Scanned 1031 files: 711 quiz banks of 8+ questions, 0 over the 60% length-tell limit (0 file(s) grandfathered), 0 violations.
```

The catalog roughly doubled in quiz banks while the debt went to zero, which is the property the ratchet was built to produce. Both of those were run on 2026-08-27 against the branch I was working on.

I am not claiming the quizzes are good. I am claiming a specific, measurable way of being bad is now impossible to ship, and that is a much smaller claim than the first one.

## The part that generalizes

**An instruction is enforced by the model's attention. A guard is enforced by the exit code.** When you are running several agents in parallel and none of them can see each other's work, the only thing they genuinely share is the build. Anything you actually need to be true should live there.

**Write the metric a skeptic would accept before you write the guard.** My first version would have been correct about the direction and wrong about the size, and being wrong about the size is how a guard earns a reputation for crying wolf.

**Ratchet, do not wall.** A guard that fails 138 existing files on day one is a guard nobody will keep. A guard that freezes the debt, forbids regressions, and holds all new work to the finished standard gets to stay, and the allowlist shrinking is a progress bar you can point at.

**And then be careful about what you add next.** Two of the four candidate rules I most wanted for the third guard turned out to be worthless when I measured them against the actual catalog. That is [the next post](/blog/guards-i-refused-to-build).
