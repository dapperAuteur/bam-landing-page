<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Nineteen States Were Told We Taught Them Nothing
Slug:    fetch-or-do-not-cite
Excerpt: The rule is that a standard may be claimed only if its actual text
         was fetched from the publisher. That rule had a consequence I did
         not plan: nineteen jurisdictions published a note, in my catalog's
         own words, saying it taught no personal finance. Seven courses
         changed thirteen of them. The interesting part is what stayed
         refused, and the three errors we found in the states' own documents.
Tags:    AI Agents, Verification, Primary Sources, Education Standards, Research, Trust, WitUS
Series:  Standards, Conflicts and Sources (3 of 4)
-->

# Nineteen States Were Told We Taught Them Nothing

The first two posts in this series were about [conflicts in a curated dataset](/blog/conflicts-in-curated-data) and [the git operation to resolve them with](/blog/rebase-versus-merge-measured). This one is about where that dataset came from, and about a single rule whose cost I underestimated by a wide margin and would pay again.

Educators shop on standards coverage. So the LMS I have been building carries a state-standards finder: pick your state, see which courses meet which of your state's published standards, with the standard's own text next to the lesson that teaches it. There are 51 jurisdiction files, 209 frameworks and 1,597 alignments in it as I write this.

The rule that governs all of it is at the top of `src/lib/standards/index.ts`, and it is four sentences:

```
// ⚠️ THE RULE THIS MODULE LIVES BY — read before editing claims.ts, shared/*, or data/*.
//
// Every entry is a claim, made to teachers and to homeschooling parents who may file it with a
// state, about what a public education standard requires. A wrong or invented code is worse
// than no standards page at all. Therefore:
//
//   1. Every `code` and every `text` was FETCHED FROM THE PUBLISHER and transcribed verbatim.
//      `text` is the standard's own words — not a paraphrase, not a summary, not a memory.
//      If you cannot fetch it, you do not cite it. There is no "close enough".
```

Around the repository this gets shortened to "fetch-or-do-not-cite," and it appears in about twenty-five places. What follows is what it actually cost.

## The consequence I did not plan for

Rule 5 of the same block says rejections are published as loudly as claims:

```
//   5. Standards considered and REJECTED go in the jurisdiction's `notClaimed` list — published
//      as loudly as the claims. That list is the evidence the map was not padded.
```

Which means that for every state, the finder renders a section headed "What we don't claim," containing prose I wrote explaining what the catalog does not teach.

In August I went looking for what a personal-finance course track would be worth, and found that the answer had already been written down, by the catalog, about itself, nineteen times. From my planning note:

> **19 of those 51 jurisdictions name personal finance or financial literacy, every single one of them in a `notClaimed` entry, and every stated reason is that the catalog does not teach it.**
>
> ```
> ar az ga id il la ma nd ne nh nm nv ny oh ok pa tx wv wy
> ```

That is a floor rather than a ceiling: re-scanning while writing this post, the phrase turns up in three more files in passing. Texas's, from the commit that first mapped the Texas TEKS in July, read:

> "This catalog does no mathematics instruction, so it meets no Texas mathematics TEKS. **It also does no personal-finance instruction**, so the Personal Financial Literacy strands of Economics (§113.31(d)(15)-(20)) and the standalone Personal Financial Literacy course (§113.49) are not claimed."

So a Texas teacher opening the standards finder was told, in my catalog's own words, that it taught no personal finance. Nineteen states of that. Every one of those sentences was true when written, and every one was also a fully-specified brief: the state, the framework, the exact code range, and the reason. The reject list was a shopping list nobody had read as one.

Seven courses shipped over the following week. Thirteen of the nineteen now carry claims. Six still reject personal finance outright, honestly, because nothing has been built for them yet: Arkansas, Idaho, Massachusetts, Nebraska, New Hampshire and New Mexico.

## The interesting half is what stayed refused

A standards map is only worth anything if somebody could have padded it and did not. Three refusals are worth reading in full, because in each one there was an easy claim available and the reason for declining it is specific.

**Wyoming, refused as a partial on one word.** SS12.3.4 reads, verbatim:

```
text: "Explain how financial and government institutions make economic decisions (e.g., banking, investment, credit, regulation, and debt).",
```

Four of those five examples are taught. Investment was not. The note in `src/lib/standards/data/wy.ts`:

> "AND IT IS `partial`, NOT `full`, ON ONE WORD. Of the five parenthetical examples it teaches banking, credit, regulation and debt. It does NOT teach investment, and the honest call is to say so on the entry rather than to treat an "e.g." list as decorative."

And in the rejection note it superseded:

> "We record that as partial rather than full because a teacher planning against this benchmark needs to know which fifth of it they still have to cover, and **because treating an "e.g." list as decorative is how a claim gets quietly widened.**"

An `e.g.` list looks like decoration. It is a list of the things the state had in mind, and a course that skips one of five is not covering the standard.

