<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Photographed My Whole App and the Best Part Was Missing
Slug:    the-globe-was-missing
Excerpt: Before redesigning my app I took 52 screenshots of the old one. The
         spinning globe on the homepage came out as a black rectangle in every
         single shot, and my first run silently lost 18 of the 52 pages. Two
         lessons about trusting automated evidence.
Tags:    Testing, Automation, Screenshots, Engineering Judgment, Beginners, Wanderlust
-->

# I Photographed My Whole App and the Best Part Was Missing

I'm redesigning an app. Before changing anything I wanted a photographic record of the old version — partly to make before-and-after videos, partly because once the new design ships, the old one is gone and reconstructing it means digging through history.

So I wrote a small program to do it. Open every important page, at phone size and at laptop size, in light mode and in dark mode, and save a full-page screenshot of each. Fifty-two images.

It worked on the first try. Fifty-two files, no errors.

Both of those sentences turned out to be misleading, in two different ways, and the two ways are worth separating because they're opposite kinds of failure.

## Failure one: it lied about succeeding

The best thing on the homepage is a spinning 3D globe. You drag it, it turns, pins mark real places you can step into. It's the single most distinctive thing in the product.

In all four homepage screenshots, it was a black rectangle.

No error. The program reported success. The file was there, the right size, the rest of the page perfect. Just a void where the globe should be.

Here's why. My screenshot program waits for the page to be "done loading" before it shoots. That sounds like it means what you'd want. It doesn't.

"Done loading" means the network went quiet — every file the page asked for has arrived. But the globe isn't a file. It's a *drawing*, made by your computer's graphics chip, at runtime, using the browser's 3D system. The sequence is:

1. The page loads. (Network quiet. My program thinks: done!)
2. *Then* the 3D system starts up.
3. *Then* it fetches the Earth texture — the actual photograph of the planet wrapped around the sphere.
4. *Then* it draws the first frame.

My program was shooting between steps 1 and 2. It photographed a canvas that existed and was empty, which is exactly what an empty canvas looks like: a black rectangle.

The fix is small — look for a drawing surface on the page, and if there is one, wait a few more seconds for it to actually paint. What I want to point at is not the fix but the failure mode.

**The program did not fail. It succeeded at the wrong thing.** It was asked "is the network quiet" and answered correctly. I had assumed that question was a proxy for "does the page look right," and it isn't.

Automated checks are enormously valuable and they all have this property. They answer the question you actually asked. The gap between that and the question you meant is invisible until you look at the output with your own eyes.

I only caught it because I opened one of the 52 files and looked at it. If I had trusted the "52 captured, 0 failed" line, I'd have shipped a redesign with a before-set that was missing the thing I most wanted to show.

## Failure two: it did fail, later, for a boring reason

Then I improved the program and ran it again. This time it told me the truth and the truth was worse: **34 captured, 18 failed.**

Every failure said the same thing — connection refused. Halfway through, the server just stopped answering.

The server's own log explained it in one line:

> Server is approaching the used memory threshold, restarting...

Here's the boring, real cause. There are two ways to run a web app while building it. **Development mode** is built for editing: change a file, see it instantly. To be that fast, it doesn't prepare pages in advance — it builds each page the first time somebody asks for it, then keeps a lot of machinery in memory to stay responsive.

That's perfect when you're working on one page. It is exactly wrong when a robot marches through fifty distinct pages it has never seen, forcing each to be built fresh. Memory climbed until the server hit its own limit and restarted itself — sensibly! — and every request during the restart got refused.

**Production mode** is the opposite: everything is pre-built once, then served. It's what real visitors get.

So there were two fixes, and only one of them was code:

- Retry when the connection drops, since a restart is a couple of seconds and giving up on 18 pages over it is silly.
- **Stop taking the pictures in development mode.** Build it properly first, then photograph that.

The second one was the real fix, and I should have started there. Development mode doesn't just crash more — it *looks different*. It runs extra debugging tools, and it skips image optimisation. So even the 34 that succeeded were photographs of something subtly unlike what a visitor sees.

I was making a permanent visual record of my product using the version of my product that is explicitly not for visitors.

The rerun against a real build: 52 for 52, no failures, globe fully rendered — clouds, oceans, continents.

## The thing both failures share

Failure one lied about success. Failure two admitted failure. Very different experiences, same underlying mistake: **I trusted a measurement without checking that it measured what I meant.**

"Network is quiet" isn't "the page looks right."
"The program exited cleanly" isn't "you have what you wanted."
"It works on my machine in development" isn't "this is what people see."

You don't fix this by being smarter about the measurement. There's always a gap. You fix it by looking at the actual output, with your own eyes, once — early enough that it costs you a rerun instead of a redesign.

It took me about ninety seconds to open a PNG and notice the globe was missing. That is the cheapest ninety seconds I spent all week.

## A footnote about port numbers

One more small thing, since it's the same species.

I run several apps side by side on my laptop. Web apps on a computer each claim a numbered slot — a "port." Almost every framework in existence defaults to slot 3000.

Which means when I have four apps open, three of them are on 3000-and-something and the one that got there first owns 3000. Any tool of mine pointing at "port 3000" gets whichever app won the race that morning.

My testing tools had already been moved off 3000 for exactly this reason. But one configuration value hadn't: the app's own idea of its address in development still said 3000.

That one doesn't crash either. It just means sign-in redirects can land in a *different app*, and you're left staring at a working screen wondering why you're logged out.

So I pinned this app to one number everywhere — the app, the tests, the accessibility checks — and left the production setting alone, since production hosts assign the number themselves and hardcoding one there would override them.

Boring, twenty-minute fix. But it's the same lesson a third time: a default that's correct in isolation can be wrong in your actual environment, and it will fail quietly rather than loudly.
