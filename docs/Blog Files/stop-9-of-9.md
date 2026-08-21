<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   "Stop 9 of 9": The Progress Bar That Said You Were Finished Before You Started
Slug:    stop-9-of-9
Excerpt: I built a progress indicator for my 360° tours because research says
         getting lost is the main reason people abandon them. The first version
         greeted visitors with "Stop 9 of 9 — 8 left." Here's the bug, why it
         happened, and why a wrong number is worse than no number.
Tags:    UX, Progress Indicators, Accessibility, Bugs, Engineering Judgment, Wanderlust
-->

# "Stop 9 of 9": The Progress Bar That Said You Were Finished Before You Started

My app builds courses around real places captured in 360°. You stand in a museum, or a gallery, and look around. Arrows on the floor take you to the next room.

The most consistent finding in the research on virtual tours is that people get **lost**, and then they leave. A study of forty virtual museums plus usability testing found a significant gap between how visitors expect the navigation to behave and how it actually behaves — people assume they can click anywhere to go there, and they can't (Rahaman et al., 2023). Broader reviews point the same way: disorientation and visual overload cause people to stop exploring before they finish.

My tours had this problem in a specific, fixable form. The arrows tell you where you *can* go. Nothing told you where you *were*, what you'd already seen, or how much was left. You could be one room from the end and have no way to know.

So I built a stop rail: a strip under the panorama listing every scene, with the current one highlighted, the ones you've visited ticked off, and a plain counter — "Stop 3 of 9 · 6 left."

Then I took a screenshot of it on a real tour and it said:

> **STOP 9 OF 9 · 8 LEFT**

On arrival. Before you'd moved.

## Why a computer said something that stupid

The bug is dull. The lesson isn't.

The tour I was testing is a gallery. It has nine scenes. My program pulled the list of scenes and numbered them 1 through 9 in the order the list came back.

That order is **the order the photographer uploaded them**. Not the order you walk through them. My database has no column for "which scene comes first" — nobody had needed one yet, so the list comes back oldest-upload-first.

And this gallery's tour begins at "Front Door Outside" — which the creator, entirely sensibly, photographed **ninth**. They shot the interior first and went back out for the exterior at the end.

So: the tour opens at the front door, correctly. My rail looks up "front door" in the list, finds it at position nine of nine, and reports that you are on the last stop.

Meanwhile the "8 left" was counting *unvisited scenes*, which was accurate — you'd seen one, eight remained.

Both numbers were computed correctly. Together they said something incoherent: you are at the end, and you have eight to go.

## Why this was worse than having no counter

I want to be precise about the severity, because "off-by-something in a progress bar" sounds cosmetic.

The reason I built this at all comes from the goal-gradient effect — the well-established finding that people push harder as a goal comes visibly closer, and that showing progress raises completion rates. It's why loyalty cards give you two free stamps: starting at 2-of-10 rather than 0-of-8 measurably increases the number of people who finish.

But the same body of work carries a warning that's easy to skim past: **an inflated or misleading progress indicator destroys trust**, and not just in itself. Once someone catches your progress bar being wrong, every other number you show them is suspect.

That matters more for me than for most apps, because I show numbers to museums and universities deciding whether to partner. "Percentage of visitors who complete a tour" is a number I want them to believe. If my own interface can't count to nine, why would they?

And put yourself in the visitor's position. You arrive somewhere new. The interface says you're at the end. You have no idea whether you've somehow skipped the whole thing, whether it's broken, or whether it's just very short. The one thing you were supposed to feel — oriented — is precisely the thing you don't.

The correct fix is not to remove the number. It's to make it true.

## The fix: walk the map, don't read the list

Instead of numbering scenes by upload order, I number them by **the order you'd actually walk them**.

The tour already knows which scenes connect to which — that's what the arrows are. So: start at the start scene, look at every scene it links to, then every scene *those* link to, and so on outward. It's the same way you'd explore a building: everything one room away, then everything two rooms away.

