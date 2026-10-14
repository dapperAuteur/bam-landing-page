<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Reviewer's Name Goes on Exactly the Lessons They Read
Slug:    reviewer-name-on-what-they-read
Excerpt: Some lessons should not reach learners on my word alone: a rigging
         rule, a hearing-safety figure, a scrapie regulation. Reviewer sign-off
         turns a one-line marker in the course file into a need a qualified
         person can clear, pins their verdict to a hash of the text they read,
         and resets it the moment anyone edits a word. Corrections go one way,
         because this app does not carry conversations.
Tags:    Trust, Content Review, Product Decisions, Postgres, Engineering Judgment, WitUS
-->

# A Reviewer's Name Goes on Exactly the Lessons They Read

Some of my courses teach things where being wrong can hurt someone: rigging over a stage, protecting your hearing, keeping sheep within the law. For those lessons my word as the author is not enough. Someone qualified has to read them before a learner does.

For a while that rule lived as a sentence. Four course files open certain lessons with one line:

> **Before release:** needs a qualified reviewer (QR): a large-animal veterinarian.

Other lines ask for a practitioner, or my own demonstration, or a decision only I can make. It is a good convention for a person reading the file. For the app it was prose. Nobody could count those lines, clear them, or credit the person who did.

Reviewer sign-off turns them into data.

## The markers are parsed, not retyped

The seeder reads those lines from the course files, stores them as the lesson's review needs, and strips them out of the lesson text. No course file had to change. Across the four files the parser found 81 marker lines in 71 lessons, carrying 83 needs: 50 for a qualified reviewer, 28 for a practitioner, and 5 decisions.

Two details I care about:

- **It fails closed.** A marker in wording the parser does not recognize still holds the course. It is stored as a decision, which no reviewer's verdict can clear, until someone fixes the line.
- **The lesson page draws the box back, and it still begins "Before release."** That wording is load-bearing in an odd way: the rigging course quizzes learners on what that box means, so changing it would have made a quiz answer false.

## A verdict is pinned to the words

A reviewer records one of three verdicts per need: cleared, cleared with one correction to make, or not cleared.

The verdict is pinned to a SHA-256 hash of the lesson's material text, computed on the server: the title, the body without its markers and with whitespace collapsed, the media link, and the recall cards, exercises and map content. Every time the lesson is read, the stored hash is compared with the current one. **Any edit, a one-letter typo fix included, resets the verdict.**

That is deliberate, and the screen says so wherever a verdict is recorded. The code's header gives the reason in one line:

> a reviewer's name must never sit on wording the reviewer did not read.

Some things stay outside the hash on purpose. Moving a lesson, changing its publish flags, or removing a marker line does not change what the lesson says. Re-flowing a paragraph does not either, which is why whitespace is collapsed first. And because Postgres does not keep the key order of stored JSON, recall cards are serialized with their keys sorted, so the hash depends on content alone and not on how the database happened to hand the JSON back.

Because the comparison happens on every read, no write path has to remember to reset anything. A re-seed from the course file and an edit in the teaching screens reset a verdict the same way.

A cleared need shows "Reviewed by {name}, {credential}, on {date}," with one more line saying a review checks content and is not an endorsement or a qualification for the learner.

## Who may sign

- A qualified-reviewer need is cleared only by an **invited course auditor whose name and credential were set by the person who invited them**, so the credential is not only self-reported.
- I, as the platform owner, may clear a **practitioner** need, because some of those are my own demonstration. I may never clear a qualified-reviewer need, even while holding an audit grant on the course. A self-invite must not become a qualification.
- **The course's own instructor records nothing.** An author does not review their own lesson.

## A correction is not a message

A reviewer who clears a lesson with a correction writes it once, up to 1,000 characters, attached to that lesson and that need. Nobody replies to it.

That shape comes from a rule this app already lives by: it never carries conversations between people, for reasons I explained in [an earlier post](/blog/a-signal-not-a-conversation). So a correction has no recipient, no reply, no thread, no read state, no email and no notification. A new verdict replaces the old one instead of answering it. No page lists corrections across courses, and the reviewer's own list of lessons never shows correction text. A test pins the table's columns and fails on any column named like a reply, a thread, a parent, a read or seen time, a message, or a body.

The correction gets acted on by editing the lesson. Then I press **Applied as written**, once, which re-pins the verdict to the edited text and shows "correction applied" with the date. That button carries a real risk, and the plan named it: it puts the reviewer's name on wording they did not see. So it is owner-only, and the badge says the correction was applied instead of implying the reviewer read the new version.

## What changed on review

The first plan said a course could be released once every qualified-reviewer need was cleared. On review that changed: **practitioner needs hold the release too.** A released course must never show a learner a "Before release" box, and one marker in the sound course says its lesson is not released without its practitioner. Since I can clear a practitioner need with my own demonstration, this adds no outside dependency. It just keeps the page honest.

Release itself is a button that re-checks readiness on the server and clears the hold. Holds are written only when a course is first inserted, so a release survives every later re-seed. A course with no markers is never "ready" this way: its hold was never about markers, and it is still cleared by hand.

## The open question, now answered

The plan left one question for me: may a school's own admin release a reviewed course, or only I? On 2026-10-14 I decided a school's admin may release it too, and the course's own instructor never may. That change is being built now.

## What is not done

The feature merged with 1,247 tests passing, but the database-backed isolation test for it has not yet run against a real database. The verdict form shows as disabled, with no explanation, to a reviewer who is also the course's instructor. And the lesson that teaches instructors how to use sign-off has not been written yet. All three are on the follow-up list.

## Three things worth stealing

**Turn the convention you already have into data.** The markers already existed as prose. Parsing them meant no author had to learn a new form, and no course file had to change.

**Pin approval to a hash, and compare on read.** Then a re-seed, an editor's tweak and a typo fix all reset a verdict the same way, and no code path has to remember to do it.

**Fail closed on anything you cannot parse.** A marker in the wrong words should hold a course, not quietly release it.
