<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Share Link That Always Pointed at the Front Door
Slug:    share-link-always-pointed-at-the-front-door
Excerpt: My tours have a quick link that drops someone straight into the 360°
         experience. It was worked out once, when the page loaded, and it always
         meant "start at the beginning" — so no matter how far you walked, you
         shared the doorway. The fix was easy. The plumbing was the story.
Tags:    UX, Sharing, Front-end Architecture, Engineering Judgment, Beginners, Wanderlust
-->

# The Share Link That Always Pointed at the Front Door

My app builds courses around real places captured in 360°. You stand in a room, look around, and follow arrows on the floor into the next one.

There's a share panel underneath the viewer, and in it there's a quick link — a web address that drops whoever you send it to straight into the tour, rather than onto a menu asking which scene they'd like. Fewer decisions, more standing-in-the-room. That was the whole point of it.

It worked. It also always sent people to the same place.

You could walk through eleven rooms of a gallery, find the one painting that made the whole thing worth it, hit share — and your friend would open the link and be standing outside the front door.

## Why the link was wrong in a way that never looked wrong

The link wasn't broken. It was **stale**, which is a much sneakier condition.

When you open a tour page, my server assembles the page and sends it to your browser, finished. Part of assembling it is working out that share link. At that moment — the moment of arrival — the correct answer really is the front door, because that's genuinely where you are. So the server wrote a link carrying an instruction that meant, in effect, *open this tour at its starting scene*, and printed it into the page.

And then you walked off, and the link stayed exactly where it was.

It's the difference between a photograph and a window. The link looked like a live window onto "where you are". It was a photograph of where you were when you arrived, and photographs don't update.

That's why nothing ever flagged it. No error, no failure, no moment where anything goes wrong — every part of the system did its job correctly, once, at the beginning. The bug lives entirely in the gap between "correct when computed" and "still correct now", and that gap has no symptom on the screen you're looking at. You'd only catch it by sending yourself a link from deep inside a tour and noticing where you landed.

## Two live patches on a dead page

Here's where it gets architecturally awkward, and I think this part is worth explaining properly, because it's a very common shape and it's usually invisible from the outside.

Most of my tour page isn't interactive. It's assembled on the server and sent down as a finished document — headings, descriptions, credits, the lot. That's deliberate: it's fast, and someone on a bad signal in a museum basement gets something readable immediately.

But two things on that page *are* alive.

**The viewer** — the 360° panorama you drag around, which knows perfectly well which scene it's currently showing, because that's its entire job.

**The share panel** — the buttons, the copy-link control, the quick link.

They are separate components. Neither contains the other. And the thing that contains both — the page — isn't interactive, so it can't hold a piece of changing information like *which scene are we in right now*. A printed poster can't remember anything.

Normally, when two components need to agree on something, you put it in whichever component contains them both and hand the value down to each. That's the standard move, and it requires a shared parent that can remember things. Here there wasn't one.

## The layout is not the problem, even though it caused the problem

The obvious escape route is to move the share panel inside the viewer, or wrap both in something interactive, and be done.

I didn't, and I want to be clear that this was a decision rather than an oversight.

The share panel sits *below* the viewer on purpose. You share a place having seen it, not on arrival. A share button at the top asks people to recommend something they haven't experienced yet — a worse conversion and a slightly rude thing to do. The order of the page follows the order of the emotion: look, be somewhere, then think of someone you'd send it to.

Wrapping the whole page in an interactive shell to solve a plumbing problem would mean shipping more code to every visitor, including the ones on the basement connection, in exchange for nothing they can see. The layout is right for the reader, and the layout is what makes the wiring awkward. Both true; only one of them worth changing.

## Announce it to the room

The fix is the thing you do when two people can't pass a note directly: one of them says it out loud, and the other listens.

The viewer already knew which scene was on screen. Now, every time you move, it announces the change — not to any particular component, just out loud, to the page. The share panel listens for that announcement and rebuilds its link.

Nobody has to contain anybody. The viewer doesn't know the share panel exists, and the share panel doesn't know where the announcement came from. Either one can be moved, redesigned, or removed without the other noticing.

There's a nice bit of history here. When I built the progress rail — the strip that tells you which stop you're on — [I found that the viewer had been making this announcement all along](/blog/stop-9-of-9), and a wrapper in the middle was quietly throwing it away before anything could hear it. The signal existed. Nothing was listening. Once that was fixed, this share problem stopped being an architecture question and became about four lines of listening.

Which is often how it goes: the second feature that needs a piece of information is dramatically cheaper than the first, and it's tempting to judge the first one as slow when it was actually paying for both.

## What I'd take from this

**"Correct when computed" is not a property that lasts.** Anything worked out once, at page load, about a thing that moves, is a photograph pretending to be a window. It's worth keeping a mental list of those in any product — they never announce themselves, because nothing ever fails.

**Test the share link from the middle, not the start.** Every share feature I've ever built, I've tested by loading the page and clicking share. That's the one path where a stale link is indistinguishable from a correct one.

**Sometimes the right layout makes the code harder, and you pay it.** Rearranging a page so the components nest more conveniently optimises the thing nobody sees at the expense of the thing everybody does.
