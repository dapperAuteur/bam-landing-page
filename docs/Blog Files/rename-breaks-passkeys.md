<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Changing My Web Address Will Break Every Passkey. There Is No Fix.
Slug:    rename-breaks-passkeys
Excerpt: Some consequences aren't bugs you can engineer around, they're the
         security guarantee working correctly. Moving my app to a new domain
         destroys every passkey on it, and the tempting workaround would have
         opened a real hole. Explained from zero.
Tags:    Security, Passkeys, WebAuthn, Authentication, Engineering Judgment, Beginners
-->

# Changing My Web Address Will Break Every Passkey. There Is No Fix.

I'm moving an app to a new web address. Same app, same database, same accounts — new name over the door.

When it happens, every passkey anyone has set up for it will stop working. Permanently. There is no migration, no compatibility mode, no clever workaround. Everyone with a passkey re-registers from scratch.

I want to explain why, because it is a genuinely nice example of something people find counterintuitive: **this isn't a flaw. It's the feature working.** And the obvious way to avoid the pain would have opened a security hole in my own ecosystem.

## What a passkey actually is

You've probably used one. It's when a site asks you to sign in and instead of typing a password you touch a fingerprint sensor, or look at your phone, and you're in.

Most people assume it works like a password that happens to be stored in your fingerprint. It doesn't. It's stranger and much better.

When you create a passkey, your device generates **two matching keys**. Think of them as a lock and a key cut for each other, though it's the other way round from a real lock:

- The **private key** never leaves your device. Not to me, not to anyone. It cannot be stolen from my servers because it was never on my servers.
- The **public key** goes to me. It's useless on its own. All it can do is check whether something was signed by the matching private key.

When you sign in, my site sends your device a random puzzle. Your device signs it with the private key, after your fingerprint says it's really you. I check the signature against the public key I'm holding. If it matches, only your device could have produced it, so it's you.

This is why passkeys can't be phished. There is no secret you could be tricked into typing into a fake site, because there is no secret you know.

## The part that bites me

Now the important bit.

When your device creates that key pair, it stamps the website's address onto it. Permanently. Baked in.

Then — and this is the whole security property — your device will only ever offer that key back to **that exact address**.

That is what makes phishing impossible. If a scammer sets up a lookalike site at a nearly identical address, your device looks at the address, doesn't recognise it, and simply has nothing to offer. It doesn't warn you. It doesn't ask you to be careful. There's nothing to be careful about — the key for the real site is invisible to the fake one. Your device refuses on your behalf, before you get a chance to make a mistake.

Now read that again from my side.

I am changing my address. To your device, my app at the new address is **indistinguishable from a phishing site**. It's a different address asking for a key that was stamped for a different one. Your device does exactly what it was designed to do, which is refuse.

In my code the whole thing is one line, and the danger is how ordinary it looks:

```ts
// The address stamped onto every passkey, derived from the app's own URL.
// So changing the URL silently changes which passkeys are valid.
rpID: new URL(env.BETTER_AUTH_URL).hostname,
```

I can't override that. There's no setting. If I *could* override it, passkeys wouldn't work, because a scammer could override it too.

So: everyone re-registers. Password and email sign-in still work, so nobody is locked out. It's an annoyance, not an outage. But it's an unavoidable one, and the honest thing is to say so up front rather than let people discover it.

## The workaround that looked smart

There is a legitimate trick here, and I nearly used it.

The address rule isn't quite "exact match." A passkey can be stamped with a *parent* address instead of the specific one. If my apps live at `shop.example.com`, `learn.example.com`, and so on, I can stamp the key with just `example.com`. Then it works across all of them.

The appeal is obvious. My apps all sit under one family address. Stamp everything with the parent and no future move ever breaks a passkey again. One-time pain, permanent immunity.

I decided against it, and the reason took me a minute to see.

Stamping with the parent means the key becomes usable by **any** address under that parent. Not just the ones I have today. Any that ever exist.

And my ecosystem is heading somewhere specific: I'm building products where *customers* get their own addresses under my family name. A hotel's booking site. A shop's storefront. That's the business model.

Which means the moment I hand out a customer address under that parent, I have also handed that address the ability to ask for passkeys belonging to my *other* apps. A customer's site — or anyone who ever compromises one — could request a sign-in for an account on a completely different product.

I would have built a shortcut for myself and left a door open for everyone downstream of me.

So the keys stay stamped to the specific app address. Today's passkeys break once. If I move again, they break again. That is the correct trade, because the alternative isn't "no pain" — it's "pain moved somewhere I can't see it, landing on someone else."

If I do want passkeys that work across the whole ecosystem later, the right way is to put them at the single sign-in service that all my apps already trust, rather than scattering broadly-scoped keys across every product.

## The quieter one: everybody gets logged out

Same move, smaller consequence, worth knowing.

When you sign in, my server gives your browser a small note — a cookie — that says "this person is signed in." Your browser hands it back on every visit so you don't re-authenticate constantly.

Cookies are also address-scoped, for the same reason. A cookie issued by one address is not sent to another. Otherwise any website could read any other website's session and impersonate you everywhere.

New address, no cookie. Everyone is signed out once and signs back in.

I could widen cookies to the parent address, which would carry sessions across. I didn't, for exactly the reason above, and because everyone with a passkey is re-authenticating anyway.

## What I'm actually shipping

Three things, none of them clever:

1. **A notice in the app** explaining that passkeys need re-registering, on the screen where you'd hit it.
2. **Email sign-in stays available**, so the fallback is already there for anyone who only ever used a passkey.
3. **A written-down order of operations**, because the switch that changes the address also changes five other things at once, and doing them in the wrong order takes sign-in down rather than merely inconveniencing people.

That last one deserves a sentence. There's a single configuration value in my app that the address is read from, and *everything* downstream reads it: where sign-in sends you back to, what gets stamped on new passkeys, what web address goes in every email link, what search engines are told the canonical page is. One value, six consequences, all flipping in the same instant.

The dangerous version isn't flipping it. It's flipping it *before* the new address actually exists and answers. Then sign-in points at nothing, and there is no old address to fall back to, because I've already told the app the old one isn't home.

So the runbook says: create the address, prove it resolves, tell the single sign-on service about it, *then* throw the switch. In that order, checked off, no improvising at 11pm.

## The general lesson

Some consequences are bugs. You find the cause, you fix it, it goes away.

Some consequences are guarantees. The thing you're annoyed by is load-bearing, and every route around it removes the protection it exists to provide.

Telling those apart quickly is worth a lot. The tell is usually this: **if I could work around this, could an attacker work around it too?** If yes, you're not looking at a bug. You're looking at the reason the feature is worth having, and the correct response is to plan for the inconvenience and be straight with people about it.
