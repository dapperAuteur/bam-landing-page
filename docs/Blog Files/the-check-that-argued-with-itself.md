<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Check That Argued With Itself
Slug:    the-check-that-argued-with-itself
Excerpt: I told my AI assistant two of my apps no longer shared a database.
         I had not checked, and it believed me. Here is how a review built to
         argue caught the mistake. Every review needs a "prove it wrong" step.
Tags:    Buying Software, AI Agents, Multi-agent, Verification, Hiring, Plain Talk, WitUS
-->

# The Check That Argued With Itself

Every check so far says two of my apps, CentenarianOS and Work.WitUS, still share one database. On October 5, I told my AI assistant they didn't anymore.

I had assumed it. The assistant believed me and saved my words to its memory. Its helpers rewrote documents in both apps to match: rules, guides, task lists and one line in a blog post.

None of it held up.

## How I found out

The next day I said Work.WitUS now ran on a different database service. That was wrong too.

This time the assistant ran a check before writing anything. And the check was built to argue with its own answer.

## A team built to disagree

The check used a team of AI helpers. They could read, but not change anything. They had four jobs:

- **Three investigators** found out what the app really uses today.
- **Three skeptics** got the investigators' answer. Their only job was to prove it wrong.
- **Four judges** asked what the wrong belief could have broken.
- **One writer** pulled it all into a single report.

The skeptics were the point. Someone who finds an answer tends to stop looking. A skeptic is handed the answer and sent to find the crack.

A team like this costs more than one look. Being wrong costs more.

## What came back

Every check said Work.WitUS had never moved.

The helpers looked at 242 branches of its code, counting copies on my computer and online. A branch is a separate line of work. Not one could connect to the other database. That database was set up in August for a planned move. No code in either app uses it. The settings files on my computer point both apps at the same database.

Then the skeptics took their turn. None of the three found a hole.

The report called this high confidence. That is what the phrase should mean. Not one look and a good feeling, but a real try at knocking the answer down.

The move was only a plan.

The helpers could not see my live hosting account. Only I can check that.

## The checks caught the helpers too

One early helper saw a second name in the settings. It took that as proof of a separate database. Three later checks found that name pointed at the same database. Later, a note said one app had moved. The writer's own final check found it had not.

Both slips pointed the same way as my wrong belief. Without those re-checks, one confident helper could have made it look proven.

## What the mistake could have done

The review listed 58 statements across my projects to fix or check. Not all came from my one line. Three that did worried me most:

- **A rule gave a false reason.** It said to stay careful "even though no second app reads these tables." That tells future work nobody else gets hurt. Every check says the other app still uses it.
- **A step could have changed the wrong emails.** A to-do list said to change the look and sender of login emails. Those settings belong to the database, not to one app. If the apps share it, as every check says, the **other** app's emails would change too.
- **Some steps could have sent a database change to the wrong system.**

The login emails scare me most. The change might not have shown any error. The first sign could have been my customers' inboxes.

## What we fixed

The same day, the assistant put the shared-database rules back. It added correction notes to three other documents and stop notes on the risky steps. It saved the checked fact to its memory.

## Why the owner needs a skeptic too

Earlier this week I wrote about a security test that could not fail. This was the same trap in a new shape. The helpers that rewrote the documents were asked to match my words. None was asked to disagree, so their work proved nothing.

My own house rule says to read a fact from the system that owns it. Never pass off a guess as true. It even names this case: another app's database. That has to include what the owner says. The owner is the person nobody questions.

A review where everyone looks for proof will find proof. So add one role whose only job is to say no. If the skeptic can't break the answer, you can trust it more. If the skeptic wins, it just saved you.

## The question to ask

> "When you checked this, who tried to prove it wrong, and what did they find?"

A good answer names who pushed back and what they tried. A weak answer is "we reviewed it and it looked fine."

## What this means when you hire

Two interview questions:

- "Tell me about a time a boss or client told you something wrong. How did you find out?"
- "When you review your own work, who gets to disagree with you, and how?"

Strong answers name a step and a person. Weak answers sound like "I just double-check."

## What's next

Documents in two other projects still say "split." Those get rewritten next. This time, I'll start with a check, not my word.
