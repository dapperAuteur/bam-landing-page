<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Describing Sound for People Who Cannot Hear It
Slug:    describing-sound-for-people-who-cannot-hear-it
Excerpt: My tours have ambient audio — room tone, traffic, birds — with no text
         alternative at all. My code physically refused to attach one. The fix
         was not a transcript, and it does not wait for you to turn the sound
         on, because the person it exists for will never press that button.
Tags:    Accessibility, WCAG, Audio, Design, Beginners, Wanderlust
-->

# Describing Sound for People Who Cannot Hear It

One of the better things about my 360° tours is the sound. Stand in a courtyard in Antigua and you hear the courtyard — distant traffic, birdsong, the flat hum a stone room makes when nobody is speaking. It's called room tone, and it does an enormous amount of work. A photograph with room tone under it stops being a photograph.

For visitors who are deaf or hard of hearing, all of that was simply absent. Not degraded — absent. There was no text alternative of any kind, and the code would not have let me add one if I'd tried.

That's a WCAG 1.2.1 failure. Level A, which is the floor of the floor. And I'd like to walk through it properly, because the interesting part isn't that I'd missed it. It's that I had built the machinery for it and pointed it at the wrong thing.

## The field that existed and refused

My app already had transcripts. Creators could write one, store it, attach it to media. The plumbing was there.

It only accepted video.

Not by accident — by explicit check. If you handed the code an audio file and a transcript, it declined. Videos only. Somebody had decided that, and the somebody was me, and I can reconstruct the reasoning exactly, because it's tidy and it's wrong.

I'd modelled a text alternative as **the words that were said**. That's what a transcript is: speech, written down. From there the logic runs cleanly. Room tone has no speech. No speech means no transcript. No transcript means the field doesn't apply, so let's not offer it and clutter the interface.

Every step follows. The conclusion is that a deaf visitor gets nothing.

This is my favourite category of mistake, in a grim way: internally consistent, locally sensible, and it produces a product where the accessibility feature is unavailable precisely on the content that needed it most. Speech, at least, has captions and context and lip reading and a dozen partial routes in. Ambient sound has exactly one route, and I'd closed it.

## Why a transcript would have been useless anyway

Suppose I'd just lifted the restriction and let creators attach a transcript to an audio file. Here is the transcript of two minutes of courtyard room tone:

> *(no speech)*

Accurate. Complete. Worth nothing.

Because atmosphere has no words to transcribe. A verbatim record of a room tone is empty by definition, and the emptiness isn't a gap in the record — it's a category error in the question. "What was said?" has no answer here. The right question is "what was it *like*?"

So the field I actually added stores a **description**, not a transcript:

> distant traffic, and birdsong from the courtyard

Eight words. Not a technical annotation, not a list of frequencies — a plain-language account of what a hearing visitor is receiving. Somebody who reads that is now standing in the same place as somebody who hears it. Not identically. Close enough that the room has a character.

The naming matters more than it looks. If the field were labelled "transcript," creators would try to transcribe, find nothing to transcribe, and leave it blank — and the blankness would look like completion. Labelled "description," the prompt is answerable, and a creator who was actually standing there can answer it in a sentence.

Which is also why nothing generates these automatically. I don't put machine-written text in front of learners as a matter of policy, but here the rule earns itself twice over: the entire value of the sentence is that a person with the microphone in their hand knew it was a courtyard, knew the traffic was distant, and knew the birds were in *that* courtyard rather than somewhere on the recording. That knowledge is what's being passed on. A guess about it is worse than silence, because it reads with the same confidence and can't be told apart.

## The mistake I nearly made on the second pass

Now the display question, and this is where I nearly got it wrong a second time in the same feature.

Browsers won't let a page play sound at you unprompted, quite rightly. So a tour has a button — turn sound on. Until you press it, the tour is silent for everybody.

My first instinct for showing the description was: put it near the audio controls, and reveal it when the audio is active. It's audio-related text; show it in the audio state. That instinct is so natural it barely registers as a decision.

It is exactly backwards.

A visitor who is deaf will never press that button. Why would they? It offers them nothing. So gating the text behind the sound control hides it from the only person who needs it, while showing it faithfully to everyone who doesn't. The feature would exist, be technically present, pass its own review, and reach nobody.

So the description displays whether or not the sound is on. Always visible, near the audio control, part of the scene rather than an option within it:

```tsx
{audioDescription ? (
  // Not aria-hidden and not visually hidden: a hearing visitor with the
  // sound off benefits from knowing what they are missing, and a deaf
  // visitor needs it regardless. One affordance, both audiences.
  <p className="absolute bottom-3 left-3 rounded-md bg-black/70 px-3 py-2 text-xs text-white">
    <span className="sr-only">{soundDescriptionLabel}: </span>
    {audioDescription}
  </p>
) : null}
```

Three lines, and the comment is the important part — because that condition is exactly the kind of thing a future me would add back as a tidy-up.

It's real text in the page too, not a tooltip and not alt text buried on an icon. It can be selected, translated, read by a screen reader in the ordinary flow of the page, and found by search. Text alternatives that hide inside attributes have a way of becoming invisible to everybody, including the assistive technology they were written for.

## What I'd take from this

**An accessibility feature built on the wrong mental model helps nobody, and looks like it helps.** "We support transcripts" was true. It was also, for this content, worth precisely zero, and it sat in the codebase looking like coverage.

**Ask what the alternative is *for*, not what format it usually takes.** Transcript, caption, description, alt text — these are answers to different questions. Speech asks "what was said." Atmosphere asks "what was it like." Reaching for the familiar format first is how you end up storing an accurate blank.

**Check who is standing in front of your gate.** Any time a feature is revealed by a control, ask who is unlikely to touch that control, and whether they're the same people the feature was written for. If they are, the gate isn't tidying the interface. It's the whole failure.

**And the wider benefit is real, though it isn't the reason.** The description also serves the person in a library with sound off, the person on a train, the person whose connection never loads the audio file, and search. Those are good. But if I'd built it for them, I'd have put it behind the sound button, and it would have been fine — and useless to the person it was supposed to be for.
