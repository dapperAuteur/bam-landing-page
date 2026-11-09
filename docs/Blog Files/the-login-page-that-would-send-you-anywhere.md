<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Login Page That Would Send You Anywhere
Slug:    the-login-page-that-would-send-you-anywhere
Excerpt: My tour manager app was the only one of 25 that sent you back where you were going after
         sign-in. It was also the one with an open redirect, for the same reason: the return path
         was read and followed, never checked. Seven months live. Here is how the first auth
         commit wrote it, the helper that sat unused a week before the fix, the fix itself, and
         the cost.
Tags:    Security, Tour Manager, Next.js, Error Handling, Learning in Public
PUBLISH ONLY AFTER: witus task 155 is merged and all three production deploys are green, #193 and #194 are live, and BAM has read it.
-->

# The Login Page That Would Send You Anywhere

This is the second of three posts going through the security findings from [the error-handling audit](/blog/an-error-audit-found-two-open-doors) one at a time. The first was [FlashLearnAI's sign-in check that never ran](/blog/every-page-was-public-for-fifteen-months). This one is Tour Manager, the app I built for touring musicians and their crews: advance sheets, itineraries, merch, travel.

In the audit's production check, Tour Manager was the only app of 25 that remembered where you were going and sent you back there after you signed in. I was pleased about that for a few hours. Then the audit noted that the same login page would also send you to any other website it was told to.

## The bug class

An open redirect: a page takes a destination from its address and sends the visitor there after doing its job, without asking whether the destination is its own. The danger isn't to the app's data. OWASP's cheat sheet puts it plainly: "This vulnerability could be used as part of a phishing scam by redirecting users to a malicious site." (OWASP Foundation, n.d.). The link starts with my real domain and lands on my real login page. After sign-in, the visitor is handed to a page that looks like mine and asks them to sign in again.

## How a reasonable session wrote it

The redirect was in the very first auth commit of the repository, on 2026-03-29, two minutes before three in the morning: login page, sign-up page, an auth callback route, middleware with session refresh and route protection, a dashboard, and four database migrations. 1,016 lines across 11 files, co-authored with Claude Opus 4.6.

Inside that, the return path was implemented the way every tutorial shows it. The middleware, when it bounces a signed-out visitor, writes where they were going into the sign-in address. The login form reads that value, falls back to the dashboard if it's missing, and pushes the browser there after a successful sign-in. The auth callback route, used when sign-in arrives by email link, does the same thing with one difference: it builds the destination by gluing the return path onto the end of the site's own origin.

Nothing in that is wrong as far as it goes. Both pieces read a value the app's own middleware had written a moment earlier. The missing question, "is this destination one of mine?", only matters when someone other than the middleware writes the value, and the session that wrote the feature at 2:40 am had no reason to think about who else might.

The gluing version is the sharper of the two. A destination that doesn't start with a slash can change which host the resulting address points to, so a check that only looks at how the final string starts wouldn't have caught it either. The fix had to look at the parsed path, not the text.

## What made it invisible

Every legitimate link is same-origin, so normal use never exercises the bad case. The feature did exactly what it was meant to for seven months, for every person who used it, which is the hardest kind of bug to notice: it has no failure mode you can stumble on. Tour Manager's test suite, 127 tests after the fix, didn't include where sign-in lands. Nothing logs the destination after sign-in, so there was no record to look wrong.

There is one more detail that stings a little. On 2026-10-29, a week before the audit, I added Sign in with WitUS to this app. That work needed the same "is this path ours?" check for its own return path and wrote a helper for it. The helper was correct, tested, and used in exactly one place: the new single sign-on flow. The older password and email-code sign-ins, three files away, kept following the raw value. The fix for the open redirect was mostly a matter of calling a function that already existed.

## The fix

One commit on a branch from main, 2026-11-06, 92 lines added and 2 removed across five files, co-authored with Claude Opus 5.5.

A small function decides where a password, email-code or email-link sign-in lands: the carried return path when the existing helper says it's a same-origin path, otherwise the dashboard. The login form and the auth callback both call it. Anything that isn't a same-origin path, including another host, a protocol-relative address or a path with a backslash where a slash should be, lands on the dashboard. A normal same-site destination still works, and I checked that specifically, because a fix that broke the one working return path in the ecosystem would have been a bad trade.

Two new test files cover the callback route and the destination function, with the outside-site cases on one side and a same-site destination on the other. Vitest 127 green, type checks, lint and the production build green. The fix is merged to main.

What the fix didn't do: the middleware drops the query string when it records where you were going, so you land on the right page but not with its filters. That's a usability item and it's on the list, not in this branch.

## What this cost

**To create:** cannot be priced. The commit is dated 2026-03-29. My session transcripts on disk go back about ninety days, and the archive my usage report keeps for deleted transcripts starts on 2026-08-27. The session that wrote the first auth commit isn't in either. Even if it were, the honest figure would be the cost of the whole auth-and-schema commit, 1,016 lines, not of the one unchecked line inside it, and I'd have to say so.

**To fix:** 0.64 credits over 15 responses, the Tour Manager share of the 4.68-credit helper that fixed all three security findings in one run. It was the cheapest of the three because the check already existed and only had to be called from two more places. A credit is 1 dollar of API list price (the price list of 2026-10-06), not what my subscription bills. Not counted: the audit (in [My 404 Page Lost Its Header](/blog/my-404-page-lost-its-header)), the coordinating session, this post, and my time.

## What I would carry

- **A return path is input.** Whoever wrote it a moment ago, somebody else can write it next time.
- **Check the parsed path, not the string.** Gluing text onto your origin can move the host; a "starts with slash" test is not enough.
- **When you write a safety helper, grep for the older code that needs it.** Mine sat a week, correct and unused, three files from the bug.
- **The feature that works best may be the one with no check.** The only working return path in 25 apps was the only open redirect.
- **A bug with no failure mode needs a test, because nothing else will find it.**

## References

OWASP Foundation. (n.d.). *Unvalidated redirects and forwards cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 9, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