**Georgia SSEPF3(d), refused despite naming the accounts.** The retirement course teaches 401(k) and 403(b) plans, traditional and Roth tax timing, vesting, and what a plan document governs. SSEPF3(d) is, in Georgia's whole framework, the one standard that names those account types explicitly. It was refused:

> "**SSEPF3(d) deserves its own line, because it is the only Georgia standard that names retirement accounts by type and it is still REFUSED**: it asks a student to evaluate the risk and return of savings and investment options including Roth IRAs, 401(k) and 403(b) accounts, stocks, bonds, 529 accounts and mutual funds, and to explain the importance of diversification. MONEY-07 teaches the account wrappers and none of the risk, return, product or diversification content that element asks for, and claiming it on the strength of the three account names inside it would be exactly the widening this module forbids."

The three account names are inside the standard. The standard is not about the accounts. It is about risk, return and diversification, and that course deliberately teaches none of those, because it names no product and gives no advice.

**Texas, four expectations refused because they ask for advice.** From `src/lib/standards/data/tx.ts`:

> "**STILL REFUSED, AND REFUSED ON PURPOSE RATHER THAN FOR WANT OF CONTENT.** §113.49(c)(5)(A), (c)(5)(B) and (c)(5)(D) each ask a student to DEVELOP a saving or investing strategy, short-term, intermediate-term or long-term, and §113.49(c)(7)(C) asks them to understand the importance of saving early and at a sufficient level. MONEY-07 states in prose in three separate lessons that it gives no financial advice, names no product or provider, states no savings rate and projects no return, so a claim on any of those four would misdescribe the course to a teacher."

Three of those four are "develop a strategy"; the fourth is about the importance of saving early, refused on the same ground. A fifth, §113.31(d)(17)(A), asks students to assess ways to be a wise investor including developing a personal retirement plan, and went the same way.

That is a hard refusal to make, because Texas is the largest market on that list and those are exactly the standards a school would search for. A course that will not tell a student to save cannot claim a standard that asks the student to plan their saving, and pretending otherwise would be discovered by the first teacher who taught from it.

## Three errors in the states' own documents

I did not expect this. Reading fifty-one states' standards word by word turns up mistakes in the published standards.

**Georgia names a statute that does not exist.** SSEPF9 element (c), verbatim from the Georgia *Personal Finance and Economics* framework, course code 45.061, footer dated 9 December 2021:

> Explain the primary purpose of important consumer legislation (i.e., the Truth in Lending Act, Fair Debt Collection Practices Act, Fair Credit Reporting Act, **the Equal Housing Act**, and the Dodd-Frank Act).

There is no Equal Housing Act. The statute is the Fair Housing Act, Title VIII of the Civil Rights Act of 1968. "Equal Housing Opportunity" is the slogan on the little logo, not the name of a law. The research note records the resolution, which is the only correct one:

> **Quote Georgia's text verbatim in any claim, but the course must not repeat the error as if it were the statute's name.** This is exactly the kind of thing this catalog exists to catch, and it is in a state standard rather than in a secondary source.

**Illinois prints a typo and a placeholder.** From `src/lib/standards/data/il.ts`:

> "TRANSCRIPTION NOTE, PRESERVED AND NOW CORROBORATED. **ISBE's published PDF prints FL.2's code as "S.9-12.EC.FL.2.", with a single S, for that one code alone. It is a typo in the state's document.** We do not claim FL.2, so the malformed code does not appear below; it is recorded here so a later editor who meets it in the PDF knows it was seen. **A SECOND, INDEPENDENT EXTRACTION on 2026-08-29 reproduced the whole strand, FL.1 through FL.9, and returned both that single-S code and "SS.9-12.EC.FL.6. No standard." character for character, so neither is a reading error on our side.**"

FL.6 is printed in the state's own framework as "No standard." A transcription of a state document that contains a surprise is exactly the situation where you assume the error is yours, so the second extraction is the part of that note I would keep.

**West Virginia, where the file contradicted itself and both halves were right.** This is my favourite thing in the whole dataset.

The West Virginia file's header said the current rule runs the Civics course to SS.C.37 only, and that SS.C.38 does not exist. The same file's framework carried a claimed SS.C.38 entry with verbatim standard text. Both were published to teachers. One of them had to be wrong.

The rule was re-fetched to settle it, and the answer was not one or the other:

> "the evidence is unambiguous in two directions at once. **First, the current rule contains exactly thirty-seven SS.C codes, SS.C.1 through SS.C.37, and no more; there is no SS.C.38 anywhere in it. Second, the text that had been filed under SS.C.38 ("Utilize traditional and online banking services ...") is printed verbatim as APPENDIX A ITEM 9.** So the standard is real and the catalog does reach it; only the locator was retired."

West Virginia moved its ten personal-finance standards out of the numbered Civics sequence and into an appendix, where they are printed as items 1 through 10 with no code prefix at all. The claim was correct about the standard and wrong about its address. It was moved rather than deleted, and where it used to sit there is now a comment saying where it went.

