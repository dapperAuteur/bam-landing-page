<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Two Rejections, One Heading, and the Five Codes Neither One Named
Slug:    the-post-found-the-bug
Excerpt: An agent was checking the examples for a post about merge conflicts
         in curated data. Checking them turned up a live one, on main,
         published to Georgia teachers: two rejection notes under a
         byte-identical heading, sharing their first 365 characters, each
         naming as an unclaimed gap what the other named as claimed. The
         type checker passed, twelve lint guards passed, 984 tests passed.
Tags:    AI Agents, Testing, Data Modeling, Verification, Education Standards, Engineering Judgment, WitUS
Series:  Standards, Conflicts and Sources (5 of 5)
-->

# Two Rejections, One Heading, and the Five Codes Neither One Named

The four posts before this one were about [merge conflicts in a dataset teachers read](/blog/conflicts-in-curated-data), [the git operation to resolve them with](/blog/rebase-versus-merge-measured), [the cost of refusing a claim you cannot fetch](/blog/fetch-or-do-not-cite), and [three times my own brief was wrong](/blog/when-the-brief-was-wrong).

This one is about how the first of those got written, because the writing turned into an audit.

The brief was ordinary. I handed an agent a list of merge collisions from my standards dataset, with commit hashes, and asked for a post about them. Before writing a word it went and checked each one against the repository, because a post full of numbers I had misremembered is worse than no post. Somewhere in that checking it opened `src/lib/standards/data/ga.ts` and found a collision that was not on my list, was not in any commit message, and was live on `main`.

I want to be precise about how impressive that is, which is: not very. It was doing the boring part of the job. Nobody was hunting. The interesting thing is not that a model found a bug. It is that **verifying prose about a system is the same physical act as auditing the system**, and I had been buying one of those for years without noticing I got the other one free.

Here is what it found, why nothing else could have, and the two things I got wrong afterwards.

## What was on the page

`notClaimed` is the half of my standards dataset that publishes refusals. When a state's standard was considered and not claimed, the reason goes in that list, in prose, on the public state page, under the heading "What we don't claim." It is the evidence the coverage map was not padded.

Georgia's list carried two entries under this heading, byte for byte identical, at lines 537 and 541:

```
      heading: "Economics — most of the personal-finance course, macroeconomics, and the market-structure standards.",
```

Their bodies were 2,288 and 1,433 characters, and **the first 365 characters were identical**. Both opened with the same sentence about a blanket rejection being superseded, and both then named the same first two codes. The divergence starts at character 366. The first entry continues:

> ", SSEPF2 (claimed for element (e) alone, reconciling a checking account and accounting for unposted transactions) and SSEPF10 (sources of and protection against identity theft ...) are now claimed"

The second continues:

> " and, when MONEY-06 shipped the same day, SSEPF1 (major life decisions) are now claimed"

That alone would be an incompleteness. It is worse than that, because each entry also publishes a list of what is *not* claimed. The first one:

> "The remaining standards stay unclaimed and are named so the gap stays visible: **SSEPF1 (major life decisions)**, SSEPF4 (interest rates), SSEPF5 (taxes), SSEPF6 (credit), SSEPF7 (insurance) and SSEPF8 ..."

The second one:

> "The other seven remain unclaimed and are named so the gap stays visible: **SSEPF2 (income and budgeting)**, SSEPF4 (interest rates), SSEPF5 (taxes), SSEPF6 (credit), SSEPF7 (insurance), SSEPF8 ..., and **SSEPF10 (identity theft)**."

Read those two together. Each entry names, as a published gap, a standard the other entry publishes as claimed. Entry one says SSEPF1 is not taught. Entry two says SSEPF1 is taught and SSEPF2 and SSEPF10 are not. Both are internally consistent: four claimed plus six unclaimed, three claimed plus seven unclaimed, ten either way. Both are wrong, and they are wrong in opposite directions.

The truth is the union. **Five of the ten were claimed: SSEPF1, SSEPF2, SSEPF3, SSEPF9 and SSEPF10.** No entry on the page said five. This is the same shape as the West Virginia sentence in [the first post](/blog/conflicts-in-curated-data), where both sides said "the other seven" and the answer was six, except that here nobody even had to resolve a conflict badly. Both texts simply sat on the page at once, and a Georgia teacher scrolling that section read one refusal explained twice, in two versions, with no way to tell which was current.

