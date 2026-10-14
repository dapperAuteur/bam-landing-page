<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Copy Everything or Copy Nothing
Slug:    copy-everything-or-copy-nothing
Excerpt: Wanderlust can now copy a scene or a whole tour, so nobody has to
         rebuild hotspots and arrows by hand. Every copy is all or nothing.
         My first test run failed anyway, because I saved things in the wrong
         order. The fix is a lesson about order, and a question to ask any
         vendor whose app copies your work.
Tags:    Creator Tools, Data, Buying Software, Plain Talk, Wanderlust
-->

# Copy Everything or Copy Nothing

A tour on Wanderlust is a set of 360° scenes. A scene is one spot where you can stand and look all the way around. Each scene has hotspots, the small points you click to read a label, hear a sound or open a page. It also has arrows that walk you to the next scene.

Placing all of that takes time. To get a second version of a scene or a tour, I had to build it again by hand. That is slow, and it is how mistakes creep in.

Now there are two buttons: **Duplicate scene** and **Duplicate tour**.

## Duplicate a scene

At the bottom of a scene's edit page, **Duplicate scene** makes a copy in the same tour. The copy keeps:

- the photo
- the starting view, the horizon setting and the view limit
- the hotspots
- the arrows leading out of it
- its moment photos, older photos of the same spot that visitors can switch to

The copy starts as a **draft**, work in progress that visitors cannot see. It is not pinned to the tour's floor plan yet, so it does not sit on top of the original's pin.

And nothing leads to it. Arrows into the original are not copied, because which door should open onto the copy is the creator's call. Until you add an arrow, nobody can walk in.

## Duplicate a tour

**Duplicate tour** sits under **Edit details** on the tour page. It copies the tour's settings and styling, every scene you can edit with its hotspots, the arrows between those scenes, the scene the tour opens on, the timeline and its photos, the tour links and the files assigned to the tour.

Some things stay behind on purpose:

- **The copy is private.** It has no share link, the private web address you can send to someone, and it is not listed on the public tours page. I can try a different version without touching the live one.
- **Hunts stay with the original.** These are the treasure-hunt games built on a tour.
- **Course links stay with the original.** A lesson keeps pointing at the tour it was built for.
- **Learners' progress stays with the original.**
- **Scenes another creator owns are left out.** Arrows that would lead to them are dropped too, so the copy never has an arrow into another tour.

Both buttons ask first, in plain words. The keyboard focus lands on **Cancel**, not on **Yes, duplicate**, so someone who presses Enter out of habit gets the safe answer. The W3C's guide to pop-up dialogs makes a similar point: for a step that is hard to take back, it may be wise to start on "the least destructive action" (W3C Web Accessibility Initiative, n.d.). Copying destroys nothing, but a whole tour is a big thing to make by accident.

Then it opens the copy, so you land where you will work. Names get "(copy)" added, then "(copy 2)" and so on.

## All or nothing

Copying a tour is many small saves: the tour, its timeline, its scenes, the moment photos, the arrows, the hotspots and the files.

What if the fifth save fails?

Without care, you get scenes without their hotspots and arrows that lead nowhere. A half-copied scene is worse than no copy at all, because you might not notice until a visitor does.

So every copy runs inside one database transaction. A database is where the app keeps everything it knows. A transaction bundles many steps "into a single, all-or-nothing operation" (PostgreSQL Global Development Group, n.d.). If one step fails, none of them count. The database rolls back, which means it undoes every step as if none had happened. You get a whole copy or a plain error message, never half of one.

## The bug the first test found

I tested this in a real browser, on test data visitors never see. The first run failed.

A tour remembers which scene it opens on, its start scene. The database enforces a rule: a tour may only point at a scene that already exists.

My code saved the new tour first, because scenes belong to a tour. But the new tour already named its start scene, and that scene had not been copied yet. The new tour pointed at a scene that did not exist, and the database refused. It was right to refuse.

It is a chicken-and-egg problem. The scenes need the tour. The tour's start scene needs a scene.

The fix is about order, and all of it happens inside the same transaction:

1. Save the tour with no start scene.
2. Copy the scenes, then everything that hangs off them.
3. Go back and set the start scene.

Because it is one transaction, nobody ever sees the tour with no start scene. Either all three steps land, or none do. And any failure now ends the same way: the copy rolls back cleanly, and you see a short message saying the copy failed.

After the fix, the browser run passed all 7 of its checks. The tour copy matched the original exactly: 8 scenes, 14 links between scenes, 2 hotspots and 14 assigned files. The copy was private, with no share link. A duplicated scene opened as a draft.

## A copy that keeps up

The copy code starts from everything in the original and changes only what must differ: a new name, a new owner, draft or private status. Each of those is spelled out in the code with its reason. So a field I add to hotspots next year comes along in copies without anyone remembering to update the copy code.

## Questions to ask

If you buy software that copies your work, ask the vendor:

> "If a copy fails halfway, what is left behind?"

A good answer: nothing. It is a whole copy or none. Then ask:

> "What does the copy leave out, and why?"

Share links, public listings and people's progress are the kind of thing a good copy leaves behind. A vendor who can list them has thought about it.

If you hire someone to build this, ask: "How do you make sure a copy is never half done?" Listen for "transaction" or "all or nothing." Then ask what their first test caught. Mine caught a bug in the order of saves. That was the test doing its job.

## References

PostgreSQL Global Development Group. (n.d.). *3.4. Transactions*. PostgreSQL 18 documentation. https://www.postgresql.org/docs/current/tutorial-transactions.html

W3C Web Accessibility Initiative. (n.d.). *Dialog (modal) pattern*. ARIA Authoring Practices Guide. https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
