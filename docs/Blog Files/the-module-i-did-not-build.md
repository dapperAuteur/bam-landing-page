<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Module I Did Not Build
Slug:    the-module-i-did-not-build
Excerpt: I asked where a lead-management CMS should live in my ecosystem. The
         answer was that three systems already owned most of it, the part
         left over was too small to justify code, and the migration I
         approved instead turned out to be five times the size my own plan
         claimed. The doc I trusted was the reason.
Tags:    Architecture, Technical Debt, Postgres, Migrations, CRM, Engineering Judgment
Series:  Decomposing a Monolith (4 of 4)
-->

# The Module I Did Not Build

[Part 1](/blog/deciding-what-not-to-split) was deciding what to split out of a monolith. [Part 2](/blog/the-export-that-imported-nothing) and [Part 3](/blog/the-branch-i-did-not-merge) were the two bugs I found while doing it. This one runs the same test in the opposite direction: not "what should leave," but "where should this new thing go?"

The new thing was a CMS for managing leads. I sell subscriptions to my own ecosystem of apps, and I sell custom app builds. Neither has a pipeline. I had two candidate homes in mind, asked which was better, and expected an answer of the form "that one, because X."

The answer was "neither, and mostly you should not build this."

## Three systems already owned it

Before comparing the candidates I went looking for what already existed. Three layers, all in my own repos, all of which I had built or decided on myself:

**Intake** is `witus-inbox`, and it is live. Signed webhook receiver, canonical store, triage UI. Its README describes its job as "one inbox for every form across every product you ship." Every form on every property already lands there.

**Classification** is `witus-triage-agent`, also live. It reads a submission, proposes one action, and waits for a human to approve it.

**CRM, email, automation, invoicing, appointments** is Keap, by an explicit decision recorded in my own task queue: it is named "the primary CRM + email + automation + invoicing + appointments layer for the full ecosystem," and the plan says the inbox "hands submissions off to Keap for all post-capture marketing automation."

So the honest question was never "which of my two apps gets the lead CMS." It was "what is actually missing, given three layers already claim this?"

## What was actually missing was small

I grepped both candidate apps for the vocabulary of selling: `lead`, `quote`, `estimate`, `proposal`, `deal`, `pipeline`. No route, no table, nothing.

So there is a real gap. It is just much narrower than "a CMS." The inbox tracks a triage state, which answers *have I dealt with this message.* Nothing anywhere answers *is this worth money, and when.* That second question is a deal pipeline, and it was genuinely unowned.

Then the gap got narrower still, because the two things I called "leads" are not one system:

| | Ecosystem subscriptions | Custom app work |
|---|---|---|
| Volume | ~200 qualified leads/week targeted | a handful a month |
| Value | ~$103 | four to five figures |
| Cycle | minutes, self-serve | weeks, conversational |
| Needs | marketing automation | a deal pipeline |

The left column is Keap's job by a decision I already made. Building broadcast and tagging infrastructure in a Next.js app to compete with a CRM I already pay for is not a project, it is a mistake with a Jira ticket.

The right column is a handful of rows a month.

## The argument against my own conclusion

I want to be fair to the other side, because it is stronger than it looks.

That Keap decision has been sitting in my queue marked `Pending — high priority` since before the first of May. There is no Keap integration code in any repo. Zero. So "Keap already owns it" is a plan, not a running system, and a plan that has not moved in four months is evidence about what actually gets built.

That is the real case for building something in-house, and it is not a bad one. Plans that sit still tend to keep sitting still.

I still did not build it, for a boring reason: the thing that has not happened is *provisioning an account*. The remedy for "I have not set up the CRM" is not "write a CRM."

## Where the small thing goes, if it gets built

Not the personal-OS app. That app is mid-decomposition, I had just spent a week writing down that its one job is a correlation engine, and a B2B sales pipeline feeds none of it. Every argument for putting it there reduced to "the admin scaffolding is best here," which is precisely the reasoning that grew it to 365 routes in the first place.

The contractor app is a better fit, and the reason is one line of SQL I already had:

```sql
CHECK (status IN ('assigned','confirmed','in_progress',
                  'completed','invoiced','paid','cancelled'))
```

That is a pipeline. It is a *delivery* pipeline, running from "we agreed" to "I got paid." A deal pipeline is the missing stage in front of it. Which means "won deal becomes a job" is a status transition rather than an integration, and a won deal joins my existing revenue forecast without a line of new forecasting code.

Selling custom app work *is* contractor business operations. The fit is semantic, not just convenient.

And then I did not build that either. At a handful of deals a month, the correct first version is a spreadsheet, run for a month, so the row count can argue for the table instead of me arguing for it. If it stays under ten rows, the module was never worth writing.

The analysis still earned its keep, because the default outcome of not doing it was the module landing in the personal-OS app by convenience.

## The decision that did cost something

One piece of this did turn into real work. Two of my apps share a Postgres database, and every one of these questions eventually hit that fact. So I approved the split.

My own decomposition plan describes that split as "migrate contractor-owned tables to a new database, repoint env vars, cutover." I had written that line myself, months ago, and had been carrying it around as a sizing estimate.

Before scheduling it, I counted:

```text
profiles                 read by 88 files in the contractor app
                         read by 83 files in the personal app
financial_transactions   owned by the personal app (migration 051)
                         written by 8+ routes in the contractor app
invoices                 owned by the personal app (migration 058)
                         full CRUD and UI in BOTH apps
```

That is not "contractor tables sitting in a shared instance." That is two applications writing into each other's core tables. The contractor app cannot boot without `profiles` and cannot record a job cost without the personal app's ledger. Anyone starting this by moving the contractor tables discovers on day two that the hard part is identity, and the second-hardest part is that "personal finance" and "business finance" are the same table.

I also asked for invoices to be created in the contractor app going forward, which sounds like a table move and is actually an ownership transfer: that table was created *by* the personal app and still has authoring routes and a UI there.

The plan was not lazy. It was written from the shared-database document in the contractor repo, which lists shared columns, shared views, and cross-app triggers in careful detail. But it does not mention the `financial_transactions` cross-writes, and it does not mention that invoices are co-owned. The doc was accurate about everything it covered and silent about the two things that mattered most.

## What I took away

**The best module is the one a sibling system already owns.** Before asking where a feature goes, ask what already claims that territory. Three of my own systems did, and I did not remember that until I looked.

**"Where does this go" is the wrong first question.** The right one is "what is actually missing, given what exists." It turned a CMS into one table, and then into a spreadsheet.

**A plan that has not moved in four months is data.** It does not automatically mean build the thing yourself. It usually means look at why, and the why here was an unprovisioned account, not a missing feature.

**Size the migration by counting, not by re-reading your own plan.** My estimate was wrong by a large factor and I had been carrying it for months, because I wrote it once and then trusted it.

**An accurate document can still mislead you, by omission.** The shared-database doc was correct in every line. It just did not have a line for the two couplings that dominate the work. "It is documented" and "the documentation is complete" are different claims, and only one of them was true.

That is the whole series, really. Four parts, and each one came down to the same move: stop reading the plan, and go count what the code is actually doing.
