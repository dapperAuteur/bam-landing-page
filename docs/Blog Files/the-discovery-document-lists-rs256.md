<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Discovery Document Lists RS256. The Key Set Holds One Ed25519 Key.
Slug:    the-discovery-document-lists-rs256
Excerpt: Chapter 07 of the Invest.WitUS tutorial is Sign in with WitUS: OpenID Connect written
         out in httpx and PyJWT, with no auth framework. The provider's discovery document was
         not where the spec says, and it lists an algorithm the provider never signs with. A
         client that trusts that list fails at the callback.
Tags:    Python, Django, OIDC, Learning in Public, Invest.WitUS
-->

# The Discovery Document Lists RS256. The Key Set Holds One Ed25519 Key.

Chapter 07 of the Invest.WitUS tutorial replaces the stub behind the header's "Sign in" link with the real thing: Sign in with WitUS, the ecosystem's identity provider, through OpenID Connect. [The previous post was the deploy](/blog/two-failed-builds-and-a-database-nobody-was-using); this chapter needed the production origin from it, because the provider matches redirect URIs exactly.

The chapter does the flow with no auth framework. Three HTTP calls with httpx, one signature check with PyJWT, and every check the standard asks for written where a learner can read it. That choice came out of two things the provider does that the spec does not predict.

## Not where the spec says

OpenID Connect Discovery says providers "MUST make a JSON document available at the path formed by concatenating the string `/.well-known/openid-configuration` to the Issuer" (OpenID Foundation, 2023). The issuer is `https://accounts.witus.online`. On October 28 that path answered 404 with the witus.online not-found page. The document lives at `/api/idp/.well-known/openid-configuration`, because the provider is better-auth's OIDC plugin mounted at `/api/idp`. Our integration doc had the spec's path as fact; it was corrected that day.

The client tries the spec's path first and the provider's path second, and refuses any document whose `issuer` is not the one configured.

## RS256 is listed and never used

The document's `id_token_signing_alg_values_supported` lists `RS256` and `EdDSA`. The key set at `jwks_uri` holds one key: `kty` `OKP`, `crv` `Ed25519`, `alg` `EdDSA`. There is no RSA key. The list says RS256 because the spec requires it to: "The algorithm RS256 MUST be included" (OpenID Foundation, 2023). The provider cannot sign with it.

So a client that reads the list and defaults to RS256 fails at the callback, after the person has signed in at the provider and been sent back. The ecosystem's NextAuth apps hit exactly that and now pin EdDSA. This client pins it too: `ALLOWED_ALGORITHMS` is a constant holding `EdDSA` and nothing else, checked on the unverified header before any key is fetched, and `none` is refused because it is not a signature. PyJWT's documentation says why it is a constant: "Do not compute the algorithms parameter based on the alg from the token itself, or on any other data that an attacker may be able to influence" (PyJWT contributors, n.d.). The discovery list is data the client fetched from the network. It goes in the same bucket.

## Why httpx and PyJWT, not Authlib

The plan had been Authlib's Django client. Its `parse_id_token` takes its allowed algorithms from the discovery document's list, so pinning EdDSA would have meant subclassing a client I did not write. And the point of the chapter is that a learner reads all six steps of the flow: out with `state`, `nonce` and a PKCE challenge; back with a code; the exchange with the verifier; the id token's checks; the person; the session.

PyJWT does the one part that should not be hand-written, the signature. It supports Ed25519 (PyJWT contributors, n.d.), and one `jwt.decode` call checks the signature, the algorithm, `iss`, `aud`, `exp` and the required claims, each failure with its own exception class. The `kid` lookup and the `nonce` check are the chapter's own code.

## A fake provider that signs real tokens

The tests do not mock the verification. `FakeIdp` makes a real Ed25519 key, publishes it as a JWK with a `kid`, serves the discovery document under `/api/idp/` and a 404 at the standard's path, like the live host, checks the client id, the secret and the PKCE verifier at its token endpoint, and signs a real id token with the nonce it was sent. It is an `httpx.MockTransport` handler plugged in through one module-level seam; nothing leaves the process. Each refusal is one override: a wrong `aud`, a wrong `iss`, an old `exp`, a missing `nonce`, an `alg` that is not EdDSA, a `kid` the key set does not have. The PKCE test uses the RFC's own worked example.

## The owner links by verified email, once

People are keyed by the WitUS user id, the `sub` claim, never by email. A `WitusIdentity` row is one-to-one with Django's user, and `sub` is unique. On a sign-in the rule runs in order: find by `sub`; else, only when the provider says the email is verified, link the one existing user that has no identity and whose email matches, which is how my superuser from chapter 05 links on its first sign-in; else make a new ordinary user with an unusable password. After that, email is not consulted again. A changed address updates the row and matches nothing. The rule was written in the decisions log before it ran.

## Off until the secret exists

The client is on exactly when `WITUS_OIDC_CLIENT_SECRET` is set. Without it, the sign-in route renders chapter 04's stub page and the site deploys as before. That is what let chapter 07 merge while the provider side, a registry entry and a minted secret in the witus repo, stayed a task on my side of the line.

## The lesson

An OIDC client that trusts the discovery list of algorithms fails at the callback. The list is what the spec requires the provider to say; the key set is what the provider can do. Read the key set, pin the algorithm to it, and treat anything fetched from the network as data the attacker might also control.

## What this cost

Building chapter 07 took about 13 credits of Claude usage. Writing this post took about 2.0 more: one helper wrote the posts for chapters 04 to 07 for 7.9 credits, and I split that evenly across the four. About 15 credits in all, roughly $15. A credit here is 1 dollar of API list price, which is not what my subscription bills. Counted from the helpers' session transcripts. Not counted: the main session that coordinated, reviewed and fixed the work, and my own time.

## References

OpenID Foundation. (2023, December 15). *OpenID Connect Discovery 1.0 incorporating errata set 2*. https://openid.net/specs/openid-connect-discovery-1_0.html

PyJWT contributors. (n.d.). *Digital signature algorithms*. PyJWT documentation. Retrieved October 28, 2026, from https://pyjwt.readthedocs.io/en/stable/algorithms.html
