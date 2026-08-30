<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Two Console Errors That Were Not the Bug
Slug:    two-console-errors-not-the-bug
Excerpt: A feature was broken and the browser console had two angry red errors
         in it. One was my code behaving correctly. The other was physically
         impossible for my code to produce. Chasing both is what finally
         uncovered the real problem, which the app had been hiding all along.
Tags:    Debugging, Service Workers, Browser Extensions, Error Messages, Beginners, Wanderlust
-->

# Two Console Errors That Were Not the Bug

A feature in my 360° tour app stopped working, and the person who found it did the responsible thing. They opened the browser's developer console — the panel where a web page reports its problems — and sent me what was in it.

Two errors, both red, both alarming, both real.

Neither was the bug.

Working out *why* neither was the bug took a while, and the technique for doing it turns out to be more useful than the fix. So here are both errors, what they actually were, and the question I now ask first.

## Error one: `no-response`

The first message came from something called a service worker.

If you've never met one: a service worker is a small program the browser keeps running *beside* your web page. The page asks for things — an image, some data, the next screen — and the service worker sits in the middle and decides how to answer. Think of a receptionist who intercepts every request before it leaves the building. Sometimes she has the answer in a drawer and hands it straight back, which is why apps can work on a plane. Sometimes she has to go outside and fetch it.

For each kind of request you tell her a policy. Mine, for the requests that were failing, was **NetworkOnly** — never use the copy in the drawer, always go outside and get the fresh one.

That's the right policy for that data. It has to be current. A stale copy is worse than nothing.

But it has an obvious consequence I hadn't thought about properly: if she goes outside and the street is briefly closed, she comes back with nothing. And "nothing" is literally what she reports. `no-response`.

So error one was **my code, behaving exactly as designed, on a momentary network blip.** Correct policy. Genuinely terrible failure mode — a two-word status with no indication of which request, which page, or whether it mattered. Someone reading it has no way to know whether they're looking at a catastrophe or a hiccup.

I fixed the failure mode rather than the policy. It still refuses to serve stale data, because it should. It now says what it was fetching and that the network was unavailable, in words, in a way that reads as "the connection dropped" rather than as a crash.

That's the whole fix. The behaviour didn't change; only the legibility did. Which is, I've noticed, most of what I do.

## Error two: `Unchecked runtime.lastError: Could not establish connection.`

The second error is more interesting, because it wasn't mine and *couldn't* have been.

Here's how you can tell, and you don't need to be a programmer to follow it.

That message comes from `chrome.runtime` — an interface the browser provides **only to extensions**. Your ad blocker, your password manager, your grammar checker, the thing that saves recipes. Extensions have two halves: one half injected into the page you're looking at, and a background half running somewhere in the browser. The two talk to each other. When the background half has been shut down — browsers put idle ones to sleep constantly — the injected half calls out and gets nobody. "Could not establish connection."

An ordinary web page has no access to that interface at all. My code, or any page's code, cannot emit that error even deliberately. It is a message from one part of somebody else's software to another part of somebody else's software, printed in my window because that's the window it happened in.

And that's the trap. **The console is not your console.** It is a shared room where your code, the browser itself, every extension the visitor has installed, and any third-party script all shout at once, in the same font, in the same red. There is no label saying who is speaking.

It's a hotel lobby. An alarm goes off and you assume it's your room.

## The three questions I ask now

I don't want to turn this into a checklist post, but there are genuinely only three things worth asking, and they're fast.

**Does it name a file I wrote?** Expand the error and look at where it came from. If every frame points into an extension, or into a browser internal, it isn't yours. This settles most of them in ten seconds.

**Does it survive a clean window?** Open the page with extensions disabled — a guest profile or a private window will usually do it. Errors that vanish were never about your app. This is the single highest-value habit I picked up, and it costs nothing.

**Does it happen at the moment the thing fails?** An error that's been sitting in the console since page load, while the failure happens on a click thirty seconds later, is background noise that happened to be nearby. Clear the console, do the failing action, look at what's new. Only that.

None of this is clever. All of it is skipped when you're annoyed and the thing is red.

## Why chasing the wrong errors still worked

Here's the part I didn't expect.

Both errors were dead ends. Neither one explained the failure. And yet chasing them is exactly what found the real problem — because in the course of asking "why is this person reading extension errors in the first place?", the answer turned out to be: **because my app gave them nothing else to read.**

The feature was failing with a specific, correct, diagnosable server-side error. The interface was catching that error, discarding it, and showing "Something went wrong. Please try again."

Which is why someone went to the console. Nobody opens developer tools for fun. They open them because the product refused to say what happened, and the console is the only other place to look. And the console — being a shared room — always has something in it.

So the sequence that cost the most time was: real failure, hidden by a friendly message, which sent a person to a shared log full of other people's problems, which offered two plausible-looking suspects, both innocent.

The actual bug was found in four minutes once the app was made to repeat what the server had said.

## What I'd take from this

**Console noise is not evidence.** It's ambient. Every busy browser has some. Its presence during a failure means nothing until you've established whose it is.

**Correct behaviour with an illegible failure mode is still a defect.** The NetworkOnly policy was right and I kept it. `no-response` was indefensible and I didn't. Those are separate decisions and it's worth noticing when you're conflating them.

**If your users are reading the console, that's the finding.** Not the errors they found there — the fact that they had to go. Every minute someone spends in developer tools on my product is a minute my product declined to explain itself, and the noise they'll wade through while they're in there isn't even mine to fix.
