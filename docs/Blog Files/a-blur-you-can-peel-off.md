<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Blur You Can Peel Off Is Not a Blur
Slug:    a-blur-you-can-peel-off
Excerpt: A 360 photo of a house sees everything, including people who never
         agreed to be in an ad. Many tools hide them with a blur anyone can
         remove in seconds. How my real estate tours hide people for real, the
         hole I found in my own version while writing this, what I did about
         buyers who saw the room first, and the questions to ask a vendor.
Tags:    Buying Software, Privacy, Plain Talk, RealEstate.WitUS
-->

# A Blur You Can Peel Off Is Not a Blur

A normal photo shows what the camera points at. A 360 photo shows everything around it, all at once.

That is great for selling a house. A buyer can stand in the kitchen and turn around. But it also catches things nobody meant to show:

- the person holding the camera,
- a family picture on the fridge,
- a neighbor walking past the window,
- the tripod on the floor.

Those people never agreed to be in an ad.

## The tool

In my real estate tour app, the agent can open any room and hide things before buyers see it: faces, boxes drawn over anything else, and the floor under the camera, where the tripod stands. The floor can even get a patch with the agency's logo on it.

I compared every way to do this, with what each one really hides, in [Seven Ways to Hide Someone in a 360 Photo](/blog/seven-ways-to-hide-someone-in-a-360-photo). This post is about one trap that sits under all of them.

## The easy way, and why I did not use it

Many photo services can blur a photo "on the fly." The blur is not in the photo. It is an instruction written into the photo's web address, like a note that says "blur this part before you show it."

The problem: anyone can read that address. Delete the note, and the original photo comes back, clear as day. It takes a few seconds and no special skill.

So the blur looks like protection. It is really a sticker you can peel off.

## What we do instead

When an agent saves a privacy edit, the app makes a **brand-new copy** of the photo with the blur painted in. Buyers only ever get that copy. There is no note to delete, because the blur is part of the picture.

The original stays in the agent's account, and buyers are never sent its address. That way the agent can change their mind:

- the next edit starts from the clean original, so blurs do not pile up,
- clearing every box puts the original back.

## I almost made the same mistake

While writing this post, I checked each claim against the code. One did not hold up.

The edited copy needs a name. The app named it after the original, plus the word "private" and a few letters on the end. So a clever person could look at the copy's web address, delete the ending, and load the original. The same peel-off problem, one step removed.

It is fixed. The copy's name is now made from letters that say nothing about the original. And there is a test that fails if a copy's name ever points back again.

## Then I went one step further

Fixing the name raised a harder question. What about buyers who saw the room **before** the agent hid anything? Their browsers were sent the clear photo's address. Could they open it again later?

They could. So now, the first time an agent hides something in a room, the app moves the original to a new, random address that is never sent to a buyer. The old address stops working within minutes, along with every resized version of it.

Two more rules came with that:

- When an agent changes an edit, the old edited copy is deleted. It might show something the new edit hides.
- If someone asks to be removed completely, the agent can tick **Also delete the original for good**. Then the edited photo is the only copy left.

One honest limit remains. If a buyer saved the photo or took a screenshot, nobody can call that back. So the editor still says it plainly: hide things before the room goes live.

## Before and after photos too

The tours can also show a room at two times, like a kitchen before and after a remodel. Old photos are where people show up most: the last owners, their kids, the work crew.

So as of this week, the same tool works on "before" photos too.

One more rule: the tool only hides things. It never paints in a fake wall or fake furniture. Nothing made up by a computer reaches a buyer.

## The question to ask

When a vendor says their software can blur faces, ask:

> "After I blur something, can anyone get the clear photo back from what the public sees?"

Then ask them to show you the web address of a blurred photo. If the blur is spelled out in the address, or the original's name is, you have your answer.

And one more:

> "If someone saw the room before I blurred it, can they still open the clear photo?"

## What this means when you hire

Two questions for anyone who builds features like this:

- "If we blur a face in a photo, where does the original live, and who can reach it?"
- "How would you check that a privacy feature really protects someone, and not just looks like it does?"

A good answer talks about who can reach what. A weak answer only talks about how the blur looks.

## Where this stands

The tool is built and tested. It is waiting for its first real house, which I am picking now.
