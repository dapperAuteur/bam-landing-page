<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Deciding What Not to Split
Slug:    deciding-what-not-to-split
Excerpt: My personal OS grew to 365 API routes and 198 migrations across nine
         domains. The hard part of breaking it up was not choosing what to
         remove. It was proving which parts were load-bearing, and finding
         four modules I had marked for removal feeding the pages I had just
         called the entire point of the app.
Tags:    Architecture, Monolith, Refactoring, Postgres, Next.js, Technical Debt
Series:  Decomposing a Monolith (1 of 4)
-->

# Deciding What Not to Split

I build a personal operating system called CentenarianOS. It tracks my health, my habits, my focus sessions, my nutrition, my money, my travel, and for a while it also hosted a full learning management system.

Here is what it looked like the day I decided to take it apart:

```text
365  API route handlers
198  database migrations
 14  product modules
  9  user-facing domains
  1  Postgres database, shared with a second app
```

That is a lot of surface for one person to hold. The obvious move is to split it up. I run a small ecosystem of tools that all follow one rule: every app has one job. By that standard, this app looked like nine apps wearing a trench coat.

So I started planning the breakup. And the first useful thing I learned was that I had the rule backwards.

## "One app, one job" is not "one module, one app"

The rule says each app does one job. It does not say each job is one module. Those sound identical until you try to apply the first one and accidentally execute the second.

If I had atomized this app by module count, I would have ended up with nine small apps, each of which was worse than an existing tool that already did that job better. A worse notes app. A worse budgeting app. A worse workout logger. Nine mediocre point solutions, and a maintenance burden nine times worse than the one I started with.

Because the thing that makes this app worth using is not any single module. It is that the modules share a database.

## The part that only works because it is not split

Three pages justify this app's existence:

```text
/dashboard/correlations
/dashboard/retrospective
/dashboard/weekly-review
```

They exist to answer questions no single-vertical tracker can answer. Not "how did I sleep" but "does my resting heart rate spike the week after high-spend, low-sleep travel?" Not "what did I spend" but "do I complete fewer tasks in weeks where I ate more restaurant meals?"

You cannot ask that across four SaaS products with four APIs and four export formats. You can ask it trivially when it is one `SELECT` over one database. Here is the actual shape of the view those pages are built on:

```sql
CREATE VIEW daily_aggregates AS
SELECT
  -- task completion, from the roadmap hierarchy
  (SELECT count(*) FROM tasks t
     JOIN milestones m ON m.id = t.milestone_id
     JOIN goals g      ON g.id = m.goal_id
     JOIN roadmaps r   ON r.id = g.roadmap_id
   WHERE ...) AS tasks_total,

  -- nutrition score, from meal logs joined to protocols
  (SELECT avg(p.ncv_score) FROM meal_logs ml
     JOIN protocols p ON p.id = ml.protocol_id
   WHERE ...) AS ncv_score_mode,

  -- attention, from focus sessions
  (SELECT sum(fs.duration) / 60.0 FROM focus_sessions fs
   WHERE ...) AS focus_minutes
...
```

Planning, nutrition, and attention in one row, keyed by day. That co-location is the product. Splitting it would not be decomposition. It would be deleting the feature and keeping the parts.

So I wrote down a one-sentence job description and made everything else answer to it:

> CentenarianOS's one job is the longevity correlation engine over your personal data.

That job requires multiple domains living together. Which means the question is not "how do I get to one module?" It is "which modules were never part of this job?"

## The test: does a sibling already own this?

I stopped counting tables and started asking three questions about each module:

1. Does another tool I already run own this data or workflow?
2. Would building this here stop someone needing that other tool?
3. Is this general-purpose, or specific to somebody else's job?

Run that over fourteen modules and the answers sort themselves fast.

**Media tracking**, meaning books, movies, shows, and podcasts. I already run a separate cross-media tracker. This module is pure redundancy. It goes.

**The learning management system.** Publishing and selling courses is a two-sided marketplace with teacher payouts. That is a different business, not a longevity feature. It goes.

**Contractor invoicing residue.** Belongs to the contracting app that already spun out. It goes.

