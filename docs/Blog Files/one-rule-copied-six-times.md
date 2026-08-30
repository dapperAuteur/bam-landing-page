<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   One Rule, Copied Six Times. Every Copy Skipped the Same Step.
Slug:    one-rule-copied-six-times
Excerpt: My media library names a file in three steps. Six other screens each kept
         their own copy of that rule, and every single copy skipped the middle
         step — so most of my images had one name in the library and "Untitled"
         everywhere else. Here's why duplicated rules rot quietly.
Tags:    Engineering Judgment, Refactoring, Duplication, Data, Beginners, Wanderlust
-->

# One Rule, Copied Six Times. Every Copy Skipped the Same Step.

Every photograph, video and audio file in my app lives in one place — a media library. Thousands of files, all of which need a name a human can read.

The rule for what that name should be is three steps long, and it's the obvious rule:

1. Use the name you typed when you uploaded it.
2. If you didn't type one, use the filename your camera or phone gave it.
3. If there isn't one of those either, say "Untitled".

The library itself follows all three steps. So a 360° panorama you uploaded in a hurry, without stopping to name it, appears in the library as `IMG_20260622_125751_00_509.jpg`. Ugly, but honest. It's your file, and you'd recognise it.

Now go somewhere else in the app — the screen where you pick a hero image for a tour, say — and the same file is listed as **Untitled**.

Same file. Two names. Depending which screen you're standing on.

## Why that's worse than it sounds

If it were one file, you'd shrug and move on.

I wanted to know how common it was, so I counted against the real database rather than guessing. On the hero-image picker, **67 of 133 options** were affected. On the icon picker, **9 of 11**.

That's not an edge case. That is the ordinary condition of an uploaded file, because most people don't stop to type a name — they upload eight panoramas from a shoot and get on with building the tour. Typing a name is the exception. The camera filename is the normal state of the world.

So the picker didn't show a couple of Untitleds among the properly-named ones. It showed a wall of them.

And a wall of identical labels breaks the one job a picker has. Picture a coat check that hands out tickets, and two thirds of the tickets say "coat". You still have your coat somewhere in there. Good luck.

The specific failure is the worst version of it: you upload a file, you go to use it, and it is now indistinguishable from every other file you've ever uploaded without a name. The thing you did ten seconds ago is the hardest thing to find.

## Why six screens all got it wrong the same way

Here's the part I find genuinely interesting, because it isn't carelessness.

There is no single "picker" in my app. There are six of them, written at different times, for different jobs — pick a hero image, pick an icon, pick a poster, and so on. Each one, when it was built, needed a small answer to a small question: *what word do I put next to this thumbnail?*

And each time, whoever was writing it — me, every time — reached for the obvious two-step version. Do they have a name? Use it. No? Say Untitled.

That version is not wrong-looking. It reads as complete. You'd approve it in a code review. The middle step is missing, but a missing step doesn't announce itself — the code quietly does slightly less than it should, and everything it does do is correct.

Meanwhile the full three-step rule existed, written properly, in the library. It lived in a file nobody building a picker had any reason to open. The good version and the six weak copies never met.

That's how this shape of bug always happens. Not one bad decision copied six times — six separate reasonable decisions that happened to land in the same slightly-short place.

## Rules don't drift all at once

The thing I want to hold onto is about *duplication*, and it's a bit counter-intuitive.

The usual argument against copying a rule into six places is that when the rule changes you have to update six places and you'll miss one. True — but that's the visible failure. You'd notice.

The real failure is slower. Six copies don't drift together — they drift **one copy at a time**, in whichever direction the person writing that copy happened to need that day. Each divergence is small and locally sensible. Nothing breaks. Nothing errors. There's no crash to investigate.

And the copy that has drifted is invisible from wherever you happen to be standing. Open the library and the naming is perfect. Open the picker and it's wrong — but I'm never comparing, because I only look at one screen at a time. The two views of the same file are never in front of me at once.

So a system can hold contradictory answers to the same question for months, and the only way anyone finds out is when a user does the thing I never do: uploads without naming, then goes straight off to use it.

## The fix is boring, which is the point

One shared function. Every picker calls it. The library calls it too.

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

That's the whole thing. The rule now exists once, so there is nothing left to drift.

Two small details in there that I think are worth naming:

**The trims matter.** A name that is a single space character is not a name. Without trimming, an accidental space beats a perfectly good camera filename, and you're back to Untitled with an extra step. Real user data is full of stray whitespace.

**"Untitled" is passed in, not baked in.** The app runs in English and Spanish, and the placeholder is a word a human reads. Hard-coding it inside the rule would mean the rule quietly decides your language for you — a small thing that becomes an annoying thing the moment someone wants it translated.

## What I'd take from this

**Count it before you judge it.** My instinct was that this was cosmetic and rare. Two queries told me it was the default state of two thirds of my images. The instinct was wrong in the direction that always costs you: it made a common problem look like an uncommon one.

**A rule written in six places is six rules.** Not one rule in six locations — six independent rules that currently agree. That distinction sounds pedantic right up until they stop agreeing.

**The bug you can't see from your own screen is the one to go looking for.** I would never have hit this myself, because I name my test uploads. Every bug that only bites people who are in a hurry is invisible to the person who built the thing, by definition — the builder is never in a hurry in their own app.
