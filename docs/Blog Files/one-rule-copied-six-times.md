<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   One Rule, Copied Six Times, and Every Copy Skipped the Same Step
Slug:    one-rule-copied-six-times
Excerpt: One file in my media library was called IMG_20260622_125751_00_509.jpg
         on one screen and "Untitled" on six others — the same file, under two
         names. Two thirds of the options in the picker were affected. Here is
         why a rule written down six times drifts one copy at a time.
Tags:    Engineering Judgment, Refactoring, Duplication, Bugs, Beginners, Wanderlust
-->

# One Rule, Copied Six Times, and Every Copy Skipped the Same Step

My app is built around real places captured in 360°, which means it is, underneath, a media library. Panoramas, posters, map pins, audio, little icons. And it has a lot of screens where you go and pick something out of that library — choose the hero image for a tour, choose the icon for a category, choose the audio for a scene.

Every one of those screens has to show you a name for each file. So there is a rule for what a file is called.

## The rule, and the reception desk

Imagine a reception desk with a rule for greeting arrivals. Use the name they gave when they booked. If they didn't give one, read the name off their ID. If they haven't got either, say "Guest."

Three steps, in order, each one a fallback for the last. Nothing clever about it.

My media library had exactly that rule:

1. The **display name** you typed when you uploaded the file.
2. If you didn't type one, the **original filename** the camera gave it.
3. If somehow there is neither, a **placeholder**.

The library page followed all three steps. The six picker components followed step one and step three.

Every one of them skipped the middle.

## What that looked like

You upload a photo from a 360° camera and don't bother typing a name, because why would you — you're in a hurry and you can see the thumbnail.

The camera named it `IMG_20260622_125751_00_509.jpg`. Ugly, but it is a name, and it is *yours*: it encodes the date and time you stood there and pressed the button.

Open the media library and that is what you see. Correct.

Open any picker — the one for choosing a tour's hero image, say — and that same file is listed as **Untitled**. So is the one you uploaded before it. So is the one before that.

The same file, in the same app, under two different names, depending on which screen you were standing on.

The practical damage isn't aesthetic. It's that the moment you most need to find a file is *right after you uploaded it*, and that is exactly the moment it has no typed name yet. So the flow was: upload the thing, go to attach it, and get a list of identical Untitleds with no way to tell which one you just made.

I ran the numbers against the real database rather than guessing:

- **67 of 133** hero-image options were affected.
- **9 of 11** icon options were affected.

That is not an edge case. A file with no typed name is the *default state* of an uploaded file. I had built the naming rule around the exception and broken it for the norm.

## Why this was possible

Here is the honest part: I wrote all six of those pickers, and every one of them was a copy of the last one that worked.

That is how the second, third, fourth and fifth picker got built. Not by anyone deciding to duplicate a rule — by someone (me) needing a picker on a Tuesday, finding a picker that already existed, copying it, and changing the bits that were obviously specific to the new job. The naming line looked generic. It looked like plumbing. So it came along for the ride, unread, five more times.

And the rule was never written down as a rule anywhere. It wasn't a function with a name. It was a habit, expressed inline, in six files, none of which mentioned the others.

Which brings me to the thing I actually want to say about duplication.

**Duplicated rules don't drift all at once.** If all six copies were wrong the same day I'd have noticed within a week, because the app would have looked broken everywhere. Instead one copy got the middle step and five never had it, and each file was internally consistent and read perfectly well on its own screen. Nothing looked wrong. You only see the disagreement if you open two of the six side by side and compare them line by line, and nobody does that, because there is no reason to — until someone reports that a file has two names.

The drifted copy is invisible **by design**. That's not a failure of attention. It's a structural property of writing the same rule down more than once.

## The fix

Move the rule to one place and have all six screens ask it.

```ts
export function mediaLabel(
  option: { displayName?: string | null; originalFilename?: string | null; fallbackName?: string | null },
  unnamed: string,
): string {
  return (
    option.displayName?.trim() ||
    option.originalFilename?.trim() ||
    option.fallbackName?.trim() ||
    unnamed
  );
}
```

Two details worth pointing at, because both are judgement rather than mechanics.

The helper has **one more rung** than the rule I described above. Some screens carry their own sensible fallback — the row the file is attached to already knows what it is — so that gets a turn before the placeholder does. Writing the rule down properly, once, was the first time I had to decide the full order of preference on purpose instead of by accident.

And the placeholder is **passed in** rather than baked in. Different screens word it differently, and that difference is legitimate. What is not legitimate is six screens disagreeing about the *order of the steps*. The shared helper fixes the part that must be identical and leaves the part that is allowed to vary as a knob.

That distinction is the whole trick, really. Sharing code is not about removing repetition for tidiness. It's about deciding which parts of a rule are the rule.

## What I'd take from this

**Copy-paste is a decision, and it's made at the worst possible moment.** You duplicate a file when you are busy, focused on something else, and treating the thing you copied as furniture. That is precisely when you are least equipped to notice you have just made a second copy of a rule that will now age separately.

**Check the default case, not the tidy one.** Every file I would have invented for a test would have had a name typed on it, because that's the tidy way to imagine a media library. Real uploads mostly don't. The bug lived entirely in the case I never pictured.

**Count it before you argue about it.** "Some files show as Untitled" is a shrug. "67 of 133" is a decision. It took one query to turn a vague annoyance into an obvious priority, and I nearly skipped it because I already knew the fix.
