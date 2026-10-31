<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Smoke Test Failed 95 Times. It Never Once Saw My Site.
Slug:    the-smoke-test-never-saw-my-site
Excerpt: The end-to-end check that runs after every witus.online deploy failed from its first
         run in August until October 30. It was never testing the site. It was testing the login
         page Vercel puts in front of every deployment's own address. Even the commit that fixed
         it got the history wrong. Why a check that is always red is the same as no check.
Tags:    Testing, CI, Playwright, Vercel, GitHub Actions, WitUS
-->

# My Smoke Test Failed 95 Times. It Never Once Saw My Site.

On October 30 I fixed the end-to-end check for witus.online and wrote in the commit message that it had been failing "since 2026-10-28."

That was wrong. While writing this post I counted the workflow's runs from GitHub's history. It was added on August 16. Through the afternoon of October 30 it ran 127 times: 95 failures, 29 skipped, 1 cancelled, and 2 successes. Both successes came after the fix. It had never passed before that day.

I had looked at the last few runs, seen red, and guessed when it started. The real answer was "always."

## What the check was supposed to do

The workflow runs when Vercel tells GitHub a deployment finished. GitHub's deployment event carries the deployment's URL, so the tests can run against the real thing: real hosting, real environment, no database or secrets in CI. Preview deployments get the whole suite. Production gets a short list tagged `@smoke`: the health endpoint answers, the home page serves, and a visitor who is not signed in sees a **Sign in** link.

That last test has a history. witus.online once went months showing "Apps" where "Sign in" belonged, and it took two reports before I fixed it. I added the smoke test on October 16 so it could never quietly happen again. It never ran against the live site until October 30.

## What it was actually testing

The production job pointed its tests at the URL in the deployment event. That URL is the deployment's own generated address on `vercel.app`, not `www.witus.online`.

Vercel's Standard Protection covers every deployment except production domains, and the docs say that when you turn it on, "the production generated deployment URL becomes restricted" (Vercel, n.d.-a). So the runner asked for the health endpoint at that address and got Vercel's login page back. The test expected JSON and failed with the same line every time:

```text
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

That line is in the log of a failed run on August 16, the day the workflow was added. It is in the logs from September 2, October 15 and October 28 too. Same cause, two and a half months.

## Why nobody noticed

Because it was always red. A check that has never been green does not feel like news when it is red again. Every deploy got a red mark, every deploy still worked in a browser, and the red mark turned into wallpaper.

The worst part is that the fix was already written down. The workflow file's own header comment, from August, explained that Deployment Protection makes preview URLs answer 401 to the runner and said which secret to add. The note was right. Nothing enforced it, so nothing happened.

## The fix

Two changes, one per job.

**Production smoke tests hit the public domain.** The job now points at `https://www.witus.online`. Production domains are outside Standard Protection (Vercel, n.d.-a), so the runner sees what a visitor sees. One assumption, stated plainly: the job starts when Vercel reports the production deploy succeeded, and I am trusting that the domain already serves that deploy by then.

**The preview job checks for its key first.** Preview URLs really are protected, and that is correct. Vercel's Protection Bypass for Automation exists for this case: a secret sent in an `x-vercel-protection-bypass` header lets automated tests through (Vercel, n.d.-b). My Playwright config already sends that header when the secret is set. What was missing was the secret, and a clear message when it is absent. The job now starts with one step that fails with a single line naming the missing repository secret and where to create it in Vercel, instead of twenty test failures that each look like a different bug.

After the fix, the production smoke job passed on the next two deploys. The preview job fails with that one honest message until the secret is set.

## What I take from it

- **A check that is always red is not a check.** It tells you nothing on the day something really breaks, because it said the same thing yesterday.
- **When a test cannot reach what it is testing, fail before the tests, with the reason.** "Set this secret" is a five-minute fix. Twenty assertion failures against an HTML page look like twenty bugs.
- **Know which address your tests are hitting.** A deployment's own URL and the domain people visit can be protected differently. The test passed through the wrong door, and the door was locked.
- **A comment is not a guard.** The August note described the exact problem. Only a step that fails would have made it matter.
- **Count before you write the history.** My commit message said two days. The run history said two and a half months.

I wrote about a different gap in my tests in [2,085 Tests, and None of Them Opens the Front Door](/blog/what-my-tests-do-not-cover). This one is the same lesson from the other side: here the test did try the front door, and for two and a half months the door was Vercel's.

## References

Vercel. (n.d.-a). *Deployment Protection on Vercel*. Vercel documentation. Retrieved October 30, 2026, from https://vercel.com/docs/deployment-protection

Vercel. (n.d.-b). *Protection Bypass for Automation*. Vercel documentation. Retrieved October 30, 2026, from https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
