<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Nobody Reads the Help Page. So I Turned It Into a Class.
Slug:    help-pages-nobody-reads-became-courses
Excerpt: I had thirty-one help articles and no idea if anyone finished one. Now
         they are six short courses, one per job, each ending in a certificate.
         The trick is that the courses read the help pages, so they cannot go stale.
Tags:    Training, Buying Software, Onboarding, Plain Talk, WitUS
-->

# Nobody Reads the Help Page. So I Turned It Into a Class.

My school software has thirty-one help articles. They are good articles. I wrote them carefully.

I have no evidence anyone finishes one.

Help pages are where you go when you are already stuck and already annoyed. You search, you skim, you leave. Nobody reads the help section to learn a job. That is not what it is for.

Meanwhile, a new teacher signing up has a real question I was not answering: **"What do I need to know to run my class here?"** Thirty-one articles in a list does not answer that. It hands them a filing cabinet.

So this week I turned the help pages into six short courses, one per job:

- Taking a course (for students)
- Using it as a parent
- Building your first course (for teachers)
- Running your course day to day
- Running a group class
- Running a whole school (for administrators)

Each one ends with a quiz and a certificate. Thirty of the thirty-one articles are in one of them. The last one is a technical chore only I ever do, and the system has that written down on purpose, so nobody forgets it was left out.

## The part I am proud of

Training goes out of date. Everyone knows this. You record a training video, you move a button six months later, and now your own training is lying to new hires.

So the courses do not contain the help text. **They read it.** Each lesson pulls the live help article when the course is built. Edit the article, rebuild, and the course says the new thing.

There is one more piece. If a help article is ever deleted, the course build **stops with an error naming it.** It does not quietly publish an empty lesson. That is the difference between a system that keeps itself honest and one that just seems fine until a customer reads it.

I also added an automatic check: if I write a new help article and forget to put it in a course, the check fails and tells me. The only way to leave an article out is to write down why. That reason sits in the code where the next person will read it.

## Why a certificate, not just a video

A certificate is not a diploma. It is a receipt. It says this person went through the whole thing.

That turns out to matter for three different people:

- **The new teacher** gets a finish line, instead of an endless list.
- **The school** can see who has actually been trained, instead of assuming.
- **Me** — I learn which course people quit, and that tells me which part of my software is confusing. People do not file a complaint about a confusing screen. They just stop.

## What to ask before you buy software

Training is usually a line item nobody examines. Two questions change that.

**1. "When you change the product, what happens to your training material?"**

Listen for a real mechanism. "We review it quarterly" means it is stale most of the time. "Our guides are built from the product" is a much better answer. If they look puzzled, assume the videos are from launch day.

**2. "How will I know who on my team actually finished it?"**

If the answer is "we send a link," you have no idea. You are paying for software your staff half-knows. That shows up later as support tickets, workarounds, and a person who quietly does the job in a spreadsheet instead.

## What to ask before you hire

There is a cheap way to see how someone thinks about this. Ask:

> "How would you keep our help documents from going out of date?"

Weak answer: "Set a reminder to review them." That is a plan to do the same work forever, and it fails the first busy month.

Strong answer: some version of "make the document and the product share a source, so changing one changes the other, and make it break loudly if they get separated."

That is the same instinct behind good work everywhere: do not rely on people remembering. Build it so forgetting is impossible, or at least noisy.

## The honest limits

I wrote this in a day, with help, and none of it is live yet. Each course has to be reviewed before anyone can take it, because my own rule says a course is not open until a person has read it. I am that person, and I have not read all six.

I also do not know yet whether people will take them. That is the real test, and it is a month away.

But the piece I was sure about is the boring one: the day I edit a help article, the course changes too. I have been burned by stale training before. Not this time.
