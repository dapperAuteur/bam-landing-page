<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Share Link Always Pointed at the Front Door
Slug:    share-link-always-pointed-at-the-front-door
Excerpt: A visitor could walk nine rooms into one of my 360° tours, press share,
         and hand their friend the front door. The fix was small. The
         interesting part is why the plumbing was awkward, and why I kept the
         layout that made it awkward.
Tags:    UX, Sharing, Component Design, Engineering Judgment, Beginners, Wanderlust
-->

# My Share Link Always Pointed at the Front Door

My app builds courses around real places captured in 360°. You stand in a gallery, or a courtyard, and look around. Arrows on the floor take you through.

Underneath the viewer there's a share panel, and in it a thing I call the quick link. A normal link to a tour drops your friend on a chooser screen — here are the scenes, pick one. The quick link skips that. Follow it and you are simply *in* the tour, looking around, no menu in between. It exists because the chooser is a speed bump, and speed bumps are where shared links go to die.

The quick link worked perfectly. It just always sent people to the same place.

## The postcard problem

Say you walk into a building, go up three floors, through a courtyard, and end up in a room with the thing worth seeing in it. You take a photo. You send it to a friend with a link.

Your friend opens the link and is standing on the pavement outside, looking at the front door.

That was my share button. However far a visitor had walked — nine scenes deep, past the bit that made them want to tell someone — the link they copied said "open this tour at the beginning."

Not a mistake in the sense of a broken line. The link was correct, well-formed, and did exactly what it said. It said the wrong thing.

## Why it couldn't have known

Here is the part worth explaining properly, because it's a shape that recurs.

The page containing a tour is put together on my server before it reaches you. The server assembles the whole thing — the title, the description, the viewer, the share panel — and sends it down as a finished document. That happens *once*, at the moment you arrive.

At that moment, the only scene that exists as a fact is the tour's starting scene. You haven't moved. You haven't even seen it yet.

So the quick link was built into the page like a line printed in a theatre programme. The programme is accurate when it's printed, and it goes on saying the same thing all evening no matter what happens on stage. Walking around the tour changed the stage. It could not change the programme.

The fix is to stop printing the link and start writing it as you leave: whatever scene you are currently looking at is the scene the link points to.

Small change. Obviously correct. And it took a surprising amount of plumbing, for a reason I think is more interesting than the bug.

## Two shops and no shared back office

The share button sits **below** the tour viewer. That is deliberate and I'd defend it: you share a place *having seen it*, not on arrival. Putting a share button above the thing you haven't looked at yet is asking someone to recommend a restaurant from the pavement.

But it creates a structural awkwardness.

The viewer is an interactive component — it responds to you, it has moving parts, it knows things that change. The share button is also an interactive component, separately. And the page that holds them both is *not* interactive. It's assembled on the server and shipped as a static document.

In ordinary software you solve "two things need to agree on a fact" by putting the fact in whatever contains them both. The parent holds it, the children read it. Standard.

Here there is no such parent. The thing containing both of them is a printed page. It doesn't hold state; it doesn't run; it can't be told anything.

So the viewer and the button are like two shops in the same mall with no shared back office. They're twenty metres apart. Neither can walk into the other. The building's management is asleep.

What you do in that situation is use the mall's public address system. The viewer, every time you move, announces to the page: **now showing — the courtyard**. It doesn't know or care who's listening. The share button listens for those announcements, and each time it hears one, it rewrites its link.

Nobody is anybody's parent. Nothing new sits in the middle. One component talks to the room; the other one pays attention.

## The rearrangement I nearly did instead

I want to flag the wrong turn, because it was tempting for about ten minutes.

The easy fix is to move the share button up beside the viewer, inside the same interactive boundary, so they can share state the normal way. Ten seconds of work. All the awkwardness disappears.

And it would have made the page worse for every visitor, forever, in order to make one file tidier for me once.

That's the trade I want to name. Layout decisions that are right for the reader will sometimes make state-sharing awkward, because the reader's ideal ordering and the code's ideal ordering are answering different questions. The reader's ordering asks "what should someone encounter first?" The code's asks "what contains what?" There is no reason those should agree.

When they disagree, the cost of the extra plumbing is nearly always smaller than the cost of rearranging the page. The plumbing is paid once, by me, in a file. The rearrangement is paid by everyone, every visit.

And the announcement approach isn't a hack around the layout — it's a better description of what is actually happening. The viewer really is the only thing that knows where you are. Anything else on the page that ever needs to know can now listen too, without me touching the viewer again.

## What I'd take from this

**A value computed once will keep being right about a moment that has passed.** Anything decided at page-assembly time is a snapshot. If the thing it describes can change afterwards, the snapshot becomes a confident lie with no error attached to it.

**Let the layout win.** If your components are in the order a reader needs and that makes them hard to wire together, wire them together the hard way. Moving the furniture to suit the cabling is how pages slowly become about their own implementation.

**Check the feature from the far end of the journey.** Every time I tested sharing, I tested it from the scene I'd just loaded — because that's where you are when you're testing. The bug lived exclusively nine rooms in, which is where every real visitor was standing.
