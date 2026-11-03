<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   "Not Enough History" Is an Answer
Slug:    not-enough-history-is-an-answer
Excerpt: Chapter 14a of the Invest.WitUS tutorial shows 12-1 momentum over time: how each
         candidate's rank moved since last month, and the 12-1 return as a line over 24
         months. The math took an hour, because it was chapter 14's math in a loop. The rest
         went into what to show when there is no number: a window that needs twelve closes,
         not thirteen, a move that is not zero, a line that breaks at a gap, and a test that
         failed before I changed anything.
Tags:    Python, Django, Learning in Public, Invest.WitUS
-->

# "Not Enough History" Is an Answer

Invest.WitUS is the Python app I am building to learn Python, one tutorial chapter at a time ([the first post explains why](/blog/learning-python-by-building-the-app-i-need)). Chapter 14 added a second investing method, 12-1 momentum: each month, rank a list of candidates you chose by how much each one rose over the past year without its latest month, and put the month's money into the top few. Chapter 14a, an addendum, shows how that ranking moves over time. It adds two pictures, for the account's owner only. One is a table of each candidate's rank this month and last month, and how far it moved. The other is a line of the 12-1 return over the last 24 months on each symbol's page.

The math was the small part. Most of the chapter went into deciding what the page says when there is no number to show.

## The formula, and where it comes from

Write `P(m)` for the last stored adjusted close in calendar month `m`. A rebalance in month `M` reads

```text
R(M) = P(M-2) / P(M-13) - 1
```

That is the change from the end of the month 13 months back to the end of the month 2 months back. The latest full month, `M-1`, is left out. It is the same window as the momentum factor in Kenneth French's data library, whose stocks need "a price for the end of month t-13 and a good return for t-2" (French, n.d.). The idea of ranking by past return goes back at least to Jegadeesh and Titman (1993), who tested "strategies which buy stocks that have performed well in the past and sell stocks that have performed poorly." That is a finding about a past sample. The app shows arithmetic on your own list and says, on every page, that it is information and not advice.

The rolling line is `R(M)` for each of the last 24 months. The rank change is last month's place minus this month's place.

## No new math

Both pictures call chapter 14's functions in a loop: the one that scores one symbol for one month, and the one that ranks a list for one month. There is no second copy of the formula. If I had written the line's arithmetic again, the line and the ranking could disagree someday, and the newest point on the line is supposed to be the exact number the ranking used this month. One function, called 24 times, cannot disagree with itself.

## Twelve closes, not thirteen

The brief for this chapter said to show "not enough history" for a symbol with fewer than 13 months of closes. Working the first test out by hand showed that is off by one. A window from the end of `M-13` to the end of `M-2` needs one close at each end, and those ends are eleven months apart. Twelve month-end closes are enough for exactly one month's number. Eleven are enough for none.

The test now pins that boundary from both sides: eleven month-ends score nothing, twelve score one month, and the comment says which one. Someone will want to "fix" it to thirteen someday, and the test will tell them why not.

## A zero is a claim

A candidate that was ranked last month and is not ranked this month has no move. The easy code returns 0 for "places moved", and then the page prints "same place". That is a claim nobody computed. The move is `None` whenever either month has no rank, and the page says what happened in words: "new in the ranking", "not ranked this month", or "not ranked". A real move gets an arrow and a count: "▲ up 2 places". The words and the arrow carry the meaning, so it reads without color.

The same rule applies to the line. A month whose window is missing a close at either end gets no point, and the line breaks there instead of joining its neighbors across the gap. The table under the chart lists every month, and a month without a number says "not enough history" and names the two months its window needs. A month missing in the middle of a window changes nothing, because the return reads only the two ends. There is a test for that too.

## The same list in every month

A plan's list of candidates can change. If each past month were ranked with the list it had then, the columns of the history table would compare different lists, and a "move" could just mean a new symbol showed up. So every month ranks today's list, and the page says so: a month before you changed the list shows how today's list would have ranked then. When the app picks what a comparison means, the page has to say what it picked.

## The test that failed before I started

Before writing any code I ran the whole test suite on `main`. One test failed. It was a chapter 08 test with a statement dated October 25, 2026, and the account page marks anything more than five days old as stale. The test passed on the day it was written and failed on October 31, with no code changed. The app was right; the test had a date in it that was compared to today.

I fixed the test so the expected row follows the same stale rule, put the fix on its own branch, and started the chapter from it, so the chapter's "all tests pass" line is true for anyone who runs it later. Any fixed date in a test that the code compares to today will fail someday. The cheap time to find one is when the test is written, by asking what the code compares that date to.

## At 320 pixels

I looked at both pictures in a headless browser at 320 and 1024 pixels wide. On a phone, the month labels under the line ran into each other, so every other label is now hidden on a narrow screen, the same rule the price chart already used. The dots on the line are HTML, not SVG, because the SVG is stretched to fit its box and a circle inside it draws as an oval. Neither page scrolls sideways.

## References

French, K. R. (n.d.). *Detail for monthly momentum factor (Mom)*. Kenneth R. French Data Library, Tuck School of Business at Dartmouth. Retrieved November 1, 2026, from https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/Data_Library/det_mom_factor.html

Jegadeesh, N., & Titman, S. (1993). Returns to buying winners and selling losers: Implications for stock market efficiency. *The Journal of Finance, 48*(1), 65-91. https://doi.org/10.1111/j.1540-6261.1993.tb04702.x
