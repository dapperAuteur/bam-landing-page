<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   One Page of Commands for 24 Apps, and What Each One Is For
Slug:    one-page-of-commands-for-24-apps
Excerpt: I kept paying an AI helper to rediscover which command makes which secret and
         where the value goes. Now there is one written reference for the whole WitUS
         ecosystem. A walk through every command on it in plain words: what it does,
         when I reach for it, and the two traps that cost me the most.
Tags:    Developer Experience, Operations, Secrets, WitUS, AI Agents
-->

# One Page of Commands for 24 Apps, and What Each One Is For

The WitUS ecosystem is 24 repos that share one sign-in, one feedback inbox, one social outbox, and one set of rules. Task after task needs the same kind of answer: what makes this value, and which project does it go on? The answer kept being "ask Claude," and Claude would read three repos to work it out again. I was paying for the same research over and over.

So there is now one reference page, kept with the witus project, that lists every command I run across the ecosystem and every environment variable it creates. Here is what is on it and why each piece is there.

## The rule at the top: two homes

Almost every shared secret has two homes. One is the app's own Vercel project. The other is the witus.online project, which serves the sign-in server every app trusts. Setting only one side is the most common way things break. And after changing either side, redeploy it, because the sign-in server builds its list of trusted apps when it starts, and some apps bake public values in at build time.

## Generating secrets by hand

Some secrets are just random bytes. The reference gives three ways to make 32 of them, so I can use whichever tool is on hand:

```bash
openssl rand -base64 32
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

What matters is the randomness, not the tool. The page says which variable each one is for: `WITUS_SESSION_SECRET` for RideWitUS, where the signed cookie is the whole sign-in because the app has no database; `NEXTAUTH_SECRET` for the apps on NextAuth; `INBOX_INGEST_SECRET` and `OUTBOX_INGEST_SECRET`, which must hold the same value on the sending app and the receiver or every submission comes back 401. It also says what rotating each one does. Rotating a session secret signs everyone out.

## Minting a Sign in with WitUS client

`node scripts/gen-oidc-client.mjs <slug>` is the one I use most. It creates the ID and secret an app needs to offer "Sign in with WitUS," and prints which variable goes where: `WITUS_OIDC_CLIENT_ID` and `WITUS_OIDC_CLIENT_SECRET` on the app, and `WITUS_OIDC_SECRET__<SLUG>` on the sign-in server, holding the same secret. It shows the secret once, so it goes into my password manager before I close the terminal. The slug has to exist in the client registry already. An app with no secret on the server side is skipped entirely, on purpose: half-registered apps are invisible, not half-broken.

## Checking before I deploy

`node scripts/check-oidc-env.mjs` reads an app's local env file and compares it to the registry. It creates nothing. I run it after minting a client, to catch the value pasted into the wrong box before a deploy finds it for me.

`node scripts/check-registries.mjs` checks that the product list and the sign-in client list agree: every product that says it signs in through WitUS has a client, no two products share one, the hosts line up. It exits with an error on any mismatch, so it also runs before every commit and in CI. I never have to remember it.

## Pushing one rules change to every repo

`node scripts/propagate-claude-rules.mjs` takes the shared rules block, the house rules every repo's instructions file carries, and writes it into all of them. With `--write` it also branches, commits and pushes each repo that changed, so my part is the merges. Without the flag it only shows what would change, which is how I run it first. Before this, a rule change meant pasting the same paragraph into two dozen files and missing three.

## The checks I run before a launch

- `check-posthog-conformance.mjs` audits each repo's analytics setup against the standard.
- `check-sentry-scrub.mjs` proves the error reporter strips credentials out of a crash report before it leaves the app. It fails if any secret survives.
- `check-inert-controls.mjs` finds buttons that look finished and do nothing when clicked.

None of the three creates a variable. They tell me what is wrong while it is still cheap.

## Syncing the library

`node scripts/sync-library.mjs` copies my private markdown library, the playbooks and ebooks, into a database table I can read from the witus admin. The witus repo is public, so that content never goes into git. The script is how it gets online without being published.

## The two traps worth memorising

The reference calls out two by name, because each cost real time.

1. **Two homes.** The minting script prints two blocks for a reason. App side without the server side gives `invalid_client`. Server side without the app side hides the button. Set both, then redeploy both.
2. **`NEXTAUTH_URL` does nothing on Vercel.** NextAuth builds its redirect address from the request headers there and ignores the variable. If a redirect is wrong, the fix is in the client registry, not in env.

## Disk space, the newest section

The last section went in after [my drive filled up while three helpers were building](/blog/it-was-the-disk-not-the-memory). It has the commands to see what is using space, the two checks that say a leftover worktree is safe to remove, the cache cleanups that rebuild themselves, and the one cache never to delete on my Mac, because the PDF renderer depends on it. Next time it is a lookup.

## Why write it down

A command I run twice a year is one I have to rediscover. Written down once, it stops costing a helper session every time I need it.

## What this cost

Writing this post took about 1 credit of Claude usage, roughly $1, counted from the writing helper's session transcript. That helper also wrote the disk-space post, so its total is split evenly between the two. The commands reference itself was built up over earlier sessions and is not counted. A credit here is 1 dollar of API list price, which is not what my subscription bills. My own time is not in it either.
