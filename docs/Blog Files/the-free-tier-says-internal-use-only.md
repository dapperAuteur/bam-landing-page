<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Free Tier Says Internal Use Only
Slug:    the-free-tier-says-internal-use-only
Excerpt: Chapter 08 of the Invest.WitUS tutorial pulls one closing price per symbol per day
         from Tiingo's free plan. The plan's license decided the design before any code:
         prices render for the signed-in owner and never on a public page. The cron asks
         for seven days every night because Vercel's Hobby cron has no retries and may run
         twice, the route fails closed without its secret, and a close older than five days
         is marked stale. Plus the deploy-day lesson about Sensitive variables.
Tags:    Python, Django, Vercel, Learning in Public, Invest.WitUS
-->

# The Free Tier Says Internal Use Only

Chapter 08 of the Invest.WitUS tutorial is the first chapter where the app talks to a vendor. [Chapter 07 was sign-in](/blog/the-discovery-document-lists-rs256), so the app can now value the signed-in owner's holdings with a closing price. Who gets to see those prices was settled by the vendor's pricing page before I wrote a line.

## The license is the first design rule

The prices come from Tiingo's end-of-day endpoint on its free plan, which the pricing page calls Starter: $0 a month, 50 requests an hour, 1,000 a day, 500 unique symbols a month, and a license that reads "Internal Use Only" (Tiingo, n.d.-b). The page defines the term: "Internal use means you may only use the data for your own personal use and you may not display or share the data with another person or organization" (Tiingo, n.d.-b).

So a price is shown to the signed-in owner of the account and to nobody else. The account pages sit behind `login_required`, and the ownership check is in the query: another owner's account id is a 404, the same answer as an id that does not exist. The proof is a test that renders every public page signed out and asserts there is no `<table` and no link to `/accounts/` on any of them.

The request budget sets the second rule. The table is the product: the page reads it, the pull writes it, and the vendor is asked once a night.

## Seven days, every night

The pull runs as a Vercel cron. On the Hobby plan a cron runs once a day with a precision of "Per-hour (±59 min)" (Vercel, 2026d), so `0 6 * * *` fires anywhere in that hour, and "The timezone is always UTC" (Vercel, 2026b). And "Vercel will not retry an invocation if a cron job fails" (Vercel, 2026c). Delivery is best effort, a run can be missed, "Cron delivery can also occasionally invoke the same scheduled run more than once", and jobs "should be resilient to both missed runs and duplicate runs" (Vercel, 2026c).

That is why the pull asks for the last seven days every night instead of yesterday. The upsert fetches what is stored for those days in one query, inserts the new days, saves a day whose close changed, and does not touch the rest. A missed night is filled by the next. A duplicate run writes nothing. An exchange correction, which Tiingo says can arrive until 8 PM Eastern (Tiingo, n.d.-a), replaces its row. The first test compares the whole table, timestamps included, before and after a second run.

06:00 UTC is 01:00 Eastern in winter and 02:00 in summer, after Tiingo's "Mutual Fund NAVs are available after 12 AM EST" (Tiingo, n.d.-a) in both halves of the year, and hours before the US open.

## One symbol's refusal is not the run's

A run makes at most 50 requests, the plan's hourly limit, and lists symbol fifty-one as skipped for the next run. A ticker the vendor does not know is recorded for that symbol and the next one is tried; on the page that line reads "no price yet" and stays out of the total. Only a rate limit stops the run, because the next request would fail the same way.

## The route fails closed

Vercel sends the project's `CRON_SECRET` "as an `Authorization` header when Vercel invokes your cron job", with the `Bearer` prefix (Vercel, 2026c). The route answers in order: 503 when the secret is not configured, with an error in the log; 403 when the header does not match; then the pull. Vercel's sample answers 401 to a bad header; this route says 403, since no caller can authenticate interactively. The 503 comes first on purpose: a deploy that forgot the variable fails on its first run with the reason in the log, instead of quietly not running. The whole `Bearer <secret>` string is compared in constant time, so a `Token` prefix, a lower-case `bearer` or a trailing space all get 403.

## Stale after five days

Every displayed price carries its date and its source, because the row does. A close more than five calendar days old is marked stale on the page; five covers a weekend, a holiday and one missed night. A line with no close stays out of the total. Showing zero would be a lie with a currency sign on it.

## The deploy-day lesson

The chapter's owner step still runs the production migration the way [chapter 06](/blog/two-failed-builds-and-a-database-nobody-was-using) did, from the laptop with `vercel env run` supplying the variables. On this project that no longer works, and the runbook says why. Every variable on the project is marked Sensitive, which Vercel now files under Secret, and "Secret values are write-only after saving" (Vercel, 2026a). Neither `vercel env pull` nor `vercel env run` can hand a local command a value the CLI cannot read.

The recipe became one line. Copy the direct connection string from the Neon console, put it in a throwaway `.env.migrate` that git ignores, run `migrate` with `--env-file .env.migrate` and `--database direct`, a throwaway `DJANGO_SECRET_KEY` for that one shell because `migrate` writes nothing signed, and delete the file. The runbook has it now, and chapters 09 and 10 point at it.

Chapter 09 adds the watch list to the same pull through a function this chapter left returning nothing.

## References

Tiingo. (n.d.-a). *End-of-day (EOD) stock price API documentation*. Retrieved October 28, 2026, from https://www.tiingo.com/documentation/end-of-day

Tiingo. (n.d.-b). *Tiingo API pricing*. Retrieved October 28, 2026, from https://www.tiingo.com/about/pricing

Vercel. (2026a, August 28). *Config and Secret environment variables*. Vercel documentation. https://vercel.com/docs/environment-variables/sensitive-environment-variables

Vercel. (2026b, September 16). *Cron jobs*. Vercel documentation. https://vercel.com/docs/cron-jobs

Vercel. (2026c, August 11). *Managing cron jobs*. Vercel documentation. https://vercel.com/docs/cron-jobs/manage-cron-jobs

Vercel. (2026d, July 15). *Usage & pricing for cron jobs*. Vercel documentation. https://vercel.com/docs/cron-jobs/usage-and-pricing
