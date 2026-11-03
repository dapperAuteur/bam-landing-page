<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Sign In Only Adults, and Sign Out of One App
Slug:    sign-in-only-adults-sign-out-of-one-app
Excerpt: Fit T. Cent Assessments said "Sign in with WitUS is not switched on yet" after I had
         set every secret. The message was honest: the sign-in code did not exist. Now it does,
         with a first question that lets only adults keep an account, a "No" that deletes what
         the app just made, a sign out that leaves the rest of WitUS signed in, and a migration
         that runs itself after the merge.
Tags:    Fit T. Cent, Better Auth, Sign in with WitUS, Privacy, Next.js, WitUS
-->

# Sign In Only Adults, and Sign Out of One App

Fit T. Cent Assessments (assessments.witus.online) is the movement app I am building in the WitUS ecosystem. The first release measures a hurdler's clearance from a slow-motion phone clip, with the pose analysis running in the browser. Whether that could work at all came down to one phone test, which I wrote up in [My Phone Filmed at 240 Frames a Second. The Browser Got 30, and Every Frame Was Still There.](/blog/every-slow-motion-frame-was-still-there)

The account design is small on purpose. When the analysis ships, a guest runs it without an account. Signing in does one thing: it saves results. Results are numbers and, if you allow it, body landmarks. Never the video.

Sign in is "Sign in with WitUS," the identity provider I run at accounts.witus.online for every app in the ecosystem. The app talks to it over OpenID Connect through Better Auth's Generic OAuth plugin, which "lets you add any OAuth 2.0 or OpenID Connect (OIDC) provider to your application" (Better Auth, n.d.).

## "Not switched on yet," after every secret was set

I registered the app with the identity provider, set the sign-in variables in Vercel, connected the database, and opened the sign-in page. It said: "Sign in with WitUS is not switched on yet. When it is, signing in lets you save results. Running an analysis will not need an account."

My first thought was a missing variable. It was not. The first phase of the app shipped the shell: the header, the landing page, a Sign in link, and a placeholder page for that link to land on. The sign-in code was the next phase, and it had not been written. The page was telling the truth.

I am keeping that behavior on purpose. The sign-in button now appears only when both the client id and the client secret are set. The identity provider treats this app as a confidential client, so an id without a secret would show a working-looking button that fails at the token step with `invalid_client`. Without both, the page shows the same honest sentence instead.

## The database came with a different name

I connected the Neon database through Vercel's integration. The integration named the variables with a `STORAGE_` prefix: `STORAGE_DATABASE_URL` for the pooled connection and `STORAGE_DATABASE_URL_UNPOOLED` for the direct one. The code expected `DATABASE_URL`.

Instead of asking me to rename variables in a dashboard, the app reads `DATABASE_URL`, and if that is not set, `STORAGE_DATABASE_URL`. A plain `DATABASE_URL` still wins when both exist, so a hand-set value can override the integration. On a laptop with no URL at all, the app uses an embedded database for development. On Vercel, a missing URL is an error. A serverless function quietly running on an empty database would be worse than a page that fails.

## The first question: 18 or older?

After the first sign-in, the app sends you to `/welcome`, which asks two questions in order.

The first is "Are you 18 or older?" A yes stores the time you answered and nothing else. The app never asks for a birth date, so it never holds one.

The second is how you will use it: athlete (you analyze your own clips), coach (you analyze clips of adult athletes you coach), or both. Admin is never a choice on that form, and the code that saves a role only writes it for someone who has already confirmed their age and has no role yet.

A no does three things. It ends this app's session. It deletes the account row the sign-in just created, and that delete takes its sessions and its link to the WitUS account with it. Then it sends you to a page that says: "This demo is for adults for now. You are signed out of this app, and the account it made for you is deleted. Your WitUS account is unchanged." The delete refuses any row that has already answered yes, so a stray request can never remove a real account.

## Why adults only, for now

The product is video of people moving, and later, coaches looking at that video. For children, that is regulated data. The federal children's privacy rule defines a child as "an individual under the age of 13," and it lists among personal information "a photograph, video, or audio file where such file contains a child's image or voice" and biometric identifiers including "gait patterns" (Children's Online Privacy Protection Rule, 2025). A clip of a child clearing a hurdle is a video of that child, and the landmarks the app measures describe how that child moves.

The line in this app is 18, which is stricter than that rule's 13. A release for athletes under 18 needs more than consent forms: guardian consent, a guardian who can see every coach's note, and a written plan for when something goes wrong. None of that is built. Until it is, nobody under 18 uses the app or appears in its test clips, and a minors' release happens only if I decide to plan it.

## Sign out ends this app's session only

By default, Better Auth's sign out does more than I wanted. For a provider that publishes an end-session endpoint, "authClient.signOut() will clear the Better Auth session and then redirect the browser to the provider logout endpoint" (Better Auth, n.d.). Here that would sign the person out of WitUS itself, and with it every other WitUS app they had open, and leave them on accounts.witus.online instead of the page they were on.

So the provider is configured with `disableProviderLogout: true`. With that set, the same documentation says, "`authClient.signOut()` only clears the Better Auth session" (Better Auth, n.d.). Sign out ends this app's session and lands on this app's home page. The WitUS account stays signed in. A unit test pins the setting, with a control case that shows what changes without it, so a later upgrade cannot quietly bring the redirect back.

## The migration runs after the merge

This is the first version of the app with a database, so it is also the first with a step after every deploy. The ecosystem rule is that no such step is run by hand.

A GitHub Actions workflow runs the migrations on any push to `main` that changes the migrations folder, and on demand from the Actions tab. It reads one repository secret, the direct database connection, set by piping it from the Neon command line into `gh secret set` so the value is never pasted. If the secret is missing, the job fails at its first step with an error that names the secret and the runbook section. The tracked operations runbook has the manual fallback: the one command to run from a laptop, where the value comes from, and the output to expect.

There is also a sign-in for development: a link printed to the server console. It never registers on Vercel, whatever else is set, and a test checks that too.

## Where it stands

68 unit tests and 46 Playwright browser checks pass on the branch, including the adult path, the under-18 path, the Spanish form, and accessibility checks in light and dark mode with the layout at 320 pixels wide. It is not merged yet. Two things can only be checked on production: the migration against the real database, and the full round trip through accounts.witus.online. Both are on the merge checklist.

What I would carry to any app that adds sign in:

- **A placeholder that says "not yet" is better than a button that fails.** Show the control only when everything it needs exists.
- **Read the name the platform gave you** before asking anyone to rename it.
- **Ask the one question that decides what you may keep,** store the answer as little as possible, and delete what you made when the answer is no.
- **Decide what "Sign out" means** in a single sign-on ecosystem, write it into the configuration, and test it.

## References

Better Auth. (n.d.). *Generic OAuth*. Better Auth documentation. Retrieved November 2, 2026, from https://www.better-auth.com/docs/plugins/generic-oauth

Children's Online Privacy Protection Rule, 16 C.F.R. § 312.2 (2025). Retrieved November 2, 2026, from https://www.law.cornell.edu/cfr/text/16/312.2
