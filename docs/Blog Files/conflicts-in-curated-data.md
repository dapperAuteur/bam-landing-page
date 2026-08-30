<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Merge Conflict in a Dataset Teachers Read
Slug:    conflicts-in-curated-data
Excerpt: Two agents independently created a framework with the same id. It
         compiled, it linted, and only the isolation suite noticed, by
         reporting 1,582 alignments against 1,576. Then a worse one: two
         branches edited the same sentence about West Virginia, one said
         three items were claimed and the other said three items were
         claimed, and the truth was four.
Tags:    Git, AI Agents, Data Modeling, Testing, Education Standards, Engineering Judgment, WitUS
Series:  Standards, Conflicts and Sources (1 of 4)
-->

# A Merge Conflict in a Dataset Teachers Read

I have written before about [why guards beat instructions](/blog/guards-beat-instructions) and [the failures a type checker cannot see](/blog/what-parallel-agents-cost) while building a multi-tenant LMS with agents working in parallel. This post is a narrower case, and I think a more interesting one, because the artifact is not code.

It is a hand-curated dataset of state education standards. Fifty-one jurisdiction files, one per state plus DC, each carrying that state's own codes with the publisher's verbatim text, a fetch date, and a written explanation of what the catalog claims to teach and what it does not. Teachers read it. Homeschooling parents may file it with a state.

Over four days in August, seven personal-finance courses landed on separate branches, and every one of them edited the same jurisdiction files. What came out of those merges was a different species of bug from anything in the code, and the difference is worth naming precisely.

## The rule that makes the data hard to merge

The module states its own constraints at the top of `src/lib/standards/index.ts`. Two of the five matter here:

```
//   1. Every `code` and every `text` was FETCHED FROM THE PUBLISHER and transcribed verbatim.
//      `text` is the standard's own words — not a paraphrase, not a summary, not a memory.
//      If you cannot fetch it, you do not cite it. There is no "close enough".
...
//   5. Standards considered and REJECTED go in the jurisdiction's `notClaimed` list — published
//      as loudly as the claims. That list is the evidence the map was not padded.
```

Rule 5 is what turns an ordinary merge into an editorial problem. Half of the value in this dataset is prose explaining a refusal, written for a stranger who is checking my work. Prose is exactly the thing git is worst at merging and exactly the thing that cannot be checked by compiling.

## One: two agents, one id, and the only test that could see it

Two branches, `content/money-01-credit` and `content/money-02-banking`, were built in parallel by separate agents. Both needed to map Texas personal-finance standards. Both created a framework object in `src/lib/standards/data/tx.ts` with the id `tx-personal-financial-literacy`. The credit branch filled it with the §113.49 (c)(9) and (c)(10) family. The banking branch filled it with §113.49(c)(4)(C).

Neither branch was wrong. Neither branch contained the other. The bug did not exist until they were bundled, in a merge that reported seven conflicted files at once:

```
Merge branch 'content/money-02-banking' into bundle/personal-money-2026-08-28

# Conflicts:
#	scripts/seed-courses.ts
#	src/lib/research-checks.ts
#	src/lib/standards/claims.ts
#	src/lib/standards/data/il.ts
#	src/lib/standards/data/tx.ts
#	src/lib/standards/data/wv.ts
#	src/lib/standards/data/wy.ts
```

The resolution kept both framework objects. That is the correct instinct for an array of records, and here it produced two objects sharing one id. TypeScript is fine with it: an array of a type may contain two elements whose `id` fields are equal, because uniqueness of an id is not something a type can say. Lint is fine with it.

What caught it was the isolation test suite, and only sideways. The assertion is this, from `tests/isolation/standards.test.ts`:

```ts
  it("the full catalog surfaces every standard, and every course slug resolves", () => {
    const all = allAlignedCourseSlugs();
    const groups = scopeAlignments(catalog(...all));
    expect(summarizeStandards(groups).total).toBe(ALIGNMENTS.length);
```

That test was written to prove something else entirely: that the tenant-scoping layer does not silently drop a state's standards from the finder. A bare `toBe` with no message, so the failure prints as a pair of numbers. My commit message for the fix records what they were:

> the isolation suite caught it in the only way that shows: scopeAlignments surfaced 1582 alignments against 1576 in ALIGNMENTS, and the matrix had six duplicate row ids.

Being honest about provenance: those numbers are in the commit message and in my handoff notes for that day, not in a captured test log. The arithmetic is consistent, which is the check available to me now. The merged framework carries six codes, a duplicated framework id makes the scoping pass emit those six alignments twice, and 1576 + 6 = 1582, with six duplicate rows downstream in the matrix.

The fix, `fdb884c`, is small enough to describe exactly: one file, seven insertions, twenty deletions. Delete the banking branch's whole framework object, re-insert its single standard inside the credit branch's `standards` array. Frameworks went from 208 to 207. The commit message says the thing I want to remember about it:

> Nothing was wrong with either branch. The duplicate existed only in the merge, which is exactly what bundling is for.

## Two: the same bug, from a rebase, in a form a test could name

A day later Georgia got the same shape of collision from a different mechanism. Two courses, MONEY-04 and MONEY-06, both claimed Georgia's SSEPF9. Restoring an object header while resolving a rebase conflict left two entries for the same code inside one framework.

This one the suite could name, because a standard has a code and a code is unique within its framework by design:

```ts
  it("no duplicate code within a framework", () => {
    const seen = new Set<string>();
    for (const a of ALIGNMENTS) {
      const key = `${a.frameworkId}::${a.code}`;
      expect(seen.has(key), `duplicate ${key}`).toBe(false);
      seen.add(key);
    }
  });
```

The failure message was `duplicate ga-ssec::SSEPF9`, which points at a file, a framework and a line. Twelve lines changed to merge the two entries into one carrying all six claim ids.

Compare the two failures. Same underlying mistake, two entirely different diagnostic experiences, and the difference is whether the record type carries a field the test can key on. That is a data-modelling decision made months earlier, and it decided how expensive a merge bug in August would be to find.

## Three: the one that is still in `main` as I write this

Which brings me to a bug I found while writing this post, and have not fixed.

`src/lib/standards/data/ga.ts` currently contains two entries in its `notClaimed` list with byte-identical headings, at lines 537 and 541:

```
      heading: "Economics — most of the personal-finance course, macroeconomics, and the market-structure standards.",
```

The bodies are long, near-identical, and divergent. One of them records that SSEPF3, SSEPF9, SSEPF2 and SSEPF10 are now claimed and that SSEPF9 grew again when the retirement course shipped. The other records that SSEPF3, SSEPF9 and SSEPF1 are now claimed and that SSEPF1 arrived with the housing course. Both are true. Neither is complete. A Georgia teacher reading that page today gets the same rejection explained twice, in two versions, and has no way to know which one is current.

Here is why nothing caught it, and it is the whole point of this post. This is the type:

```ts
export interface NotClaimedItem {
  heading: string;
  body: string;
}
```

There is no id. There is no code. There is nothing for a uniqueness assertion to key on, so the invariant "a state does not publish the same rejection twice" is not merely unenforced, it is currently inexpressible. The type checker is satisfied. Both lint ratchets are satisfied. All the isolation tests pass, including the two above, because a rejection note is not an alignment.

The half of the dataset that a teacher actually reads as prose is the half with no key.

## Four: keep both sides is wrong when both sides edited the same sentence

The deepest one is West Virginia, and it is the reason I no longer think of these as merge conflicts at all.

West Virginia moved its ten personal-finance standards into an appendix, numbered 1 through 10 with no code prefix. Our file carries one sentence saying how many of the ten the catalog now claims and which. Two branches edited that sentence on the same day.

The first, from a fixes branch at 20:47:

> **Three of the ten are claimed. Item 7, consumer debt, is partial and carries MONEY-01's comparison method plus MONEY-04's pay-day loans and rent-to-own. Item 8, the savvy consumer, is full across all three of its parts. Item 9, banking services, is partial and comes from MONEY-02**; ... The other seven are postsecondary cost, income and lifestyle, careers, workforce preparedness, bankruptcy, taxes, and investing and insurance, none of which this catalog teaches.

The second, from the taxes course branch at 21:28:

> **Of the ten, three are now claimed: item 7 on consumer debt, item 8 on the savvy consumer, and, from 2026-08-29, item 6 on income tax forms**, which MONEY-05 (`taxes-and-filing`) reaches NARROWLY and whose own entry says exactly how far. The other seven are postsecondary cost, income and lifestyle, careers, workforce preparedness, bankruptcy, banking services, and investing and insurance, none of which this catalog teaches.

Read those two lists carefully. The first says items 7, 8 and 9. The second says items 7, 8 and 6. The second explicitly lists **banking services** among the seven that are *not* claimed, which the first branch had just claimed as item 9.

Now consider what any resolution strategy can do with that.

**Take mine.** Item 6 disappears, and a teacher looking for the tax standard is told the catalog does not teach it, while a whole eighteen-lesson tax course sits in the catalog.

**Take theirs.** Item 9 disappears, and banking is published as not taught while the banking course teaches it.

**Keep both.** The file now contains two sentences, one saying three items are claimed and naming 7, 8, 9, the other saying three items are claimed and naming 7, 8, 6, and the second one flatly asserts that item 9 is not taught.

**And the correct answer appears in neither side.** Four of the ten are claimed. The resolved text, which is what is in the file today:

> **FOUR of the ten are claimed.** Item 6, income tax forms, is a narrow partial from MONEY-05 ... Item 7, consumer debt, is partial ... Item 8, the savvy consumer, is full across all three of its parts. Item 9, banking services, is partial and comes from MONEY-02 ... **The other six** are postsecondary cost, income and lifestyle, careers, workforce preparedness, bankruptcy, and investing and insurance ...

Note the knock-on that no diff tool would have prompted anyone to make. Both sides said "the other seven." The union is four claimed, so the remainder is six, and the list of six had to lose an item from each side's list. The word "seven" appears in both versions of the conflict and is wrong in the resolution.

That is the argument in one artifact. **A merge tool can restore syntax. It cannot restore meaning.** Where two branches edit the same sentence about the world, there is no combination of the two texts that is correct, because the correct text is a third one that states a fact neither branch knew.

## What I do differently now

**Give every curated record a key, even the prose ones.** A rejection note with a stable id costs one field and buys a uniqueness test, a stable anchor link, and a diff that shows an edit as an edit rather than as an addition. `NotClaimedItem` will get one, and the Georgia duplicate is what finally convinced me.

**Write the invariant test before the second author arrives.** The duplicate-code test existed and turned a Georgia collision into a one-line failure message. The duplicate-id case had no test of its own and had to be inferred from a count. The rejection notes have neither. Every one of those three outcomes was decided long before the merge.

**On a prose conflict, do not resolve. Recompute.** My rule now: when both sides have edited the same sentence of published prose, close the diff, read both branches to find out what each one actually did to the catalog, and write the sentence again from the current state of the world. The counting habit I already had from [array-literal merges](/blog/what-parallel-agents-cost) turns out to apply to sentences too. "Three plus one is four, so the remainder is six" is arithmetic somebody has to actually do.

**Prefer a framework that already exists on `main`.** After the Texas duplicate I put that in every brief, in these words: prefer frameworks already on `main`, and say loudly if you must create one. It did not prevent the Georgia SSEPF9 collision. An instruction to a parallel agent cannot see the other agent's branch, which is the entire thesis of [the first post I wrote about this repository](/blog/guards-beat-instructions).

## What is still wrong

The Georgia duplicate is live. Two states, West Virginia and Illinois, still carry non-personal-finance claims citing document versions that have since been renumbered. The West Virginia file measures its own damage in a header comment and deliberately does not fix it:

> Fourteen of the twenty did not; six did, and two of those six matter ... This is NOT fixed here on purpose: repairing it means re-transcribing the Civics and Economics entries from the current rule and re-deciding coverage on each, which is a pass of its own. The check stays open and now carries a measurement instead of a suspicion.

A standards page that is wrong in a way I have written down is a different thing from one that is wrong in a way I have not. It is not a better thing. It is just the one I can schedule.

Next: [I ran a merge and a rebase against the same branch on the same day](/blog/rebase-versus-merge-measured), and the difference was not subtle.
