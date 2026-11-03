<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Rule Was Right for One Fund and Wrong for Three
Slug:    the-rule-was-right-for-one-fund
Excerpt: My investing app's index rules expected one buy of the plan's whole amount a month. Two
         days later the app started splitting that amount across the plan's funds, and the rules
         never heard about it, so every month with three funds failed. The fix is a second
         version of the rules, and every month I already closed keeps the version that judged it.
Tags:    Python, Django, Learning in Public, Invest.WitUS
-->

# The Rule Was Right for One Fund and Wrong for Three

Invest.WitUS (invest.witus.online) is the investing app I am building to learn Python. It doesn't tell me what to buy. It holds me to the method I chose, and each month I close it shows whether I followed the method's rules.

The new Compare page showed that one of my methods was failing that test every month, and the method wasn't the problem. The rules were.

## What the rules said

The index method's rules were written on October 27, in chapter 3 of the build. Two of them:

- "Buy once in every month of the plan."
- "Buy the plan's amount every time: no more after a good month, no less after a bad one."

The method's own summary said "the same amount into the same index fund." One fund. For one fund, those rules are exactly right.

On October 29, chapter 11 started placing practice orders, and a plan with several symbols split its amount across them. A $300 plan with three funds became three buys of $100. On November 3 the form finally said so: the amount is the month's total, which I wrote about in [I Set $500 and It Spent $417](/blog/i-set-500-and-it-spent-417).

The rules heard about none of it. For a three-fund month they saw "3 buys" where they expected one, and flagged each $100 buy as the wrong amount because they expected $300. Findings every month, while I was doing exactly what the plan said.

Nothing broke loudly. The month review just kept listing findings. It took the Compare page, which counts "followed in N of M closed months" in one cell, to make it obvious: an index plan with several funds read "followed in 0 of N." The helper building Compare wrote it down as found, not fixed, and moved on, which was right. A comparison page is the wrong place to quietly rewrite a method's rules.

## Two ways to fix it

The quick way was to edit the rules in place. That would also rewrite every month I had already closed. A month I reviewed and closed with findings would suddenly have none, and nothing would say why.

My answer was: "a version 2 of index-dca whose rules check one buy per symbol, with the month's total equal to the plan amount. Months already reviewed under version 1 stay as they were."

## Version 2

Version 2 is a new rules file next to the first. Version 1 ships unchanged. The rule names are the same, so a lesson written for a rule fits both versions.

- **One buy of each fund every month.** A month with no buy at all still reads "No buy in 2026-03." A month with buys names each fund that got none ("No buy of GAMMA in 2026-03.") and each fund bought twice.
- **The month's total equals the plan's amount, within one cent for each fund after the first.** That tolerance is the most that rounding can move the total. $100 across three funds is $33.33 and change: round each part one way and you get $99.99, the other way $100.02. A buy the app placed that filled in full books exactly its part, so a normal month adds up to the cent.
- **A refused order, one that filled nothing, or a part fill is still a finding.** The method's money did not all go in. The finding carries the reason in Alpaca's words, but the reason explains it to me; it doesn't excuse it.
- **Only my own skip explains a missing fund.** If I log a skip naming the fund that month, with my reason, the finding reads as explained. Nothing explains a second buy or a wrong total.
- **A plan with one fund gets the same findings as before, word for word.** One buy of each fund is one buy, and the total is that buy. That is tested on the original chapter's cases and more.

## Which version judges which month

This was the decision I cared about most. Each month's review now records the rules version that judged it the first time it was closed, and that never changes. Reopen a month and close it again, and it keeps its version.

- A month closed under version 1 keeps version 1's findings.
- Every other month, open, not reviewed yet or still to come, is judged by version 2.
- The method page lists the months still on version 1, and each month's review page names its version.

The database change is one new, empty column on the month reviews plus a data step that writes 1 on every month already closed, or closed and since reopened. It only fills empty rows, so running it twice changes nothing.

Two other designs were considered and dropped. Pinning the version on the plan would have kept my open months on version 1, the version that was wrong for them. Letting a reopen move a month to the newest rules would change a month I had reviewed, without saying so.

This has a cost I accept. Whatever version 1 said about a month I already closed, it still says. A month closed with false findings keeps them, and Compare counts it that way.

## What I learned

When you change what a number means, the rules that judge that number must change in the same change. The split and the rules lived in different chapters, two days apart, and nothing connected them.

And when the rules change, history has to keep the judge it had. A closed month is a record. If a new rule reaches back and rewrites it, I can no longer trust any month I closed.

## Where it stands

Version 2 is waiting to merge, together with the Compare page (Invest.WitUS task 37), with 1,002 tests passing. I haven't seen my index plan's months under version 2 on production yet.

## What this cost

The helper that built version 2, the version pin on each month and the migration took about 5.83 credits of Claude usage over 78 responses, roughly $5.83. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helper's session transcript. Not counted: writing this post, the main session that coordinated the work, and my own time.
