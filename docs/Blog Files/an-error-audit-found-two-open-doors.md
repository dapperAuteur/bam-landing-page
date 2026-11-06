<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   An Audit for Error Messages Found Two Open Doors
Slug:    an-error-audit-found-two-open-doors
Excerpt: I asked for a read-only audit of how my apps handle errors. It was about forms and
         messages. It also found a sign-in check that never ran, two login pages that would send
         you anywhere they were told, and a waitlist that could show a visitor's own email inside
         a database error. All three are fixed. Reading error paths turned out to be a cheap
         security review.
Tags:    Security, Error Handling, Next.js, Learning in Public, WitUS
PUBLISH ONLY AFTER: witus task 155 is merged and all three production deploys are green, and BAM has read it.
-->

# An Audit for Error Messages Found Two Open Doors

In [My 404 Page Lost Its Header. So Did Twelve Other Apps.](/blog/my-404-page-lost-its-header), I wrote about a read-only audit of how 25 of my apps handle 400 and 500 errors. It was a user-experience audit. The questions were about forms that lose what you typed, raw error text on screen, and where you land after signing in.

To answer those questions, the reviewers had to read the code that runs when something goes wrong: the sign-in checks, the redirects after sign-in, the error responses. That code is also where security lives. Three findings in the report weren't user-experience problems. They were security bugs, and I fixed them before anything else in the audit.

All three are fixed. This post waits until the fixes are live in production before it goes up, and I'm describing them in general terms on purpose.

## A sign-in check that never ran

One of my apps decides on the server, before a page loads, whether you need to be signed in. It keeps a list of pages anyone may see: the home page, pricing, the blog, and so on. Everything else should send a signed-out visitor to sign in.

The list included the home page, and the check matched entries by prefix: "does this address start with something on the list?" Every address on a website starts with the home page's path. So every page counted as public, and the server-side sign-in check never sent anyone anywhere. A second server-side check, that a new account had confirmed its email address, never ran either, for the same reason.

What I've verified is narrow. On production, a signed-out request for the dashboard page came back with a normal 200 instead of a redirect. The page itself then noticed there was no session and sent the browser to sign in. I haven't verified what, if anything, a signed-out visitor could see before that happened, and I won't guess in either direction.

**The fix:** the home page entry now matches only the home page. Every other entry matches exactly, or as a whole path segment, so an entry for one page doesn't quietly cover a different page whose name happens to start the same way. The test is a table of addresses in both directions: these must stay public, these must redirect, including look-alike names.

Fixing it surfaced something I didn't expect. The old list had only worked because the home page entry covered everything. Eighteen public paths had never been added to it, among them error pages, the changelog, the docs and some static files. With the bug fixed and nothing else changed, they would have started demanding sign-in. They're on the list now, and in the test table.

## Two login pages that would send you anywhere

Most sign-in flows remember where you were going. You click a link to a page that needs an account, sign in, and land back on that page. The destination travels along with the sign-in, so the app reads it at the end and sends you there.

The question the app has to ask is: is that destination one of mine? Two of my apps didn't ask. After you signed in, they would follow whatever destination they were given, including another website.

That's an open redirect. The danger isn't to my app's data. It's to the person signing in. OWASP's description is the clearest one I've read: an attacker can point the destination "to a malicious site" and "may successfully launch a phishing scam and steal user credentials," and the link looks trustworthy because it starts with the real site's name (OWASP Foundation, n.d.-b). You sign in on my real login page, and then you're handed to a page that looks like mine and asks you to sign in again.

One of the two apps had a second version of the same mistake in another step of its sign-in. It built the destination by gluing text onto the end of the site's own address. Gluing text onto an address can change which host the address points to, and a check that only looks at how the result starts won't notice.

**The fix:** both apps now accept only destinations on the same site. Anything else falls back to the app's dashboard. One app already had a helper for exactly this, written for another feature and never used at sign-in; the fix reuses it instead of writing a new one. Tests cover the outside-site cases and confirm a normal same-site destination still works.

## A waitlist that could echo a visitor's email

The third finding came straight from the audit's real subject. One app's API returned the raw text of whatever error happened to the browser. On its public waitlist, a database failure would come back as the database's own error message, and that message includes the statement it tried to run, with the visitor's email address in it.

It's a smaller problem than the other two. The email belongs to the person who just typed it. But it's the textbook case of why OWASP says errors shown to users should avoid "implementation details," with "a generic response" to the user and "the error details are logged server side for investigation" (OWASP Foundation, n.d.-a). The raw error tells a stranger which database I use, what my tables are called and what I store in them. The same pattern elsewhere in that app sent a model provider's raw error into the chat.

**The fix:** the browser now gets a short, plain message and a request id. The full detail goes to the server log, with personal details scrubbed out by the same filter my error tracking already uses. If the model provider is busy, the chat says the coach is busy right now.

## Why an error audit found these

I didn't ask for a security review. I asked how my apps behave when something goes wrong. But "what happens when you're not signed in" and "where do we send you after sign-in" and "what do we tell you when the database fails" are error-path questions first. In my apps, the security bugs sat on the paths I had tested least, and those are the paths where something has gone wrong.

None of the three fixes was large. Each was a small branch with its own tests, checked by type checks, lint and the full test suite: 1,069 tests in the first app, 127 in the second, 216 in the third. The expensive part was knowing where to look, and reading the error paths told me.

The audit flagged two smaller items that aren't fixed yet. They're on my list and will get their own fixes.

## What this cost

The three fixes took about 4.68 credits of Claude usage over 106 responses, roughly $4.68. The audit that found them is counted in the previous post, so it isn't counted again. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from the helper's session transcript. Not counted: the main session that coordinated the work, writing this post, and my own time.

## What I would carry

- **Reading error paths is a cheap security review.** Sign-in checks, redirects and error responses are all error paths.
- **A prefix match on "/" matches everything.** Match the home page exactly, and everything else by whole segment.
- **Test the list in both directions.** A table of addresses that must stay public and addresses that must redirect.
- **After sign-in, go only to your own site.** Reuse the helper you already have.
- **Send the user a message, and send the log the details.** Raw errors belong in the server log, scrubbed.

## References

OWASP Foundation. (n.d.-a). *Error handling cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 6, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html

OWASP Foundation. (n.d.-b). *Unvalidated redirects and forwards cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 6, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
