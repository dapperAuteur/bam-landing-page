<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   One Sentence I Never Checked
Slug:    one-sentence-i-never-checked
Excerpt: I told my AI assistant one thing I had not checked. Its helpers wrote
         it into rules, guides, to-do lists and a blog post. A later check
         proved it wrong. Here is why speed spreads a wrong idea, and the one
         check that stops it.
Tags:    Buying Software, AI Agents, Verification, Quality, Hiring, Plain Talk, CentenarianOS, Work.WitUS, WitUS
-->

# One Sentence I Never Checked

A database is where an app keeps its records: people, settings, jobs, payments. As far as every check can tell, two of my apps share one. They are CentenarianOS and Work.WitUS.

On October 5, I typed one short line to my AI assistant. I said the two apps "no longer share a db." (Db is short for database.)

I had assumed it. I had not checked.

## How far one line went

The assistant took my word as fact. It saved the line to its memory notes. Then it sent helpers to update the documents in both apps. A helper is another copy of the AI, given one job.

The helpers were fast. The "split" went into the rules the assistant reads before every job. It went into the guides, the design notes and the log of database changes. It went into my to-do lists. It even went into one of my blog posts.

That post is "The Security Test Passed Because Nothing Changed." It opens with "Two of my apps share one database." A helper changed it to "at the time." I have changed it back.

One rewritten rule worried me most. It said to stay careful with database changes "even though no second app reads these tables." Tables are where a database keeps each kind of record.

That line sounds careful. But it tells the next helper that no other app can get hurt. The old rule said to check the other app before removing or renaming anything. The new one dropped that step.

## How I found out

The next day I made a second claim. I said Work.WitUS now ran on a different database service. That was wrong too.

This time the assistant checked before writing. Its team of helpers could only read, not change. Three had one job: prove the result wrong. None could.

What they found:

- Work.WitUS still runs on its original database setup.
- A new database was set up in August for a planned move. No code in either app uses it yet.
- On my computer, both apps' settings point at the same database.

Files on my computer can't prove what the live apps use. Only I can check that, in my hosting account.

The helpers also listed **58 statements across my projects** to fix or check. Not all came from my one line. The three that worried me most did.

## What it could have broken

Wrong documents are not just untidy. These ones gave instructions.

- **A rule saying no other app used that data.** A future helper could have changed something the other app needs.
- **A step to rebrand the login emails.** Those settings belong to the database, not to one app. If both apps share it, as every check says, the other app's emails would change too.
- **Directions that could have sent a database change to the wrong system,** where it would reach no app at all.

## Why speed made it worse

Each helper did its job well. That is the problem.

A helper gets a fact and a task. It does the task. Checking the fact is not part of the job unless someone makes it part.

When writing is slow, a wrong idea spreads slowly. There is time for someone to notice. When writing takes seconds, the idea is everywhere before anyone looks.

When every document agrees, the idea looks proven. But many documents agreeing is still one sentence. Nobody had checked it even once.

## What we fixed the same day

The "shared database" rules went back into the rule file. The wrong rule never reached the main version of the app. The risky steps got stop notes. Three other documents got a correction note until they can be rewritten.

The checked fact went into the assistant's memory notes.

## The rule

Check the starting fact before you copy it everywhere.

My standing rules for the assistant already say this. Read a fact from the system that owns it. Never pass off a guess as true. The rule even names this case: another app's database. The assistant had that rule in front of it, and it still took my word. That rule has to cover my words too.

This is a cousin of my earlier post, "The Security Test Passed Because Nothing Changed." A check only means something if it could come back "no." Nobody asked if the split was false, so nothing could catch it.

## The question to ask

When a vendor says something changed in your system, ask:

> "What did you look at to confirm that, besides someone's word?"

A good answer names something they checked. A weak answer is "the team said so."

## What this means when you hire

Two interview questions:

- "Tell me about a time someone handed you a wrong fact. How did you notice?"
- "Before you change many files at once, what do you check first?"

Listen for people who check the starting point, not just the work. Fast people who check first are rare.

## What's next

Some documents still say "split." I am fixing them one at a time.

The move to a new database is still a plan. When it happens, the documents change after it, not before.
