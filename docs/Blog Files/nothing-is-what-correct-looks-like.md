<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   In a White-Label App, Nothing Is What Correct Looks Like
Slug:    nothing-is-what-correct-looks-like
Excerpt: I shipped a single sign-on feature across twenty-odd apps and found two
         bugs that had each rendered a feature completely inert. Neither would
         ever have been reported. In a multi-tenant product, "the button is not
         there" is the correct output on almost every hostname, so a bug that
         removes it everywhere produces exactly the screen you expected to see.
Tags:    Multi-Tenancy, Authentication, SSO, Testing, AI Agents, Engineering Judgment, WitUS
Series:  Building an Ecosystem With Agents (1 of 2)
-->

# In a White-Label App, Nothing Is What Correct Looks Like

The WitUS ecosystem is about twenty first-party apps sharing one identity provider. Three of them are multi-tenant: Learn.WitUS hosts white-label schools on their own domains, Stay.WitUS hosts hotels on theirs, RealEstate.WitUS hosts agencies. A school's learner at `bettervice.club` must never see a "Sign in with WitUS" button, and must never make so much as one HTTP request to `accounts.witus.online`. One request would reveal both that a shared backend exists and that somebody visited that school.

That rule is the reason the two bugs I want to describe survived. Not because it is complicated. It is four lines of code. Because of what it does to the shape of a correct screen.

If you are a white-label app, **the absence of the button is the right answer on almost every hostname you serve.** So is the absence of a network request. A bug that removes the button *everywhere* renders a screen identical to the one you were expecting to see. There is no error, no console warning, no failed request to notice, because a request that is never made looks exactly like a request you correctly suppressed.

I found two of these in one day. They had entirely different causes.

## Bug one: a feature that shipped, was documented, and had never once run

Learn.WitUS shipped a "silent SSO check" three days earlier. The idea is nice: when you land on the login page, don't make you type an email if the browser already has a WitUS session. Ask the identity provider in the background, and if there's a session, change the button from "Sign in with WitUS" to "Continue as Brand."

It was real work. Pure helper module, twenty-five unit tests, a design document, and a comment block more thoughtful than most production code I write. It had never worked in any browser.

The check was a credentialed cross-origin `fetch` to the IdP's session endpoint. Here is the entire diagnosis, and it took about forty seconds:

```
$ curl -i -H "Origin: https://learn.witus.online" \
    https://accounts.witus.online/api/idp/get-session

HTTP/2 200
content-type: application/json
(no access-control-allow-origin header)
```

The auth library emits no CORS headers anywhere in its core. A `grep` across the whole distribution finds five hits, all inside an unrelated plugin. So every browser fetched that response and threw it away unread.

Now the part that made it invisible. The source comment said:

> The probe carries the IdP's cookie as a THIRD-PARTY cookie, so it answers on Chrome/Edge and returns nothing under Safari ITP or Firefox Total Cookie Protection. That is fine and it is the design: a probe that answers nothing renders nothing.

Every clause of that is well-reasoned. Safari and Firefox really do block third-party cookies, the feature really is designed to degrade silently, and a probe that answers nothing really should render nothing. The paragraph is correct about everything except the one thing that mattered, which is that the "degraded" case was not one browser's behaviour. It was all of them.

**The feature had documented its own failure mode as an intended partial degradation.** That is what made it unfalsifiable. "The button says Sign in with WitUS" was a listed, expected, blessed outcome. There is no observation you could make on a Safari laptop that would distinguish the feature working as designed from the feature never having executed.

There was even a ticket. Someone, me, via an agent, had filed a task asking me to go add the missing CORS headers by hand, and the task correctly said the headers were *unconfirmed*. Then the feature shipped anyway, on the assumption they were probably fine. The uncertainty was written down and then outvoted by the momentum of a finished branch.

### The fix I did not make

The obvious repair, and the one my own ticket asked for, was to add CORS to that session endpoint for an allowlist of WitUS origins.

That endpoint returns the library's full session object, and the session object contains the **session token**. Adding credentialed CORS would have let every app in the ecosystem, and anything with a cross-site scripting foothold on any *one* of twenty apps, read a live identity-provider session token and impersonate the user everywhere.

The missing headers were the only thing that had ever protected it. **It failed closed by luck, not by design.** My ticket was a request to remove the accident that was keeping it safe. What shipped instead is a purpose-built endpoint that reads the same cookie and returns a display name and nothing else: no token, no session ID, no expiry, not even a full email address. It sends the name if there is one, otherwise the local part before the `@`, so "Continue as brand" cannot leak an address to another origin.

