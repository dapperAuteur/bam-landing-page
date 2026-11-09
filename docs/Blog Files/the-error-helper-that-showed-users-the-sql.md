<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Error Helper That Showed Users the SQL
Slug:    the-error-helper-that-showed-users-the-sql
Excerpt: In May I asked for graceful, traceable error handling in my coaching app. The session
         delivered request ids, a consistent error shape and an error notice component, and it
         also made every route return the raw error text to the browser, because that was the
         helpful thing to do for the operator. On the public waitlist, a database failure would
         have come back as the insert statement with the visitor's email in it. Third of three
         posts on the audit's security findings, with the fix and its cost.
Tags:    Security, Centenarian Coach, Error Handling, Next.js, Learning in Public
PUBLISH ONLY AFTER: witus task 155 is merged and all three production deploys are green, #193, #194 and #195 are live, and BAM has read it.
-->

# The Error Helper That Showed Users the SQL

Third and last of the posts going through [the error-handling audit's](/blog/an-error-audit-found-two-open-doors) security findings. The first two were about sign-in: [a check that never ran](/blog/every-page-was-public-for-fifteen-months) and [a login that would send you anywhere](/blog/the-login-page-that-would-send-you-anywhere). This one is about what an app says when something breaks, which was the audit's actual subject.

The app is Centenarian Coach, the multi-agent coaching app that is also the home of The Story of Fit T. Cent. It has a public waitlist and a chat.

## The bug class

Information exposure through an error message. The app caught every unexpected error in its API routes and returned the error's own text to the browser. Error text from a database library includes the statement it tried to run and the values it ran it with. Error text from a model provider can include the prompt. OWASP's error-handling cheat sheet: "Using error messages that do not provide implementation details is important to avoid information leakage." (OWASP Foundation, n.d.).

On the public waitlist, a database failure would have come back to the visitor as the insert statement for the waitlist table with their own email address as a parameter. It's their own email, so the direct harm is small. But the response also told anyone who could trigger an error which database library I use, what my table is called and what I store in it, and the same helper served the coach chat, where a provider failure streamed the provider's raw error into the conversation.

## How a reasonable session wrote it

This is the one that bothers me most, because the commit that introduced it was an error-handling improvement.

On 2026-05-31 I asked for graceful, traceable 400 and 500 handling in this app. The session, co-authored with Claude Opus 4.8, delivered a good day's work: a shared helper so every error response has the same shape, a request id in both the body and a response header so a user can quote it and I can grep for it, an error page, a global error page, a not-found page, a reusable error notice component, and all six API routes refactored through the helper. 329 lines added, 65 removed, 15 files, 47 tests green.

The helper's catch-all function logged the error with its request id and then returned a 500 whose message was the error's own message, with one level of underlying cause unwrapped and appended. The commit message explains why: one route had already been doing this, because the auth library wrapped its real failure (a missing table, a refused mail connection) inside a generic error whose message was just a class name, and unwrapping the cause was the only way for the operator to see what had gone wrong. The new helper made that behavior consistent, and the client side was wired "so users see the real server message and a request id they can quote for support."

Read that sentence from the operator's chair and it's right. The real message is what you want when you're the one debugging. Read it from a stranger's browser and it's the leak. The session took a debugging convenience that lived in one admin-facing route and, in the name of consistency, applied it to six routes, including the one public form on the site and the chat stream.

## What made it invisible

On the happy path, nothing is returned. The error text only appears when something is already broken, and the database behind the waitlist rarely fails. The 47 tests checked the response's shape, that it had an error field and a request id, not what the error field contained. Nothing in the app's own logs would look wrong, because the server log was supposed to have the detail; the problem was that the browser had it too.

And the audit only found it because it was reading error paths on purpose. It had been live five months.

## The fix

Two commits on a branch from main, 2026-11-06 (one of them a formatter pass), 184 lines added and 20 removed across four files, co-authored with Claude Opus 5.5. Merged to main.

The browser now gets a short generic message and the request id, in the body and the header, exactly as before minus the detail. The detail, cause included, goes to the server log under that request id, and on the way it passes through the text redaction the app's error tracking already used, which strips emails, URLs and keys. So even the server log no longer holds a visitor's address next to a failed statement.

The coach chat got its own small mapping. A provider rate limit or overload, by status code or by the SDK's own wording, becomes "The coach is busy right now." Anything else becomes a generic "couldn't finish that answer" message. The raw provider text never reaches the stream.

One thing the fix confirmed rather than changed: the waitlist insert already ignores a duplicate email, so a repeat signup was never an error in the first place and nothing had to be added for it.

A new test file covers the helper with five cases, including the one I care about: that a database-style failure with an email in it logs the failure mode and the cause with the email redacted, and returns none of it. Vitest 216 passed with 11 skipped (the skipped ones need a live key), type checks, lint and the production build green.

## What this cost

**To create:** cannot be priced. The commit is dated 2026-05-31. My transcripts on disk reach back about ninety days and my usage archive starts on 2026-08-27, so the session that wrote the error-handling pass isn't anywhere I can price it. If it were, the number would be the cost of the whole pass, which was mostly good work, and the leak was one design choice inside it. I'd rather say "unknown" than put a dollar figure on the wrong thing.

**To fix:** 2.01 credits over 45 responses, the largest of the three shares of the 4.68-credit helper that fixed all three security findings in one run, because this one needed the stream mapping and the redaction test as well as the helper change. A credit is 1 dollar of API list price (the price list of 2026-10-06), not what my subscription bills. Not counted: the audit itself (in [My 404 Page Lost Its Header](/blog/my-404-page-lost-its-header)), the coordinating session, writing this post, and my time.

## What I would carry

- **"Show the real error" is an operator's wish.** Give the operator the log and the user a message, joined by a request id.
- **Consistency spreads whatever it touches.** A helper that made six routes alike also made a public form behave like an admin page.
- **Test what the error field says, not that it exists.** The 47 tests passed because they never read the message.
- **Redact before logging, not only before responding.** The server log now gets the failure mode without the visitor's address.
- **The audit that catches this is a reading audit.** Error paths are where the code assumes nobody is looking.

## References

OWASP Foundation. (n.d.). *Error handling cheat sheet*. OWASP Cheat Sheet Series. Retrieved November 9, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html
