<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Renamed a Thing That Wasn't a Name, and Broke Sign-In
Slug:    renaming-broke-sign-in
Excerpt: A rename touched one field that looked cosmetic and wasn't. A script I
         wrote after two outages caught it before anyone hit it, then caught my
         fix for the fix. Three lessons about identifiers, and about guards that
         only work if you run them.
Tags:    Postmortem, Identity, OIDC, SSO, Engineering Judgment, Beginners
-->

# I Renamed a Thing That Wasn't a Name, and Broke Sign-In

I renamed a product. One of the fields I updated looked like a label and was actually an address — the same trap I'd [already written about](/blog/rename-names-vs-addresses) earlier in the same rename.

This time it would have broken single sign-on across my ecosystem. It didn't, because a script I wrote after two real outages caught it. Then I wrote a fix, and the same script caught *that* too.

It's a small story with three separate lessons in it, and the last one is about me.

## What single sign-on actually is

You've used this. You click "Sign in with Google" instead of making yet another password.

Behind it, two systems talk. One is the **identity provider** — the thing that actually knows who you are. The other is the **client** — the app you're trying to get into. In my case I run both: my identity provider lives at one address, and about nineteen apps authenticate through it.

For this to be safe, the identity provider can't just take an app's word for who it is. So every app is registered in advance with two things:

- A **client id** — the app's name in this conversation. Not secret.
- A **client secret** — a long random string only that app and the provider know. This is the actual proof.

When you click the button, the app says *"I'm `witus-wanderlearn`, here's my secret, send the user back to me at this exact address when you're done."* The provider checks its list. If the id isn't on it, the whole thing stops with an error called `invalid_client`.

That last part — the address to come back to — is called the **redirect URI**, and it matters more than it sounds. Without it, anyone could start a sign-in and ask for the answer to be delivered somewhere else. So providers only accept addresses registered ahead of time, and they compare them **exactly**. Not "close enough." A trailing slash is a different address. `www.` is a different address.

## The mistake

My product registry — one file listing every app in the ecosystem — had a field on the entry I was renaming:

```
oidcSlug: "wanderlearn"
```

I was changing the product's name, its web address, its display colour. This was in the same block. I changed it too.

It looks like a name. It is not a name. Two things are *derived* from it:

- The **client id**, built as `witus-` plus that value.
- The **environment variable holding the secret**, built as `WITUS_OIDC_SECRET__` plus that value in capitals.

So changing one word silently renamed the app's identity *and* pointed at a secret that didn't exist. The app in production would keep announcing itself by the old name. The provider would look for the new one. Nobody would find anybody.

Same lesson as the Cloudinary folder in the earlier post: **the question is never "does this word describe the thing?" It's "does anything outside my control already depend on this exact string?"** Here, two derived values and a running production deployment did.

## The part that makes it worse

There's a function that assembles the list of apps the provider trusts. It reads each app's secret from the environment, and if the secret is missing it does this:

> skip that app entirely

No error. No warning. No log line. The app simply isn't on the list any more.

That's a defensible choice — an app mid-setup shouldn't crash the identity provider for everyone else. But it means my mistake had no symptom at deploy time. The build passes. The site comes up. Everything is green. The failure surfaces later, as a real person clicking a button and getting `invalid_client`.

I have a strong bias now: **when a system's response to missing configuration is "quietly do less," find out how you'd notice.** Usually you can't, and that's the thing to fix.

## The script that caught it

I didn't notice any of this by being careful. A script did, and I'd written that script for exactly this reason.

Sign-in broke twice in July. Both times the cause was the same shape: two registries that were supposed to agree, and nothing checking that they did. One file said an app had SSO; another file was the actual list. They drifted. Users found out first.

So I wrote a checker that reads both and complains. When I renamed the field, it said:

> ✖ ERROR product "wanderlust" points at oidcSlug:"wanderlust", which is NOT in ECOSYSTEM_APPS. buildTrustedClients() would skip it, so sign-in for this product fails with invalid_client while the directory advertises it as an SSO surface.

That's the whole bug, in advance, in English, naming the function that would have swallowed it. Fifteen minutes of writing a script in July paid for itself completely.

## Then it caught my fix

Here's the bit I find most useful.

My first fix was to register a client under the new name. Sensible-sounding, and still wrong — because the *deployed* app doesn't know about my code change. It's out there right now, announcing the old name, and it will keep doing that until someone updates its configuration and redeploys it. If I renamed the entry, there'd be a window where the running app's identity didn't exist.

So the correct move was to register **both** temporarily — new one added, old one kept — and retire the old one only after the app was actually switched over and a real sign-in had been seen working. Expand, then contract. Never a moment where nothing matches.

I did that, and the checker went green with one warning: an old client no longer pointed at by any product. Which is the correct description of a deliberately transitional state.

Then the person I was doing this for made a better call than mine: **don't rename it at all.**

He was right, and I should have proposed it. That field is the client's identity, not the product's name. Renaming it meant minting a new client, issuing a new secret, and re-pointing a deployment — during a domain move — to change a string no user will ever see. All cost, no benefit. The best fix was the change I shouldn't have made.

## The one thing that did have to change

One real problem survived that revert, and it's the kind that's easy to miss because it fails *later*.

The app is moving to a new web address. The redirect URI — the come-back-here address — is built from that. Compared exactly, remember. So the moment the new address went live, the app would start sending an address the provider had never been told about, and sign-in would fail with a `400`.

And it would fail **right after the domain move**, looking for all the world like the domain move broke authentication. The actual cause would be a registration file nobody had touched in a week.

The fix is small: register both addresses. Old and new, at the same time. Then the cutover needs no coordination at all — the old one works until the move, the new one works from the moment it happens, and no step has to land in a particular order.

**That's the shape of a good migration.** Not "do these five things in precisely this sequence and don't get it wrong at 11pm." Instead: make both states valid at once, move whenever you like, clean up later.

## Three things I'm taking from this

**Ask what's derived from a value before you change it.** Not what it means — what's computed from it, and who's already holding a copy. `oidcSlug` fed a client id and an environment variable name. Neither was visible from the line I was editing.

**Silence is not safety.** A system that skips misconfigured things instead of complaining will let a rename through without a murmur. If you can't tell the difference between working and quietly-not-working, that gap *is* the bug.

**A guard you don't run is a guard you don't have.** This is the one that stings. I wrote that checker. I wrote a whole post about the outage that prompted it. And I still pushed the broken change without running it — it caught me later, on a different machine, by accident.

The tooling was right, twice. The problem was that "remember to run the script" is not a mechanism. It's a hope. That script needs to be in the commit hook, and the fact that it isn't yet is now the actual finding here.
