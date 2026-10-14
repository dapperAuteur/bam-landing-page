<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Undo Is Part of the Tool
Slug:    undo-is-part-of-the-tool
Excerpt: My editor for hiding people in 360 photos had no undo. Now it does.
         Here is what one step means, what undo will never reverse, and why the
         way a tool groups your changes matters as much as the button.
Tags:    Usability, 360 Photos, Privacy, Buying Software, Wanderlust
-->

# Undo Is Part of the Tool

Wanderlust has an editor called **Hide people and gear**. You draw boxes over strangers in a 360° photo, and the boxes are blurred or pixelated when you save. The story of how it started is in [I Was in Every 360 Photo I Took](/blog/i-was-in-every-360-photo-i-took).

I had just added handles, so you could drag a box to move it or resize it. Then I saw what was missing. If a drag went wrong, there was no way back. My note to myself was short: this needs undo and redo.

## Undo lets people try things

Without undo, every change is a small risk. So people stop trying. They leave a box a little too small rather than drag it and lose it.

The Nielsen Norman Group, a usability research firm, keeps a list of usability heuristics. Those are rules of thumb for judging a design. Number three is user control and freedom, and its advice is direct: "Support undo and redo." It also says why: "The ability to easily get out of trouble encourages exploration" (Rosala, 2020).

## What I built

- **Undo** and **Redo** buttons sit under the viewer.
- **Shortcuts:** Ctrl+Z to undo, and Ctrl+Shift+Z or Ctrl+Y to redo. On a Mac, Cmd+Z and Cmd+Shift+Z.
- **Text fields keep their own undo.** The shortcuts are ignored while you type in one. Ctrl+Z in a text box should fix your typing, not remove a box.
- **Screen readers hear it.** A screen reader is software that reads the screen aloud. The buttons tell it their shortcuts, and the line under the viewer says when something was undone or redone.
- **History keeps 100 steps.** Older ones fall off the bottom.

Undo covers boxes added, moved, resized or removed. It also covers faces, the box style, the AI option and the bottom cover. Remove a box by mistake, press Undo, and it comes back.

## What counts as one step

This was the real design work.

To a computer, a drag is not one change. It is many tiny ones, one for each moment the box follows your hand. A slider is the same. If each tiny change were a step, one Undo would move the box a hair. You would press it over and over to undo one drag.

So steps are grouped the way people think about them. A whole drag undoes in one step. So does one run of a slider. A run of arrow key nudges counts as one step too. Pause for more than a second, and the next change starts a new step.

One more rule. Make a new change after you undo, and Redo is cleared. Redo only walks back along the path you just undid.

## What undo will not touch

Saving is not undone. Saving makes a new file and swaps it in where the photo is used. That is real work on real files, and a shortcut should not reverse it by accident.

To reverse a save, there is a separate button, **Swap back**. It puts the original photo back. Hiding a person should be deliberate, and so should showing them again.

I checked 14 things in a browser. They included all four shortcuts, a slider run undoing as one step, and a phone sized screen with 44 pixel buttons.

## The questions to ask

When a vendor shows you any editor, ask:

> "I just dragged something to the wrong place. Show me how I get it back."

Then count the presses. One press for one action is the answer you want.

Next, ask what undo will not reverse. A good vendor can tell you right away, and their help pages say so too.

When you hire a builder, ask: "When you build undo, what counts as one step?" A strong builder talks about what the person thinks they did, not what the code did.

## References

Rosala, M. (2020, November 29). *User control and freedom (usability heuristic #3)*. Nielsen Norman Group. https://www.nngroup.com/articles/user-control-and-freedom/
