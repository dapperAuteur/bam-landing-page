<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Critical Advisory Listed Three Conditions. I Checked Every App Against All Three.
Slug:    three-conditions-in-every-app
Excerpt: On October 27 a critical Better Auth advisory said anyone who knew your email could
         sign in as you, if three conditions held. I run more than twenty apps. Seven met all
         three. The sign-in server they all use did not, and that one check decided whether I
         upgraded it or held it back. What I checked, what the upgrade broke, and the merge that
         reached production before its migration did.
Tags:    Security, Authentication, Better Auth, Next.js, Dependencies, WitUS
-->

# A Critical Advisory Listed Three Conditions. I Checked Every App Against All Three.

On October 27, 2026, GitHub published a critical advisory for Better Auth, the sign-in library under most of my apps. The summary was one line: an OAuth state value could be used as a Magic Link to sign in as another user (GitHub, 2026b).

Here is what that means in plain terms. Someone who knows your email address starts a "Sign in with..." flow, takes the state value the server hands back, and presents it as if it were the one-time code from a sign-in email. The server accepts it. They get a normal session as you, with everything your account can do, and they never touch your inbox (GitHub, 2026b).

Five days earlier, GitHub had published three Next.js advisories: two critical remote code execution flaws, one in image optimization when SVG files are used and one in `use cache` functions that return typed arrays, plus a denial of service in Server Actions (GitHub, 2026c, 2026d, 2026e). And one for next-auth, where a look-alike `@` character could slip past the email check (GitHub, 2026a).

On October 30 I patched them, one branch per repository, 23 repositories in all. This is what I learned doing it.

## The advisory told me exactly what to check

The Better Auth advisory did something I wish every advisory did. Under "Am I affected?" it listed the conditions, and said you are affected only if **all** of them are true (GitHub, 2026b):

1. Magic Link sign-in is on, with its default way of storing tokens.
2. At least one social or Generic OAuth provider is on. In my apps that is "Sign in with WitUS."
3. OAuth state is kept in the database, which is the default when a database is configured.

So instead of treating every app the same, I read each app's auth config against those three lines and wrote the answer into the commit message. The results were not uniform:

- **Seven apps met all three**, at least once their WitUS sign-in settings are filled in.
- **One app registers Magic Link only outside production.** Its live builds never had the first condition. Only my laptop did.
- **One app has no sign-in plugins at all.** It got the upgrade anyway, to stay on a supported line.
- **WitUS itself**, the sign-in server the other apps sign in *with*, has Magic Link but no social or Generic OAuth provider. It does not meet condition two.

Two of the seven raised the stakes. Each promotes one configured email address to admin the first time it signs in. In those two apps, a takeover of that address would have been an admin takeover.

## Why the check mattered: the server I could not upgrade

The advisory names 1.7.7 as the first fixed version (GitHub, 2026b). Every affected app moved to 1.7.14. WitUS could not, at least not that afternoon.

Better Auth 1.7 removed the `oidcProvider` plugin. The upgrade guide says to replace it with `oauthProvider` from a separate package and move the configuration across (Better Auth, n.d.). WitUS *is* an OpenID provider built on that plugin. Upgrading it means a port and a move of every registered app's client record, which is a planned job, not a patch.

Without the three conditions, I would have had two bad choices: rush that port under a critical label, or leave the sign-in server for my whole ecosystem on a version the advisory names. With them, the answer was plain. WitUS does not meet condition two, so it stays on 1.6 for now, and the port gets its own plan.

I also changed how it is pinned. Its range was `^1.6.23`. A caret allows any newer 1.x, so a fresh install could have pulled 1.7 and broken the server at build time. It is now `~1.6.33`, which takes 1.6 patches and stops there. That was not a hypothetical. One of my other apps declared `^1.6.2` and its lockfile already held 1.7.2. A caret range had carried it into the release that changed its database requirements, which comes up again below.

## The upgrade moved a path another server depends on

1.7 moved the Generic OAuth callback from `/api/auth/oauth2/callback/:id` to `/api/auth/callback/:id` (Better Auth, n.d.). That is the address WitUS sends people back to after they sign in, and WitUS only sends them to addresses registered for that app, matched exactly.

My first attempt in one app followed the guide. It moved the path, then wrote in the commit message that WitUS had to register the new address before the app could deploy. That turns one app's patch into a coordinated release of two servers, on a day when speed mattered.

