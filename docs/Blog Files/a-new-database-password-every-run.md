<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Migration Job Sets a New Database Password Every Time It Runs
Slug:    a-new-database-password-every-run
Excerpt: Tour's database migrations used to be pasted by hand. Now a GitHub workflow applies
         them on merge, and before it connects it gives the database a brand new random
         password that nothing ever stores. Why a stored password was the real risk, why the
         database needed a baseline first, and the psql error that only meant a variable was empty.
Tags:    Databases, Supabase, Postgres, GitHub Actions, Security, DevOps, WitUS
-->

# My Migration Job Sets a New Database Password Every Time It Runs

Tour Manager OS, the touring app at tour.witus.online, runs on its own Supabase Postgres database. Until October 30, every schema change there was a SQL file I pasted into the Supabase editor or ran with `psql` from my laptop, using a connection string from a local environment file.

The same week, a patch round across my apps showed what that costs. A migration that was supposed to run before a merge ran late, because the local file holding its database password was older than the password. Nothing exotic. The file was just stale.

So when I automated Tour's migrations, the design started from that failure: the job should not depend on any stored password at all.

## The job makes its own password

The workflow runs on a merge to `main` that adds a migration file, on demand from the Actions tab, and once a month in a mode that only rotates the password. Every run does the same first step:

1. Generate a random password: `openssl rand -hex 32`.
2. Mask it in the GitHub log before anything else can print it.
3. Set it as the database password through the Supabase Management API.
4. Connect with it and do the work.

Nothing stores it. The next run sets another one. There is no saved password to go stale, because no saved password exists.

That only works if nothing else depends on the password, so I checked that first. The app talks to Supabase with its API keys through supabase-js. No source file reads the `POSTGRES_` variables the Supabase and Vercel integration adds. Rotating the database password changes nothing for users. The only things it makes stale are a `.env.local` on a laptop and those unused integration variables, and the runbook says so.

Two smaller details, because they are where secrets usually leak:

- The password is sent to the API through `printf`, which is a shell builtin, so it never appears in any process's arguments.
- The masking line only runs on GitHub. On a laptop, GitHub's masking command would do nothing except print the password to the terminal.

## The token that can change the password

Setting a password through the API needs a Supabase personal access token, stored as a GitHub secret. When I wrote the runbook, I warned that such a token "can manage every project in your Supabase account," including the project two of my other apps share.

That is true of what Supabase now labels a **Legacy** token, which "carries every permission on every organization and project you belong to" (Supabase, n.d.-b). It is not the only kind anymore. Tokens created in the dashboard are scoped by default, to chosen projects and permissions (Supabase, n.d.-b). This job needs exactly two:

- **Database Config**, read-write, for "Update database password."
- **Connection Pooling**, read, for "Get pooler config," which is how the job finds the right host.

A token limited to one project and those two permissions cannot touch the other database at all. That is the token to create, and my runbook's warning needs updating to say so.

## Why it connects through the pooler

Supabase gives each project a direct database address, and by default it uses IPv6. Supabase's own page lists GitHub Actions among the platforms that "only accept IPv4 connections," and notes that the Supavisor session pooler on port 5432 "always uses an IPv4 address" (Supabase, n.d.-a). So the job never uses the direct address. It reads the session pooler host from the API, and keeps a fallback host in the workflow in case the API returns none.

A new password is not instantly known to the pooler. The job retries the connection for up to 150 seconds before it gives up with a clear message.

## The database had no migration history

This is the part that could have gone badly. Supabase's own `db push` keeps track of applied migrations in a history table. Tour's database never had one, because every file had been applied by hand. Running `db push` would have replayed every migration from `001`, and many of the old files create policies and seed rows, so a replay would fail partway or duplicate data.

So the job keeps its own ledger, a small table with one row per file: its name, a SHA-256 of its contents, whether it was applied or recorded as a baseline, when, and which workflow run did it. Each file runs in a single transaction together with its ledger row, so a file is applied and recorded together or not at all. A file whose contents change after it ran gets a warning, not a second run.

Then it needs to know where history starts. The first run takes a `baseline_through` number that records those files as already applied without running them. I did not guess that number. On October 30 I ran read-only queries against production for every file from `001` to `097`, checking that the tables, columns, functions, policies and seeded help articles each one creates actually exist. They all did. The baseline is 97, and it records 96 files, because there is no `026`.

Until that baseline exists, a migrate run stops with "The ledger is empty" rather than replaying from the start. The job fails closed.

## Read-only, the way that actually works

While checking those 97 files, I wanted every session against production forced read-only. The usual way is to pass `PGOPTIONS='-c default_transaction_read_only=on'`. Through Supabase's pooler, that setting did not arrive: `show default_transaction_read_only` came back `off`. The pooler drops startup options.

What does work is wrapping each check in a read-only transaction:

```sql
begin transaction read only;
-- each read-only check goes here
rollback;
```

If you rely on a startup option for safety, check that it arrived.

## The error that only meant "empty"

Before the workflow existed, I gave myself a manual step to run two SQL files with `psql`. The first try failed with:

```text
connection to server on socket "/tmp/.s.PGSQL.5432" failed
```

That reads like a broken database. It is not. When the connection string variable is empty, `psql` falls back to a local database on the same machine, through a Unix socket in `/tmp`. The message meant only that the variable holding the connection string was empty in that shell. The fix was to load the variable from the environment file in the same block of commands, so the step cannot run without it.

## What I would pass on

- **The safest stored password is one that does not exist.** If a job can set its own credential each run, nothing on a laptop can go stale.
- **Scope the token that can change credentials** to one project and the permissions the job uses.
- **A database with no migration history needs a baseline chosen by queries, not memory.** Then make the job refuse to run without it.
- **Check that a safety setting arrived.** A read-only option the pooler drops is not read-only.
- **"Socket in /tmp" from psql usually means an empty variable,** not a database outage.

As of this writing the workflow is merged, and its first run, with the token secret and the baseline, is the next step on my list.

## References

Supabase. (n.d.-a). *Dedicated IPv4 address for ingress*. Supabase documentation. Retrieved October 30, 2026, from https://supabase.com/docs/guides/platform/ipv4-address

Supabase. (n.d.-b). *Personal access tokens*. Supabase documentation. Retrieved October 30, 2026, from https://supabase.com/docs/guides/platform/personal-access-tokens
