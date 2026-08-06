<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Sign-In Broke Twice in July. The Fix Was a 158-Line Script.
Slug:    outage-to-invariant
Excerpt: Two production outages, same root cause: a registry saying one thing
         while the runtime believed another, and the link between them living
         in a comment. Here is the postmortem, the decision point most teams
         get wrong, and the tiny script that made the third outage impossible.
Tags:    Postmortem, Reliability, CI, OIDC, SSO, Engineering Judgment
-->

# Sign-In Broke Twice in July. The Fix Was a 158-Line Script.

I run the identity provider for my own product ecosystem: one "Sign in with WitUS" service that around nineteen first-party apps authenticate through. In July it broke twice. Same class of failure both times, real users locked out both times, and the second one was my fault in a way the first one was not, because after the first outage I fixed the instance and left the class alive.

This is the postmortem, and the small piece of engineering that came out of it. I am writing it up because the fix pattern generalizes to any system where two sources of truth are supposed to agree and nothing makes them.

## What users saw

A user clicks "Sign in with WitUS" on one of my apps and gets an OIDC error page: `invalid_client`. No stack trace in my logs at first glance, because nothing crashed. The identity provider did exactly what it was told: it looked up the client id the app presented, found no registered client, and correctly refused. Every component behaved. The system failed.

## The root cause: an assertion that lived in a comment

Two files in my platform repo describe the ecosystem. `lib/products.ts` is the canonical product directory: every product, its status, its URL, and, for products that use single sign-on, a declaration that says so. `lib/identity/clients.ts` is the OIDC client registry: the allowlist of clients the identity provider will actually talk to.

A product declaring SSO in the first file is asserting that a matching entry exists in the second. For months, that assertion was enforced by nothing but a code comment and my memory. It got worse: the two files used different slugs for the same product. The directory said `flashlearnai`; the client registry said `flashlearn`. The directory said `witus-triage-agent`; the registry said `triage`. A human eyeballing both files could not diff them mentally, because nothing on either side said which row matched which.

So the failure mode was quiet and structural. Add a product, declare SSO, forget the second registry (or register it under a slug the other file does not know about), ship. Nothing fails at build. Nothing fails at deploy. The first signal is a real person hitting `invalid_client` on a live app.

## Why it happened twice

After the first outage I did the obvious thing: registered the missing client, verified sign-in, moved on. That is an instance fix. The class of bug (registries can disagree and nothing notices) survived untouched, and three weeks later it fired again through a different product.

That second outage is the interesting one, because it removed my ability to pretend this was bad luck. A failure that recurs through a different instance is not an accident. It is a property of the system. The honest description of my architecture at that point was: sign-in works only while a human remembers to keep two files consistent by hand.

## The decision point

There were three ways to respond, and I think most teams pick the wrong one by default.

Option one: write it down. Add a checklist item, a doc, a comment in bigger letters. Cheap, feels responsible, and does nothing, because the failure already survived the existing comment. Documentation asks future humans to be more careful than past humans were. Past humans included me, twice.

Option two: merge the registries. One file, no drift possible. I considered it seriously and rejected it because the two files have different jobs, different consumers, and different security postures. The product directory feeds public pages. The client allowlist feeds the identity provider. Collapsing them couples things that change for different reasons.

Option three: keep both files, make the link explicit, and make disagreement fail the build. That is what shipped. Each SSO product's directory entry gained an `oidcSlug` field naming its client registry entry, so the mapping is data instead of tribal knowledge. Then a 158-line script, `check-registries.mjs`, loads both registries and asserts the linkage in both directions: every product claiming SSO maps to a real client, every client belongs to a real product. It exits non-zero with a message that explains itself, and it runs in the pre-commit hook and in CI.

The class of outage is now unrepresentable. Not discouraged, not documented against. Unrepresentable: the commit that would cause it cannot land.

## What it cost and what it caught

The whole fix was an evening: the schema field, the script, and backfilling the slug links, which itself flushed out one product claiming SSO with no client. The check has since blocked drift I would never have noticed, silently, at commit time, which is the point. A guard that works looks like nothing happening.

It also changed how I add products. Registering a new SSO client is now a mechanical, verifiable step instead of a remembered one, which matters in an ecosystem where products join monthly.

## The pattern, and where it spread

The generalization I would offer any team: when a postmortem's root cause is "two things were supposed to agree," the fix is not a better memory. It is a cheap, specific check that runs where the mistake would be made and fails loudly. My rule for these guards is that each one should be small, should test exactly one invariant, and should explain itself in its failure message.

That shape has since spread through the ecosystem: a companion script asserts that deployed environment variables match the client registry, another asserts analytics configuration conformance across repos, my learning platform enforces tenant isolation with a test suite that fails the build on any unscoped database read, and my media app's spoiler gate has a test that fails if any route imports the raw database client. None of these is clever. All of them are load-bearing.

Two outages bought me a design principle I now apply by default: every "X must match Y" in a comment is a check that has not been written yet.