Thirty-three minutes later a second commit replaced it. An app that had moved to 1.7 earlier already had a better answer: keep telling WitUS the old address, and add a route at that old address that forwards to the new handler. Every app's patch then deploys on its own, and WitUS's list of registered addresses does not change. All seven apps got the same forwarding route.

## Two apps needed a database change first

The library upgrade said no data migration was needed for the fix (GitHub, 2026b). That was true of the fix. It was not true of the jump to 1.7 for every app.

- Better Auth 1.7.0 to 1.7.2 added a required `issuer` column to the `account` table, and 1.7.3 removed that requirement; the guide's fix is to relax the column (Better Auth, n.d.). The app whose caret had drifted to 1.7.2 had that column marked required. On 1.7.14, nothing writes it, so every new sign-up would have failed. The migration drops the requirement.
- A second app uses two-factor sign-in, and 1.7 records failed attempts in two new columns. Without them, two-factor verification would fail. That migration adds the columns.

Both changes only add or relax, so both are safe to run before the new code ships. The merge script I wrote for the patch round asked before each one, ran the migration against production, and only then merged.

## The merge that went out first

One merge still reached production before its migration did.

The migration was meant to run from my laptop with a connection string from a local environment file. That file held a database password from before the last rotation. The order on paper was right. The order in practice depended on a file on my laptop being current, and it was not.

Two days earlier, on October 28, I had written down a rule for exactly this: any step that must run after a deploy is automated, runs from a workflow on merge, and has a written fallback. Neither of these two apps had that workflow yet. Adding one to each is now the follow-up, so the next migration runs on the merge itself, with a secret that is current because the workflow is what uses it.

## What patching does not answer

A patch closes the door from now on. It says nothing about the days it was open. So the merge task ends with a read-only query for each of the seven apps: every session created since October 27, with its time and address, to compare against sign-ins I recognize. The advisory also says to request new Magic Links and restart pending sign-ins after the upgrade, because links and state created before it cannot complete (GitHub, 2026b).

And one advisory in this round was not new. The next-auth one was published on July 23 (GitHub, 2026a). My apps were still on a version it names in late October, three months later. Nothing had told me. Turning on Dependabot alerts in every repository is on the same task list, so the next one finds me.

## What I would tell someone doing the same

- **Read the conditions before you read the fix.** They decide where the risk is, and sometimes they decide what you can safely leave alone.
- **Write the per-app answer in the commit.** Six months from now, "patched" tells you nothing. "Met conditions 1 to 3; auto-promotes an admin email" tells you why it mattered.
- **Know what your version range allows.** A caret on a library that ships breaking changes in minor releases is a future outage on a timer.
- **Prefer a change that lets each service deploy alone.** A forwarding route beat a coordinated release of two servers.
- **If a deploy depends on a step you run by hand, the step will eventually run late.** Automate it before the emergency, not during it.

All 23 branches were merged by that evening.

## References

Better Auth. (n.d.). *Upgrading to Better Auth 1.7*. Better Auth documentation. Retrieved October 30, 2026, from https://better-auth.com/docs/guides/1-7-upgrade-guide

GitHub. (2026a, July 23). *Auth.js: Email normalizer validates the address before Unicode normalization, allowing a homoglyph @ bypass* (GHSA-7rqj-j65f-68wh). GitHub Advisory Database. https://github.com/advisories/GHSA-7rqj-j65f-68wh

GitHub. (2026b, October 27). *better-auth: OAuth state can be used as a Magic Link to sign in as another user* (GHSA-965c-763c-88jm). GitHub Advisory Database. https://github.com/advisories/GHSA-965c-763c-88jm

GitHub. (2026c, October 22). *Next.js: Denial of Service in App Router using Server Actions* (GHSA-p3m5-59mp-jv5r). GitHub Advisory Database. https://github.com/advisories/GHSA-p3m5-59mp-jv5r

GitHub. (2026d, October 22). *Next.js: Unauthenticated Remote Code Execution in Image Optimization API when SVG files are used* (GHSA-2464-fhr4-w9xw). GitHub Advisory Database. https://github.com/advisories/GHSA-2464-fhr4-w9xw

GitHub. (2026e, October 22). *Next.js: Unauthenticated Remote Code Execution in use cache functions returning typed arrays* (GHSA-673q-mjm6-r5xr). GitHub Advisory Database. https://github.com/advisories/GHSA-673q-mjm6-r5xr