**Travel, vehicles, fuel, maintenance.** Belongs in the mobility product. It goes, with a caveat I will get to.

**Personal finance.** Stays. This is the one people argue with me about, so let me be precise: business invoicing is not personal finance. Money is a life domain that correlates hard with sleep, stress, and travel. Pulling it out would gut the correlation engine to satisfy a tidiness instinct.

**Planning, health, workouts, nutrition, focus, correlations.** All stay. They are the engine.

Nine domains in, six carve-outs out, and the core stayed integrated on purpose.

## Then I checked whether the leaving modules were actually leaves

This is the step I almost skipped, and it was the most valuable hour of the whole exercise.

It is easy to write a disposition table. It is harder to verify that the modules you marked "leaving" are not load-bearing for the thing you marked "keep." So I read the actual data sources of all three synthesis pages instead of trusting the plan.

The statistical view came back clean. The two AI narrative endpoints did not:

```js
// app/api/ai/life-retrospective/route.ts
db.from('tasks')                   // staying
db.from('financial_transactions')  // staying
db.from('focus_sessions')          // staying
db.from('user_health_metrics')     // staying
db.from('workout_logs')            // staying
db.from('meal_logs')               // staying
db.from('invoices')                // LEAVING (contractor)
db.from('trips')                   // LEAVING (travel)
db.from('fuel_logs')               // LEAVING (travel)
db.from('equipment')               // ...not in my plan at all
```

```js
// app/api/ai/weekly-review/route.ts
db.from('lesson_progress')         // LEAVING (the LMS)
db.from('trips')                   // LEAVING (travel)
db.from('fuel_logs')               // LEAVING (travel)
```

Four of the modules I had cheerfully marked "remove" were feeding the exact pages I had just declared to be the entire point of the app.

My plan had accounted for exactly one of them. It said travel should push summaries back after it moved. It said nothing about the invoices, nothing about lesson progress, and it did not mention `equipment` anywhere at all, even though that module exists in both apps and one of the pages reads it.

Then I found the sharpest version of the same problem. I had written "keep personal finance" and "remove contractor data" on the same page, as if they were independent decisions. They are not:

```sql
CREATE VIEW expected_payments AS
  SELECT ... FROM contractor_jobs j WHERE ...
  UNION ALL
  SELECT ... FROM invoices i WHERE i.direction = 'receivable';
```

That view is consumed by my personal finance forecast and my planner page. The personal feature I insisted on keeping is currently built on the business tables I insisted on removing.

None of that is a reason not to decompose. It is a reason to know the bill before you agree to pay it.

## What I actually shipped first

Not a carve-out. Documentation.

My README opened by describing the app as "14 modules in one Next.js monolith" and counting migrations. That framing is why the app kept accreting modules. If the identity is "a big app with many modules," then adding a module is on-brand.

So the first commit replaced the module count with the job:

> One job: the longevity correlation engine over your personal data. Health, habits, focus, nutrition and personal finance are co-located in one datastore so the synthesis surfaces can surface cross-domain patterns no single-vertical tracker can see. That co-location is the product, not an accident of scope.

Cheap, boring, and it does more work than any code I could have written that day. Every future session, mine or an AI assistant's, now reads the constraint before it reads the module list.

## What I would tell past me

**Write the one-sentence job before you write the disposition table.** Without it you are just sorting modules by vibes.

**"Does a sibling already own this" beats any size metric.** Table count and route count tell you the app is big. They do not tell you which parts belong somewhere else. Redundancy does.

**Verify the leaves are leaves by reading the queries, not the plan.** A plan is a claim about your codebase. `grep` is evidence. I found three couplings and one entirely missing module in under an hour, and every one of them would have surfaced later as a broken page.

**The modules that are safe to remove are the ones nothing reads.** Media was genuinely absent from every synthesis surface I checked. That is what made it the right first move, and it is the only reason I trusted the playbook enough to run it on anything bigger.

In [Part 2](/blog/the-export-that-imported-nothing), I run that playbook on the media module and discover that the export feature I was relying on to move the data had never worked, in either direction, and had been returning a `200 OK` the entire time.
