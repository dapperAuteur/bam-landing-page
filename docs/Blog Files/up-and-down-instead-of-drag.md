<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Up and Down Instead of Drag
Slug:    up-and-down-instead-of-drag
Excerpt: I wanted to choose the order of the tours page in Wanderlust. I built
         it with Up and Down buttons and no dragging. Here is why buttons
         beat drag and drop alone, and what to ask a vendor who demos a list
         you can only rearrange with a mouse.
Tags:    Accessibility, Admin Tools, Buying Software, Wanderlust
-->

# Up and Down Instead of Drag

The public tours page on Wanderlust always showed tours one way: newest first. I wanted to choose. A to Z, Z to A, newest, oldest, or an order I set by hand.

## What I built

When I sign in as an admin, I see a folded panel above the tour cards: **Arrange tours (admin only)**. Visitors never see it. They just see the order I pick.

The panel has one menu, **Order tours by**, with five choices: Name A to Z, Name Z to A, Newest first, Oldest first, and Custom order. It saves the moment I pick. The cards below re-order right away, so the page itself is the preview. Until I pick, it stays newest first.

Name order ignores capital letters. It also counts numbers the way people do, so "Part 2" comes before "Part 10".

**Custom order** puts an **Up** and a **Down** button on every tour. Each press swaps a tour with its neighbor and saves. The first time I switch to Custom, it starts from the order I was looking at. So if A to Z is almost right, I only move the one or two tours that are wrong. A tour published later goes after the ones I placed, newest first, until I move it.

## Why buttons, and no dragging

The usual way to rearrange a list on a website is drag and drop. You press an item, hold, and slide it.

Dragging is hard for many people. The Web Content Accessibility Guidelines (WCAG) are the shared rules for making websites usable by people with disabilities. Version 2.2 added a rule called Dragging Movements, numbered 2.5.7, at Level AA (World Wide Web Consortium [W3C], 2024). It says anything you can do by dragging must also work "by a single pointer without dragging." The exceptions are when dragging is essential, or when the browser itself handles the drag and the site does not change it (W3C, 2026).

A pointer is a mouse, a finger or a stylus. "Without dragging" means a tap or a click does the job. The W3C's own explanation names who this helps: people who cannot drag precisely, and people using trackballs, head pointers, eye-gaze systems or speech that controls the mouse. Its example is close to mine: a list with controls next to each item for moving it up or down (W3C, 2026).

That rule is about pointers. Keyboards have their own rule, 2.1.1, which asks that every function work "through a keyboard interface" (W3C, 2024). Up and Down are plain buttons, so they work with the Tab and Enter keys too.

Small details help too:

- Each button names its tour for screen readers, the tools that read a page aloud. Up says "Up: move" plus the tour's name, then "earlier."
- After each move, a short message appears: "Saved. Visitors see this order now." Screen readers read it out.
- The top tour's Up is turned off, and so is the bottom tour's Down.
- Each button is at least 44 by 44 pixels, so it is easy to hit on a phone.

My own launch bar is WCAG 2.1 AA. The dragging rule comes from 2.2. I followed it anyway.

## The trade-off

Buttons are slower over long distances. Moving a tour from the bottom of a long list to the top takes one press per step, and every press saves. Starting Custom from the order already on screen keeps most changes short.

A browser test checked all four sorts, Custom starting from the shown order, Up and Down, the turned-off first Up, and that visitors see the same order with no panel. An automated accessibility checker found no problems.

## The question to ask

When a vendor shows you drag and drop, ask:

> "How do I do that without dragging?"

Then try it with only your keyboard. If there is no other way, someone on your team or in your audience is locked out of that feature.

## References

World Wide Web Consortium. (2024, December 12). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

World Wide Web Consortium. (2026, August 10). *Understanding success criterion 2.5.7: Dragging movements*. https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
