<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Agents Made the Content Cheap. Checking It Is Still the Whole Job.
Slug:    verification-is-the-bottleneck
Excerpt: Ten courses in one bundle, 2,536 questions, built by five agents in
         parallel over a weekend. The expensive part was none of that. It was
         deciding what the catalog would refuse to say, and building two lists
         so a claim nobody could confirm cannot quietly ship as prose.
Tags:    AI Agents, Verification, Citations, Research, Curriculum Design, Trust, WitUS
Series:  Building an LMS With Agents (3 of 4)
-->

# Agents Made the Content Cheap. Checking It Is Still the Whole Job.

A previous series covered the moment I stopped trusting AI research output: [eight of ten PubMed IDs from one model's pass](/blog/three-ais-one-curriculum) resolved to real, live papers about entirely unrelated science. Not 404s. Real papers, wrong ones, off by a few digits.

That was a curriculum. This post is about what happened when I scaled the same workflow to a 260-course catalog, and it has one finding: **generation got roughly an order of magnitude cheaper and verification did not get cheaper at all.** Everything below is the machinery I built because of that.

## What "cheap" now looks like

One merge bundle from 2026-08-22: ten new courses, 2,536 pooled questions, built in parallel by five agents in isolated git worktrees over a weekend. Every course passing a structural audit with zero findings.

At that rate, the bottleneck is not writing. It is that a course which sounds authoritative and is wrong is worse than no course, and sounding authoritative is the one thing these systems are reliably excellent at.

## The single most useful instruction in every brief

Every agent brief carried the same non-negotiables: the assessment spec, the quiz rules, no em dashes, APA sources per lesson, and never invent a source. Then one more:

**Report back what you refused to state, and why.**

That instruction did more for the catalog's credibility than any guard I have written. Here is a genuine excerpt from the merge task for that ten-course bundle, `plans/user-tasks/284-merge-bundle-courses-wave-2026-08-22.md`, under a heading reading "The part worth reading: what these courses refuse to say":

- **No Mellody Hobson course, and no Hobson quote anywhere.** A financial-literacy line attributed to her in my own content calendar could not be sourced to her. Two more of the same kind turned up in the same calendar. Filed at high severity, and the calendar still carries the attribution, which is mine to fix.
- **Morgan did not invent the traffic light.** Wire, Salt Lake City, 1912; Hoge applied 1913. Morgan's patent added the three-position warning state, which is what the course now teaches.
- **Latimer did not invent the bulb or its filament. Carver did not invent peanut butter. Drew was not refused a transfusion**, he was treated by white surgeons who recognised him.
- **"An enslaver could patent his slave's invention" is wrong**, and the truth is worse: the 1858 holding made the invention ownable by nobody.
- **Greenlee Field's famous $100,000** appears as a promoter's claim against $40,000 in building permits. **No Satchel Paige sale price** (two SABR pages contradict each other). **No figure for Rube Foster's cut** (four sources, four accounts).
- **No SAG-AFTRA self-tape numbers** in the acting course: the union's site refuses automated fetches, trade press is not primary for contract terms, and the terms renegotiate every cycle.

Roughly twenty of those became structured entries in a file rather than staying as prose caveats. That distinction is the rest of this post.

## The problem with a hedge

The honest thing to do with an unconfirmable claim is hedge in the lesson: "verify before relying on this." I did that for weeks. It is honest and completely unactionable, for reasons written into the top of `src/lib/research-checks.ts`:

```ts
// THE PROBLEM THIS SOLVES. This catalog's rule is that every claim is cited. Some claims can only be
// pinned by someone with access Claude does not have: a paywalled code section, a phone call to a
// county clerk, a regulator who answers email, a trade body's current standard behind a login. Until
// now those were prose caveats inside a lesson ("verify before relying on this"), which is honest and
// unactionable: no list exists, nothing records whether it was ever done, and the hedge ships to
// learners forever.
```

The last four words are the failure. Nobody schedules the act of going back through 2,894 lesson bodies looking for sentences that hedge.

So there is now a rule, and it is the one rule in this project I would keep if I had to throw out everything else: **whenever you write a hedge you cannot resolve, file a check.** A hedge in a lesson with no check filed is a hedge nobody will ever clear.

## What a check looks like

Not a TODO. A question somebody could actually answer in an afternoon. One entry, complete, from `src/lib/research-checks.ts`:

```ts
  {
    key: "ga-pay-direct-rule",
    course: "surplus-funds-basics",
    lesson: "surplus-georgia",
    quote:
      'Located funds must be paid directly to the owner and may not be paid to the finder, "whether pursuant to a duly executed power of attorney or otherwise"',
    title: "Georgia: must recovered funds be paid directly to the owner?",
    severity: "high",
    question:
      "Does O.C.G.A. § 44-12-224 (or a related provision) actually require that located property be paid directly to the owner and NOT to the finder, including under a power of attorney? Quote the operative sentence.",
    claim:
      "The course states, marked as reported rather than verified, that funds must be paid directly to the owner and may not be paid to the finder, 'whether pursuant to a duly executed power of attorney or otherwise.'",
    stakes:
      "This is the single most operationally consequential item in the course. If it holds, an operator cannot net their fee at source: they invoice and carry collection risk on every file, which changes cash flow, the contract and how much working capital is needed before the first fee arrives. Teaching the wrong answer sends someone into Georgia with a business model that does not work.",
    needs: [
      "The exact statutory sentence, quoted, with the code section and subsection",
      "Whether it applies only to property already delivered to the commissioner, or more broadly",
      "The URL of the primary source you read it in, and the date you read it",
    ],
    where: [
      "Georgia General Assembly's own code site, rather than Justia or FindLaw",
      "Georgia Department of Revenue unclaimed property program, which may state it plainly",
      "A call to the Georgia DOR unclaimed property office",
    ],
  },
```

Four fields carry the weight. `quote` is the verbatim hedging sentence, so the answer can be matched back to the text. `stakes` says who gets hurt if the current text is wrong, which is what makes triage possible. `needs` says exactly what closes it. `where` names primary sources first and says which secondary ones not to trust.

The file currently holds 94 checks: 13 high, 44 medium, 37 low. Counted this morning by grepping the file, which is the whole point of it being a committed TypeScript file rather than a wiki page.

The loop is: checks are committed here so the editorial call is reviewable in a diff. I answer them at `/admin/research`, which writes the answer to the database. The agent reads answers back with `pnpm research:list`, fixes the lesson, and deletes the check. The list shrinking is the progress bar.

## The second list, and the mistake that shaped it

Checks are the small hand-written queue. The big list is every source every staged course cites, so somebody can click through them. That generator has one design decision worth stealing, written at the top of `src/lib/citations.ts`:

```ts
// WHERE THE DATA COMES FROM. `pnpm gen:citations` reads `lessons.text_content` from the DATABASE for
// the staged courses and writes src/lib/citation-content/citations.ts, which this file imports.
// Reading the database rather than scripts/data/*-course.ts is the load-bearing choice: a large part
// of this catalog is not committed TypeScript. BVC episodes come from CSVs in the gitignored
// content/bvc/, health courses are generated, FAA and the languages have their own seeders. A
// generator reading only the committed course modules would cover about two thirds of the library
// and report success, which is the failure mode this whole feature exists to prevent.
```

A verification tool that silently covers two thirds of what you think it covers is worse than no verification tool, and the obvious implementation had exactly that shape. It would have been green from day one.

That was not hypothetical, either. The guard's own header records the near miss:

> The first version of the extractor read only bulleted entries and silently reported zero for three courses that plainly had references.

Which is why there is now a build gate that fails a staged course producing zero citations. A tool reporting nothing wrong and a tool that is not looking produce identical output.

## Two small decisions I would defend

**The citation key hashes the normalized entry text.** So reordering a Sources list does not disturb anyone's verification work, and editing a citation mints a new key that has to be re-verified. That is the opposite call from the quiz `questionKey`, which hashes the prompt so a reword does not destroy learner history. Same mechanism, opposite direction, and the difference is that a quiz attempt is a person's record while a citation check is a statement about the text as it stands today.

**A missing excerpt renders as missing.** Each citation carries the sentence in the lesson that cites it, because otherwise the reviewer is asked "does this source say what the lesson claims" while being shown only the source. When the matcher cannot find it:

```ts
   * ABSENT MEANS NOT FOUND, never "there is none". A course that cites in a style the matcher does
   * not recognise gets no excerpt and the reviewer follows the lesson link instead. Showing a
   * nearby-looking sentence would be worse than showing nothing: it reads as the lesson's own words.
```

The same rule governs the whole verification UI: a citation cannot be marked verified without saying what was found. A verified mark with nothing behind it stops anyone from ever looking again, which is worse than leaving it open.

## The honest state of it, today

This is the part a vendor would leave out.

```
$ pnpm check:citations
Citations: 1194 across 36 of 38 staged course(s); 125 registered course(s) not yet staged.
```

**1,194 citations are checkable. 125 registered courses are not staged at all.** The guard has a `UNSTAGED_FAILS` flag that turns "every registered course must be staged" into a build failure. It is set to `false`. Turning it on is the whole remaining job and I have not done it.

Beyond that, measured on 2026-08-25 and written up in `plans/73`:

| | |
|---|---|
| Course modules tracked in git | 252 |
| ...carrying a `## Sources` or `## References` block | 246 |
| ...whose bibliography contains at least one URL | 236 |
| Lesson bodies on disk | 2,894 |
| **Uncited lesson bodies** | **261 (9%)** |
| Courses with a bibliography containing zero URLs | 10 |

The bibliography backfill that closes those 261 is planned and has not started. One sources document in the catalog is marked in my own tracker as **not primary-source verified**, with a note that it must not be used publicly until it is. Five reads would fix it. They have not happened.

And none of the 1,194 citations are verified by me or by an agent. Verification is a grant: invited course auditors check their own course's sources at `/audit/citations`, and the permission that lets someone read an unvetted course is the same one that lets them check its sources, for that course only. Building the surface was a weekend. Getting humans to sit down with it is the actual project, and it has barely begun.

## What I would tell someone starting this

**Generation cost collapsed. Verification cost did not move.** Plan the budget around the second number, because the first one will keep tempting you to produce more material than you can ever check. Ten courses in a weekend is not a win if the checking queue grows by ten courses.

**Make refusal a deliverable.** "Report what you would not state and why" turned out to be the highest-value line in any brief I wrote. It converts a model's uncertainty from something it papers over into something it hands you.

**A hedge must become a row somewhere, or it is permanent.** Prose caveats feel responsible and are not, because nothing enumerates them and nothing records whether anyone ever followed up.

**Check what your checker cannot see.** The citation generator would have been green on day one while covering two thirds of the library, and the first extractor reported zero for three courses that plainly had references. Both times the tool said nothing was wrong. Both times it was not looking.

The last post in this series is about a different kind of silence: [four failures that no type checker, test, or guard could see](/blog/what-parallel-agents-cost).
