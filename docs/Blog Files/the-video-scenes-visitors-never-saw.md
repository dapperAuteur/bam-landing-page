<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Video Scenes Visitors Never Saw
Slug:    the-video-scenes-visitors-never-saw
Excerpt: A Wanderlust tour that mixed 360 photos and 360 videos quietly
         dropped every video scene, and visitors never knew. Here is why the
         viewer could only show one kind at a time, how a tour now crosses
         between them, and two older bugs I fixed on the way.
Tags:    Accessibility, 360 Video, Engineering Judgment, Plain Talk, Wanderlust
-->

# The Video Scenes Visitors Never Saw

Some places work best as a photo. A quiet gallery reads well as a still 360° photo. A fountain, a busy street or a drone flight over the building needs video.

Wanderlust supports both kinds of scene: 360° photos and 360° videos. A scene is one spot in a tour where you can look all the way around.

Until now, one tour could not hold both.

## What went wrong

If a tour had photo scenes and video scenes, the viewer showed only the photos. The video scenes were simply not there. Visitors had no way to know anything was missing.

The creator did get an amber warning that only the photo scenes would show, and my guide said to split the tour in two. That is a workaround, not a fix. A visitor walking through a museum does not care which kind of file each room is.

## Why the viewer could only show one kind

The 360° viewer in Wanderlust is built on a library called Photo Sphere Viewer. A library is code someone else wrote that you build on.

The library loads each panorama through a part called an adapter. Its documentation describes adapters as "small pieces of code responsible to load the panorama texture(s)" (Photo Sphere Viewer, n.d.-a). There is one adapter for photos and a different one for video.

You choose the adapter when you build the viewer. After that, it is fixed. The documentation lists the adapter among the options that "cannot be changed" (Photo Sphere Viewer, n.d.-b). So a viewer built for photos cannot show a video, and the reverse is true too.

## The fix: rebuild the viewer

When a visitor crosses from a photo scene into a video scene, Wanderlust now takes the viewer down and builds a new one with the video adapter, opened on the scene they walked to. Going back works the same way.

A rebuild takes a moment. So I made that moment honest:

- **A short dimming** covers the switch. For people who set their device to reduce motion, the change is instant instead.
- **A spoken note** for screen reader users. A screen reader is software that reads the screen aloud, and many blind people use one. It hears "Loading 360 video" or "Loading 360 photo." The note does not move the keyboard focus. WCAG, the web's accessibility standard, asks that status messages reach screen readers "without receiving focus" (W3C Web Accessibility Initiative, n.d.-b).

Then everything a visitor uses to get around had to cross too:

- **Arrows.** An arrow into a scene of the other kind looks and behaves like any other: same name, same turn, same keyboard control. The next scene opens facing the way the arrow said.
- **The stop rail**, the list of stops you can jump between.
- **Floor-plan pins.** The small map of the place still shows every room, photo or video, and a pin takes you there.
- **The Back button.**

And some things had to survive the rebuild:

- **Keys** collected in a hunt, the treasure-hunt game you can play inside a tour.
- **The chosen moment.** Some tours let you switch a scene to an older photo of the same spot. Moments stay photo-only. On a video scene the Time control hides, with no false "no photo" notice. Your choice comes back on the next photo scene.
- **Sound** carries on.
- **The address** in the browser bar, which names the scene you are on, so you can share it or reload it.

For creators, the amber warning is now a calm note. It says the tour mixes 360° photos and 360° videos, that this works, and that crossing between the two kinds reloads the viewer for a moment.

## Two bugs I fixed on the way

**Back skipped a scene.** Your browser keeps a list of the pages you have visited, and Back steps down that list. If you opened a tour from a link that named a scene, your first walk replaced that scene in the list instead of adding a new entry. So Back skipped the scene you started in. That affected every tour, not only mixed ones.

**The big play button had no name.** On 360° videos, the large play and pause button had no accessible name. That is the label software reads aloud for a control. A screen reader could tell someone there was a button, but not what it did. WCAG asks that every control have a name that software can determine (W3C Web Accessibility Initiative, n.d.-a). axe, an automated checker that scans a page for accessibility problems, rated it serious. It affected every video tour. The button now says what it does: play or pause the 360 video.

## How I checked it

On test data, I added a temporary video scene to one of my tours, walked through it, then deleted it. There were 9 checks, and all 9 passed:

- Crossing announced itself and arrived, and the dimming cleared.
- The arrow back was there.
- axe found nothing on the video scene.
- Back returned across the switch.
- Pressing Enter on an arrow crossed too.
- There were no page errors.

One check is still open. I have not yet walked into a video scene and back on a real iPhone. iPhones have their own rules about when a video may play and when sound may start. A browser on my laptop cannot prove those. Until I try it on the phone, I am not calling it done on iPhone.

## A tip if you build mixed tours

Put the crossing where a pause feels natural, like a doorway to the outside, or the step from a drone view down to the front door.

## Questions to ask

The failure here was silent. That is the kind to look for. Ask your vendor:

> "If I put two kinds of media in one project, will anything be hidden? Will I be told? Will my visitors?"

Ask them to show you, not tell you.

And when they fix something, ask:

> "What else did you find while you were in there?"

Builders who test the edges find older problems nearby. My fix turned up two that touched every tour. If the answer is always "nothing," ask how they tested.

## References

Photo Sphere Viewer. (n.d.-a). *Adapters*. https://photo-sphere-viewer.js.org/guide/adapters/

Photo Sphere Viewer. (n.d.-b). *Methods*. https://photo-sphere-viewer.js.org/guide/methods.html

W3C Web Accessibility Initiative. (n.d.-a). *Understanding Success Criterion 4.1.2: Name, role, value*. Understanding WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html

W3C Web Accessibility Initiative. (n.d.-b). *Understanding Success Criterion 4.1.3: Status messages*. Understanding WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html
