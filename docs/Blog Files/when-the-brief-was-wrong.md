<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Three Times My Own Brief Was Wrong and the Agent Went to the Statute
Slug:    when-the-brief-was-wrong
Excerpt: I write the briefs, and the brief is the one document nobody checks.
         Three times in one month an agent came back and told me the premise
         I handed it was not supported: a retirement statistic that conflated
         two different measures, a headline dollar figure that was
         contestable, and a clause in the Morrill Act that binds somebody
         other than who I thought.
Tags:    AI Agents, Verification, Primary Sources, Research, Curriculum Design, WitUS
Series:  Standards, Conflicts and Sources (4 of 4)
-->

# Three Times My Own Brief Was Wrong and the Agent Went to the Statute

Everything else in this series is about what happens after the work exists: [merge conflicts in a dataset teachers read](/blog/conflicts-in-curated-data), [which git strategy to use on them](/blog/rebase-versus-merge-measured), and [what it costs to refuse a claim you cannot fetch](/blog/fetch-or-do-not-cite).

This one is about the input. I write the briefs. A brief is the one document in the pipeline that nothing checks, because it is upstream of the repository, the type checker, the lint ratchets and the test suite. If the premise is wrong, everything downstream is correctly built on top of a wrong thing.

Three times in the last month an agent came back and told me my premise was not supported. Every one of them is in the repository, and every one is a case where the honest version turned out to be a better lesson than the one I asked for.

## One: a statistic that was two statistics

I was scoping a retirement-accounts course, the last and highest-risk one in a seven-course personal-finance series, and the brief I wrote carried a framing I have said out loud many times: roughly half of private-sector workers have no retirement plan at work.

The agent came back and said the Bureau of Labor Statistics does not support that as an access statistic, because access is not the thing "roughly half" measures.

Reading the March 2025 National Compensation Survey results, the Congressional Research Service reports **72 percent** of private-sector workers had access to an employer-sponsored plan and **53 percent** participated. "Roughly half" is the participation number. As an access number it is true only at the bottom of the wage distribution.

Instead of a lesson built on my sentence, the course got a lesson built on why my sentence was ambiguous. This is the operative paragraph from `scripts/data/retirement-accounts-course.ts`, lesson `who-has-a-plan-at-all`:

> **Three different numbers get called "coverage", and they are not the same.** The federal survey that measures this separates them, and the separation is the lesson:
>
> - **Access** is whether a plan is available to you at your job.
> - **Participation** is whether you are actually in it.
> - **The take-up rate** is participation divided by access, which is the share of people who could join and did.
>
> Quote any one of the three as "coverage" and you can make the same country look well served or badly served. That is why a careless source can say half of workers have no retirement plan while another says nearly three quarters have one, and both can be reading the same survey.

The careless source in that sentence was me.

Then the same lesson does the thing that makes the correction worth more than the original brief, which is to show where "roughly half" is in fact right, and say what that means:

> In the same data, among private-sector workers in the lowest-paid quarter of occupations, 49 percent had access and 23 percent participated. In the highest-paid quarter, 91 percent had access and 80 percent participated. Part-time workers: 47 percent access, 23 percent participation. Full-time: 81 and 62. At establishments with fewer than 50 workers, 55 percent had access and 38 percent participated; at those with 500 or more, 90 and 76.

Followed by the reading instruction, which is the whole reason I build these courses:

> **Read that as a structure, not as a scoreboard of effort.** A person in the lowest-paid quartile who is not in a plan is, better than one time in two, a person with no plan to be in. Whatever else is going on, the first constraint is not discipline. It is the offer.

Two details about the sourcing. The figures are dated in the lesson body ("Those figures are from March 2025 and were published on 18 March 2026. Check the current release before you repeat them"), because every number in that course is on an annual cycle and my planning document flags contribution limits, phase-outs and Social Security figures in red for exactly that reason. And they are cited to the Congressional Research Service brief rather than to the BLS series directly, which brings me to the second case.

## Two: a headline figure I liked, and a statute that needed no interpretation

I pointed an agent at a course about land-grant colleges and matching funds, and I pointed it at the number everybody quotes. In September 2023 the Secretaries of Education and Agriculture wrote to sixteen governors documenting the funding gap between each state's 1890 land-grant institution and its 1862 peer. The press release says "over $12 billion." I asked whether that was the strongest teachable fact in the cluster, because it is live, quantified and official.

The research file that came back says no, and says why, and I have not been able to argue with it. From `plans/future-courses/land-and-schools/2026-08-27-01-land-grants-hbcus-farm-programs.md`:

> **The headline number is reported two ways and you must not print it loosely.**
>
> | Source | Figure | Wording |
> | --- | --- | --- |
> | USDA/ED press release, 18 Sept 2023 | **"over $12 billion"** | the disparity across the 16 states |
> | Inside Higher Ed, 20 Sept 2023 | **"$13 billion"** | "underfunded by their states a total of $13 billion over three decades" |

The per-institution figures disagree across syndications too. And the computation itself is a model: take state funding to the 1862 institution, compute a per-student rate, apply it to the 1890 institution's enrollment, run it from 1987 to 2020. That is a defensible method and it is still a counterfactual, which means a course teaching it has to teach the method before the number, and a hostile reader gets to argue with the method.

What the agent proposed instead was a three-page public-domain Congressional Research Service In Focus brief, IF11847, and two sentences out of it:

> The strongest fact is not the $12bn letter, which is contestable; it is the pair of CRS sentences in section 4.4, which are not. "The law does not permit waivers for most 1862 Institutions" and "in FY2020, nine 1890 Institutions received matching fund waivers" is an asymmetry written into statute and observed in practice, in a congressional document, with no inference required.

