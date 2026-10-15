<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Logarithms You Can Hold, and the 67 Fixes That Came First
Slug:    logarithms-you-can-hold
Excerpt: My slide rule course teaches logarithms as lengths you can slide,
         the Oughtred and Delamain quarrel as a quarrel, and "slide rules got us
         to the Moon" as the museum record actually puts it. Before any learner
         sees it, four checkers proposed 67 fixes, and a skeptic then found
         mistakes in the fixes themselves.
Tags:    Curriculum Design, Mathematics, History, Verification, AI Agents, WitUS
Series:  Tools That Think (3 of 4)
-->

# Logarithms You Can Hold, and the 67 Fixes That Came First

The Slide Rule is the second course in [Tools That Think](/blog/tools-that-think). It has 25 lessons in seven sections and 605 quiz questions, and it teaches one basic instrument: a Mannheim-type rule with A, B, C, D and L scales. By the end a learner should be able to multiply, divide, square, take square roots and read common logarithms on it, place the decimal point by estimating first, and say how many figures the answer is good for.

## The one sentence

The course is built around one sentence a teacher would accept. A slide rule marks every number at a distance from 1 proportional to its logarithm. Sliding one scale along another adds two such distances, so it adds logarithms, and adding logarithms multiplies the numbers.

Pickworth's 1920 manual says it this way: "the distance of any number from 1 is proportional to the logarithm of that number" (Pickworth, 1920, pp. 10-11). Lesson 3 has you build a paper rule from ten measured lengths and watch it happen.

## Three things learners arrive believing

The brief named three beliefs to correct, and the course corrects them from documents, not from tone.

**"Oughtred invented the slide rule."** The record is a quarrel. Richard Delamain published his *Grammelogia* in 1630, which the historian Florian Cajori called "the earliest known printed instructions on the use of a slide rule" (Cajori, 1920, p. 197). William Oughtred said he had invented the instrument years earlier, about 1621, and each man accused the other of stealing it.

Cajori himself changed his mind. His 1909 history had named Oughtred the inventor. By 1920 he had read Delamain's own pamphlets, and he explained what was wrong with his earlier view: all of his information about Delamain "was taken from De Morgan, who, however, gives no evidence of having read any of Delamain's writings on the slide rule" (Cajori, 1920, pp. 187-188). His new verdict: "We incline to the opinion that the hypothesis of independent invention is the most plausible" (Cajori, 1920, p. 205).

Lesson 18 does not hand the learner that verdict. It prints both men's accounts of the same walk through a London street in 1630 and asks three questions. Where do they agree? Where do they differ? Which statements did each man see for himself, and which are guesses about the other man's motives? Then it gives the accurate way to say it: Oughtred claimed a date about 1621 and had a witness, Delamain published first, and the historian who read both judged independent invention the most likely.

**"Slide rules got us to the Moon."** The National Air and Space Museum holds a 5-inch Pickett rule used on Apollo 13 and describes its job carefully: "an on-board computer and large computers on Earth performed the critical guidance and navigation calculations necessary for a successful journey. In addition, crews carried a slide rule for more routine calculations" (National Air and Space Museum, n.d.). Lesson 20 says that and no more, and points out that a summary dropping either "critical" or "routine" changes the claim.

**"A slide rule is inaccurate."** It gives about three significant figures, and the 1920 Keuffel & Esser manual treats that as a discipline. Carrying more figures than the data warrant, it says, "comes perilously near to lying with figures" (Cullimore, 1920, p. 4). Lesson 9 is built on that habit.

## Multiple choice, on purpose

A slide-rule reading is approximate, and my platform grades a typed answer by exact match. A learner who reads 7.86 where the key says 7.85 would fail for reading correctly. So every quiz is multiple choice, and every numeric question's options differ by a power of ten, which tests the decimal point, or by far more than a rule's reading error, which tests the operation.

The four options in every question are also written to within eight characters of each other, so in every bank, always picking the longest or the shortest option scores exactly chance. That is the full length-balance standard from [an earlier post](/blog/fixing-one-quiz-tell-created-its-opposite), applied from the first draft instead of fixed later.

## 67 fixes before a learner saw it

Once the course was built, it went through a verification pass in three stages.

