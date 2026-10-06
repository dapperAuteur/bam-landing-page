<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Was in Every 360 Photo I Took
Slug:    i-was-in-every-360-photo-i-took
Excerpt: The selfie stick vanished from my 360 photos. I did not. Why a 360
         camera can never leave you out, what hiding someone really takes, and
         the tools I built into Wanderlust to do it, including one that breaks
         my own no-AI rule on purpose, with a label.
Tags:    360 Photos, Privacy, Cloudinary, Beginners, Wanderlust
-->

# I Was in Every 360 Photo I Took

Some of my 360° tours were shot with an Insta360 camera on a long selfie stick. The stick is the clever part. Insta360 sells it with what it calls an invisible selfie stick effect (Insta360, 2026). Look down in the finished photo and the stick is gone.

I was not.

Look straight down in a scene I shot that way and there I am, right under the lens, holding a stick that is no longer there. The camera hid the stick. Nobody had told it to hide me.

So I asked a simple question. Can I keep part of the view away from visitors? The honest answer has two halves, and the difference between them matters more than I expected.

## Why a 360 camera cannot leave you out

A normal camera points one way. You stand behind it, and you are not in the picture.

A 360° camera points every way at once. There is no behind. Whatever is around the lens ends up in the shot. That includes the person holding it, the tripod under it, and anyone who walks past while it fires.

The usual answer is to leave the room. Start the camera from your phone, or use a timer, and step out of sight. That works when you can do it. On a stick held over your head, you cannot.

## Hiding something is not the same as removing it

Here is the part that changed how I built this.

There are two ways to keep a visitor from seeing something in a 360° photo:

1. **Stop them looking at it.** The viewer will not turn that far.
2. **Take it out of the photo.** The pixels change.

The first one is easy, and it is enough for a tripod. But the photo still travels to the visitor's browser, whole. Anyone who saves it can see everything the viewer was hiding.

So if you are hiding a tripod, the first way is fine. If you are hiding a person who never agreed to be in your tour, only the second way counts.

## What I built

Every scene in Wanderlust now has a page called **Hide people and gear**. It holds both halves.

**A limit on how far down visitors can look.** One checkbox and one slider. The viewer stops before the bottom of the photo, where the tripod and the person holding the camera always are. It allows for zoom, so the bottom edge of the screen never sneaks past the line (Sorel, n.d.). It works on 360° video too. Visitors lose the floor, and the photo itself is untouched.

**Boxes, placed by clicking.** You click a person in the viewer and a box lands on them. You stretch it until it covers them, then choose blur or pixelate. This is the reliable way to hide a person, because you decide exactly what gets covered.

**Faces, all at once.** Cloudinary, the service that stores my media, can blur every face it detects in one step (Cloudinary, n.d.-a). I wanted this to be the easy answer. It is not. I tested it on a 5900 by 2950 pixel photo of a busy convention room with a dozen people in view. It found none of them. People in a 360° photo are small, and many face away. On smaller pieces of the same photo, it found a face in a framed picture on the wall and still missed the people. In a museum, that is a real problem. So the app offers it as a first pass, says so plainly, and expects you to box anyone it misses.

**A patch over the floor.** For the tripod and for me, the best fix was covering the spot straight under the camera. A blur leaves dark smudges where the tripod legs were. A patch does not. You pick a color and, if you like, a logo. Looking straight down, visitors see a clean disc with your logo the right way up.

**Removal with AI, on purpose, with a label.** Cloudinary can also erase people and paint in what it guesses was behind them (Cloudinary, n.d.-b). That breaks a promise Wanderlust makes: every pixel comes from someone who stood in the place. I added it anyway, because sometimes removing a person is better than leaving a smudge. But it is off by default. You have to tick a box saying you understand. And every scene that uses it shows visitors a line of text: "Edited with AI: people were removed from this photo." On a scaled-down copy of that same convention photo, it took out nearly everyone in one request and left smeared patches where the crowd had stood. Useful, and not invisible.

## Making it stick

An edit in the viewer is only a preview. To protect someone, the edit has to become the photo.

So when you save, Wanderlust makes a new file with the edit baked in. Then it swaps that file into every place the old photo was used: the scene, its thumbnail, the tour's cover image, and any lesson that shows it. That last one matters. A person hidden in the tour but visible in a lesson is not hidden.

The original stays in your library. You can come back, change a box, and save again from the clean original. A button swaps the original back. And if the person must not be seen at all, one more checkbox deletes the original for good, once nothing else uses it.

## How to use it

If you make tours on Wanderlust:

1. Open a scene and choose **Hide people and gear**.
2. For the tripod or yourself, tick **Limit the view in this scene**, or use **Cover the bottom** with a patch.
3. For anyone else, select **Click to add boxes** and click each person.
4. Select **Preview the edit** and look all the way around, including straight down.
5. Choose **Everywhere this photo is used**, then **Save as a new photo and swap it in**.

The full guide is at https://wanderlust.witus.online/en/docs/hiding-people, and the step-by-step help is at https://wanderlust.witus.online/en/help/hide-people-in-a-photo.

## Doing it without Wanderlust

None of this is magic. Each edit is a short instruction added to a Cloudinary image address (Cloudinary, n.d.-c). These are the exact ones the app uses:

```
e_pixelate_faces:30
e_pixelate_region:40,x_0.4500,y_0.4000,w_0.0500,h_0.2500
e_blur_region:2000,y_0.8500
```

The first pixelates every face it finds. The second pixelates one box, measured as shares of the width and height from the top left. The third blurs everything below 85% of the height, which is the floor under the camera.

The cheapest fix is still the one you make before you shoot. In a busy room, put the camera on a stand and take a few shots over a few minutes. Blend them with a median, and anyone who walked through disappears, replaced by the real room (David, 2013). It only works on people who moved. Someone who sat in one chair the whole time stays in the picture (Bourke, 2024).

## What it cannot do

- It cannot reach copies made before the edit. A screenshot is a screenshot.
- It cannot edit 360° video. Cloudinary documents face and region blur for images, so people in a video have to be handled in a video editor before upload (Cloudinary, n.d.-d).
- The face option will miss people. Box them.

I wrote a separate post that compares every option side by side, with when to use each: [Seven Ways to Hide Someone in a 360 Photo](/blog/seven-ways-to-hide-someone-in-a-360-photo).

## References

Bourke, P. (2024). *Removing tourists from photographs*. https://paulbourke.net/miscellaneous/removing_tourists

Cloudinary. (n.d.-a). *Face-detection based transformations*. https://cloudinary.com/documentation/face_detection_based_transformations

Cloudinary. (n.d.-b). *Generative remove*. https://cloudinary.com/documentation/generative_remove

Cloudinary. (n.d.-c). *Transformation URL API reference*. https://cloudinary.com/documentation/transformation_reference

Cloudinary. (n.d.-d). *Video artistic effects*. https://cloudinary.com/documentation/video_artistic_effects

David, P. (2013, May 6). *Noise removal in photos with median stacks (GIMP/G'MIC & Imagemagick)*. https://patdavid.net/2013/05/noise-removal-in-photos-with-median_6/

Insta360. (2026). *Insta360 X5*. https://store.insta360.com/product/x5

Sorel, D. (n.d.). *VisibleRangePlugin*. Photo Sphere Viewer. https://photo-sphere-viewer.js.org/plugins/visible-range.html
