<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   At 320 Pixels, Four Links Went Into a Menu. Sign In Stayed Out.
Slug:    four-links-in-a-menu-sign-in-stays
Excerpt: The witus.online header was wider than a small phone, so the whole page scrolled
         sideways. The fix moved four links behind a Menu button and kept Sign in in the bar,
         on purpose. Two React details came with it: one list shared by a server component and
         a client one, and closing the menu on navigation without an effect.
Tags:    Accessibility, React, Next.js, Responsive Design, WitUS
-->

# At 320 Pixels, Four Links Went Into a Menu. Sign In Stayed Out.

On October 29 the witus.online header turned out to be wider than a 320-pixel screen. The wordmark plus six controls (About, Learn, Explore, Roadmap, Apps, Sign in) did not fit, so the whole page scrolled sideways on small phones. Every page, because the header is on every page.

The fix is ordinary: below the small breakpoint, some links move behind a Menu button. The interesting parts were which links moved, and two React details that came with the change.

## Which links go in the menu, and which never do

About, Learn, Explore and Roadmap moved into the menu, along with Admin when I am signed in. **Apps** and **Sign in** stay in the bar at every width.

That choice is not about space. It is a rule I wrote after getting this wrong. From May 13 to October 16, 2026, witus.online showed "Apps" in the spot where "Sign in" belonged, and a visitor had no visible way to sign in. Since then, the shared design standard for my apps says every public header shows a link named exactly "Sign in" to anyone who is not signed in, never swapped for a neutral label, and an end-to-end test checks for it after every production deploy. A menu that tucks Sign in out of sight on phones would break that rule on exactly the screens where most people arrive.

So the bar keeps the two controls a visitor needs before anything else: where the apps are, and how to get in.

## One list, two kinds of component

The header is a server component. The menu is a client component, because it holds open or closed state and listens for the Escape key. Both need the same four links.

The obvious move is to define the list in the menu file and import it into the header. That file starts with `'use client'`, and React's rules for that boundary are strict. When server code imports values from a `'use client'` module, "the values must either be a React component or supported serializable prop values to be passed to a Client Component. Any other use case will throw an exception" (React, n.d.-b). The header does not pass the list to a client component. It calls `.map` on it to render links. That is "any other use case."

So the list lives in its own small module with no directive at all:

```ts
// Plain module (not "use client") so the server Header and the client HeaderMenu share one list.
export const sectionLinks = [
  { href: "/about", label: "About" },
  { href: "/learn", label: "Learn" },
  { href: "/explore", label: "Explore" },
  { href: "/roadmap", label: "Roadmap" },
] as const;
```

Both components import it. One list, no copy to drift, and nothing crosses the boundary that cannot.

## Closing the menu when the page changes

The header stays mounted when you move between pages. If you open the menu, tap Learn, and land on `/learn`, the menu's state is still "open" unless something closes it.

Tapping a link closes it. But navigation can happen other ways, like the back button. The usual reflex is an effect that watches the path and closes the menu. React's own guidance says not to: store the previous value and adjust state during render instead (React, n.d.-a). With an effect, the new page first renders with the menu open, then the effect runs and renders again with it closed. Adjusting during render lets React throw away that first result and retry before anything reaches the screen:

```tsx
const [lastPath, setLastPath] = useState(pathname);
if (pathname !== lastPath) {
  setLastPath(pathname);
  setOpen(false);
}
```

React's docs are clear about the limits. You may only update the same component's state this way, the comparison is what prevents a loop, and they add that most components should not need this pattern either (React, n.d.-a). This is the narrow case it exists for: state that has to reset when something outside the component changes.

Escape closes the menu too, and sends focus back to the Menu button so a keyboard user is not stranded at the top of the page.

## A test that fails if it scrolls sideways again

The fix came with a new end-to-end test. At 320 by 640, it loads the home page and measures how much wider the document is than the window:

```ts
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - window.innerWidth
);
expect(overflow).toBeLessThanOrEqual(0);
```

Then it checks that Sign in is visible, opens the menu, sees Roadmap, presses Escape, and checks that the menu closed and the button has focus. If the header ever grows past a small phone again, this fails before the change ships.

## What I would keep

- **Decide what is never hidden before you decide what to hide.** The menu was easy once Sign in was off the table.
- **Put shared constants in a plain module.** A `'use client'` file is a boundary, not a place to keep data both sides read.
- **Reset state on navigation without an effect** when the component outlives the page, and only then.
- **Turn the bug into a measurement.** "No sideways scroll at 320 pixels" is one subtraction and one assertion.

## References

React. (n.d.-a). *You might not need an Effect*. React documentation. Retrieved October 30, 2026, from https://react.dev/learn/you-might-not-need-an-effect

React. (n.d.-b). *'use client'*. React documentation. Retrieved October 30, 2026, from https://react.dev/reference/rsc/use-client
