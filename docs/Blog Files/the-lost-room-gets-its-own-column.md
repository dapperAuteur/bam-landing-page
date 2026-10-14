<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Lost Room Gets Its Own Column
Slug:    the-lost-room-gets-its-own-column
Excerpt: A 360 tour of a big building can have forty rooms and a hundred
         doorways. I built a map of the rooms to check one at a glance, and
         made one design choice on purpose: the room nobody can reach stands
         apart, where you can't miss it. Plus the question that shows how a
         vendor's editor treats a broken tour.
Tags:    Buying Software, Plain Talk, Design, Accessibility, RealEstate.WitUS
-->

# The Lost Room Gets Its Own Column

A 360 tour is a set of rooms with doorways between them. Tap the arrow in the hall, and you walk into the kitchen.

A house has a handful of rooms. An office building can have forty, with a hundred doorways. When I made it possible to build a big tour from a spreadsheet, a new problem showed up. The tour gets built in seconds. But how do you **check** it?

Reading a list of a hundred doorways does not tell you much. You need to see the shape of the place.

## A map of the rooms

So the tour editor now has a room map. Every room is a card with a small photo. Every pair of rooms with a doorway between them is a line.

The map is laid out by steps from the front door. The room the tour starts in is on the left. Rooms one doorway away are in the next column. Rooms two doorways away are in the column after that.

The lines tell you more than "connected":

- **A solid line** means you can walk both ways.
- **A dashed line with an arrowhead** means you can only walk one way. Sometimes that is right. Usually it is a mistake.
- **An orange line** means the doorway exists, but nobody has placed its arrow yet. Buyers can't see it, so to them, it isn't there.

## The design choice I care about most

Some rooms can't be reached at all. Nothing leads to them from the front door. Maybe a doorway was never added, or a name in the spreadsheet had a typo.

A tidy layout would tuck those rooms in somewhere, near the rooms they look like they belong with. I did the opposite. Rooms nobody can reach get **a column of their own, at the far end**, with an orange border.

That is on purpose. The job of the map is to find problems. So the problem should be the easiest thing on the map to see, not the easiest thing to miss.

The map also never reshuffles. The same tour gives the same map, every visit. If the cards moved around each time, you would spend your attention finding things again instead of noticing what is wrong.

## Click, then click

To connect two rooms, you click one room, then click the other. That's it: they are connected both ways. To remove a doorway, you click a room and press the remove button next to the room it leads to.

There is no dragging. Dragging is hard for a lot of people, and the accessibility rules say anything you can do by dragging must also work with a simple click. I explained that rule, and who it helps, in [Up and Down Instead of Drag](/blog/up-and-down-instead-of-drag).

Every card is also a button. A keyboard user can tab to a room, press Enter, tab to another, and press Enter again. Each card's label says the room's name, how many doorways it has, and any problem it has, like "Nothing leads here."

On a phone, the map would be too small to use. So on small screens it steps aside, and the plain list of connections does the same job.

## The question to ask

When a vendor shows you their tour editor, they will show you a finished, perfect tour. Ask for the opposite:

> "Show me what a broken tour looks like in your editor."

Ask them to delete a doorway and show you how the editor tells you. If you have to go looking for the problem, so will your team, every time.

## What this means when you hire

Two questions for anyone who builds tools like this:

- "When your tool finds a problem, where on the screen does it show up?"
- "How would someone do this with only a keyboard?"

A good answer to the first puts the problem where the eye lands first. A good answer to the second is a short list of keys, not "we'll add that later."

## Where this stands

The room map is built and tested, with real doorways from a test tour. It is waiting for its first real building.