1. **Four checkers,** each reading one group of sections, with no permission to edit. Their job was to open every cited source, confirm each claim and its page, and check every quiz question: the right answer right, every wrong answer definitely wrong, no option giving away another question. Between them they proposed 67 fixes, and they reported 1,073 claims and questions checked and found correct.
2. **One applier** re-read the evidence for each fix, applied all 67 with none skipped, and re-ran every quiz guard, the course audit, the type checker and the test suite.
3. **One skeptic** reviewed the whole change against the sources.

The fixes were the ordinary kind that only show up when someone opens the page. Page numbers that were off. Claims a little stronger than their source, now narrowed: Delamain's ring is described as the first slide rule in print, and the scale on Thacher's cylindrical rule as lying parallel to the cylinder's axis. Quiz options that gave away another question's answer, or that a careful learner could argue were right. And one lesson had said Napier's 1614 table was made for "astronomy and navigation." No source the course had read says so, and the sentence is gone.

The fixes had a side effect. They added words, which pushed two sections' quiz pools below the size the audit expects for that much text, so the applier wrote six new questions.

## The skeptic found mistakes in the fixes

The third stage earned its place. The capstone's tenth problem asks for the fifth power of 3.72. The fixed answer bracketed the result between 3 to the fifth, 243, and 4 to the fifth, 1,024, and concluded it was "a three-figure number." But 1,000 to 1,024 is inside that bracket, so the bracket proves no such thing. The text now says only that the answer, 712, lies between the bounds, and the wrong options do not.

Two more. A fixed sentence about Napier's notes said Macdonald's 1889 English translation "already" used the word "computors" for a person, which implied Napier's own Latin did. Nobody has read that Latin word yet, so "already" came out. And the applier had reported that lesson 1's map of the course now matched all seven sections. It left out the closing capstone.

None of those would have failed a test. Each would have taught something slightly false.

## What is still open

Six research checks are filed, one for each hedge the course carries:

- how many slide rules flew on each Apollo mission, which the two Smithsonian records do not say;
- when Keuffel & Esser made its last slide rule, since only its 1970 Hoboken closure is confirmed;
- whether the pilot's E6B uses logarithmic scales, which the course works out and the FAA's handbook does not state;
- where the L scale sits on my own rule;
- a 1972 *Hewlett-Packard Journal* article the course cites by title but has not read;
- the Latin word in Napier's 1614 note.

The course is public, free and held as "Coming soon" until I record the demonstrations in its twelve hands-on lessons, on my own Mannheim-type rule with card rods and a printed log table. It is the one course in the series with no reviewer in its hold. It is mathematics and history, every worked example comes from public-domain sources (two 1920 manuals, a 1918 MIT text, a 1964 federal handbook of tables and the FAA's pilot handbook) or plain arithmetic, and it has had the pass above. Its three siblings wait for named reviewers as well as for me. I also asked for a copy on ElementaryMBA, and that waits on a change to a test that is mine to approve.

## Three things worth stealing

**Choose the quiz format from the instrument, not from habit.** A tool that reads to three figures cannot be graded by exact match. Spacing the options a power of ten apart tests the skill the tool teaches, the decimal point, instead of punishing honest reading error.

**Put a skeptic behind the fixer.** A fix is new content, and new content needs checking too. Every problem the skeptic found was in text the fixes had just written or claimed to have finished.

**Teach a dispute as a dispute.** "Who invented it?" makes a better lesson when the learner reads both men, then reads the historian who changed his mind and why.

## References

Cajori, F. (1920). On the history of Gunter's scale and the slide rule during the seventeenth century. *University of California Publications in Mathematics, 1*(9), 187-209. https://archive.org/details/113597_001_009

Cullimore, A. R. (1920). *The use of the slide rule*. Keuffel & Esser. https://archive.org/details/useofsliderule00cullrich

National Air and Space Museum. (n.d.). *Slide rule, 5-inch, Pickett N600-ES, Apollo 13* (Inventory No. A19840160000). Smithsonian Institution. Retrieved October 15, 2026, from https://airandspace.si.edu/collection-objects/slide-rule-5-inch-pickett-n600-es-apollo-13/nasm_A19840160000

Pickworth, C. N. (1920). *The slide rule: A practical manual* (17th ed.). Emmott; D. Van Nostrand. https://archive.org/details/cu31924003979105
