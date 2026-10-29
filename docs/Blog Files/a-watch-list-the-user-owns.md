<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Watch List the User Owns
Slug:    a-watch-list-the-user-owns
Excerpt: Chapter 09 of the Invest.WitUS tutorial adds symbols the owner follows without
         holding them. One function holds the symbol rule, the add box takes many symbols
         and reports added, already there and refused instead of blocking on the first bad
         token, remove is a real form, and the report rides on Django's messages framework
         rather than the htmx the roadmap had proposed.
Tags:    Python, Django, Learning in Public, Invest.WitUS
-->

# A Watch List the User Owns

Chapter 09 of the Invest.WitUS tutorial is the watch list: symbols the signed-in owner follows in an account without holding them, shown with the latest stored close and its date. [Chapter 08 built the nightly pull](/blog/the-free-tier-says-internal-use-only) and left one function returning nothing, for this chapter to fill. The list is private to its owner, no public page shows a symbol or a price, and there is no buy button. The product spec says why: a symbol reaches a plan only by the user adding it to the plan's universe.

## One rule, written once

A symbol is user text, so it gets one rule at the boundary. Trim, upper-case, then letters, digits, a dot and a hyphen only, one to twelve characters. The dot and the hyphen are for share classes, which vendors spell both ways. Twelve is longer than any US ticker and short enough that a pasted sentence is refused rather than stored. A mutual fund ticker, five letters ending in X, fits.

The rule is one function that returns the symbol as it will be stored or raises with the reason. Three callers use it: a validator on the model field, so the admin's form refuses with a message beside the box; the form on the owner's page, which parses the box; and the model's `save()`, so a caller that skipped both gets an error, not a row. A bad symbol is refused everywhere and stored nowhere. The column stays twenty characters wide, so a join never truncates; the rule lives at the boundary, not in the database.

## Add many, and report

The box takes one symbol or many, separated by commas or spaces. A refused token beside a valid one does not block the valid one. The valid ones are added, and the page reports what was added, what was already on the list, and what was refused with the reason. Only a submission in which nothing is valid is a form error, beside the box, with the same reasons. A typo costs one line of the report, never the whole submission, and nothing a person types can reach the database or raise past the view.

The add is one `get_or_create` per symbol. A symbol is on an account's list once, by constraint, and `get_or_create` is the add that agrees with the constraint: it reports "already there" instead of failing, it survives two submissions racing, and it runs `save()`, so the rule runs once more.

## Remove is a form

Each row's remove control is a form with one button whose accessible name is "Remove" plus the symbol, which a screen reader and the test both read. It is not a link. A link lets a prefetch or a crawler remove a row, which is the reason chapter 07 gave for making sign-out a form. Removing deletes the row and nothing else. The closes stay in the prices table; a symbol may be watched again tomorrow.

## Plain POST, a redirect, and messages

The roadmap had proposed django-htmx partials here. A dozen rows do not need a partial update. The add and the remove are a POST, a redirect and a page, and the report rides on Django's messages framework, which "allows you to temporarily store messages in one request and retrieve them for display in a subsequent request (usually the next one)" (Django Software Foundation, n.d.). The base template prints the messages once, inside `<main>`, on whatever page the redirect lands on, and prints nothing when there are none, which is every public page.

One line of the documentation is in the chapter: "Even if you know there is only one message, you should still iterate over the `messages` sequence, because otherwise the message storage will not be cleared for the next request" (Django Software Foundation, n.d.). A package and a script tag would have been the chapter's largest listing for nothing a test could check.

The two views answer three questions in order. `login_required` is the outer decorator, so a signed-out request of any method goes to the sign-in. Then `require_POST` answers 405 to a GET. Then the ownership query answers 404 for another owner's account. Who are you, what are you doing, is it yours.

## The pull picks them up

The function chapter 08 left empty now returns every symbol on any account's list, and the pull unions it with the held symbols as it already did. Nothing about the budget, the pause or the rate limit changed: a watched symbol is one more request inside the same fifty. An unknown watched symbol reads "no price yet", the spec's clear message instead of a zero. A watched symbol is never valued; there are no shares to multiply.

On my laptop the pull reads sample CSV files ending September 30, 2026, so every watched row showed a close, a date and the word "stale". That word is the point of showing the date. A number without its day is a number you cannot judge.

The symbols I follow stay out of every file in the repository; the tests use placeholders. Chapter 10 brings the method engine onto the web, with the watch list as one of its inputs.

## What this cost

Building chapter 09 took about 10 credits of Claude usage. Writing this post took about 2.1 more: two helpers wrote the posts for chapters 08 to 10 and the migration post, 8.2 credits between them because the first stopped at a usage limit and the second finished the job, and I split that evenly across the four. About 12 credits in all, roughly $12. A credit here is 1 dollar of API list price, which is not what my subscription bills. Counted from the helpers' session transcripts. Not counted: the main session that coordinated, reviewed and fixed the work, and my own time.

## References

Django Software Foundation. (n.d.). *The messages framework*. Django documentation (Version 5.2). Retrieved October 28, 2026, from https://docs.djangoproject.com/en/5.2/ref/contrib/messages/
