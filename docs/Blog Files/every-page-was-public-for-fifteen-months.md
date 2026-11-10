<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Every Page Was Public for Fifteen Months
Slug:    every-page-was-public-for-fifteen-months
Excerpt: FlashLearnAI's server-side sign-in check kept a list of public pages and matched them
         by prefix. The list included the home page, and every address starts with the home
         page's path, so every page counted as public from August 2025 to November 2026. Here is
         how the commit that caused it looked reasonable, why nothing noticed, what the fix
         changed, and what the fix cost. The cost of creating it cannot be priced, and I say why.
Tags:    Security, FlashLearnAI, Next.js, Error Handling, Learning in Public
PUBLISH ONLY AFTER: witus task 155 is merged and all three production deploys are green, #193 is live, and BAM has read it.
-->

# Every Page Was Public for Fifteen Months

In [An Audit for Error Messages Found Two Open Doors](/blog/an-error-audit-found-two-open-doors), I described three security bugs in general terms, without naming the apps, because the fixes weren't live yet. They are now. This is the first of three posts that go through each one in detail: the class of bug, how a reasonable session wrote it, what kept it invisible, the fix, and what the fix cost. I also tried to price the session that created each bug. For all three the answer is the same, and I explain it below rather than guess.

The first one is FlashLearnAI, my flashcard app. Its server-side sign-in check did not run for any page between 2025-08-03 and 2026-11-06.

## The bug class

Access control that is only enforced on the client. OWASP's first rule for preventing broken access control is short: "Except for public resources, deny by default." (OWASP Foundation, 2021). FlashLearnAI had the server-side check written. It was a Next.js middleware that reads the session token, keeps a list of pages anyone may see, and sends a signed-out visitor to sign in for everything else. The check existed, ran on every request, and never denied anyone.

## How a reasonable commit wrote it

The git history is clear about where it came from. On 2025-08-03, before this middleware was the version in production, the public check looked like this: the list of public paths was tested with an exact match, plus one explicit prefix rule for study-session pages, plus an explicit "or the path is the root" test. Verbose, but correct.

That afternoon a commit titled "add more comments for AppError" rewrote the middleware. It wasn't about access control; it tidied a logger and added an admin branch. In the rewrite, the three-part test became one line: is there an entry in the list that the current path starts with? The list kept its last entry, the root path, with a comment that the home page was assumed to be public.

Each part of that is sensible on its own. A prefix match is the natural way to make an entry like the blog cover every post under it. The home page is public. Put the two together and the root entry matches every address on the site, because every address starts with the root. The exact-match version had handled the root as a special case; the shorter version lost the special case without anyone noticing it was one.

Over the next fifteen months the list grew by hand: pricing, roadmap, explore, results, blog, about, contact, privacy, terms, profiles, teams, help, the claim page for students. Every addition "worked", in the sense that the page was reachable signed out. Every page was.

## What made it invisible

Three things, and none of them is a person being careless.

First, the admin pages stayed protected. The admin branch in the same middleware has its own check, by role, and it runs before the public list is consulted. So the one area where a wrong answer would have been loud kept giving the right answer.

Second, the app's signed-in pages protected themselves on the client. The dashboard layout notices there is no session and pushes the browser to the sign-in page. Open the dashboard signed out in a browser and you land on sign-in, which looks exactly like a working server-side check. The difference is only visible if you look at the first response: the audit's unauthenticated request for the dashboard came back 200 instead of a redirect. That one fact is what I verified. I did not verify what, if anything, a signed-out visitor could read during the moment before the client redirect, and I'm not going to guess in either direction.

Third, a second server-side gate failed with it. On 2026-02-28 a commit added a check that a new account had verified its email before using the app. It used the same "is this a public path" answer, so it never ran either. Nobody reported being blocked for an unverified email, because nobody was.

There was no test for the middleware. The app had 1,069 tests across 86 suites, and the one function that decides who may see what wasn't one of them.

## The fix

The fix is two small commits on a branch from main, made on 2026-11-06, 370 lines added and 30 removed across six files.

The public list moved out of the middleware into a module with no Next.js imports, so the middleware (which runs at the edge), the sign-in form (which runs in the browser) and the test suite all share one definition. Matching is now exact or by whole path segment: an entry for the blog covers the blog and its posts but not a page whose name merely starts with "blog", and the root entry covers only the root.

The test is a table of addresses in both directions, 209 lines of it: these must stay public, these must redirect, including look-alike names. Fixing the match surfaced eighteen public paths that had never been added to the list, among them the error pages, the changelog, the docs, the press page and static files. They had always loaded because everything loaded. With the match fixed and nothing else changed, they would have started demanding sign-in. They're on the list and in the table now.

The same branch closed a second hole the helper found while there. The sign-in form read the return destination from the address bar and assigned it straight to the browser's location after sign-in, which makes the sign-in page an open redirect. It now accepts same-origin destinations only. The server-side redirect carries a relative return path, and the dashboard layout's client-side fallback carries one too, so you land back where you were going.

Jest, type checks and lint were green. The production build compiled and type-checked; its page-data step stopped on environment variables the helper's worktree doesn't have, which is unrelated to the change and not a problem on the real build.

One thing to expect after the merge: the unverified-email gate now runs for the first time. Password sign-in already refuses unverified accounts and WitUS single sign-on accounts arrive verified, so nobody should be bounced. If someone is, that's the gate working.

## What this cost

**To create:** cannot be priced. The commit that introduced the bug is dated 2025-08-03. I price Claude Code work from session transcripts, and my transcripts on disk reach back about ninety days; the archive my usage report keeps for deleted transcripts starts on 2026-08-27. The session that wrote that commit, if there was one, is in neither place. I am not going to estimate it from the size of the diff; a number with no record behind it is worse than "unknown".

**To fix:** 1.46 credits over 38 responses, the FlashLearnAI share of a 4.68-credit helper that fixed all three security findings in one twenty-minute run on 2026-11-06. The split is by which repository each response's tool calls touched; 0.57 credits of that run was setup and cross-repo work I didn't assign to any one app. A credit is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Not counted: the audit that found it (counted in [My 404 Page Lost Its Header](/blog/my-404-page-lost-its-header)), the session that coordinated the fix, writing this post, and my own time.

## What I would carry

- **Match the root exactly.** Any prefix test needs a special case for the shortest prefix, and the shortest prefix is where it gets lost.
- **A client-side redirect hides a missing server-side one.** Check the first response, not what the browser ends up showing.
- **Test the gate, not just the pages.** A table of paths in both directions would have failed the day the one-liner landed.
- **Two gates on one answer fail together.** The email-verification check inherited the bug by reusing the public-path result.
- **Fixing a permissive check tightens things you never listed.** Expect to find public pages that were only public by accident.

## References

OWASP Foundation. (2021). *A01:2021 Broken access control*. OWASP Top 10:2021. Retrieved November 9, 2026, from https://owasp.org/Top10/A01_2021-Broken_Access_Control/