Capacity grants under those programs require a dollar-for-dollar non-federal match. USDA may waive up to half of that match for an 1890 institution. The law does not permit the same waiver for most 1862 institutions. All states meet the match for their 1862 institutions; nine 1890 institutions needed a waiver in FY2020.

That is not an estimate. It is a rule and a count, both in a document a learner can download and read in ten minutes. My headline figure needed a paragraph of methodology before it could be defended. The statute needed none.

There is a second reason this matters for anyone doing research with models. A three-page public-domain federal document with no copyright and no paywall is a source an agent can actually open, quote verbatim and hand to a learner. Half the failure in AI-assisted research is not reasoning. It is access, which is [the subject of the previous post](/blog/fetch-or-do-not-cite).

## Three: a clause that was real, and bound somebody else

The third one is my favourite because my premise was not merely imprecise. It was doing work I had no right to ask of it.

I wanted to link the land-grant system to Black officer commissioning, through the Morrill Act's military-tactics requirement. I had also picked up somewhere the idea that the military-tactics language was added later, which would have made the link look like a deliberate later act of policy.

The verification note, in `plans/future-courses/service-academies/2026-08-27-00-find-list.md`, corrects three things at once.

First, the clause is original:

> **The claim that "and including military tactics" was added later is FALSE.** It is in the enrolled 1862 text at **12 Stat. 504, section 4**, read on govinfo (`STATUTE-12-Pg503-2`). The US Code prints exactly two amendments to 7 U.S.C. section 304 (1883 and 1926), **both purely about investment mechanics**. The 1866 Act amended section 5 only.

Second, and this is the part I would never have caught by reading the sentence quickly, it does not bind the college:

> **The only mandatory verb is "shall be inviolably appropriated, BY EACH STATE."** There is no verb "shall teach military tactics" anywhere. The college appears inside a relative clause DESCRIBING a qualifying institution.

The note keeps both honest readings on the table, parallel-and-permissive or mandatory, points out that either way the enforcement mechanism is forfeiture of the grant rather than any duty to teach anybody anything, and records that Congress itself later adopted the mandatory reading in section 40 of the National Defense Act of 1916. Then it produces the fact that killed my argument:

> **The 1890 Act contains ZERO occurrences of "military."**

So the commissioning link holds for the 1862 institutions and is not written into the 1890 statute at all. Any course that wants to connect the land grants to Black officer commissioning has to build that link through practice and through the 1916 Act. The file's own summary:

> That is a narrower claim than this file first assumed, and it is the true one.

The verbatim 1862 purpose clause is now quoted in full in `scripts/data/the-match-course.ts`, at 7 U.S.C. section 304, with the military-tactics phrase in place. The course teaches the clause. It does not teach my inference.

## What actually produced these corrections

None of them came from a guard. My repository has a good set of them, and I have written at length about [why a failing build beats a written instruction](/blog/guards-beat-instructions). Not one of those guards can see a wrong premise. They check that a quiz is not passable without reading it, that a page has its own social card, that a claimed standard resolves to a registered course. A course built flawlessly on a false statistic passes every single one.

Three things did produce them, and only one is technical.

**A standing instruction to report refusals.** Every brief I write ends with the same line: report back what you refused to state, and why. I have called it the highest-value sentence in any brief I have written, and these three are the reason. Without it, a model's uncertainty gets smoothed into prose. With it, the uncertainty arrives on my desk as a list.

**A hard rule that a claim requires the fetched text.** All three corrections came from opening the actual document: the enrolled statute on govinfo, the CRS brief, the survey table as the CRS reproduced it. None came from reasoning about what the source probably says.

**A place to put the correction that is not the lesson.** Two of these three live in planning files under `plans/`, in sections titled "What changed since this file was written" and "NEEDS VERIFICATION." That planning directory is gitignored, which is its own hazard and cost me a full research session once, but the habit matters more than the location: a correction that only exists as a fixed sentence in a lesson teaches the reader the right fact and teaches the next author nothing.

## The uncomfortable part

I am the bottleneck in all three of these stories, and in two of them the model was better calibrated than I was.

That is not a claim that models are good at facts. This same catalog exists because [eight of ten PubMed IDs from one model's research pass](/blog/three-ais-one-curriculum) resolved to real papers about unrelated science. The difference between that failure and these three successes is entirely the instruction: "tell me about land-grant funding" produces confident synthesis, and "open 7 U.S.C. section 304 and quote the operative verb" produces a quotation and, when it cannot be opened, a refusal.

The practical version, for anyone briefing agents on anything that will be published:

**Write the premise down as a premise, not as a fact.** If I had written "verify: roughly half of private-sector workers have no plan at work" instead of asserting it, the correction would have been the expected outcome rather than a happy accident.

**Ask for the operative sentence, not the answer.** "What does the statute require" invites synthesis. "Quote the mandatory verb and say who it binds" produced the finding that the obligation runs to the state.

**Prefer the short public-domain document to the big number.** A three-page federal brief a learner can download beats a contestable aggregate every time, and it is the difference between a course a hostile reader can argue with and one they cannot.

## What is still wrong

Being right three times does not make the catalog right. Measured today across the whole thing:

```
$ pnpm audit:course --all
Audited 268 course(s), 1 unreadable (generated modules not on disk): 1666 finding(s).
    623  final-only-lesson
    545  section-without-quiz
    495  lesson-never-assessed
      3  question-without-source
```

495 lessons are taught and never assessed. The citation checker reports 1,332 citations across 38 of 40 staged courses, and 131 registered courses that are not staged for citation checking at all. None of those 1,332 citations has been verified by a human yet.

The briefs are better than they were. The queue is longer than it was.
