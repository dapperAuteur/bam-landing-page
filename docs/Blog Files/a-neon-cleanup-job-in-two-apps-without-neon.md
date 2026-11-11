<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Neon Cleanup Job Ran in Two Apps That Don't Use Neon
Slug:    a-neon-cleanup-job-in-two-apps-without-neon
Excerpt: For two weeks, two of my Supabase apps failed a Neon cleanup job on every push. The rule
         behind the job was right. The script that rolled it out to 26 repos carried a hand-typed
         list of who was exempt, and the list forgot them. Here is why nobody noticed, the fix,
         the cost, and why a red run with a boring name is still a red run.
Tags:    GitHub Actions, CI, Neon, Supabase, Ecosystem Rules, Solo Engineering, Learning in Public
PUBLISH ONLY AFTER: witus task 158 is merged, the next pushes to Tour Manager and CentenarianOS show no "Cleanup Neon preview branches" run, and #145 (my-cleanup-only-ran-on-pull-requests) is live.
-->

# A Neon Cleanup Job Ran in Two Apps That Don't Use Neon

On 2026-11-10 I merged two error-page branches into Tour Manager, the app I built for touring musicians and their crews. The deploy went green. Under it, in the Actions tab, sat a red run called "Cleanup Neon preview branches." Its log asked me to set a repository variable named `NEON_PROJECT_ID` and a secret named `NEON_API_KEY`.

Tour Manager doesn't use Neon. It runs on Supabase. So does CentenarianOS, and when I looked there, it had the same red run on every push. For about two weeks, both apps had been failing a job for a database they don't have.

## The rule was right

The job comes from one of my ecosystem rules. [My Cleanup Job Only Ran When a Pull Request Closed](/blog/my-cleanup-only-ran-on-pull-requests) tells how it got to its current shape: every repo with a Neon database gets a workflow that sweeps for `preview/<branch>` database branches whose git branch is merged or gone, and deletes them, because a leftover preview branch bills as extra usage. Repos on Supabase need nothing. My Supabase apps don't make a database branch per preview deploy, so there is nothing to clean.

That rule, version 6 of my shared rules, rolled out on 2026-10-26, and it was correct. How it reached each repo was not.

## The list that forgot two apps

I don't paste a workflow into 26 repositories by hand. A sync script in my hub repo, `scripts/sync-preview-cleanup-workflow.mjs`, reads my ecosystem registry, copies the workflow into each repo on its own branch, and pushes. The registry lists repos, not databases, so the script has to be told which repos to skip. It carried a set called `NON_NEON` for that:

```js
const NON_NEON = new Set(["flashlearn-ai", "bam-landing-page", "witus-agent-evals", "create-witus"]);
```

Read it and you can see what whoever wrote it was thinking about: the repos with no database, and FlashLearnAI on MongoDB. Not one Supabase app is in it. Tour Manager and CentenarianOS weren't excluded, so they got the file.

The workflow then did what I designed it to do. When its Neon settings are missing, it fails closed with an error that names the missing variable and secret, instead of skipping quietly. That is the right behavior in a Neon repo where someone forgot to set the secret. In a Supabase repo it means a red run on every push, forever.

A third Supabase app, Work.WitUS, also got the file, and its copy passes. Work.WitUS is moving to its own Neon database, so its Neon credentials are already set. That copy stays.

## Why I didn't see it for two weeks

Three things kept it quiet.

First, nothing I watch went red. CI passed. The production deploys of both apps were green. The failing run sat beside them, not in front of them.

Second, the name. "Cleanup Neon preview branches" reads like housekeeping. In a list of runs, a red mark beside a chore's name says "later." The same screen that night showed a second, unrelated red run in Inbox and Outbox: their end-to-end job failed at `npm ci` because the lock files were written by a newer npm on my Mac than the one CI runs. Two red runs, both named like plumbing, both easy to look past.

Third, the fact that would have caught it lived in a different file. Which app uses which database is written down in one plan file, `plans/ecosystem/db-usage.md`. The `NON_NEON` set was a second copy of that fact, typed by hand, and nothing ever compared the two. The plan file was right. The copy was wrong.

## The fix

It went out the same evening, as witus task 158.

- The two Supabase repos were added to `NON_NEON`.
- The sync script now looks in the excluded repos too. If it finds a synced copy of the workflow there, it reports it, and with `--write` it removes it through the same branch-and-push flow it uses to add one. With the two apps on the list, it can't put the file back either. The dry run that night printed "2 repo(s) would change, 20 up-to-date, 1 skipped".
- The workflow file was deleted from Tour Manager and CentenarianOS, on one branch in each.
- My operations runbook got a section on which repos get the cleanup workflow and why, and a bug note records what happened.

The fix that would stop this kind of mistake isn't built yet. It is a `database` field on each repo in the ecosystem registry, read by both the sync script and the registry check. Then there is one copy of the fact, the sync decides from it, and a Supabase repo added next month gets skipped without anyone remembering to add it to a list.

## What this cost

**To create:** cannot be priced separately. The sync script was written on 2026-10-26 in a session that rolled the rule out across many repos at once, and that day's cost can't be split down to one exclusion list.

**To fix:** 0.44 credits, one helper run on Claude Sonnet 5.5 over 17 responses. A credit is 1 US dollar of API list price, not what my subscription bills. I priced it with the same usage method as my other posts, after adding Sonnet 5.5 to the price table that night. Not counted: the coordinating session, which I don't price per task, this post, and my time.

## What I'd carry

- **An exclusion list is a copy of a fact that lives somewhere else.** If you can't point to where the original is read, the copy will drift.
- **When a rule rolls out by script, read who is exempt from the registry. Don't type it.** Twenty-six repos is too many to keep a hand-kept list honest.
- **Make the sync remove what it shouldn't have added.** A script that only adds files can't undo its own mistakes.
- **A red run with a boring name is still a red run.** My deploys page counts failed deploys. The delivery metrics page I approved the same night will count failed workflow runs too, so a red chore shows up as a number instead of a mark I've learned to skip.
