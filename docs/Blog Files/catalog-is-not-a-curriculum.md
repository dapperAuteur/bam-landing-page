<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Catalog Is Not a Curriculum. 198 of My 209 Courses Connect to Nothing.
Slug:    catalog-is-not-a-curriculum
Excerpt: I built a connection graph for my own course catalog expecting to
         tune it. Instead it told me that 94.7% of my published courses are
         orphans, and that the table meant to link courses has never held a
         single row. Here is what that says about publishing, and why twelve
         hand-written links beat an entire embedding pipeline.
Tags:    Learning Design, Content Strategy, Knowledge Graphs, Measurement, Product Design, WitUS
-->

# A Catalog Is Not a Curriculum. 198 of My 209 Courses Connect to Nothing.

I built a tool to draw how the courses on my learning platform relate to each other, and the honest output was a wall of unconnected dots.

Learn.WitUS.Online has 209 published courses across 22 categories. Of those 209, exactly 198 are orphans: 94.7% of the catalog is joined to nothing else in it. Eleven courses share the twelve links that exist. That is the whole graph.

I want to be clear about whose problem this is. It is mine. This is my platform, my content, my schema, and my gap. I did not discover a flaw in some hypothetical company's information architecture. I ran a query against my own database and found out that the thing I have been calling a body of work is, structurally, a pile.

## Two words, defined plainly

A **catalog** is the set of courses a learner can browse: titles, categories, a search box. It answers "what do you have."

An **orphan** is a course with no connection to any other course. Not a prerequisite, not a "read this next," not even a note in the system saying that two courses discuss the same case or law or person. When a learner finishes an orphan, the software has nothing to say. It returns them to a list. A list sorted by category is not a suggestion, and it is definitely not a path.

Here is the argument the graph forced on me, and it is the part worth your time even if you never touch a learning platform:

**A catalog is not a curriculum.** Publishing 209 good courses does not produce a path through them. Connection is a separate act of authorship, and nobody schedules it, because every individual course feels finished the moment it ships.

## The measurement was the intervention

Nobody believed the catalog was disconnected. I did not believe it. The connections felt real to me because they existed in my head: I knew which courses shared a case, which one should obviously come before which other one, which pairs a curious learner would want back to back. None of that was in the database, and none of it was in the product.

So the graph, which is an owner-only view nobody but me will ever see, produced no new content and fixed no bug. Its entire value was drawing the picture. That is worth naming as a pattern: for a quality that accumulates invisibly, the measurement is the intervention. You do not need a plan to fix a thing you have not yet agreed is broken, and a picture ends the argument faster than any memo.

## The number that actually stopped me

Twelve links across 209 courses is bad. This is worse:

**There are zero rows in the `course_prerequisites` table.** Not few. Zero. Across the entire database, published and unpublished. The feature that exists specifically to say "take this one first" has been available the whole time and has never been used once.

I built that table. I designed it, migrated it, wired it into the data layer, and then never once, across 209 published courses, said out loud which course should come before which. Capability is not adoption. A schema is a promise you can keep, not a promise you kept, and the gap between those two things does not show up anywhere until someone counts.

The category picture matches. Twenty of my 22 categories are islands, connected to no other category at all. Two categories touch each other, by three links. Those three links are the entire cross-category surface of a 209 course catalog. Everything I have built sits inside its own silo, and the silos do not know about each other.

## Where the twelve links came from, and why that is the interesting part

Every link the catalog has comes from one small hand-written file: a registry of cross-course **entities**. A person, a court case, a law, or a concept that appears in more than one course gets an entry, and each course that touches it gets a one sentence note saying what *that* course does with it.

Not "these two courses are related." Something closer to: this course treats Berman v. Parker as the doctrine that made area clearance defensible nationwide, while that other course treats the same case as the thing a specific neighborhood lost a fight to (Berman v. Parker, 1954).

One small file, written by hand, produced 100% of the connective tissue in my catalog. No pipeline, no model, no infrastructure. Somebody thought about two courses at the same time and wrote down why.

## The cheap manual thing beat the free automatic thing

