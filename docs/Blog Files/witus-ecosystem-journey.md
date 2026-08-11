<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   One Identity Provider, 21 Products, and 2,080 Tests That Cannot Fail a Deploy
Slug:    witus-ecosystem-journey
Excerpt: I build and run 21 interlinked products by myself. This is not a tour
         of them. It is the story of what I decided to share between them,
         what sharing bought, what it cost the day it broke, and the gap I
         found when I counted my own test coverage and published the number.
Tags:    Architecture, Solo Engineering, Multi-tenancy, OIDC, Testing, Engineering Judgment
-->

# One Identity Provider, 21 Products, and 2,080 Tests That Cannot Fail a Deploy

There are 21 products in my ecosystem. I know that because they live in one TypeScript file, `gemini/witus/lib/products.ts`, and that file is the registry every other list in the system has to agree with. Counting folders on my hard drive gives a different number and always has. The file is the answer.

The number is the least interesting thing here. A list of 21 products is a directory, and nobody finishes reading a directory. What is worth writing down is how it got this way: what I chose to share between products, what that sharing bought me, what it cost on the day it broke, and the one habit that made the twenty-first product cheaper to add than the fifth.

## The thesis: staying healthy and staying paid are one problem

The ecosystem has a phrase attached to it: Live Long. Work Free. That is not a tagline I bolted on afterward. It is the reason two products that look unrelated share a database.

CentenarianOS is a personal operating system for a long life. Nutrition, workouts, money, travel, and a roadmap that runs across decades. It has 14 modules and 198 SQL migrations. A migration is a versioned change to the database shape, and all 198 of mine are additive, meaning each one adds and never destroys, so an old record written three years ago still reads correctly today.

Work.WitUS is a job tracker for independent contractors. Jobs, time logs, invoices, mileage, and a phone camera pointed at a pay stub.

Those sound like two companies. They are one idea approached from two sides. A person tracking their sleep and a person tracking their unpaid invoices are the same person having the same problem, which is control over the next thirty years. Money stress is a health input. Health collapse is an income event. So the two apps share one Postgres database, and there is no sync job between them because there is nothing to sync. The data was never in two places.

Once you accept that framing, the next decision writes itself. If these are facets of one life, a person should not maintain 21 separate accounts to see it. So there is one identity provider: a single "Sign in with WitUS" service that about 19 first-party apps authenticate through. An identity provider is the service that owns who you are, so every other app can ask it instead of storing its own passwords. Mine speaks OIDC, an open standard for exactly that handoff, and the 19 clients sit on three different auth stacks underneath. That part matters: the standard is what let me stop caring what each app was built on.

## What sharing bought, and where I refused to share

The rule I settled on is narrow. Share the things that are the same everywhere. Keep everything else independent.

Shared: identity, incoming webhooks, outgoing publishing, database conventions, and the written rules themselves. There is exactly one signed-webhook receiver for the whole ecosystem. Every contact form, pilot signup, and educator note in every product posts to it with an HMAC signature, which is a cryptographic stamp proving the message came from a system holding the right secret and was not modified in transit. One triage inbox for me, instead of 21 places to check email. Its publishing counterpart works the other direction, and no product ever sees the social publishing key.

Independent: user interface, brand, pricing, and data model. FlashLearnAI publishes 27 documented API paths across 32 operations and knows nothing about hotel bookings. Stream.WitUS knows nothing about drone flight logs. When I want to change a price, I change it in one repo and nothing else moves.

The clearest payoff is Learn.WitUS, the multi-tenant learning platform. Multi-tenant means several separate customers run on one deployed copy of the app, each seeing only their own world. Mine resolves the tenant from the hostname at runtime, so a new white-label school is a database row plus a DNS record. Not a fork, not a redeploy, not a branch. That is only possible because tenancy was designed as shared infrastructure from the start instead of being retrofitted per customer.

## What sharing cost

Here is the honest other half. Shared infrastructure creates shared failure modes, and the bigger the shared piece, the wider the blast radius.

One sign-in service means one class of bug can lock people out of an app they have no other way into. That is not a thought experiment. It happened twice in July, both times because a product's entry in the product registry said it used single sign-on while the separate OIDC client allowlist had no matching record. Every component behaved correctly. A user clicked "Sign in with WitUS" and got an error page.

Worth being precise about the blast radius, because the scary version of this sentence is not the true one. That particular bug is per-app: the identity provider stayed up, and only the product whose registry entry was missing or mismatched refused to sign anyone in. The other apps were fine. What made it bad was not width, it was that the affected app had no fallback login at all, because I had deliberately removed every other way in.