The lesson I'd draw is narrow and practical. When a ticket says "make X reachable from Y," look at what X *returns* before you decide who may reach it. And a thing that has never worked has also never been attacked, so a clean incident history tells you nothing about whether it was safe.

## Bug two: a gate that was right about the rule and wrong about the data

Later the same day I was adding the identical feature to Stay.WitUS. Its tenant gate ended like this:

```ts
return tenantOutcome === "none";
```

Show the WitUS button only if credentials are configured, and the request arrived on the branded host, and **no tenant resolved**. Above it, this comment:

> The tenant check is redundant today — the branded host should never be in `tenant_domains` — but it means that if it ever is, making the branded host serve a hotel, the button disappears rather than appearing on a white-labelled page.

The branded host is in `tenant_domains`. The seed script puts it there on line 42, registering `stay.witus.online` as a domain of the platform tenant. The database schema says so too, in a comment eighty lines above the one I just quoted: *"stay.witus.online itself is the seeded 'platform' tenant."*

So on the branded host a tenant always resolved, the outcome was always `"tenant"`, and the gate always returned false. The button rendered on no host at all. Dead on arrival, in code written that morning.

And again, invisible. On every hotel domain, no button is correct. On the platform host, no button is a bug. Same screen. There was even a passing test pinning the broken behaviour as intended:

```ts
it("HIDES when a tenant resolves on the branded host", () => {
  expect(shouldShowWitusSignIn({ ...base, tenantOutcome: "tenant" })).toBe(false)
})
```

That test is a perfectly reasonable thing to write if you believe the comment. Both the comment and the test were downstream of one unverified belief about what was in a database table.

## The design difference that made one app immune

Here is the part I actually want to keep. Three multi-tenant apps, three gates, and one of them could not have failed this way.

Stay and RealEstate both asked an **absence** question: *is no tenant present?* Learn asked a **presence** question:

```ts
const showWitusSso = isWitusBrandedHost(host) || tenant?.flags.ecosystemSso === true
```

Am I on a host I know is mine, or has this tenant explicitly opted in? Nothing about that can be broken by an unexpected row appearing in a table. A new seed, a new tenant, a new domain: none of it changes the answer. The absence-shaped gate, by contrast, is a promise about everything that is *not* in your database, and databases acquire rows.

The general rule I'd now apply to any per-tenant feature flag: **gate on a positive assertion you control, not on the absence of something you don't.** "This host is on my list" is checkable. "Nothing unexpected exists" is a claim about the whole world, and it silently becomes false the first time someone seeds a row.

The corrected Stay gate keeps the absence check but stops conflating two different things, because there are two kinds of tenant here and only one of them is a hotel:

```ts
return tenantOutcome === "none" || tenantOutcome === "platform"
```

An allow-list, deliberately, so that any outcome added later fails closed instead of inheriting permission. A hotel tenant is still refused, which was always the invariant that mattered.

## How it actually surfaced

Not by testing. I had an agent wiring the same gate into RealEstate.WitUS, which seeds its platform host the same way. It hit the problem, correctly adapted its own gate to admit the platform tenant, and then explained the divergence by asserting that Stay seeds no such row.

That was false, and it was the only reason anyone looked at Stay. **Its adaptation was right and its justification was wrong**, and I only found a two-hour-old bug because I checked a confident claim that turned out to be decoration on a correct decision.

I have started treating a delegate's *reasoning* as a separate artifact from its *output*, worth auditing even when the output is good. A right answer for a wrong reason is a right answer that does not generalise, and here it was pointing directly at a bug in a repository the agent had never opened.

## What I'd tell you to take away

Three times in one day I found a confident comment asserting something false: *answers on Chrome and Edge* (it answered nowhere), *the branded host should never be in tenant_domains* (it always is), and a third I'll spare you involving a product entry that justified its configuration by analogy to a sibling that had since been changed.

None of them were lies. All three were **true when written**. Nobody revisited them when the world moved, and each one had a test suite built on top of it that encoded the same stale premise, which is why the tests all passed.

The thread connecting them is not "write better comments." It is this:

**A feature whose failure mode is silence needs a test that it positively happened, not a test that it is correctly absent.** All three of these had thorough coverage of the absence case. That is the easy half, and in a white-label product it is also the half that passes when everything is broken.

For the multi-tenant SSO specifically, that means the test I was missing is not "does a hotel domain stay dark." It is "does the platform host actually light up," asserted against a database seeded the way production is seeded. I have that now, in all three apps. It took two lines.