## Everything passed

I re-ran the whole toolchain against the broken data today, restoring the old `ga.ts` on top of the current test suite, because I did not want to take the original commit message's word for it.

`npx tsc --noEmit` exits 0. Then `pnpm lint`, which is ESLint plus eleven hand-written content guards:

```
Scanned 985 files: 2283 protected, 0 violations.
Scanned 1039 files: 814 quiz banks, 775 of 8+ questions (689 shuffle, 532 skewed), 0 violations.
Scanned 1039 files: 775 quiz banks of 8+ questions, 0 over the 60% length-tell limit
Scanned 265 course files: 0 with recall on the first teaching lesson.
Scanned 265 course files: 3596 reveal cards, 0 broken.
Scanned 265 course files: 31 figures, 0 problem(s).
Scanned 1039 files: 82 assessment-fit finding(s) ... 0 violation(s).
Standards coverage: 169/269 courses aligned, 100 unmapped (0 unaccounted for).
Citations: 1332 across 38 of 40 staged course(s)
Scanned 15 seed script(s): 46 coded course(s) across 7 series, 3 track(s), 0 violation(s).
Scanned 29 top-level page(s): 0 menu orphan(s), 0 shared-card page(s)
```

Then the suite:

```
Test Files  74 passed | 16 skipped (90)
     Tests  984 passed | 74 skipped (1058)
```

Twelve guards, 984 tests, a clean type check, and a state page that contradicted itself in public. **The data was well formed and wrong.** That combination is the dangerous one, because every mechanism I own reports on form, and the readers who would notice the contradiction are teachers who came to the page precisely because they do not already know the answer.

## The invariant was inexpressible, not just unenforced

Here is the type, and it is four lines:

```ts
/** An honest omission, rendered under "What we don't claim" on a state's page. */
export interface NotClaimedItem {
  heading: string;
  body: string;
}
```

No id. No code. Nothing for a uniqueness assertion to key on. The sentence "a jurisdiction does not publish the same rejection twice" was not a rule I had failed to enforce. It was a rule I had no way to write down.

And the codebase had already noticed, in the only way code can notice a missing key. This is the renderer for that list, in `src/app/(tenant)/academic-standards/page.tsx`:

```tsx
{data.notClaimed.map((n) => (
  <li key={n.heading}>
    <strong>{n.heading}</strong> {n.body}
  </li>
))}
```

React needs a key. The type supplies none, so the component reached for the nearest available string and made a paragraph of human-editable English into an identity. That happened months before the duplicate, silently, as a local decision inside one JSX block. When a record type has no key, the code does not go without one. It invents one out of whatever text is lying around, and then that text is load-bearing without anybody having decided it should be.

## Where it came from, which is not where the fix commit says it came from

I wrote the fix commit and gave it a cause:

> "It came from bundling MONEY-04, MONEY-05 and MONEY-06, each of which rewrote the same rejection to name its own course."

That is wrong, and I only know it is wrong because I went back through the history a second time to write this post. Walking every commit that touched `ga.ts` and counting occurrences of that heading:

```
count=1  1d4b7f5 08-28 10:25  standards(money-02): convert five personal-finance rejections into claims
count=1  8678272 08-28 15:52  feat(standards): three personal-finance rejections converted for MONEY-03
count=1  f1af00b 08-28 16:06  feat(standards): map MONEY-04 across 7 jurisdictions
count=1  ca4c376 08-29 15:42  Merge branch 'content/money-04-predatory-products' into bundle/...
count=2  df75f87 08-29 19:07  standards(money-06): convert three housing rejections into claims
count=2  5b4a77a 08-29 19:20  fix(standards): merge the two Georgia SSEPF9 entries the rebase produced
count=2  b028f38 08-29 21:28  feat(standards): MONEY-05 converts three tax rejections
count=2  ba4a223 08-29 21:31  standards(money-07): three rejections converted, and the refusals named
count=1  9be8400 08-29 22:56  fix(standards): one Georgia rejection, not two contradictory ones, and a test
```