I wrote that postmortem up separately, including the decision I think most teams get wrong, in [Sign-In Broke Twice in July. The Fix Was a 158-Line Script.](/blog/outage-to-invariant) I will not retell it here. What belongs in this post is the trade it represents. Nineteen apps with their own login screens would never have had that class of outage. They would have had nineteen password reset flows, nineteen session bugs, nineteen places for a security mistake to hide, and a user who could not tell that their coaching app and their invoice app knew the same person. I took the concentrated risk on purpose. The correct response to a concentrated risk is not to un-concentrate it. It is to put a guard on it.

## The pattern that repeats: rules become checks

Every expensive lesson in this ecosystem ended up in the same place. Not a note. Not a doc. A check that fails a build.

`claude/stream-witus/tests/isolation/no-unscoped-reads.test.ts` walks every API route file in the app and fails if any of them imports the raw database client. Only two files are allowed to touch it. The reasoning is that owner-scoping is only as strong as its weakest route, and one handler with an unfiltered query shows one person's private library to a stranger. A human reviewing a small pull request sees a normal-looking import and moves on. A test that reads every route at once does not get bored. My favorite line in that file is the boring one: it also asserts the file walk found more than ten files, so that if somebody moves the API directory, the guard turns red instead of silently passing on an empty list.

`claude/witus-learn` carries a 15-file tenant isolation suite. One test serializes a school's page metadata and asserts that one brand's name never appears anywhere in another brand's output. Cross-tenant reads return 404 by design, and the suite proves it rather than trusting it. That test exists because the bug it describes actually shipped.

Thirteen repos have a test proving the error-monitoring scrubber works. The design of the assertion is the part I would steal for any codebase. Instead of checking whether a redaction rule fired, the test builds an error event stuffed with real-shaped secrets, scrubs it, converts the entire object to a string, and fails if any raw secret appears anywhere in it. Field-by-field checks pass happily while the same password rides along in a breadcrumb. `claude/fly-witus/scripts/check-sentry-scrub.ts` also asserts the opposite direction: a harmless 21-character ID must survive, because a scrubber that redacts everything makes crash reports useless.

None of these is clever. That is the point. "Make illegal states unrepresentable" gets quoted as a slogan about type systems. In practice it is mostly this: find the sentence in a comment that says X must match Y, and write the twenty lines that make disagreement fail.

## The part that is not finished

I surveyed all 22 repositories and counted. 2,080 declared test cases across 251 test files.

One repository runs its suite in continuous integration on a pull request. One.

Zero repositories run tests in a pre-commit hook. Zero run tests as part of the build command that deploys. The 21 pre-commit hooks I do have are branch guards that refuse commits on `main`, which is real process hygiene and is not test enforcement.

So almost every guard I just described is only as good as me remembering to run it. The registry check that exists because sign-in broke twice is still not wired to anything automatic. The parent repository, the one that is also the identity provider every other app signs in through, has zero test files and no test runner at all. It has four excellent hand-run scripts.

I am not softening that. It is the most useful paragraph in this post, because it is the one a hiring manager or a client can verify against my repositories. The fix is small and I know exactly what it is: the working CI file in the one repository that has it is about 40 lines, and copying it to the other sixteen repositories that already use the same test runner is an afternoon of work. The gap is not a mystery. It is a queue position.

## What building 21 things alone actually teaches

The lesson I did not expect is about the cost of conventions, not the value of them.

Every good convention I adopted was easy to follow at product three and expensive at product fifteen. Standards are free when you are holding all of them in your head. They stop being free the moment there are more repositories than you can open in one editor window. Then a rule that lives in your memory becomes a rule that is inconsistently applied, and an inconsistently applied rule is worse than no rule, because it produces the appearance of a guarantee.

So the shared rules propagate by a script now. The canonical text lives in one file in one repository, wrapped in a marker block. A command writes it into every listed repository, branches, commits, and pushes each one that changed, and leaves me only the merges. Adding a new product to the ecosystem is adding a line to a registry and running that command.

That is the whole thing, and it generalizes past my situation: a decision you have to remember is a decision you will forget. It does not matter whether the forgetting happens in six months or across six teammates. The only conventions that survive to the twenty-first product are the ones a machine carries for you.

Two production outages taught me the second half of it. Every rule I could not check was a rule I did not actually have.
