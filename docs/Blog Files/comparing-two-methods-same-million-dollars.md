<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Comparing Two Methods With the Same Million Dollars
Slug:    comparing-two-methods-same-million-dollars
Excerpt: I gave two Alpaca paper accounts the same $1,000,000, the same $50,000 a month and the
         same symbols, and ran a different investing method in each. Then I needed a page that
         compares them fairly: a line that deposits can't lift, a return that won't stretch three
         days into a year, a yardstick from my own symbols, and a plain note about what the value
         leaves out.
Tags:    Python, Django, Learning in Public, Invest.WitUS
-->

# Comparing Two Methods With the Same Million Dollars

Invest.WitUS (invest.witus.online) is the investing app I am building to learn Python. Each chapter of the build is a tutorial chapter, and chapter 15 is **Compare methods**: two to four of my accounts on one chart and one table.

It exists because of the setup I wrote about in [One Alpaca Paper Account per Method, and as Many Keys as I Need](/blog/one-alpaca-paper-account-per-method). Each method runs in its own account, linked to its own Alpaca paper account, so each spends its own pretend cash.

## The test I set up

Two Alpaca paper accounts, each starting with $1,000,000:

- **B_MOMENTUM** runs 12-1 momentum. It ranks the symbols on my list and buys the top ones.
- **B_INDEX** runs index investing with a fixed monthly amount. It buys every symbol on the list.

Each plan puts in $50,000 a month in all, across the same list of symbols. Same starting cash, same monthly amount, same list. Only the method differs. That is the whole point of the test, and it only works if the page comparing them is fair too.

Alpaca made the setup possible. Its paper trading "allows up to 3 distinct simulated accounts with separate balances and positions" (Ido, 2026), so one login can hold the default account I already had and these two. Each new account needs its own keys. Alpaca's docs say: "Don't forget to generate new API keys for any newly created account" (Alpaca, 2026).

## One character short

The app finds each pair of keys on the server by the variable's name, and the end of the name is the slot. The documented form puts two `_` characters before the slot. I typed one. The app didn't match the name, said nothing, and the slots page showed only DEFAULT. That cost a redeploy before anyone knew why.

Now a single `_` is read as the same slot. If both forms are set with different values, the slot is marked **conflicting** and nothing trades through it until I delete one, because picking one quietly could trade in the wrong Alpaca account. And every variable starting `ALPACA_PAPER_` that the app can't use is listed by name, never by value, with its reason: one half of a pair, a bad character, an unknown prefix. A setting the app ignores should say it was ignored.

## What the page shows

**A line that deposits can't lift.** Each account's line starts at 100 on its first day with a holding. Each day it moves by what the holdings did, with that day's new money left out. A $50,000 deposit doesn't lift it. A 1% rise in what the account holds does. Plotting plain dollars would make both methods look brilliant every time money arrived. This is the time-weighted return, and it judges the method alone.

**A return that counts the timing.** The money-weighted return (XIRR) asks what single rate explains every deposit and the value now. It judges the method and the timing of the money together. There is no formula for it, so the code narrows in on it by halving an interval, and gives no answer rather than a guess when no rate fits.

**No stretching a short result.** My accounts are days old. A loss of 14% over three days works out to a yearly rate of about -99.99999998%. That number is too close to -100% to find reliably and too large to mean anything. So under a year, both returns read "over N days," the change over the days shown. From a year on, they are yearly.

**The worst drop,** the largest fall of the line from a high to a later low, with both dates.

**Plan followed,** such as "followed in 2 of 3 closed months," from the months I closed in the month review. Testing the page showed that an index plan like B_INDEX would read "followed in 0 of N." That was the rules being wrong, not the plan, and it is the next post.

**A yardstick of my own.** A do-nothing line: an S&P 500 index fund, bought once and never touched. The app names no real fund anywhere, so the page picks the first S&P 500 fund it finds among symbols I already hold, watch or name in a plan, and I can pick another. If it has no stored prices for the dates, the page says so and offers to fetch them.

**Alpaca's own numbers as a cross-check.** For a linked account, a second table shows Alpaca's equity and cash beside the value the app worked out. If Alpaca doesn't answer within five seconds, that row says so and the rest of the page draws.

## What the value leaves out

The app never kept a cash ledger. It knows the trades and the prices, so the value it shows is what the trades bought. The cash an Alpaca paper account keeps beside them, most of its $1,000,000 at first, is not in that number. The page says so in words. That is why the Alpaca table is there: its equity includes the cash, and equity less cash should sit close to the app's value. A gap of more than a few percent means a trade missing from the journal or a price missing from the app.

## Practice or real

The same day I asked for a way to tell a practice account from one that holds my real statements: "A simple symbol should be enough." Every account name now has a small badge: a test tube and **Practice**, or a bank and **Real**. It is worked out from the account's existing kind (paper, brokerage or retirement), so there was nothing new to store and no migration. The word is always there and the practice badge has a dashed border, so neither the symbol nor a color is the only signal.

## Where it stands

All of this is waiting to merge (Invest.WitUS task 37). I haven't seen my two accounts on the production page yet. When I do, the numbers will mean very little: a few months prove nothing about a method, and past results don't predict future ones. The page says that too.

## What this cost

Two helpers built this. One built the Compare page and the badge and stacked them on the slot-name fix: about 11.05 credits of Claude usage over 132 responses. The slot-name fix itself took about 2.65 credits over 47 responses. About 13.70 credits in all, roughly $13.70. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helpers' session transcripts. Not counted: writing this post, the main session that coordinated the work, and my own time.

## What I would carry

- **Make the test fair before the page.** Same cash, same amount, same list.
- **Keep new money out of the line.** Otherwise every deposit reads as growth.
- **Don't annualize a few days.** Say "over N days" and stop.
- **Say what a number leaves out, on the page.** "Value now" without "no cash ledger" next to it would have been a quiet lie.
- **A name the app ignores should be listed with the reason.** Silence cost me a redeploy.

## References

Alpaca. (2026, July 7). *Paper trading*. Alpaca documentation. Retrieved November 3, 2026, from https://docs.alpaca.markets/docs/paper-trading

Ido, S. (2026, March 23). *How to start paper trading with Alpaca's Trading API*. Alpaca. Retrieved November 3, 2026, from https://alpaca.markets/learn/start-paper-trading
