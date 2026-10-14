<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Copied Code Copies Its Bugs
Slug:    copied-code-copies-its-bugs
Excerpt: One of my apps started as a copy of another. When I found a security
         mistake in the first app, I knew where to look next. I found the same
         mistake in the copy, 35 times. Here is why that happens and what to ask.
Tags:    Buying Software, Security, Hiring, Plain Talk, Work.WitUS, WitUS
PUBLISH ONLY AFTER: task 14 is merged (Work.WitUS repo, plans/user-tasks/14). No migration is needed for this post.
-->

# Copied Code Copies Its Bugs

I have an app called Work.WitUS. It helps people who work gigs track jobs, crews, pay, and travel.

It did not start from a blank page. It started as a copy of my other app, CentenarianOS. I copied the parts that made sense and trimmed the rest. That saved me months.

It also saved me a bug. I just did not know it yet.

## The mistake in the first app

Every record in an app has a number. Your invoice has one. Your trip has one. Your messages have them too.

When your browser asks for a record, it sends that number. The app should then ask one more question: **does this record belong to the person asking?**

In CentenarianOS, some parts of the app skipped that question. They took the number from the browser and just did the job. Read it, change it, or delete it.

Most of the time, nobody would notice. The numbers are long and hard to guess. But numbers leak. They show up in links, exports, and screenshots. Once someone has a number, a guess is not needed.

I found this in CentenarianOS on a Sunday. I wrote down a note to myself that same day: the copy almost surely has it too.

## The same mistake in the copy

On Monday I checked Work.WitUS. The note was right.

The same mistake was there, in the same shapes. Some of the same files had the same lines. Work.WitUS also had new features the first app never had, like crews and job sites. Those had their own versions of the gap.

In the end I fixed 35 gaps in Work.WitUS. Here are the kinds of things one signed-in person could have done to another person's data:

- delete some of their money records,
- delete pictures stored in the app,
- change notes saved about a job site,
- read message threads that were not theirs.

None of these needed special skill. That is what made them serious.

## How I fixed it

I did not patch 35 places by hand in 35 ways. I took the helper I had built for CentenarianOS and brought it over. It asks the "is this yours?" question the same way every time.

Then I added the rules that only Work.WitUS needed. A crew member's invoice, for example, points at a job someone else owns. That is allowed. It is their job too. So "is this yours?" became "are you on this job?" for jobs.

I also wrote automatic checks for the helper. There were 109 of them by the end of that branch. After the next two security fixes, there were 208, and they all passed.

## The lesson for anyone who buys software

Copying code is normal. Almost every app is built partly from other code. Templates, starter kits, old projects, and code from the internet are all copies.

But a copy is not just the good parts. **When you copy code, you copy its mistakes.** You also copy the habits that made those mistakes.

So when a bug turns up in one place, the right next question is: **where else did this code go?**

I knew the answer because I made the copy myself. Many teams do not know. The code came from a past job, an old client, or a tool. Nobody wrote down where it came from.

## The question to ask

When a vendor tells you they fixed a security problem, ask:

> "Where else does this same code live, and did you check those places too?"

A good answer names the other places. "It also lived in our older app, and we fixed it there." A weak answer only talks about the one spot that was reported.

## What this means when you hire

Two interview questions:

- "Tell me about a time you found a bug, then found the same bug somewhere else."
- "When you start a project from a template or old code, what do you check first?"

Listen for people who follow a bug past the first fix. The person who asks "where else?" saves you the second phone call.
