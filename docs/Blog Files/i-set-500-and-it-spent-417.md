<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Set $500 and It Spent $417
Slug:    i-set-500-and-it-spent-417
Excerpt: I gave an Invest.WitUS plan $500 a month, thinking each symbol would get $500. The app
         splits the month's total across the symbols, and the month's box said $417. Two
         problems: a label that let me read the amount the wrong way, and a missing $83.33 that
         had four possible causes in the code, one of them a bug that could have spent past $500.
         The label is fixed, the bug is fixed, and the box now names every missing part.
Tags:    Python, Django, Learning in Public, Invest.WitUS
-->

# I Set $500 and It Spent $417

Invest.WitUS (invest.witus.online) is the investing app I am building to learn Python. It runs an investing method as a plan, and on an Alpaca paper account it places practice trades: pretend money, real market prices. I wrote about editing and deleting a plan in [Edit Before It Happens, Delete Only What Never Happened](/blog/edit-before-it-happens-delete-only-what-never-happened).

I set a plan's amount to $500. I thought that meant $500 of each symbol. It doesn't. The amount is the month's total, split equally across the symbols the plan buys that month. And when I looked at the month, the box said $417, not $500.

Those are two different problems. One was words. The other was money, or at least a number about money.

## The words

The field said **Amount each month**. Read with three symbols in mind, "each" can attach to the month or to the symbol. I attached it to the symbol. The code never had a doubt: since the chapter that built plans, the amount has been the month's total, split to the cent, with the odd cents going to the first symbols. Nothing on the page said so.

Now it does, everywhere the plan shows up:

- The field reads **Total amount each month**. The help under it says it is "not an amount for each symbol" and works an example: "$500 across 3 symbols is about $166.67 each." To put $500 into each of three symbols, the total is $1,500.
- On the edit and change pages, the example is worked for the plan's own symbols.
- Every summary of the plan reads like "$500.00 a month in all, split equally across ALPHA BETA GAMMA (about $166.67 each)." A plan with one symbol keeps "$100.00 into INDEX."
- The month's box adds "$500.00 in all this month, split across 3 symbols."

The meaning didn't change. Only the words did, and they were the bug I hit first.

## The money

The second problem is arithmetic. My month split $500 six ways: $83.33 each, with the odd cents on the first two. $416.67 is exactly five of those parts. So the question was never "why $417?" It was "which sixth of the month is missing?"

Claude read the code, not my account's data, and found four paths that leave one part out:

1. **Alpaca refused the order** when the app placed it. The app keeps Alpaca's message on the order and writes no journal entry for it.
2. **The order ended with nothing filled:** canceled, expired or rejected. The nightly sync removes its journal entry.
3. **The order filled only in part.** Paper trading does this on purpose. Alpaca's documentation says eligible orders "will receive partial fills for a random size 10% of the time" (Alpaca, 2026). The journal books what actually filled.
4. **A bug.** The box worked out the month's split again from the ranking every time the page loaded. This plan ranks candidates and buys the top ones. Say five were ranked when I pressed Confirm, so five orders went out at $100 each. If a sixth candidate's price history arrived afterward and moved it into the top six, the next page load split the month six ways. The five placed orders then showed as five $83.33 lines, $416.67, and the box offered a sixth Confirm for the newcomer. Pressing it would have sent another $83.33, past the plan's $500.

The fourth path is the one that worried me, because the box was offering a button that would have broken the plan's own rule.

## The fix, and what the box says now

Once a month has an order that is open or filled, the month's buys are the orders it placed, each at its own amount, in the order they were placed. A ranking that changes later can't re-split money already sent or stage a buy past the plan's amount. The newcomer is named instead: "Ranked into the top N after this month's buys were placed," with its symbol. A month whose orders all ended with nothing filled is split again from the plan, so a corrected plan can still place its buys.

The box now says what it has: **Bought or queued this month: $416.67 of $500.00.** Under that, one line for each missing part, with its reason: Alpaca's answer for a refused order, the final status for an order that filled nothing, "$30.00 of $83.33" for a part fill, or "not placed yet."

## What I don't know

I don't know which of the four paths my month took. Nobody has read my account's production data; the fix came from the code and its tests. The paper page's list of the orders the app placed shows each order's status and Alpaca's message, and the new box names the reason for each missing part. Under the first three paths, the month really was short. Under the fourth, I spent $500 and the box showed the wrong number.

So the honest title might be "the box said $417." I'll correct this paragraph once I've looked.

## Where it stands

The change merged on November 3 with 923 tests passing. It needed no migration of its own.

What I would carry to any app that handles money:

- **Say what an amount is per.** "Each month" was true and still let me misread it. A worked example under the field would have caught me.
- **Once money is sent, the record is the orders, not the formula.** A plan's numbers decide what to send. After that, what was sent decides what the page shows.
- **A shortfall needs a reason on the screen.** "$417 of $500" with nothing under it sends you to the code. One line per missing part does not.

## What this cost

The helper that made this change made three others the same day: a Settings page, striped table rows and a help form that keeps what you typed. The four together took about 6.32 credits of Claude usage over 98 responses, roughly $6.32. This post's change was one of the four, and I haven't tried to split the total, because the four weren't the same size. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helper's session transcript. Not counted: writing this post, the main session that coordinated the work, and my own time.

## References

Alpaca. (2026, July 7). *Paper trading*. Alpaca documentation. Retrieved November 3, 2026, from https://docs.alpaca.markets/docs/paper-trading
