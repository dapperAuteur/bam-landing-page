<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   An Orange Button Is Not Orange Text
Slug:    orange-button-is-not-orange-text
Excerpt: My app had no brand colour at all. Giving it one meant learning that a
         colour can be perfect as a background and illegal as a word, that
         contrast is arithmetic you can do before you design, and that a
         decoration only visible in dark mode is worse than no decoration.
Tags:    Design, Accessibility, WCAG, Colour, Beginners, Wanderlust
-->

# An Orange Button Is Not Orange Text

Until last week my app had no brand colour. Not a restrained palette — *none*. Two colours were defined: the background and the text. Everything else had been picked ad hoc as I built each screen, which is why there was a stray green in the footer and an unexplained amber somewhere in the admin.

Renaming the product was the moment to fix it. I picked a palette — tangerine and deep indigo on warm cream, with a stamp gold as a third note — and applied it.

The interesting part wasn't choosing colours. It was the three things I got wrong first.

## The rule I didn't know I needed

The palette's main colour is a tangerine: `#E8590C`. Warm, energetic, exactly right on a cream page.

I put it on a button. Lovely. Then I used it for a link. And a small heading. Still lovely, to me.

It fails accessibility. Not marginally — clearly.

Here's the concept, and it's arithmetic, not taste. **Contrast ratio** measures how different two colours are in brightness. Not hue — brightness. It runs from 1:1 (identical, invisible) to 21:1 (pure black on pure white).

The international accessibility standard sets thresholds:

- Normal text needs **4.5:1** against its background.
- Large text and interface parts need **3:1**.

These aren't opinions. There's a formula. You can compute it before you draw anything.

My tangerine on my cream measures **3.38:1**.

Here is the app before it had any brand colour at all, and after:

![The homepage in monochrome: black headline on white, a black button, grey body text](/blog/orange-button-is-not-orange-text/before-monochrome.png)
*Before. Two colours defined in the entire stylesheet.*

![The same homepage in the new palette: warm cream page, deep indigo slab-serif headline, tangerine button](/blog/orange-button-is-not-orange-text/after-passport-stamp.png)
*After. The tangerine appears only as a fill — never as a word.*

Which means: fine as a *background* behind dark text. Fine as the edge of a control. **A failure as text.** Not because it's ugly — it isn't — but because for a meaningful number of people, including anyone with reduced contrast sensitivity, which increasingly includes everyone as they age, it is genuinely hard to read.

The fix is not to abandon the colour. It's to accept that **one colour cannot do both jobs**, and ship two:

- `--brand` — the bright tangerine. Fills shapes. Never forms letters.
- `--brand-text` — a darkened version, `#B8410A`. Forms letters. Measures 5.23:1. Passes.

```css
:root {
  /* Brand: tangerine. Fill vs text are different values on purpose. */
  --brand: #e8590c;      /* fill — 3.38:1 vs background (UI/non-text only) */
  --brand-text: #b8410a; /* text and links — 5.23:1 */
  --on-brand: #1b1a2e;   /* the label ON a --brand fill — 4.75:1 */
}
```

The ratios live in the file, beside the values. A number with no context is a number someone will change.

They read as the same colour to a casual eye. They are not interchangeable, and the system now makes that explicit, because "use the orange" is ambiguous in a way that silently produces failures.

I did the same split for the accent gold, which is worse: `#F2B705` on cream is **1.72:1**. Essentially invisible as text. Gorgeous as a stamp.

## Doing the arithmetic first

Here's the part I'd recommend to anyone designing anything.

I computed every contrast pair **before** committing to the palette. Not after. Every combination the design would actually use — body text on background, muted text on background, the label colour on a filled button, white on the secondary colour — in both light and dark mode.

That's maybe twenty numbers. It took a few minutes.

Two of them failed, and I adjusted the colours until they passed. Because I did it first, the adjustment was "nudge a hex value." Had I done it after building thirty screens, it would have been "rebuild thirty screens."

The ratios are now written in the code as comments, next to each colour, so that the next person to tweak a value can see what they're about to break. A number with no context is a number someone will change.

## The decoration that only existed at night

The palette is called "Passport Stamp." The idea is travel documents: perforated edges, dashed lines, ink stamps.

So for the featured-course card I built a real perforation — those little semicircular notches punched along a stamp's edge, made by cutting scallops of the *page* colour out of the *card*.

It looked great in dark mode. Genuinely nice.

In light mode it was invisible.

Obvious in hindsight. The card is white. The page is warm cream. Those two are about two percent apart in brightness — deliberately, because that's what makes the palette feel warm and soft rather than harsh. Notches cut in one and revealed as the other are a two-percent difference. There is nothing to see.

I had a decision: make the card darker so the notches showed, or drop the effect.

I dropped it. And the reason is a principle I'd defend generally: **a decoration that appears in one colour scheme and not the other is worse than no decoration.** It means half your users see a design with a deliberate detail and half see the same design with an unexplained gap where a detail should be. You've built an inconsistency and called it a feature.

The dashed borders I was already using carry the same passport reference, read at every contrast level, come free with the styling framework, and behave correctly in high-contrast mode without any work from me. So the card is dashed now, and the bespoke code is deleted.

Less clever. Works everywhere.

## What I deliberately didn't repaint

There are about 107 buttons in the creator and admin parts of the app still using the old neutral styling.

I left every one of them.

Two reasons. The first is risk: repainting a hundred-odd controls across screens I wasn't otherwise touching is a lot of surface area to break for a rename.

The second is better. The neutral token now resolves to deep ink on warm cream — it inherited the new palette automatically. So those screens don't look *unstyled*; they look deliberately utilitarian. Which is correct! The admin is a tool. The learner-facing pages are the product.

Making every admin button tangerine would actively hurt, because if everything is the brand colour then the brand colour stops meaning "this is the thing to press."

A full conversion is a separate job with its own accessibility re-check. Scoping it out was a decision, and it's written down as one, so nobody later reads it as an oversight.

## The bit that can't be checked automatically

I run automated accessibility tests on every change. They pass. Fifty checks, zero serious problems.

They cannot tell me the palette is any good. They can tell me the numbers clear the bar — which is exactly the sort of thing a machine is better at than I am, and worth automating for that reason.

They cannot tell me tangerine and indigo belong together, or that a travel-document metaphor suits a place-based learning product, or that the perforation was a nice idea badly executed.

Accessibility checks are a floor, not a review. Passing them means you haven't excluded anyone through a measurable, mechanical failure. That's a real and important thing to guarantee. It is not the same as the thing being good, and the fact that a tool says "50 passed" in green is seductive in a way that's worth naming.

The floor is arithmetic. Everything above it is still judgement.
