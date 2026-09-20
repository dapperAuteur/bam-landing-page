<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Nine Things I Got Wrong Splitting a Database
Slug:    nine-things-i-got-wrong
Excerpt: A long session pulling two apps off a shared Postgres. The code that
         shipped was mostly fine. What is worth writing down is the nine times
         I was confidently wrong, how each one surfaced, and the two habits
         that caught seven of them before they cost anything.
Tags:    Postgres, Migrations, Engineering Judgment, Debugging, Technical Debt, Code Review
-->

# Nine Things I Got Wrong Splitting a Database

Two of my apps share a Postgres database. Separating them is a long job, and I spent a full working session on it: measuring the coupling, replacing two cross-app triggers, generating a schema for the new database, and rehearsing the data move.

The code that came out of it is fine. Verified, dry-run, reversible.

What is worth writing down is the nine times I was confidently wrong.

I am keeping this honest rather than tidy, because the interesting thing is not that I made mistakes. It is that they fall into two piles: the ones a habit caught immediately, and the ones that survived until someone else noticed. The difference between those piles is the whole lesson.

## The estimate I carried for months

My own plan described the database split as: *migrate the contractor-owned tables to a new database, repoint the environment variables, cut over.*

I wrote that line. I had been quoting it to myself for months as the size of the job.

Before scheduling it, I counted:

```text
profiles                 read by 88 files in one app, 83 in the other
financial_transactions   owned by app A, WRITTEN by 8+ routes in app B
invoices                 owned by app A, full CRUD and UI in BOTH
```

That is not "move some tables." That is two applications writing into each other's core tables. The contractor app cannot start without `profiles` and cannot record a job cost without the other app's ledger.

**The estimate was wrong by a large factor, and I had been carrying it for months because I wrote it once and then trusted it.**

## The document that was accurate and still misled me

That plan was not lazy. It was written from a shared-database document in the repo that carefully lists shared columns, shared views, and cross-app triggers.

That document does not mention the `financial_transactions` cross-writes. It does not mention that invoices are co-owned. It is correct in every line it contains and silent on the two couplings that dominate the work.

**"It is documented" and "the documentation is complete" are different claims.** Only one of them was true, and I could not tell which from the inside.

## The replacement that replaced nothing

Two database triggers wrote planner tasks in app A whenever an invoice or job changed in app B. They cannot survive the split, so they had to become application code.

I had already built an event feed between the apps, and I wrote in a plan, confidently, that the triggers could be dropped because the projection replaced them.

It did not. The projection feeds a forecast widget. The triggers create actual rows in a planner hierarchy. Different surfaces entirely. Dropping the triggers on that reasoning would have silently deleted a feature: invoice due dates would just stop appearing, with no error anywhere.

I caught this one myself, by reading the trigger body instead of my own summary of it. That is the only reason it is on the "caught" pile.

## The warning that arrived after the instruction

I wrote the migration that drops those triggers. It is dangerous to apply early, so I wrote the preconditions into the file, into a task doc, and into my summary.

In my summary, the sentence "Added migration 198" came before the section headed "Order matters on this one."

The migration got applied early. Of course it did. I put the instruction ahead of the warning and expected the reader to hold the first one in suspense.

**The ordering of your own summary is part of the interface.** A warning that arrives after the action it warns about is decoration.

(The damage was small, and only because the replacement code had already been merged. That was luck, not design.)

## The sample that was demo data, and the correction to my correction

Trying to work out whether one column could separate business from personal transactions, I looked at thirty rows and declared them **100% seeded demo data**, on the basis that the vendor names appeared in the seed files.

Pushed back on, I checked properly: whether the seed actually *inserts* those rows. Some did. Several did not. Crew payments, union dues, a camera case, client invoices: real entries that merely resembled fixtures, because the fixtures had been modelled on real life.

I had matched names, not rows. The correction was right and mine was not.

Worse: my query for that spot check did not exclude the demo account. I had written the rule about demo contamination myself, in the same document, minutes earlier.

## The truncation in my own table

Having established the rule, move rows on these two business accounts, I ran the validation.

```text
RULE CHECK — account_id IN (1 account(s) matched)
  !! 1 name(s) matched NO account: "AZFCU BUSINESS VISA CREDIT CA"
  moves: 136
```