One commit introduced it: `df75f87`, on the housing branch. MONEY-05 and MONEY-07 arrived after the duplicate already existed and edited around it, and MONEY-04 never touched it. So the three courses I named are the wrong three.

The dates say what actually happened. `df75f87` has an author date of 08-28 15:56 and a committer date of 08-29 19:07, nineteen hours later. It was replayed. This is the rebase [the second post in this series measured with a stopwatch](/blog/rebase-versus-merge-measured), and the diff shows exactly what replaying a prose edit does: the commit does not modify the existing entry, it **appends a second one underneath it**, carrying the version of the paragraph that was true on the branch's old base. Keep-both, applied to a sentence about the world. The failure mode the first post named in the abstract, sitting in the repository while that post was being written.

Two more things about that commit make it worse and better at once.

**The instruction from the previous duplicate was followed.** After the Texas framework-id collision I put a line in every brief: prefer frameworks already on `main`, and say loudly if you must create one. The MONEY-06 commit message says, unprompted:

> "No new framework was created. Every code lands in a framework that was already on main (tx-economics, tx-personal-financial-literacy, il-financial-literacy, ga-ssec), which is the collision the last bundle had to fix by hand."

It did the thing I asked. The duplicate happened one level down, at a record type the instruction did not name, which is the whole argument of [guards beat instructions](/blog/guards-beat-instructions) arriving on schedule.

**And the same rebase produced two duplicates, thirteen minutes apart.** At 19:07 the replay left two `notClaimed` entries. At 19:20 I committed `fix(standards): merge the two Georgia SSEPF9 entries the rebase produced`, fixing a duplicate *code* in the same file, caught instantly by the isolation suite with the message `duplicate ga-ssec::SSEPF9`. I had the file open. The other duplicate was about a hundred lines below, and I did not see it, because nothing told me and it does not look like anything.

## The test, and the only way to know a regression test works

The fix merged the two entries into one that names all five claimed codes and the five still unclaimed. That part is data. The part that matters is sixteen lines in `tests/isolation/standards.test.ts`:

```ts
// A `notClaimed` item is {heading, body} with NO id, so nothing structural stops two entries
// sharing a heading. That is not hypothetical: bundling MONEY-04, MONEY-05 and MONEY-06 left
// Georgia with two entries under one heading and CONTRADICTORY bodies, live on main, published
// to teachers, and no test could see it. A rejection published twice, saying different things,
// is worse than no rejection at all, because a teacher cannot tell which one is current.
it("no duplicate notClaimed heading within a jurisdiction", () => {
  for (const j of JURISDICTION_FILES) {
    const seen = new Map<string, number>();
    for (const n of j.notClaimed ?? []) seen.set(n.heading, (seen.get(n.heading) ?? 0) + 1);
    for (const [heading, count] of seen) {
      expect(count, `${j.state}: notClaimed heading appears ${count}x: ${heading}`).toBe(1);
    }
  }
});
```

(That comment repeats the wrong cause. I am leaving it there and correcting it here, because a commit message is a record of what I believed at the time and this post is the correction.)

A regression test written after the fix, against data that is already correct, proves nothing at all. It passes because everything passes. So I checked out the old `ga.ts` underneath the new test file and ran it:

```
× no duplicate notClaimed heading within a jurisdiction
  → GA: notClaimed heading appears 2x: Economics — most of the personal-finance course,
    macroeconomics, and the market-structure standards.: expected 2 to be 1
```

Then the fixed data, and 984 becomes 985. **Failing on the old input is the entire evidence that a regression test is a test rather than a decoration**, and it costs one `git checkout` of one file. I have shipped regression tests without doing it. I do not intend to again.

One design note, because it is the reason the test is usable. It scopes uniqueness to a single jurisdiction, not to the whole dataset, and it has to. Across all 51 files the heading `"Mathematics — nothing."` appears 43 times, `"Science — one partial claim, via the shared NGSS file."` 19 times, and the deferred-courses heading 20 times. A global uniqueness assertion would have failed on the day it was written, been judged noisy, and been weakened or deleted. The scope is not a detail of the test. It is the test.

## Three duplicates, three ways of being found

This is the third distinct duplicate this dataset has produced in a month, and the three were caught by three different mechanisms of descending quality:

