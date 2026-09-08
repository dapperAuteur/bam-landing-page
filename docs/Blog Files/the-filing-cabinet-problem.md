<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Filing Cabinet Problem
Slug:    the-filing-cabinet-problem
Excerpt: Two apps shared one database and had to be separated. Explained with no
         jargon: why the moving list was missing three quarters of what it
         needed, why deleting old courses did not make the job smaller, and how
         ten hours of work could bill correctly and forecast as zero dollars at
         the same time.
Tags:    Explainers, Software, Data, Plain English, Engineering
-->

# The Filing Cabinet Problem

I want to explain a piece of software work without any jargon, because the interesting parts of it are not technical at all. They are about the difference between what is written down and what is true, and that shows up everywhere.

Here is the setup. I run two applications. One helps me manage my health and my life; the other helps me run contract work. They started life as one thing, so they still keep all their information in a single shared filing cabinet.

That worked when they were one thing. Now they are two businesses, and the shared cabinet means neither can change without risking the other. So the job is to give the second app its own cabinet and move its files across, without losing anything and without breaking either app while it happens.

## The list that was missing three quarters of itself

The first job is deciding which files move.

I built that list by following the **cross-references**. If a job record points at a customer record, the customer has to come too, otherwise you move one half of a pair and leave the other behind. That is a real technique, and it caught real problems.

But it only finds files that are *pointed at*. It does not find files that the app simply *opens and reads*.

There is an equipment list. Eleven different parts of the contract-work app open it and read from it. Nothing points at it. So my method never saw it.

When I checked properly, by counting every file the app actually opens rather than every file something points at:

> The app opens **146** different files. My list moved **34**.

Move only those, and on the first morning the app does not start at all.

The part I find worth sitting with: I was not being sloppy. I was being careful about the wrong thing. Following the cross-references *felt* rigorous the entire time, and it produced a confident, tidy, wrong answer. Being thorough about the wrong question is more dangerous than being careless, because carelessness at least feels like carelessness.

It surfaced because two lists I had written disagreed with each other about that one equipment file. A small inconsistency sitting on top of a large one.

## Why throwing away courses did not shrink the job

The app has a course system. We decided it should keep only the courses that teach people how to use the app itself, and move everything else to a different product.

Sensible decision. It did not reduce the moving job at all, and the reason is worth understanding because the same trap turns up constantly.

A course system needs a certain set of drawers no matter what is in them. One for courses. One for lessons. One for who is enrolled. One for who completed what. One for teachers. About twelve drawers in total.

**Whether those drawers hold three courses or three hundred, you still need all twelve drawers.**

Throwing away paperwork does not reduce the number of drawers. Only removing the whole filing system does. Which is why the decision eventually became: move the tutorials out entirely, rather than trim them down.

The general shape: reducing *how much* of something you have often does nothing to reduce *how complicated* it is to keep. Those feel like the same lever. They are not.

## Ten hours that billed correctly and forecast as nothing

When you record hours on a job, you can either break them down into normal hours, overtime, and double-time, or you can just write a total.

Someone wrote a total. Ten hours.

The part of the system that **bills the client** handles that fine. It looks for a breakdown, finds none, falls back to the total, and bills ten hours.

The part that **forecasts income** only ever looks at the breakdown. It found nothing there and concluded the job was worth **zero dollars**.

Same ten hours. The invoice says one thing and the forecast says another, and nothing anywhere reports a problem, because from each side's point of view nothing went wrong.

I had copied that forecasting logic into new code, carefully, line for line. Which means I had faithfully copied the flaw. I was checking my copy against the original instead of against reality, and the original was wrong.

## Four jobs that were never there

When someone assigns you to a job, it should appear on your planner.

It never did. The code that fetched those assignments also tried to fetch the name of the person who assigned them, in a way the database could not actually perform. So the whole request failed. And the code receiving that failure was written to shrug and return an empty list.

Four assigned jobs, silently missing, for as long as that code has existed. No error message, no warning, nothing in any log.

It only came to light because a script I wrote reported its errors instead of swallowing them. The original code and my script asked the database the same impossible question. The difference was entirely in what each did with the refusal.

That is a pattern worth recognising outside software: **a system that quietly copes with failure is indistinguishable from a system that is working**, right up until you count something.

## Rehearsing on something that cannot break

Before touching anything real, I set up a throwaway copy of a database on my own machine, built the new structure inside it, and moved a copy of the data across. Then I did the whole thing a second time, to check that repeating it was harmless.

That rehearsal found four problems that reading the plan would never have found. The clearest one: a single column stores a kind of mathematical fingerprint of text, used for searching, and it needs a specific add-on installed before it will work at all. Nobody had written that down anywhere. The rehearsal simply stopped and said so.

The point is not that rehearsals are clever. They are not. The point is that **a plan that looks correct and a plan that is correct are different things, and running it somewhere harmless is the only cheap way to tell them apart.**

## What all of it has in common

Nine mistakes over one long working session. Seven of them were caught within seconds, by something running and reporting back. Two were caught days later by another person.

None were caught by me re-reading my own work, and I re-read it a great deal.

Every mistake that survived had the same shape. I read something written down, believed it, and moved on. Including three things I had written myself: a plan that said the job was small, a summary table where I had shortened a name to fit a column and then fed the shortened version back in as input, and my own definition of what a complete list looked like.

Written things are confident and they are quiet. A note does not object when it goes out of date. A plan does not announce that the thing it describes has changed. A table does not mention that a name was truncated to fit.

That is the whole lesson, and it is not really about databases. It is about the difference between a claim and a measurement, and about how easily your own notes turn into the former while you keep treating them as the latter.
