<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Save Button That Says No
Slug:    the-save-button-that-says-no
Excerpt: A hotspot in a Wanderlust tour can now open a picture, a video or a
         YouTube clip in a pop-up. But my app will not save a picture without
         a written description, or a video without a transcript. Here is why
         I made those rules locks instead of reminders, and what to ask a
         vendor before you trust their word on access.
Tags:    Accessibility, WCAG, Creator Tools, Buying Software, Wanderlust
-->

# The Save Button That Says No

A hotspot is a small point you can click inside a 360° scene. Until now, a hotspot on Wanderlust could show text, play a sound, open a web page or take you to another tour.

It could not show a picture or a video.

That was a real gap. Picture a museum gallery in 360°, with a display case across the room. A close-up of the object inside would say more than any label. So would a short video of someone turning it in their hands. A 360° view is good at space and poor at detail.

## What I built

Hotspots now have a fourth type: **Image or video**. You pick one of your own images or flat videos from your media library, or paste a YouTube link. "Flat" means a normal video, not a 360° one, and drone footage counts. A 360° video belongs in a scene of its own, not in a pop-up.

When a visitor opens the hotspot, the picture or video appears in a pop-up:

- It works when the tour is in fullscreen.
- While it is open, the keyboard stays inside it, so someone who moves with the Tab key does not get lost behind it.
- Escape closes it, and the focus goes back to where you were.
- A video stops when the pop-up closes.
- YouTube clips play through YouTube's privacy-enhanced player.
- An image that was edited with AI shows the same disclosure line my tours use.

The keyboard rules follow the W3C's guide for pop-up dialogs. Escape "closes the dialog," Tab stays inside, and on close, "focus returns to the element that invoked the dialog" (W3C Web Accessibility Initiative, n.d.-a).

When a learner saves a course for offline use, hotspot images and videos now come along. YouTube clips cannot be saved that way.

## The rules

Here is the part I care about most.

**An image cannot be saved without alt text.** Alt text is a written description of a picture for people who cannot see it. A screen reader, the software many blind people use to hear a page, reads it aloud. The web's accessibility standard is called WCAG. It asks that every picture have "a text alternative that serves the equivalent purpose" (W3C Web Accessibility Initiative, n.d.-b). If you click Save without one, the app refuses and says so in one plain line: add alt text for the image before saving.

Good alt text is a sentence, not a file name. For a close-up of a tiled fireplace, it might be the colors, the rough age and the damage you would point out to a friend.

**A video cannot be saved without a transcript.** A transcript is the words of a video written out, along with what matters that is only shown. You attach it once, in the media library. WCAG's guidance notes that text "can be rendered through any sensory modality" (W3C Web Accessibility Initiative, n.d.-c). The same transcript can be read on a screen, read aloud or felt on a braille display. Lesson videos in Wanderlust already had to meet this rule before a course could be published. Hotspots now meet it too.

**A transcript can double as captions.** Captions are the words on screen, in time with the sound. If the transcript is a timed text file, the kind that ends in .vtt and records when each line is spoken, the video shows it as captions as well. WCAG asks for captions on recorded video so people who are deaf or hard of hearing can watch it. It also says captions carry meaningful sound effects, not only speech (W3C Web Accessibility Initiative, n.d.-d). One file does two jobs.

**A file in use cannot be deleted.** The media library will not delete a picture or video that a hotspot still uses. It names the hotspot, so you know where to go to change it. Without that, a hotspot could quietly lose the very thing it was built to show.

## Why a lock and not a reminder

I could have shown a friendly warning: "Consider adding alt text." On a busy day, most people would skip it. I would too.

A reminder makes access optional. A lock makes it part of saving. And the description gets written by the person who knows the picture best, at the moment they know it best: when they choose it.

The rules live in one shared place in the code. The editor, the save step and the code that builds the tour for visitors all ask the same question: is this file allowed in a hotspot yet? So no screen can quietly skip a rule another screen enforces.

## How I checked it

I tested it in a real browser on test data. There were 10 checks, and all 10 passed:

- An image without alt text was refused.
- An image with alt text and a YouTube link both saved.
- A video without a transcript was refused.
- On the tour, the image opened with its alt text, inside the fullscreen view.
- Escape closed it.
- The YouTube clip played.
- The library knew the file was in use.

I also ran axe on the pop-up. axe is an automated checker that scans a page for common accessibility problems. It found none.

## Questions to ask

When a vendor tells you their tour builder or website builder is accessible, open it and try this:

> "Can I publish a photo with no description? Show me."

If the answer is yes, access depends on every person remembering, every time. Then:

> "Can I publish a video with no captions and no transcript?"

And one for any media library:

> "What happens if I delete a file that is still in use?"

A good answer: the app tells you where the file is used and stops you.

If you are hiring a builder, ask where a missing picture description gets caught in their work. "In review" is a weaker answer than "the save button refuses it." Review depends on someone remembering. A save button never forgets.

## References

W3C Web Accessibility Initiative. (n.d.-a). *Dialog (modal) pattern*. ARIA Authoring Practices Guide. https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

W3C Web Accessibility Initiative. (n.d.-b). *Understanding Success Criterion 1.1.1: Non-text content*. Understanding WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html

W3C Web Accessibility Initiative. (n.d.-c). *Understanding Success Criterion 1.2.1: Audio-only and video-only (prerecorded)*. Understanding WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded.html

W3C Web Accessibility Initiative. (n.d.-d). *Understanding Success Criterion 1.2.2: Captions (prerecorded)*. Understanding WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html
