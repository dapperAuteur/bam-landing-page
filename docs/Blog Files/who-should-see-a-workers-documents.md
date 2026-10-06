<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Who Should See a Worker's Documents?
Slug:    who-should-see-a-workers-documents
Excerpt: In my gig-work app, the person who owned a job could see a crew
         member's private tax form. A database rule also let any signed-in
         user read shared job papers. I changed it so workers choose what to share.
Tags:    Buying Software, Privacy, Security, Hiring, Plain Talk, Work.WitUS, WitUS
PUBLISH ONLY AFTER: tasks 14, 15 and 16 are merged and migration 197 is applied (Work.WitUS repo, plans/user-tasks/14, 15 and 16).
-->

# Who Should See a Worker's Documents?

My app Work.WitUS helps people run gig jobs. One person owns a job. Other people join it as crew.

Each job has a place for documents. Workers add notes, reports, and papers there. Some of those papers are private. A W-9 is a tax form that holds a person's tax number. A certificate shows a person's training. These belong to the worker.

I found two ways those papers were seen by the wrong people.

## Problem one: the boss could see everything

When a crew member added a document, the job owner could see it. So could the person who listed the job. That included private papers, like W-9s and certificates.

Nobody asked the worker. There was no "share" choice at all. The app just assumed the boss should see it.

That is a common way to think about work. It is not a safe way to think about private papers.

## Problem two: a rule that was far too wide

The second problem was deeper. It lived in the database, not the app's screens.

A database can hold its own rules about who reads what. One of my rules was meant to say, "people on this job can read the papers shared on this job."

What it really said was closer to this: "anyone signed in can read every shared paper, on every job."

The app's screens never showed papers that way. But the screens are not the only way to reach a database. Someone who knew how could ask it directly. The rule would have said yes.

A second rule had a smaller gap. It let people attach their own papers to jobs they were not on.

## What I decided

The fix was not only code. It was a choice about people. Who should decide what a crew member shares?

I chose: **the crew member decides, and nothing is shared unless they say so.**

Now, when you add a document, you see a box that says "Share with everyone on this job." It starts unticked. Each document shows a label, "Shared with job" or "Only you," so nobody has to guess.

The rules are simple now:

- You see your own documents.
- You see documents others chose to share, but only on jobs you are on.
- Being the owner or the lister adds nothing on top of that.
- If you are not on the job, the app acts like the job does not exist.

I also replaced both database rules. The new ones check that you are on the job before showing anything.

## The honest cost

Some crew members added notes and reports before this change. Those are now private, because nobody ticked a box back then. So owners stopped seeing some notes they used to see.

I chose that on purpose. If someone missed a note, a worker can share it in one click. A tax form that leaked cannot be taken back.

## The question to ask

When you hire people through any app, ask the vendor:

> "Who can see the papers my workers upload, and who decides that?"

Listen for "the worker decides" or a clear list of who sees what. Be careful with "the job owner sees everything." That may be convenient. It is not the worker's choice.

## What this means when you hire

Two interview questions:

- "Tell me about a time a database rule allowed more than the app's screens did."
- "When privacy and convenience pull in different directions, how do you choose a default?"

Good answers to the first one mention checking the rules directly, not just clicking through the app. Good answers to the second one name who gets hurt by each choice.
