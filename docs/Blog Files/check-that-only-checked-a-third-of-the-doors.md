<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Check That Only Checked a Third of the Doors
Slug:    check-that-only-checked-a-third-of-the-doors
Excerpt: Before deleting a photo, my app checks whether anything still needs it.
         The check looked in four places. There are fourteen. An incomplete
         safety check gives exactly the same confident green light as a complete
         one, which is what makes it so hard to notice.
Tags:    Data Integrity, Safety Checks, Engineering Judgment, Bugs, Beginners, Wanderlust
-->

# The Check That Only Checked a Third of the Doors

There's a guard in my app that I was rather pleased with.

When you delete a file from the media library — a photo, a video, an audio track — it doesn't just delete it. First it checks whether anything still depends on that file, and if something does, it stops you and says what. You can't accidentally delete the panorama a published tour is built around.

Good feature. The kind that quietly prevents a bad afternoon.

It was checking four places. There are fourteen.

## How I found out, which was by accident

I wasn't auditing anything. I was building an unrelated feature — the one that swaps a file for a different file everywhere it's used — and that feature needs the same thing the deletion guard needs: a complete list of every place a file can appear.

So I wrote that list properly, from the database schema outward rather than from memory. Every column, in every table, that can hold a reference to a media file. Fourteen.

Then I opened the deletion guard, expecting to tick them off. Four.

Ten kinds of reference — ten distinct ways a file can be in use — that the guard had never looked at. It had been issuing clean bills of health on less than a third of the evidence.

## Why nobody noticed, including me

The four it checked are the common four.

That's not a coincidence, and it isn't stupidity either. The guard was written when the app was smaller, and at the time those four probably *were* most of the places a file could be. Since then I've added scene audio, poster images, map pin icons, hero images, transcripts. Each arrived as its own piece of work, with its own testing, none of which involved opening a file about deletion and adding a line.

So the guard didn't break. It stopped keeping up, one feature at a time, and there was never a moment where anyone did anything wrong.

Here's what makes this shape of bug dangerous: **a check that is mostly complete gives exactly the same confident green light as one that is complete.** No wobble in the answer, no "probably safe" — the same screen and the same permission to proceed, whether it looked at four places or fourteen.

Incompleteness in a guard is invisible **by design**. The whole purpose of the thing is to be silent when everything's fine, so a guard that never fires when it should is indistinguishable from a guard on a system with no problems.

Compare that to any other bug. A broken button doesn't work. A wrong number looks wrong. A crash hands you a place to start. A guard with a gap produces nothing at all, and the consequences surface later, somewhere else, in disguise.

## The five columns with no formal link

There's a second finding stacked on the first, and it's worse.

A quick explanation for anyone who hasn't worked with databases. When one record points at another — "this scene uses that photo" — you can write the connection down as a plain note, or you can declare it *formally*, so the database itself knows about the relationship and enforces it.

It's the difference between writing a friend's address on an envelope and registering it with the post office. In the first case it's text you copied down and nothing checks it. In the second, the system knows the address is real and won't let anyone demolish the house while letters are still routed to it.

Of the ten unchecked places, **five had no formal link at all.** They held the file's identifier as a plain note, with nothing in the database aware that it referred to anything.

So those five weren't just missing from my guard — they had no second line of defence either. If my check waved a deletion through, which it would, since it wasn't looking, the file would be gone and five kinds of record would be left holding an address for a building that no longer exists.

That's called a dangling reference, and it's a nasty kind of broken because it doesn't fail at the moment of the mistake. It fails whenever someone next tries to follow that address — could be weeks. And at that point it looks like data corruption, rather than like a deletion that should never have been allowed. Cause and symptom end up so far apart in time that you'd almost certainly never connect them.

## Why I keep finding these while doing something else

This is the second time recently that the most valuable thing in a piece of work has been something I found on the way to doing something else. I don't think that's luck; I think it's structural.

Building the replacement feature forced me to answer a question nothing else had ever asked: *what is the complete list of ways a file can be used?* Every previous feature only needed its own slice — the poster feature cared about posters, the audio feature cared about audio. Nobody had needed all fourteen at once.

And the deletion guard, despite being the one thing in the app whose correctness genuinely depends on the whole list, had been written the same way: from the parts someone happened to be thinking about that day.

So the audit didn't come from vigilance. It came from a feature whose requirements happened to overlap with a guard's — and from writing the list out from the source. Memory produces the common cases. Only the schema produces the complete one.

## What I'd take from this

**A safety check is a claim about completeness, not correctness.** Everything the guard did, it did correctly. That was never the issue. The question worth asking of any guard isn't "does it work?" but "what's the list, and where did the list come from?"

**Write the list from the schema, not from what you remember shipping.** I'd have sworn there were six or seven places. There were fourteen — my recall off by more than half, on a system I built myself, alone.

**Anything with no formal link deserves either a link or a written reason.** Five columns pointed at files with nothing enforcing the relationship. Some may have good reasons. "Nobody thought about it" isn't one — and until it's written down you can't tell the two apart.

**Give the guard a home that gets updated.** The fix that matters isn't adding ten more checks; it's that the list of places a file can be used should live in one place, which both the deletion guard and the replacement feature read. If I add a fifteenth next month and forget, I'd rather find out because two features go quiet than because someone's tour lost its photographs.
