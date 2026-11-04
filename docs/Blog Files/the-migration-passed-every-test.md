<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Migration Passed Every Test and Failed in Production
Slug:    the-migration-passed-every-test
Excerpt: My investing app's newest migration added one column and filled it in for the months
         I had already reviewed. Every test passed. In production the fill-in step read from a
         database that wasn't there, Postgres rolled the whole migration back, and the new code
         had already deployed expecting the column. The fix was one method call. The lesson was
         about where each step runs.
Tags:    Python, Django, Postgres, Learning in Public, Invest.WitUS
-->

# The Migration Passed Every Test and Failed in Production

Invest.WitUS (invest.witus.online) is the investing app I am building to learn Python. In [The Rule Was Right for One Fund and Wrong for Three](/blog/the-rule-was-right-for-one-fund), I wrote about version 2 of its index rules, and about pinning each month I already closed to the version that judged it.

That pin needed a database change. This post is what happened when it reached production.

## What the migration did

Django migrations are numbered files that change the database. This one, `methods.0006_monthlyreview_rules_version`, did two things:

1. **Added a column.** Each month review got a `rules_version` column that may be empty. Empty means "the newest rules."
2. **Filled it in for the past.** A data step wrote `1` on every month I had already reviewed, because every one of those was judged under version 1.

Both halves were careful in the ways I had learned to be careful. The column was additive, so old code that didn't know about it would keep working. The data step only touched rows that were still empty, so running it twice changed nothing. There was a test for the data step, and it passed. All 1,002 tests passed.

## What production said

When the branch merged, two things started from the same push to `main`: Vercel deployed the new code, and a GitHub Actions workflow ran the migrations against the production database. The deploy went green. The migration failed in 16 seconds with this:

```
django.db.utils.OperationalError: no such table: methods_monthlyreview
```

`OperationalError` from SQLite. My production database is Postgres.

## Why it looked for SQLite

My app has two names for its database connections. `default` is the pooled connection the website uses. `direct` is the unpooled connection, the one migrations should use. The workflow runs:

```
uv run python manage.py migrate --database direct --noinput
```

and the only secret it has is the direct connection string. With no pooled address set, my settings fall back to a local SQLite file for `default`, which is what I want on my laptop. In a fresh workflow checkout, that file is empty.

The data step read the month reviews like this:

```python
monthly_review.objects.filter(reviewed, rules_version__isnull=True).update(rules_version=1)
```

`objects` with nothing else means the `default` database. So the column was added on Postgres, through `direct`, and then the data step went looking for month reviews in an empty SQLite file. Django's documentation says this plainly: "RunPython does not magically alter the connection of the models for you; any model methods you call will go to the default database unless you give them the current database alias" (Django Software Foundation, n.d.).

Postgres can undo schema changes inside a transaction, so when the data step failed, the whole migration was rolled back. The column was gone again.

## The part that hurt

The new code didn't wait for the migration. It had already deployed, and it expected `rules_version` on every month review. So any page that read a month review could ask Postgres for a column that wasn't there and error.

I didn't see those errors myself. I know the window from the timestamps: the deploy finished at 8:52 pm Eastern, and the migration that worked applied at 10:21 pm. About an hour and a half.

"Additive" protected the wrong side. An additive change keeps old code working against a new database. It does nothing for new code running against an old one, and a failed migration leaves exactly that: new code, old database.

## Why the tests passed

Two reasons, and both are mine to own. Claude wrote the migration and its test, and I merged them.

First, pytest runs everything on one database. In the test run, `default` and the database being migrated are the same database, so reading from the wrong one still finds the table.

Second, the test called the data step directly with no schema editor at all: `step(apps, None)`. The schema editor is the object that knows which database is being migrated. A test that passes `None` for it can't notice the code ignoring it.

The tests were right about what they tested. They tested a shape production never runs.

## The fix

One method call. The data step now asks the schema editor which database it is migrating and uses that one:

```python
alias = schema_editor.connection.alias
monthly_review.objects.using(alias).filter(...)
```

That is the pattern Django's own example uses (Django Software Foundation, n.d.).

Before calling it fixed, the session that found it rebuilt the workflow's setup on a laptop: a second SQLite file as `direct`, an empty `default`, and `migrate --database direct`. With the fix, 0006 applied.

## The test that stops the next one

Fixing this one migration doesn't stop the next data step from making the same mistake. So there is a new test that doesn't run any migration at all. It reads the source of every migration file, finds each function passed to `RunPython`, and fails if the function never mentions `connection.alias`.

It is a blunt check. It reads text, not behavior, and a function could mention the alias and still misuse it. But the mistake it catches is the one I actually made, it costs nothing to run, and it fails before a merge instead of in production.

## Where it stands

I merged the fix. The workflow ran again on that push, and its log says what I wanted to read:

```
Applying methods.0006_monthlyreview_rules_version... OK
```

That line means both halves ran this time, the column and the data step, in one transaction that didn't roll back. I haven't queried the table to count the pinned months yet.

## What this cost

The helper that wrote the migration is the same one whose cost is in the previous post, so it isn't counted again here. The fix was made by the session coordinating the work, and its cost isn't separated out from that session's other work, so I'm not putting a number on it. Not counted either: writing this post, and my own time.

## What I would carry

- **Deploys and migrations run in different places.** Know which machine runs each step and what it has set.
- **Test the shape production runs in.** Production migrates through `direct` with an empty `default`; one test now does the same.
- **Additive protects old code, not new code.** If a migration can fail after the deploy, new code has to survive the old schema, or the deploy has to wait for the migration.
- **A data step names its database.** `schema_editor.connection.alias`, every time.
- **A test that passes `None` for a dependency can't catch misuse of it.**

## References

Django Software Foundation. (n.d.). *Migration operations*. Django documentation (Version 5.2). Retrieved November 3, 2026, from https://docs.djangoproject.com/en/5.2/ref/migration-operations/
