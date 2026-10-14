<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Box Covered Less Than I Drew
Slug:    the-box-covered-less-than-i-drew
Excerpt: Sometimes a privacy box in my 360 photo editor missed an edge of the
         person it was meant to hide. The cause was two decimal places. Here is
         how I proved it, what I changed, and why you should test with odd
         numbers, not round ones.
Tags:    Privacy, 360 Photos, Cloudinary, Quality, Buying Software, Wanderlust
-->

# The Box Covered Less Than I Drew

In Wanderlust, you hide a stranger in a 360° photo by drawing a box over them. When you save, the box is blurred or pixelated into a new copy of the photo. I explained how that works in [I Was in Every 360 Photo I Took](/blog/i-was-in-every-360-photo-i-took).

Then I noticed something. Sometimes the box did not cover what I had drawn. A strip along one edge stayed sharp.

"Sometimes" is a hard word in a bug report. It usually means the cause is hiding in the numbers. This time it was.

## How the edit is made

Wanderlust does not blur the photo itself. Cloudinary does. Cloudinary is the service that stores my photos and edits them on request.

The request goes in the photo's web address. You add a short instruction, which Cloudinary calls a transformation (Cloudinary, n.d.-b). One of them pixelates "the region of an image specified by x, y, width and height" (Cloudinary, n.d.-a). Here x is how far from the left edge the box starts, and y is how far down from the top.

Cloudinary takes those numbers two ways. You can give pixels, the tiny dots a photo is made of. Or you can give a share of the image, "a float value corresponding to a percentage in relation to 1.0" (Cloudinary, n.d.-c). A float is just a number with a decimal point. So `x_0.25` means a quarter of the way across.

My app sent shares, with four decimal places. A box might start at `x_0.4778`.

## Cloudinary read two

Cloudinary read only the first two decimal places. `x_0.4778` became 0.47. The extra digits were dropped, not rounded.

So every box was moved a little left and a little up, and shrunk. The left and top edges could land up to 1% of the photo short. The right and bottom edges could land up to 2% short, because the size was cut as well as the starting point. That sounds small. But a 360° photo is stored flat, as a panorama twice as wide as it is tall. On a panorama 5900 pixels wide, 1% is 59 pixels, about 3.6° of the view. In my test, one box's right edge stopped 37 pixels short on a photo 3000 pixels wide. That is enough to leave an ear or a shoulder in plain sight.

It also explained "sometimes." A box at a round spot, like 0.25, landed exactly. Every other box missed.

## How I proved it

I did not want to guess, so I tested on my live Cloudinary account with three test images.

First I asked for a pixelated box that started at 0.6199 across and down, and was 0.1999 wide and tall. It should have run from 0.6199 to about 0.82. Cloudinary pixelated from 0.61 to 0.80.

Then I asked for a box in whole pixels: `x_1800,y_900,w_600,h_300`. It landed exactly.

In a close crop, sharp lettering inside the area I had asked for came back untouched. In the editor, the pixelation sat 20 to 40 pixels left of each dashed outline.

Cloudinary's reference explains pixels and shares. On the pages I read, it says nothing about how many decimal places it keeps (Cloudinary, n.d.-c). The two decimal limit is what I measured. And the reference's own example uses a round number, `y_0.75`, to pixelate "the bottom quarter of an image" (Cloudinary, n.d.-a). A round number like that would never show this bug.

## What I changed

- **Whole pixels.** Boxes are now sent in whole pixels of the photo, grown outward. Rounding can make a box a hair bigger, never smaller.
- **A safe fallback.** If the app does not know the photo's size in pixels, it still sends shares. But it rounds them outward, so a box never covers less than was drawn.
- **The bottom patch.** The patch that covers the floor under the camera had the same flaw. It came out slightly too short. It is sized up now.

## A second bug, found on the way

While testing, I found another problem. After you pressed **Preview the edit**, the dashed outlines and drag handles vanished. It happened on every scene with hotspots, the clickable markers placed in a tour.

So creators were adjusting boxes they could not see, over a preview that no longer matched. Now the outlines stay. And a note under the viewer says when the preview on screen is out of date.

## If you saved photos before the fix

Photos saved before the fix still carry the old, slightly short cover. They need saving again.

Open each one's **Hide people and gear** page. Your boxes are still listed. Press **Preview the edit**, check it, and save. The edit is rebuilt from the original, so blur never stacks on blur. If the page says the original was deleted, your old boxes will not be listed. Draw new boxes over anything the old cover missed, and save. Boxes removed with generative AI were already sent in pixels, so they are fine.

## Almost right is a failure

For most features, close is fine. A button a few pixels off still works.

Privacy is different. A box that covers most of a face, but not its edge, has not hidden anyone. "Almost right" privacy is a failure.

Round numbers hide this kind of bug. If I had tested only with a box at 0.25, I would have seen a perfect result and moved on.

## The questions to ask

If a vendor says their tool hides people, ask:

> "Draw a box at an odd spot, not a round one. Then zoom in on its edges in the saved file."

Look at the saved file, not the preview. The saved file is what visitors get.

When you hire someone to build anything that measures, ask: "What numbers did you test with?" Strong builders test awkward values on purpose: odd sizes, the edges, the last pixel. A weak answer is a list of round numbers.

## References

Cloudinary. (n.d.-a). *pixelate_region*. https://cloudinary.com/documentation/transformation_reference_e_effect_pixelate_region

Cloudinary. (n.d.-b). *Transformation URL API reference*. https://cloudinary.com/documentation/transformation_reference

Cloudinary. (n.d.-c). *x, y (x & y coordinates)*. https://cloudinary.com/documentation/transformation_reference_x_y_x_y_coordinates