| Duplicated | Caught by | What I saw |
|---|---|---|
| Framework id `tx-personal-financial-literacy` | arithmetic | 1,582 alignments surfaced against 1,576 in the array, and six duplicate matrix row ids |
| Standard code `SSEPF9` in `ga-ssec` | a named assertion | `duplicate ga-ssec::SSEPF9`, pointing at file, framework and line |
| Rejection heading | a person reading the file | nothing, for four days |

Keyed things fail by name. Counted things fail by arithmetic and have to be diagnosed. Prose fails silently and waits for somebody to read it for an unrelated reason. That ordering is not luck; it is a data-modelling decision made months earlier, deciding in advance how expensive each future bug would be to find.

## What a fourth one looks like, and it is already here

I went looking for the next member of the family, on the theory that a defect class that has produced three instances will produce a fourth. It has, and the new test does not see it either, because it is not a duplicate record. It is a duplicated *meaning*.

Both Georgia entries carried a one-word gloss on SSEPF8, in parentheses, telling a teacher what the standard is about. Tracing that gloss through every commit:

```
1d4b7f5  money-02   SSEPF8 (how earnings are determined)
f1af00b  money-04   SSEPF8 (how earnings are determined)
ca4c376  bundle     SSEPF8 (investing)
df75f87  money-06   SSEPF8 (investing) | SSEPF8 (how earnings are determined)
ba4a223  money-07   SSEPF8 (how earnings are determined) | SSEPF8 (how earnings are determined)
9be8400  the fix    SSEPF8 (investing)
```

It changed meaning three times inside merge and rebase resolutions, including once in my own fix, which restored a gloss that neither of the two live versions had been using. And here is the part that makes it unfixable by any current mechanism: SSEPF8 is **unclaimed**, so under [fetch-or-do-not-cite](/blog/fetch-or-do-not-cite) the repository carries no verbatim text for it. The whole dataset's answer to "what does this standard actually say" is a `text` field on a `StandardRef`, and an unclaimed standard has no `StandardRef`. `SSEPF8` appears exactly once in the entire repository, inside that parenthesis, describing itself.

So the rejection prose makes small factual assertions about standards that the fetch rule guarantees are unverifiable, precisely because they were rejected. That is a real hole in a rule I still think is right, and I did not see it until I went looking for a fourth duplicate.

## What is still wrong

**The id I promised is not there.** The first post ended with "give every curated record a key, even the prose ones," and said `NotClaimedItem` would get one. It did not. It got a test that keys on `heading`, which is a sentence written for humans, edited by humans, and rendered to the page. The test catches two entries with the same heading. It cannot catch an author rewording a heading, which silently rekeys the record, breaks any anchor link to it, and makes the next diff show an edit as a delete plus an add. A test on a borrowed key is better than nothing and worse than a key.

**The unkeyed half is still the bigger half.** Measured today: 1,597 alignments, every one keyed by framework and code, against **378 rejection entries carrying 204,067 characters of prose** with no key at all. The median entry is 460 characters. Twenty-eight are over a thousand, and the Georgia pair were two of them, which is exactly why sharing an opening 365 characters was enough to hide them.

**Two of my own published posts are now out of date about this.** The first says "The Georgia duplicate is live" and the third lists it among defects not fixed. Both were true when written and are false now, which is a small instance of the same problem: prose that states a fact about a system, with nothing checking that the fact is still true.

**And the catalog gaps have not moved.** `pnpm audit:course --all` reports 1,666 findings across 268 courses today, including 495 lessons that are taught and never assessed by a question. The coverage guard still shows 100 courses with no standards mapping at all. Finding one duplicate paragraph did not improve any of that.

## The thing I would actually tell you

Not "AI found a bug." An agent read a file carefully because it had been asked to write true sentences about it, which is a thing a careful human does too, and is the reason technical writing has always been a debugging technique.

The transferable part is narrower and I think it holds. **The defect was possible because the type had no key, invisible because every guard I own checks form rather than meaning, and durable because the only reader positioned to notice the contradiction was a teacher who came to the page not knowing the answer.** Each of those three is a decision, and all three were made long before the merge that triggered it.

If you keep curated prose in a repository, give the records ids before you need them, and write the uniqueness test on the day you define the type, when it costs four lines and there is nothing to fix. I have now paid the other price three times.
