<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Re-Indexed 396 Courses on a New Embedding Model. My Shell Loop Dropped the School.
Slug:    the-loop-that-dropped-the-school
Excerpt: Learn.WitUS answers questions from a course's own lessons and sources. I moved its
         indexer to Mistral's embedding model, added an admin page to run it, and then every
         course needed indexing once. A key rotation, a stale key on my laptop, and a shell loop
         that cut the school name off the commands it was handed. The indexer already had a
         mode that did the whole job.
Tags:    RAG, AI Engineering, Learn.WitUS, Operations, WitUS
-->

# I Re-Indexed 396 Courses on a New Embedding Model. My Shell Loop Dropped the School.

Learn.WitUS (learn.witus.online) has a feature called "Chat with the sources." A learner asks a question inside a course, and the answer comes from that course's own lessons and bibliography, not from whatever a model remembers. The technique is retrieval-augmented generation: cut the course into chunks, turn each chunk into a list of numbers (an embedding), store them, and at question time find the chunks closest to the question and hand only those to the model.

The part that turns text into numbers is the indexer. On November 2 I asked for it to move off Google Gemini to another provider. This post is about the move, the admin page that came with it, and the one command I ran that quietly skipped the courses it could not tell apart.

## The switch

The indexer now embeds with Mistral's `mistral-embed`. Each chunk becomes 1,024 numbers. Mistral's model page listed the price at the time as USD 0.1 per million tokens (Mistral AI, n.d.). Learn's key allows 60 requests a minute, so the indexer paces itself under that and, when Mistral answers 429 (too many requests), waits and tries again instead of failing the course.

The old embeddings had 768 numbers each. They stay in their own column until a cleanup migration drops it. The new column was added next to the old one, so the change was additive: the code that read the old column kept working until the code that reads the new one was deployed, and nothing had to happen in a precise order.

## A page for the index

The second piece is an owner-only admin page, `/admin/rag`. It lists every course that is new or has changed since its last index, with a Run button per course and a Run all button. Run all is a loop in the browser: one course at a time, each request allowed up to 300 seconds. One at a time is slower than firing them all at once, and it keeps the page under 60 requests a minute without building a queue.

The page exists because indexing used to be something you remembered to do from a laptop. A course changes, the index goes stale, and the chat answers from last month's lessons. The page shows the gap and closes it with a click.

## 396 courses, all at once

Changing the embedding model changes every stored vector, so after the deploy every course needed indexing once. That was 396 courses.

The first run went through the GitHub Actions job that seeds courses and indexes them after a deploy. It failed: Mistral answered 401, "Invalid API Key," on one course. I rotated the key, the job ran again, and it passed.

Then I tried the same thing from my laptop and got 401 again. The new key was in GitHub and in Vercel. The file on my laptop still held the old one. A key lives in every place that uses it, and rotating it means visiting each of those places, not just the one that failed first. That is a small lesson, and it cost a confused minute.

## The loop

With the key fixed on the laptop, Claude handed me a shell loop to index whatever was left:

```bash
pnpm -s rag:list:prod | grep -oE -- '--course [a-z0-9-]+' | while read -r _ c; do pnpm rag:index:prod --course "$c" || echo "FAILED $c"; done
```

The list command prints, for each course that needs work, the command to index it. The loop pulled the course slug out of each line with `grep` and ran the indexer for it. Most courses passed. Some printed FAILED.

Here is why. Learn.WitUS is multi-tenant: one app, several schools, and two schools can each have a course with the same slug. A course called `sugar` exists in three of them: learn-witus, better-vice-club and elementary-mba. For those courses, the list command already printed the fix. Its line read `--course sugar --tenant <school>`. The `grep` pattern matched `--course` and the slug and stopped there. The school was cut off, so the indexer got a slug that matched three courses and refused to guess:

```text
Slug "sugar" matches 3 courses (learn-witus, better-vice-club, elementary-mba); pass a tenant.
```

The refusal is the right behavior. Indexing the wrong school's `sugar` would have put one school's lessons behind another school's chat. The error named the problem exactly. The bug was in the glue between two commands, not in either command.

The same courses indexed fine from the admin page's Run all, because the page passes the school along with the slug.

## The mode that was already there

The indexer had a mode for exactly this job the whole time: `pnpm rag:index:prod --needing`. It finds every course that was never indexed or has changed since, and indexes each one with its school attached. No list, no `grep`, no loop. The list command even says so at the bottom of its output.

So the lesson is not about regular expressions. When a tool has a "do the whole job" mode, use it instead of scraping its human-readable output. Output written for a person is free to change shape, add a field, or print a hint on the next line, and a script that parses it will break without telling you. The tool's own mode reads the same data the tool trusts.

I would add one more: when a loop prints FAILED, read the first failure before rerunning anything. Here the error message said what was wrong in one line.

## Where it stands

Checked on November 2: 0 courses never indexed, 0 changed since their last index, 396 current. The old 768-number column is still there, waiting for the cleanup migration.

What I would tell someone doing the same:

- **Make the model switch additive.** New column next to the old one, drop the old one later. Then the deploy order stops mattering.
- **Pace to the limit you have, and retry 429s.** A batch job that gives up on the first rate limit turns a slow night into a broken one.
- **List every place a key lives before you rotate it.** CI, the host, and the laptop are three places, not one.
- **Prefer the tool's whole-job mode to a loop over its output.** If it does not have one, that is the feature to add.

## References

Mistral AI. (n.d.). *Mistral Embed*. Mistral Docs. Retrieved November 2, 2026, from https://docs.mistral.ai/models/model-cards/mistral-embed-23-12
