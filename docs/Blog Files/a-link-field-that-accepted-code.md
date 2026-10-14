<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Link Field That Accepted Code
Slug:    a-link-field-that-accepted-code
Excerpt: Two fields in Wanderlust asked "is this a web address?" before saving.
         That is the wrong question, because a small program can pass it. Here
         is the gap, the two-layer fix, and the question to ask any vendor who
         lets people type links into your software.
Tags:    Security, Buying Software, Plain Talk, Wanderlust
-->

# A Link Field That Accepted Code

Wanderlust lets creators build 360° tours of real places. A 360° photo is one you can look all the way around in, as if you were standing in the room. Creators can drop hotspots into those photos. A hotspot is a spot you can click. Some hotspots open a web page, so the creator types in a web address.

A tour can also have a website. That is usually the venue's own site. It shows on the tour page.

Before saving, both fields asked one question: is this a web address?

That turned out to be the wrong question.

## A web address is not always a place

Most web addresses start with `https://`. That first part is called the scheme. It tells the browser what kind of address this is. `https` means "go and get this page."

There are other schemes. Two of them matter here.

An address that starts with `javascript:` is not a place at all. It is a small program. When a browser opens it, the program runs. MDN, Mozilla's reference for web developers, warns that these addresses "may lead to execution of arbitrary code" (MDN contributors, 2026b). Arbitrary means anything the writer wants.

An address that starts with `data:` carries a whole small file inside the address itself (MDN contributors, 2026a). Browsers now block opening these as a full page, because they were used for phishing, which means tricking people with fake pages.

Here is the gap. My check asked a standard code library whether the text was a valid address. `javascript:` followed by a program is a valid address. So is `data:` followed by a file. Both passed.

## Why the hotspot was the weak spot

Wanderlust is built with React, a popular toolkit for building web pages. React's team has called these addresses "a dangerous attack surface" since 2019 (Abramov & Vaughn, 2019). The version my app uses, React 19, blocks `javascript:` addresses in ordinary links on the page (OWASP Cheat Sheet Series, n.d.).

Hotspots worked differently. A click on a hotspot ran a browser command called `window.open`, which opens a new tab. React never sees that command, so its guard never gets a chance to help.

OWASP publishes free web security guides. Its guide on this topic says React's protection "does not replace application-specific URL validation." Its advice for addresses that come from users is short: allow `http` and `https` only (OWASP Cheat Sheet Series, n.d.).

Why does this matter? Cross-site scripting, or XSS, is when someone gets their own code to run inside a site people trust. Code running that way can read things like the tokens that keep you signed in (OWASP Foundation, n.d.).

This is not a story about an attack. It is about a gap I found while planning another feature. The person who types a hotspot link is not the person who clicks it. That is reason enough to close it.

## What I built

The fix has two layers.

**One shared rule.** Every field where a creator types a link now uses the same rule. The address must start with `http` or `https`, and it can be at most 500 characters. The rule lives in one place, so the hotspot link, the tour website and a newer feature, tour links, all get the same check. A `javascript:` or `data:` address is refused when the creator saves.

**A second look at the last moment.** When a visitor clicks a hotspot, the viewer checks the address again, right before it opens the tab. If the address is not `http` or `https`, nothing opens.

Why check twice? Because links saved before the rule existed never went through it. The rule guards the door on the way in. The second check guards the door on the way out. The tour page does the same with the tour website: an old value that fails the check is not shown.

## Looking for old bad values

The checklist for merging this change gave me two read-only database queries. Read-only means they look and change nothing. One lists hotspot links that do not start with `http://` or `https://`. The other does the same for tour websites.

Running them was optional. Nothing they find gets deleted. The link stops showing, and the next time the creator saves that form, it asks for an `https://` address.

## The lesson

"Is this a valid web address?" sounds like the right question, and most code libraries answer it for you. The trouble is that "valid" and "safe to open" are different things.

An allow list beats a block list here. A block list says "refuse `javascript:`." Then someone finds a scheme you did not list. An allow list says "accept `http` and `https`, and nothing else." There are only two answers to get right.

## The question to ask

If your staff, your partners or the public can type links into software you pay for, ask the vendor:

> "Which kinds of web addresses does this field accept? Show me what happens if I paste one that starts with `javascript:`."

A good answer: it is refused when you save, and checked again when someone clicks.

Then ask one more:

> "What about links saved before that rule existed?"

A rule added today does nothing for a link saved last year, unless something also checks on the way out.

If you are hiring a builder, ask about a field that once accepted something it should not have. Listen for whether they fixed it in one shared place or form by form.

## References

Abramov, D., & Vaughn, B. (2019, August 8). *React v16.9.0 and the roadmap update*. React Blog. https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html

MDN contributors. (2026a, August 30). *data: URLs*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data

MDN contributors. (2026b, September 17). *javascript: URLs*. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript

OWASP Cheat Sheet Series. (n.d.). *Cross site scripting prevention cheat sheet*. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

OWASP Foundation. (n.d.). *Cross site scripting (XSS)*. https://community.owasp.org/attacks/xss
