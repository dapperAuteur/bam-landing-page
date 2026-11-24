<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   One Outside Review Moved My Course Rubric to v1.7
Slug:    one-outside-review-moved-my-course-rubric-to-v1-7
Excerpt: The Indianapolis Motor Speedway Museum's Director of Education read one Learn.WitUS course
         and found what a dozen internal gates had missed: a famous first that was never confirmed,
         a name said wrong, assignments pitched at middle school. I approved rubric v1.7 the same
         day. What changed, and what the new checks found across 331 courses.
Tags:    Learn.WitUS, Course Design, Rubrics, Expert Review, Curriculum Standards, AI Agents, Learning in Public
PUBLISH ONLY AFTER: witus-learn task 419 (the rubric v1.7 lint checks) is merged and live. If the baseline numbers have moved by then, update "What the new checks found".
-->

# One Outside Review Moved My Course Rubric to v1.7

Learn.WitUS has a course-creation rubric. It is a tracked instrument that answers two questions: should a subject become a course, and when is a course done. It reached v1.6 on 2026-11-10. Six days later it reached v1.7, and the reason was one review.

## The review

On 2026-11-16 I received a written review of the Speedway course from the Indianapolis Motor Speedway Museum's Director of Education. Speedway is an audio-first documentary course on the Indianapolis 500 and the Indianapolis Motor Speedway, aimed at Fishers High School.

The reviewer confirmed the broad facts. Then came the list:

- The course says Ray Harroun installed the first rearview mirror. That is commonly credited and has never been historically confirmed.
- The museum is open 363 days a year, not year-round.
- Artifacts the course names as on display rotate.
- Episode 1 pronounces Harroun "har-ron." It is "Har-oon," and it rhymes with "toon."
- The assignments read like middle school, for a course aimed at a high school.
- AI generation was evident in the projects and worksheets.
- The town of Speedway, planned around the track, was missing.
- Standards were listed as broad subject areas, not numbered Indiana Academic Standards.
- Lessons had no explicit objectives or success criteria.
- The materials needed a teacher value proposition: a reason a teacher would pick them up.
- A careers section tied to Indiana's graduation seals and pathways would help.
- Audio versus video needed a stated reason.

The reviewer praised the discussion-based projects and offered a team review once the revision lands.

Every item on that list got past my rubric. Two of them got past gates that existed to catch exactly that kind of problem. That is the part worth writing down.

## What changed in v1.7

I approved v1.7 the same day. My approval was two words: "rubric v1.7." The changes, by part of the rubric:

**Brief gates, before anything is built.**

- **A9, audience and rigor named.** The brief names its audience and its level, with a sample question and a sample project judged at that level by someone who teaches that band. "High school" in a header is not a level. A question a high school teacher would actually assign is.
- **A10, a teacher value proposition.** Why a teacher would use this course instead of what they already have.

**Build gates, tightened.**

- **D4,** the gate that a course doesn't read as machine-made, now has two parts: an AI-tell phrase check in lint, and a human read-through that gets recorded.
- **D6,** standards, now needs numbered standards per lesson, taken from the state's own documents. The reviewer suggested Google NotebookLM for the mapping. The rubric says no, and not because of that tool: my ecosystem rule is that AI output is never a source. A standard number has to trace to the state's document, not to a summary of it.

**New build gates.**

- **D10:** objectives and success criteria for every lesson and every listening section.
- **D11:** time-bound facts about a living institution, like its hours or what is on display, carry a date and get re-verified every year.
- **D12:** a pronunciation list for any recorded course.
- **D13:** careers, tied to the state's pathways and seals.

**Review gates.** E3 now says a course about a named living institution invites its reviewer at the sources stage, before lessons rest on the facts. And Part F says an outside review becomes a file in the repository, and its research checks are written the same day.

## What the new checks found

The lint checks that enforce D4, D6 and D10 were built the same day. They are ratchets: each one records the catalog as it stood as a baseline, so the number can fall but a change that raises it fails.

The baseline:

- **AI-tell phrases:** 629 hits across 140 of 331 courses.
- **Objectives:** 0 of 6,074 lessons have them.
- **Standards:** all 176 standards-aligned courses are aligned at course level only. None names a standard per lesson.

The Speedway course scored 2 on the phrase check. Two. The reviewer read the same course and saw machine work in the projects and worksheets. That gap taught me what the phrase list measures: tics, the words on the list. It does not measure the flatness a reader senses when every episode has the same shape. The read-through is the gate that matters there, which is why D4 needs both halves, and why the human half is recorded instead of assumed.

The zero on objectives stopped surprising me once I looked at the old rubric. No gate asked for objectives, so no course has them. The reviewer asked once.

## Why audio

The reviewer's question about audio versus video was fair, and the answer lived only in my head. It is now written in the authoring guide:

1. **Screen-off learning.** A learner can listen with the screen off.
2. **Cost.** Audio costs about a tenth of what video costs to make, and a tenth to change. A correction is a re-record, not a reshoot.
3. **Accessibility.** A course you can take by ear reaches learners a screen-first course leaves out.
4. **It forces the writer to explain.** With no picture to point at, the script has to say the thing.

The middle path is a listen-along page, for the learner who wants to read while listening.

## What this cost

**To build:** the rubric edits were coordinating-session work, which I don't price per task, so they have no number here. The lint checks were one helper run on Claude Opus 5.5 over 101 responses: 6.34 credits. The Speedway revision was another helper run over 123 responses: 9.89 credits. A credit is 1 US dollar of API list price, not what my subscription bills, priced with the same usage method as my other posts. Not counted: the coordinating session, writing this post, and my time.

## What I'd carry

- **A rubric is only as good as the last reviewer who did not use it.** Mine had a dozen internal gates. An outside expert found more in one read.
- **Invite the reviewer before you build.** Check the facts while they are still a list of sources, not after thirteen episodes stand on them.
- **A phrase check measures tics, not flatness.** Keep it, and keep a person reading.
- **Count what no gate asked for.** Zero objectives in 6,074 lessons is what a missing gate looks like.
