<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Two Map Engines, One Road Trip, and a Five-Hour Disagreement
Slug:    two-map-engines-one-road-trip
Excerpt: I asked my agent to double-check the miles and drive times on a long
         road trip. It routed every leg through two free engines. My times
         matched the faster one, the slower one added more than five hours,
         two short legs were listed low, and the agent's own "faster" plan had
         a 608-mile day in it. Then the app I will carry turned out to have a
         checkbox nobody could tick.
Tags:    Verification, Maps, Planning, Privacy, Offline, WitUS
-->

# Two Map Engines, One Road Trip, and a Five-Hour Disagreement

I am driving from Indianapolis to Kansas City to Phoenix and back, to photograph places my courses already teach. I planned it myself, in a set of route files with a table of legs, miles and drive times. Before trusting that table, I asked my agent for one thing: double-check the miles and the drive time.

This post is about how it checked, what it found, and the app work the trip forced.

## Two engines, not one

A single routing answer is a number with no error bar. So the check used two.

First, every stop became a map pin through OpenStreetMap's Nominatim geocoder. One stop has no house number in OpenStreetMap, so the US Census Bureau's geocoder placed it instead. Two pins are approximate, and the guide says which.

Then every leg was routed twice, by two independent engines that both run on OpenStreetMap data: OSRM and Valhalla, each on a free public server run by FOSSGIS (FOSSGIS, n.d.-a, n.d.-b). The OSRM server's usage policy asks for at most one request per second and no heavy use (FOSSGIS, n.d.-a). That is fine for checking a few dozen legs, and a good reason not to build a product on it.

The two engines agreed on distance within about 1 percent. They did not agree on time. Valhalla was the faster estimate and OSRM the slower one. So the guide gives every drive time as a range, Valhalla to OSRM, and says plainly that both are free-flow: no traffic, no fuel, no food, no stopping to film.

One practical snag. Valhalla's public server refused any single request over 1,500 kilometers, so the 1,700-mile drive home had to be split into pieces. OSRM routed that same drive both whole and split, and the two answers landed within 5 miles of each other. Splitting did not change the result.

## What the check found in my table

My table held up. It listed 25 legs, about 2,005 miles and 31 hours 45 minutes of driving. The check said 2,013 to 2,028 miles, and 31 hours 35 minutes (Valhalla) to 36 hours 42 minutes (OSRM).

So my distances were fine, and my times matched the faster engine almost exactly. The slower engine adds more than five hours across the same legs. If I want slack, the guide tells me to plan with the slower one.

A few legs were off by more than a little:

- **Two short legs were listed low.** One I had at 75 miles measured 81. Another I had at 25 measured 30.
- **Two long legs were optimistic.** One I had at 3 hours 50 minutes came out at 4 hours to 4 hours 35 minutes. Another I had at 4 hours 45 minutes came out at 4 hours 52 minutes to 5 hours 38 minutes.

Everything else was within a few miles and minutes, and the day totals in my schedule added up correctly from the route table. That last check matters more than it sounds. A schedule copied by hand from a route table is exactly where a total goes stale.

## The draft that failed its own check

I had also asked for faster versions of the trip. The agent's first "faster" draft contained a single 608-mile driving day. The same routing check caught it, and the days were rebalanced before I saw a final version.

This is the part worth dwelling on, because it is the failure nobody thinks to look for. The improvement is where the new error hid. A check that only ran on my original plan would have waved the new one through.

## Three versions

The trip now exists in three versions, every leg on the same two-engine check:

| | A, as proposed | B, faster split | C, southern return |
|---|---|---|---|
| Reach Phoenix | day 13 | day 6 | day 6 |
| Miles on the driving line | 3,948 | 3,621 | 3,714 |
| At the wheel | 61 h 43 min to 71 h 37 min | 57 h 10 min to 67 h 12 min | 58 h 03 min to 67 h 56 min |

Version A is my plan plus something none of my route files had: the drive home, about 1,700 miles. My files planned the way out in detail and the drive home not at all.

"Faster" does not mean fewer miles. The totals barely change, because you still cover the same ground once each way. What changes is the order. The priorities come first, Phoenix arrives a week earlier, and no day is spent driving home past places I could have shot on the way out.

The long form became a field guide: the comparison, the checks, and every stop with the lesson it serves, what to capture, and which permission to get first. A small script rebuilds the guide and the app's import files from the raw check results, so a re-check updates everything at once.

## The checkbox nobody could tick

The app side started with a plain request: build pages I can read and check off on the road, using the Field Log, the part of Learn.WitUS that plans documentary work.

The Field Log already modeled a trip. A project has legs, a leg is a stop, and a leg has carried a visited flag since the migration that created the Field Log, in July. There was no way to set it. No button, no route, nothing. A column existed and nobody could write to it.

Now each leg has:

- a **Visited** checkbox that updates at once, and with no signal, queues the tick on the phone and replays it when the connection comes back, the same way photo and video captures already worked;
- the leg's **notes**, shown as plain text with working links to the lessons the stop serves, never rendered as markdown or HTML;
- a **Directions** link when the leg has coordinates;
- a count of how many stops are visited, with a jump to the next one.

The server side is one small route that updates one leg. It answers "not found" for a leg outside that project, or a project you cannot reach, the same rule every other Field Log route follows. There is also a new site-tour checklist: plan, consent, capture, verify, publish.

The search for which courses the trip could serve turned up one more thing: five courses about Indianapolis already had empty tour lessons whose briefs read like shot lists.

## The import that refuses public files

Typing forty stops into a form is forty trips through the form, and the notes a stop needs do not fit it anyway. So a route loads from a file with an import command: one project per file, one leg per stop.

The import refuses to read any file that git tracks. The reason is in the script's header:

> An itinerary says where a person will be and roughly when, and this repository is public.

So the route files live in a folder git ignores, and the importer checks before it reads. The same guard already protected my private course content. Re-running the import is safe: legs match by name and keep their visited tick, and a stop missing from the file is reported, never deleted, because photos and videos may already point at it.

That is also why this post names no dates, no places to sleep, and no list of stops.

## Three things worth stealing

**Check with two independent sources and report the range.** One engine gives you a number. Two give you an error bar, and mine was more than five hours wide.

**Run the check on the improvement, not just the original.** The 608-mile day was in the "faster" draft, not in mine. A new plan needs the same test as the old one.

**Make the privacy rule a refusal, not a reminder.** A note saying "do not commit your itinerary" is advice. An importer that will not read a tracked file is a fact.

## References

FOSSGIS. (n.d.-a). *About* [OSRM routing service]. Retrieved October 14, 2026, from https://routing.openstreetmap.de/about.html

FOSSGIS. (n.d.-b). *Valhalla FOSSGIS server demo app*. Retrieved October 14, 2026, from https://valhalla.openstreetmap.de/
