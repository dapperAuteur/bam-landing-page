<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Had Three Designs and the Tools to A/B Test Them. I Picked One Instead.
Slug:    not-ab-testing-my-brand
Excerpt: Splitting traffic three ways sounds rigorous. At my traffic, with a
         colour change, it's a test that can never conclude — while making
         every screenshot and partner deck hedge on which brand you'd see.
         The arithmetic, and what to test instead.
Tags:    Experimentation, A/B Testing, Statistics, Product Decisions, Beginners
-->

# I Had Three Designs and the Tools to A/B Test Them. I Picked One Instead.

I redesigned a product and produced three complete visual directions. All three real, all three fully built out on the actual landing page with the actual copy.

The obvious next move: run them against each other. Show a third of visitors each, see which converts best, keep the winner. Let data decide instead of taste.

I had the tools. My analytics platform does this out of the box. The palettes were already built in a way that made switching between them a one-line change.

I decided not to, and I want to walk through the reasoning, because "we should A/B test it" is one of those suggestions that sounds unarguable and often isn't.

## What an A/B test actually is

Split your visitors randomly. Half see version A, half see version B. Measure which group does more of the thing you want. Whichever wins, ship.

It's genuinely powerful, and it's how you avoid shipping your own preferences and calling them user research.

The catch is that it's a **statistical** tool, and statistical tools have requirements. The one that matters here: you need enough people to tell a real difference from random noise.

If ten people see A and six click, and ten see B and four click, A has "won" 60% to 40%. That is not a result. That is what flipping twenty coins looks like. You'd get differences that large by chance constantly.

The number of people you need depends on how big the real difference is. A huge difference shows up fast. A small one needs an enormous crowd before it separates from noise.

## Two numbers that made my answer obvious

**How big is the effect?** I'm changing colours. Not the offer, not the price, not the headline — the palette. That's a small-effect change. Real, probably, but small.

**How much traffic do I have?** I'm pre-launch. Not "modest." Not much at all.

Small effect plus small sample is the combination where a test cannot resolve. Not "takes a while" — *cannot*. You run it, you get a difference, and you have no way to know whether it's the design or the weather. The honest read of the result is "inconclusive," and you were always going to get that.

And splitting **three** ways rather than two makes it a third worse, because each version now gets a third of an already-small number.

## The cost people forget

Even granting all that, you might say: so what? Leave it running, it costs nothing.

It doesn't cost nothing, and the cost is specific to what I'm doing.

To run the test I'd have to **fully build all three palettes** — apply each across the header, footer, buttons, cards, error pages, share images. That's three times the work of shipping one, and two thirds of it gets deleted.

Worse, while it runs, my brand is genuinely indeterminate. Every screenshot I take, every image that appears when someone shares a link, every deck I put in front of a museum — all of them have to hedge on which version that person happens to see. A partner clicks the link in my proposal and sees a different product than the one in the proposal.

The whole point of this rebrand is to look like a serious, coherent thing to institutions deciding whether to work with me. "We're currently three different products, depending" is the opposite of that.

So the test costs triple the build, produces an unusable answer, and undermines the exact audience the work is for.

## What I did instead

I picked one. Deliberately, with reasons I wrote down, from mockups I could actually look at side by side rather than imagine.

Then I did three things that keep the option open:

**Kept the architecture switchable.** The palette lives in one place as a set of named values. Adding another is adding a block, not rewriting screens. The cost of testing later is now small.

**Wrote down the conditions for revisiting**, with numbers, so it's a threshold rather than a vibe. Enough weekly landing-page traffic that a two-way split can resolve on one chosen metric in a few weeks. When that's true, the test becomes worth running. Until then it isn't.

**Specified the shape.** Two rounds of two, not one round of three. Round one: the two closest contenders. Round two: the winner against the one I held back. Each round needs half the traffic per version that a three-way split would, so each is twice as likely to conclude. Same information, obtainable at my actual scale.

## The bit I'd underline

There's a version of rigour that's really just deferral. "Let's test it" can mean *I want evidence*, and it can mean *I don't want to be the one who decided*. Those feel identical from the inside.

The test that can't reach significance is the worst of both. You paid for the process, you carry the cost of indecision, and at the end you still choose on taste — except now several months later, with the design work tripled.

Better: **decide, write down why, and write down what would change your mind.** That last part is what makes it a decision rather than a preference. Mine is written down with actual numbers, and when the traffic clears them I'll run the test properly.

## What is worth testing at low traffic

Not nothing. Just not this.

The rule is effect size. At small samples you can only detect large differences, so test things that produce large differences:

- **Headline copy.** "Every lesson starts by standing inside a real place" against something concrete and specific. Wording moves behaviour far more than palette does.
- **What the call to action says.** "Explore courses" versus "Step inside the museum." Naming the actual experience, versus naming a category.
- **Whether the hero shows a still image or moving 360° footage.** That's a different *experience*, not a different colour.

All of those are cheap to build, and all of them can produce differences big enough to see through the noise of a small audience.

The general shape: at low traffic, test things that might change behaviour a lot. Save the fine-tuning for when you have the crowd to measure it. Testing a subtle change with a small sample isn't rigour — it's a coin flip with extra steps and a spreadsheet.
