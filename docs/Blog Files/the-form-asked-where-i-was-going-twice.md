<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Form Asked Where I Was Going Twice
Slug:    the-form-asked-where-i-was-going-twice
Excerpt: My calendar trip form asks for the destination twice, and it can't
         say "there and back." I am planning a fix. Here is why small repeats
         in a form cost more than they look.
Tags:    Buying Software, Design, Privacy, Plain Talk, CentenarianOS
-->

# The Form Asked Where I Was Going Twice

My app, CentenarianOS, reads my Google Calendar. A short tag in an event title, like #trip, tells it what kind of event it is. A form in the app, the event builder, writes these titles for me.

This post is about changes I plan for that form. None of it is built yet.

## What the trip form does today

For a trip, the form asks where I'm going, how far, and how I'm getting there.

It also asks for the trip time, location, date, start time, and event length.

Then it writes a title like this: "To the trailhead #trip 7.8mi mode:bike 45min"

Two things are missing. I can't say the trip is there and back, or where I'm starting from.

Both matter. RideWitUS is another one of my apps. Its written plan has it suggest trips to and from my events. For that, it needs to know where I start and whether I come back. Right now, it would have to guess.

The RideWitUS side that reads these events is also only planned.

## The plan for round trips

I plan to add a short tag, #rt, for "round trip." In Spanish it would be #idayvuelta.

My leaning is that the distance and time I type mean one way. My app's travel section already works like that. It saves one way and doubles it for totals. This is still an open question, though.

The form would show both numbers, like "7.8 mi each way (15.6 mi there and back)." The app would save the number as typed, so nothing gets counted twice.

## The plan for a starting place

I also plan to add a one-word starting place, like from:home or from:gym.

Only that one word would ever leave my app. My home address would never be read or sent for this. In the RideWitUS plan, it keeps its own saved places. It would match "home" to one of them.

A street address has spaces, so the one-word rule keeps it out of the tag.

## Why small repeats in a form matter

While planning this, I checked the form box by box. I found seven places where it repeats itself. I also found one sentence that isn't true.

Four of the repeats:

- It asks for the destination twice: once for the title, once for the location.
- It has two boxes for length: one for the title and one for the event.
- I can pick how I travel from a menu or with a word in the title. If they disagree, the menu quietly wins.
- An amber (yellow-orange) box explains what happens when an event copies over. Other parts of the app already say that. Amber is saved for things that need attention, and this is plain information.

Each one looks small. But every box that asks twice is a chance for two answers to disagree.

The destination repeat has a real cost. A trip with no location never reaches RideWitUS. The location box is marked optional. If I fill in "Where to" and skip "Location," the trip quietly stays behind.

Then there is the sentence that isn't true. The form says a trip "will go to RideWitUS," with no conditions. It only goes when the calendar is shared and the event has a location.

## What I plan to change

- One length box, with a checkbox to also write the time in the title.
- One destination box that fills in the location for me.
- An amber warning when a trip has no destination, since it won't be sent.
- A travel menu that shows what it found in the title, like "car" for "Drive."
- No amber box for plain information. It would go away or turn gray.
- Honest wording about when trip details reach RideWitUS.

## Where this stands

This is planned, not shipped. I have seven open questions to settle first. Three of them:

- Should the distance I type be one way, or the total?
- Should the starting place also work for a gym workout, not just a trip?
- On a shared calendar that hides event titles, should "home" be hidden too?

The change needs nothing new in how the database is laid out. Once I answer the questions, I can build it.

## The question to ask

When a vendor shows you a form, ask:

> "Does this form ever ask for the same thing twice? If my two answers disagree, which one wins?"

Then ask what happens when an important box is left blank. Does it quietly fail, or does the screen warn you?

## What this means when you hire

Two questions for anyone who builds forms:

- "Tell me about a box you removed from a form. How did you know it wasn't needed?"
- "When your screen says something will happen, how do you check that it always does?"

A good answer names a real box and a real check. A weak answer is "we added more help text."