The front door is where the tour begins, so it's stop 1. Then "Front Door Inside," then the paintings, in the order the arrows lead you.

Two details I want to call out because both are judgement, not mechanics:

**Scenes nothing links to still get listed.** If a creator uploads a scene and forgets to connect it, it's unreachable by walking. I append those at the end rather than dropping them. Dropping them would make the tour *look* tidy while quietly telling the visitor there are nine scenes when there are eleven — a smaller version of exactly the lie I was trying to fix. And because rail entries are clickable, listing it is also the only way anyone can get there.

**The rail lets you jump anywhere.** You're never stuck. Some tours have dead-end scenes — a room with no exit arrow, usually an oversight. Without the rail, arriving there means using the browser back button and hoping. That's the disorientation the research describes, in its most literal form.

## The reason nothing could see the current scene

There's a second finding here, and it's the kind that only shows up when you go looking.

The viewer component had *always* known which scene was on screen. It even announced it — every time you moved, it called out the new scene, so anything listening could react.

But the wrapper component that every visitor-facing page mounts was **discarding that announcement**. Not using it, not passing it on. It had one job in the middle and quietly dropped the signal.

So the information existed, travelled most of the way, and fell on the floor one step before anything could use it. That's why no visitor-facing screen had ever been able to say which scene you were in — not because it was hard, but because of a missing line in a file nobody had reason to open.

There was an even better clue. Inside the viewer, there was already a list of every scene you'd visited. Being maintained. Correctly. Used exactly once, when you closed the tab, to report a total to analytics — and then thrown away.

The app had been tracking your progress through every tour all along and telling nobody, including you.

That is a very common shape for a missing feature. Not "we need to build this," but "this is already computed and nothing surfaces it."

## The unrelated thing I found while checking

While testing the rail I ran an automated accessibility scan on the tour page. One critical failure came back, and it wasn't mine.

The navigation arrows — the primary way anyone moves through a tour — are buttons with no name. To someone using a screen reader, the main control of my flagship feature announces as "button." Nothing else. No indication of where it goes.

It's not from my change; it's how the underlying 3D library renders them, and it's been that way as long as the feature has existed.

The worse finding is *why nobody caught it*: my automated accessibility tests don't cover tour pages at all. They cover pages that work without any data loaded, because that's easy to automate. Tours need real content, so they were never included.

Which means the most important, most distinctive surface in the product had **zero** automated accessibility coverage, and I only found out because I went looking by hand on an unrelated errand.

I've written it up as its own piece of work rather than smuggling a fix into this one. The rail does partly help in the meantime — it's a proper list of properly labelled buttons reaching every scene, so tours now have a keyboard-and-screen-reader path for the first time. But that's mitigation, not a fix.

## What I'd take from this

Three things:

**A wrong number is worse than no number.** Silence is neutral. A confident incorrect claim spends credibility you'll want later.

**Test on real content, not clean content.** Every tour I'd have invented for a test would have had scenes uploaded in walking order, because that's the tidy way to imagine it. Only a real creator, working in a real building, in the order that made sense with a camera in their hands, would produce a tour that starts at scene nine. Real data is weird, and its weirdness is the whole point.

**Look at it.** I found this by taking a screenshot and reading it. Every automated check passed — the code was correct, the tests were green, the build was clean. The failure was that the correct code was answering the wrong question, and no amount of test coverage catches that. A person has to look.

## References

Rahaman, H., et al. (2023). *Analyzing behavior and user experience in online museum virtual tours*. arXiv. https://arxiv.org/abs/2310.11176

Kivetz, R., Urminsky, O., & Zheng, Y. (2006). The goal-gradient hypothesis resurrected: Purchase acceleration, illusionary goal progress, and customer retention. *Journal of Marketing Research, 43*(1), 39–58.

*Between curiosity and clunkiness: Why virtual museums still fall short.* (2026). In Extended Abstracts of the 2026 CHI Conference on Human Factors in Computing Systems. https://dl.acm.org/doi/10.1145/3772363.3798315
