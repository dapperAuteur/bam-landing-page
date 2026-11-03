<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Linking the Chat's Sources Showed Me It Could Quote Unpublished Lessons
Slug:    the-chat-could-quote-unpublished-lessons
Excerpt: Learn.WitUS answers questions from a course's own sources, and the sources under each
         answer were plain text. I asked for each one to take the reader to that part of the
         class. Building the links turned up an older problem: the index holds draft lessons
         too, so a learner's answer could be built from a lesson nobody had published. The
         chat now drops those passages before the model sees them, and fails closed.
Tags:    RAG, AI Engineering, Learn.WitUS, Privacy, WitUS
-->

# Linking the Chat's Sources Showed Me It Could Quote Unpublished Lessons

Learn.WitUS (learn.witus.online) has "Chat with the sources." A learner asks a question inside a course, and the answer is built from that course's own lessons and bibliography, with numbered sources under it. I wrote about moving its index to a new embedding model in [I Re-Indexed 396 Courses on a New Embedding Model. My Shell Loop Dropped the School.](/blog/the-loop-that-dropped-the-school)

The sources under each answer were plain text: a kind, a title, and the first few words of the passage. To check one, you had to go find it yourself. On November 2 I asked for each source to take the reader to that part of the class. That work shipped two other things with it, and one of them is the reason for this post.

## A link to the passage, not just the lesson

A lesson source now links to the lesson, plus a URL text fragment. A text fragment is the part of a link that starts with `#:~:text=`. MDN describes it this way: "Text fragments link directly to specific text in a web page, without requiring the page author to add an ID" (MDN contributors, n.d.). A supporting browser scrolls to the words and highlights them.

The app builds the fragment from the passage itself: the first four to eight plain words of one line of the chunk. Plain means words that print exactly as written. A word with formatting marks in it might render differently, and a fragment that does not match the page does nothing. One line, because a fragment cannot match across paragraphs. And a passage that was cut from the middle of a lesson may start with half a word, so that first word is skipped.

The fallback costs nothing. If the words do not match, or the browser does not support text fragments, "the whole text fragment is ignored and the top of the document is linked" (MDN contributors, n.d.). The reader still lands on the right lesson.

One detail is easy to miss. The site is built with Next.js, and its `Link` component changes pages without a full browser navigation. A text fragment only acts on a real navigation, so these links are plain `<a>` tags on purpose.

Bibliography sources link to the source's own URL first, then a hosted PDF copy, then its DOI. If a source has none of those, the link goes to the course's Sources page, but only if this reader is allowed to see that page. Anything that is not an `http` or `https` address is never linked.

## No migration, and no guessing

The stored passages do not carry a lesson id. Adding one would have meant a migration and re-indexing every course again, the same day I had just finished doing that. They do carry the lesson's title, so a passage is matched to a lesson with that title in the same course.

Two lessons in one course can share a title. In that case the app checks which lesson's text actually contains the passage. If that still does not settle it, or the lesson was renamed since the index was built, the source gets no link. A missing link is honest. A link to the wrong lesson is not.

## Saved chats, for me only

The second request was to keep my questions and answers. I said to add it for me only first, and I would consider it for other users later. So the app saves the platform owner's chats and nobody else's, in a new table. Learners' questions are stored nowhere, the same as before.

Saving never stands in the way of the answer. It gives up after three seconds and never throws an error, so a slow or failed save costs me a saved chat, not the reply. My saved chats show under the chat on each course page, and an admin page lists all of them with Delete for one chat and Delete all.

## The problem the links turned up

To link a lesson source, the code had to ask which lessons this reader may open. Learners see published lessons. Editors of the course see drafts too. Asking that question exposed something the chat had never asked.

The indexer indexes every lesson, published or not. When a learner asked a question, retrieval searched all of those passages. If a draft lesson was the closest match, its text went into the model's prompt, so the answer could repeat it, and its title showed up in the sources. A learner could read part of a lesson the author had not released. That was true before any of the link work. The links did not cause it. They made it visible.

## The fix, at answer time

For anyone who cannot edit the course, the chat now filters what it retrieved before the model sees any of it:

- **Over-fetch.** It retrieves three times as many passages as it will use, up to 36, so that dropping drafts still leaves enough to answer from.
- **Keep only what is provably published.** A lesson passage stays only when it can be matched to a published lesson. A title that only a draft has, a passage with no title, or a title shared with another lesson that no published lesson's text contains: dropped. Bibliography passages stay, because the bibliography is public with the course.
- **Trim back** to the usual number before the prompt and the sources list are built.

It fails closed. If the app cannot read which lessons are published, it answers from the bibliography only. If everything that matched came from drafts, the reader gets "That isn't covered in this course's sources," and no model is called at all. Editors still see everything, because checking drafts is part of their job.

The cleaner fix is for the indexer to skip drafts in the first place. I have not done that yet, because it creates a new problem. The index decides what needs re-indexing by a fingerprint of each course's text, and that fingerprint ignores whether a lesson is published. If drafts were skipped, publishing one would not mark the course as changed, and the new lesson would never reach the chat. The fingerprint has to include publish state, or publishing has to trigger a re-index, before the indexer can skip drafts.

## Where it stands

2,034 tests pass on the branch, and it is waiting to merge. The saved chats need one migration, which runs on the merge. The links and the draft filter need neither a migration nor a re-index.

What I would carry to any retrieval feature:

- **The index is not the permission check.** Anything you embed can come back in an answer, so filter by what this reader may see before the model gets it.
- **Fail closed.** When you cannot tell whether a passage is allowed, leave it out.
- **No link beats a wrong link.**
- **Saving history must never cost the answer.**

## References

MDN contributors. (n.d.). *Text fragments*. MDN Web Docs. Retrieved November 2, 2026, from https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment/Text_fragments
