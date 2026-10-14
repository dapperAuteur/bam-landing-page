<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   An Arrow to a Room Nobody Could Enter
Slug:    an-arrow-to-a-room-nobody-could-enter
Excerpt: My public tours could show an arrow to a room that was still hidden.
         Click it and nothing happened. The person building the tour could
         never see the bug, because their preview showed every room. Here is
         the fix, and the preview question to ask any vendor.
Tags:    Quality, Bugs, Buying Software, Plain Talk, Wanderlust
-->

# An Arrow to a Room Nobody Could Enter

In a 360° tour, you move by arrows. You look around a room, spot an arrow in a doorway, and click it. Now you are standing in the next room.

On Wanderlust, some of those arrows went nowhere.

## What went wrong

A tour is made of scenes. Each scene is one spot you can look around in, and each has a status. Live scenes are public. Drafts and unpublished scenes are hidden from visitors.

A Live scene could have an arrow that led to a hidden one. Visitors still saw that arrow. They clicked it, and nothing happened. Behind the scenes, the tour viewer (the software that draws the 360° view in your browser) threw an error: "Node not found." A node is the viewer's word for a scene. It builds a tour from a list of scenes, and each arrow names the scene it leads to (Photo Sphere Viewer, n.d.). This arrow named a scene that was not on the list.

The cause was one missing question. To build a tour for visitors, the app gathered the Live scenes. Then, for each one, it gathered its arrows by asking "which arrows start here?" It never asked "and where does each one end?"

The same gap caught one more case: a scene left out because its photo was not ready yet. Arrows into that scene went nowhere too.

## Why nobody saw it

This is the part that matters most.

When a creator previews their own tour, they see every scene they own, drafts included. The private preview link, the one you send a client before launch, shows drafts too. That is on purpose. Hiding your own work in progress from you would make the preview useless.

But it means that in the preview, an arrow into a draft worked fine. Only a member of the public, on the real tour, got the dead end. The people building the tour were looking at a different tour from the one visitors got.

## How I found it

I was building a way to publish and unpublish many scenes at once, with checkboxes. I wrote about that in [Publishing a Tour One Scene at a Time](/blog/publishing-a-tour-one-scene-at-a-time).

Unpublishing many scenes at once changes the math. Hide five scenes in one press, and every arrow from a Live scene into those five becomes a door that won't open. A rare bug was about to become a common one. So it got fixed first, in the same batch of changes.

## The fix

Now, once the app knows which scenes a visitor gets, it drops every arrow whose target is not one of them. It does this in one place, before anything else reads the arrows.

Two details I care about:

- **The arrow is not deleted.** It stays saved with the scene. Publish the hidden scene again and the arrows into it come back on their own.
- **It is tested.** I added automatic tests that build a small pretend tour with a hidden scene and check that the arrow to it is gone, and that nothing else changed.

It was also checked in a browser, on a tour where a Live scene linked to an unpublished one. No arrow pointed toward the hidden scene.

## Why a missing arrow beats a message

Another fix would keep the arrow and show a note: "This room isn't open yet." Removing the arrow is better, and here is why.

Nielsen Norman Group, a firm that studies how people use websites, puts the problem plainly: "The very worst error messages are those that don't exist" (Neusesser & Sunwall, 2023). A click that does nothing is exactly that. You don't know if the site broke, if you clicked wrong, or if you should try again.

Better still is never setting the trap. Jakob Nielsen's rules of thumb for usable design say to remove the conditions that cause errors in the first place (Nielsen, 1994). An arrow to a hidden room is a condition like that. Take the arrow away and there is nothing to get wrong.

Wanderlust already had a rule like this for scavenger hunts. A locked door in a hunt shows no arrow until the visitor has the key. Locked things are absent, not greyed out. Hidden scenes now follow the same rule.

## The question to ask

When a vendor lets you preview your site, app or tour, ask:

> "Is my preview exactly what the public sees? If not, what is different?"

Previews often show more than the public gets: drafts, hidden pages, staff-only links. That is useful. But anything that links to those hidden things can break, and you may never see it break.

So ask them to show you the live version, signed out, after you hide something. Then click everything that points toward what you hid.

## What this means when you hire

Two interview questions:

- "Tell me about a bug that users could see and you couldn't." Good builders have one. They can tell you why they couldn't see it.
- "When you hide or delete something, how do you find everything that pointed to it?" Listen for a check that runs every time, not a promise to remember.

## References

Neusesser, T., & Sunwall, E. (2023, May 14). *Error-message guidelines*. Nielsen Norman Group. https://www.nngroup.com/articles/error-message-guidelines/

Nielsen, J. (1994, April 24). *10 usability heuristics for user interface design*. Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/

Photo Sphere Viewer. (n.d.). *VirtualTourPlugin*. https://photo-sphere-viewer.js.org/plugins/virtual-tour.html
