<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Can't Embed a 10-K. I Can Read One.
Slug:    i-cant-embed-a-10-k-i-can-read-one
Excerpt: I wanted 10-K, 10-Q and 8-K filings inside Invest.WitUS. The SEC's pages refuse to sit in a
         frame, but its free JSON feeds answer, so chapter 16 links every filing and reads the key
         numbers itself. Plus the client name I send instead of an email address, the dozen names a
         company can give revenue, and the index-fund line chapter 15 was missing.
Tags:    Python, Django, SEC EDGAR, XBRL, Learning in Public, Invest.WitUS
PUBLISH ONLY AFTER: invest-witus task 40 is merged (bundle/invest-sec-and-yardstick-2026-11-10), its migrate run and production deploy are green, one stock page shows Filings and Key numbers on production, and #184 (comparing-two-methods-same-million-dollars) and #175 (my-email-went-out-in-36-map-lookups) are live.
-->

# I Can't Embed a 10-K. I Can Read One.

Invest.WitUS (invest.witus.online) is the investing app I'm building to learn Python, one tutorial chapter at a time. On 2026-11-02 I asked whether it could show a company's 10-K, 10-Q and other filings inside the app, and whether to link them or embed them. Chapter 16, "Reading what the company reports: SEC EDGAR," is the answer. It was built tonight and is waiting to merge.

## The frame says no

I checked embedding the same day. The SEC's pages answer with `X-Frame-Options: SAMEORIGIN` and a content security policy of `frame-ancestors 'self'`. Both say the same thing: only sec.gov may put these pages in a frame. An iframe on invest.witus.online would show an empty box.

So the filings open on sec.gov, in a new tab. A public record is for linking, not copying: a copy in my app is a copy I'd have to keep correct.

The numbers are a different story. The SEC publishes free JSON feeds: a company's list of submissions, the companyfacts feed with every figure the company tagged in XBRL, and two ticker maps, one for companies and one for funds. In the SEC's words, "These APIs do not require any authentication or API keys to access" (U.S. Securities and Exchange Commission [SEC], 2025). But the SEC does ask every automated client to declare a User-Agent, and it publishes a ceiling: "Current max request rate: 10 requests/second" (SEC, 2024).

## Who's asking

The SEC's own example User-Agent is a company name followed by an admin contact email (SEC, 2024). I didn't copy that part.

The ecosystem rule is that my email never goes to an outside service. I wrote that rule after [my email address went out in 36 map lookups](/blog/my-email-went-out-in-36-map-lookups). So every request from the app carries this, and nothing else:

```
Invest.WitUS (https://invest.witus.online)
```

It says honestly who is calling and where to look. If the SEC ever insists on a mailbox, it will be an operations address on a witus domain, and that's my call, not the code's.

The rest is manners: four requests a second at most, gzip accepted, and a ten-minute pause after any 403 or 429.

## What got built

A new `filings` app with four tables: companies, filings, key facts and a pause record. A nightly refresh rides inside the existing price cron, and I get a "Refresh filings now" button. One setting, `SEC_FILINGS=off`, turns every SEC request off. The tests run with it off, so they never touch the network.

A stock's page now has two new sections.

**Filings:** the last eight 10-K, 10-Q and 8-K filings. Each is a link to the document on sec.gov, with "Source: SEC EDGAR, fetched DATE" under the list.

**Key numbers:** revenue, net income, operating cash flow, capital expenditure, free cash flow, shares outstanding, cash and long-term debt, for the last five fiscal years and four quarters. Every figure is labelled with its form and period. Free cash flow isn't a number the company reports, so the app derives it and labels it as derived.

Funds (I tested VOO and SPY) read "No company filings: this is a fund."

A "How to read a 10-K" note links the SEC's own guide. Investor.gov's guide answers 403 to every automated fetch, so it stays out until I open it in a browser myself.

## Revenue has more than one name

XBRL tags every figure in a filing with a concept name, and companies don't all pick the same one for the same idea. One company's revenue is `Revenues`. Another's is `RevenueFromContractWithCustomerExcludingAssessedTax`.

So each line reads from a short ordered list of tags and shows which one it used. If none of them is there, the cell says "not reported under a standard tag" instead of staying blank. A blank cell looks like zero, or like a bug. Neither is true.

## Did it work

I tested it by hand tonight against a scratch database. All four SEC feeds answered 200 for AAPL. The app stored 8 filings and 305 figures, and a filing link it built answered 200 too.

## The line chapter 15 was missing

The same bundle finishes something I left out of [Comparing Two Methods With the Same Million Dollars](/blog/comparing-two-methods-same-million-dollars). That page's yardstick was an index fund bought once and never touched, so it never got the money the plans got.

Now Compare has a "Same money into" line for the yardstick: the same deposits, each buying the index fund at that day's stored close, beside the real plans with the same money in, value, return and worst drop columns. Its "How to read this" sentence says it is what doing nothing but buying the index fund with the same money would have given.

One gap is open. When a deposit falls on a day with no stored close, the row reads "no price stored for DATE." The account's own value uses the previous close in that case. Whether this line should too is still my question to answer.

## Where it stands

This is decisions 177 to 185 in the decisions log; CentenarianOS events moved to chapter 17 and the owner usage dashboard to 18. The bundle runs 1,151 tests, up from 1,068 on `main`: 68 new for chapter 16, 13 for the yardstick line and 2 from existing parametrized tests. It's tagged `v16` and waits on Invest.WitUS task 40 to merge.

## What this cost

**To build:** 11.77 credits, one helper run on Claude Opus 5.5 over 131 responses. A credit is 1 US dollar of API list price, not what my subscription bills, priced with the same usage method as my other posts. Not counted: the coordinating session, which I don't price per task, writing this post, and my time. There's no cost to create: this is a new feature, not a fix.

## What I'd carry

- **Link public records. Don't copy them.** Keep the link and the date you fetched it.
- **Name your client honestly without handing out a person's address.** An app name and a URL say who is calling.
- **"The same number" can have a dozen names.** Show which one you used, and say so when none of them is there.

## References

U.S. Securities and Exchange Commission. (2024, June 26). *Accessing EDGAR data*. Retrieved November 10, 2026, from https://www.sec.gov/os/accessing-edgar-data

U.S. Securities and Exchange Commission. (2025, April 8). *EDGAR application programming interfaces (APIs)*. Retrieved November 10, 2026, from https://www.sec.gov/search-filings/edgar-application-programming-interfaces
