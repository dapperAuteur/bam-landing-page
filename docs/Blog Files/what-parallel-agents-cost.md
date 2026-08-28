<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Four Failures a Type Checker Could Not See, and What Each One Cost Me
Slug:    what-parallel-agents-cost
Excerpt: A dropped field TypeScript could not catch because it was optional. A
         conflict resolution that truncated four entries and still compiled. A
         git worktree that deleted 90 KB of research because its output was
         gitignored. And a laptop set to sleep after one idle minute, which
         killed roughly ten agents. Each argues for a different practice.
Tags:    AI Agents, Multi-agent, Engineering Judgment, Git, Debugging, WitUS
Series:  Building an LMS With Agents (4 of 4)
-->

# Four Failures a Type Checker Could Not See, and What Each One Cost Me

The first three posts in this series were about guards: [why they beat instructions](/blog/guards-beat-instructions), [which ones I refused to build](/blog/guards-i-refused-to-build), and [the verification work no guard touches](/blog/verification-is-the-bottleneck).

This one is about the failures that got past all of it. Every one is real, every one is recorded in the repository, and none of them produced an error message. A silent failure is the expensive kind, and running several agents in parallel manufactures them, because the two things parallelism removes are the two things that usually catch this class of bug: one person holding the whole change in their head, and one person watching the terminal.

## One: an optional field, silently dropped, twice

`scripts/seed-courses.ts` registers most of the catalog. A large block of it is a destructuring loop over an array of course entries. Someone added series metadata to the entries and did not add it to the destructure. The result:

```ts
  // NOTE the series fields: this loop used to destructure only slug/course/category/priceType,
  // so a series code written on an entry here was silently DROPPED rather than rejected. If you
  // add a field to an entry below, add it here and pass it through, or it does nothing.
```

An entry says `seriesTrack: "W · The written record"`. The loop does not name it. TypeScript is entirely happy, because excess properties on an array element are not an error and the field is optional at the far end. The course seeds fine. It just quietly loses the label that tells a learner what track it is on.

This has happened twice, and nearly a third time. Merging a bundle, one side of a conflict ended at `seriesPosition: "S2"` and the shared tail after the marker supplied `seriesTrack`. A naive keep-both resolution would have dropped it again. The merge task records the resolution and the count that confirmed it: three S-track entries, three `seriesTrack` values.

**The practice it argues for: for any field a type checker cannot enforce, verify by counting after the merge, not by reading the diff.** The diff for this looks correct. It is correct. The bug is a line that is missing somewhere else.

## Two: a conflict resolution that compiled and truncated four entries

`src/lib/research-checks.ts` is a large array of object literals. Two branches both appended entries at the end. Git split it so that each side ended mid-object with an unclosed `where: [` array, and the shared tail after the conflict markers closed exactly one of them.

Resolve it the obvious way, keep both sides, and the file parses. It compiles. It passes lint. Four entries have vanished into an array literal that swallowed them.

That happened once before anyone noticed, and it was found only because the counting had become a habit. From the merge task for the bundle where it nearly happened again:

> `research-checks.ts` — each side ended with an unclosed `where: [` array, and the shared tail after the marker closed only one of them. This is the same shape that truncated four entries in an earlier bundle. Resolved by closing the first side explicitly; entry count verified as 49+6+5+11=71 afterwards.

**The practice: after resolving a conflict in an array-of-literals file, count the elements and check the arithmetic.** Not "does it compile." Compiling is what makes this one dangerous. `49+6+5+11=71` written in a merge note looks like paranoia until the first time it comes out at 67.

Both of these failures share a structural cause worth naming. Data expressed as a big literal array in a source file gets all of TypeScript's guarantees about the *shape* of an element and none about the *set*. Nothing in the language can tell you an element used to be there.

## Three: a worktree that deleted the work because the work was ignored

I run content agents in isolated git worktrees so they cannot collide. It works well for code. For research it destroyed a full session, and the mechanism is worth understanding because it will get anyone using the same setup:

> Do NOT run a research agent with `isolation: worktree` when its only output is files in `plans/`. `plans/` is gitignored, so the worktree reads as UNCHANGED and is auto-deleted on failure, taking the research with it. That is how the first photography run was lost. Run such agents in the main checkout and tell them to save incrementally.

The worktree is cleaned up when it has no changes. Gitignored files are not changes. The agent's entire output was invisible to the thing deciding whether its output mattered.

The relaunch, without isolation and saving incrementally to disk, produced this session note:

