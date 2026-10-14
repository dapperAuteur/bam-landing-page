<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   We Almost Put Real Students in a Public Video
Slug:    we-almost-put-real-students-in-a-tutorial
Excerpt: The plan was a help video for teachers. The screen it filmed held real
         children's names and a working class code. No test can catch that. Here
         is what did, and the three questions that keep it from happening to you.
Tags:    Privacy, Buying Software, Hiring, Plain Talk, WitUS
-->

# We Almost Put Real Students in a Public Video

I was making help videos for my apps. Short ones. "Here is how you add a student to your class."

A robot does the clicking and records the screen. I planned to post the videos on YouTube and on the help pages inside the app.

The video worked. It clicked the right buttons in the right order. Then I looked at what was on the screen.

The first thing it filmed was my own teacher page. That page lists every class I teach. For each class it shows the name of the class, how many students are in it, and the **code students type to join that class.**

Then it opened the first class on the list and filmed the roster. Real first names. Real last initials. Children.

None of that was going to YouTube. But nothing in my software was going to stop it either.

## Why no tool caught this

Software can check that a button exists. It can check that a page loaded. It cannot look at a screen and think, "hold on, whose child is that?"

Every check passed, because the video did exactly what I asked. The problem was not a bug. The problem was **what I pointed the camera at.**

That is the part people miss when they buy software. The worst mistakes are often not broken code. They are a correct system, pointed at the wrong thing, by someone moving fast.

Two more details made it worse:

- The class code was **live**. Anyone who paused the video could type it in and join a real class full of children.
- I was going to post it in two places at once. Once it is on YouTube, you do not get it back. You can delete the video. You cannot delete the copy somebody saved.

## What fixed it

Not a clever tool. A separate account.

I made a demo teacher account. It teaches exactly one class, and that class has exactly one student, and that student is a fake account I created for this purpose. Now, when the robot films the teacher page, the only thing on it is the demo class. There is nothing else to leak.

Then I added a rule to the robot: **refuse to record unless it is told, by name, which demo class to film.** If nobody tells it, it stops and says so. It is not allowed to grab "the first class it finds" any more. That is the behavior that would have filmed real students.

There is a pattern here I use a lot now. Do not ask software to be careful. Software is not careful. Take the sensitive thing out of reach, so carelessness has nothing to grab.

## Three questions worth asking

You do not need to know how any of this is built to ask these.

**1. "Whose real data shows up in your demo?"**
Ask any vendor who demos software with data on screen. Screenshots in a sales deck, a help video, a training webinar. If the answer is "oh, that is a real customer's account," that tells you how they treat yours.

**2. "What appears on screen that would still work if someone copied it?"**
That is what a class code is. Also invite links, meeting codes, coupon codes, account numbers. A name is embarrassing. A working code is a door.

**3. "Who looked at this before it went public, and what were they looking for?"**
"Our tests passed" is not an answer to this question. The tests passed here too.

## What this means when you hire

I have stopped being impressed by people who move fast. I have started listening for who asks, "whose data is this?"

That question is a habit, not a skill. You can hear it in an interview. Describe a task to a candidate: "record a video of the class roster screen." The person you want says some version of, "whose roster? Can we make a fake one?" before writing anything.

The person who does not ask is not careless on purpose. They are focused on the task you named. That is exactly how good people cause privacy problems. Your job, when you hire, is to find out who carries that question around with them.

## The honest part

I did not catch this because I am careful. I caught it because I was reviewing the work line by line, on the way to something else, and I read the step that said "open the first roster."

If I had been in a hurry, I would have posted it. That is why I no longer rely on catching it. The demo account exists so there is nothing to catch.

Build the thing that makes the mistake impossible, not the thing that makes it unlikely. Unlikely happens all the time.
