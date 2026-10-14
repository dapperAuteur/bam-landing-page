<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Saved for Offline, Never Served
Slug:    saved-for-offline-never-served
Excerpt: The Save for offline button in my app said it worked. It saved the
         files and never used them, and it skipped tours entirely. Here is what
         was wrong, what I fixed, and the offline test that passed while the
         network was still on.
Tags:    Offline, Testing, Buying Software, Plain Talk, Wanderlust
-->

# Saved for Offline, Never Served

Every course in my app, Wanderlust, has a switch called **Save for offline**. Turn it on before a field trip, and the course should still open when the signal drops.

It is a common idea. Jake Archibald's well-known guide to offline web apps suggests a "Save for offline" button that fetches what the reader needs and stores it (Archibald, 2014). For me it is more than an idea. Offline-first is one of three rules every learner-facing page in Wanderlust must pass before it goes live.

In October I found out that my button saved the files and then never used them.

## How I found it

I was not testing offline. I was building moments, a way to show one place at different times. I wanted a switch on each tour: should a saved course also download the photos for every moment?

To wire that switch, I read the code that runs offline. That is where the problem was. No test caught it. Reading the code did.

## What a service worker is

A web app can run a small helper inside your browser, called a service worker. When the app asks for a page or a picture, the service worker can answer from the network or from saved copies. Mozilla's developer docs say service workers sit "between web applications, the browser, and the network (when available)," and that one of their jobs is "to enable the creation of effective offline experiences" (MDN contributors, n.d.-b).

The saved copies live in a cache. Think of a cache as a labeled box of files that the browser keeps. One website can have many boxes, each with its own name (MDN contributors, n.d.-a).

## What was broken

Three things.

**The saved files sat in a box nobody opened.** Save for offline put a course's files into one named box. But each rule that answers requests, for pages, for images and for everything else, looks only in its own box. None of them looked in the saved one. The files were saved and never served.

Anything that did work offline worked by luck. The app keeps some recent copies on its own. Pages are kept for 7 days, up to 50 of them. Images are kept only if they are under 4 MB, which leaves out most 360° photos.

**Tours were left out.** The list of files to save covered 360° photos, 360° videos, regular videos and the course cover. It had no entry for virtual tours. So no tour photo was ever saved.

**The 360° photo it saved was the wrong file.** For 360° photo blocks, it saved a flat 1600 pixel fallback picture. The viewer loads a different file. So even an opened box would have missed.

Put together: a learner taps Save for offline before a field trip. They get a success message. Then, once the signal drops, they likely see nothing.

## What I fixed

- **The saved pack is served offline.** It is used only after the normal way fails, so nothing changes when you are online.
- **Tours are in the pack.** That means panoramas, sounds, the map and icons. The list is built by the same code the lesson uses, so the addresses match exactly. A saved file only helps if it is saved under the same address the page will ask for.
- **The real panorama is saved** for 360° photo blocks.
- **Moments came along.** The tour switch "Include every moment in offline downloads" is back. Turn it on, and every moment's photo is saved too.
- **It fails gently.** If a moment's photo was not saved, picking it offline takes you back to the base view with a message: "That moment couldn't load. It may need a connection." The viewer does not go blank.

Courses saved before the fix still have the old, incomplete pack. A learner picks up the tours by turning Save for offline off and on again.

## The test that lied

Here is the lesson I most want to pass on.

Service worker code is the kind that compiles fine and then misbehaves. My automatic checks all passed: type checks, code style checks, 378 unit tests and a full build. None of those can prove a page loads with no network. When the fix merged, no browser had proven it yet.

The first browser test passed. It used the testing tool's offline switch. That switch does not stop the service worker's own requests. So the "offline" page could still reach the network, and the pass proved nothing.

So I removed the network for real. I stopped the server, on a test copy of the app. I also made the address of my image service, Cloudinary, impossible to look up, so no photo could come from it. Then I opened the saved course.

All 18 files had been saved. The lesson page loaded, answered by the service worker. The tour photo loaded. I walked to the next room, and it loaded too.

The part I trust most is what failed. A page I had not saved did not load. An image I had not saved did not load either. That is how I know the network was really gone. If everything had loaded, I could not tell whether the fix worked or the network had slipped back in.

## The question to ask

When a vendor tells you their app works offline, ask:

> "How did you test it? Was the server really off?"

Then ask for one more thing: "Show me something that should fail offline, failing." If nothing ever fails in their test, the test may not be offline at all.

When you hire a builder, ask: "Tell me about a test that passed when it should not have." Good builders have one. They can tell you what they changed afterward.

## References

Archibald, J. (2014, December 9). *Common techniques to build offline applications*. web.dev. https://web.dev/articles/offline-cookbook

MDN contributors. (n.d.-a). *Cache*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/Cache

MDN contributors. (n.d.-b). *Service Worker API*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
