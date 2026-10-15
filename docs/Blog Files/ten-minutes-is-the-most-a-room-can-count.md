<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Ten Minutes Is the Most a Room Can Count
Slug:    ten-minutes-is-the-most-a-room-can-count
Excerpt: My real estate tours now show agents which rooms held buyers and
         where buyers left. Measuring time sounds easy until someone leaves
         a tab open all night. The four rules that keep that number honest,
         and the small print the report prints next to it.
Tags:    Buying Software, Plain Talk, Data, Honesty, RealEstate.WitUS
-->

# Ten Minutes Is the Most a Room Can Count

A seller wants to know if buyers are looking at their house. An agent wants to know something sharper: **which rooms** caught people, and where they lost interest.

My real estate tour app now answers that. The seller report lists every room by how long buyers spent in it, and shows where buyers were when they left the tour.

Before I built it, I had a rule written down: don't show a number you don't actually collect. I wrote about that in [Counts, Not Names](/blog/counts-not-names). This is what it took to collect this one honestly.

## Time is easy to measure badly

"How long was the kitchen on screen?" sounds like simple math. Start a clock when the buyer walks in, stop it when they walk out.

Then real life happens:

- Someone opens the kitchen, goes to make dinner, and leaves the tab open all night.
- Someone switches to their email for twenty minutes, then comes back.
- Someone closes the laptop mid-tour.

Count all of that, and the kitchen "held buyers" for eleven hours. That number would look amazing in a report. It would also be false.

## Four rules

**1. A stretch counts at most ten minutes.** Nobody studies one room for longer than that. Anything past it is a screen nobody is looking at.

**2. Time counts only while the tour is on screen.** Switch to another tab, and the clock stops.

**3. Switching away counts as leaving.** The app can't tell "I'll be right back" from "I'm done." So it counts both as leaving, and the report says so, in plain words, right under the list.

**4. Coming back is the same visit.** If a buyer returns to the tab, the time counts again, but not as a second visit. Otherwise every tab switch would make a room look twice as popular.

And one rule from before still holds: it's counts only. The report can say the kitchen held buyers longest. It can't say who.

## The small print is part of the number

The report doesn't just show the rooms. It shows, right below them: "Switching to another tab counts as leaving."

That line makes the number a little less impressive. It also makes it something an agent can stand behind when a seller asks, "How do you know?"

## The question to ask

When a vendor's report shows "time spent," ask:

> "What happens to that number if someone leaves the tab open overnight?"

If they don't know, the number is decoration.

## What this means when you hire

Two questions for anyone who builds reports:

- "How would you measure time on a page so it can't be inflated by accident?"
- "What would you print in small type next to that number, and why?"

A good answer to the first has a cap and a rule for switching away. A good answer to the second admits a limit out loud.

## Where this stands

Built and tested, waiting for its database update and its first real house.
