<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Blog Post Waits for the Course. Now the Course Knows It.
Slug:    the-post-waits-for-the-course
Excerpt: Four finished blog posts were waiting on four courses, and the only
         record of that wait was a task file in another repo. My LMS could
         release a course without ever learning a post was waiting for it.
         Now every course carries a launch to-do list, and the list shows up
         as a warning the moment anyone schedules or publishes the course.
Tags:    Product Design, LMS, Marketing, Teachers, WitUS
-->

# The Blog Post Waits for the Course. Now the Course Knows It.

This morning I had four blog posts ready to go about a new series of courses on my LMS. Each post was waiting on something. The posts could go out once the courses existed in the catalog, and each one would need updating once its course was released to learners, because every one of them calls its course "Coming soon."

The waiting was written down. It lived in a task file in my blog's repo: publish only after the courses are merged and seeded, and before publishing, re-check a list of facts that can change, such as whether a reviewer has been named. That task file is a good record. It is also invisible to the one system that knows when a course is released.

My LMS can release a course in several ways. I can do it. A school's admin can do it. A teacher can schedule one. None of those actions had any way to learn that a post somewhere was waiting on it.

## What I asked for

I asked for warnings about publishing blog posts when courses are published, with the name of the blog in the warning, and I asked for it to stretch to any follow-up work a launch creates, not just blog posts.

Then I added a second request while it was being built. Teachers should get the warning too, and they should get it when they schedule a course, not when it goes live. A warning at the moment of release is too late to plan anything. A warning at the moment of scheduling gives you the weeks in between.

## A launch to-do list on every course

Every course's management page now has a Launch to-do list. Everyone who edits the course sees the same list: its teacher, the school's admin, and me.

Anyone can add to it. An item is either a task or a blog post, and a blog post has to name its blog. "Publish the post" is not an instruction if nobody knows where the post goes. Each item also says when it falls due: now, before the course goes live, or once it is live.

That timing is never typed in as a date and never stored. It is worked out from the course itself every time the list is read. A course is in the catalog, or it is scheduled, or learners can take it. "Learners can take it" reads the same states the catalog already uses for its badges: public or members-only, published, not on hold, and vetted. So the list cannot drift from what a learner actually sees.

Some items on my own courses are written into the code instead of typed into the page. Those are the four blog posts and the four "update the post once it is live" checks. They show a small "added by Claude" label, because that is where they came from, and only I can close them.

## The warning, at the moment of intent

The list comes up as a warning whenever someone signals that a course should go live. That covers six actions:

- saving settings that schedule the course,
- making it public or members-only,
- publishing it,
- clearing its hold,
- releasing its review hold,
- marking it vetted.

The warning splits the open items in two: what still has to happen before launch, and what the launch itself will set off.

It never blocks. "Go ahead" does exactly what you asked. I went back and forth on that and landed on a warning, because a gate on a launch mostly gets clicked through or argued about. A warning shown at the moment someone decides to launch does the job I actually need: it puts the list in front of the person picking the date.

## How I hear about it without an inbox

My LMS has a rule against anything inbox-like: no messages between people, no notification feeds, no unread counts on requests. The reasons are about accountability, and they do not bend for convenience.

So when a teacher schedules a course with open items, nobody sends me anything. Instead, my admin board has a section called "Courses being launched," which lists scheduled and live courses that still have open items, and the admin home page shows a count. Each item is a chore attached to a course. It has no recipient, no reply and no read receipt. It ends when someone closes it.

## Done costs one sentence

Closing an item requires a note saying what was done. For a blog post, that is its live URL.

I borrowed that from the source-check list I already run, for the same reason. An item marked done with nothing written down is worse than an open one. It says the work happened and gives nobody a way to check.

The blog items go one step further. My blog has a feed, and on my blog "published" means "listed in that feed." So the board reads the feed, and when a post shows up there it says so and fills in the URL for me. If the feed cannot be read, the board says it could not check. It never treats a failed read as "not published."

## One decision worth writing down

My LMS has a "scheduled" setting with no date attached to it. I had to decide whether a scheduled course counts as live for these purposes. It does not. Scheduling counts as intent, so the before-launch items fall due and the warning fires, but nothing that waits for "live" falls due on a course that nobody can open yet. The point of a marketing reminder is to send people somewhere they can go.

## Three things worth stealing

**Put the gate where the thing it waits on lives.** A note in another repo saying "publish after release" is honest and useless, because the release happens somewhere that cannot read it. Attach the follow-up to the course, and the course's own state can tell you when it is due.

**Warn at intent, not at the event.** The useful moment to see a launch checklist is when someone picks the launch date. By the time the course is live, all the list can tell you is what you forgot.

**Make "done" cost one sentence.** Asking for a URL or a line of explanation before an item closes is a small cost. A list full of unexplained check marks costs more.
