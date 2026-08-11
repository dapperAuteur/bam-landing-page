<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   2,085 Tests, and None of Them Opens the Front Door
Slug:    what-my-tests-do-not-cover
Excerpt: I read all 22 repositories in my ecosystem and counted every test I
         had written. Then I counted how many of them could fail a deploy.
         The second number is the post. Here is what my tests are genuinely
         good at, the tier that is missing, and where a browser cannot help.
Tags:    Testing, QA, End-to-End, Accessibility, CI, Engineering Judgment
-->

# 2,085 Tests, and None of Them Opens the Front Door

I spent a day reading my own test suites. Not running them, reading them: every `package.json`, every runner config, every workflow file, every test file across 22 repositories I build and operate by myself.

The first number is 2,085 declared test cases across 252 test files. That is a floor, not a total. It counts `it(` and `test(` declarations in source, and several suites generate their cases at run time, so the real number is higher. One accessibility spec in my travel-learning app declares a single test inside nested loops over four paths and eight viewport widths, which is 32 actual tests from one counted line.

The second number is one. One repository out of 22 runs its test suite in continuous integration on a pull request. Zero run tests in a pre-commit hook. Zero run tests in the build command that deploys.

I have 21 pre-commit hooks. A pre-commit hook is a script that runs on your machine before a commit is allowed to complete. Mine check the branch name and refuse commits on `main`. Twenty-one of those. Not one of them runs a test.

So I own about two thousand assertions that describe how my software must behave, and almost none of them can stop a bad deploy. That is the interesting part, and it is not a coverage problem. Getting to the reason took me through a more useful question: what are these tests actually for, and what is the tier they were never going to cover?

## What my tests do that a browser cannot

The best tests I have do not look at pages. They look at source code and at serialized objects, and that is exactly why they work.

`claude/stream-witus/tests/isolation/no-unscoped-reads.test.ts` walks every API route file in my media app and fails if any of them imports the raw database client. Only two files are allowed to touch it. The reasoning is that owner-scoping is only as strong as its weakest route: one handler running a query with no owner filter shows one person's private library to a stranger. The test uses `it.each` over the files it discovers, so a route I add next month is covered on the day it is created, with no test written for it. Its quietest line is the one I would steal for any codebase: `expect(files.length).toBeGreaterThan(10)`. If a refactor moves the API directory, the walk returns nothing, every per-file assertion passes on an empty list, and the guard silently stops guarding. That one assertion turns a silent no-op into a red build.

`gemini/wanderlearn/wanderlearn-app/tests/e2e/no-force-static-under-lang.spec.ts` is my favorite example of the category, because it is a Playwright spec that never opens a browser. It reads the app source and fails if any page under the language-prefixed route tree exports `dynamic = "force-static"`. Those pages render a shared header that asks who the current user is. Under `force-static`, that lookup returns nothing at build time, so a signed-out header gets baked into the prerendered HTML and served to everyone, including signed-in users. That shipped on five pages and reached a support thread. A browser test could see the wrong header on one page on one build. The source test makes the mistake unrepresentable on every page forever.

`claude/witus-learn/tests/isolation/` holds a 15-file suite for my multi-tenant learning platform. Multi-tenant means several separate customers run on one deployed copy, each seeing only their own world. Cross-tenant reads return 404 by design, and the suite proves it instead of trusting it. In my media app, `tests/isolation/scoped.db.test.ts` asserts the whole shape of that rule: B's list never contains A's item, B fetching A's item by ID gets a 404, B cannot edit it, B cannot delete it, and A's item is verified untouched afterward.

`gemini/witus/scripts/check-registries.mjs` compares two files that must agree: the product directory and the sign-in client allowlist. It exists because ecosystem sign-in broke twice in July, both times because a product declared single sign-on while no matching client was registered. I wrote that postmortem up separately in [Sign-In Broke Twice in July](/blog/outage-to-invariant). The relevant detail here is what kind of test it is: it reads two TypeScript files and compares data structures. There is no page to visit.

Thirteen repositories have a test proving the error-monitoring scrubber works. Instead of checking whether a redaction rule fired, the test builds an error event stuffed with real-shaped secrets, scrubs it, converts the whole object to a string, and fails if any raw secret appears anywhere in the result. Field-by-field checks pass happily while the same password rides along in a breadcrumb. `claude/fly-witus/scripts/check-sentry-scrub.ts` also asserts the opposite direction: a harmless 21-character ID must survive, because a scrubber that redacts everything makes crash reports useless.

None of those five things can be written as a browser test. Not "would be awkward as." Cannot. There is no page, no click, and no visible symptom at the moment of failure. This matters for the argument I am about to make, so I want it stated plainly before I make it.

## The four things my tests do not see

Now the other side, from the same survey.

**Eighteen of my 22 repositories have no browser tests at all.** Playwright is installed in four, always paired with axe-core, which is an automated accessibility scanner. No Cypress, no Selenium, no Puppeteer as a direct dependency anywhere. My flashcard app has files named `.e2e.test.ts`, and they are in-process route tests against an in-memory database. Real tests, useful tests, and not end-to-end in the sense anyone means it.

**No signed-in browser journey completes a transaction anywhere.** My hotel booking app's Playwright config says the tests are read-only against seeded demo data, with a comment noting that no bookings are clicked because the nightly reset is not a test janitor. So the booking flow is verified up to the "Reserve this room" button and no further. Checkout, enrollment, and subscription purchase have zero end-to-end coverage in any of the 22 repositories.

