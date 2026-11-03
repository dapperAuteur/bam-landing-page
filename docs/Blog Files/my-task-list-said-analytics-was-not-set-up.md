<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Task List Said Analytics Wasn't Set Up. Twenty Live Sites Said It Was.
Slug:    my-task-list-said-analytics-was-not-set-up
Excerpt: Two tasks from July and August said product analytics and Vercel Web Analytics still
         had to be set up across about twenty WitUS apps. Instead of doing the steps again, I
         checked the live sites. Analytics was already running on 20 of them. Two probes almost
         said otherwise, and the one real gap was a Django app with Analytics switched on and
         no tag in the page.
Tags:    Operations, Analytics, Vercel, PostHog, WitUS
-->

# My Task List Said Analytics Wasn't Set Up. Twenty Live Sites Said It Was.

Two tasks in my queue were old. One from July and one from August said that analytics still had to be wired up across about twenty WitUS apps: the PostHog environment variables (PostHog is the product analytics tool the apps report to), and Vercel Web Analytics switched on for each project. Both said "Pending."

Two days earlier I had found the opposite problem. My task list said a security patch was merged and done, and two apps were still running the old code. I wrote that up in [My Task List Said Merged. Two Apps Were Still Running the Old Code.](/blog/merged-is-not-done) The lesson there was to check the systems, not the list. This time the list was wrong in the other direction, and the same habit found it.

## Checking behavior instead of the task

Doing the steps again would have meant opening twenty Vercel projects and pasting variables that might already be there. So on November 2 we checked what each live site actually does:

- **PostHog:** fetch each production homepage and look for the PostHog project key in the page source. That key is meant to be public, and the browser needs it to send events. If it is in the page, the variable was set when the site was built.
- **Vercel Web Analytics:** request `/_vercel/insights/script.js` on each host and see whether JavaScript comes back. Vercel's guide says that "Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*` and `/<unique-path>/*`) after your next deployment" (Vercel, 2026). If the route answers, Analytics is on and has been deployed.

The result: the PostHog key was live on 20 sites. Vercel Web Analytics answered 200 with JavaScript on all 18 user-facing hosts. The ecosystem's conformance checker, which compares each repo's setup against the shared standard, reported no drift. Six repos are not instrumented on purpose.

So the work had been done. The tasks had never been closed.

## Two probes that almost lied

The first version of the PostHog check said "none" on every site. It searched the JavaScript files the pages load, on the guess that a key read from an environment variable would be compiled into the code. In these apps the key is written into the HTML itself. The check was looking in the wrong file and reporting an absence everywhere, which is the most dangerous kind of wrong answer: it looks like a finding.

The second problem was redirects. Three sites send `/` to `/en`, their English home page. A probe that did not follow redirects saw a short redirect response with no key in it and marked those sites as missing analytics. Following the redirect found the key on all three.

Both mistakes point the same way. A check that says "not there" has to prove it looked in the right place. Before believing a negative, I now want one site where the check comes back positive, so I know it can.

## The one real gap

One app did have a hole. Invest.WitUS, the investing app I am building to learn Python, runs on Django, not Next.js. Analytics was switched on in its Vercel project. The page had no analytics tag.

The reason is in its own template. The two script tags render only when the app is running on Vercel and a variable named `VERCEL_ANALYTICS` is set to `1`. The switch is there so Production can be on while previews stay off. Then the variable was never set in Production. I set it, redeployed, and the tag appeared in the page.

This is the gap the route probe cannot see. The `/_vercel/insights/script.js` route proves Analytics is on for the project. It does not prove any page loads the script. The same guide's next step after enabling is adding the package to the project (Vercel, 2026). For a Next.js app, that is a component in the layout. For a Django app, it is a tag in a template, behind a switch I wrote myself.

## What PostHog shows now

The PostHog dashboard now shows events from several apps. It also says the SDK is outdated. Across the apps, `posthog-js` is pinned anywhere from 1.364 to 1.444, and the latest is 1.444.4. That is queued for the next batch of dependency updates instead of twenty separate changes today.

## What I changed in how I close tasks

- **An old task is a question, not an order.** Before doing a step from a task that is months old, check whether the system already shows it done.
- **Check by behavior.** "Does the live page carry the key?" is a better test than "does the dashboard have a variable with this name?"
- **Test your probe on a known positive** before trusting any "not found" it reports.
- **Follow redirects** when you probe a home page.
- **Switches you write yourself need a task of their own.** A variable that turns a feature on is easy to add in code and forget in Production.

The Invest.WitUS tag is live, and the two old tasks can close on what the sites show.

## References

Vercel. (2026, June 8). *Getting started with Vercel Web Analytics*. Vercel Docs. Retrieved November 2, 2026, from https://vercel.com/docs/analytics/quickstart
