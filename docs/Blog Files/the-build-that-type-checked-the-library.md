<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Build Ran Out of Memory Type-Checking Course Data the App Never Loads
Slug:    the-build-that-type-checked-the-library
Excerpt: Learn.WitUS stopped deploying: first a 45-minute timeout, then an out-of-memory
         kill. The cause was 53 MB of course data the app never imports, checked on every
         build. The fix took one config file, and a second TypeScript limit showed up the
         same week.
Tags:    Next.js, TypeScript, Vercel, Build Performance, Solo Engineering, Learn.WitUS
-->

# My Build Ran Out of Memory Type-Checking Course Data the App Never Loads

Learn.WitUS, my course platform, stopped deploying. The first failed build hit Vercel's time limit. The next one was killed for running out of memory. Neither was caused by the code the app runs. Both were caused by data the app never loads, checked by a step I had never thought about.

## Two failures, one step

Both logs stopped at the same line: `Running TypeScript`. Vercel "enforces a maximum Build Step duration of 45 minutes" (Vercel, 2026b), and the first build ran past it. The project builds on Vercel's Standard machine, which has 4 vCPUs and 8 GB of memory (Vercel, 2026a). The second build lasted 14 minutes in that step before the build system reported an out-of-memory event and killed it.

Next.js runs a type check as part of every production build: it "fails your production build (`next build`) when TypeScript errors are present in your project" (Vercel, 2026c). It checks whatever the project's `tsconfig.json` includes. Mine included every TypeScript file in the repository.

## What was in "every file"

The courses on Learn.WitUS are written as TypeScript data files: lessons, quizzes and sources, about 325 of them, roughly 53 MB in a `scripts/` folder. A seeding script reads them and writes the lessons into the database. The app itself never imports them. It reads courses from the database.

So every build spent most of its type check on files that would never ship. Each new course made it slower, until a new 14-lesson course and a round of quiz rewrites pushed it past the line.

## The fix: check what ships, and check the rest elsewhere

Next.js has an option for exactly this. `tsconfigPath` points the build at a different config file, and the docs show the example name `tsconfig.build.json` (Vercel, 2026c). Mine extends the normal config and excludes the course data, the tests, the content folder and the end-to-end tests. Then:

```ts
typescript: { tsconfigPath: "tsconfig.build.json" },
```

That does not mean the course files go unchecked. Continuous integration still runs the full type check on every pull request. Vercel's own troubleshooting guide lists "TypeScript type checking" among the validation tasks that often belong in CI rather than the build (Vercel, 2026b). I also capped Node's memory at 6 GB in the build script, so a future spike fails with a clear message instead of a silent kill, and I made CI keep TypeScript's incremental build file between runs, so a pull request rechecks only the files it changed.

The type check went from never finishing to between one and three minutes. The whole build ran in five to twelve minutes, and the largest process peaked between 4 and 6.7 GB across the runs I measured.

One thing I learned the hard way: the second failure happened because a content bundle was merged to main before the fix was. The fix sat on its own branch while main kept building the old way. When a fix is what lets everything else deploy, it goes first, or it goes inside the same bundle.

## The second limit, the same week

A few days later I staged every public course's sources for review: 9,558 citations in one generated file, up from about 3,900. The type check failed again, with a different message:

```text
error TS2590: Expression produces a union type that is too complex to represent.
```

This time it was not memory. One array literal with 9,558 entries was more than the type checker would represent. The generator now writes the list in chunks of 1,000 and joins them. The type check passed, and the build finished in about six minutes with a peak of 4 GB.

I checked one more thing before shipping it, because a 5.5 MB file of citations should never reach a learner's browser. It ends up in one browser bundle, loaded only by the two pages where reviewers check sources. No course page loads it.

## The option I turned down

Vercel suggested switching to Elastic build machines, which assign larger machines to builds that are "CPU- or memory-bound (heavy bundling, expensive type checking)" and bill by CPU minute (Vercel, 2026a). It would have worked. It would also have hidden the cause and charged me every build for checking files that do not ship. A bigger machine is the right answer when the work is real. Here the work was not needed.

## What I would tell past me

1. **Know what your build checks.** The type check covers whatever the config includes, not whatever the app uses.
2. **Data can live in code, but it should not be in the build's path.** Check it in CI, where slow is fine.
3. **Measure peak memory, not just pass or fail.** A build that passes at 7.5 GB on an 8 GB machine is a failure you have not seen yet.

## References

Vercel. (2026a). *Managing builds*. Vercel Docs. Retrieved October 26, 2026, from https://vercel.com/docs/builds/managing-builds

Vercel. (2026b). *Troubleshooting build error: "Build step did not complete within the maximum of 45 minutes"*. Vercel Knowledge Base. Retrieved October 26, 2026, from https://vercel.com/kb/guide/troubleshooting-build-error-build-step-did-not-complete-within-45-minutes

Vercel. (2026c). *typescript*. Next.js Docs. Retrieved October 26, 2026, from https://nextjs.org/docs/app/api-reference/config/next-config-js/typescript
