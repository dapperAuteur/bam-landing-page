<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Seven Ways to Hide Someone in a 360 Photo
Slug:    seven-ways-to-hide-someone-in-a-360-photo
Excerpt: A 360 photo has no "behind the camera." Seven ways to keep a person, a
         tripod, or yourself out of one: what each really hides, what it
         costs, and how to pick, from a one-checkbox view limit to AI removal.
Tags:    360 Photos, Privacy, Cloudinary, Beginners, Wanderlust
-->

# Seven Ways to Hide Someone in a 360 Photo

A 360° photo has no "behind the camera." Everything around the lens ends up in the picture: the tripod, the person holding the stick, and anyone who walked past.

I build tours on Wanderlust, and I wanted a clear answer to a simple question. What are the ways to keep someone out of a 360° photo, and when should you use each one? This post is that answer. The companion post, [I Was in Every 360 Photo I Took](/blog/i-was-in-every-360-photo-i-took), tells how these tools came to be.

## Two questions first

**Is it about looks, or about privacy?** Hiding a tripod is about looks. Hiding a stranger who never agreed to be in your tour is about privacy. Privacy needs the photo itself to change, because a viewer that refuses to look at something still downloads the whole image.

**Where is it?** The tripod and the person holding the camera are always straight down. Bystanders can be anywhere.

## 1. Limit how far down visitors can look

**What it is.** The viewer stops turning before it reaches the bottom of the photo.

**Use it when** the problem is gear under the camera and you mostly care how the tour looks.

**How.** On Wanderlust, open the scene's **Hide people and gear** page, tick **Limit the view in this scene**, and drag the slider until the tripod is off screen.

**Good:** Fast. Nothing to edit. Works on 360° video too. It allows for zoom, so the edge of the screen never slips past the line (Sorel, n.d.).

**Watch out:** The photo is unchanged, so this is not privacy. Visitors also lose the floor, which hurts in a room where the floor is the point.

## 2. Cover the bottom

**What it is.** Blur, pixelate, or patch the spot straight under the camera.

**Use it when** you want the tripod, or yourself, gone from the photo itself.

**How.** Under **Cover the bottom**, pick Blur, Pixelate, or Patch, and set how much to cover. A patch can carry your logo. The Insta360 app can also stamp a logo at the bottom of 360° media when you export (Insta360, n.d.).

**Good:** A patch covers completely and looks deliberate.

**Watch out:** Blur and pixelate hide detail, not shape. In my test, a strongly blurred tripod still showed as three dark smudges. The patch is the one that really hides it.

## 3. Blur every face at once

**What it is.** One setting asks Cloudinary to find every face and blur or pixelate it (Cloudinary, n.d.-a).

**Use it when** you want a quick first pass over a photo with a few people close to the camera.

**How.** Under **Faces**, choose Blur faces or Pixelate faces, then preview.

**Good:** One click, nothing to place.

**Watch out:** On a 5900 by 2950 pixel photo of a busy room, it found none of the dozen visible faces. People in a panorama are small and often turned away. On smaller pieces of the same photo, it caught a face in a framed picture on the wall instead. Never rely on it alone.

## 4. Box each person

**What it is.** You click a person in the viewer, a box lands on them, and you stretch it to cover them. Blur or pixelate.

**Use it when** a specific person must not be seen. This is the reliable option.

**How.** Select **Click to add boxes**, click each person, size each box, and preview. Keyboard users can turn the view and add a box at the center of the screen.

**Good:** You decide exactly what is covered, including clothes and bags, which can identify someone as surely as a face.

**Watch out:** It takes a minute per person. In a crowd, that adds up.

## 5. Remove people with AI

**What it is.** Cloudinary's generative remove erases a person and paints in what it guesses was behind them (Cloudinary, n.d.-b).

**Use it when** a blur would distract more than a gap would, and you accept that some pixels will be invented.

**How.** Choose **Removed with generative AI** as the box style, or tick **Remove every person the AI finds**, then tick the acknowledgement.

**Good:** No smudge. On a scaled-down copy of a busy convention photo, it took out nearly everyone in one request.

