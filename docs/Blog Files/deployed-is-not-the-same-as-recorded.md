<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Deployed Is Not the Same as Recorded
Slug:    deployed-is-not-the-same-as-recorded
Excerpt: I built a page that shows whether each of my apps' newest code is live, so a merged task
         can't pass for a finished one. Invest.WitUS showed no production deploys at all, although
         Vercel had deployed every push. The deploys happened. GitHub was never told. A setting on
         three newer Vercel projects, a fallback that reads what Vercel does post, and why an empty
         row is worse than a red one.
Tags:    Operations, Vercel, GitHub, Workflow, WitUS
-->

# Deployed Is Not the Same as Recorded

In [My Task List Said Merged. Two Apps Were Still Running the Old Code.](/blog/merged-is-not-done), I wrote down a rule for myself: merged is not done. A task that ships code closes when the production deploy is green.

To make that rule something I could check instead of something I remembered, the witus.online admin got a deploys page. One row per app: the newest production deploy, whether it succeeded, and whether it is running the newest commit on `main`. Live, behind, failed or in progress. I look at it before I close a merge task.

On the evening of November 3, the row for Invest.WitUS said **No production deploys**.

## Every push had deployed

That was false in the plainest way. Invest.WitUS (invest.witus.online) is the investing app I am building to learn Python. I had merged to it twice that evening, and Vercel had deployed both pushes.

The page wasn't broken either. Every other app had a row. The page reads GitHub's Deployments API, which is where Vercel records each deploy for a repository connected through its GitHub integration. For Invest.WitUS, that API answered with an empty list. Not a failed deploy, not an old one. Zero, ever.

Meanwhile every commit on Invest.WitUS's `main` carried a green check from Vercel. That check is a commit status, a different GitHub feature. GitHub describes commit statuses as what "allow external services to mark commits with an `error`, `failure`, `pending`, or `success` state" (GitHub, n.d.). Vercel posts one for each project a commit deploys, by default (Vercel, 2026). So Vercel was telling GitHub about every deploy in one place and not in the other.

## The setting

Claude read the Vercel project settings through Vercel's API, read-only. Invest.WitUS's project had one Git setting turned off: `gitProviderOptions.createDeployments` was `"disabled"`. The name says what it does: whether Vercel creates GitHub deployments for the project.

The older projects it checked had it on, and they had GitHub deployments. The two Fit T. Cent Assessments projects had it off too, and that repository had no GitHub deployments either.

The first guess was the ignore build step, the command that tells Vercel to skip a build when nothing relevant changed. It wasn't that. My shop app uses the identical command, and its deployments are recorded fine.

What the three projects with the setting off have in common: all three were created after October 27. That suggests new Vercel projects now start with GitHub deployments off, but it hasn't been proven, and I'm not going to state it as fact. Vercel's documentation describes a "`deployment_status` Events" toggle in each project's Git settings for silencing deployment notifications on pull requests (Vercel, 2026). I think that toggle and this setting are the same switch, but I haven't proven that either. I don't know who or what turned it off on these three.

## Why an empty row is worse than a red one

A red row says something went wrong. I would have opened it.

"No production deploys" reads like an app that hasn't launched. It looks like there's nothing to check. For an app where I merge almost every day, it meant the page couldn't tell me about a failed Invest.WitUS deploy at all. Every Invest merge task would have been closed by me looking somewhere else, or not looking.

The page was built to stop "merged" from passing for "done." For one app, it couldn't see whether the code was deployed.

## The fix: read what Vercel does post

The change has two halves.

**At the source,** the setting is back on for Invest.WitUS and for the Fit T. Cent production project. The next push to each `main` should create its first GitHub deployment, and the page will use it.

**In the page,** a fallback for any repository with no production deployments. It reads the combined status of the newest commit on `main` and takes the status named exactly `Vercel`.

- If `main`'s newest commit is green, the app is live on `main`. That costs one extra request.
- If it isn't, the page walks back through `main`'s five newest commits to the newest green one, and counts how many commits `main` is ahead of it.
- The row says **from Vercel's commit status** and links to `main`'s commits, so I know which record it read.

Reading statuses needs one more permission on the page's GitHub token, Commit statuses: Read-only. Without it, the row says that permission is missing and the warning banner at the top of the page names it. The fallback has 9 new tests, with GitHub mocked and the number of requests checked.

## What the fallback doesn't do

- **It only knows `main`'s commits,** not every deploy. A redeploy of an old commit, or a deploy from the Vercel dashboard, isn't in a commit status. That is why turning the setting back on is the real fix and the fallback is the backstop.
- **It won't guess between projects.** Fit T. Cent Assessments has two Vercel projects on one repository, so its statuses are named after each project instead of plain `Vercel`. The fallback deliberately doesn't pick one as production. That row stays "No production deploys" until GitHub deployments arrive.
- **A green deploy is not a working app.** The same evening, an Invest.WitUS deploy was green while the database migration from the same push had failed. The deploys page would have said live. That one showed up in GitHub Actions, which is a different page and a different post.

## Where it stands

The fix is merged into the witus.online admin, and that deploy is green. What's left is mine: adding the Commit statuses permission to the token and opening the page to see Invest.WitUS read **Live on main** (witus task 152).

## What this cost

The helper that found the setting and built the fallback took about 2.31 credits of Claude usage over 50 responses, roughly $2.31. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helper's session transcript. Not counted: writing this post, the main session that coordinated the work, and my own time.

## What I would carry

- **Deployed is not the same as recorded.** A check that reads a record can only see what was written to it.
- **An empty row needs a reason.** "None" from a source that should have something is a finding, not a blank.
- **Find out where the host writes, then read that.** Vercel wrote commit statuses all along.
- **Say which source answered.** A row built from a fallback should say so.
- **Fix it at the source too.** A fallback that becomes the only path is a second system to maintain.

## References

GitHub. (n.d.). *REST API endpoints for commit statuses*. GitHub Docs. Retrieved November 3, 2026, from https://docs.github.com/en/rest/commits/statuses

Vercel. (2026, September 17). *Deploying GitHub projects with Vercel*. Vercel documentation. Retrieved November 3, 2026, from https://vercel.com/docs/git/vercel-for-github
