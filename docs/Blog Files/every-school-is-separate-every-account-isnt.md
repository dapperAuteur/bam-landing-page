<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Every School Is Separate. Every Account Isn't.
Slug:    every-school-is-separate-every-account-isnt
Excerpt: Learn.WitUS keeps each school apart, but one account can belong to two of them. That
         decided who may change whose email before any form did. Tonight's build: an account
         page on every school, an email change confirmed from the new address, five faculty
         accounts given real mailboxes, and course assignments that wait for the teacher to say yes.
Tags:    Learn.WitUS, Multi-Tenancy, Access Control, Email, Product Decisions, WitUS
PUBLISH ONLY AFTER: witus-learn task 411 is merged, its migrate run and production deploy are green, and /account loads on production.
-->

# Every School Is Separate. Every Account Isn't.

Learn.WitUS (learn.witus.online) is the course platform in my WitUS apps. Each school is a tenant with its own courses, teachers and learners. A person can be a learner, an instructor or a school admin (`brand_admin` in the code), and I'm the platform owner above them all.

Earlier tonight the school-admin roles work deployed: a school's owner and its teacher can be different people, there's an admin Users page, an admin can assign a teacher to a course, and a teacher can request a course. Then I asked for three more things:

1. Users should be able to manage their own accounts.
2. The five "faculty" accounts old seeds created (ElementaryMBA Faculty, Learn.WitUS Faculty, WitUS Health Faculty, WitUS Languages and WitUS Trade Faculty) should get real role mailboxes on my domain, so I can sign in as them.
3. "Request a course" should also let a teacher pick an existing course, and a teacher should approve a course assigned to them.

All three were built tonight, and none of it is merged yet.

## An account page on every school

There was no page where a person could change anything about themselves. Now every school has `/account`.

It starts with display name and username. A username is checked for format, uniqueness and the words the app's routes already use. A test reads the routes, so a route added next month can't become someone's username.

The email change took the most thought. The link goes to the new address, because the point is to prove you can read the new mailbox. Clicking the link changes nothing. It opens a Confirm page, and only pressing Confirm changes the address. Mail scanners follow the links in incoming mail to check them, so a link that acts on a click acts for the scanner.

The link lasts 60 minutes, only its SHA-256 hash is stored, and requests are rate-limited. Confirming marks the new address verified, drops any pending sign-in links sent to the old address, and sends the old address a notice.

The page also has **Sign out of this device** and **Ask to delete my account.** There was no deletion flow before, so that button files a request I see on the admin Users page. Children's profiles and the demo account are locked.

## Who may edit whose email

The admin Users page got an edit button too, and here the tenancy question came before the form.

Schools are separate. Accounts aren't. One person with one sign-in can belong to two schools. If one school's admin could change that email, they could hand the account, in both schools, to whoever reads the new mailbox. So:

- I can edit any member.
- A school's admin can edit only that school's learners and teachers: never me, never another admin, and never anyone who also belongs to another school.

An admin's change takes effect at once, both addresses get a notice, and every change goes into an append-only log table.

## Five faculty accounts, five real mailboxes

The faculty accounts had addresses nobody could receive mail at. A data migration gives each one a role mailbox on my domain, with its own local part, and it finds each account by its username, not by its current address. The address is the thing it changes, so keying on it ties the migration to whatever the address happens to be today. The username doesn't move.

Run a second time, it does nothing. It skips any address another account already holds, never touches the owner account, and logs each change. Before it was written, a read-only production query of usernames and counts showed that none of the five teaches a course and no target address was taken.

One test changed on purpose. The repository is public, and a test keeps my personal address out of it. It now allows exactly these five role local parts, in that one migration file only.

## An assignment is an offer

**Request a course** now gives two choices: a new course, or an existing course in this school. The list shows courses you don't teach, and never the ones only I can use. Approving it hands the course over through the same logged assignment rule.

Assigning a teacher changed more: it is now an offer. The instructor changes only when the teacher presses **Accept** under "Courses offered to you." **Decline** leaves the course as it was. The admin gets an email either way. An offer expires after 14 days, a new offer replaces an open one, and an admin can withdraw one.

Two things stay immediate: my own pick in a course's settings, and assigning yourself.

## A bug on the way

An address whose local part is `admin` became the username `admin` the first time that person made a course, so their course links opened the admin page. That address now becomes `admin-user`.

## Where it stands

This is Learn.WitUS task 411: two branches and a bundle, three additive migrations. 2,274 tests pass, typecheck and lint are clean, and the build is green. It waits to merge.

Three decisions are still mine:

- whether to keep the optional free-text note on Accept and Decline, since my ecosystem's no-inbox rule frowns on free-text fields between people;
- whether my own assignments from the Users page should be offers too;
- whether a changed username should redirect from the old one.

## What this cost

**To build:** 16.53 credits, one helper run on Claude Opus 5.5 over 182 responses. A credit is 1 US dollar of API list price, not what my subscription bills, priced with the same usage method as my other posts. The `admin` fix isn't priced on its own. Not counted: the coordinating session, which I don't price per task, writing this post, and my time.

## What I'd carry

- **An account is global even when the product is multi-tenant.** "Who may edit whose email" is a tenancy question before it is a form.
- **Send the confirmation to the new address, and make the link open a page.** Mail scanners click links.
- **Key a data migration on something stable,** not on the thing it is changing.
- **An assignment between two people is an offer, not an order.**