The general lesson is one I keep relearning. Two statements that contradict each other are not necessarily one true and one false. They are sometimes two true statements about different things, and the way to find out is to open the document.

## What fetch-or-do-not-cite actually costs

Agents hit HTTP 403 constantly. State education departments and federal statistics sites sit behind bot protection that returns 403 to anything scripted, and every one of those is a decision point.

**Arizona.** From `src/lib/standards/data/az.ts`:

> "Provenance: **www.azed.gov and cms.azed.gov refuse connections from our tooling (HTTP 403)**, so every ADE document was retrieved through the Wayback Machine and transcribed from the archived copy"

That one has a good answer: the Internet Archive's byte-faithful snapshot of the exact URL recorded as the source, with the fetch date on the framework.

**The Bureau of Labor Statistics.** Here the answer was to publish nothing. From a research check attached to the cash-flow course:

> "The course publishes NO distribution figure. **The omission is deliberate: the BLS page refused automated retrieval when the lesson was written on 28 August 2026, and the fetch-or-do-not-cite rule then forbids the number.**"

The check that records this names the human step that would close it: open the page in a browser, because automated fetches return 403.

**Social Security.** Not a 403, but the same shape of problem, and the honest version of it in the research check:

> "The Social Security Administration publishes its own recurring analysis of income of the aged, and this course cites a congressional analysis of a different survey instead, **because the agency's site would not serve its pages to the tool used to write the course.** A primary-source figure would be the better citation for the same claim even if the number does not move."

A cited secondary source with the reason for the substitution written down is a very different artifact from a citation that quietly points at the wrong document.

**Two figures downgraded rather than dropped.** A trade-press article about a doctoral program returns 403 and redirects; the lesson names the outlet and the author, says no methodology is published with the figure anywhere, records that the article was not read in full, and refuses to print the number as a count. Two Negro Leagues figures come from a page that 403s, so they are marked in the lesson as attributed rather than verified, which is a different claim from either printing them or omitting them.

**And a PDF that was a picture.** West Virginia's policy document:

> "SOURCE FORMAT NOTE. **The PDF at the policy URL is a 59-page SCAN with no text layer.** The verbatim text below was transcribed from **the machine-readable DOCX the same WVBE policy viewer serves at that URL with `&alt=1`**. Same policy, same words, readable encoding."

Same source, same publisher, a different representation that can actually be read. West Virginia's science standards got the opposite outcome from the same problem: the only retrievable copies are image-only scans, so science is deferred and claims nothing.

## What the rule buys

Four kinds of thing, and only the first is obvious.

**Every claim is checkable by the person it is made to.** A teacher can put the finder next to their own state's document and compare.

**The refusals are load-bearing.** 379 rejection entries across 51 jurisdictions, each naming codes and giving a reason, are the evidence the map was not padded. A standards page with no rejections should not be believed.

**A gap becomes a specification.** Every one of those nineteen rejection notes named a framework and a code range. That is why seven courses could be scoped in an afternoon: the hard analysis of "which framework, and roughly what does it require" was already done, by a previous refusal.

**You find the errors.** Nobody reads a state's standards document end to end except somebody transcribing it verbatim. A paraphrase would have quietly corrected Georgia's Equal Housing Act into the Fair Housing Act and never noticed.

## The honest state of it

Every number below I measured today.

**The dataset carries defects I have not fixed.** Wyoming's SS12.3.4 is claimed in two different frameworks with two different notes that disagree about whether credit and debt are taught. Georgia has two rejection entries with identical headings and contradictory bodies, [which the previous post is about](/blog/conflicts-in-curated-data). Georgia's own note repeats "the Equal Housing Act" as if it were a statute, without the flag that sits in my planning file. West Virginia's rejection list still says three appendix items are claimed while the framework above it claims four.

**Two states show two editions at once.** Illinois and West Virginia both re-fetched one framework and left the rest citing a superseded document. Both are filed as high-severity research checks. Illinois's own file says it plainly:

> "**SO ILLINOIS CURRENTLY SHOWS THE SAME TEACHING TWICE, UNDER TWO EDITIONS OF THE SAME STRAND**, and that is not a state of affairs to leave standing ... it is deliberately NOT patched here, because moving those two entries means re-reading the whole 2017-cited half of this file against the current document rather than editing two lines."

**The coverage guard's own bookkeeping is out of date.** `pnpm check:standards` reports 169 of 269 courses aligned and 100 unmapped with zero unaccounted for, so the excuse list now carries a hundred courses. Its header comment still describes the list as holding 35.

**And the content gaps are larger than the standards gaps.** 495 lessons in the catalog are taught and never assessed by a question. 239 lesson bodies carry no sources block at all.

None of that is an argument against the rule. It is what the rule looks like when it is running: a list of specific, named, checkable things that are wrong, instead of a page that looks complete.

The last post in this series is about the input to all of it: [three times my own brief was wrong](/blog/when-the-brief-was-wrong), and what corrected it was opening the statute.