> Incremental saving is working. 90 KB of research already on disk across all three files (07 at 36 KB, 08 at 45 KB, 09 at 8 KB and growing). Even if that agent dies, nothing is lost this time.

Two more variants of the same thing turned up later. An operator task file got written to `<worktree>/plans/user-tasks/` and had to be hand-copied to the shared checkout before the worktree went away, with a note at the top of the file explaining why. And two research files in that directory now carry the header "Recovered from a research agent whose parent process died."

There is a fourth cousin of this bug, in the guards themselves. They read `git ls-files` rather than walking the filesystem, deliberately, so a machine with different gitignored generated files gets the same answer as every other machine. The consequence is that **a brand new file is invisible to every guard until it is staged.** `git add -A` before running lint, or you get a clean run on a file nothing looked at.

**The practice: never isolate work whose only output is ignored by the isolation mechanism.** And more generally, ask what your tooling considers to be "nothing," because that is what it will throw away.

## Four: agents die, and the number is not small

The most mundane finding in two months of this. My laptop was set to an idle sleep of one minute. From the handoff I wrote on 2026-08-27:

> `caffeinate` had expired and I restarted it for 6 hours. **`pmset` still shows `sleep 1`,** a one-minute idle sleep, which has killed roughly ten agents across this work.

The implementation tracker I wrote the same day says eight. An earlier session note says six for that session alone. Nobody was counting precisely, which is itself the honest answer: agent deaths were frequent enough to be an operating condition rather than an incident.

They also die from session limits, rate limits, and dropped connections. The most expensive single instance: an agent finished six sections and a final exam of a course, committed all of it, and then hit its limit **mid-verification**, with the standards mapping, the roadmap entry, and four research checks written and uncommitted in a worktree that was about to be removed. That work survived because someone went and looked. It was not saved by any mechanism.

**The practices that survived contact with this, all of them boring:**

- **Commit at every section boundary.** Not at the end of the task. A course is a dozen commits, and the branch is un-mergeable and safe the whole way.
- **Save research incrementally to disk as it is produced**, not in a final write. 90 KB survived a death because of this and a comparable amount did not, earlier, for lack of it.
- **Assume the tail of the work is the part you lose.** Verification, the roadmap entry, the standards mapping, the operator note: all of it lives at the end, all of it is what a session limit eats.

## What "parallel" actually bought, and what it cost

The honest ledger. Ten courses and 2,536 pooled questions came out of one weekend with five agents. That is real and I would do it again.

Against that, from my own notes on running the quiz sweep across many files at once:

> **Verify centrally; do not trust the reports.** Re-parse every question and diff `prompt`, `correctIndex`, option count, `explanation` and `sourceLessonSlug` against the branch point.
>
> **Revert anything mid-edit.** A partially rebalanced bank is worse than an untouched one, because it looks fixed. Check the tree twice: agents killed mid-run can write again after a first revert.

That last clause is the one I did not anticipate. An agent you believe is dead can still have a write in flight, so a revert can be undone by a corpse. You check twice.

And the coordination overhead is not free. There are 297 files in this repository's operator-task queue, most of them "merge this branch, then run exactly this seed command." A bundle of five branches means one merge for me instead of five, which is why they exist, and writing the bundle note is real work that parallelism created.

## The gaps, because a post that implies this is solved would be marketing

Measured on 2026-08-27, on the branch I was working on:

```
$ pnpm audit:course --all
Audited 260 course(s), 1 unreadable (generated modules not on disk): 1690 finding(s).
    636  final-only-lesson
    551  section-without-quiz
    500  lesson-never-assessed
      3  question-without-source
```

**Five hundred lessons are taught and never assessed.** 551 sections have no quiz at all. 636 lessons are assessed only in a randomized final, which means a learner can finish the course without ever being asked about them. Those need questions written, which is authoring work and not tooling work, and tooling is the part I have been good at.

The test suite is 984 passing and 74 skipped across 90 files. The skips are database-backed tests with no development database configured, and three of them have never been run at all, because the only other connection available is production and a suite that inserts test tenants does not belong there. They typecheck. That is all I can say about them.

## If you take one thing

Every failure in this post was silent, and the four practices that catch them are all the same practice wearing different clothes: **count the thing afterwards.** Count the entries after a merge. Count the fields after a resolution. Count the bytes on disk while an agent is running. Count how many of your agents died today.

Parallel agents remove the person who would have noticed. Nothing replaces that person except arithmetic you ran on purpose.
