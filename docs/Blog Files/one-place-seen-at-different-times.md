<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   One Place, Seen at Different Times
Slug:    one-place-seen-at-different-times
Excerpt: Places change, and a 360 tour only shows one day. I built moments
         into Wanderlust so visitors can switch time without moving and keep
         that time as they walk. Here is how it works, the plan I changed on
         the way, and the question to ask before you pay for a tour.
Tags:    360 Photos, Virtual Tours, Museums, Buying Software, Wanderlust
-->

# One Place, Seen at Different Times

A 360° photo is a picture that covers every direction at once. A visitor can look all the way around, up and down. A virtual tour links several of those photos, so the visitor can walk from room to room.

But a 360° photo shows one place on one day. Places change. A building gets restored. A street changes over decades. A festival runs from setup to its last night.

So I asked a question about my own app, Wanderlust. How could a tour show the past and the future of one location? Or the start and finish of an event, in the same spot?

## Two ideas I turned down

The first idea was the obvious one. Make a separate scene for each time, and join them with "earlier" and "later" arrows. But every hotspot and every arrow would have to be built again for every time.

A hotspot is a point in the photo that a visitor can open for a note, a picture or a sound. Rebuild all of those five times, and you stop making tours.

The second idea was a swipe, with the old photo on one side and the new one on the other. That means two 360° viewers running at once. It is heavy on phones and heavy on offline downloads. I kept it as a later add-on, inside one viewer.

## What I built: moments

I picked a third model. A tour now has a timeline, and each point on that timeline is a **moment**. "1998." "Opening day." "Setup." "Finish."

**The timeline belongs to the tour, not to one room.** So "1998" means the same thing everywhere in the tour. That shared meaning is what lets the time stay put while you walk.

**Labels are free text.** You can add a date, but it is only used for sorting. You can also order moments by hand with Earlier and Later.

**The base view is called Now.** When you add your first moment, a base view appears with it. It is each scene's own photo, the one the tour already had. "Now" is only the default name. You can rename it, for example to "After the restoration." A tour with no moments looks exactly as it did before.

**Each scene can hold a different photo for each moment.** On a scene's edit page, you choose a 360° photo of the same spot for each moment. If you have no photo for a moment, you leave it empty.

## What a visitor sees

A **Time** control sits in the top-left corner of the tour. On a phone, it turns into a dropdown.

Pick "1998" and the room changes around you. You do not move. You keep facing the same way.

Now walk through an arrow into the next room. You are still in 1998. If that room has no 1998 photo, you see its normal photo and a short notice: "No 1998 photo here: showing Now." Walk back, and you are in 1998 again.

**Hotspots are placed once.** Each one shows in every moment by default. A setting called **Show in** limits a hotspot to one moment. Think of a sign that is gone today, or a display case that was only there in 1998.

## Lining up a photo taken again

A photo taken again, years later, rarely faces the exact same way as the first. If the 1998 photo is turned a little, every hotspot placed on today's photo lands a little off.

So each moment photo can be turned. Under **Line it up**, there are four buttons: minus 10, minus 1, plus 1 and plus 10 degrees. You press them until a doorway or a corner sits where it does in the base view. Each press saves.

The viewer I build on, Photo Sphere Viewer, has a setting for this. Its documentation says it "allows to fix the panorama orientation" (Photo Sphere Viewer, n.d.-a). Once a photo is lined up, the arrows and hotspots land in the right place in every moment.

## The plan I changed on the way

My first plan made each moment its own panorama inside the viewer. On paper it was tidy.

Then I checked what else in the app depends on one idea: one panorama equals one scene. I found about a dozen things. Sound. The strip of stops. Share links. Analytics, which are the counts of what visitors do. Scavenger hunts. My tidy plan would have broken all of them.

So I changed it. Switching time now swaps each scene's photo in place. The viewer can update a single scene, and if that scene is the one on screen, the view updates with it (Photo Sphere Viewer, n.d.-b). Everything that counted on "one panorama equals one scene" keeps working.

Here is the lesson. A plan can look clean and still break things it never mentions. Before you approve a change, ask your builder: "What else in the system assumes the thing you are changing?"

## Built to travel

I also run a separate product, RealEstate.WitUS, for real-estate virtual tours. Before-and-after tours fit there naturally. So I kept the rules for moments in one folder that does not depend on the rest of Wanderlust's code or its database. Moving them should mean copying that folder and connecting it to the other product's data. The plan for that move is now written.

## What it does not do yet

- A share link cannot open a tour at a chosen moment. It opens at the base view.
- The swipe compare is still a later add-on.
- Moments work on 360° photo scenes. A 360° video scene always shows its video.

Offline is a choice for each tour. A switch called "Include every moment in offline downloads" decides whether a saved course takes every moment along. Leaving it off keeps the download small. It was hidden at first, because saving for offline turned out to be broken. I wrote about that bug in [Saved for Offline, Never Served](/blog/saved-for-offline-never-served).

## The question to ask

If you hire someone to build a tour of a place that changes, ask:

> "When I add a newer photo of the same room, what do I have to redo?"

A good answer is "nothing, except line it up." Your arrows, notes and sounds should carry over. If the answer is "rebuild the hotspots," you will pay for that work again with every new photo.

The step-by-step help is at https://wanderlust.witus.online/en/help/show-a-place-over-time.

## References

Photo Sphere Viewer. (n.d.-a). *Configuration*. https://photo-sphere-viewer.js.org/guide/config.html

Photo Sphere Viewer. (n.d.-b). *VirtualTourPlugin*. https://photo-sphere-viewer.js.org/plugins/virtual-tour.html
