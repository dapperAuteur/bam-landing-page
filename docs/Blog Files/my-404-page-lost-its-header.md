<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My 404 Page Lost Its Header. So Did Twelve Other Apps.
Slug:    my-404-page-lost-its-header
Excerpt: A missing page on Learn.WitUS showed no header, no footer and no way to sign in. I asked
         for every app to keep them on error pages, then checked 24 live sites by asking each for
         a page that doesn't exist. Half failed. Then I asked the bigger question, how every app
         handles 400 and 500 errors, and found forms that erase what people typed.
Tags:    Next.js, Error Handling, UX, Learning in Public, WitUS
-->

# My 404 Page Lost Its Header. So Did Twelve Other Apps.

On November 4 I hit a missing page on Learn.WitUS. It said the page wasn't found, and that was all it said. No header, no footer, no **Sign in**, no menu. The only way out was the browser's back button.

That's a dead end for a visitor. Someone who followed an old link from an email is exactly the person who needs the header most: they don't know the site yet, and the page they wanted is gone. So I asked for one rule across the ecosystem: every app keeps its header and footer on 400 and 500 error pages.

## How the check worked

Learn.WitUS was already being fixed in another session, so the sweep covered everything else. The test is simple enough to run against production with nothing but `curl`: ask each live site for a path that doesn't exist, then look in the HTML for the header's Sign in link and a `<footer>`. For the two apps that build their pages in the browser, the same check ran in a headless browser. Then the helper read each app's error files: the not-found page, the error page, and the page shown when the whole app crashes.

24 live sites were checked.

## What it found

- **12 apps dropped the header, the footer, or both** on a missing page. One of them, Stream.WitUS, had no header or footer anywhere, home page included.
- **6 kept the shell on a 404** but had nothing behind it when something actually broke. Their crash page was the framework's default, or had no shell and no links.
- **5 passed** with a small fix: their last-resort crash page had no Sign in link.
- **My own blog passed.** Its header and footer were there. Its sign-in control says "Login" instead of "Sign in", which breaks a different rule on every page, not just this one.

The causes repeated. In Next.js, a not-found page only gets the header if it renders inside the layout that draws the header. Several apps put the header on some pages but not in the root layout, so the root not-found page had nothing around it. Two apps with language prefixes in their addresses sent unknown paths to a root page outside the language layout. My one Django app had no 404 template at all and showed Django's bare "Not Found".

The crash page is a special case. Next.js's documentation says the global error page "must define its own `<html>` and `<body>` tags" and "replaces the root layout" when it's active (Vercel, 2026). It can't use the app's header, because the header lives in the thing that just failed. So the rule asks less of it: the app's name, a link home, and a Sign in link, drawn by the page itself.

## The fix

21 branches, one per app, plus one in the witus repo that holds the rule itself and witus.online's own fix. Each error page now has:

- the app's real header and footer, or a minimal one for the crash page
- exactly one heading, a plain message, and a link home
- no stack trace and no raw error message, only an opaque id I can match to the server log

Five apps got a smoke test that runs against production after each deploy and fails if a missing page loses its Sign in link or footer.

Stream.WitUS was skipped by the sweep, because you can't keep a header that doesn't exist. I asked for one. It now has a site header with **Sign in**, a footer, error pages inside both, and a signed-out visit to a dashboard page goes to sign in and comes back to that page afterward.

## Then the bigger question

A 404 page is the easy case. On November 6 I asked the real one: does every app handle 400 and 500 errors gracefully? Not just pages, but forms, chats, uploads, and sign-in.

That was a read-only audit of 25 apps. A helper and four reviewers read the code, counted patterns, and cited the file and line for each finding only after reading it. It also sent unauthenticated requests to protected pages in production to see where a signed-out visitor ends up.

**Forms that erase what people typed.** In four apps, a failed submit clears the form. The worst is in Tour Manager OS: the public advance sheet a promoter fills in, about 40 fields, resets on any error. A fifth app does something different and arguably worse: when saving fails, it says "Mission saved!" and quietly queues the failed save. The audit inferred the resets from the code and React's documented behavior. Nobody has watched one happen in a browser yet.

**Raw vendor errors on screen.** In two apps the help chat, used by every signed-in person, prints Google's entire error response in the chat bubble. Other apps show raw text from the email service, the image host, or a market-data provider, some of it on forms the public uses.

**Getting back after signing in.** Of the apps checked, one sends you back to the page you were on after you sign in. The rest drop you on a home page.

The audit sized the work per app: 3 large, 7 medium, 14 small, 1 already clean.

## What I'm proposing

Not 25 separate fixes. One shared set of pieces copied into every app, the same way my analytics setup is shared: a server helper that returns one error shape, a browser helper that reads it, one error message component, a form hook that keeps what people typed (taken from RideWitUS, which already does this right), and a script that counts the bad patterns in every repo and fails if a count goes up.

The estimate for the shared pieces plus the data-loss and raw-error fixes is about 128 credits expected, somewhere between 50 and 320. The whole program is about 327 expected. That's a decision for me to make, not a merge (witus task 154).

## The rule now

The rule started as "error pages keep the header." It's now "every 4xx and 5xx is handled gracefully": a 401 sends you to sign in and back; a 403 says you don't have access and names who to ask; a 400 or 422 shows the problem next to the field in plain words; a 429 says to wait, with the wait if it's known; a 5xx keeps what you typed and offers Try again; and a vendor's raw error never reaches a screen that isn't an admin tool.

## Where it stands

The 22 error-page branches are waiting for me to merge them (witus task 153), and Stream's site shell has its own merge (Stream task 25). The audit is written. The fix wave waits on my approval.

## What this cost

About 35.77 credits of Claude usage, roughly $36: the error-page sweep across 22 repos was about 8.84 credits over 156 responses, Stream's site shell about 5.03 over 85, and the audit about 21.90 over 507 (its lead plus the four reviewers it started). A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from each helper's session transcript. Not counted: the main session that coordinated the work, writing this post, and my own time.

## What I would carry

- **Error paths are product surface.** The person on a 404 page is often a newcomer with a stale link.
- **Check it the way a visitor meets it.** One request for a missing path, on production, told me more than reading 24 layouts.
- **The crash page can't borrow the layout.** Give it its own minimal header.
- **A failed submit must never cost what someone typed.**
- **Fix the pattern once.** The same five mistakes in 25 apps is one shared module, not 25 projects.

## References

Vercel. (2026, October 15). *error.js*. Next.js documentation. Retrieved November 6, 2026, from https://nextjs.org/docs/app/api-reference/file-conventions/error
