<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Why "Continue as You" Can't Work Across Sites
Slug:    continue-as-you-cannot-cross-sites
Excerpt: CentenarianOS asks WitUS "who is signed in?" so it can show a "Continue as"
         button. The answer is always "nobody", because the browser won't send the WitUS
         cookie on a background request from another site. A redirect carries it. Same-site
         versus same-origin, SameSite=Lax, the three options I parked, and the sign-out
         lesson from the same night.
Tags:    Authentication, Cookies, Web Development, Single Sign-On, WitUS
-->

# Why "Continue as You" Can't Work Across Sites

On October 29 I asked a helper why "Sign in with WitUS" didn't recognize me when I was signed in to three of my apps. Most of the answer was my own doing; that's at the end. One piece was a small feature that can never work where I put it.

## The feature

WitUS is the single sign-on under my apps, at accounts.witus.online. Some apps show a "Continue as" button with your name on it. To fill in the name, the app's sign-in page makes a quiet background request to WitUS: who is signed in here?

WitUS answers from its session cookie. That cookie is set with `SameSite=Lax`, HttpOnly and Secure, and it belongs to accounts.witus.online only.

On Outbox, which lives at outbox.witus.online, the question works whenever there is a session to find. On CentenarianOS, which lives at centenarianos.com, the answer is always "nobody". Not sometimes. Always.

The name is only a label. Clicking the button runs the real sign-in, and only that proves who you are.

## Same origin and same site are different questions

An origin is the scheme, the host name and the port, all three, and two pages share an origin only when all three match (MDN contributors, 2025). So outbox.witus.online and accounts.witus.online are different origins. The host names differ.

A site is looser. It is the registrable domain: the public suffix, like `.online` or `.com`, plus the one name just before it (MDN contributors, 2026b). Both of those hosts are on the site witus.online, so they are same-site. centenarianos.com is a different site.

They guard different things. Whether a page may read a response from another origin is up to CORS, and WitUS lets my apps' origins read it. Whether the browser attaches the cookie at all is up to the cookie's SameSite setting, and that looks at sites.

## What Lax allows

MDN puts `SameSite=Lax` like this: send the cookie on requests from the same site, and on cross-site requests only when the request is a top-level navigation, meaning "the request causes the URL shown in the browser's address bar to change," and uses a safe method such as GET (MDN contributors, 2026a).

Now the two requests:

- **The "Continue as" check** is a background fetch from centenarianos.com to accounts.witus.online. Cross-site, and the address bar doesn't change. No cookie. WitUS sees a stranger and says "nobody". It is answering correctly.
- **Sign in with WitUS** sends the whole browser tab to accounts.witus.online. That is a top-level GET. Lax lets the cookie through, WitUS sees the session, and sends you back signed in.

So the button works and the label on it can't. From outbox.witus.online the same fetch is same-site, so the cookie goes along and the label works there.

## The three options I parked

1. **A top-level `prompt=none` redirect.** OpenID Connect lets an app send the browser to the sign-in server with `prompt=none`, which means "don't show anything, just tell me." If you aren't signed in, the server answers with an error such as `login_required` instead of a page (Sakimura et al., 2023). Because it is a redirect, the cookie goes along. The cost is a trip away from the sign-in page every time it loads, mostly to be told "no". Wanderlust used to do exactly this, and on August 30 I replaced it with the background check for that reason.
2. **Move the app under witus.online.** As a witus.online subdomain, CentenarianOS would be same-site and the check would just work. It also gives up a domain the app already has.
3. **Drop the check on CentenarianOS.** The button still works. It just says "Sign in with WitUS" instead of your name.

None is urgent. It's a backlog choice for the next time CentenarianOS's sign-in page gets work.

## The bigger lesson from that night

WitUS didn't know me for a reason that had nothing to do with cookies. That evening I had pressed "Sign out" in Inbox, and later in Outbox. Both ran a global sign-out, my own decision from August: leave the app, then end the WitUS session too. It did exactly that. But Learn.WitUS, CentenarianOS and Wanderlust keep their own sessions, and nothing told them, so they still looked signed in while WitUS wasn't. The next "Sign in with WitUS" showed a login page, and I read it as a bug. The global sign-out was half built. I chose the plain fix. "Sign out" means this app only, and a separate button, "Sign out of WitUS everywhere", ends the WitUS session on purpose, with a name that says what it does. That change is going into the apps now.

## What this cost

The investigation was a separate helper's full sign-in diagnosis: about 2.6 credits of Claude usage, roughly $2.64. Writing this post and its companion, on sign-in links opened before the person could, took about 1.9 credits, roughly $1.90. Both are split evenly between the two posts, so this one carries about 2.3 credits, roughly $2.27, counted from the helpers' session transcripts. A credit is 1 dollar of API list price, not what my subscription bills. The sign-out change, the main session and my own time are not in it.

## References

MDN contributors. (2025, November 30). *Origin*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Glossary/Origin

MDN contributors. (2026a, September 1). *Set-Cookie header*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie

MDN contributors. (2026b, January 5). *Site*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Glossary/Site

Sakimura, N., Bradley, J., Jones, M., de Medeiros, B., & Mortimore, C. (2023). *OpenID Connect Core 1.0 incorporating errata set 2*. OpenID Foundation. https://openid.net/specs/openid-connect-core-1_0.html
