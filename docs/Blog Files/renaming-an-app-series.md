<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Everything That Went Wrong Renaming My App (A Series)
Slug:    renaming-an-app-series
Excerpt: I changed a product's name and visual identity in a week. Nine things
         broke, surprised me, or forced a decision I hadn't expected. Here they
         all are, written for people who don't work in software.
Tags:    Series, Engineering Judgment, Rebranding, Beginners, Wanderlust
-->

# Everything That Went Wrong Renaming My App (A Series)

I renamed a product this month. Wanderlearn became Wanderlust — a better name for what it actually is, which is a place-based learning app where every course starts by standing inside a real location captured in 360°.

On paper: change some words, pick some colours. A week of work.

It was a week of work. It was also nine separate lessons, most of which I'd have predicted wrong beforehand. I've written each one up on its own, deliberately for people who don't work in software, because none of them are really about software. They're about the difference between a name and an address, between a measurement and the thing you meant to measure, and between deciding and deferring.

Read them in any order.

---

### [I Renamed My App. Three Words Had to Stay Wrong on Purpose.](/blog/rename-names-vs-addresses)

Renaming looks like find-and-replace. Three strings in my code spelled the old name and had to keep spelling it, because they were never names — they were addresses that other systems already had copies of. Change them and every photograph in every published tour stops loading, or people's unsent offline work silently disappears.

Also: the same mistake in reverse, copy-pasted into eighteen projects.

---

### [Changing My Web Address Will Break Every Passkey. There Is No Fix.](/blog/rename-breaks-passkeys)

Every passkey on my app will stop working the day I move it, and no engineering can prevent that — because the thing causing it is the thing that makes passkeys unphishable in the first place.

There was a tempting workaround. It would have let any future customer's website request sign-ins belonging to my other products. Why I didn't take it.

---

### [I Photographed My Whole App and the Best Part Was Missing](/blog/the-globe-was-missing)

I automated 52 screenshots of the old design before replacing it. The program reported complete success. The spinning globe — the single most distinctive thing in the product — was a black rectangle in every shot.

Then I fixed that, ran it again, and silently lost 18 of the 52 pages to something much more boring. Two opposite failures, one shared root cause.

---

### [An Orange Button Is Not Orange Text](/blog/orange-button-is-not-orange-text)

My app had no brand colour at all. Giving it one meant learning that a colour can be perfect as a background and genuinely unreadable as a word — that's arithmetic, not taste, and you can do it before you design anything.

Plus the stamp perforation I built, loved, and deleted because it only existed in dark mode.

---

### ["Stop 9 of 9": The Progress Bar That Said You Were Finished Before You Started](/blog/stop-9-of-9)

I added a progress indicator to my tours because research says getting lost is the main reason people abandon them. The first version greeted arriving visitors with "Stop 9 of 9 — 8 left."

Both numbers were computed correctly. Together they were nonsense. Why a wrong number is worse than no number, and the feature I discovered had been quietly computed and thrown away all along.

---

### [I Removed One Button. The Half That Mattered Was Invisible.](/blog/removed-a-button-invisible-half)

My Spanish translation is real but unfinished, so I hid the language switcher. The button took a minute.

The half that mattered was a line nobody ever sees, telling search engines to route Spanish-speaking searchers straight into half-English pages — and I'd never have noticed it still doing so.

---

### [I Had Three Designs and the Tools to A/B Test Them. I Picked One Instead.](/blog/not-ab-testing-my-brand)

Splitting traffic three ways sounds like rigour. At my traffic, testing a colour change, it's a test that can never conclude — while making every screenshot and partner deck hedge on which brand a person happens to see.

The arithmetic, the difference between wanting evidence and avoiding a decision, and what's actually worth testing when you're small.

---

### [I Built a Product People Were Meant to Share. There Was No Share Button.](/blog/nobody-could-share-a-finished-tour)

The bonus one, and the most useful thing that happened all month. I searched my own codebase for the feature my entire growth plan depended on, and it didn't exist.

What the research says about why people share, why "time on site" is the wrong thing to chase, and the design that came out of taking that seriously.

---

### [I Renamed a Thing That Wasn't a Name, and Broke Sign-In](/blog/renaming-broke-sign-in)

The same trap as the first post, one layer deeper and with worse consequences: a field that looked like a label turned out to be the identity my whole single-sign-on setup is built from.

A script I wrote after two July outages caught it before anyone hit it. Then it caught my fix. Then the best answer turned out to be not making the change at all.

---

## The thread running through all of them

If there's one idea connecting these, it's that **the failures that cost you are the quiet ones**.

Not one of these announced itself. No crash, no red text, no alert. The screenshots reported success. The tests passed. The build was green. The progress bar confidently displayed a number.

Most were found by a person looking at the actual thing and thinking *hang on*. Ninety seconds of opening a file caught the missing globe. A single search caught the missing share button. Reading my own progress bar out loud caught "Stop 9 of 9."

But the last one is a deliberate counterexample, and I put it in for that reason. The sign-in bug was caught by a script — one I'd written months earlier, after the outage that taught me to. Nobody would have spotted that by looking; it lived in a field that computed two other values neither of which was on screen.

So the honest version isn't "automation misses things, go look." It's that the two catch different failures, and you need both:

- **Checks catch what you already know can go wrong.** Registries drifting apart. A colour under 4.5:1. Every one of those is a lesson someone already paid for.
- **Looking catches what you didn't think to ask.** A screenshot tool reporting fifty-two successes and fifty-two wrong pictures. A progress bar counting correctly to a nonsense conclusion.

The trap is assuming the first kind covers the second. It can't — a check is a question, and the gap between the question you asked and the one you meant is invisible by construction.

And one caveat on the checks, from the sign-in post: I *had* written the script that caught that bug, and I still pushed the broken change without running it. A guard you have to remember isn't a guard. It's a hope with good intentions.
