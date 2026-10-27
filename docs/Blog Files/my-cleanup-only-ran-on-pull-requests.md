<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Cleanup Job Only Ran When a Pull Request Closed. I Don't Open Pull Requests.
Slug:    my-cleanup-only-ran-on-pull-requests
Excerpt: I built a job to delete leftover preview databases, and an admin page to show
         me anything it missed. Eleven days later the page listed 14 of them. The job
         was fine. It was waiting for an event my way of working never sends.
Tags:    Infrastructure Costs, GitHub Actions, Neon, Vercel, Admin Tools, Solo Engineering
-->

# My Cleanup Job Only Ran When a Pull Request Closed. I Don't Open Pull Requests.

In [The Preview Branches That Never Died](/blog/the-preview-branches-that-never-died) I wrote about database branches that outlived the work they were made for, and the fix I shipped across my repositories. The fix had a gap. This is how I found it, what closed it, and why the lesson from that post did not stop me from making the same mistake one level up.

## The page that found it

After the first cleanup I added an owner page to my hub app. It is called Cost cleanup, and it lists everything a preview deployment can leave behind on a bill: Vercel preview deployments by project, and every Neon database branch named `preview/` something. You tick rows, a whole project, or everything, type a confirmation, and delete.

The point of the page is that it should say "nothing to delete." Eleven days after the fix, it listed 14 Neon preview branches. Every one of them belonged to a git branch I had already merged.

## The trigger I copied

A preview branch is a copy of a production database that Neon makes for each Vercel preview. Neon deletes one "when its last associated Vercel deployment is deleted," and Vercel keeps preview deployments "for 6 months by default" (Neon, n.d.). So the cleanup I configured in the first place almost never ran.

Neon's own guide recommends a GitHub Action that deletes the branch when a pull request closes, and it shows the trigger:

```yaml
on:
  pull_request:
    types: [closed]
```

(Neon, n.d.). I copied that pattern into one workflow file, synced it to every repository with a Neon database, and moved on.

Here is the part I missed. I almost never open pull requests. My agents push a branch, and I merge it from the terminal with a fast-forward and a push to main. GitHub's own reference lists the events a workflow can listen for: a push "when you push a commit or tag," and a pull request closing (GitHub, n.d.). A merge from the terminal is a push. No pull request ever closed, so the workflow never ran. It was not broken. It was waiting for an event my way of working never produces.

## The fix: sweep, don't wait

Version two stops waiting for one event and sweeps instead. It runs on every push to main, when a branch is deleted, when a pull request closes, once a day, and on demand. Each run lists the Neon branches named `preview/` something and asks git one question about each: is this branch merged into main, or gone from GitHub? If yes, the database branch is deleted. If the branch still has commits main does not have, it keeps its database, because someone is still working there. Neon's default and protected branches are never touched.

The daily run matters for one reason I would not have guessed: GitHub says scheduled workflows "will only run on the default branch" (GitHub, n.d.), and that is exactly where this job lives, so the schedule is a safety net that does not depend on any push at all.

Before shipping it I ran the deciding logic against one repository's real branches without deleting anything. It marked three merged branches from the page for deletion and kept a course branch that was still being built. Then one sync script pushed the new workflow to 20 repositories plus the hub, each on a branch for me to merge.

The 14 leftovers I deleted from the page myself. A check afterward found one preview branch left in the whole account: the course branch an agent was building at that moment. That is the one that should be there.

## The page had its own bug

When I sent a screenshot of the page, the first thing I said was that I could barely read it. The admin side of the app uses a dark theme with light text. This page hard-coded light backgrounds on its rows, its group headers and its confirmation panel, so the light text landed on near-white. A page you only open when something has gone wrong is the last page that should be hard to read. It now uses the same dark panels as the rest of the admin.

It also said "Vercel: not configured" because the page had no Vercel token. The command-line tool refused to make one ("Cannot create tokens for this app"), so I made it on Vercel's site and added it to the hub's settings. After the next deployment the Vercel column filled in.

## What I would tell past me

In the first post my lesson was: read the trigger, not the adjective. I did read the trigger this time. I just checked it against the vendor's documentation instead of against how I actually work. A trigger is only correct if the event it waits for is one your own process produces.

Two habits came out of this:

1. **Sweep for the state you want instead of reacting to one event.** "Delete preview databases whose branch is merged" survives any merge style. "Delete when a pull request closes" survives only one.
2. **Keep the page that shows the leftovers.** The job was green the whole time. The page is what told me it was not working.

## References

GitHub. (n.d.). *Events that trigger workflows*. GitHub Docs. Retrieved October 26, 2026, from https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows

Neon. (n.d.). *Managing Vercel preview branch cleanup*. Neon Docs. Retrieved October 26, 2026, from https://neon.com/docs/guides/vercel-branch-cleanup
