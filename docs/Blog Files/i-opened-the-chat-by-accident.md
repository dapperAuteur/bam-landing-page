<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Opened the Chat to Paying Learners by Accident
Slug:    i-opened-the-chat-by-accident
Excerpt: When I merged Learn.WitUS's two AI panels into one course chat, the merge picked a
         default for courses with no saved setting: open it to paying learners, so nobody lost
         the tutor they had. The task file said so. I merged it anyway, and then said what I
         actually wanted: the chat is mine until I turn it on. Defaults for AI features start
         closed, plus a bulk button for choose-your-own-adventure courses.
Tags:    AI Engineering, Access Control, Learn.WitUS, Product Decisions, WitUS
-->

# I Opened the Chat to Paying Learners by Accident

Learn.WitUS (learn.witus.online) is the course platform in my WitUS apps. In [I Built the Same Chat Twice, Then Paid to Merge It](/blog/i-built-the-same-chat-twice), I wrote about merging its two AI panels, the course tutor and chat with the sources, into one course chat.

This post is about one line of that merge that I let through.

## Who gets the chat

Each course has a stage for the chat, set on an admin page:

- **owner:** a test stage;
- **invited:** plus the learners enrolled in the course;
- **paid:** plus the learners enrolled on a paid course.

A course with nothing saved needs a default. The old tutor was open to paying learners. The old chat was not. Merging them meant picking one.

The merge picked **paid**, so that no learner who had the tutor would lose it. That is a reasonable instinct. It is the "nobody loses anything" choice.

## It was written down

This was not hidden. The merge task said, in its own bullet, that the default for a course with no saved setting changed from owner to paid, so every enrolled paid learner would get the chat. My last post even said it, in a paragraph I wanted on the record.

I merged the bundle that carried it on the evening of November 3, and the deploy went green.

Then I said what I actually wanted: "Chat should only be available for me until I turn it on for other users."

By then the merged default had already opened it. On every course where I hadn't saved a stage, any learner enrolled on a paid course could use the chat. So could every instructor and every school admin, because editors of a course always had it.

## Owner didn't mean me

That last part was a surprise even to me. Under the old rule, the **owner** stage didn't mean the platform owner. It meant anyone who could edit the course: its instructor and the admins of its school. So even before the merge, "owner only" was wider than I thought. My last post says the chat used to be open "to me only." That was not quite true either.

One word was carrying two meanings. To me, owner meant me. To the code, it meant the people who own a course.

## Why this one matters

A default for a page layout is a design decision. A default for an AI feature is a decision about three things at once:

- **who sees answers I haven't checked yet,** on courses whose sources I may not have read through;
- **who spends model calls,** which cost money per question;
- **what a learner is told the course includes,** because a chat that appears and then disappears reads like a feature taken away.

"Keep everyone's access" sounds like the safe choice in a merge. For an AI feature it isn't neutral. It opens a door, and nobody decided out loud to open it.

I don't know whether anyone outside used the chat in that window. The chat history table would say, and I haven't queried it.

## The fix

Two levels, both on the admin page, both mine:

1. **A platform switch, Course chat for everyone else, off by default.** While it is off, I am the only person who gets the chat, on every course in every school, whatever a course's stage says. It is stored as one platform setting, and a missing setting means off. So if the row is ever lost, the chat closes instead of opening.
2. **When I turn the switch on, each course's stage decides.** **owner** now means the platform owner only, and it is the default again for a course with nothing saved. **invited** adds the course's editors and enrolled learners. **paid** adds editors and learners enrolled on a paid course. The school's AI tutor switch still has to be on for learners.

Turning the switch on takes a click and a confirm, and the confirm says that courses I had saved as invited or paid open at once.

While the switch is off, instructors and school admins don't get the chat either. That is a real cost: a school's own instructor can't try the chat on their own course until I open it. I chose that for now, and I may revisit it once I trust what the chat says.

## Also on the branch: many courses at once

The same evening I asked a second question: "Can I convert multiple courses at once to CYOA?" CYOA is choose-your-own-adventure navigation, where a lesson ends at a crossroads instead of a single Next button.

On the teaching page, I can now tick courses (or select all shown), choose **Set CYOA** or **Set Linear**, and confirm. One request carries the whole selection. Each course gets exactly the edit check that saving a single course already runs, so a mixed selection works: the courses I can edit change, and the ones I can't are listed by id and left alone. A refusal never names the course, so it can't confirm anything the account couldn't already see. Courses in CYOA now show a CYOA chip in the list.

It does not build the crossroads in that request. A CYOA crossroads picks "Related" lessons by meaning, from an embedding for each lesson. Embedding every lesson of many courses inside one web request would run past the function's time limit and past the embedding service's per-minute pacing. The paced backfill already exists as a workflow. So the result says how many courses and lessons still need crossroads embeddings, and for me it shows the command to run. Until it runs, those lessons still offer Continue and an unexpected path, just no Related picks.

## Where it stands

Both changes are waiting to merge (Learn.WitUS task 404). Typecheck, lint and build pass, and 2,086 tests pass, with new ones for no setting means owner only, switch off means owner only, a saved stage honored once the switch is on, and only the owner able to flip the switch. None of them ran against a real database.

Until it merges, production still shows the chat to paying learners and to every editor of a course with no saved stage.

## What this cost

The helper that made both changes took about 5.43 credits of Claude usage over 93 responses, roughly $5.43. It isn't split between the chat default and the bulk button. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helper's session transcript. Not counted: writing this post, the main session that coordinated the work, and my own time.

## What I would carry

- **Defaults for AI features start closed.** Open them on purpose, with a switch, when I'm ready.
- **"Keep everyone's access" is still a decision about who sees an AI feature.** Make it out loud, not inside a merge.
- **A flag in a task is not a decision.** If a line changes who can use something, it needs its own yes.
- **Check what a word means in the code.** My "owner" and the code's "owner" were different people.
- **A missing setting should close the door.**
- **A bulk action reuses the single check.** One rule for who may change a course, however many courses arrive at once.
