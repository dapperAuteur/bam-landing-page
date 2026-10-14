<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Donate Button on Every Scene
Slug:    a-donate-button-on-every-scene
Excerpt: A visitor could walk every room of a tour and find no way to give.
         Wanderlust tours now carry up to three links, like Donate or Tickets,
         in the same corner of every scene, in fullscreen and in embeds. Here
         is what I built, what changed from the plan, and what to ask a vendor.
Tags:    Nonprofits, Accessibility, Embeds, Wanderlust
-->

# A Donate Button on Every Scene

A museum that puts a tour online usually wants something back: a visit, or a gift. A 360° tour is a good way to make someone care about a place. It is a poor place to lose them.

Before this change, a Wanderlust tour had one spot for a link: the tour's website, shown at the top of the public tour page. Not inside the tour itself. Not in the version a museum places on its own site. Not in fullscreen.

So a visitor could walk every room of a gallery, love it, and find no way to give.

I wanted one thing: a donate link, or any other important link, set once for the whole tour and shown in the same place on every scene.

## What I built

Each tour now has a **Tour links** panel on its settings page. A creator can add up to three links. Each one has button text, like Donate or Tickets, of up to 40 characters, and a web address.

One link can be featured. That is the one you most want people to press.

In the tour itself, the links sit in the top-right corner of the viewer:

- The featured link gets its own bold, solid button.
- Any other links sit behind a **More links** button. Press it and a short list opens.
- If nothing is featured, a single **Links** button opens the list.

Pressing Escape closes the list and puts the keyboard back on the button. Clicking anywhere else closes it too. The button follows the standard pattern for show and hide controls, so a screen reader can tell whether the list is open (World Wide Web Consortium [W3C], n.d.-a).

The links also show under the tour's name on the public tour page.

## Every scene, every way people see it

"Every scene" was the easy part. The harder part was all the ways a tour gets shown.

**Walking between scenes.** The corner stays put as a visitor moves from room to room.

**Fullscreen.** When a page goes fullscreen, the browser shows one part of the page, plus whatever is inside that part, and nothing else (MDN contributors, 2026a). Wanderlust's other overlays sit outside that part, so fullscreen hides them. The tour links are placed inside the very part that goes fullscreen, so they stay.

**Embeds.** An embed is a tour placed on someone else's website, like a museum's own page. A museum can add a setting to the embed address that hides Wanderlust's own branding, a small "Powered by Wanderlust" link. It does not hide the tour links.

That was on purpose. The donate button is the creator's content. My branding is platform decoration. A switch that hides the platform should hide the platform, and nothing the creator put there.

**Lessons.** Tours can also appear inside a course lesson, and the links show there too.

## The plan changed, for good reasons

My first plan put the links in the viewer's toolbar along the bottom, which shows everywhere. Then I looked closer. The toolbar's buttons are fixed at 40 pixels, and screen readers do not announce them as buttons. A donate link has to be easy to hit, and it has to say what it is.

So the links became a corner overlay with real links, each at least 44 pixels tall. The web's main accessibility standard, WCAG, uses 44 by 44 pixels as the target size at its strictest level (W3C, n.d.-c). A pill in the corner is also easier to spot than a small toolbar icon.

The way links are saved changed too. The plan stored each link as its own row in the database. Saving would mean deleting the old rows, then adding the new ones. My database connection cannot do both as one all-or-nothing step, so a save could stop halfway, with the old links gone and the new ones missing. Now all of a tour's links are saved as one value, in one step.

## Safe links, clear links

Only `http` and `https` addresses are accepted. It is the same rule I added for hotspot links, which I wrote about in [A Link Field That Accepted Code](/blog/a-link-field-that-accepted-code). The viewer checks each address again before it shows the link.

Every link opens in a new tab, and every link says so to screen readers: "opens in a new tab." A surprise new tab can be confusing, because the Back button no longer takes you where you were. A warning lets people decide before they leave (W3C, n.d.-b).

The new tab is also cut off from the tour, so the page it opens cannot reach back and tamper with the tour's page (MDN contributors, 2026b). That matters when the link points to a payment site you do not run.

## The questions to ask

A vendor's "hide our branding" switch is a promise about their things. Check that it keeps that promise and does nothing more.

If you run a museum, a nonprofit or a venue, and a vendor shows you a virtual tour or any embedded player, ask:

> "Where does my donate link show? Show me in fullscreen, and embedded on my site with your branding hidden."

And:

> "How big are the buttons, and what does a screen reader say when it reaches my link?"

A good answer to the first: everywhere the tour shows. A good answer to the second includes the words "opens in a new tab."

## References

MDN contributors. (2026a, March 26). *Fullscreen API*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API

MDN contributors. (2026b, April 22). *rel="noopener"*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener

World Wide Web Consortium. (n.d.-a). *Disclosure (show/hide) pattern*. ARIA Authoring Practices Guide. https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

World Wide Web Consortium. (n.d.-b). *G201: Giving users advanced warning when opening a new window*. https://www.w3.org/WAI/WCAG21/Techniques/general/G201

World Wide Web Consortium. (n.d.-c). *Understanding success criterion 2.5.5: Target size*. https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
