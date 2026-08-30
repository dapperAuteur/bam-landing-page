<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Refusing Is Kinder Than Half-Doing It
Slug:    refusing-is-kinder-than-half-doing
Excerpt: I built a feature to swap one media file for another everywhere it is
         used. Sometimes a swap is valid for three of a file's five uses and
         invalid for the other two. I had three ways to handle that, and the
         friendliest-sounding option was the worst one.
Tags:    Engineering Judgment, UX, Error Handling, Product Decisions, Wanderlust
-->

# Refusing Is Kinder Than Half-Doing It

Here is a small feature with a genuinely hard decision inside it.

You have a photo in my media library. You've since taken a better version of the same shot. You want the new one to take the old one's place everywhere it is currently used, without hunting through every tour to find them.

Straightforward request. The complication is what "everywhere" means.

## One file, five frames

Think of a photograph you have hanging in five frames around the house. One in the hallway, one on the landing, one on the piano.

Now imagine two of those frames are the very wide panoramic kind, and one of them isn't a frame at all — it's a speaker.

That's roughly the situation. A single media file can occupy several different *kinds* of place at once. One image can be a scene's 360° panorama, **and** the poster thumbnail for that same scene, **and** the hero image at the top of the tour, all simultaneously. In my real database, 80 files sit in more than one kind of slot.

And the slots are not interchangeable. A panorama has to be a genuine 360° photo — an ordinary snapshot wrapped around a sphere looks like a smeared mess. A map pin has to be a flat image. Scene audio has to be audio; you cannot put a photograph in a speaker.

So when you say "replace this file with that one," the honest answer is often: **that works for three of its five places and not the other two.**

## Three ways to handle a partial fit

I had three options, and I want to lay them out fairly, because the one I rejected is the one that sounds nicest.

**Apply what fits, report the rest.** Swap the three that work, leave the two that don't, and show a summary explaining what happened.

**All-or-nothing.** Try everything, and if any part fails, undo the whole lot.

**Refuse upfront.** Before doing anything, check every place the user selected. If any of them can't take the new file, do nothing at all and say which ones and why.

I went with refusing upfront.

## Why "apply what fits" is the trap

It sounds generous. It's the option that gets the most work done. It never makes you do a task twice.

But look at where it leaves you.

Your file is now **half-swapped**. Three places have the new photo, two have the old one. That state is not something you asked for and not something anyone designed. It is a leftover.

To understand what you now own, you have to read a summary and reconstruct the state of your own content from it. Not look at your tours — read a report *about* your tours and build a mental model. And you have to do that immediately, while you still have the report, because the moment you close it the information is gone and the only way to recover it is to inspect every scene by hand.

Then it gets worse, because you will probably want to retry the two that failed. And a retry now has to reason about a situation nobody thought about: a file that is partly replaced, where some of the places you're about to touch are already holding the new thing and some are holding the old thing. Every subsequent operation inherits that mess.

Refusing gives you exactly two possible outcomes:

- Nothing changed.
- Everything you picked changed.

Each of those is describable in one sentence, needs no report to understand, and leaves nothing for the next action to reason around. You may have to do the job twice — once for the images, once for the audio — but at no point do you have to hold a partial state in your head.

That is the trade. The friendlier-sounding option buys you fewer clicks and sells you an unknown state. I'll take the clicks.

## Rejections have names, not counts

The second decision is smaller and, I think, more often got wrong.

When the check fails, the response says **which** places were rejected. By name. Not how many. Here is the top of that refusal:

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
```

The whole point of that block is the middle of it: build the list of what was rejected, so it can be handed back with the refusal.

"3 slots failed" is a sentence that sends a person hunting. They now have to go and find three things among however many they selected, with no clue which. It is technically true and practically useless — it converts a precise piece of knowledge the program already had into a scavenger hunt for the human.

The program knows. It knew the moment it did the check. Throwing that away and replacing it with a number is a small act of vandalism that costs the user real minutes.

The rule I'd generalise: **if your system knows a specific thing and reports a count instead, you have deliberately made the message worse.** Counts are for dashboards. People fixing a problem need names.

## The bit I want to be honest about

My first instinct was "apply what fits." I had it half-built before I stopped.

It felt like the accommodating choice, and I think that's the actual failure mode here: refusing feels rude, so you write software that would rather do something wrong than say no. The generosity is real but it's aimed at the wrong moment. Being agreeable at the click is what makes you unhelpful an hour later.

Refusing is not the app being difficult. It's the app declining to leave you holding something you didn't ask for.

## What I'd take from this

**Count the outcomes your feature can produce.** Not the happy path — all of them. "Apply what fits" has as many outcomes as there are combinations of successes and failures. "Refuse upfront" has two. That number is a design property you can measure before writing a line, and it predicts almost everything about how hard the feature will be to explain, support, and build on.

**A summary is not a substitute for a simple state.** If your error handling requires the user to read a report to know what they now have, the problem is the state, not the report.

**Say which, not how many.** Every time.
