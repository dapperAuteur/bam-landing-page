<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Same Walk, Counted Twice
Slug:    the-same-walk-counted-twice
Excerpt: My fitness imports could add the same workout twice. One could quietly
         erase numbers I already had. Here is the rule my fix gives every
         import, and a script bug only my real Garmin file could show me.
Tags:    Buying Software, Data, Quality, Plain Talk, CentenarianOS
-->

# The Same Walk, Counted Twice

I keep my fitness data in my own app, CentenarianOS. Much of it comes from Garmin. That means activities, like walks, and daily numbers, like resting heart rate.

This month I asked a simple question. What happens if I bring in the same file twice?

The answer was not good.

## Eight doors, three locks

I found eight different ways fitness data gets into my app. Some are files you upload. Some are small programs, called scripts, that I run by hand. Some are links to device companies, but none of those are switched on yet.

The database itself blocked copies on only three of the eight. None of the eight showed you what was new before saving.

- **Workouts:** importing the same file twice copied every workout and every exercise.
- **Garmin activities:** each one was known by its date and title. Rename a walk in Garmin, and my app saw a brand new walk.
- **Long histories:** the check for old activities could only see about 1,000 of them. Anything past that could come in again.
- **Steps:** my Apple Health script added steps from every device together. Phone, watch and Garmin steps stacked up.
- **Daily health numbers:** these never got extra copies. But a blank cell in a new file could erase a number already saved.

That last one is the worst. Copies are easy to spot. Quiet erasing is not.

## One rule for every door

Each door was built on its own. No two agreed on what made records "the same."

My fix gives them one shared set of rules. The main rule is simple: **only add new data.**

- New days, activities and workouts get added. Ones already there get skipped.
- For daily health numbers, a blank field on a saved day can be filled in.
- A saved number is never replaced unless you tick a box that says so.
- A blank cell in your file never erases anything.

In the fix, a Garmin activity is known by the exact second it started, not its title. Two activities cannot start in the same second. So renaming a walk no longer brings it back.

## Look before you import

With the fix, the main imports start with a "Check" button. For daily health numbers, each day is sorted: new, already imported, fills a blank, or has a different value.

If a Garmin walk looks like a trip I logged by hand, it gets flagged and skipped. I can still choose to include it.

A workout with the same name on the same day is skipped too. An "Import anyway" box covers a real second session.

## A report that only looks

What about copies already in my data? I built a report that only reads. It lists likely copies and deletes nothing.

Cleaning them up is planned, not built. The plan is a screen where I approve each change.

## The bug only the real file could show

I also have a script that loads my Garmin workout history from an export. That is the file Garmin lets you download with your data.

It had a units bug. Workout times came out 1,000 times too large, and distances 100 times. A one-hour workout would have shown as 1,000 hours.

After fixing the units, I ran the script on my real export, without touching the database. That showed a second problem.

The script looked for files from a fixed list of names. My newest export numbered its files differently. So the script found no files and imported nothing.

With that fixed, the test read 13 files and 3,781 activities. One recording that appeared twice in the export counted once. A second run added nothing. The unit fix checked out too.

The file names were a guess about the export. Only the real file could prove that guess wrong.

## Where this stands

The fix is built and tested, but it is not live yet. Next, I review it and make one small database change by hand. Then I run the duplicate report on my own data.

My help pages also said Garmin synced on its own every day. It did not, and that link is still marked Coming Soon. My fix updates the help to say so.

## The question to ask

When a vendor says their app imports your data, ask:

> "What happens if I import the same file twice?"

Then ask them to show you. A good answer: nothing new is added, and nothing you had is changed.

Be careful with "duplicates are detected automatically." My own travel import said that too. It was only partly true.

## What this means when you hire

Two interview questions:

- "Tell me about an import you built. How did you make it safe to run twice?"
- "What did you test it with? Was it a real file from the real system?"

Strong builders test with a real export early. They can tell you what surprised them. A weak answer is "we made a sample file that matched the spec."
