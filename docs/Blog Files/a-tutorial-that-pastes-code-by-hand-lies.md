<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Tutorial That Pastes Code by Hand Lies Within a Week
Slug:    a-tutorial-that-pastes-code-by-hand-lies
Excerpt: Chapter 04 of the Invest.WitUS tutorial is the first Django page: a landing page, a
         waitlist that cannot tell on you, a header link to a sign-in that does not exist yet,
         and a footer copied as data from the ecosystem's product list. The part I want to keep
         is the script that pastes the real files into the chapter, because the hand-pasted
         chapters had already drifted.
Tags:    Python, Django, Learning in Public, Tutorials, Invest.WitUS
-->

# A Tutorial That Pastes Code by Hand Lies Within a Week

Invest.WitUS is the Django app I am building to learn Python, with Claude writing the chapters and me following them in my own copy. [The setup is in an earlier post](/blog/learning-python-by-building-the-app-i-need), and [the deploy that failed on a missing secret key](/blog/where-the-django-secret-key-goes) is in another. This one is chapter 04, the first page a browser can open. It is the longest chapter so far, because a website is many small files, and the thing I want to keep from it is not Django. It is a script.

## Chapters 00 to 03 were pasted by hand

The first four chapters were written the way most tutorials are written: the code exists in the repo, and the chapter text carries a copy of it. Each chapter ends at a git tag, and tags do not move, so the copy in the text and the file at the tag should stay the same forever.

They did not stay the same for a day. Chapter 00 says the project uses Django 6.1. By chapter 04 the decision had changed to Django 5.2, the long-term-support release, because it gets fixes until April 2028 and a tutorial people follow for a year wants the longer runway. Tag `v00` is immutable, so chapter 00's text is wrong until someone revises it, and nothing tells them to.

Chapter 04 adds a generator instead of another paste. `scripts/render_chapter.py` reads a template for the chapter in which each listing is a single line, `{{file:path}}`, and replaces that line with a fenced block holding the real file. The chapter text is an output. The script's `--check` mode renders it again and fails if the committed text differs, and that check is part of the gate before a chapter's tag is cut. What you read and what the tests run are the same bytes.

It earned its keep one chapter later. Chapter 05 edits `settings.py`, which chapter 04 pastes. The first version of the script read the working tree, so `--check` reported chapter 04 stale against text that was correct at `v04`. The fix: a published chapter's header names the tag it ends at, and the script reads that chapter's listings from the tag with `git show`. Published chapters stay fixed to their tag; the chapter being written reads the working tree.

Prose still drifts, and the script cannot catch it. Chapter 04 says sessions arrive in chapter 07; chapter 05 needed them for the admin, so chapter 05 says so and chapter 04 stays wrong at its tag. The listings are honest. The sentences around them still need a reader.

## A sign-in link to nowhere, on purpose

Every app in the WitUS ecosystem has a header link whose accessible name is exactly "Sign in" whenever the visitor is signed out. witus.online itself shipped for five months with that link renamed, and I reported "no login button" twice before the rule was written. A test tagged `smoke` asks for the link's exact text inside `<header>`, and the tutorial copies that test in before the page exists.

Chapter 04 has no sign-in. Sign in with WitUS is chapter 07. So the link goes to a stub page that says so. A 404 would pass no test and would mislead a visitor; a page that says the real thing arrives in chapter 07 is true.

## A waitlist that cannot tell on you

The one form is the waitlist. The email is lowercased and trimmed before `get_or_create`, so the same address in different capitals is one row, and the thank-you page is the same whether the row was new or already there. The form never reveals who is on the list. A hidden `website` field is the honeypot: the stylesheet moves it off screen and `tabindex="-1"` keeps the keyboard away from it, so a person never fills it in and a form-filling bot usually does. A filled honeypot gets the thank-you page and stores nothing.

After a valid post the view redirects instead of rendering, so a browser refresh repeats a harmless GET instead of a second submit. A test checks the redirect chain.

## The footer is data

The footer is the ecosystem footer: the same structure in every app, the Rise Wellness callout and its disclaimer word for word, the sibling products, the copyright line. The products are not typed into the template. They are copied, as data, from the ecosystem's registry file, `products.ts`, into a Python module, and a context processor hands them to every page. Products marked coming soon render without a link, the way witus.online's own footer does, because a link to a site that does not exist is a broken promise.

The two pieces copied word for word have dashes in them, and this project's writing rule bans dash characters in source. They are written as HTML entities. The page shows the recipe's exact text; the repo stays clean under its own check.

## The lesson

A tutorial that pastes code by hand lies within a week. Not because the author is careless, but because the code keeps moving after the paste and nothing points back at the text. The generator costs one script and one habit: write `{{file:path}}` and let the script do the pasting. The prose still needs reading. The code no longer does.
