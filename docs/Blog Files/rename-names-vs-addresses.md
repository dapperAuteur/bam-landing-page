<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Renamed My App. Three Words Had to Stay Wrong on Purpose.
Slug:    rename-names-vs-addresses
Excerpt: Renaming a product looks like find-and-replace. It isn't. Three strings
         in my codebase spelled the old name and had to keep spelling it,
         because they were never names at all. Here's how to tell a label from
         an address, explained from zero.
Tags:    Engineering Judgment, Refactoring, Rebranding, Beginners, Wanderlust
-->

# I Renamed My App. Three Words Had to Stay Wrong on Purpose.

I renamed a product this month. Wanderlearn became Wanderlust — better name, better fit, same app underneath.

If you have never worked on software, renaming sounds like the easiest possible job. The old name is written in a few hundred places. Find them. Replace them. Done. Every text editor has had that button since the 1980s.

I pressed that button in exactly 49 files. Then I went and put the old name **back** in three places, added a comment at each one explaining why, and wrote a note in the project's documentation saying that if a future version of me offers to "finish the rename," the answer is no.

Here is why, and it turns out to be one of the more useful ideas in software for a non-technical person to have.

## A label and an address are not the same thing

Think about a jar of coffee in your kitchen.

There is a **label** on the jar that says COFFEE. If you rename it — cross it out, write BEANS instead — nothing happens. The jar is where it was. The coffee is what it was. You've changed how you refer to it and nothing else.

Now think about your house number. That is not a label. That is an **address**. It looks like a label. It is a small piece of text stuck to your building, same as the coffee jar. But other people's systems point at it. The mail carrier's route. Your bank. The ambulance dispatcher.

If you change your house number to one you like better, your house does not move. Your mail stops arriving.

Every piece of text in a codebase is one of these two things, and they look identical when you are scrolling past them. Learning to tell them apart is most of what "experience" means in this job.

## The three that had to stay

### 1. Where the photos live

Wanderlust is a place-based learning app. Every course is built around a real location captured in 360°, so it is full of very large images and videos. Those live with a company called Cloudinary that specializes in storing and delivering media.

Inside my Cloudinary account there is a folder named `wanderlearn/`.

Here is the part that matters: for Cloudinary, the folder name is **part of the address of every file inside it**. A photo isn't "the photo, which happens to be in the wanderlearn folder." A photo *is* `wanderlearn/media/7f2c3b18-…`. That whole string is its identity. Every web address that delivers that image to a visitor is built from it.

So if I rename the folder, one of two things happens, and both are bad. If Cloudinary treats it as a new folder, my new uploads go somewhere fresh while every photo already published still lives at the old address — and now nothing in my app is looking there. If it moves the files, every address changes at once and every already-published tour points at a location that no longer exists.

Either way, the same outcome: every photograph in every live tour stops loading. Not a subtle degradation. Grey boxes where the museum used to be.

The folder is an address. It stays.

### 2. The bag of unsent work on your phone

Wanderlust is built to work without internet, because a lot of the people I want to reach are in places where internet is a sometimes-thing. If you're partway through a course underground, on a plane, or somewhere with no signal, the app keeps working and remembers what you did. When you reconnect, it sends your progress up.

To do that, the app keeps a small private database inside your browser, on your device. That database has a name: `wanderlearn-offline`.

The name is how your browser finds it. Not a description of it — the *handle*.

If I rename that string, the next time you open the app it asks your browser for a database called `wanderlust-offline`. Your browser doesn't have one, so it politely makes you a brand new empty one. Meanwhile your actual database — the one holding the progress you made in a tunnel last Tuesday that never got sent — is still sitting there, orphaned, and nothing will ever look for it again.

Nobody gets an error. There is no crash to investigate. The work is just quietly gone, and the person it happened to is exactly the offline-first learner I built the feature for.

The database name is an address. It stays.

### 3. The three storage bins

There is a third case, and it is the mildest, which is why I want to include it. My app stores copies of pages and images on your device so it loads fast and works offline. Those copies live in three named bins.

Rename the bins and nothing breaks. The app makes three new bins and carries on.

But the old three don't get cleaned up. They're still on your phone, still taking up space in the limited storage a browser is allowed, and now nothing will ever read them or delete them, because the code that knew their names doesn't use those names any more.

On a phone near its storage limit, that is enough to make new saving fail. It presents as "the app stopped working offline," months later, with no obvious cause.

Not catastrophic. Just permanently untidy in a way that costs somebody something. They stay too.

## The tell

Here is the test I actually use, and you can apply it without knowing how to code:

> **Does anything outside my control already have a copy of this word?**

The coffee label: no. Only I read it. Rename freely.

The house number: yes. The post office wrote it down. Do not rename.

The Cloudinary folder: yes — it's baked into thousands of published web addresses. The offline database: yes — it's written into browsers on devices I will never touch. The storage bins: yes, same.

Compare that to the *hundreds* of places I did change without a second thought: the words on the buttons, the page titles, the emails, the documentation, the name of the project itself. Nobody outside my code had a copy of those. They were labels. Every one of them was safe.

## The one I got wrong in the other direction

While I was in there, I found the reverse mistake — and it had spread.

My apps all carry a small footer listing the other apps in my ecosystem. One of those entries pointed at the wrong web address. Not slightly wrong; it named a completely different product's website. And because each app keeps its own copy of that list, the error had been copy-pasted into roughly eighteen separate projects.

That is the same failure wearing the opposite mask. Somebody — me — treated an address like a label, wrote down what seemed right instead of checking what was true, and then it propagated. Nothing broke loudly. The link just quietly took people somewhere unhelpful, in eighteen places, for months.

The fix isn't cleverness. It's that when a value is owned by some system outside your own, you go read it from that system instead of typing what you remember.

## Why I wrote comments instead of trusting myself

The three strings that stayed now have a paragraph of explanation sitting directly above each one, in the code, saying what breaks if you change it.

That is not because I'll forget — although I will. It's because the next person to look at that file will see a word spelled the old way, in an app called something new, and feel the completely reasonable urge to tidy it up. It looks like a mistake. It looks like someone did a sloppy rename and missed a spot.

A tidy-minded person with good intentions and no context is exactly who breaks this. The comment isn't documentation. It's a tripwire.

If your code has a landmine in it, the fix isn't remembering where it is. The fix is a sign.
