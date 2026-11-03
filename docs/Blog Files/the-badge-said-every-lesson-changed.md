<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Badge Said Every Lesson Changed. The Seeder Said So Too.
Slug:    the-badge-said-every-lesson-changed
Excerpt: Learn.WitUS's choose-your-own-adventure courses pick "Related" lessons by meaning, from
         an index production could no longer build, because the key it needed wasn't there. Moving
         it to the embedding model the course chat already uses was the easy part. The badge that
         said "118 of 118 lessons changed" was measuring a timestamp my own seeder rewrites on
         every run.
Tags:    RAG, AI Engineering, Learn.WitUS, Postgres, WitUS
-->

# The Badge Said Every Lesson Changed. The Seeder Said So Too.

Learn.WitUS (learn.witus.online) is the course platform in my WitUS apps. Some of its courses are choose-your-own-adventure (CYOA) courses. At the end of a lesson the learner reaches a crossroads with up to three kinds of pick: **Continue** to the next lesson, an **Unexpected path** chosen at random, and **Related** lessons chosen by meaning.

The Related picks come from an index: one embedding per published lesson, a list of numbers that places the lesson's text in a space where similar lessons sit close together.

In [I Built the Same Chat Twice, Then Paid to Merge It](/blog/i-built-the-same-chat-twice), a badge in the instructor tools read "118 of 118 lessons changed since last index." It turned out to measure this CYOA index, not the chat's. This post is what happened when I looked at the index it did measure.

## The key that wasn't there

The CYOA index was built with a Gemini embedding model: 768 numbers per lesson. Production has no Gemini key. So the index could be neither built nor refreshed there. A new lesson got no vector, and an edited lesson kept its old one.

The course chat's index had already moved to Mistral's embedding model, and its key is set on production. My instruction was short: "move CYOA to Mistral."

## Moving the index

The move copied the shape of the chat's move:

- **Additive.** A new column holds the Mistral vectors, 1,024 numbers each, with its own index for fast nearest-neighbor search. The old 768 column is untouched, so the old code keeps working while the migration runs. Dropping it is a later cleanup.
- **One embedder.** Every writer (publishing a lesson, the **Re-index crossroads** button, the command-line indexer and the seed workflow) now goes through the same Mistral code the chat uses: batched, paced under the per-minute request limit, and retried when the service says slow down. One provider, one key.
- **Reads use only the new column.** A lesson with no new vector still gets Continue and Unexpected path. It just gets no Related picks, and it is never offered as anyone else's Related pick. Nothing crashes.
- **The school filter stays.** Some courses can offer a Related lesson from another course. That pick must come from the same school, and that filter is mandatory in the query. A pick from another school would be a leak, and the task file says so.

## Why every lesson looked changed

The badge counted a lesson as changed when the lesson's `updated_at` was later than the moment its vector was made. That sounds reasonable. It assumes `updated_at` moves only when someone edits a lesson.

It doesn't. My seeder, the script that writes course content into the database, rewrites every lesson's `updated_at` on every run, even when nothing in the lesson changed. Every seed run made every seeded lesson newer than its vector. So the badge said 118 of 118, and it would have said that again the day after a full re-index.

The badge was telling the truth about a timestamp. It just wasn't telling me anything about the text.

The fix stores what was actually embedded. Each vector row now keeps a content hash: a short fingerprint of the lesson's title and text, plus the model's name and size. Postgres can work out the same fingerprint from the lesson table, so the badge compares fingerprints without reading any lesson text into the app. A lesson needs embedding when it has no new vector or its fingerprint differs. A reseed that changes no text changes no fingerprint. And because the model's name is part of it, a future model change marks every lesson as needing work, which is what should happen.

The badge now reads "N of M lessons new or changed since the last crossroads index," and it names the Mistral key when that key is missing.

## The backfill is a button, not a laptop command

Every published CYOA lesson on production needs a new vector once. I didn't want that to be a command someone runs from a laptop with a production connection string pasted into a terminal.

So the backfill is an input on the workflow that already seeds production courses: CYOA **needing**, **all** or **none**. It runs after the migrations, even if the seed step failed. A normal push to `main` runs **needing**, which embeds nothing when no CYOA lesson changed. Because it is a workflow, the Run button on my witus.online admin can start it like any other. The laptop command still exists, written down in the runbook as the fallback.

## Where it stands

The branch is waiting to merge (Learn.WitUS task 402). It also lands the one course chat from the earlier post. Typecheck, lint and build pass, and 2,076 tests pass, 21 of them new for this index. None of them touched a real database or called Mistral: the embedder is faked in tests.

Until the merge and the backfill run, no CYOA lesson on production has Related picks. After the backfill, the check is simple: the badge says the index is up to date, a lesson shows Related picks, and a cross-course pick comes only from the same school.

## What this cost

The helper that made this change took about 4.88 credits of Claude usage over 80 responses, roughly $4.88. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helper's session transcript. Not counted: writing this post, the main session that coordinated the work, and my own time.

## What I would carry

- **A timestamp says something was written, not that something changed.** If the question is "did the content change," store a fingerprint of the content.
- **Put the model in the fingerprint.** Then changing models is just another kind of change.
- **Move an index additively.** New column beside the old one, readers switched, old column dropped later.
- **A one-time backfill is still a post-deploy step.** Give it a workflow and a button, and keep the laptop command as the fallback.
