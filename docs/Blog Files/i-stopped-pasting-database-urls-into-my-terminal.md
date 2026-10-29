<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Stopped Pasting Database URLs Into My Terminal
Slug:    i-stopped-pasting-database-urls-into-my-terminal
Excerpt: Every Invest.WitUS chapter that added a table ended with me copying the production
         database's connection string into a throwaway file to run migrations from my laptop,
         because Sensitive variables on Vercel cannot be pulled. Now a GitHub Actions workflow
         migrates after every merge that changes a migration. One secret, set through a pipe so
         it never appears on screen, a job that fails closed, the minute of 500s it leaves,
         and what it costs.
Tags:    Python, Django, GitHub Actions, Neon, Learning in Public, Invest.WitUS
-->

# I Stopped Pasting Database URLs Into My Terminal

[Chapter 10 of the Invest.WitUS tutorial](/blog/three-views-of-the-same-plan) ended with a chore: after the merge, run the migration in the same sitting, because until then every account page answers 500. Invest.WitUS is the Django app I am building to learn Python, and every chapter that added a table has ended the same way. Today I took that chore off my laptop.

## How I was migrating

Vercel runs the site and Neon holds the database. The deploy never migrates: [chapter 06](/blog/two-failed-builds-and-a-database-nobody-was-using) decided early that shipping code and changing the schema stay separate steps. That left the schema step to me, from the laptop, against Neon's direct connection string, the unpooled one that migrations should use.

The first plan was to let the Vercel CLI hand the variables to the command. Every variable on the project is marked Sensitive. `vercel env pull` wrote `[SENSITIVE]` where each value should have been, and `vercel env run` could not supply values the CLI is not allowed to read. [The chapter 08 post](/blog/the-free-tier-says-internal-use-only) has the details.

The recipe that worked: open the Neon console, copy the direct connection string, paste it into a throwaway one-line env file that git ignores, run `migrate` with that file, delete the file. It worked every time. It also put the production database password on my screen every time, then in my clipboard and an editor buffer until I deleted the file. A step you run after every merge is a step you will eventually run tired.

## What runs now

The invest-witus repository has a GitHub Actions workflow, on the branch `feat/migrate-on-merge`, named "Migrate production database". It runs on every push to `main` that changes a file in a `migrations` folder, and it has a Run workflow button for running it without a merge. The job runs two commands:

```sh
uv run python manage.py migrate --database direct --noinput
uv run python manage.py migrate --database direct --check
```

The first applies whatever is new. The second exits with an error if anything is still unapplied, so a green run means the schema matches the code, not only that a command finished. The run's summary lists every migration and whether it is applied.

It reads one repository secret, `NEON_DIRECT_URL`. I set it once without seeing it:

```sh
neon connection-string --project-id <project id> | gh secret set NEON_DIRECT_URL
```

The Neon CLI prints the string into the pipe, and `gh secret set` reads it there. GitHub's guidance points the same way: "Avoid passing secrets between processes from the command line, whenever possible," and use "environment variables, STDIN, or other mechanisms supported by the target process" (GitHub, n.d.-c). The value never reached my screen, my shell history, a file or the clipboard.

Three details make it safe to stop thinking about:

- **It fails closed.** The first step checks that the secret exists and stops with an error that names it. A missing secret is a red run, not a job that quietly migrates nothing.
- **The logs are masked.** "GitHub Actions automatically redacts the contents of all GitHub secrets that are printed to workflow logs" (GitHub, n.d.-b). The same page says redaction "is not guaranteed" once a value is transformed, so the job never prints it on purpose.
- **One at a time.** A concurrency group keeps two merges from migrating at once. The second waits for the first.

The job also sets a throwaway `DJANGO_SECRET_KEY`, because `migrate` signs nothing. The site's real key stays on Vercel, [where I eventually put it](/blog/where-the-django-secret-key-goes).

## The minute in between

Here is the trade-off. Vercel deploys the same push while the workflow runs. For about a minute the new code is live and the new table is not, so a page that needs a brand-new table answers 500 until the job finishes. Pages that existed before keep working, because the migrations on this project only add. Nothing the old code reads is renamed or dropped.

For an app with one user, a minute of 500s on a page nobody has opened yet is fine. A migration that removed or renamed something would break the old pages for that minute too; the guarantee holds only while migrations add.

Why not migrate inside the Vercel build and close the gap? Because the chapter 06 decision still holds: the schema change is its own step. It just runs on GitHub now instead of my laptop. A redeploy or a rollback in Vercel does not push to `main`, so it never touches the database.

## What it costs

GitHub Free includes 12 USD a month of Actions usage for private repositories, and a standard Linux 2-core runner draws 0.006 USD a minute from it (GitHub, n.d.-a). That is about 2,000 Linux minutes. This job takes about a minute, a few times a month. In practice it costs nothing, and the same page says that without a payment method on file, usage past the included amount is blocked rather than billed (GitHub, n.d.-a).

The hand recipe stays in the runbook as the fallback. I would rather not need it.

## References

GitHub. (n.d.-a). *GitHub Actions billing*. GitHub Docs. Retrieved October 28, 2026, from https://docs.github.com/en/billing/concepts/product-billing/github-actions

GitHub. (n.d.-b). *Secrets*. GitHub Docs. Retrieved October 28, 2026, from https://docs.github.com/en/actions/concepts/security/secrets

GitHub. (n.d.-c). *Using secrets in GitHub Actions*. GitHub Docs. Retrieved October 28, 2026, from https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
