<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Counts, Not Names
Slug:    counts-not-names
Excerpt: Real estate agents need to show their sellers that the listing is
         working. I built a report they can print: views, tour opens and
         inquiries. What it leaves out matters as much: no names, no made-up
         percentages, and no numbers I don't actually collect.
Tags:    Buying Software, Plain Talk, Privacy, Data, RealEstate.WitUS
-->

# Counts, Not Names

When a house is for sale, the seller wants to know one thing every week: is anyone looking?

The agent needs an answer they can hand over. So my real estate tour app now makes a **seller report**: one page, ready to print or save as a PDF.

## What it shows

For the last 7, 30 or 90 days:

- **Views.** How many times the listing was seen.
- **Tour opens.** How many times someone opened the 360 tour, the walk-through of the house.
- **The share who opened the tour.** Out of all the views, how many went on to walk through.
- **Inquiries.** How many people got in touch, and how many asked to visit.

It also splits the views by where buyers found the listing: on its own page, or on the agent's own website, where the tour can be placed too.

Then there is a simple chart, one bar per day. For anyone who can't see the chart, the same numbers are written out in words and in a table.

## What it leaves out

This is the part I thought about longest.

**No names.** The listing counts how many times it was seen. It never records who looked. So the report can't name anyone, even if someone wanted it to. Inquiries are counted on the report, never quoted.

**No made-up percentages.** If a listing has no views yet, "0% opened the tour" would be a strange thing to print. It sounds like a failure, when really there is nothing to measure. So the report says "No views yet" instead.

**No numbers I don't collect.** My public roadmap used to promise "how long buyers stayed, and which rooms held them." The app doesn't measure that today. So when I built the report, I moved that promise back to "next" on the roadmap, and the report doesn't pretend.

## Why leaving things out builds trust

A report with a lot of numbers looks impressive. But a seller will make decisions from it, like whether to drop the price. Every number on it has to be one you can stand behind.

And a report that says "counts only, nobody who looked is named" tells the seller something else: buyers can look at this house without being tracked.

## The question to ask

When a vendor shows you their reports or "analytics," ask:

> "Which of these numbers could identify a person?"

Then ask:

> "What does this report say when there is no data yet?"

A good vendor answers the first with "none" and can show you the second.

## What this means when you hire

Two questions for anyone who builds reports:

- "How do you show a number you don't have?"
- "What would you leave out of a report for a client, and why?"

A good answer to the first is "I don't show it, and I say why." A weak answer is "we show zero."

## Where this stands

The report is built and tested, including a printed version. Its real test is the first seller who reads it.
