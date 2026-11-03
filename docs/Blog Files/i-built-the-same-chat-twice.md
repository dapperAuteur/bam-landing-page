<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Built the Same Chat Twice, Then Paid to Merge It
Slug:    i-built-the-same-chat-twice
Excerpt: Learn.WitUS had two AI panels on every course page, "Ask the course tutor" and "Chat with
         the sources." I asked what the difference was, because they gave the same answer to the
         same question. The honest answer: the second was built nine days after the first, beside
         it, by a plan that said to extend the first. Four months of separate fixes later, I paid
         to make them one tool.
Tags:    RAG, AI Engineering, Learn.WitUS, Refactoring, WitUS
-->

# I Built the Same Chat Twice, Then Paid to Merge It

Learn.WitUS (learn.witus.online) is the course platform in my WitUS apps. Until this week, an indexed course page had two AI panels: **Ask the course tutor** and **Chat with the sources**. On November 3 I asked Claude a question I should have asked in July:

"What's the difference between chat with the source and Ask the course tutor? They gave the same answer to the same prompt."

Here is what each one did. Chat with the sources linked every source under its answer to the passage it came from, and it saved my chats. The tutor streamed its answer and felt like a conversation. It wasn't. Neither tool was multi-turn. The tutor's page sent only the question in front of it, never the turns before. Its question box just stayed filled after each answer, so asking again felt like a follow-up.

They gave the same answer because, underneath, they were mostly the same thing.

## How there came to be two

The tutor was built on June 28: several AI providers with fallback, a supervisor that picks one to three "lenses" (explain, examples, coach) for each question, a specialist per lens, and a synthesizer that writes the final answer. It streamed, and each school could configure it. It found course material with an older index, the one built for the choose-your-own-adventure courses.

About nine and a half days later, on July 7, chat with the sources was built in three branches in one day: a source index, the chat with an owner dashboard, and the learner panel.

Its own plan said not to build a second engine. The plan described the tutor as already doing supervisor, specialist lenses and synthesis, and said: "This IS the multi-agent engine; we add retrieval." The plan's second branch was "retrieve → the multi-agent tutor with a `sources` agent."

What got built was a separate file whose header says it "Reuses the tutor's specialist LENSES + multi-provider fallback," with its own answer path, its own route and its own panel, "wired into [the course page] next to the AI tutor." It borrowed the tutor's parts and built a second machine with them. I merged both branches, and I didn't ask why there were two.

## Then they drifted

Two answers to the same question cost twice to keep right.

On July 9 one access fix had to be made in both. When a parent studies as their child, both chats checked the parent's enrollment instead of the child's, so a child enrolled in a course couldn't use either one. That was the cheap case, because the fix found both. On November 2 three changes went into chat with the sources only. Its sources got links. My chats got saved. And it stopped answering a learner from unpublished lessons, which I wrote about in [Linking the Chat's Sources Showed Me It Could Quote Unpublished Lessons](/blog/the-chat-could-quote-unpublished-lessons). The tutor got none of that. A learner who picked the tutor panel got the version without the work.

## One tool

Claude wrote a design note before writing code: a table of what each tool really did, read from the code, not from memory. The tutor's real extras were streaming, the supervisor, its warmer final prompt, a per-school off switch and the sentence coach for language courses. Chat with the sources had the links, the saving and the filter.

The merged version, waiting to merge as I write this:

- **One engine, one route, one panel.** The panel is **Chat with this course**. The tutor's engine file, 285 lines, and both old panels, 106 and 110 lines, are gone.
- **Real follow-ups.** The page sends the last six turns. A follow-up such as "give me an example of that" is first rewritten into a question that stands on its own, because "that" retrieves nothing. If the rewrite fails, it searches with the previous question plus the new one.
- **Every turn retrieves again,** with the unpublished-lesson filter. Nothing found for an earlier turn is reused.
- **Kept from the tutor:** streaming, the supervisor as a per-course option (off by default, so saved settings behave as before), the off switch and the sentence coach, now on the same route.
- **Kept from chat with the sources:** linked citations, and saving for me only, now per turn with a conversation id (one migration, which runs on the merge).
- **The old routes still answer,** forwarding to the new one with `Deprecation` headers. Nothing I could find still calls them.

43 files changed, about 1,800 lines added and 1,000 removed, not counting the generated migration snapshot. 2,055 tests pass.

Two things change for learners, and I want them on the record. A course with no saved chat settings now opens the chat to enrolled learners on paid courses, as the tutor did, instead of to me only. A course where I saved "owner only" keeps that setting, so its paid learners lose the tutor they had. And the tutor's glossary block did not come over, because the glossary is not in the source index.

## The badge that pointed at the wrong index

One more thing came out of this. The instructor tools showed a badge, "118 of 118 lessons changed since last index," with a **Re-index lessons** button. The help text said that index powered chat with the sources. It didn't. It was the older index for the choose-your-own-adventure crossroads, the one the tutor had used. The chat's own index is separate, and it was current.

So the button I would have clicked to fix the chat would not have touched the chat. It is now labeled **CYOA crossroads index**, shows only on those courses, and says plainly when no key is set to rebuild it. The chat's index status shows on its own line.

## What this cost

The November 2 and 3 work on chat with the sources (the links, saving my chats and the unpublished-lesson filter) took about 6.65 credits of Claude usage over 105 responses. The merge took about 9.76 credits over 119 responses. About 16.41 credits in all, roughly $16. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helpers' session transcripts. Not counted: the main session that coordinated the work, and my own time.

The June and July builds are not in that number, and I can't price them. Their transcripts are no longer on disk. I won't guess.

## What I would carry

- **When the plan says "this is the engine, we add to it," a second engine beside it is the moment to stop.** Ask why before the second file exists.
- **Two features that answer the same question will drift.** Every fix is made twice or made once, and once is the usual case.
- **Write down what each version actually does before merging them.** The table showed that neither one had the follow-ups I thought one of them had.
- **A status badge has to name the thing it measures.** "Lessons changed since last index" was true, and it sent me to the wrong index.
