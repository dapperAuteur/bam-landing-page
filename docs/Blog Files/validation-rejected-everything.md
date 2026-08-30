<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Validation I Wrote Rejected Everything
Slug:    validation-rejected-everything
Excerpt: I added two required fields to a form's checker and forgot to add them
         to the thing being checked. Every audio upload failed, for every file,
         forever. The build was green and the tests were green. The only reason
         I found it in four minutes was a different fix I'd made that morning.
Tags:    Debugging, TypeScript, Validation, Error Messages, Beginners, Wanderlust
-->

# The Validation I Wrote Rejected Everything

I added a small feature to my 360° tour app: attach a sound to a scene. Stand in the courtyard, hear the courtyard — distant traffic, birds, the particular hum a room has when nobody is talking. It's one of the cheapest ways to make a photograph feel like a place.

Then every attempt to attach a sound failed. Every file. Every format. Every scene. Every time.

The message was two words:

> **Invalid input**

It was correct. I had written it. I had also, an hour earlier, written the exact reason it would be true forever.

## What a checker checks

Here's the setup, from zero.

When you fill in a form on a website and press Save, the browser sends what you typed to a server somewhere. The server does not trust it — anything can send a request pretending to be my form, and even honest browsers send half-finished nonsense sometimes. So the first thing it does is check against a list of what must be present and what shape each thing must be: this must be a web address, this must be a number between 0 and 1, this must be true or false. Anything that doesn't match gets rejected before it goes near the database.

That list is called a schema, and mine looked roughly like this after my change:

```ts
const audioSchema = z.object({
  sceneId: z.string().uuid(),
  destinationId: z.string().uuid(),
  audioMediaId: z.string().uuid().nullable(),
  audioLoop: z.boolean(),                              // added today
  audioDescription: z.string().trim().max(500).nullable(),  // added today
  lang: z.string().min(2).max(5),
});
```

Two new required fields. Whether the sound loops, and a written description of what the sound is.

And here is the code on the other side of the room, the code that gathers up what the creator typed and hands it over:

```ts
const parsed = audioSchema.safeParse({
  sceneId: String(formData.get("sceneId") ?? ""),
  destinationId: String(formData.get("destinationId") ?? ""),
  audioMediaId: raw.length > 0 ? raw : null,
  // audioLoop and audioDescription were never added here
  lang: String(formData.get("lang") ?? "en"),
});
```

Three keys going in. Five keys required. So the checker rejected it, every single time, exactly as instructed.

It's the dullest possible bug. I updated the guest list and forgot to invite anyone.

## Why the computer didn't tell me

This is the part I actually want to talk about, because a reasonable question from someone outside software is: *isn't that literally what computers are for?*

My app is written in TypeScript, which is a language that checks your work before it runs. Think of it as a very pedantic proofreader for shapes. If a function expects a date and you hand it a phone number, it stops you at your desk rather than letting you find out from a customer.

It said nothing here. Not a warning, not a squiggle. The build went green, the test suite went green, and I shipped a feature that could not succeed once.

The reason is one word in the function's signature:

```ts
safeParse(data: unknown): SafeParseReturnType<...>
```

`unknown` means: *I promise nothing about this.*

And that is not sloppiness. It's the whole point. A validator's job is to take something nobody has vouched for and find out what it is. Data coming from a browser has been vouched for by nobody. If you told the proofreader "only correctly-shaped objects may be passed to the thing that checks whether objects are correctly shaped," you would have a checkpoint that only admits people who have already been checked, which is a checkpoint that does nothing.

So the security desk accepts any bag. That's what makes it a security desk. Which means my three-key object was a perfectly legal argument. TypeScript looked at the call, saw an object going into a parameter that accepts anything at all, and had genuinely nothing to complain about. It was right. I was wrong. It had no mechanism to notice.

**Green build, green tests, feature entirely broken** is worth sitting with. Automated checks answer the question you asked. I had asked "do the types line up?" and they lined up beautifully. Nobody had asked "if a real person fills in this real form, does anything happen?"

## The two words that saved the afternoon

Now the part that made this worth writing down.

Earlier the same day I'd fixed something unrelated and slightly boring: the page had been swallowing the server's error messages. When a save failed for any reason, the interface showed this:

> Something went wrong. Please try again.

The server had said "Invalid input." The page threw that away and substituted the friendly generic.

The first person to hit this bug — before that morning's fix — got the generic. And "try again" is not a weak message, it's a *wrong* one. It makes a specific claim: this failure is temporary, the fix is repetition, have another go. None of which was true. The failure was deterministic. Trying again was guaranteed to fail, and did, and the message calmly recommended it every time.

So they did the sensible next thing and opened the browser's developer console to look for the real cause. What they found there was a pile of errors from a browser extension — nothing to do with my app, not emitted by my code, not capable of being emitted by my code. That sent an hour in a direction with no bug at the end of it. (That mess is its own post.)

Then the swallowing got fixed, and the very next attempt returned the server's own words:

> Invalid input

Two words. Barely a sentence. But they name the right *category*: the shape of what you sent is wrong. Not the network, not the file, not the server. The shape. Which meant the schema, which meant the payload, which meant the four minutes it actually took.

The gap between those two messages is not politeness. "Please try again" points at time. "Invalid input" points at structure. One is a map; the other is a shrug delivered with confidence.

## What I'd take from this

**A wrong error message costs more than the bug it hides.** The bug was a missing line. The message turned it into an afternoon, and sent someone into a browser console to read another vendor's problems.

**Rank the outcomes honestly.** A specific true error is best. Silence is second. A confident wrong explanation is last, and it is not close — it doesn't merely fail to help, it spends someone's time in the wrong place and their trust along with it.

**Generic error handling is written once, early, and degrades everything after it.** Nobody sits down to write "hide the reason." You write a friendly fallback on day one for the one case you'd imagined, and it silently eats every real diagnosis for the rest of the product's life. Mine had been doing that for months. I found out because it ate mine.

**And the mechanical lesson, for completeness:** a schema and the object you hand it are two lists that must agree, and nothing on earth enforces that they do. Types can't see it. The only thing that catches it is exercising the real form once — filling it in, pressing the button, watching what happens. Which took ninety seconds, after I'd finally been told what to look at.
