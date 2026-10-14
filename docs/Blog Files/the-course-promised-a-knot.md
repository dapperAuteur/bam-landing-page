<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Course Promised a Knot It Did Not Teach
Slug:    the-course-promised-a-knot
Excerpt: My broadcasting course told learners to go learn the trucker's hitch
         in my knot-tying course. The knot-tying course did not teach it. A
         coverage search for a different course found the broken promise. Here
         are the three fixes on the table, the one I chose, and why the lesson
         that now teaches the knot rests on sources I may link but not copy.
Tags:    Curriculum Design, Cross-Links, Copyright, Verification, Primary Sources, WitUS
-->

# The Course Promised a Knot It Did Not Teach

My broadcasting course has a section on the rope work a crew does: securing cable, tying gear to rails, coiling so a cable pays out clean. It sends learners to a companion course for the details. In its own words, the knot-tying course teaches "the bowline (a fixed loop that will not slip), the clove hitch and round-turn-and-two-half-hitches (securing to a rail or truss), the trucker's hitch (tensioning a run), and safe coiling."

Most of that was true. The trucker's hitch was not.

## How it was found

Nobody reported it. On 2026-10-07 the agent was doing a coverage search for a proposed rigging course. In my LMS, before a new course gets a brief, the agent searches every existing course for what already covers the subject, by lesson. Reading the broadcasting and knot-tying files side by side, it found that the knot-tying course had no trucker's hitch lesson. One lesson mentioned "a trucker's-hitch-style purchase" in passing, with no steps.

The promise was not in one place. The broadcasting course referred to it twelve times: in lesson text, a recall card, quiz options, and the final exam. A learner who followed the pointer to learn the knot found nothing, and then got quizzed on it.

The same search found two smaller problems in the knot-tying course itself. Its rigging lesson credited over-under cable coiling to an earlier lesson that teaches a different coil. And it described ETCP as if it were a standard. ETCP is a certification program, run by ESTA, for riggers and entertainment electricians (ESTA, n.d.).

## Three fixes, and my answer

The agent did not patch it on the side. Fixing it meant editing quiz text in a course that had already shipped, which is my content call, so it filed a bug note with three options:

- **A. Teach what is promised.** Add a sourced trucker's hitch lesson and an over-under coiling lesson to the knot-tying course. The most work, and it keeps every broadcasting quiz true.
- **B. Stop the promise.** Edit the broadcasting course so it recommends the knot without claiming the knot course teaches it.
- **C. Both:** B now, A later.

My answer, written into the note: prefer A, teach what is promised. If sources cannot be found, then B.

## The public-domain book did not name the knot

My knot-tying course is built on a public-domain backbone: A. Hyatt Verrill's *Knots, Splices and Rope Work*, a second revised edition whose introduction is dated January 1917, on Project Gutenberg. That is the kind of source I like best, because it can be hosted and quoted freely.

Verrill does not name the knot. The agent searched the Gutenberg text for "trucker," "wagoner," "waggoner" and "teamster," the names it might go by, and found none of them. I ran the same search on the same text while writing this post and got zero for all four (Verrill, 1917). No federal manual turned up a usable source either.

So the agent did B first. The broadcasting course was changed to name the taut-line hitch, which the knot course does teach, in all twelve places. Option text was edited in place; prompts and answer keys were not touched.

Then it kept looking, found sources for A, and did that too.

## Linked, not copied

The new lessons rest on sources anyone can read for free that are still under copyright. My repository has a rule for that tier: cite and link, never rehost. A page that opens freely in a browser has not given anyone a license to copy it.

- **Lesson 27, the trucker's hitch,** follows NetKnots. It quotes short lines with attribution: the knot's purpose, "Use the Trucker's Hitch to cinch down a load," and the warning to form the loop from the slack part of the rope "or it will tighten down on itself under pressure" (NetKnots, n.d.). It also carries the page's own safety line: "Where failure could cause property damage, injury, or death, seek professional instruction prior to use." The lesson adds its own rule on top: never for anything that holds a person, and never for overhead rigging.
- **Lesson 28, coiling cable over-under,** follows a guide on LEWITT's blog. It quotes the reason for the method: coil a cable the wrong way and "you will end up with a twisted mess," while over-under "alternates the way the cable turns with each loop" (Tobias, 2023).

Each source entry in those lessons says exactly what was used: which description, which steps, which cautions. Eight new quiz questions came with them. The rigging lesson now points to lesson 28 for over-under coiling, and calls ETCP a certification beside the ANSI E1 standards.

And the broadcasting course went back to its original wording, which is now true.

## A cross-link is a promise

A sentence like "learn this in the companion course" is a claim written in one file about the contents of another. Nothing in my build checked that the promised lesson existed.

I wrote about the opposite failure in [a post about my catalog](/blog/catalog-is-not-a-curriculum): almost none of my courses connected to anything, and inventing links would be worse than having none. This was the other side of it. The link existed, and it pointed at an empty room.

What caught it was a habit, not a guard: the rule that a new course starts with a search of what the catalog already teaches. That search exists to keep me from building a duplicate. This time it found a promise I had already broken.

## Three things worth stealing

**Treat every "learn this in course X" as a claim to verify.** Read the target lesson by lesson, not by its title.

**When the best source does not exist, say so and take the next tier honestly.** Public domain was the first choice. When it did not name the knot, the lessons moved to sources that may be linked and briefly quoted, and they say exactly that.

**Prefer the fix that makes the promise true.** Rewording the broadcasting course stopped the false claim. Teaching the knot made the original sentence correct, and learners got the knot.

## References

ESTA. (n.d.). *ETCP*. Retrieved October 14, 2026, from https://etcp.esta.org/

NetKnots. (n.d.). *Truckers hitch: How to tie a trucker's hitch*. Retrieved October 14, 2026, from https://netknots.com/rope_knots/truckers-hitch

Tobias, T. K. (2023, July 10). *How to roll your cable*. LEWITT. https://www.lewitt-audio.com/blog/how-to-roll-your-cable

Verrill, A. H. (1917). *Knots, splices and rope work: A practical treatise* (2nd rev. ed.). Project Gutenberg. https://www.gutenberg.org/ebooks/13510
