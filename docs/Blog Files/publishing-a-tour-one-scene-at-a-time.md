<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Publishing a Tour One Scene at a Time
Slug:    publishing-a-tour-one-scene-at-a-time
Excerpt: In my tour app, going live meant opening every scene and pressing
         Publish, one by one. Now there are checkboxes. Here is what a good
         bulk button tells you afterward, the one case where it stops and asks
         first, and the question to ask any vendor whose app has a Select all.
Tags:    Product, Creator Tools, Buying Software, Plain Talk, Wanderlust
-->

# Publishing a Tour One Scene at a Time

A tour in Wanderlust is made of scenes. A scene is one spot inside a real place: one 360° photo or video you can look around in. A tour can hold many scenes.

Each scene has a status:

- **Draft:** still being built. Visitors never see it.
- **Live:** published. Visitors see it.
- **Unpublished:** it was live, and now it is hidden again.

A public tour only shows its Live scenes. So before a tour can go out, its scenes have to be published.

## One trip per scene

The tour page listed every scene with a little status badge. That was all it did. To publish, you opened the first scene's page, pressed Publish, went back, and opened the next one.

With twenty scenes, that is twenty round trips. Hiding them again is twenty more. My note to myself said there should be a quick way to do this right next to the list. Maybe checkboxes.

## What I built

The scene list now has a checkbox on every row and a toolbar on top:

- **Select all**
- A count of how many you picked, like "3 selected"
- **Publish selected** and **Unpublish selected**
- **Clear selection**

The rules match the old one-scene buttons. Publishing keeps a scene's original publish date. Unpublishing leaves drafts as drafts, since a draft was never live. And one press handles up to 100 scenes.

## It tells you what happened

When it finishes, a message reports every outcome, not just the good news. It reads like this:

> "Scenes published: 2. Already live: 1. Skipped, not yours to change: 1."

That last line is a safety net. Tours can have more than one creator, and you can't tick another creator's scene: its checkbox is switched off, with a note that only they or an admin can change it. If something you picked still doesn't change, the message says so. Nobody should have to guess why a scene they ticked stayed the same. The first of Jakob Nielsen's ten rules of thumb for usable design is to keep people informed about what is going on, with feedback in reasonable time (Nielsen, 1994).

The message is also announced to screen reader users (software that reads the screen aloud) without moving them away from where they are. The web's accessibility guidelines call this a status message and list it at Level AA, the level Wanderlust is built to meet (W3C Web Accessibility Initiative, 2026).

## The page shows, the server decides

The switched-off checkbox is a courtesy. It is not the lock.

When the request reaches the server, the computer that holds the real data, it checks every scene again, one at a time. Is this scene in this tour? Is this person allowed to change it? Anything that fails is counted as skipped. One stray scene can't block the rest, and it can't slip through either.

While I was in there, the old one-scene buttons turned out to be missing two things. They never confirmed that the scene belonged to the tour named in the request. And they never told the public tour page itself to update. Both do now.

## The one time it asks first

There is one press that can empty a tour: unpublishing every Live scene of a public tour. Visitors would arrive and find nothing.

So that one case stops and asks:

> "This tour is public. Unpublishing every live scene leaves visitors with nothing to see. Unpublish them all anyway?"

The choices are **Yes, unpublish all** and **Cancel**. Keyboard focus, the spot where your next key press goes, jumps to Cancel, the safe choice.

Nothing else asks. Publishing doesn't. Unpublishing a few scenes doesn't. That is on purpose. Jakob Nielsen warns that confirmation boxes only work when they are rare: "if you warn people too much, they stop paying attention" (Nielsen, 2018). A question that pops up every time trains people to click Yes without reading.

## How it was checked

It was checked in a browser on a test copy of the app: tick two draft scenes, press Publish selected, read the counts, and watch the badges change to Live. Then tick every Live scene of a public tour and press Unpublish selected. The question appears.

Building this also turned up an older bug that bulk unpublish would have made much more common. It got its own post: [An Arrow to a Room Nobody Could Enter](/blog/an-arrow-to-a-room-nobody-could-enter).

The step-by-step help is at https://wanderlust.witus.online/en/help/publish-and-embed-your-tour.

## The question to ask

If an app you are buying has checkboxes and a Select all, ask:

> "If I select fifty things and I'm only allowed to change forty, what happens, and what does the screen tell me?"

A good answer: the forty change, the ten are skipped, and you are told both numbers. Watch for these:

- The whole batch fails because of one item.
- It quietly changes some and says "Done."
- It changes all fifty.

Then ask which bulk actions stop and ask first. If the answer is "all of them," people will stop reading the question.

## What this means when you hire

Two interview questions:

- "Where do you check whether someone is allowed to make a change?" A strong answer is on the server, for every item. A weak one is "we hide the button."
- "When an action affects many things at once, how do you report what happened?" Listen for counts, and for a separate line for what was skipped.

## References

Nielsen, J. (1994, April 24). *10 usability heuristics for user interface design*. Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/

Nielsen, J. (2018, February 18). *Confirmation dialogs can prevent user errors: If not overused*. Nielsen Norman Group. https://www.nngroup.com/articles/confirmation-dialog/

W3C Web Accessibility Initiative. (2026, May 11). *Understanding Success Criterion 4.1.3: Status messages*. https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html
