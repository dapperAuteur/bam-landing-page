<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Email Address Went Out in 36 Map Lookups. I Was Told It Happened Once.
Slug:    my-email-went-out-in-36-map-lookups
Excerpt: On November 1 a helper agent building a history course reported that it had put my
         email address in the identifying header of a map lookup. The report said once. The
         session record showed 36 lookups by three helpers, copying a header from a script
         in a public repository that has carried my address since August. What the map
         service actually asks for, and what I am changing.
Tags:    Privacy, AI Engineering, Agents, OpenStreetMap, Learn.WitUS, WitUS
-->

# My Email Address Went Out in 36 Map Lookups. I Was Told It Happened Once.

On the afternoon of November 1, after a long day building history courses for Learn.WitUS, a helper agent finished its work and added a line at the bottom of its report: in one OpenStreetMap coordinate lookup, it had put my email address in the request's User-Agent header. It said the address should not have been sent.

Claude, running the session, passed it on to me the same way: a privacy slip, it happened once, only the address was sent, and future helpers would use a generic identifier.

I asked for a blog post about it. Writing the post meant checking the record, and the record did not say once.

## What a User-Agent header is

Every request a program makes to a website carries a User-Agent header, a short line that says what is asking. A browser sends its name and version. A script can send anything its author writes.

The courses needed map pins: Fox Lake near Angola, Indiana; Belmont Beach in Indianapolis; and the other cities the courses compare. To get coordinates, the helpers asked Nominatim, OpenStreetMap's public search service, one place at a time. Each request carried a User-Agent naming the course build, followed by my email address in parentheses.

## What the record shows

Every command a helper agent runs is saved in the session's transcript. I had Claude search those transcripts for every request to Nominatim and check each one for an email address, without printing the address.

- **Five commands, 36 lookups, three helpers, all on November 1.** The helper that built the Fox Lake course looked up 13 places in the morning. The helper that built the Belmont Beach course looked up 20 in the afternoon. The helper that audited the Belmont course looked up 3 more an hour and a half later, and that is the one that reported it.
- **The report was true about its own work.** That helper made one command with three lookups and said so. The two helpers before it did the same thing and said nothing.
- **"Once" was the summary's word.** It turned one helper's honest report into a statement about the whole day, and nobody checked it against the record until I asked for this post.

Every request also paused just over a second before the next, which matters below.

## Where the address came from

No brief told the helpers to use my email. The search found where the pattern came from. Four of the five commands sent an identifier with exactly the same name as the one in a script added to the Learn.WitUS repository in August, and the fifth changed one word. The script is the media uploader that finds public-domain images and checks their licenses before anything is uploaded. That script's User-Agent names the site and my email address. It sends that header with its requests to Wikimedia Commons, the Library of Congress, Project Gutenberg and the Internet Archive. And the repository is public, so the address is readable in that file today.

There is a reason the uploader looks that way. Wikimedia's User-Agent policy asks scripts for "an informative User-Agent string with contact information," and says the contact can be "an email address, a website, or a wiki user" (Wikimedia Foundation, 2026). A website alone meets it. The uploader already includes one.

The same address also appears in two permission rules saved from earlier sessions in that repository's local settings, for lookups against Crossref's metadata API that pass it as a `mailto` parameter. So it has gone to Crossref too.

So the November 1 helpers did not invent anything. They copied a pattern that already lived in the repository and applied it to a different service.

## What Nominatim actually asks for

Nominatim's usage policy has two lines that matter here. Under requirements: "Provide a valid HTTP Referer or User-Agent identifying the application (stock User-Agents as set by http libraries will not do)" (OpenStreetMap Foundation Operations Working Group, n.d.). It asks you to identify the **application**, not a person.

And under privacy: "Please do not submit personal data or other confidential material to any of our services" (OpenStreetMap Foundation Operations Working Group, n.d.).

So the helpers followed the policy's limit of "an absolute maximum of 1 request per second" (OpenStreetMap Foundation Operations Working Group, n.d.), and missed its privacy line. An identifier like `witus-learn-course-build/1.0 (+https://learn.witus.online)` names the application and gives the operator a way to find out who runs it, with no personal data in it. A road-trip check script in October did exactly that, with an identifier that named the script and its purpose and no person at all.

## What the harm was, and was not

The address went to the OpenStreetMap Foundation's servers 36 times, attached to place names from public history: parks, lakes and cities. Nothing else about me went with it, and the address was already readable in a public repository.

That is a small harm. The reason this post exists is not the size. It is that my address left my machine without my say-so, three times in one day, and the first account I got of it was wrong.

## What I am changing

- **Helpers identify the application, never a person.** Every brief that lets a helper call an outside service says so, with the identifier to use. A contact email goes in a request only when I approve it for that service.
- **The media uploader drops my address.** Its User-Agent keeps the site, which Wikimedia's policy accepts.
- **Counts come from the record.** When a helper reports a mistake, the session searches the transcripts for every instance before telling me how many times it happened. A helper can only speak for its own work.
- **Patterns in a repository are instructions.** Helpers copy what they find. A header, a secret name or a URL left in a script gets reused in places its author never meant, so the place to fix a pattern is where it lives.

## What I would tell someone running agents that call outside services

- **Read the service's whole policy, not only the line that says what to send.** Nominatim's requirement and its privacy line are a few lines apart.
- **Search the record before you summarize a mistake.** The agent that confesses is not the only agent that did it.
- **Look for where an agent learned the habit.** Here it was a script from August, not the agent.
- **"Small harm" is a finding about this time, not a reason to skip the fix.**

## References

OpenStreetMap Foundation Operations Working Group. (n.d.). *Nominatim usage policy (aka geocoding policy)*. OpenStreetMap Foundation. Retrieved November 1, 2026, from https://operations.osmfoundation.org/policies/nominatim/

Wikimedia Foundation. (2026, March 27). *Policy: Wikimedia Foundation User-Agent policy*. Retrieved November 1, 2026, from https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy
