<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Built a Product People Were Meant to Share. There Was No Share Button.
Slug:    nobody-could-share-a-finished-tour
Excerpt: I searched my own codebase for the feature my growth plan depended on
         and it did not exist. What the research says about why people share,
         why "time on site" is the wrong target, and the design that came out
         of taking that seriously.
Tags:    Product, Research, Growth, UX, Ethical Design, Wanderlust
-->

# I Built a Product People Were Meant to Share. There Was No Share Button.

I set a goal for my 360° learning product, and I wrote it down in plain words so I couldn't wriggle out of it later:

> The goal isn't to keep people on the site longer than they intended. The goal is for someone to enjoy a complete tour and share it with friends, family, or their community.

Then, before designing anything, I went to check what the app already did. I searched the whole codebase for any way a learner could share a tour they'd finished.

There wasn't one.

Not "it was clunky." Not "it was buried." There was no share control on any learner-facing screen. None.

There was worse news underneath. Testing the new share button turned up link previews that had been broken the whole time — every tour and every course anyone had ever shared previewed like this:

![A social preview card: blank cream with the words Tour not found centred on it](/blog/nobody-could-share-a-finished-tour/og-not-found.png)
*HTTP 200. A valid PNG. Correct dimensions. The wrong picture.*

When it should have looked like this:

![A social preview card showing the tour name, its location, a short description, and a 360 degree photograph of the venue bleeding off the right edge](/blog/nobody-could-share-a-finished-tour/og-with-photo.png)
*The same route after a one-word fix. The photograph is the peak scene the creator marked.*

What did exist: share tools for **creators**, so a museum can distribute a tour it made. And a completion certificate — which is a **PDF**, which requires an account and an enrolment, and which does not preview in a group chat. It downloads. Nobody has ever forwarded a PDF to their cousin and had it land well.

So the single mechanism my entire growth plan rested on was absent, and I'd been carrying the assumption for months.

That's the most useful thing that happened this month, and it took a search that lasted about a minute. Before designing the thing you assume is weak, go and confirm what's actually there. The gap is rarely where you think.

## Then I read the research, and it changed the design

I could have started sketching a share button. Instead I spent an afternoon on what's actually known about why people finish things and why they pass them on. Four findings, and each one changed a decision.

### 1. How long it lasted is not what people remember

The peak–end rule, from Kahneman and Fredrickson, holds that we judge an experience overwhelmingly by two moments: the most intense point, and the ending. Duration barely registers. A 2025 study traced this through actual tourists' trips and found peak and end moments shaping how the whole trip was rated afterwards (Lin, 2025).

This is a load-bearing finding for me, because it means my instinct to ignore "time on site" isn't just a values position — it's targeting the variable that memory ignores.

A shorter tour with a real climax and a designed ending will out-remember and out-share a longer one that merely stops. So the design work is *building to a moment and finishing properly*, not stretching the middle.

### 2. Awe is the emotion that travels

Berger and Milkman (2012) found that what drives sharing isn't whether content is positive — it's **arousal**. High-arousal emotions travel: awe, anger, anxiety. Low-arousal ones don't, including contentment and mild sadness. Separately, people share useful things for self-enhancement: passing something on says something about you.

Awe is the one high-arousal positive emotion that a 360° capture of a real place is uniquely good at producing. Standing inside a cathedral, a rainforest canopy, a chocolate workshop in Mexico City.

Which tells me exactly where the share moment belongs: attached to **the single most awe-producing scene in the tour**, not to a generic "you finished!" screen. A completion badge produces no arousal at all. A view does.

### 3. Visible progress helps — but only if it's honest

The goal-gradient effect: people push harder as a goal comes visibly closer, and showing progress raises completion. Loyalty cards exploit it by giving you two free stamps.

