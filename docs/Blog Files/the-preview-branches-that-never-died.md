<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Preview Branches That Never Died: $100 a Month for Databases Nobody Was Using
Slug:    the-preview-branches-that-never-died
Excerpt: Two invoices in a row carried more than $100 of Neon branch overage. I had
         configured automatic cleanup. The branches stayed anyway, for a reason that
         sits in the vendor's own docs. Here is why, what I built so it cannot happen
         again across 24 repos, and the one button I now have for the leftovers.
Tags:    Infrastructure Costs, Vercel, Neon, Preview Deployments, Solo Engineering, Ecosystem Rules
-->

# The Preview Branches That Never Died: $100 a Month for Databases Nobody Was Using

Two invoices in a row carried more than $100 of extra usage for Neon database branches. I had set up automatic cleanup when I installed the integration. The branches stayed anyway. This post is the autopsy, the fix, and the rule that came out of it.

## What a preview branch is, and why it has a price

Every one of my products deploys on Vercel. When I push a git branch, Vercel builds a preview deployment of it. Most of my products keep their data in Neon, a serverless Postgres, installed through the Vercel-managed Neon integration. That integration does something clever: for every preview deployment it creates a matching Neon branch, a copy-on-write fork of the production database named `preview/<git-branch>`, and injects its connection string into that deployment (Neon, n.d.-c). The preview runs against its own data. Nothing I do on a preview can touch production. That is the right design.

The branch is also a billable thing. It has storage, it has a compute endpoint, and it counts toward the plan's branch allowance. Branches beyond that allowance bill as extra usage (Neon, n.d.-b).

## Why "automatic cleanup" did not clean up

I assumed, as you would, that a preview branch lives as long as its pull request. It does not. Neon's guide on the subject says it plainly: cleanup is tied to deletion of the Vercel deployment, not to the git branch or the pull request. Vercel keeps preview deployments for six months by default. And a project with fewer than about twenty preview deployments may never auto-delete any preview branch at all (Neon, n.d.-b).

Read that last sentence against a solo operation. I run 24 repositories. Most of them get a handful of preview deployments a month. Each repository is exactly the kind of small project the retention exception describes. So every branch I had ever previewed was still there, six months of them, each one counting against the branch limit, each one billed once the limit was passed.

The setting I had configured was not wrong. It was doing exactly what the documentation says it does. What I had was a mismatch between the mental model the word "automatic" gave me and the trigger the system actually used.

## Counting what was there

Before fixing anything I counted. A short script against the Vercel API listed every preview deployment in the account: 242 of them across 26 projects. Most were days old, created by a wave of branch pushes earlier that week. Two were from 2022. Each one had, or had once had, a Neon branch behind it.

The Supabase side of the ecosystem (three products share one Supabase project) had zero branches, so that bill was not the culprit. MongoDB Atlas, used by two products, creates a cluster, a database user and an IP entry once per integration, nothing per preview (MongoDB, n.d.). The cost was Neon, and only Neon.

## The fix, in three layers

**Delete on pull-request close.** Neon's recommended workaround is a GitHub Action that deletes the branch the moment the pull request closes (Neon, n.d.-b). I wrote one canonical workflow file in the hub repository and a sync script that copies it into every Neon-backed repository on the same branch my shared-rules sync already uses, so each repository still needs one merge. The workflow fails loudly if the repository is missing the Neon project ID or API key, because a cleanup job that silently does nothing is the problem I started with.

**Shorten what Vercel keeps.** Vercel's retention policy for pre-production deployments can be set to its shortest duration per project (Neon, n.d.-b). That is a dashboard setting, not code, so it lives in my operator queue with every other thing only I can click.

**Make it a rule, not a memory.** The ecosystem carries a block of shared rules in every repository's agent instructions. The new rule says: every Neon repository has the workflow, the variable and the secret; hand-made branches carry an expiration, which Neon supports as a time-to-live of up to 30 days (Neon, n.d.-a); Supabase repositories use no persistent branches; and no preview deployment may leave a paid resource behind. The rule reached 21 repositories in one propagation run.

## One button for the leftovers

A rule prevents the next pile. It does not remove the current one. So the hub product got an owner page: it lists every Vercel preview deployment by project and every Neon branch named `preview/*`, and one button, behind a typed confirmation, deletes all of them. The same code runs as a command-line script. It never lists production deployments, and it never touches a default or protected branch, because the library it calls cannot ask for them.

The page is small. The design decision behind it is not: the tools that can charge me money for things I forgot now share one screen, and that screen says "none" when the account is clean.

## The refund

I have asked for a credit for the two months of overage. The argument is not that the vendor did something wrong. It is that a feature called automatic cleanup, configured as instructed, left every branch in place for a reason the setup flow never mentioned. Whether the credit comes or not, the branches are gone and the rule is in.

## What I would tell past me

Read the trigger, not the adjective. "Automatic" tells you something happens. It does not tell you when. Every cleanup feature has a trigger, and the trigger is the only part worth understanding. If the trigger is not "when the thing I am thinking of ends," then the feature is not the one you think it is.

## References

MongoDB. (n.d.). *MongoDB Atlas Vercel integration*. https://www.mongodb.com/docs/atlas/reference/partner-integrations/vercel/

Neon. (n.d.-a). *Branch expiration*. https://neon.com/docs/guides/branch-expiration

Neon. (n.d.-b). *Managing Vercel preview branch cleanup*. https://neon.com/docs/guides/vercel-branch-cleanup

Neon. (n.d.-c). *Vercel-managed integration*. https://neon.com/docs/guides/vercel-managed-integration

Supabase. (n.d.). *Branching*. https://supabase.com/docs/guides/deployment/branching
