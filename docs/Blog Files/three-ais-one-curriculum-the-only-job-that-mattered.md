<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Used Three AIs to Build a Curriculum. Eight of Ten Citations From One of Them Were Fabricated.
Slug:    three-ais-one-curriculum
Excerpt: Perplexity and Gemini did the searching. Claude did the checking. When
         I spot-checked ten PubMed IDs from a Gemini research pass, eight
         pointed at real papers about entirely different science. Here is the
         pipeline that caught it, what verification actually costs, and why
         the checking agent is the only one whose output I trust.
Tags:    AI Agents, Multi-agent, Curriculum Design, Verification, Citations, Research, WitUS
Series:  Building the WELL Program (1 of 3)
-->

# I Used Three AIs to Build a Curriculum. Eight of Ten Citations From One of Them Were Fabricated.

I am building a wellness-coaching program for myself. Nine courses, 112 lessons, about 62,000 words of prose, every claim tied to a primary source. It is private for now, and I am its only student, which is exactly why I want it to be correct rather than impressive.

I used three AI systems to build it. Perplexity and Gemini for research. Claude for verification and authoring. That division of labor was a guess when I started. It is now a rule, and this post is the evidence that changed it from one to the other.

## The pipeline, in one paragraph

Every course starts as a **dossier**: a file with five fixed sections. Section 1 is the raw export from a research tool, with the tool and date noted. Section 2 lists the sources as that tool claimed them. Section 3 is a verification log, where each claim gets checked against its actual primary source and marked verified, corrected, replaced, or unverifiable. Section 4 holds only the claims that survived. Section 5 holds the ones that did not, with the reason.

**Only Section 4 may enter a lesson.** That is the whole architecture. Everything else is bookkeeping designed to make the rule enforceable.

The verification log is the section that does the work, and it is deliberately boring:

```markdown
## 3. Verification log

| # | Primary URL actually read | What it actually supports | Verdict |
|---|---|---|---|
| 1 | pubmed.ncbi.nlm.nih.gov/26832439/ | Constrained TEE; 332 adults; plateau at the high end | verified |
| 2 | pubmed.ncbi.nlm.nih.gov/35174010/ | 83% / 58% / 37% adverse events, NOT "essentially no risk" | corrected |
| 3 | (none found)                       | claim as given matches no paper I can locate       | unverifiable |
```

- `verified` means the primary says what the claim says.
- `corrected` means the primary says something adjacent, and the corrected version is what moves to
  Section 4.
- `replaced` means the claim was right but the citation was not.
- `unverifiable` means it does not enter a lesson at all.

That last verdict is the one people skip, and it is the one that keeps the file honest.

## The spot check

Late in the process I ran an adversarial review pass (that is post 2 in this series). It produced a long list of "you omitted this paper" findings, each with an author, a year, a journal, and a PubMed ID.

PubMed IDs are checkable. NCBI runs a free API that turns a PMID into a record. So before acting on any of it, I resolved ten of them.

**Eight came back as real papers about entirely unrelated science.**

| The PMID I was given | What it actually is |
|---|---|
| 26832443 | NuMA phosphorylation and spindle orientation |
| 22029761 | RNAi overexpression toxicity |
| 12127713 | Linezolid against MRSA |
| 23589320 | Vapor-phase nanotube growth |
| 34000382 | Membrane curvature elastic energy |
| 37679070 | Bacillus cereus detection in rice products |
| 29882260 | Galli-Galli disease |
| 33427509 | Knee-ligament finite-element modelling |

One was correct. One more was correct but described wrongly.

### The check, in one command

This is the whole verification step. NCBI's E-utilities API turns a PubMed ID into a record, free, no
key required:

```bash
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=26832443,26832439" \
  | python3 -c "
import json,sys
d = json.load(sys.stdin)['result']
for i in d['uids']:
    r = d[i]
    print(f\"{i}  {r['source']} {r['pubdate']}  {r['title'][:78]}\")
"
```

```
26832443  Curr Biol 2016 Feb 22  NuMA Phosphorylation by Aurora-A Orchestrates Spindle Orientation.
26832439  Curr Biol 2016 Feb 8   Constrained Total Energy Expenditure and Metabolic Adaptation to Physical Acti
```

Look at what those two lines share. **Same journal. Same month.** The identifier I was handed missed
by four, and landed on a real paper published two weeks later in the same issue window of *Current
Biology*. That is why the failure is invisible at a glance: the wrong answer is not far-fetched, it
is adjacent.

To check a batch, the same call takes a comma-separated list:

