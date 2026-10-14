<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Fixing One Quiz Tell Created Its Opposite
Slug:    fixing-one-quiz-tell-created-its-opposite
Excerpt: My build already failed any quiz bank where the right answer was
         usually the longest option. The advice written to beat that guard
         overshot: across the catalog, the right answer became usually the
         shortest. Fixing that moved it to second-shortest. Here is the guard
         that finally asks the right question, how a batch of fixes is checked,
         and the two times my own commit messages got the count wrong.
Tags:    Assessment, Testing, AI Agents, Quality, Engineering Judgment, WitUS
-->

# Fixing One Quiz Tell Created Its Opposite

In [an earlier post](/blog/guards-beat-instructions) I described a guard in my LMS's build that fails any quiz bank a learner could pass by clicking the longest option without reading. It worked. That debt went to zero.

This is the sequel, and it is less flattering.

## The advice was the bug

To beat the longest-answer guard, the authoring advice became: write the correct option short and the distractors long. I wrote that advice down myself, in [a post about assessment gaps](/blog/assessment-gaps-measured-not-read), as a lesson about authoring order. It also went into course file headers, where the next agent to work on that course would read it.

It worked too well. On 2026-10-07, while verifying the quiz banks for two new fiber courses, the agent noticed the right answer kept being the shortest option. So it measured the whole catalog, using the same population the longest-answer guard scans: every quiz bank of 8 or more questions.

| Measure | Value |
|---|---|
| Courses with banks of 8 or more | 277 |
| Questions | 35,264 |
| Correct option strictly the shortest, overall | 63% |
| Banks above 60% | 392 of 1,073 |
| Courses with at least one bank above 60% | 73 |

At least ten courses sat at 100 percent. In a bank like that, a learner who always clicks the shortest option scores 100 percent without reading a word. My own Knot-Tying course was at 96 percent.

Shuffling the options does not help, for the same reason it never helped with the longest tell: length travels with the text.

The root cause was still sitting in the files. Forty-five course headers told authors to write correct options short.

## Three ways to fix it

The bug note offered three options, as these notes always do, because the content call is mine:

- **A.** Make the guard symmetric, as a ratchet: record today's failing banks at their measured score, so none can get worse and no new bank can ship with the tell. Small; stops the bleeding; fixes nothing that already shipped.
- **B.** Rewrite the worst banks, with every edit checked. Expensive.
- **C.** A, then B, worst first.

That is what happened. The shortest-answer guard shipped with 374 banks over the line in 70 files, all recorded. The sizing pass estimated about 7,600 question edits to bring every bank down to about 55 percent.

## How a batch works

Each batch is one workflow:

1. A **fixer** edits option text only, never a prompt and never the answer key, and re-runs both length guards until every bank passes.
2. A **second reader** re-reads every edit against the lesson it tests, and repairs any edit that broke the meaning.
3. A **mechanical check** compares each file with the last commit and proves every prompt, every correct-answer index, and every option count is unchanged.
4. The orchestrator spot-checks, removes the fixed files from the grandfathered list, runs lint and tests, and commits.

Step 3 exists because the rules about learner data are not negotiable. A question's history is keyed to a hash of its prompt, so a reworded prompt resets history for everyone who answered it. Stored attempts keep the index the learner chose, so a moved answer key would rewrite what past learners answered. A script that diffs against git does not get tired on file forty.

Step 2 exists because the fixer is chasing a number. In the first batch (8 files, 109 questions, 196 options edited), the second reader repaired 14 edits:

- three that **leaked another question's answer**, so fixing one question's length handed the learner the answer to a different question;
- one that **understated a patent's scope**;
- distractors **shortened until they were arguably true**, which turns a wrong answer into a second right one;
- and plain filler padding.

Every one of those passed the length guards. Every one of them broke the quiz.

## Then the third tell

After that batch, the agent ran a measurement nobody had asked for: how often the correct option sat in the **shorter half** of its options. In most of those banks it had been 83 to 100 percent. In one course, it was 11 or 12 of 12 questions in every bank.

Fixing the shortest tell had mostly moved correct answers to second-shortest, which leaves the shorter-half share right where it was. A learner who rules out the two longest options still beats chance.

That is the honest problem with guarding extremes. "The correct answer is never the longest and never the shortest" is itself a tell. Rule out the two extremes and you are choosing between two.

## Full balance

So I changed the scope. On 2026-10-14 I chose full balance, and a third guard went into the build. For each bank it scores four strategies: always pick the shortest option, the second-shortest, the second-longest, or the longest. Options within 8 characters or 10 percent of each other count as the same size, because a learner cannot see that difference. A bank fails when its best strategy beats chance by more than 15 points, which is 40 percent on a four-option bank where guessing scores 25.

The goal in the guard's header is not "never an extreme." It is that "across a bank the correct answer is as often long as short." Options of equal length score exactly chance on every strategy, which is the ideal.

The baseline was worse than either earlier guard: 547 of 1,018 banks over the line, in 129 files, all recorded. The rough estimate is about 12,400 edits. The shortest-only campaign folded into this one, since its 70 files were a subset of the 129.

## Where it stands on 2026-10-14

| | Files off the list | Questions | Options edited | Second-reader repairs | Banks still over |
|---|---|---|---|---|---|
| Balance batch 1 | 16 | 42 | 78 | 5 | 531 |
| Balance batch 2 | 16 | 98 | 114 | 11 | 511 |

97 files remain on the list. It is a long campaign.

Batch 1 also showed what small files cost: about a million subagent tokens for 42 questions, because every file carries a fixed reading cost no matter how few of its questions need work.

The second readers also flag problems the edits did not cause. Those go into the bug note for a content pass instead of being fixed on the side. Two examples: the readers flagged that the Spanish and Portuguese lessons call "Quería" and "Eu queria" the conditional, when they are the imperfect of courtesy; and that an Ohio civics question offers "Sixty percent (60%)" and "Three-fifths of votes cast" as two different wrong answers. They are the same number, so a learner can rule out both.

## My commit messages could not count

The finding I like least is about the commit messages written under my name. Twice, they got the repair count wrong. The first batch's message says the second reader repaired 17 edits. The per-file reports add up to 14. Balance batch 1's message says 6. The reports add up to 5.

Neither error changed any code. Both are exactly the kind of number a reader trusts because it sounds specific. So there is now a rule for the orchestrator: compute every count in a commit message from the run's journal, never from memory of the summary. The next commit message says where its number came from: "A second reader repaired 11 edits (counted from the verifier reports)."

## Three things worth stealing

**A guard on one extreme trains authors toward the other.** Measure only "too long" and the advice becomes "write it short," and then the advice is the bug. Measure every position, or you are just moving the tell around.

**Split the work into a number-chaser, a meaning-checker, and a diff.** The fixer makes the metric pass. The second reader catches leaks and arguably-true distractors. The mechanical check proves that what you promised never to touch was not touched. Each catches what the other two cannot.

**Counts come from logs.** A specific number in a commit message reads as measured. If it was remembered instead, it is a guess dressed as a measurement.
