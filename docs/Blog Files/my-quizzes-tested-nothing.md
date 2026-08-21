<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Every Course I Built Had a Section With No Quiz. I Found Out By Measuring, Not By Reading.
Slug:    assessment-gaps-measured-not-read
Excerpt: Nine courses, 112 lessons. Every single course's final section had no
         quiz. Twenty-seven lessons were reachable only through a randomized
         final, including every referral lesson and the suicide-crisis
         protocol. One lesson had no question anywhere. I wrote all of it and
         had no idea until I ran a script against my own repository.
Tags:    Assessment, Learning Design, Measurement, Quality, AI Agents, WitUS
Series:  Building the WELL Program (3 of 3)
-->

# Every Course I Built Had a Section With No Quiz. I Found Out By Measuring, Not By Reading.

An AI review of my curriculum told me my assessments had structural gaps. Most of that review was wrong (that's [post 2](/blog/ai-adversarial-curriculum-review)), so I did not believe this part either. I wrote a script to check.

It was right, and worse than it could see from the outline.

## What the measurement returned

Nine courses. For each, I walked the lesson list in order, grouped by section, and counted where questions actually lived.

| Course | Content lessons | Section quizzes | Final pool → served | Sections with NO quiz |
|---|---|---|---|---|
| 00 Orientation | 10 | 1 | 14 → 10 | 2 of 3 |
| 01 Coaching psychology | 22 | 3 | 14 → 10 | 1 of 4 |
| 02 Movement | 11 | 2 | 15 → 10 | 2 of 4 |
| 03 Nutrition | 10 | 2 | 14 → 10 | 2 of 4 |
| 04 Recovery | 12 | 2 | 14 → 10 | 2 of 4 |
| 05 Sleep | 12 | 2 | 14 → 10 | 2 of 4 |
| 06 Mental well-being | 12 | 2 | 14 → 10 | 2 of 4 |
| 07 Movement & novelty | 10 | 2 | 14 → 10 | 3 of 5 |
| 99 Capstone | 13 | 2 | 15 → 10 | 2 of 4 |

Four findings, in ascending order of how much they bothered me.

**1. Every course's last section had no quiz. Nine out of nine.** Six were also missing a first-section quiz. This is not a bug anyone introduces on purpose. It is what happens when you finish writing a course's content, feel finished, and ship.

**2. Twenty-seven lessons were assessed nowhere but a randomized final.** With a 14-question pool serving 10, roughly a third of the pool sits out any given attempt. So a learner can complete a course without ever being asked about those lessons.

Which lessons? **Every pillar's referral lesson.** The nutrition course's disordered-eating protocol. The recovery course's contraindication screening. And the mental-well-being course's crisis lesson — suicide risk, the 988 Lifeline, least-invasive-first ordering — which was reachable only by a coin flip.

For a program whose entire premise is knowing where your scope ends, the scope content was the least-tested material in it.

**3. One lesson had no question anywhere.** Out of 112. `session-structure`, which teaches the whole anatomy of a coaching session — preparation, opening, the working loop, closing with commitment. Taught, never assessed, in any pool, in any course.

**4. My final pools were 14–15 questions, against a spec I wrote saying 30–60.** Serving 10 of 14 means ~71% of the pool appears every attempt. A "retake" was nearly the same exam. That is not an AI's opinion about my work — it is my own written plan, unmet, and I had not noticed because I never counted.

## Why reading could not have caught this

I wrote every one of these courses. I have read them more times than anyone will. I could not see it, and the reason is structural rather than careless.

**A quiz is a hole in the shape of an absence.** When you read a course front to back, present content is what you perceive. A missing section quiz produces no artifact to notice. There is nothing on the page where the thing should be — you just go from the last lesson of section four to the final exam, and it feels like an ending, because it is one.

**Completion feels like coverage.** Each individual course felt finished when its content was done. The final exam at the end reads as "assessment happened." Nobody schedules the separate act of asking *which lessons does this pool actually reach?*

**The failure is at the seam, and seams are where attention is lowest.** Terminal sections lose their quiz for the same reason the last item on any list gets least care. Nine for nine is not nine coincidences; it is one habit, repeated.

That is the generalizable lesson, and it is not about courses. Any artifact you build in ordered pieces will develop this failure at its terminal piece, and reading will not surface it. Only counting will.

## The second thing the script found

While I was there, I ran a check that already existed in my build: a guard that measures whether a quiz bank can be beaten by **always clicking the longest option**, without reading the question.

The rule is that the correct answer may not be the longest option more than 60% of the time. When I started writing the new banks, mine came in at:

- 69% on one
- 70% on another
- 82% on a third
- **91%** on a fourth

I was not padding correct answers on purpose. It happens because a correct answer carries the qualifier and the "because" clause — *"Clinical-care territory (physician, therapist, or eating-disorder specialist), not dietitian-referral territory"* — while a wrong answer can be short and still wrong.

Note what does **not** fix this. Shuffling the options is my default, and it defeats positional patterns completely. It does nothing here, because length travels with the text wherever the text moves. A learner who has noticed that the longest answer is usually right does not care what slot it is in.

Two fixes, both legitimate, and I have now used both:
- **Trim the correct answer.** Say the same thing in fewer words.
- **Give distractors real specificity** — a date, a mechanism, a named qualifier — so they earn their length.

What you must not do is pad distractors with filler. That trades a length tell for a vagueness tell, and a learner will find the new one just as fast.

## What I have changed, with numbers

The repair is underway and it is large. The program went from **310 pooled questions to 1,110**, on the way to about 1,860.

Sizing rule: pool = words of lesson prose ÷ 35, clamped between 40 and 100, every section serving 5. That last number is the one people get wrong. **Freshness comes from pool ÷ served, not pool size.** Serving 5 from a pool of 40 gives roughly a 12% chance any given item repeats on a retake. Serving 10 from 100 gives 10%. Nearly identical, at 40% of the authoring cost.

I had originally been asked for a flat 100 per section. Measured against the actual corpus — 62,000 words across 112 lessons — that works out to one question per 17 words, and in the thinnest section one per 5. At that density you are not writing assessment, you are writing trivia, and the length guard would have caught the padding anyway.

## Three things worth stealing

**Measure the artifact, don't review it.** The gaps here were invisible to reading and obvious to a 40-line script. If you have built something in ordered pieces, write the script that counts what is in each piece. It will take an hour and it will find something.

**Check your own spec against your own build.** My plan said 30–60 question finals. My build had 14. Neither number was secret. Nobody had ever put them side by side.

**A guard that runs in CI beats a rule you intend to follow.** The length check is part of `pnpm lint` in this repo. It has now blocked four of my own commits, each time correctly. Every one of those was work I would have shipped, because I could not see the pattern in prose I had just written.

The AI review deserves credit for pointing here. But it could only see what an outline shows. The number that actually alarmed me — one lesson in 112 with no question anywhere — came from counting, and counting is a thing I could have done at any point in the previous six months.