```bash
ids="26832443,22029761,12127713,23589320,34000382"
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=$ids" \
  | python3 -c "import json,sys; d=json.load(sys.stdin)['result']; [print(i, d[i]['title'][:70]) for i in d['uids']]"
```

Ten identifiers, one round trip, about two seconds. That is the entire cost of the step that caught
eight fabrications.

Here is the part that should worry you more than a hallucinated link would. **These are not dead links.** Every one resolves. Every one returns a real paper, in a real journal, with real authors. If you click it and glance, you see a citation that exists, and you move on. A 404 announces itself. This does not.

## The failure mode is more specific than "AI makes things up"

When I looked up what the papers *should* have been, the pattern was unmistakable:

- Pontzer's constrained-energy-expenditure paper: I was given **26832443**. The real one is **26832439**.
- Sumithran's hormonal-adaptation paper: given **22029761**. Real: **22029981**.
- Woollacott on dual-task gait: given **12127713**. Real: **12127181**.
- Peppard on sleep-apnea prevalence: given **23589320**. Real: **23589584**.

Off by a handful of digits, every time. The model knows the paper exists. It knows roughly where in the numbering space it lives. It cannot retrieve the identifier, so it generates one that looks right.

That is a different problem from invention, and it needs a different defense. You cannot catch it by asking "does this paper exist?" — it does. You can only catch it by asking "does *this identifier* point at *that paper*?" That question requires a round trip to an authority, which is a thing software does and a language model does not.

## The correction I had to make to my own finding

I published the list above internally and flagged one entry as fully fabricated: a 2021 Keller paper on habit formation that I could not find at all.

Then I asked for the PDF, and it arrived. **Keller, J., Kwasnicka, D., Klaiber, P., Sichert, L., Lally, P., & Fleig, L. (2021).** *British Journal of Health Psychology, 26*(3), 807–824. PMID 33405284. Real paper, good paper, now cited in my course.

My search missed it because I searched the *description* I had been given rather than the author list — and the description was wrong. It had been characterized as a paper about executive-function limits on habit formation. It is actually an 84-day randomized trial (N = 192) that found a median of **59 days** to peak automaticity, **no difference** between routine-based and time-based cues, and **repeated plan enactment** as the thing that predicted automaticity.

So the verification layer caught a fabricated identifier and then produced a false negative of its own, because I let a wrong description steer a search. Both errors are now in the record. The second one is mine.

That finding, incidentally, is the most useful thing the whole review surfaced. If cue *type* doesn't matter and enactment *frequency* does, then a coach who spends three sessions helping someone find the perfect anchor has bought nothing that showing up eighty times wouldn't have. It is now in the lesson, with its correct PMID.

## What this costs

Honest accounting, because "use AI to build a course" gets sold as a speed play and it is not one.

**Generation is the cheap part.** A research pass on a topic returns something usable in minutes. Drafting a lesson from verified material is fast.

**Verification is the expensive part, and it does not compress.** Every load-bearing claim needs a round trip to a primary source. For the WELL program that meant reading statutes (Michigan's Public Act 39, Colorado's C.R.S. 12-245-217, Indiana's dietetics code), pulling PDFs of certifying-body handbooks, and running NCBI queries one identifier at a time. There is no model you can point at that step that removes it, because the model is the thing being checked.

**The ratio is not what people expect.** Across this build, checking has taken longer than writing. Not by a little.

**And some of it is thrown away.** Fourteen of twenty-two claims in the adversarial pass turned out to describe things the lessons already said. That verification work produced no content at all. It was still worth doing, because the alternative was acting on eight of them.

## What I would tell someone starting this

**Separate the roles, and never let one model grade its own work.** Discovery and verification are different jobs with opposite failure modes. A discovery tool is rewarded for producing something. A verification step has to be willing to produce nothing.

**Verify identifiers mechanically, not conversationally.** Ask an API, not a model. PMIDs, DOIs, statute sections, and case citations are all checkable against an authority for free. If a claim's locator cannot be resolved by software, treat the claim as unsourced no matter how confident its prose is.

**Write the correction into the artifact.** My orientation course has a lesson that says, in the body text a student reads, that an earlier draft recorded four named therapy modalities and the current source names five. That is not self-flagellation, it is the trust signal. A curriculum that shows its corrections is more believable than one that pretends it never needed any.

**Assume the checking layer is also wrong sometimes.** Mine was, about Keller, and it took a human handing me a PDF to find out.

---

*Next in this series: I paid an AI to attack the curriculum I'd just built. Then I had to fact-check the attack, and its central criticism turned out to be backwards.*
