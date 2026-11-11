<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Deploy Frequency Is Free When Agents Write the Code
Slug:    deploy-frequency-is-free-when-agents-write-the-code
Excerpt: I asked whether DORA's delivery metrics fit 26 repos with one person merging and agents
         writing most of the code. Two of the five would have caught the five failed deploys I
         missed in two weeks. The other numbers mostly measure how I batch merges. I built the page
         anyway, with cost per change beside them, and the first thing it showed me was how bad my
         data was.
Tags:    DORA, Delivery Metrics, GitHub Actions, Vercel, AI Agents, Solo Engineering, Learning in Public
PUBLISH ONLY AFTER: witus task 159 is merged (feat/dora-metrics), the production deploy is green, /admin/dora loads on production, and #171 (merged-is-not-done) and #197 (a-neon-cleanup-job-in-two-apps-without-neon) are live. If the token has Actions read by then, or the usage script records each response's working directory, rewrite the matching sentences in "What the data forced".
-->

# Deploy Frequency Is Free When Agents Write the Code

Tonight I asked whether DORA metrics fit what I run: 26 repositories, one person merging, Claude helpers writing most of the code on branches, every push to `main` deploying on Vercel, and migrate and seed workflows on GitHub Actions after the deploy.

DORA's set is five metrics now. Three measure throughput: change lead time, deployment frequency and failed deployment recovery time. Two measure instability: change fail rate and deployment rework rate (Harvey, 2026a). Recovery time got its current name and definition in 2023, when it replaced "time to restore service," and rework rate was added in 2024 as the fifth (Harvey, 2026b).

## Which ones fit

**Deployment frequency and lead time are distorted by design.** My branch rule batches small branches into one bundle, and I merge between sessions. So lead time mostly measures how long a finished branch waits for me, not the engineering. And frequency is cheap when agents write the code. The page below counts 402 changes in 30 days, and that count says nothing about whether any of them was worth shipping. I keep both on the page as observations, never as targets.

**Change fail rate and recovery time are the useful ones.** In the two weeks before tonight, five failed deployments went unnoticed for hours to a day each:

- an Invest.WitUS migration incident on 10-28;
- two security-patch deploys that sat failed for about 24 hours on 10-31, the story in [My Task List Said Merged](/blog/merged-is-not-done);
- a migration failing in CI on 11-04;
- GitHub runs that started with zero jobs on 11-09;
- a seed run that failed on an empty secret on 11-10.

Every one would have shown up as a failure with a long recovery time. That's the measurement I was missing.

**Rework rate fits too:** an error-pages fix needed a second pass, and fix branches merged a day after their feature.

## Definitions were the hard part

Naming the metrics is easy. Deciding what counts took most of the discussion. These are the definitions I approved.

- **A deployment** is a green Vercel Production deploy of `main` together with its post-deploy workflows. A failed migrate or seed run makes it a failed deployment, even when Vercel says green.
- **A change** is one deployment of `main` and the commit range since the one before it. Most merges are fast-forwards, so there's no merge commit to count. Each change gets two lead times: authoring, from the oldest commit in the range to the newest, and merge wait, from the newest commit to production.
- **A failure** is only an automatic signal: a failed deploy status, a failed post-deploy workflow on that commit, or a deployment within 24 hours whose whole range is fix commits. That last one also counts as rework.
- **Recovery** runs from the failure to the next green deployment.
- **Cost per change** is credits from my Claude usage archive divided by changes, per repo. The coordinating session is its own line, and spread across the apps for a second, all-in figure.

The elite, high, medium and low tiers aren't on the page as targets. I read them as team benchmarks, and DORA's own guide warns that setting the metrics as goals invites gaming them, and that they're meant for one application or service at a time (Harvey, 2026a). Hence one row per app.

## What got built

The same night, on witus `feat/dora-metrics`, waiting to merge as witus task 159:

- a read-only `/admin/dora` page with the ecosystem row and a row per app, over 30 and 90 days;
- a definitions doc;
- an alarm. If a Production deploy or a post-deploy workflow has been failed for more than 60 minutes, it sends one email through Mailgun, once per failure. An hourly GitHub Actions schedule calls the app with a shared secret, and the Deploys page shows the same failure as a banner.

131 tests pass on the branch, 19 of them new.

## The first reading

Thirty days, ecosystem-wide, read tonight. It's a first reading, not a verdict: data from before any process change.

- **Changes:** 402, about 94 a week.
- **Authoring time:** median 0 hours, because most changes are one commit; 90th percentile 9.7 hours.
- **Merge wait:** median 1.2 hours; 90th percentile 27.1 hours.
- **Change fail rate:** 84 of 424, 20 percent.
- **Recovery:** median 5.3 hours, 90th percentile 61.7 hours, from 23 closed episodes, with 2 still open.
- **Rework rate:** 52 of 402, 13 percent. That's inflated by an ecosystem-wide wave of commits that start with "fix(errors)".
- **Cost:** 3,281 credits spent, 2,209 of them in the coordinating session, and 1,439 of those by helpers. About 2.67 credits per change direct and about 8.16 all-in. Learn.WitUS runs about 12.29 direct and 17.79 all-in.

832 responses in the last 90 days have no price, because their model is recorded as a synthetic placeholder. The page counts them instead of dropping them.

## What the data forced

**Cost per repo is coarse.** Only six projects appear in the usage archive. Since 10-15, every response sits under the witus project, because the helpers run from the coordinating session. Until the usage script records each response's working directory, cost per repo stays coarse.

**Workflow failures are invisible for now.** The token the page uses lacks Actions read. Until I add it, post-deploy workflow failures aren't counted, and the alarm can't fire for them. A failed migrate or seed run is exactly what the alarm is for.

**The first alarm will be about old news.** Its first full run will flag two failures that were already old: an app whose last deploy failed on 2026-07-31 and never deployed again, and the Learn.WitUS seed run from tonight. Whether it should skip old failures is my call, and I haven't made it. Old failures nobody looks at are how a cleanup job stayed red on every push for two weeks in [two apps that don't use Neon](/blog/a-neon-cleanup-job-in-two-apps-without-neon).

## What this cost

**To build:** 6.82 credits, one helper run on Claude Opus 5.5 over 91 responses. A credit is 1 US dollar of API list price, not what my subscription bills, priced with the same usage method as my other posts. Not counted: the discussion that produced the definitions, which happened in the coordinating session I don't price per task, writing this post, and my time.

## What I'd carry

- **For one person with agents, watch failure and recovery.** Those two would have caught all five of the deploys I missed.
- **Frequency is free when agents write the code.** Count it, but don't read value into it.
- **Write the definitions before the dashboard.** A deployment includes its migrate run.
- **Expect the first reading to grade your data, not your work.** Mine showed that cost per repo is still coarse.

## References

Harvey, N. (2026a, January 5). *DORA's software delivery performance metrics*. DORA. Retrieved November 10, 2026, from https://dora.dev/guides/dora-metrics/

Harvey, N. (2026b, January 2). *A history of DORA's software delivery metrics*. DORA. Retrieved November 10, 2026, from https://dora.dev/guides/dora-metrics/history/