**Watch out:** It left smeared patches where the crowd had stood. Cloudinary advises against using it on faces or hands alone, and it scales large images down to 6140 pixels while it works (Cloudinary, n.d.-b). Each new version counts as 50 transformations on the account (Cloudinary, n.d.-c). And it breaks Wanderlust's promise that every pixel was photographed, which is why every scene that uses it says so to visitors.

## 6. Swap in an edited copy

**What it is.** The edit becomes a new photo, and the new photo replaces the old one everywhere.

**Use it when** the reason is privacy. This is the step that makes options 2 through 5 real.

**How.** After previewing, choose **Everywhere this photo is used**, then **Save as a new photo and swap it in**. Tick **Then delete the original permanently** if the person must not be seen at all. Outside Wanderlust, the same edits are short instructions in a Cloudinary image address, such as `e_pixelate_region:40,x_0.4500,y_0.4000,w_0.0500,h_0.2500` (Cloudinary, n.d.-d). Save the result, upload it, and replace the old file.

**Good:** The original stays until you delete it, so you can edit again from the clean photo or swap back.

**Watch out:** It cannot reach copies made before the edit, like a screenshot.

## 7. Shoot it clean

**What it is.** Keep people out before the shutter fires.

**Use it when** you can control the moment.

**How.** Start the camera from your phone or a timer and step out of sight. In a busy room, put the camera on a stand, take several shots over a few minutes, and blend them with a median. Anyone who moved disappears, replaced by the real room (David, 2013).

**Good:** Every pixel is real, and there is nothing to hide later.

**Watch out:** People who never moved stay in the shot, and someone who lingered can leave a faint ghost (Bourke, 2024). A stick held over your head will always catch you.

## Side by side

| Option | Changes the photo? | Real privacy? | Effort | Best for |
| --- | --- | --- | --- | --- |
| 1. Limit the view | No | No | Seconds | Tripods, for looks |
| 2. Cover the bottom | Yes | Yes, once swapped | A minute | The tripod and the person holding the camera |
| 3. Faces at once | Yes | Partly | Seconds | A first pass only |
| 4. Box each person | Yes | Yes, once swapped | A minute each | Specific people |
| 5. Remove with AI | Yes, with invented pixels | Yes, once swapped | A minute, plus a label | When a blur would distract |
| 6. Swap in the copy | Makes the edit permanent | Yes | One click | Every privacy case |
| 7. Shoot it clean | Nothing to change | Yes | Planning | When you control the moment |

## How I choose

- **A tripod, and it is about looks:** option 1.
- **The tripod or me in the photo itself:** option 2 with a patch, then option 6.
- **A stranger who must not be seen:** option 4, then option 6, then delete the original.
- **A crowd:** shoot it clean if you can. If you cannot, box the people closest to the camera, and think hard before reaching for option 5.
- **Video:** option 1 still works. Anything else has to happen in a video editor before upload, because Cloudinary documents face and region blur for images (Cloudinary, n.d.-e).

On Wanderlust, all of these live on one page per scene. The full guide is at https://wanderlust.witus.online/en/docs/hiding-people.

## References

Bourke, P. (2024). *Removing tourists from photographs*. https://paulbourke.net/miscellaneous/removing_tourists

Cloudinary. (n.d.-a). *Face-detection based transformations*. https://cloudinary.com/documentation/face_detection_based_transformations

Cloudinary. (n.d.-b). *Generative remove*. https://cloudinary.com/documentation/generative_remove

Cloudinary. (n.d.-c). *Transformation counts*. https://cloudinary.com/documentation/transformation_counts

Cloudinary. (n.d.-d). *Transformation URL API reference*. https://cloudinary.com/documentation/transformation_reference

Cloudinary. (n.d.-e). *Video artistic effects*. https://cloudinary.com/documentation/video_artistic_effects

David, P. (2013, May 6). *Noise removal in photos with median stacks (GIMP/G'MIC & Imagemagick)*. https://patdavid.net/2013/05/noise-removal-in-photos-with-median_6/

Insta360. (n.d.). *Insta360 app: Adding or removing watermarks*. https://onlinemanual.insta360.com/app/en-us/operation-tutorial/file-export/watermarks

Sorel, D. (n.d.). *VisibleRangePlugin*. Photo Sphere Viewer. https://photo-sphere-viewer.js.org/plugins/visible-range.html
