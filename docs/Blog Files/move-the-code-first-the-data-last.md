<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Move the Code First, the Data Last: Taking an App Off a Shared Database
Slug:    move-the-code-first-the-data-last
Excerpt: Work.WitUS still shares one Supabase database with CentenarianOS. Moving it to its own
         Neon database is three migrations, not one. The plan ports the code while it still runs
         on the old database, so the cutover shrinks to a copy, a sign-in switch and one setting.
         Phase 2 is built: a schema generated from the live catalog, compared table by table.
Tags:    Databases, Postgres, Neon, Supabase, Drizzle, Architecture, Work.WitUS
-->

# Move the Code First, the Data Last: Taking an App Off a Shared Database

Work.WitUS is my app for freelance workers and crew coordinators: jobs, time, invoices, schedules. It grew out of CentenarianOS, and when it became its own app it kept the same database. On October 30 I checked what the two live sites actually load, and they still read and write one Supabase project.

That afternoon I decided Work.WitUS moves to its own Neon database. This post is about how, and why the order matters more than the tools.

## It is three migrations, not one

"Move the database" sounds like copying tables. For this app it is three separate jobs:

1. **Data access.** The code talks to Supabase through supabase-js. A count on October 30 found about 1,180 table calls across 281 files.
2. **Sign-in.** Users sign in with Supabase Auth: email codes, passwords, two-factor, and the "Sign in with WitUS" callback. On Neon that becomes Better Auth, which my other Neon apps already use.
3. **Data.** Roughly 90 tables to copy, some filtered by user or by app, because the shared database holds CentenarianOS rows too.

Doing all three on one weekend is how a migration turns into an outage. So the plan separates them.

## The idea: port the code while it still runs on Supabase

Supabase is Postgres underneath. Drizzle, the query library I am moving to, speaks plain Postgres. That means I can switch the code from supabase-js to Drizzle **while it still points at the shared Supabase database**, one module at a time, each shipped and reversible on its own.

When every module is ported, the cutover is small: copy the data, switch sign-in, change one setting so the app points at Neon. The risky, all-at-once part shrinks to an evening with the app in read-only mode, instead of a month.

The plan has nine phases, 0 to 8, and an estimate of 22 to 26 working sessions plus a one to two hour cutover window. Each phase ends with production working, and each says how to undo just that phase.

## Phase 2: a schema that matches the one in production

Before any code moves, the new database needs the same shape as the old one. I did not write that schema by hand, and I did not trust a tool's guess at it.

**Generate it from the live catalog.** A script reads Supabase's system catalog through `psql`, in a session forced read-only and checked, and writes three migration files: the tables, then the constraints and indexes, then the functions, triggers and views. Some changes are deliberate:

- Supabase keeps users in its own `auth.users` table. Neon has no such thing, so the baseline creates a `users` table, and 67 foreign keys that pointed at `auth.users` now point at it.
- Every foreign key is created `DEFERRABLE`. That is for the data copy later: inside one transaction with `SET CONSTRAINTS ALL DEFERRED`, deferred constraints "are not checked until transaction commit" (PostgreSQL Global Development Group, n.d.), so tables can be loaded in any order and the keys are checked once, at the end.
- Three database functions used Supabase's `auth.uid()` to know who is calling. On Neon they take the user's id as a parameter instead.

**Compare, table by table.** A second script reads both databases, read-only on both sides, and compares columns, defaults, constraints, indexes, triggers, views and functions for every table in the move list. It normalizes away the deliberate changes above, so any line it prints is a real difference. On the Neon dev branch it found 87 tables, 1,023 columns, 355 constraints, 175 indexes, 10 triggers, 2 views and 11 functions, and no differences beyond the deliberate ones.

**Then generate the Drizzle schema from Neon, not Supabase.** The plan said to point Drizzle's introspection at Supabase. I changed that. Supabase's pooler ignored the option I use to force a session read-only, so I could not guarantee the tool's own connection would stay read-only against production. Pointing it at the Neon dev branch, which the comparison had just proven identical, gave the same schema with no risk to the live database. The tool still got seven things wrong, among them full-text search columns, empty-string and array defaults, and a truncated index expression. Each was fixed by hand and is listed at the top of the schema file.

## Guards that make the wrong database impossible

The new migration script refuses two kinds of target before it writes anything:

- **Any Supabase host.** The shared database changes only through its own process, under rules both apps follow. A migration meant for Neon can never land there by accident.
- **A database that already has tables but no migration ledger.** That is a database someone loaded another way, and the baseline would collide with it.

A GitHub workflow will run migrations on merge once its database secret is set, and the repository's runbook has the manual fallback. So far they have been applied to the Neon dev branch only. A second run applied nothing, which is the point.

The new database client also reads its address from a setting that, until the cutover, points at the **Supabase** database. That is what lets ported modules ship to production while the data stays put. Connecting to Supabase that way requires its root certificate. The client refuses to connect without it rather than switching certificate checks off.

Nothing in production imports the new client yet. Production is unchanged.

## What still worries me, written down

- **Row-level security does not come along.** Supabase's browser client leans on database policies to keep each user's rows private. A Drizzle query on the server does not go through those policies, on either database. Every ported query has to filter by owner itself, and the tests for each module have to prove it.
- **One cross-app link uses the shared user id.** Work.WitUS sends income and schedule events to CentenarianOS, which matches them to a person by the id both apps share today. After the move, those ids will not match. A phase before the cutover adds the email and the WitUS sign-in id to every event, and teaches CentenarianOS to match on those.
- **Rollback has a window.** The cutover plan keeps the Supabase rows untouched for 30 days and uses Vercel's instant rollback, so going back is a settings change plus re-applying any rows written in between.

## What I would pass on

- **Count the migrations inside the migration.** Code, sign-in and data are three jobs with three different risks.
- **Change the code before the data.** If the new query layer works on the old database, the cutover stops being a leap.
- **Generate the schema from the live system, then prove it with a diff.** Not from memory, and not from a tool you have not checked.
- **Make the wrong target impossible, not just unlikely.** A script that refuses a host is worth more than a warning in a README.

Phase 3, porting the modules one at a time, starts next.

## References

PostgreSQL Global Development Group. (n.d.). *SET CONSTRAINTS*. PostgreSQL 18 documentation. Retrieved October 30, 2026, from https://www.postgresql.org/docs/current/sql-set-constraints.html
