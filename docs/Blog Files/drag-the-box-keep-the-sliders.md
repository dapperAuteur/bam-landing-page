<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Drag the Box, Keep the Sliders
Slug:    drag-the-box-keep-the-sliders
Excerpt: Fitting a privacy box over a person in my 360 photo editor took a click
         and two sliders. Now you can drag it into place. Here is what I built,
         why the sliders stayed, and the question to ask any vendor who shows
         you a slick drag and drop demo.
Tags:    Accessibility, 360 Photos, Privacy, Buying Software, Wanderlust
-->

# Drag the Box, Keep the Sliders

Wanderlust has a page called **Hide people and gear**. You use it to blur or pixelate a stranger who walked into your 360° photo. I wrote about why I built it in [I Was in Every 360 Photo I Took](/blog/i-was-in-every-360-photo-i-took).

The first version worked. It was also fiddly.

## Click, then slide, then slide again

You clicked a person, and a box landed on them. Then you made it fit.

Each box had a **Width** slider and a **Height** slider. They are in degrees. A 360° photo wraps all the way around you, so it is measured like a circle: 360 degrees across.

So covering one person went like this. Click. Drag the Width slider. Look. Drag the Height slider. Look again. If the box sat a little off, select **Move by clicking** and click again.

I used it myself and wrote a note: dragging the box would be easier than the way boxes were made and edited.

## Five handles

Now the box you are working on gets five handles, right in the viewer.

- The round yellow one in the middle moves the box.
- The four white squares on the corners resize it. The opposite corner stays put. Pull the bottom right corner, and the top left corner does not move.

That second rule matters more than it sounds. If a box grew from its middle, you would have to move it again after every resize. With the far corner fixed, one pull fits one side.

There was a catch. In a 360° viewer, dragging normally turns the room. Grabbing a handle has to grab the box instead. It does now: a corner drag grows the box, and the view stays still.

A new box is selected as soon as you add it. Click any box in the viewer to bring its handles back. Nothing changed in how boxes are saved, so older boxes still work.

## Built for a finger

Each handle is a 44 pixel touch target. A touch target is the area your finger has to hit.

That is the size WCAG asks for. WCAG is the Web Content Accessibility Guidelines. It is a set of rules for making websites work for disabled people. Its rules come in three levels: A, AA and AAA, from the basics to the strictest. Rule 2.5.5, Target Size, is a AAA rule. It asks for targets of "at least 44 by 44 CSS pixels" (World Wide Web Consortium [W3C], n.d.-b). The reason is plain: "If the target is too small, it may be difficult to aim at the target" (W3C, n.d.-b).

I tested it on a phone sized screen, 375 pixels wide, with touch. A finger drag on a corner resized the box. It did not turn the view, and the page did not scroll sideways.

## Dragging cannot be the only way

This is the part I care about most. Some people cannot drag. Some use only a keyboard. Some use a screen reader, software that reads the screen aloud, and cannot see the box at all.

WCAG rule 2.1.1, Keyboard, is a Level A rule. It says "All functionality of the content is operable through a keyboard interface" (W3C, n.d.-a). WCAG 2.2 has a rule about dragging itself. Rule 2.5.7 asks that anything done by dragging can also be done with a single pointer, such as one click or tap, without dragging (W3C, n.d.-c). Its explanation is honest: "Some people cannot perform dragging movements in a precise manner" (W3C, n.d.-c).

So each handle is also a button. Press Tab to reach it, then use the arrow keys. One press moves it 1°. Hold Shift, and each press moves it 5°. Focus stays on the handle, so you can keep pressing.

A keyboard user may not see the box change. So the line under the viewer says what happened, for example: "Box 1 is now 29° wide and 52° tall."

The old controls stayed too. The Width and Height sliders, **Move by clicking**, and **Move to the center of the view** are all still there. Dragging is the quick way now. It is not the only way.

## One known limit

If a handle ends up under the toolbar at the bottom of the viewer, it is hard to grab. Turn the view up a little and it comes clear. I would rather tell you than have you find it.

## The question to ask

Drag and drop looks great in a demo. So when a vendor shows it to you, ask:

> "Can I do the same thing without dragging? Show me with the keyboard only."

Then watch. A good answer: they press Tab, they press the arrow keys, and something on screen says what changed. A weak answer is "drag and drop is more intuitive." Intuitive for whom?

When you hire a builder, ask: "When you add a drag feature, what do you keep for people who cannot drag?" A strong builder names the keyboard route, and how a screen reader hears the change.

## References

World Wide Web Consortium. (n.d.-a). *Understanding Success Criterion 2.1.1: Keyboard*. https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html

World Wide Web Consortium. (n.d.-b). *Understanding Success Criterion 2.5.5: Target Size*. https://www.w3.org/WAI/WCAG21/Understanding/target-size.html

World Wide Web Consortium. (n.d.-c). *Understanding Success Criterion 2.5.7: Dragging Movements*. https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
