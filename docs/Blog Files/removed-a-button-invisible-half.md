<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Removed One Button. The Half That Mattered Was Invisible.
Slug:    removed-a-button-invisible-half
Excerpt: My Spanish translation is real but unfinished, so I hid the language
         switcher. The button was the easy half. The half that actually
         mattered was a line of code nobody sees, telling Google to send
         Spanish speakers to half-English pages.
Tags:    Internationalisation, SEO, Accessibility, Engineering Judgment, Beginners, Wanderlust
-->

# I Removed One Button. The Half That Mattered Was Invisible.

My app ships in English and Spanish. The Spanish is real — hand-translated by a person, because I have a rule against machine-translating anything a learner reads. But it's incomplete. As I've added features, new text has landed in English first and gone into a queue waiting for a human. The help centre, some of the creator tools, a few explanatory paragraphs.

So the app is in a specific state: mostly translated, visibly not finished.

I decided to stop advertising Spanish until it's done. The instruction I gave myself was simple: *remove the Español button.*

That took about a minute. The part worth writing about is what I found next to it.

## Two doors, one of them with no handle

There are two ways a stranger discovers that my app speaks Spanish.

**The first is the button.** It's in the header. You click it, you get Spanish. Visible, obvious, and the thing anybody would name if you asked how someone switches language.

**The second is a line of code you will never see**, in the invisible part of every page that only machines read. It says, roughly:

> This page also exists in Spanish, at this address.

That instruction is called an `hreflang` tag, and its audience is search engines. It's how Google knows to offer the Spanish version to someone searching in Spanish. It is, in practice, how most people who aren't already on your site would ever arrive at a translated page.

I'd asked myself to remove the button. If I'd done only that, here is what would have remained true: nobody browsing my site could switch to Spanish, and Google would have carried on confidently routing Spanish-speaking searchers directly into my half-finished Spanish pages.

The visible door would be shut. The invisible one would be wide open and busier.

## Why that's the worse half

Think about who arrives through each door.

Through the button: someone already on my site, in English, who chose to switch. They have context. If a paragraph is still in English they'll shrug — they can read the English page they just came from.

Through search: someone who has never seen my product, searching in Spanish, landing cold on a page that is *partly in a language they may not read*. That's their entire first impression.

And the audience I care most about for this — museums, cultural institutions, Spanish-speaking partners evaluating whether this is a serious product — is exactly the audience most likely to find me by searching, and least forgiving of looking unfinished.

There's a second thing that makes the invisible half worse: **I would never have noticed.** A missing button is a thing you see every time you load your own site. A search engine quietly sending people to a page you'd rather they didn't see produces no signal at all on your end. No error, no complaint, nothing in a log. It would have gone on for months and I'd have concluded Spanish speakers weren't interested.

## What I actually did

Both halves now come from a single switch: a list of which languages are finished enough to advertise. Right now that list contains English.

The header button reads it. The `hreflang` tags read it. When Spanish is ready, I add one word to that list and both come back at once.

That's deliberate. If they were two separate settings, some future version of me would flip one and forget the other, and I'd be right back in a state where the visible and invisible answers to "do you speak Spanish?" disagree. They're one decision, so they're one switch.

## What I did *not* do

Spanish still works.

`/es/` pages still load, still render, still return a perfectly good page. Every existing link and bookmark works. My automated accessibility tests still check both languages on every change, so the Spanish version can't silently rot while it waits.

The distinction is: **withdrawn from promotion, not deleted.**

That mattered enough to be explicit about it, because "hide Spanish" could reasonably have meant "turn Spanish off," and turning it off would break links that already exist in the world — including any a partner has already shared. Nobody who has the address loses anything. I've only stopped handing the address to people who don't.

That's a distinction worth having in general: *not promoting something* and *removing it* look similar from the inside and are completely different from the outside.

## The literal instruction versus the actual goal

The thing I keep coming back to is the gap between what I asked for and what I meant.

**Asked for:** remove the Español button.
**Meant:** stop showing people unfinished Spanish until it's finished.

The button was maybe a third of the goal. Doing exactly what I said would have left me confident the job was done, with the larger part of the problem untouched and no way to notice.

I don't think the lesson is "interpret instructions liberally" — that's how scope quietly triples. The lesson is narrower: **when you're asked to hide something, find every route to it, not just the one you were pointed at.** Doors, links, search engines, old bookmarks, sitemaps, anything that got cached. Then decide which ones to close, deliberately, and say which ones you left open and why.

Half-hidden is a genuinely bad state. It has the cost of hiding — nobody can find the feature — and none of the benefit, because the people you most wanted not to see it still walk straight in.
