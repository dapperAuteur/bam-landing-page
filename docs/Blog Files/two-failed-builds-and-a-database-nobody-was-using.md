<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Two Failed Builds and a Database Nobody Was Using
Slug:    two-failed-builds-and-a-database-nobody-was-using
Excerpt: Chapter 06 of the Invest.WitUS tutorial put the Django app on Vercel with Neon
         Postgres. The settings file refused to start twice on deploy day, both times on
         purpose. Then the site ran green for an evening on a SQLite file inside the function,
         because the Neon integration had written its variables under a prefix the settings
         did not read.
Tags:    Python, Django, Vercel, Neon, Learning in Public, Invest.WitUS
-->

# Two Failed Builds and a Database Nobody Was Using

Chapter 06 of the Invest.WitUS tutorial is the deploy: one settings file that runs the app on my laptop with SQLite and on Vercel with Neon Postgres. [I already wrote about the secret key](/blog/where-the-django-secret-key-goes), the first thing that failed, and [chapter 05 is the post before this one](/blog/the-brokers-statement-is-the-record). This is the rest of the day: what Vercel does with a Django project, why migrations never run at build, the second refusal, and the quiet failure that did not refuse at all.

## What Vercel does with manage.py

Vercel's Django page says it "automatically detects Django projects by locating `manage.py` in your repository", then "executes `manage.py` to discover your `DJANGO_SETTINGS_MODULE` and determines the entrypoint from `WSGI_APPLICATION`" (Vercel, 2026a). The builder's source adds what the page does not say: it installs the lock file's packages into a vendor folder and never installs the project itself.

That matters because this project lives under `src/`, which `uv sync` makes importable on my laptop and nothing makes importable on Vercel. And `WSGI_APPLICATION` is turned into a file path beside `manage.py`, so the old value, `invest_witus_site.wsgi.application`, would point at a folder that is not there. Two small files fix it without moving anything: `manage.py` puts `src/` at the front of `sys.path` before Django imports anything, and a root `wsgi.py` bridge does the same and re-exports the project's own application object.

With `STATIC_ROOT` set, Vercel "automatically runs `collectstatic` during the build and serves the collected files from the Vercel CDN" (Vercel, 2026a). It also means the build imports the settings module, which is where the guards live.

## Migrations run from my machine

Nothing in the deploy files runs migrations. Neon's integration sets two connection strings, `DATABASE_URL`, pooled, and `DATABASE_URL_UNPOOLED`, direct (Neon, n.d.), and the settings turn the second into a `direct` database alias that nothing routes to on its own. I run the migration from my laptop with the project's variables in the shell and nothing written to disk:

```sh
vercel env run -e production -- uv run python manage.py migrate --database direct
```

The first superuser is made the same way, with `createsuperuser --noinput`. The ecosystem's rule is that the owner runs production migrations by hand.

## Both refusals fired

The settings file refuses to start in two cases. With debug off and no `DJANGO_SECRET_KEY`, it raises `ImproperlyConfigured` with the command that makes a key. With `DJANGO_DEBUG=1` and `VERCEL=1` together, it refuses outright, because a debug page shows settings and source code to whoever triggers an error.

On October 28 both fired on real deploys. The first build died on the missing key. I added the key, and the next build died at 20:03 UTC with the second message: `DJANGO_DEBUG=1 on Vercel: debug pages would show settings and code to anyone. Unset it.` The project had a `DJANGO_DEBUG` variable, most likely copied over with the other names from `.env.example`. It belongs in the laptop's `.env` and nowhere else. I deleted it, redeployed, and the build went green.

Two red builds, each with the fix printed in the log. That is the guards doing their job.

## The failure that did not fail

The green deploy ran on the wrong database for an evening, and nothing said so.

Chapter 06 says to leave the Custom Prefix field empty when connecting Neon through Vercel's Marketplace dialog, so the names are exactly `DATABASE_URL` and `DATABASE_URL_UNPOOLED`. Vercel's docs say the variables use "the names provided by the integration" by default and describe the prefix as a way to keep two databases from the same provider apart (Vercel, 2026b). Neon's say "You only need one if your Vercel project already uses the unprefixed variable names" (Neon, n.d.). The dialog in front of me had `STORAGE` in that field, and I left it. The integration wrote `STORAGE_DATABASE_URL`, `STORAGE_DATABASE_URL_UNPOOLED`, `STORAGE_PGHOST` and the rest.

The settings read `DATABASE_URL`, found nothing, and fell back to chapter 04's SQLite file, now inside the function's own filesystem. It works. The health route asks the database `SELECT 1`, and SQLite answers that as well as Postgres does. Every deploy starts the file empty, and a waitlist signup would not have survived the next one.

We found it by reading the project's variable list through Vercel's API, names only, never values: fifty-six names, with the whole Neon set under `STORAGE_`. The chapter's troubleshooting list had even predicted it, as a failed migration; I had not run the migration yet, so the one loud symptom never got its chance.

A `first_env()` helper now tries the unprefixed name, then the prefixed one, and the unprefixed name wins when both exist. Three tests, a line in `.env.example`, nothing renamed on Vercel. Once the fix deploys and the migration runs, the site is on Postgres.

## The lesson

Read the vendor's actual variable list, not the docs' example names. The only thing that knows what a project's variables are called is the project. The chapter already had a rule for this, the authoritative-values rule: a value owned by Vercel or Neon is copied from the page that owns it, never typed from memory. The names are values too.

And a fallback that works is more dangerous than a guard that refuses. The two refusals cost me two redeploys and taught me something each time. The SQLite fallback cost nothing, said nothing, and would have lost the first signup.

## What this cost

Building chapter 06 took about 22 credits of Claude usage, and the small 06a follow-up that added Vercel Web Analytics about 5.9 more. Writing this post took about 2.0 more: one helper wrote the posts for chapters 04 to 07 for 7.9 credits, and I split that evenly across the four. About 30 credits in all, roughly $30. A credit here is 1 dollar of API list price, which is not what my subscription bills. Counted from the helpers' session transcripts. Not counted: the main session that coordinated, reviewed and fixed the work, and my own time.

## References

Neon. (n.d.). *Connecting with the Vercel-Managed Integration*. Neon documentation. Retrieved October 28, 2026, from https://neon.com/docs/guides/vercel-managed-integration

Vercel. (2026a, July 24). *Deploy a Django app on Vercel*. Vercel documentation. https://vercel.com/docs/frameworks/full-stack/django

Vercel. (2026b, September 17). *Add a native integration*. Vercel documentation. https://vercel.com/docs/integrations/install-an-integration/product-integration