**There is no live sign-on test.** One identity provider serves about 19 first-party apps across three different auth stacks. Nothing anywhere performs an actual redirect, token exchange, and callback against a running instance of it. The only verification is a static comparison of two files and an environment-variable audit. Both July outages were runtime failures, and the fix I shipped is a static check. That check would have caught both. It would not catch the next failure that lives in the redirect chain rather than in the registries. Worse, the repository that *is* the identity provider has zero test files and no test runner installed at all. It has four hand-run scripts.

**Accessibility runs cover 4 apps out of 22.** The 18 without include my learning products, which carry the highest expectation of anyone I build for.

There is a pattern in that list. Every gap is a thing that only exists when several parts are running at once, on a real host, in a real browser session. My tests are excellent at properties I can check by reading a file. They are absent at properties that only appear when the system is assembled.

## Where an English-language browser test earns its place

The reason 18 repositories have no browser tests is not that I decided they had no value. It is authoring cost. A Playwright spec for host-based tenancy means mapping real hostnames to localhost with a Chromium resolver flag, which is fiddly setup I have to re-derive per repository. That cost is paid per test, by me, forever. It is the single reason this tier is empty.

So the case for tests written in plain English is not "plain English is nicer to read." It is that the authoring cost is what stopped the work, and lowering it changes what gets written. Concretely, the places it would pay for itself in my ecosystem:

**Multi-tenant host routing.** Three of my products resolve the customer from the hostname at run time. "Visit the demo hotel's domain and confirm the header shows that brand and not the platform brand" is one sentence. The isolation properties it checks are the same ones my unit suites already assert at the function level, which is the point: the function is proven, the assembled system is not.

**The sign-on chain.** The highest-consequence untested path I have, and the hardest to express as a unit test, because it spans multiple separately deployed apps and a real redirect. There is no single process to mock. A browser is the only thing that can hold both ends.

**Signed-in transactional journeys.** Booking, enrolling, buying. These resist unit tests for a specific reason: the failure I am afraid of is not in any one function, it is in the handoff between a session, a payment provider, and a database write. Each piece has a test. The seam does not.

**Shallow smoke coverage across the 18 repositories with no browser tests.** "Every page in the navigation loads without a 500 and shows its heading." Nearly worthless per test, valuable in aggregate, and precisely the category no human hand-writes because writing 40 of them is tedious. Tedium is the whole problem, and tedium is what an authoring tool is for.

**Accessibility sweeps beyond the four repositories that have them.** Per-page authoring cost is what stops this, and per-page cost is the thing that drops.

## Where it does not fit, and why I say so

If I stopped there I would be selling something, so here is the boundary.

Everything in the first section stays where it is. The source-reading invariants have no browser surface: `no-unscoped-reads` and the `force-static` guard are static analysis wearing a test runner's clothes. The scrubber tests assert that a string is absent from a serialized object, and no user ever sees that object. My content lint scripts read authored markdown before it renders, and one of them fails a quiz bank when too many correct answers sit at the same option position, which requires reading the whole bank at once and is not visible on any page.

Hundreds of my 2,085 cases are pure functions: spaced-repetition scheduling, money arithmetic, contrast ratios, half-open date ranges so two back-to-back hotel stays never overlap. They run in milliseconds. Driving them through a user interface would be slower, less precise, and flakier, and "flaky" is the word that kills a suite, because a test that fails at random teaches you to ignore failures.

My agent evaluation harness is a different testing model entirely. The output is non-deterministic, so the assertions are properties instead of expected strings, scored against a frozen numeric baseline.

One design goal I will not trade: `pnpm test` works on a fresh clone with no environment file, no keys, no network. A layer that needs a running app plus a seeded database is an addition to that. It is not a replacement, and any tool that asks me to treat it as one is asking me to make my feedback loop worse.

The honest summary is that a plain-English end-to-end layer would fill a real and currently empty tier, sitting on top of roughly two thousand fast deterministic tests doing work no browser tool can do. Both halves of that sentence are load-bearing. A vendor who only says the first half is telling me they have not read a codebase like mine.

## The gap was never coverage. It was wiring.

Back to the two numbers.

2,085 tests and one repository that can fail a build is not a coverage story. Coverage is the thing I have. What I do not have is a connection between the tests and the deploy, and a test that nothing runs is documentation. Good documentation, sometimes: the middleware suite in my tour app opens by naming the exact defect it exists for. That is institutional memory. It is not a gate.

I have 21 pre-commit hooks that check a branch name and zero that run a test. I built the enforcement habit and pointed it at the cheapest possible thing to enforce.

The fix is not architectural. The one repository with working CI has a workflow file of about 40 lines that runs a type check, the test suite, and a build on every pull request. Sixteen other repositories use the same test runner. Copying it sideways is an afternoon.

I have not done it yet. I am writing that down on purpose, because the version of this post where I describe the fix and imply it shipped is the version a reader cannot verify against my repositories. The gap is not a mystery and it is not a disagreement. It is a queue position.

If you want the architecture that produced this shape, including what I chose to share across 21 products and what that sharing cost the day it broke, that is a separate post: [One Identity Provider, 21 Products, and 2,085 Tests That Cannot Fail a Deploy](/blog/witus-ecosystem-journey).

The lesson I would hand anyone counting their own tests: run the count twice. Once for how many tests you have, and once for how many can stop you from shipping. The distance between those two numbers is your actual test strategy, whatever the first number says.
