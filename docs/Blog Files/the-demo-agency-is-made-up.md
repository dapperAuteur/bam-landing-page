<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Demo Agency Is Made Up. The House Is Real.
Slug:    the-demo-agency-is-made-up
Excerpt: My real estate app has a demo anyone can sign into. An empty demo
         sells nothing, and a fake house would be a lie. So the demo copies
         one of my real listings every night, under three rules about what a
         public demo must never show or touch.
Tags:    Buying Software, Plain Talk, Privacy, Demos, RealEstate.WitUS
-->

# The Demo Agency Is Made Up. The House Is Real.

My real estate tour app has a demo. It's a pretend real estate agency, with a made-up name, that anyone can sign into. A buyer's agent can click around the admin, open the tour editor, and see how it all works. Every night at midnight, the demo resets, so whatever visitors changed is gone by morning.

So far, the demo agency has no listings. An empty demo is a tour of a building with no rooms. It sells nothing.

## Why not a fake house?

The quick fix would be a made-up listing with stock photos. But a rule runs through everything I build: nothing made up reaches a buyer. A demo that shows a pretend house teaches the wrong lesson about the product.

So the demo will copy one of **my real listings**: a real house, shown with the owner's permission to show it there, copied in fresh every night.

Putting a real house inside a public demo raised three questions. Each became a rule.

## Rule 1: the street address stays hidden

The demo agency is made up. A made-up agency shouldn't advertise a real family's front door. So the copy shows the neighborhood and the city, never the street.

## Rule 2: only the photos buyers already see

My app can hide people in a photo: blur a face, cover a family picture, patch over the tripod. When it does, the original photo is kept, out of the public's reach, so the agent can change the edit later.

Here's the catch. Anyone can sign into the demo **as its owner**. And the owner's privacy editor shows the original, because that's where you draw the boxes.

So the copy takes each room's photo exactly as buyers see it, already blurred, and never the original behind it. In the demo, there's nothing clear to find.

## Rule 3: nothing done in the demo can touch the real listing

The copy doesn't duplicate the photo files. It borrows them, the same files my real listing uses. That keeps it cheap and fast.

But demo visitors can do anything an agent can: blur things, replace photos, delete rooms. So the app knows the demo is borrowing, and from inside the demo it will never move or delete a file that the real listing also uses. A visitor can wreck the demo copy. The real house doesn't notice, and at midnight the copy comes back clean.

## The question to ask

When a vendor offers you a demo, ask:

> "What can anyone who signs into your demo see that a buyer of the real thing can't?"

Most demos are built for selling, not for privacy. A good vendor has thought about this before you asked.

## What this means when you hire

Two questions for anyone who builds demos:

- "If we put real data in a public demo, what would you leave out?"
- "How do you make sure nothing done in the demo can break the real thing?"

A good answer to the first names specific things, like addresses and originals. A good answer to the second explains how, not just "we'd be careful."

## Where this stands

Built and tested. The demo fills itself as soon as the first real house is live. I wrote about how the privacy edits work in [A Blur You Can Peel Off Is Not a Blur](/blog/a-blur-you-can-peel-off).
