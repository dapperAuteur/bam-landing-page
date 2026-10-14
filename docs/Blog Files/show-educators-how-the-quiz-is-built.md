<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Show Educators How My Quizzes Are Built, Including the Ones That Are Not Fixed Yet
Slug:    show-educators-how-the-quiz-is-built
Excerpt: Every course page now has a small panel that says how its quizzes are
         built: shuffled or not, whether answer length gives anything away, whether
         each question points back to its lesson. It is computed from the quizzes
         themselves, so it cannot claim more than is true.
Tags:    Learn.WitUS, Assessment, Trust, Building in Public
-->

# I Show Educators How My Quizzes Are Built, Including the Ones That Are Not Fixed Yet

Teachers choosing a course look for proof. My course pages already show which academic standards a course meets, in a small panel under the description. This week I added a second panel right under it: how the course's quizzes are built.

It answers four questions in plain sentences:

- Are the options shuffled on every attempt?
- Can a learner find the right answer by its length alone?
- Does every question point back to the lesson it tests?
- Does every question explain its answer?

## Why I would show something unfinished

I just spent a week on quiz length. In [Fixing One Quiz Tell Created Its Opposite](/blog/fixing-one-quiz-tell-created-its-opposite) I wrote about how my courses let a learner pass by clicking the shortest answer, and how fixing that showed a wider problem: across most of my quizzes, the right answer leaned short.

That sweep is far from done. On 2026-10-14, 511 of the catalog's 1,018 quiz banks still fail the length-balance check.

So the panel will say "not yet" on a lot of courses. I decided that is the point. A panel that only appears on finished courses is a sales badge. A panel that tells the truth on every course is a measurement, and a teacher can use it to choose.

## It cannot claim more than is true

Three rules make it honest:

**It is computed, never stored.** The panel reads the quizzes as they are right now. There is no "passed" flag sitting in a database that could go stale after an edit.

**It is the same measure as the build check.** The three length checks that run every time I build the app, and the panel on the course page, now import one shared definition. Before I moved the code, I saved every check's output, and after the move it was the same byte for byte. A teacher and my build pipeline see the same number.

**An unmeasured course shows nothing.** A quiz bank under eight questions is too small to judge, so it is left out. A course with nothing to measure shows no panel, rather than a reassuring blank.

## The page that does not leak the test

The panel also appears on "Coming soon" pages, for courses that are not open yet. That raised a question: to measure a quiz, you need the quiz, and a coming-soon page must not hand out the questions.

So that page never loads them. The database unpacks each question and returns only what the measurement needs: how long each option is, which one is correct, whether there is an explanation, and which lesson it belongs to. No question text leaves the database for that page.

## The scoreboard

For me there is one more page, visible only to me: every course in the school, worst first. It is the progress bar for the length-balance campaign, and it is the same numbers a teacher sees, just all at once.

## Three things worth stealing

**Show the measurement, not the badge.** A badge appears when you are done. A measurement is useful the whole way there, and it is the only one a skeptical reader trusts.

**Make the public number and the build check the same code.** If your marketing page and your test suite compute a number separately, one day they will disagree, and the marketing page will be the one that is wrong.

**When you need a secret to compute a public fact, compute it where the secret lives.** Send the answer out, not the inputs.