The same literature carries a warning I nearly skimmed: padded or misleading progress destroys trust. And I proved it to myself the hard way — my first progress indicator told visitors "Stop 9 of 9" the moment they arrived. (That's [its own story](/blog/stop-9-of-9).)

So: real counts, real denominators, no invented milestones.

### 4. People abandon these tours because they get lost

The most direct finding of the four. Research on virtual museums reports a significant mismatch between visitors' mental model of the navigation and how it actually works — people assume they can click anywhere to move there, and can't (Rahaman et al., 2023). Disorientation and visual overload cause people to stop before finishing.

This reordered my whole plan. No amount of clever share design helps someone who has already left because they didn't know where they were.

## Three directions, and the one I picked

I worked up three ways to build this, sitting at different points on one axis — how much the product decides versus how much the visitor decides.

**The Itinerary.** You plan a route, then walk it, always knowing where you are and what's left. Strongest on orientation. Its share artifact — a map of the route you took — is a bit niche.

**The Passport.** Every completed tour stamps a passport. Discovery is driven by the gaps in your own collection. Strong on sharing, because a passport says something about its owner.

**The Guided Story.** The tour is authored like a short film: chapters, a creator-marked climax, a designed ending. The share artifact is a postcard from the peak moment, with a note you write to a specific person.

Here's the awkward part. The direction that scored best on *sharing* — the Passport — is the one that fights my stated goal. Collection mechanics pull towards "collect them all," which is the time-extraction I explicitly ruled out. It also needs a catalogue deep enough that an empty slot reads as an invitation rather than as evidence I have nothing.

So I didn't pick one of three.

**Orientation isn't a direction — it's a prerequisite.** Finding 4 says getting lost is the leading cause of abandonment, so the "where am I / what's left" work goes underneath everything, regardless. Then the Guided Story is the experience and share model, because findings 1 and 2 together say the share moment belongs at the emotional peak with a personal message attached — which is what a postcard is and what a badge isn't.

The Passport goes to a backlog with **written numeric conditions** for revisiting. The one that matters most: at least 25 people who've completed two or more tours *without being prompted*. If nobody takes a second tour on their own, adding collection mechanics doesn't serve a behaviour — it manufactures one. That's the line I don't want to cross, and putting a number on it means I can't talk myself across it later.

## The thing that makes it buildable

Two facts made this much cheaper than it looked.

**Dynamic share images already work.** The app already generates custom preview images — the picture that appears when you paste a link into a chat. Three of those routes exist. So a personalised postcard is an established pattern, not new infrastructure.

**Anonymous progress already works.** Part of the app already tracks people by a random per-browser key rather than an account. That matters enormously for sharing, because the biggest leak in any share flow is the recipient hitting a sign-up wall. Someone who receives a postcard should see the thing, immediately, with no account.

I'd initially assumed that mechanism could feed the whole feature, and I was wrong in a way worth admitting: those anonymous keys aren't connected to user accounts at all, so they can't populate a signed-in person's history. Useful for the recipient's side, useless for the sender's. Checking that assumption before building on it saved a rewrite.

## What I'm measuring

Completion rate per tour. Shares per completion.

**Not session duration.** By finding 1, that number doesn't answer the question I'm asking, and by my own stated goal, optimising it would be optimising the wrong thing on purpose.

I'll need to add a "tour completed" event to measure any of it, because — of course — the app doesn't currently record that either. It records that you *left*, and how many scenes you saw, and leaves the arithmetic to nobody.

Which is the same lesson as the share button, one layer down. The thing you assume is being tracked is worth thirty seconds of checking.

## References

Berger, J., & Milkman, K. L. (2012). What makes online content viral? *Journal of Marketing Research, 49*(2), 192–205. https://journals.sagepub.com/doi/10.1509/jmr.10.0353

Kahneman, D., & Fredrickson, B. L. (1993). When more pain is preferred to less: Adding a better end. *Psychological Science, 4*(6), 401–405.

Kivetz, R., Urminsky, O., & Zheng, Y. (2006). The goal-gradient hypothesis resurrected: Purchase acceleration, illusionary goal progress, and customer retention. *Journal of Marketing Research, 43*(1), 39–58.

Lin, Y. C. (2025). Peak–end rule? Tracing tourists' experience and exploring their impact on retrospective evaluation. *Journal of Hospitality & Tourism Research*. https://journals.sagepub.com/doi/10.1177/10963480251337338

Rahaman, H., et al. (2023). *Analyzing behavior and user experience in online museum virtual tours*. arXiv. https://arxiv.org/abs/2310.11176
