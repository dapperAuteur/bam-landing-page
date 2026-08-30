<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Refusing Is Kinder Than Half-Doing
Slug:    refusing-is-kinder-than-half-doing
Excerpt: I built a way to swap one media file for another everywhere it's used.
         Some of those places can legally take the new file and some can't, in
         the same click. The friendly-sounding option — do what fits, report the
         rest — is the one that leaves someone with a mess they didn't design.
Tags:    Engineering Judgment, Error Handling, UX, Product, Beginners, Wanderlust
-->

# Refusing Is Kinder Than Half-Doing

Here is a small feature with a genuinely hard decision inside it.

A creator uploads a better version of a photo — the panorama reshot with the lights on, the logo redrawn, the audio narration re-recorded without the traffic noise. They want the new file to take the old one's place. Everywhere.

"Everywhere" is doing a lot of work in that sentence.

## One file, many jobs

A single file in my app can be doing several unrelated jobs at once.

One 360° photograph might be the panorama a visitor stands inside for a particular scene, *and* the still poster image shown for that same scene before it loads, *and* the hero image at the top of the whole tour. Three jobs, one file, all live at the same time.

That's not unusual. Checking against the real database, **80 files are currently doing more than one kind of job.** It's the sensible thing for a creator to do — you shot one good picture of the courtyard, so you use it for the courtyard.

I call each of those jobs a slot. And the awkward fact underneath this whole feature is that **slots are not interchangeable.**

A panorama slot needs a 360° photo — a flat photograph put there doesn't render, it just breaks the room. A map pin icon needs a small flat image; a 360° panorama squeezed into a pin is nonsense. A scene's audio narration needs an audio file. These aren't preferences. They're what the slot physically is.

So here's the situation the feature has to handle. You pick a file that's in five slots. You pick its replacement. And the replacement is perfectly legal for three of those slots and illegal for the other two.

Not because anyone did anything wrong. Because a file's uses are various and a replacement is one thing.

## Three ways to handle it

**Option one: do what fits, report the rest.** Swap the three legal slots, skip the two illegal ones, hand back a summary saying what happened.

**Option two: all or nothing.** Try everything, and if any part fails, undo the whole thing and report the failure.

**Option three: refuse upfront.** Before touching anything, check every selected slot. If even one can't take the file, do nothing at all and say which ones.

My first instinct was option one. It sounds generous. It sounds like the software being helpful instead of pedantic — *I got most of it done for you.* Being told "no" by a computer is annoying, and I generally try not to do it.

I picked option three anyway, and I want to lay out the argument, because I think it generalises well beyond this feature.

## Why "do what fits" is the unkind one

Think about hiring a van to move house. You've listed everything that needs to go.

The considerate-sounding version is the driver who loads what fits, drives off, and posts you a receipt saying seven items were moved. You are now standing in a house that is neither packed nor unpacked, holding a list, trying to work out what's still here by subtracting the receipt from your memory.

That's option one. It doesn't fail. It produces a state.

And that state has three costs that all land on the creator, not on me.

**They have to reconstruct the half.** The only record of which slots got swapped and which didn't is the summary message I hand back. If they close that message, misread it, or get interrupted, the information is gone and the only way to recover it is to go and look at every scene in the tour by eye.

**A retry has to reason about a situation nobody designed.** If they fix the problem and run the replacement again, the system is now starting from a half-swapped state. Some slots hold the new file, some hold the old one. Every subsequent question — what does "replace everywhere" mean now? — has an answer I never sat down and thought about.

**The result doesn't fit in a sentence.** With option three there are exactly two possible outcomes: *nothing changed*, or *everything you picked changed*. Both are one short sentence, and both are states the creator can hold in their head while doing something else.

Option two — attempt it, then undo on failure — gets you the same two clean outcomes, and it's a perfectly respectable choice. I preferred refusing upfront for one reason: it tells you before it costs you anything. Undoing work is a promise you have to keep correctly under conditions that are, by definition, already going wrong.

## Say which ones. Don't say how many.

The other half of the decision is what the refusal actually says, and this is where I think a lot of software gets lazy.

It would be much easier to return "3 slots could not accept this file." It's true. It's also useless — it sends someone hunting through their own tour trying to work out which three, with no idea whether they're looking for a panorama, an icon, or a piece of audio.

A count tells you a problem exists. A name tells you where it is. Only one of those is help.

```ts
if (allowed.length !== parsed.data.selections.length) {
  const allowedKeys = new Set(allowed.map((a) => `${a.slot}::${a.rowId}`));
  const rejected = parsed.data.selections.filter(
    (sel) => !allowedKeys.has(`${sel.slot}::${sel.rowId}`),
  );
  return {
    ok: false,
    error: "Some of those places cannot take this file",
    code: "ineligible_slots",
    // Named, not counted. "3 slots failed" sends the creator hunting.
```

The work in there is unglamorous: take what was allowed, subtract it from what was asked for, and carry the difference back out as a list of actual things rather than a number. That's four extra lines to turn a dead end into a to-do list.

## What I'd take from this

**"Helpful" and "partial" are not the same thing.** Software that does most of what you asked and tells you about the rest has moved the hard part — working out where you now stand — from itself to you. It feels friendlier and costs more.

**Count the possible end states, not the possible actions.** The question I found useful wasn't "what should this do?" but "how many different situations can a person be left standing in when this finishes?" Two is a good number. Two is explainable. As soon as the answer is *it depends how far it got*, you're designing a mess.

**Refusing is only kind if the refusal is specific.** "No" with a reason and a location is respectful of someone's time. "No" with a tally is just a door closing.
