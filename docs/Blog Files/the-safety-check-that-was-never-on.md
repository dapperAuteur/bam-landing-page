<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Safety Check That Was Never Switched On
Slug:    the-safety-check-that-was-never-on
Excerpt: My real estate app had a code checker that "passed" for months. When I
         went to add a rule to it, I found it had never checked anything. The
         first real run found 18 problems. A check that cannot fail is
         decoration, and here is how to tell which kind a vendor has.
Tags:    Buying Software, Plain Talk, Testing, RealEstate.WitUS
-->

# The Safety Check That Was Never Switched On

Software teams use a tool called a **linter**. It reads the code and points out mistakes before anyone runs it. Think of spell check, but for code.

My real estate app had a line in its setup that said "run the linter." It had been there for months. Nobody worried about it, because it never complained.

## What I found

This week I went to add a new rule to the linter. To do that, I had to look at how it was set up.

It was not set up.

The command did not check any code. It asked a setup question, got no answer, and stopped. From the outside, "stopped without complaining" looked exactly like "checked everything and found nothing wrong."

So the check had passed, every time, without ever looking.

## The first real run

Once I set it up properly, it found 18 problems on its first run.

None of them were disasters. A piece of test code that was never used. A settings file written in a style the checker dislikes. Two links the checker questioned that turned out to be right on purpose, so they now carry a note saying why. All dealt with the same day.

What matters is that for months, "the check passed" meant nothing at all. If a real mistake had been in there, the check would have passed that too.

## The rule I was adding

The new rule is about writing, not code. Nothing a customer reads may contain a long dash, the kind about as wide as the letter M.

Why? Long dashes are one of the most common signs of text a computer wrote and nobody edited. I want every word a customer reads to sound like a person wrote it, because a person did.

The new check found a few long dashes in customer-facing places: the page footer, a billing page title, and the subject line of the invoice email. They are gone now. And the check will stop the next one.

## A check that cannot fail is decoration

The lesson goes far beyond code. Any safety check, from a smoke alarm to a spam filter, has two possible states when it is quiet:

- it looked, and everything is fine,
- it never looked.

From the outside, they look the same. The only way to tell them apart is to make the check fail on purpose. Press the smoke alarm's test button. Put a known mistake in front of the checker and see if it says something.

The new dash rule has its own small tests that do exactly that: they feed it text with a dash and make sure it complains.

## The question to ask

When a vendor tells you their software is checked and tested, ask:

> "Show me one of those checks failing."

If they cannot make it fail, they cannot prove it works.

## What this means when you hire

Two questions for anyone who builds or maintains software:

- "Which of your checks have you seen fail on purpose?"
- "How would you know if one of your checks stopped running?"

A good answer has a specific story. A weak answer is "they're all green."

## Where this stands

The linter and the dash rule now run together as one command, and both have been seen failing on purpose before they were trusted.
