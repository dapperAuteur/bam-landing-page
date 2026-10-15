<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Build Minutes I Never Needed: Reading a $73 Vercel Bill Line by Line
Slug:    the-build-minutes-i-never-needed
Excerpt: I blamed my database vendor for two months of overage. One command showed the
         truth: 58 percent of my Vercel bill was build minutes, charged because two
         defaults I never chose made every build billable. Here is the read, the fix
         that took one script, and the rule that now stops it across 28 projects.
Tags:    Infrastructure Costs, Vercel, Builds, Solo Engineering, Ecosystem Rules
-->

# The Build Minutes I Never Needed: Reading a $73 Vercel Bill Line by Line

The previous post was about database branches that never got deleted. I wrote most of it before reading my own usage report. When I did, the branches were a footnote. The bill was builds.

## One command

Vercel's CLI has a usage command that breaks the last 30 days down by project and by line (Vercel, n.d.-c). Mine read, for September 15 to October 15, an estimated $72.89 before the plan's $20 credit. Build CPU Minutes were about $42 of it. Two projects carried most of that: my personal operating system at $18.37 for 5,250 CPU minutes, and my learning platform at $11.44 for 3,270. The Pro fee was $19.76. Everything else, functions, analytics, log drains, image optimization, added up to less than $10.

I had been looking for the cost in the wrong vendor's dashboard.

## Why builds cost money at all

On the Pro plan, two settings decide whether a build is included or billed. Vercel's pricing page states it in one sentence: builds on Standard build machines are only billed when on-demand concurrency is enabled or Elastic build machines are selected (Vercel, n.d.-b). Both of those are the defaults for a Pro team. By default, projects have on-demand concurrent builds enabled, and new Pro accounts use Elastic machines, which pick a machine size per project and bill by CPU minute (Vercel, n.d.-a).

My 28 projects had on-demand concurrency on in 26 of them. Seven had been assigned Enhanced machines with eight cores. One of them, the operating system, takes about 26 minutes a build. On eight cores that is 208 CPU minutes per build, at $0.0035 each. I had never chosen any of this. I had never needed any of it either: I am one person, I do not have five builds waiting at once, and a build that finishes in 30 minutes instead of 26 changes nothing in my day.

## The fix was a script

Standard machine, on-demand concurrency off, on every project. That is two fields in the project settings API, so I wrote a script that reads every project, prints which ones are billable, and with a flag sets both fields. It ran across all 28 projects in under a minute. Two projects needed a second pass because the concurrency field only took when the queue mode was set alongside it, which the docs' own example does (Vercel, n.d.-a).

Then the second lever: build less. Every push to any branch builds a preview in that project. A day of propagating an ecosystem rule to 24 repositories had pushed to every one of them twice, and every push built. The same script now sets an Ignored Build Step on each project: production always builds, branches named `bundle/` build a preview, everything else is skipped. That matches how I already work. Small branches are for authoring; a bundle branch is what I review and merge. Previews land exactly where I look.

## What the ecosystem learned

Three rules went into the shared instructions every repository carries:

1. No preview deployment may leave a paid resource behind. Branches, databases, anything with a meter.
2. A build machine larger than Standard is a decision, written down, with the build time that justifies it.
3. Read the usage report before blaming a vendor. The report is one command, and it is right.

The last one is the one I needed. I had a refund email drafted for a database vendor before I had read a single invoice line. Its charges arrive through the Vercel marketplace, on a separate line the usage report does not even show, and by the time I looked every one of its installations was on the free plan. The usage report took twelve seconds and moved the story to where the money actually was.

## What it costs now

The Pro fee, $20, which comes with $20 of usage credit. At current traffic the usage sits inside the credit. A spend cap sits at $40 with a pause at $60, so the next surprise, if there is one, is a notification and not an invoice.

## References

Vercel. (n.d.-a). *Managing builds*. https://vercel.com/docs/builds/managing-builds

Vercel. (n.d.-b). *Pricing on Vercel*. https://vercel.com/docs/pricing

Vercel. (n.d.-c). *Manage and optimize usage*. https://vercel.com/docs/pricing/manage-and-optimize-usage

Vercel. (n.d.-d). *Vercel Pro plan*. https://vercel.com/docs/plans/pro-plan
