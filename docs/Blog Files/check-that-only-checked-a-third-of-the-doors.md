<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Check That Only Checked a Third of the Doors
Slug:    check-that-only-checked-a-third-of-the-doors
Excerpt: Before deleting a photo, my app checks whether anything still uses it.
         It looked in four places. There are fourteen. A guard that is mostly
         complete gives you exactly the same confident green light as a
         complete one, which is why nobody noticed.
Tags:    Safety, Data Integrity, Engineering Judgment, Bugs, Beginners, Wanderlust
-->

# The Check That Only Checked a Third of the Doors

My app has a media library — photographs, panoramas, audio, icons — and those files get used all over the place: a panorama in a scene, a hero image on a tour, an icon on a category, narration on a stop.

So deleting a file is dangerous, and there is a guard. Press delete and the app first goes and checks whether anything still depends on that file. If something does, it refuses and tells you what's using it.

Good feature. I built it early, because losing a photo out from under a published tour is exactly the sort of quiet damage you don't find out about for weeks.

That check looked in four places.

There are fourteen.

## The warden who sweeps four rooms

Picture the person who walks a building at closing time to make sure nobody's still inside before the doors get locked.

They put their head into four rooms, find them empty, come back to the desk and say **all clear**.

The building has fourteen rooms.

Now here is the thing I keep turning over. The report they hand you is *identical* to the report they'd hand you if they had swept all fourteen. Same words, same confidence, same tone. There is nothing in "all clear" that carries how much of the building it covers. A verdict has no room in it for how much was looked at.

That is what an incomplete guard is. Not a guard that fails — a guard that succeeds, in exactly the way a working one does, on a subset of reality.

## Why it stayed unnoticed

The four places my check looked at are the four you'd think of first: the ones I built first, the ones I use every day, the ones a tour is mostly made of. If you set out to break the guard by hand, those are the cases you'd try, and it would hold.

The other ten are the places files ended up as the product grew. A poster on a scene. An icon on a category. A file attached to something added six months after the delete check was written. Each one arrived as a small feature, each one was tested as a small feature, and none of them prompted anybody to go back and ask: *does the thing that protects files know about this?*

That's the real mechanism. The guard wasn't wrong when it was written; it was complete on the day it shipped and decayed by standing still while everything around it moved. There is no error message for "a check that was comprehensive in March."

## The five with no formal link

Ten unchecked references is bad. Five of them are worse, and this bit needs a plain explanation.

There are two ways a database can hold a reference to something.

The first is a **formally registered link**. You tell the database, once, that this column points at that table, and from then on the database itself enforces it: it will not let you delete a photo that something points at, regardless of what any application code does or forgets to do. It's a lock the building owns, not one the warden carries.

The second is **a note in pencil**. A column that holds an identifier, with nothing declared about what that identifier means. It works fine — the app reads it and looks the file up — but the database has no idea it's a reference. To the database it's just a value.

Five of my ten unchecked references were the pencil kind.

That combination is the actual problem: my application guard didn't know to look at them, and the database guard didn't exist. Two safety nets, one hole punched through both in the same spot.

What that means concretely: a delete goes through cleanly, with no complaint from anywhere, and leaves behind a row that says "show the photograph with this identifier" where there is no such photograph.

## Why the damage arrives disguised

Nothing goes wrong at the moment of the delete. That is the whole trouble.

The failure shows up later — a grey rectangle where a panorama should be, a category with no icon, a scene that won't load — and it shows up detached from its cause, weeks after the click that caused it. Nobody remembers deleting anything. The evidence looks like the database has gone bad on its own.

So the symptom reads as "data corruption," which sends you hunting for a storage fault or a bad migration. It does not look like *a guard that didn't fire*, because a guard that doesn't fire leaves no trace anywhere. Its whole job was to have prevented the thing you're now standing in.

This is the specific reason I'd rank incomplete guards above ordinary bugs in nastiness. An ordinary bug shows you its own footprint. An incomplete guard shows you somebody else's.

## How I found it

Not by auditing. By accident.

I was building an unrelated feature — swapping one media file for another everywhere it's used — and that needs, as its very first step, a complete list of every place a file can appear. Not most places. Every place, or the swap misses some.

So I sat down and wrote that list properly, for the first time, and counted fourteen.

Then I opened the delete check and counted four.

The list had never existed anywhere. The knowledge of where files get used lived in my head, and in whichever file I happened to have open, and it turned out my head held about a third of it. Writing it down was the entire discovery.

## What I'd take from this

**A guard's confidence is not evidence of its coverage.** "Nothing depends on this file" and "nothing I looked at depends on this file" produce the identical message, and only one of them is what you meant. If a check gives a verdict, ask what its denominator is — and if nobody can say, that is the finding.

**Enumerations rot, and nothing tells you.** Any list inside a program that is supposed to mean "all of them" is a promise that quietly expires every time the product grows. It needs a way to be checked against reality, or a note wherever it gets extended saying which lists now need updating.

**Let the database hold the rule where it can.** A formally registered link is a guard I cannot forget to call. Every reference I leave as a note in pencil is a rule I have promised to remember, and I have now got documented evidence about how good I am at that.