This is the finding I did not expect, and the one I would defend hardest.

I have the automatic option already built. There is a semantic pipeline: embed the lessons, compare the vectors, surface courses that are numerically similar to the one a learner just finished. It cost real engineering. It is sitting there.

It is also sitting behind three closed gates, which is why "just turn it on" is not the fix:

- Exactly **1 of 256 courses** in the database opts into cross-course semantic linking.
- Exactly **73 of 4,485 lessons** have embeddings. That is 1.6% coverage.
- The query that would use them also requires a course to be vetted, which most are not.

Open all three gates and you get suggestions. But look at what the two approaches actually say. A similarity score says "these two courses are alike," which is close to the least interesting thing you can say about two courses. Alike is not a reason to move. Learners do not want the neighboring item in vector space; they want to know why the next thing is next.

A human sentence saying that one course treats a case as a national doctrine and another treats it as a local loss gives a learner a reason to click, gives me a reason to teach them in that order, and survives being read out loud. Twelve of those outperformed an entire embedding pipeline, mostly because the pipeline was never switched on, but also because even switched on it would produce weaker edges.

I do not think that is a quirk of my catalog. Similarity is computed. Relevance is authored.

## Four options, honestly

| Option | What it costs | What it buys | The catch |
|---|---|---|---|
| Extend the hand-written entity registry | My own attention, one entity at a time, repeatedly | The best edges in the system, with a stated reason attached to each | Does not scale. It is me, typing, forever, and the work grows with the catalog |
| Back-fill real prerequisites | Tedious, slow, one judgment call per pair | The only option that produces an ordered path instead of a web of "see also" | 209 courses is a lot of pairs, and most pairs are genuinely unrelated, so the work is mostly saying no |
| Turn on the semantic pipeline | Nearly free at the margin, the code exists | Coverage. It would touch every course, not the eleven I got to | Weakest edges of the three, and three gates have to open first: opt-in, embeddings, vetting |
| Accept that some categories should be islands | Nothing | Sanity, and a smaller true problem | Requires deciding which islands are correct, or it becomes an excuse for all 198 |

That last row is the one I keep having to argue for. Not every orphan is a defect. Some of my categories genuinely do not connect to the others, and a knot-tying course does not owe anyone a link to a constitutional law course. If I treat all 198 orphans as bugs, I will either fabricate connections that do not exist, which is worse than none, or I will be permanently behind on a number that was never supposed to reach zero.

## Where I land

I am going to do the tedious one and the cheap one, in that order, and I am not going to open the semantic gates yet.

Prerequisites first, because they are the only thing that answers "what should I take next," and because zero rows is not a coverage problem to chip away at, it is a habit that does not exist yet. The registry second, because it produces my best edges and I already know how to write them. The semantic pipeline waits, not because it is bad, but because turning it on now would paper over the fact that I have never once declared an ordering, and I would rather find out how hard the real work is before I let a cosine tell me it is done.

And I am going to keep counting orphans, because the count is the only reason any of this is visible.

## The general version

The lesson generalizes past courses. "Shipped" is a verb that applies to items. Catalogs, libraries, wikis, documentation sites, and product ecosystems are not items, so nothing in a normal workflow ever declares them done, and no individual act of publishing moves them forward as a whole. Each piece gets finished. The space between the pieces belongs to nobody.

If you maintain a collection of anything, the useful question is not whether the newest piece is good. It is: what fraction of your collection is connected to any other part of it, and have you ever counted?

Mine was 5.3%, and I had to draw a picture to find out.

## A note on the numbers

Every figure here comes from queries against my production database on August 9, 2026: 209 published courses, 22 categories, 198 orphans, 12 links, 3 cross-category links, 0 rows in `course_prerequisites`, 1 of 256 courses opted into semantic linking, and 73 of 4,485 lessons with embeddings. No estimates, no projections, and no user research is claimed here. It is a structural census of my own catalog, which is exactly as far as it goes.

## References

Berman v. Parker, 348 U.S. 26 (1954). https://supreme.justia.com/cases/federal/us/348/26/
