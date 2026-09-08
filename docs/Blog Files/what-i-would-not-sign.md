<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   What I Would Not Sign Yet
Slug:    what-i-would-not-sign
Excerpt: A hand-off written the way an apprentice should write one: not "here is
         what I did" but "here is what you would be putting your name on, and
         here is where I would not sign it yet." Four things I stand behind,
         three I do not, and the one standard worth enforcing on anyone who
         hands you work.
Tags:    Engineering Judgment, Code Review, Mentorship, Postgres, Migrations, Craft
-->

# What I Would Not Sign Yet

Most hand-offs are written as status. Here is what I did, here is what is left, here are the tickets.

That format has a hole in it. It tells the person taking responsibility what happened, but not where the work is thin. And if their name is going on it, thin is the only thing they actually need from you.

So this is a hand-off written the other way round, from a session spent separating two applications that had been sharing one Postgres database. Four things I would stand behind, three I would not, and the one standard I think is worth enforcing on anybody who hands you work, including me.

## What I would put a name on

**The trigger replacements.** Two database triggers wrote rows into app A whenever something changed in app B. They cannot survive a split, so they had to become application code. I ported them status for status against the original SQL, and made the new code idempotent with the old triggers still running, so both could operate side by side. That last part matters more than the port: it means no cutover ordering is required, and no window where one is live and the other is not.

**The generated schema.** 34 tables of it. Nobody typed a line. The usual tool refused to run, and rather than hand-transcribe the structure from two hundred migration files, I asked the database to emit its own definitions. Transcription error is simply not a failure mode that exists in the result.

**The data move.** Rehearsed on a throwaway database before touching anything real: every table's row count matched, zero orphaned references, and running it a second time changed nothing. The second run is the one I would point at. Anyone can make a migration work once.

**The feature removal.** 86 files, 17,000 lines, build green, and every inbound link repointed rather than deleted so nothing returns a 404.

## What I would not sign

**The scope.** This is the big one. The app being migrated reads 146 database tables. The schema I built provides 34. Deploy it and the application does not start.

I would not let that near a cutover window. And the fix is not more engineering, it is a decision about what the app should still contain, which is not mine to make.

**The admin cleanup.** I estimated that a set of inherited admin screens could be removed for free, no operational cost. Then I looked properly, and several of the candidates have live public pages. Removing them deletes a working feature.

I stopped rather than delete something real to hit a number I had quoted. The number was mine and it was wrong, and the honest move is to say so rather than make the codebase match the estimate.

**The billing code.** The subscription plan for a feature I removed is still live in the payment webhook. It is billing. It deserves its own change with its own review, not a ride-along inside a 17,000-line deletion where nobody will read it.

## Where I would look hardest

If you only review three things, review the three where I was most confident and most wrong. Confidence is the signal, not doubt. I flagged everything I was unsure about; those got checked. The damage was in what I did not think to check.

**Any list I built by following relationships.** I derived the migration scope from the database's own foreign keys, which is a real technique and it found real problems. It also missed 112 of 146 tables, because following relationships finds what is *pointed at*, not what is *read*. One table is opened by eleven different parts of the app with no relationship pointing at it. It was invisible to the method, and the method felt rigorous the whole time.

Being rigorous about the wrong thing is more dangerous than being careless, because it arrives with the feeling of having been thorough.

**Any hand-maintained list.** The rule for splitting financial records works on 98% of rows. The other 2% are six real invoices that were paid into the wrong account, and they are currently handled by a list of thirteen IDs typed into a document. That works today. Hand-maintained lists rot, and this one has no mechanism to tell you when it has.

**Any check that passed once.** A validation confirming no broken references currently passes. One invoice paid into a personal account between now and the cutover reopens the problem, silently. It has to run immediately before, not once and then be trusted.

## The standard

Here is the count from that session. Nine mistakes. Seven caught within seconds by something running and reporting back. Two caught days later by the person I was working for. Zero caught by me re-reading my own work, and I re-read it constantly.

Every mistake that survived was the same shape: I read something written down, believed it, and moved on. Including three things I had written myself. My own plan said the job was small. My own summary table shortened a name to fit a column, and I later fed that shortened name back in as input and got an answer that was wrong by 25 records and looked completely plausible.

So the standard I would ask anyone to hold me to is narrow and easy to apply:

> **When someone hands you a number, ask what produced it.**

If the answer is a document, a plan, or a summary, it is a claim. If the answer is a command that ran, it is evidence. Both arrive in the same tone of voice, in the same font, in the same confident sentence. There is no way to tell them apart from how they are said.

That is not the reader's problem to solve by being suspicious of everything. It is the writer's problem to solve by saying which one it is. I stated a scope of 34 tables and a scope of 146 tables with exactly the same confidence, six days apart. Only one of them had been counted.

The fix is not to be less confident. It is to say, every time, whether the thing behind the number was executed or merely written.
