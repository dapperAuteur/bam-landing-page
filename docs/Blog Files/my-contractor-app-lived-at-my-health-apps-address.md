<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Contractor App Thought It Lived at My Health App's Address
Slug:    my-contractor-app-lived-at-my-health-apps-address
Excerpt: The "Sign in with WitUS" button was missing from Work.WitUS. The button was fine. The app's
         own address setting still named CentenarianOS, the app it was split from, and 24 files
         used that setting for invite emails, reply links, the sitemap and more. Splitting an app
         copies its configuration too.
Tags:    Next.js, Vercel, Configuration, Learning in Public, Work.WitUS
-->

# My Contractor App Thought It Lived at My Health App's Address

Work.WitUS (work.witus.online) is the app I built for people who work gigs: jobs, crews, pay and travel. It started as a copy of CentenarianOS, my health and planning app. I wrote about what that copy carried over in [Copied Code Copies Its Bugs](/blog/copied-code-copies-its-bugs). This post is about something else it carried over, which wasn't code at all.

On November 4 I opened the Work.WitUS login page and noticed there was no **Sign in with WitUS** button. Every other app in the ecosystem has one. I put it on my list of things for Claude to look at that day.

## The button was working as designed

Claude fetched the live login page and read what the server sends to the browser. Two values mattered:

- `enabled: true`. Sign in with WitUS was configured.
- `appOrigin: https://www.centenarianos.com`. The app believed its own address was CentenarianOS's.

The button only shows itself when the page you're on matches the address the WitUS sign-in service has registered for that app. That check exists for a good reason: the sign-in service will only send you back to an address it knows, so a button on the wrong host would start a sign-in that can't finish. Work.WitUS was registered as work.witus.online. The app said it was centenarianos.com. The page didn't match, so the button hid itself.

The button did exactly what it was built to do. The input was wrong.

## Where the wrong address came from

The value is `NEXT_PUBLIC_SITE_URL`, a setting on the Work.WitUS project in Vercel. When Work.WitUS was split out of CentenarianOS, it inherited CentenarianOS's settings, and this one was never changed. Nothing broke loudly, so nothing told me.

The `NEXT_PUBLIC_` prefix matters. Next.js reads those values when it builds the app and writes them straight into the code. Its documentation is direct about the consequence: "After being built, your app will no longer respond to changes to these environment variables" (Vercel, 2026). So fixing the setting isn't enough. The app has to be rebuilt and redeployed before the new value means anything.

## It wasn't only the button

Claude searched the code for that setting. Twenty-four files read it. Among them:

- the email that invites someone to the app
- links in messages and replies to feedback
- Cash App payment links
- the sitemap and robots file that tell search engines what the site is
- the page metadata used when a link is shared

Every one of those would point at CentenarianOS. Someone invited to Work.WitUS by email would get a link to a different product. A search engine reading the sitemap would be told Work.WitUS's pages live on another domain.

The code had a second problem of its own. Where the setting was missing, several files fell back to `https://work.witus.com`. Work.WitUS has never had that domain. Others fell back to `http://localhost:3000`, which is my laptop. So even with the setting empty, those links would have been wrong in a different way.

## The fix

Three parts.

**The setting.** It now names work.witus.online on Production, followed by a redeploy, because of the build-time rule above. That was my step to do in the Vercel dashboard (Work.WitUS task 28).

**One place that decides the address.** A new helper, `getSiteUrl()`, is the only code that reads the setting now. If it's set, that wins. If it isn't, production uses work.witus.online, a preview build uses its own preview address, and my laptop uses localhost. All 24 call sites use it, and there is no `work.witus.com` left in the code. A test checks that no other file reads the setting directly.

Sign-in keeps a stricter rule. It uses only the configured value, never a fallback and never the address the request arrived on. If the setting is missing, Sign in with WitUS stays off rather than guessing.

**A warning when the address is wrong.** On startup, the server compares the configured address with the hosts this app actually serves: work.witus.online, one partner domain served from the same project, localhost and preview builds. If the setting names anything else, it writes one line to the server log saying so, naming the host and the correct value. The app still uses the setting, because that's my call to make. But the next time it says it lives somewhere it doesn't, the log will say so on the first request instead of waiting for me to notice a missing button.

## Why I didn't catch it sooner

Because everything worked. Pages loaded. Signing in with a password worked. The wrong address only showed up in places I don't look every day: an invite email I didn't send myself, a sitemap, a button that quietly wasn't there.

A wrong address doesn't crash anything. It sends people somewhere else, politely, and nobody tells you.

## What's still open

A second setting, `NEXT_PUBLIC_APP_URL`, is read by blog share links, shortlinks, engagement emails and public profile pages. Each of those falls back to an empty string when it isn't set. The helper that made this fix reported it as unset. I haven't confirmed that on the Vercel project myself, and it wasn't part of this change. If it is unset, those links are broken in the same quiet way. It's next.

## Where it stands

The code change is merged. By the time I wrote this, the live login page carried `appOrigin: https://work.witus.online`, and the sitemap listed work.witus.online addresses. What's left is mine: clicking **Sign in with WitUS** on the live page and finishing a sign-in, which closes the task.

## What this cost

The helper that found every use of the setting and built the helper and the warning took about 5.31 credits of Claude usage over 76 responses, roughly $5.31. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helper's session transcript. That helper also fixed the help-article sync on the same branch, which is the next post, and its cost isn't split between the two. Not counted: the main session that read the live page and coordinated the work, writing this post, and my own time.

## What I would carry

- **Splitting an app copies its settings too.** After a split, read every inherited setting and ask whose value it is.
- **A safety check that hides things needs a voice.** The button hid correctly and said nothing. Now the server says something.
- **One place decides the app's address.** Twenty-four copies of a fallback were twenty-four chances to be wrong.
- **`NEXT_PUBLIC_` values are fixed at build time.** Change the setting, then redeploy.
- **Wrong addresses fail quietly.** Check the things you don't see every day: emails, sitemaps, share links.

## References

Vercel. (2026, August 25). *How to use environment variables in Next.js*. Next.js documentation. Retrieved November 6, 2026, from https://nextjs.org/docs/app/guides/environment-variables
