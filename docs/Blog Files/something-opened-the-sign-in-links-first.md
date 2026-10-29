<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Something Opened the Sign-In Links Before Anyone Could
Slug:    something-opened-the-sign-in-links-first
Excerpt: Twice in one evening, a WitUS sign-in link was opened by a different computer
         within a minute of being sent, and the sign-in never finished. The likely reason
         is an email security scanner checking the link, which uses up a link that only
         works once. What the logs showed, what I can't prove, and what to do about it.
Tags:    Authentication, Security, Email, Debugging, WitUS
-->

# Something Opened the Sign-In Links Before Anyone Could

On October 29 a helper was reading WitUS request logs for a different sign-in problem. WitUS is the single sign-on under my apps. In those logs it found a second pattern, unrelated to the first, and I want it written down while it is still small.

## What the logs showed

WitUS signs you in with a magic link. You type your email, it emails you a link, you open it, you're in. The link works once and expires after five minutes, the default in better-auth, the library underneath (Better Auth, n.d.-b).

That evening, three links were requested from a Chrome on a Mac that wasn't the browser on my desk. Its network location changed between requests, the way it does behind a VPN or a privacy relay. Asking for a link does nothing on its own. The link goes to the inbox of the address typed, not to the browser that asked.

Two of those links were then opened 25 to 60 seconds after they were sent. Not by that Mac. By a Chrome on Windows that had none of the cookies the sign-in page had just set in the browser that asked. Each one went through the verify step, bounced to the sign-in page, and stopped there. No sign-in finished from either link.

## Why that breaks a link that works once

In better-auth, the link points at a `GET /magic-link/verify` address, and that address spends the token on the first request it sees. The docs say verification "consumes the token atomically on the first attempt" and that a second try fails with an invalid-token error (Better Auth, n.d.-b).

So whoever opens the link first wins. If that is software checking the link for the person, the person arrives a minute later to a dead link.

Software like that exists, and it is normal. Microsoft's Safe Links, part of Defender for Office 365, scans URLs in incoming mail before delivery, checks them again when they are clicked, and says that "URLs that don't have a valid reputation are detonated asynchronously in the background" (Microsoft, 2026). A brand new sign-in link on a small domain has no reputation.

## What I can and can't say

The timing and the stranger browser match a scanner opening the link to check it. That is the likely explanation, not a proven one. The same log lines would appear if a person read the email on a Windows machine and clicked it there. I don't know which scanner it was, or whether it was one at all, and I won't guess a vendor from a user-agent string. What I can say: something other than the browser that asked spent the links, and the sign-in failed because of it.

## If you are the one signing in

- **Open the link in the same browser you asked from.** The app you started in left short-lived cookies in that browser to finish the sign-in when you come back. Open the link somewhere else and the last step fails, because that browser doesn't have them.
- **Open it right away.** Five minutes is the default life of the link.
- **If it says the link is invalid, ask for a new one.** Clicking the old one again won't help. It is already spent.
- **If it keeps happening on a work account,** suspect the company mail filter first, and tell whoever runs it.

## If you build sign-in like this

The fix is to make sure a plain GET can't spend the token. The usual ways:

1. **A confirm button.** The emailed link opens a page that says "Sign in as you?" with a button. The button sends a POST, and the POST spends the token. A scanner that only fetches the page uses up nothing.
2. **A short code typed by hand.** Email a six-digit code instead of a link. There is nothing for a scanner to click. better-auth ships this as an Email OTP plugin, with a six-digit code, a five-minute life and three tries by default (Better Auth, n.d.-a).
3. **Both.** Send the link and the code in the same email, and let the person use whichever works.

Each costs something. The confirm page is one more click for everyone. The code is more typing. Doing nothing costs a confused person every time a scanner gets there first.

## What I'm doing about it

Nothing yet, on purpose. It hasn't happened to my own sign-ins, so it is a watch item. If my links start failing the same way, the first move is the confirm button, because it keeps the flow people know. If that isn't enough, the code goes in the same email.

## What this cost

The log reading was part of a bigger sign-in investigation by a separate helper: about 2.6 credits of Claude usage, roughly $2.64. Writing this post and its companion, on why "Continue as you" can't work across sites, took about 1.9 credits, roughly $1.90. Both are split evenly between the two posts, so this one carries about 2.3 credits, roughly $2.27, counted from the helpers' session transcripts. A credit is 1 dollar of API list price, not what my subscription bills. The main session and my own time are not in it.

## References

Better Auth. (n.d.-a). *Email OTP*. Better Auth documentation. Retrieved October 29, 2026, from https://www.better-auth.com/docs/plugins/email-otp

Better Auth. (n.d.-b). *Magic link*. Better Auth documentation. Retrieved October 29, 2026, from https://www.better-auth.com/docs/plugins/magic-link

Microsoft. (2026, October 14). *Complete Safe Links overview for Microsoft Defender for Office 365*. Microsoft Learn. https://learn.microsoft.com/en-us/defender-office-365/safe-links-about