The real account is `...CREDIT CARD`. My own summary table had truncated the name to fit a column, and I then used my truncated table as input.

It reported **136** rows instead of **161**, and it would have looked entirely plausible.

The only reason this surfaced is that I had made the tool complain loudly about a name matching nothing. I nearly did not: an unmatched filter that silently matches less is the most natural thing in the world to write.

## The bug I ported faithfully

The forecast view computes hours as `COALESCE(st_hours, 0)`. I ported that into new code, carefully, line for line.

Then a real row turned up: 10 hours logged as a bare total, with the straight/overtime/double split left empty, because the interface allows exactly that.

```text
invoice generation   st_hours ?? total_hours ?? 0   ->  bills 10 hours
the forecast view    COALESCE(st_hours, 0)          ->  forecasts $0
```

Same row. Two answers. I had reproduced the blind spot perfectly, because I was checking my port against the original rather than against reality.

**A faithful port of a buggy thing is a buggy thing.**

## The closure that was not the closure

Here is the one I am least comfortable with.

I built the list of tables to migrate twice. First from the migration files, which gave the tables the contractor app *creates*. Then, more carefully, from the foreign-key graph: every table the moving set points at. That second pass felt rigorous. It is what surfaced the identity work.

Then someone noticed that two of my own scripts disagreed: one listed a table as needing to be copied, the other did not export it. Chasing that:

```text
the app queries    146 distinct tables
my schema builds    34
missing            112
```

Every one of the 112 is read by a real route. Deploy against the new database as built and the app does not start.

**Foreign-key closure finds referential dependencies. It does not find usage dependencies.** The table that exposed it is read by eleven files and has no foreign key pointing at it, so it was invisible to both of my methods.

I was not sloppy here. I was rigorous about the wrong graph, which is a more dangerous failure than being careless, because it comes with the feeling of having been thorough.

## The instinct that would have deleted the wrong thing

Two smaller ones, together, because they are the same shape.

Told to copy the tables the migration depends on, I nearly copied one holding bank connection tokens. It is a dependency, technically. Duplicating credentials into a second database is not a decision anybody had asked me to make. I dropped the constraint instead and said so.

And planning to remove a pile of inherited admin dashboards, I described it as "free, no operational cost." Then I looked: several candidates have live public pages. Removing them deletes a working feature. It costs no *functionality that anyone still wants*, but it costs real engineering judgment per route, and I had waved that away.

## What actually caught things

Seven of the nine were caught by two habits, and I want to be specific about which.

**Generate, do not transcribe.** The schema for the new database is 34 tables, 810 lines. The tool that normally emits it refused to run: wrong version, and the OS is too old to install a matching one. The tempting move was to hand-write the DDL from two hundred migration files.

Instead I asked the database to describe itself. Postgres will emit its own constraint and index definitions if you ask. That produced DDL nobody typed, and it surfaced the identity problem as a number: 27 foreign keys pointing at a schema that does not exist on the other side.

**Dry-run, do not review.** I applied that generated schema to a throwaway database, then loaded the data into it. Four problems appeared that no amount of reading would have found:

1. A column needing an extension that was not enabled
2. A foreign key to a table nobody intended to move
3. Statement ordering that fails as soon as a key precedes its target
4. Constraint ordering that fails within that

Then I ran the load twice, to prove re-running was safe.

None of that is clever. It is just the difference between believing a file is correct and watching it be correct.

## The pattern underneath

Look back at the nine and they sort cleanly.

The ones I caught fast are the ones where **something executed**: a script, a dry-run, a query. Execution answers back.

The ones that survived, the estimate and the incomplete document and the wrong dependency graph and the truncated name, are all cases where I **read something and believed it**, including things I had written myself. My own plan, my own summary table, my own definition of thoroughness.

The plan said the migration was small. The document said the coupling was known. The foreign-key graph said the dependencies were closed. All three were internally consistent, and all three were wrong in the same direction: they described a tidier system than the one that exists.

That is not an argument against writing plans. It is an argument for treating your own artifacts as claims about the codebase rather than descriptions of it, and for keeping a cheap way to check.

The counting takes an hour. The wrong estimate cost months of thinking the job was smaller than it is.
