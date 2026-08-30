<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   An Invisible Arrow Is Not an Arrow
Slug:    an-invisible-arrow-is-not-an-arrow
Excerpt: I gave tour creators a slider for how visible the navigation arrows
         are. It stops at 25% and will not go lower, on purpose. Meanwhile a
         sibling setting lets a doorway be completely silent, which is fine.
         Here is how I decide which settings get a floor.
Tags:    Design, Product, Accessibility, Engineering Judgment, Wanderlust
-->

# An Invisible Arrow Is Not an Arrow

My app builds courses around real places captured in 360°. You stand in a room, look around, and floating arrows on the floor take you to the next room. Pins mark things worth a closer look.

Creators kept asking for control over how those arrows look. Reasonably! An arrow that's perfect over a dark stone floor can sit like a smear over a bright window. A gallery wants restraint. A museum trail for children wants the opposite.

So I built it: a slider for the visibility of navigation arrows, another for hotspot pins, set once for a whole tour and overridable on any single scene. Drag the slider and the arrows in the panorama behind the panel change as you drag.

The slider stops at 25%. It will not go lower. That's not a bug and it isn't a limitation of the tooling — I wrote the number, deliberately, and I want to explain why, because the same day I shipped a sibling feature that allows a value most people would call "off."

## What 0% actually means

Start with the honest description of what the slider controls. Opacity — how see-through something is. 100% is solid. 0% is fully transparent.

Fully transparent does not mean subtle. It means **gone**.

And here's the thing about an arrow in a 360° tour: it isn't decoration sitting on top of the experience. It *is* the experience. The arrow is the only visible evidence that a link exists between this room and the next one. There's no menu, no sitemap in the visitor's face, no hint from the photograph itself that the corridor on the left continues.

So an arrow at 0% doesn't produce a cleaner scene. It produces a room with no exits — a dead end. The link is still there in the data, perfectly intact, connecting two scenes that a visitor can now never travel between.

Worse, nothing warns anybody. The tour still validates. The scene graph still says every room connects. Every automated check I have would call that tour complete, because by every structural measure it is. The only thing that's wrong is that a human being standing in it cannot get out.

That's the specific quality that earned the floor: **the failure is invisible to the person who caused it.**

## The person who sets it is not the person harmed

This is the argument I keep coming back to, and it generalises well beyond sliders.

The creator setting the opacity built the tour. They know where the doors are. They've walked it forty times. When they drag the slider to 5% and squint, they can still see the arrow, because they know exactly where to look and their eye finds it instantly.

The visitor has none of that. They arrive somewhere unfamiliar, on a phone, possibly in sunlight, possibly with reduced contrast sensitivity — which is a very ordinary thing to have and becomes near-universal with age. At 5% they aren't seeing a tasteful hint. They're seeing a photograph of a room and concluding the tour ended.

A setting whose worst outcome lands entirely on someone who isn't in the room when it's chosen is a setting that deserves a floor. Not because creators are careless, but because the feedback loop that would normally teach them — *I set that too low, I can't use it* — has been cut. They'll never experience the consequence. They'll get an email months later saying the tour seems broken.

25% is not a magic number. It's the point where an arrow is still findable against a hostile background if you're looking for a way out. I'd defend the existence of a floor much harder than I'd defend that particular value.

## The floor is only fair because deletion exists

A restriction like this is defensible only under one condition, and it's worth stating plainly: **there has to be an honest way to get the outcome the restriction blocks.**

If a creator genuinely doesn't want visitors going from this room to that one, they can delete the link. That's a real action. It appears in the editor, it changes the scene graph, it's visible to every check I run, and anyone looking at the tour later can see that the connection isn't there.

What the floor prevents isn't "no link." It's **a link that exists in the data and not in the world** — a door that's on the floor plan and painted over on the wall. A phantom. The tour and the tour's own records disagree about what's possible, and the records win every audit.

So the setting is for styling, and deletion is for deletion, and I'd rather those two be different controls than let one quietly do the other's job.

## The sibling feature that has no floor

The same week I added per-link transition sounds. When you travel through a doorway, you can give that particular passage a sound — a footstep, a door, a room-tone swell.

You can also set it to silence. Deliberately. No floor, no warning, no nudge.

That feels inconsistent until you ask the same question of it: does the extreme value destroy the thing?

A silent doorway is still a doorway. The arrow is visible, the link is traversable, the visitor walks through and arrives. Silence is one legitimate aesthetic among several, and a tour where every transition thunks would be exhausting. Nothing about silence is a lie about what's there.

That's the whole test, and it's cleaner than "would anyone reasonably want this value":

**Does the extreme setting change how the thing presents, or does it remove the thing?**

Volume is a property *of* a door's sound. Opacity, past a point, is not a property of an arrow — it's the arrow's entire existence, from the only viewpoint that matters.

## The preview had to be live, for a reason I didn't anticipate

One last detail, because it changed the design.

My first instinct for the preview was a little swatch in the settings panel showing the arrow at the chosen opacity. Cheap, easy, and completely useless.

Opacity isn't a property of the arrow. It's a relationship between the arrow and whatever is behind it. 40% over a bright sky and 40% over a dark doorway are not the same 40% — one is nearly gone and one is nearly solid. A swatch on a neutral panel background shows you a number, not an outcome.

```tsx
<input
  type="range"
  min={MIN_OPACITY_PERCENT}   // 25 — the floor, enforced by the control itself
  max={100}
  step={5}
  value={value ?? 100}
  // Writes straight through to the viewer while dragging. The number and the
  // thing it affects are on screen together.
  onChange={(e) => onChange(Number(e.target.value))}
/>
```

So the arrows in the actual panorama update while you drag, against the actual photograph, and only the value you release on gets saved. Which means the creator's decision is made while looking at the thing the decision is about.

That, in the end, is the same principle as the floor. Both are about closing the gap between the person making a choice and the consequence of it. The floor closes it by force where it can't be closed by feedback. The live preview closes it properly, which is always better when it's available.

"Let the user decide" is a good default. It stops being good when the user can't see what they're deciding.
