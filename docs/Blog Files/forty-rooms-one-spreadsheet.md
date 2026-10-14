<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Forty Rooms, One Spreadsheet
Slug:    forty-rooms-one-spreadsheet
Excerpt: Connecting a big building's 360 tour by hand means clicking every
         doorway, one at a time. Now a spreadsheet does the boring part. The
         three promises that make an import safe: a preview first, plain
         errors with line numbers, and running it twice changes nothing.
Tags:    Buying Software, Plain Talk, Data Import, RealEstate.WitUS
-->

# Forty Rooms, One Spreadsheet

A 360 tour is a set of rooms with doorways between them. Click the arrow in the hall, and you walk into the kitchen.

For a house, that is a few rooms. For an office building or a school, it can be dozens. Connecting them by hand means: pick a room, pick the next one, click "connect." Again. And again. For every doorway in the building.

That is slow, and slow work is where mistakes hide.

## What it does now

The agent fills in a spreadsheet, one row per room:

- the room's name,
- the photo's file name,
- which floor it is on,
- which rooms it leads to,
- and "yes" on the room the tour starts in.

Then they pick the spreadsheet and the photos, and the app builds the tour.

## Three promises

An import is only as good as what happens when something is wrong. So the import makes three promises.

**1. Nothing happens until you see a preview.** Before anything is saved, the screen says what will happen: "Rooms to add: 2. Rooms already in the tour: 1. Pairs of rooms to connect: 2. The tour opens in: Lobby."

**2. Every problem has a line number and plain words.** Not "invalid input." Instead:

> Line 3: links_to names "Ofice", and there's no room by that name. Did you mean "Office"?

You know where to look and what to fix.

**3. Running the same file twice changes nothing the second time.** People run imports twice. The upload stalls, so they click again. Or they fix one row and run the whole file again. A tool that doubles every room when you do that punishes a normal human move. This one matches rooms by name and skips doorways that already exist.

## Half a tour is worse than none

If even one photo fails to upload, nothing is saved. The screen says so, and the button to try again stays right there. Photos that made it will not upload twice.

Why so strict? Because half a tour looks finished. A buyer would find the missing room, not the agent.

## What the spreadsheet does not do

Every doorway comes in "not placed." A person still opens each room and clicks where the doorway really is.

The spreadsheet does the boring part. A person does the part that needs eyes.

## The question to ask

When a vendor shows you an import feature, ask two things:

> "What happens if I import the same file twice?"

> "Show me the error when my file has a typo."

Most demos use a perfect file. Your files will not be perfect.

## What this means when you hire

Two questions for anyone who builds imports:

- "How do you make an import safe to run twice?"
- "If an import fails halfway, what does the customer see?"

A good answer has a plan for the second run and the half-failure. A weak answer is "that shouldn't happen."

## Where this stands

The import is built and tested, including the typo, the second run, and the failed upload. It is waiting for me to review it before it goes live.
