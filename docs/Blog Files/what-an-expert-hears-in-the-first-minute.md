<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   What an Expert Hears in the First Minute
Slug:    what-an-expert-hears-in-the-first-minute
Excerpt: The museum's Director of Education heard my Speedway course say a driver's name wrong in
         Episode 1. The corrections that needed no new sourcing shipped the same day, in a tracked
         file the seeder applies, because the course text is generated and the next regenerate would
         undo a plain edit. Underneath, the revision plan found why the course read as middle school
         and as machine-made.
Tags:    Learn.WitUS, Course Design, Expert Review, Fact Checking, Generated Content, AI Agents, Learning in Public
PUBLISH ONLY AFTER: witus-learn task 418's corrections branch (fix/speedway-course-ims-corrections) is merged and live, the reply has been sent to the museum, and #201 (one-outside-review-moved-my-course-rubric-to-v1-7) is live, because this post links it. If the Grokipedia guard has landed by then, change "is being added" to say so; if the museum has answered, update the last section.
-->

# What an Expert Hears in the First Minute

On 2026-11-16 the Indianapolis Motor Speedway Museum's Director of Education reviewed my Speedway course, an audio-first documentary course on the Indianapolis 500. What that review changed in my course rubric is in [One Outside Review Moved My Course Rubric to v1.7](/blog/one-outside-review-moved-my-course-rubric-to-v1-7). This post is about the course itself: what shipped the same day, how it shipped, and what the revision plan found underneath.

## The first minute

Episode 1 is about the 1911 race, and its winner is Ray Harroun. The recording says "har-ron." It is "Har-oon," and it rhymes with "toon."

An expert hears that before anything else. After that, every fact that follows is on probation. It was the cheapest thing in the whole course to check, and nothing in my process checked it.

## What shipped the same day

The corrections that needed no new sourcing went onto a branch that afternoon:

- **Hours.** The course said the museum was open year-round. It is open 363 days a year, "only closed on Thanksgiving and Christmas Day" (Indianapolis Motor Speedway Museum [IMS Museum], n.d.-a).
- **What is on display.** Exhibits rotate, so "on display at the museum" became "in the collection," with a note that a named car or helmet may not be on the floor the day a class visits.
- **The mirror.** The course said the mirror "is believed to be the first rearview mirror ever mounted on an automobile." It now says Harroun is commonly credited and that the claim has never been confirmed, with four sources behind the rewrite.
- **Pronunciation.** A "Say it right: Har-oon" line in the lesson and in the recording script.
- **A dead link,** fixed, and three new research checks, one of them a yearly check of the museum's hours.

The mirror is the one worth reading closely, because the course had a hedge and still claimed too much. The museum's own page says Harroun's mirror is "believed to have been the first rearview mirror used on an automobile" (IMS Museum, n.d.-b). The Speedway's history page says "believed to have been the very first" (Indianapolis Motor Speedway, n.d.). The Henry Ford narrows it further: "believed to be the first use of such a mirror on a race car" (The Henry Ford, n.d.). Then two older sources. A trade journal from December 1906 reports that mirrors for watching the road behind "are fitted on a large number of closed bodies" ("Body Work at Paris Salon," 1906). A 1909 driving handbook tells the owner of a closed car to have "a mirror attached to the dash-board so that the chauffeur can see what is behind him" (Levitt, 1909). And the museum's page says Harroun based his design on one he had seen on a horse-drawn taxi cab in Chicago (IMS Museum, n.d.-b). The course said "believed" too. But "believed to be the first ever" still teaches a first ever, and the 1906 and 1909 sources say mirrors were on closed cars years before 1911. The claim the record supports is The Henry Ford's: an early use on a race car, not a proven first.

## Why the fix is a file of find-and-replace pairs

The course text is generated from masters in another repository, and the generated file is gitignored. An edit to it reaches no branch and no review, and the next regenerate would quietly undo it.

So the corrections live in a tracked file: each one names a lesson, the exact sentence to find, the sentence to put in its place, and one line on why. The seeder applies them to the generated course. Each target sentence must appear exactly once, or its replacement must already be there. If a target ever disappears, the seed fails loudly instead of shipping the old claim.

## What the revision plan found underneath

**"Middle school" was literal.** The course's June one-pager says "sixth-grade reading level." One teacher packet maps a grades 9 to 12 unit to Grade 7 math. The reviewer read the level correctly.

**The machine-made feel was structure, not words.** The AI-tell phrase check found 2 hits in the whole course. What reads as machine-made is shape: thirteen episodes on one template, 56 stock narration turns, and nine production notes left inside the text ("Target: ... Fallback narration"). A phrase list cannot hear that.

**Two citations point to Grokipedia,** an AI-written encyclopedia my no-AI-sources guard did not catch. Adding it to the guard is under way. Another 21 point to Wikipedia, which my rubric calls a pointer to sources, never a citation.

## The reply

The reply to the museum proposes a team review of the revised Episode 1 and the Speedway draft for the week of November 30. It asks two questions back: which IndyStar article the reviewer meant, and where the visitor figure comes from. I could not find a source for that figure, so it stays out of the course until someone can.

## What this cost

**To build:** the revision was one helper run on Claude Opus 5.5 over 123 responses: 9.89 credits. A credit is 1 US dollar of API list price, not what my subscription bills, priced with the same usage method as my other posts. Not counted: the coordinating session, which I don't price per task, writing this post, and my time.

## What I'd carry

- **Pronunciation is the first thing an expert hears and the cheapest thing to check.**
- **A hedge doesn't fix a claim that is too big.** "Believed to be the first ever" still teaches the first ever.
- **A phrase list cannot hear flatness.** A person reading can.
- **Generated text needs a tracked corrections layer,** or the next regenerate undoes the fix.

## References

Body work at Paris Salon. (1906, December 27). *The Automobile, 15*(26). Retrieved November 16, 2026, from https://archive.org/details/sim_automotive-industries_1906-12-27_15_26

The Henry Ford. (n.d.). *Ray Harroun, #32 Marmon, 1911 Indianapolis 500* (Object ID 2009.103.P.5037.6). Retrieved November 16, 2026, from https://www.thehenryford.org/collections/explore/artifact/377208

Indianapolis Motor Speedway. (n.d.). *The first 500*. Retrieved November 16, 2026, from https://www.indianapolismotorspeedway.com/history/first-500

Indianapolis Motor Speedway Museum. (n.d.-a). *Indianapolis Motor Speedway Museum* [Home page]. Retrieved November 16, 2026, from https://imsmuseum.org/

Indianapolis Motor Speedway Museum. (n.d.-b). *Ray Harroun*. Retrieved November 16, 2026, from https://imsmuseum.org/fame_inductee/ray-harroun/

Levitt, D. (1909). *The woman and the car: A chatty little handbook for all women who motor or who want to motor*. John Lane. Project Gutenberg edition, read through the Internet Archive's copy. Retrieved November 16, 2026, from https://web.archive.org/web/2025/https://www.gutenberg.org/cache/epub/58956/pg58956.txt
