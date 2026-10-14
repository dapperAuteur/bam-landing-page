<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Tours From the Field: Footage That Carries Its Own Permission
Slug:    footage-that-carries-its-own-permission
Excerpt: Thirteen lessons in my catalog are virtual tours whose titles still say
         the tour is forthcoming. Now a photo or video logged in the Field Log
         can fill one, but only if the subject's consent and the stop's
         permission note allow it, and the app checks both again every time the
         lesson opens. The first design would have been erased by the next
         routine re-seed.
Tags:    Privacy, Consent, Product Decisions, Data Modeling, Engineering Judgment, WitUS
-->

# Tours From the Field: Footage That Carries Its Own Permission

Thirteen of my history courses have a lesson that is meant to be a virtual tour of the place. They were written to work before any tour existed, so each title still says the tour is forthcoming.

Meanwhile the Field Log, the part of Learn.WitUS that plans documentary work, already records the photos and videos taken at each stop, along with the subject's consent. The obvious feature was to let one fill the other. The hard part was making sure a tour shows only what it is allowed to show, today, and not just on the day someone added it.

## Why tours got their own table

The first idea was the simple one: put the tour's link in the lesson's existing media link.

The plan's first fact ruled that out. The course seeder rewrites every lesson's media link from the course file on every seed, and all 13 tour lessons ship without one. A tour stored there would be erased by the next routine re-seed, silently.

So a tour lives in its own table, one per lesson, holding a copy of the capture's link and a credit line. The seeder never writes to it. That one decision avoided a miserable bug: footage that vanished every time I updated a course, with nothing in any log to say why.

## Permission is a field, not a sentence in the notes

Each stop in a Field Log project now has a permission note: up to 500 characters, in the filmmaker's own words, saying what covers filming there. "Public viewpoint, no permission needed" is a perfectly good note. Like the rest of the consent record, it holds no contact details.

Before this, permission lived inside a stop's general notes, where no rule could read it. A field of its own is what lets the server enforce it.

## What it refuses

Each stop has a **Use in a lesson** panel, shown only to someone who may fill a tour slot: me as the platform owner, or the course's own instructor. It suggests the lesson the stop's notes already link to, lists that stop's captures, and grays out the ones that cannot be used, with the reason.

The server refuses, and says why, when:

- the subject **declined**, whatever else is true;
- the capture **involves a minor** and the consent is anything but **written**, meaning a parent or guardian's yes;
- it is not a **photo or video**;
- it has no secure **https** link to where the file lives;
- the link **cannot be shown** in a lesson: a Drive folder instead of one file, a YouTube channel instead of a video, an audio file;
- its stop has **no permission note**.

Nothing is uploaded. A tour is the capture's own link, embedded the way any lesson media is, and a Google Drive file is shown through its preview form.

That fifth refusal needed its own code. The app's general embed helper falls back to a generic frame for almost any web address, which suits an author pasting a link they have already checked. A tour comes from a field log, so the shapes that are certainly wrong get refused up front instead of publishing an empty frame.

One thing the app cannot check is whether a Drive file is actually shared. It checks the shape of the link, not its sharing setting. So my own checklist for adding footage says to share a Drive file as "anyone with the link" first. That step stays a human's job.

## Checked again every time the lesson opens

This is the rule I care about most. A tour is not approved once and forgotten. **Every lesson read runs the same checks again**, against the capture and the stop as they stand right now. If a subject's consent is changed to declined, the permission note is removed, the capture's link changes, or the capture is deleted, the tour comes off the lesson immediately, and the lesson goes back to saying its tour is forthcoming.

No write path has to remember to take anything down. A consent changed anywhere takes effect on the next page view.

While a tour is live, the lesson's title drops "(360 tour, forthcoming)" and its opening paragraph about the tour not existing yet is hidden, because neither is true any more. The course files themselves are not edited; the change happens on screen.

## Where tours are managed

A new Tours page in the teaching area lists every tour slot in my courses as empty, shown, hidden (with the reason), or carrying its own link. **Remove** empties a slot again, and the capture stays in the Field Log.

Learners cannot send an instructor a tour to add. That would be a list of requests waiting on someone, and under [this app's no-inbox rule](/blog/a-signal-not-a-conversation) that is something it does not keep. The person allowed to publish publishes directly. Nothing is requested and nothing waits.

## What is not done

The public read API does not carry tours from the field yet. Offline downloads and search still show the raw "forthcoming" title. And the database-backed isolation tests for the new table have not run against a real database. The rest of the bundle passed 1,316 tests.

## Three things worth stealing

**If a routine job overwrites a field, do not keep anything precious in it.** One line in a seeder decided this feature's whole data model.

**Store permission where a rule can read it.** A note in free text is a memory aid. A field the server checks is a gate.

**Decide on every read, not once at publish.** Consent can change after you publish. If the check runs every time, withdrawing consent actually withdraws the footage.
