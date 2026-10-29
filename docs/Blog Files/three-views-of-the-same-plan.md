<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Three Views of the Same Plan
Slug:    three-views-of-the-same-plan
Excerpt: Chapter 10 of the Invest.WitUS tutorial puts the method engine on the web. The
         rules and the review from chapter 03 run unchanged, the plan and journal rows
         convert to the plain-Python values they were written for, and every rule shows its
         lesson link or the words "lesson coming", because no lesson URL exists yet and none
         gets invented. One context renders as a home page, an operator console and a
         lesson lab, and a test plants a price to prove no view prints it.
Tags:    Python, Django, Learning in Public, Invest.WitUS
-->

# Three Views of the Same Plan

Chapter 10 of the Invest.WitUS tutorial is the product's core on the web. [Chapter 09 was the watch list](/blog/a-watch-list-the-user-owns). The signed-in owner picks a method the package ships, writes down the plan's numbers for one account, logs what they bought, and reads the review of the journal against the method's rules. The review is [chapter 03's](/blog/learning-python-by-building-the-app-i-need), written in plain Python for the command line, and the chapter's first rule was that it runs on the web without a line changed.

## Rows that are values

The engine has existed since chapter 03: a rules file, a loader, a plan, a journal and a review function. The web layer wraps them without rewriting them. A plan row holds the method's id and the person's numbers, never a rule, and the loader reads the rules file at request time. A journal row mirrors the journal entry, plus shares and a note. Each model has one converter to the plain-Python value chapter 03 named; a test proves the round trip. The journal's action choices come from chapter 03's enum, so the two cannot drift.

One active plan per account, with ended plans kept as history, is a unique constraint with a condition. Django's reference describes the argument as "A Q object that specifies the condition you want the constraint to enforce" and gives the example of a constraint that "ensures that each user only has one draft" (Django Software Foundation, n.d.-a). Here the field is the account and the condition is an active plan. The form refuses a second active plan in words before the database has to.

## Lesson coming

Every rule is meant to link the lesson that explains it. No lesson exists yet. So every rule shows its lesson link or the literal words "lesson coming", and the words come from the rules file, not a template default. The only place a lesson URL can come from is that file; no template, no view and no test carries one, and none gets invented. When a lesson is published and its URL goes into the file, every plan's page picks it up at once, because no row ever copied the rules. That is the authoritative-values rule applied to lessons: a page can print a lesson it was given and nothing it was not.

## A, B and C

The research named three directions, and I asked for all three as views the user can switch between. One function builds the page's context once: each rule with its lesson, each rule's check with its status and evidence in words, each month as done, missed or open, and the next buy window, due now or upcoming. Three templates arrange it.

A is the home. One next action in a card, the on-plan status with the findings as its fix list, the plan with its rules and their lessons, the logbook with the form under it. The next thing to do comes first.

B is the operator console. A status list, then tables: rule checks with status, evidence and a lesson column; every month of the plan with its window, its buys, the amount and the shares; the findings by day; the journal.

C is the lesson lab. With no method running, each method the package ships, its summary, its rules with their lessons, and the start form under them, so the rules are read before the plan is written. With one running, the rules again, each saying how it has gone so far.

The switch is three plain links with `aria-current` on the current one, no script. The choice goes into the session, which Django describes as a way to "store and retrieve arbitrary data on a per-site-visitor basis" on the server side (Django Software Foundation, n.d.-b). Signing out calls `flush()` on the session (Django Software Foundation, n.d.-b), so the choice lasts one sign-in; a preference saved per person is an exercise. With no choice made, the page opens on A when a method runs and on C when none does.

## Same data, and no price

The three views show the same plan, rules, findings, months and journal; none hides a figure the others show. Each has one heading the others never print, and a test asserts the arrangements differ only in order.

The method page shows amounts and shares from the journal and reads nothing from the prices table. Adherence is about what you did, not what it is worth; the account page from chapter 08 keeps the valuation. The test for it plants a close for the plan's symbol and asserts that no view prints it.

## Left out on purpose

B has no order queue; there is no broker until chapter 11. A's confirm is the log form, and a skip with a reason is chapter 12's. C's rules do not switch on one at a time: one shipped method, five rules from one lesson set, no course content yet. Each is a row in the decisions log.

After the merge comes the migration, in the same sitting: between them every account page answers 500, because it asks the new table for the account's plan. Chapter 11 brings the paper broker.

## References

Django Software Foundation. (n.d.-a). *Constraints reference*. Django documentation (Version 5.2). Retrieved October 28, 2026, from https://docs.djangoproject.com/en/5.2/ref/models/constraints/

Django Software Foundation. (n.d.-b). *How to use sessions*. Django documentation (Version 5.2). Retrieved October 28, 2026, from https://docs.djangoproject.com/en/5.2/topics/http/sessions/
