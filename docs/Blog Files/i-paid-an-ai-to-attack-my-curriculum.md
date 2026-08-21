<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Paid an AI to Attack My Own Curriculum. Its Main Criticism Was Backwards.
Slug:    ai-adversarial-curriculum-review
Excerpt: I handed an 80,000-word course outline to a second AI and asked it to
         find everything missing. It came back with a confident structural
         critique built on exam weights that do not exist in any document I
         can find, and 14 of 22 "omissions" were already in prose it had not
         read. It also found four real gaps. Here is how to tell those apart.
Tags:    AI Agents, Multi-agent, Curriculum Design, Verification, Evals, Red Teaming, WitUS
Series:  Building the WELL Program (2 of 3)
-->

# I Paid an AI to Attack My Own Curriculum. Its Main Criticism Was Backwards.

Having built a nine-course wellness-coaching program, I wanted to know what I had missed. So I did the obvious thing: generated a complete outline of all 112 lessons — titles, key claims, vocabulary, sources, self-check questions, about 80,000 words of it — handed it to a different AI than the one that helped build it, and asked four adversarial questions.

1. What would a board examiner say is missing?
2. Attack the evidence: what is misread, overstated, or omitted?
3. Attack the assessment: what does it fail to test?
4. Attack the learner's experience: where would someone stall?

It produced a lot. Roughly 130 KB of findings. Reading it cold, it was devastating: a program with structural non-compliance, misread case law, and coverage gaps across the credential it benchmarks against.

Almost none of the first half survived checking. The second half changed how I build assessments.

## The central criticism, and why it inverted

The headline structural finding was that my program mis-allocates its attention. It asserted the certifying board's exam has **five domains** weighted 25/15/25/15/20, and that my largest course — 26 lessons on coaching psychology — is "over-allocated at ~35%" against a domain worth 15%.

That is a specific, falsifiable claim, so I went to check it.

I ran a regex sweep for percentage ranges across the entire 2026 program-approval handbook. **Zero matches.** No exam weights appear in that document at all. The weighting document I had actually verified earlier — the published content outline — lists **four** domains, not five:

| Domain | Weight |
|---|---|
| Coaching structure | 17–23% |
| **Coaching process** | **47–53%** |
| Health and wellness | 17–23% |
| Ethics and legal | 7–13% |

Coaching process is roughly **half the exam**. The criticism was that I had over-invested in the thing the board weights most heavily. The proportion is defensible exactly as built.

I could not verify the five-domain numbers against any source. The handbook does organize *instructional hours* into "Content Areas 1–5," so a five-part structure exists — for a different purpose, with no percentages attached. That is the sort of near-miss that produces a confident wrong answer: two real things, fused.

Three more findings collapsed the same way. "No instruction regarding ethical use of AI" — false, a `grep` found the lesson teaching the November 2025 ethics-code disclosure clause. "Instruction in CBT-I protocols verges on clinical practice" — the sleep course's first lesson says CBT-I "requires clinical licensure… the effective thing is not yours." And an extended section on failing to meet program-approval standards attacked a claim the program never makes; its first lesson states it is independent, unaccredited, and grants no credential.

## Fourteen of twenty-two "omissions" were already taught

The evidence-attack prompt listed papers I had supposedly ignored. I checked each against the actual lesson text rather than the outline.

Fourteen of twenty-two were already in the prose. It "corrected" me for not noting that a legal case was a procedural standing ruling — my lesson says "the court decided he could SUE, not that he had won." It flagged that a meta-analysis rated its own evidence low-certainty — my lesson quotes that rating. It said I'd overstated a social-connection finding as "exceeds smoking" — my lesson uses the source's own "comparable with."

The reason is mechanical and worth naming: **it reviewed an outline, and outlines contain claims without their caveats.** A bolded beat says what a lesson argues. The paragraph underneath says what it hedges. Give a reviewer only the first and it will reliably tell you to add the second.

If I ran this again I would feed it lesson bodies, not an outline, and accept the token cost. The outline was a false economy that generated fourteen findings' worth of work producing nothing.

## What it actually found

Four things, and I verified all four before believing them.

**Real gaps against the credential.** It claimed I omit social determinants of health, health literacy, cultural humility, and power dynamics. I went to the handbook's own competency text and found them: 3.9.9 "Adapt goals or action plans to address the impact of social determinants of health." 3.8.5 "Consider how health literacy and numeracy impact client's health." 1.2.2.2 "Recognize power and privilege imbalances." 1.2.2.3 "Practice cultural humility." Then I grepped my nine courses. **Zero hits, all four.** That is a real hole and it is now a planned tenth course.

It also flagged "group coaching" and "implicit bias." Neither term appears anywhere in the handbook — zero hits each — so neither can be justified as a coverage gap against that credential. They are going in anyway, because I want them, but framed honestly as practice beyond the credential rather than exam coverage. Knowing which is which matters.

**Genuine evidence gaps.** Eight papers were real, on-topic, and genuinely absent from my lessons. Pontzer's constrained energy expenditure. Sumithran's hormonal adaptations to weight loss. A Cochrane review of 61 low-carb trials. Britton on meditation-related adverse effects. Five are now written into lessons. (Their PMIDs were mostly wrong; see post 1.)

**An assessment critique that held up completely.** That is post 3.

**A structural argument that needed no citation at all.** It observed that nothing in my program assesses above "knows how" on Miller's pyramid — no role-play, no live session, no observed practice. I checked: `role-play`, `volunteer client`, `practice client` return zero hits program-wide, and the capstone artifact is defined as a *self*-coaching session. The argument follows without any evidence: a relational skill cannot be demonstrated against yourself. That one required no verification because it made no factual claim.

## The pattern: which criticisms survive

Sorting 130 KB of findings into keep and discard, one variable did nearly all the work.

**Criticisms that cite an external fact mostly failed.** Exam weights, effect sizes, paper identifiers, what a source "actually says" — these were confidently wrong at a high rate, and every one had to be resolved against a primary before it could be used.

**Criticisms that reason about structure mostly held.** No live-practice assessment. Terminal sections without quizzes. A self-coached capstone cannot test a relational skill. These make no factual claim, so there is nothing to fabricate. I could verify them against my own repository in minutes, and they were right.

If I were designing this review again, I would ask only structural questions of the reviewing model and keep the evidence questions for tools that can actually retrieve.

## Costs, plainly

**What it cost:** one generation pass, plus roughly a day of verification. The verification was the expensive half, and most of it was thrown away on findings that were wrong.

**What it bought:** four real problems I would not have found alone, one of which — the assessment gap — was serious enough to become the next several weeks of work.

**Would I do it again:** yes, with two changes. Feed it prose, not outline. And ask it structural questions, because that is where a second model is actually strong: it has no stake in your architecture and it will say the obvious thing you have stopped seeing.

The rule I ended up writing down, in the review pack itself: *treat coverage claims as leads, not findings.* Nothing it says enters a lesson without a primary source. That rule is why the review was useful rather than dangerous, and it is the only reason a confident, well-written, mostly-wrong critique did not end up rewriting a curriculum that was fine.

---

*Next: what the assessment critique found when I measured my own quiz banks — including the one lesson, out of 112, with no question attached to it anywhere.*
