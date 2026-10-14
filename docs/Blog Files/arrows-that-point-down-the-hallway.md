<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Arrows That Point Down the Hallway
Slug:    arrows-that-point-down-the-hallway
Excerpt: The arrows in my 360 tours always pointed straight ahead, so in an
         angled hallway they pointed at a wall. Creators can now turn each one
         in 15° steps. Here is how it works, why the turn had to go inside the
         arrow, and what a screen reader hears.
Tags:    360 Photos, Accessibility, Creator Tools, Wanderlust
-->

# Arrows That Point Down the Hallway

A Wanderlust tour is a set of 360° photos of a real place. Each photo is called a scene. You look around one room, and arrows show you the way to the next. Click an arrow and you move.

The creator places each arrow by clicking where the doorway is in the photo. So the arrow sits in the right spot. But it always pointed the same way: straight up the screen, which reads as "straight ahead."

That works for a door in front of you. It fails in an angled hallway. Picture a corridor that bends off to the left. The arrow sits at the mouth of the corridor and points straight ahead, right at the wall. A visitor sees an arrow aimed at plaster and wonders whether it goes anywhere.

## What creators can do now

In the scene editor, every placed arrow in the **Scene links** list has a small row of controls:

- **Turn left** turns the arrow 15° counterclockwise.
- **Turn right** turns it 15° clockwise.
- **Reset** puts it back. It appears once the arrow has been turned.

Next to the buttons is a small preview of the tour's own arrow. If the creator uploaded a custom arrow image, the preview shows that image. If not, it shows the default arrow in the tour's color. The preview turns the moment you press a button.

A line of text says where the arrow stands: "Turned 45°," for example, or "Pointing up (not turned)." Each press saves right away. If a save fails, the preview snaps back, so it never shows a turn that did not stick.

Fifteen degrees is a small step. Three presses make 45°. That gives 24 directions in all, and turning left from the start wraps round to 345°.

Visitors see the turned arrow on the public tour, custom image or not. Before calling it done, I turned an arrow 45° and checked it in the editor and in the tour itself.

## What the arrow says did not change

An arrow in Wanderlust is a real button. A screen reader, the software that reads a page aloud for people who are blind or have low vision, announces it by name: "Go to" and then the next scene's name.

Turning the arrow changes how it looks. It does not change that name. A person listening to the page gets the same thing as before: where the arrow goes. Which way it points on screen is a hint for people who can see it. The name and the role of a control are what assistive technology needs (World Wide Web Consortium [W3C], n.d.-a).

The turn buttons in the editor have fuller names for screen readers, like "Turn right 15°: arrow to" and then the scene's name. So a creator who uses a screen reader knows which arrow each button turns. The "Turned 45°" line is read out when it changes, without pulling the cursor away from the button. The accessibility standard calls that a status message (W3C, n.d.-b).

## The arrow that would not stay turned

Here is the one technical wrinkle, in plain terms.

Wanderlust uses an open-source viewer library, Photo Sphere Viewer, to show the 360° photos. A library is code someone else wrote that my app builds on. Its tour plugin draws the arrows and lets each link carry extra data of my own (Photo Sphere Viewer, n.d.). That is how the turn travels from the editor to the arrow.

The library keeps each arrow in the right spot as you look around. To do that, it rewrites the arrow's position on every frame, many times a second. A turn is part of that same setting. So if I turn the arrow itself, the library wipes the turn out on the very next frame.

The answer was to turn the drawing inside the arrow instead. Think of a street sign on a pole. The city can move the pole wherever it likes. I turn the sign. The library owns the outer button. I own the picture inside it.

The fix is small once you know this. Knowing it is the work. You learn it by reading what the library does on every frame, not from its feature list.

## The lesson

Every product is part yours and part borrowed. Your builder uses libraries for the hard parts, like drawing a 360° photo. That is a good thing. But each library has parts it controls, and it will undo your changes there without telling you.

So when a builder says "that's easy, we just rotate it," the follow-up question is: rotate what, and what else touches it?

## The question to ask

When you see a demo of a virtual tour product, bring your hardest room. Ask:

> "Can I point an arrow down an angled hallway? Show me in my own photo."

And if your tour has to work for every visitor, as it should for a museum or any public venue, ask:

> "When I change how an arrow looks, what does a screen reader hear?"

The right answer is: the same thing as before. The look can change. The name should not.

## References

Photo Sphere Viewer. (n.d.). *VirtualTourPlugin*. https://photo-sphere-viewer.js.org/plugins/virtual-tour.html

World Wide Web Consortium. (n.d.-a). *Understanding success criterion 4.1.2: Name, role, value*. https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html

World Wide Web Consortium. (n.d.-b). *Understanding success criterion 4.1.3: Status messages*. https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html
