<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Menu Ran Under the Buttons
Slug:    my-menu-ran-under-the-buttons
Excerpt: Signed in as the admin, my app's top menu had 12 links in one row.
         They slid under the buttons on the right, even on a wide monitor.
         Why a bigger screen did not help, how four groups fixed it, and the
         one question that would have caught it in a demo.
Tags:    Accessibility, Design, Buying Software, Plain Talk, Wanderlust
-->

# My Menu Ran Under the Buttons

The menu at the top of a website has one job. It shows you where you can go.

On Wanderlust, the menu was hiding its own links.

## What went wrong

Wanderlust is my app for 360° tours of real places, and for courses built on them. The top menu changes with who you are. A visitor who is not signed in saw five links. A creator saw more. As the admin, I saw 12.

All 12 sat in one row, and the row could not wrap onto a second line. So the links ran under the controls on the right: the light and dark switch, my name, and Sign out. A link you cannot see is a link you cannot use.

A bigger monitor did not help. The header is capped at a set width. On a wide screen, the extra room becomes empty space on the sides, not room for the menu.

I had hit a smaller version of this in July. Back then, the row made the whole page scroll sideways on mid-size screens. My fix was to show the row only on screens at least 1,024 pixels wide, with a drawer menu (the ☰ button) below that. That fixed the scrolling. It did not stop the list from growing.

The note I filed for myself was short: create categories. My courses belongs under Courses. How it works, Support and Docs belong under Help.

## Why my tests missed it

I have an automatic test that opens pages at many screen widths and fails if a page scrolls sideways. It opened every page signed out. That visitor saw five links. The person with the most links, me, was never tested.

## What I built

Four groups instead of 12 links:

- **Tours:** Browse tours, My destinations, Media library
- **Courses:** Courses (soon), My courses
- **Help:** How it works, Help center, Docs, Support
- **Admin:** Users, Tour types, Courses, Support inbox

Each group is a button. Click it, and a short list of links drops down. You only get the links your account can use. A signed-out visitor sees Tours, Courses (soon) and Help. A group with a single link shows as a plain link, because a dropdown with one item is a click that tells you nothing.

The Account link left the row. My name, on the right, is now the link to my account. On a phone, the drawer shows the same groups as labeled sections.

Sorting links into groups turned up two admin pages that had never been in the menu: the course review list, where I approve courses, and the support inbox, where every message from a user lands. Both existed. Now both sit under Admin.

## A menu that is not a "menu"

One technical choice matters to people who use screen readers. A screen reader is software that reads the screen out loud, mostly for people who are blind or have low vision.

Web code has a label for a "menu." It sounds right. It is not. It tells assistive software to expect an app menu, like File and Edit in a word processor. The W3C, the group that writes the web's accessibility guidelines, publishes an example of site navigation built another way. It says "typical site navigation does not need all the keyboard interactions specified by the menu and menubar pattern" (W3C Web Accessibility Initiative, 2026a).

Their approach is called disclosure navigation. A disclosure is a control that shows or hides content (W3C Web Accessibility Initiative, n.d.). Here, it is a button that shows a list of ordinary links.

Mine follows that example:

- The button tells a screen reader whether its list is open or closed.
- Escape closes the list and puts you back on the button (W3C Web Accessibility Initiative, 2026a).
- Clicking elsewhere, tabbing away, or changing pages closes it too.
- The page you are on is marked as current, and its group's button turns bold.
- Every button and link is at least 44 pixels tall. The strictest level of the guidelines asks for targets 44 by 44 pixels, for people who have trouble hitting small ones (W3C Web Accessibility Initiative, 2026b).

I added no outside code for this. The dropdown is about a hundred lines I can read top to bottom.

Nielsen Norman Group, a firm that studies how people use websites, warns that hiding a site's top-level categories inside dropdowns can hurt people trying to find things (Li, 2017). So the four group names stay in plain view. Only the links inside them fold away.

It was checked in a browser, signed in as an admin, at widths from 1,024 to 1,920 pixels: four groups, and nothing under my name or Sign out. The drawer was checked at phone size too.

## The question to ask

When a vendor or a builder shows you a new site, ask:

> "Can you show me the menu signed in as the person with the most access?"

Demos are usually given signed out. The admin sees the longest menu. That is where it breaks.

If they have automatic tests, ask: "Which account do the tests sign in as?" Mine signed in as nobody.

## What this means when you hire

Two interview questions:

- "A menu has run out of room. What do you do?" A weak answer is a smaller font. A strong one talks about grouping, and what each kind of user needs to see.
- "How do you build a dropdown that works with a keyboard and a screen reader?" A strong builder knows the W3C examples exist and tests with the keyboard.

## References

Li, A. (2017, June 11). *Dropdowns: Design guidelines*. Nielsen Norman Group. https://www.nngroup.com/articles/drop-down-menus/

W3C Web Accessibility Initiative. (n.d.). *Disclosure (show/hide) pattern*. ARIA Authoring Practices Guide. https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

W3C Web Accessibility Initiative. (2026a, January 20). *Example disclosure navigation menu*. ARIA Authoring Practices Guide. https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/

W3C Web Accessibility Initiative. (2026b, September 6). *Understanding Success Criterion 2.5.5: Target size*. https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
