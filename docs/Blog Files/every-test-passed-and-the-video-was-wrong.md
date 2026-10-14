<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Every Test Passed. The Video Was Still Wrong.
Slug:    every-test-passed-and-the-video-was-wrong
Excerpt: Our software said the work was fine. It wasn't. The words in the video
         landed on the wrong screen, and nothing warned us. Here is how that
         happens, and the one question that catches it before your customers do.
Tags:    Buying Software, Hiring, Quality, Plain Talk, WitUS
-->

# Every Test Passed. The Video Was Still Wrong.

I make short videos that show people how to use my apps. A robot does the clicking. It opens the app, clicks the buttons in order, and records the screen. Later I record my voice on top.

I built that robot so the videos would never go stale. When a button moves, I run the robot again and get a fresh video that day.

Last weekend I found out the videos were wrong. Not a little wrong. Every spoken line landed about one second late, on the wrong screen. I would have been talking about the search box while you were looking at the home page.

Here is the part worth your time: **the software said everything was fine.** All the checks were green. Nothing failed. Nothing warned me.

## What actually went wrong

There is a setting in my recording tool called "slow motion." It does what it sounds like. It slows the robot down so a person can follow along.

I had it turned on. It seemed obviously right. Who wants a video where the mouse moves too fast to see?

But that setting slows down more than the mouse. The same channel that carries "click here" also carries the pictures of the screen. Turning on slow motion choked that channel. Instead of thirty pictures a second, I was getting a handful. Whole seconds of the recording simply never existed.

So the recording and my notes no longer matched. My notes said, "step two starts at four seconds." In the recording, step two was somewhere else. The tool that was supposed to make the video clearer is what broke it.

## Why no test caught it

This is the part I want you to carry into your next vendor meeting.

The tests asked, "did the robot finish?" The answer was yes. The tests asked, "was a video file made?" Yes. "Did the app show the right pages?" Yes.

Nobody asked, "does the voice land on the right picture?" That is a question about the **finished thing**, and it is much harder to ask. So it was not asked. Green checks everywhere, and a broken product.

The fix was to stop trusting the clock. The robot now flashes the screen bright pink for a quarter of a second between steps. That flash is in the recording itself. The tool that stitches the video finds the flashes and cuts there. If it cannot find the right number of flashes, it refuses to make a video at all.

That last part matters more than the flash. **It fails loudly instead of quietly.** A tool that guesses when it is confused will hand you something wrong and look pleased about it.

## The question to ask

When someone shows you a dashboard full of green checks, ask this:

> "If this were wrong, which of these checks would turn red?"

If the honest answer is "none of them," you have not bought quality. You have bought a status light.

Ask the same question about work you pay for. I would rather hear "we test that the invoice total matches the line items" than "we have ninety tests." Ninety tests that all check the easy half is not safety. It is paperwork.

## What this means when you hire

I have started listening for one habit. When someone says a job is done, do they describe **the checks that passed**, or do they describe **the thing itself**?

The first sounds like: "the build is green, all tests pass."
The second sounds like: "I watched the video and the words matched the screen."

The second person finds this bug. The first person ships it and is genuinely surprised later.

You do not need to understand the technology to hear the difference. Ask them to tell you about a time their tests passed and the work was still wrong. Everyone experienced has that story. People who do not have one have usually not looked.

## What it cost me, and what it would have cost me later

Finding it took an afternoon. I had not recorded any voice yet, so I lost nothing but time.

If I had found it a week later, I would have re-recorded about forty voice tracks, and I would have found out because a customer told me my own tutorial was confusing. That version of this story is not a blog post. It is an apology.

Cheap to catch early. Expensive to catch late. Embarrassing to have a customer catch for you. That order never changes, in any business.

## One habit worth stealing

Look at the finished thing yourself, at least once.

Not the report about the thing. Not the green light. The actual video, the actual invoice, the actual email your customer receives. I opened one frame from the middle of each caption and looked at it with my own eyes. That is how I know it is right now, and it is the only reason I know.
