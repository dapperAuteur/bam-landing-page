<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Parents Wanted to Message Teachers. I Built a Signal Instead.
Slug:    a-signal-not-a-conversation
Excerpt: The obvious way to let a parent reach their child's teacher is a chat.
         I built a button with no text box, a set of per-person rules, and one
         email that only goes out if nobody says they have talked. Here is why,
         and the three things the decision made me fix along the way.
Tags:    Product Decisions, Privacy, Safety, Postgres, Engineering Judgment, WitUS
-->

# Parents Wanted to Message Teachers. I Built a Signal Instead.

Learn.WitUS runs private classes, and its first real use case was a homeschool group. Parents already get a read-only family page with their child's progress, grades and attendance. The next item on the backlog was the obvious one: let a parent reach the teacher, and let the teacher reach the parent.

The obvious build is messaging. A compose box, a thread, an inbox, a badge with an unread count. I said no to that on August 30, and on September 20 I built what I had said yes to instead. This post is about the gap between the two.

## Why not a chat

A message channel is not one feature. The moment a message body exists, somebody has to be able to read what gets reported, decide how long it is kept, produce it when a school asks for it, and notice when an adult is using it to groom a child. Those are real obligations, and they need a real person on the other end. I run a one-person platform. I do not have that person, and pretending I do would be worse than not offering the channel at all.

So the rule was narrow on purpose. A parent or a teacher can press a button that says "I'd like to talk." There is no text field. No student is ever the sender or the recipient. The talking itself happens by email or phone, on infrastructure that already has its own rules.

## Three ways to build a button

Before any code, I had my agent write up three designs.

**A, the ping.** One button, one email, and a ledger row that exists only so a rate limit can be real. The smallest option, and the only one whose data model cannot quietly grow into something else. There is no status column to sprout states and no subject column to sprout context.

**B, the request.** An object with a lifecycle: pending, accepted, declined, with contact details revealed on accept. More useful, and one reasonable feature request away from being the messaging product I had refused.

**C, reachability.** No request object at all. Each adult decides once how the people they are already linked to may reach them. When both sides have said yes, the parent opens the family page and the teacher's email is simply there. Nobody presses anything, and no email is sent.

The write-up recommended A, and its argument was a good one. I picked C anyway, because **C's success case sends nothing.** An email that is never sent cannot land in spam, cannot bounce, and cannot be copied anywhere. The write-up's warning about C was also fair: it is a directory, and consent screens get dismissed, so it can degrade into A with extra steps. That is why A's ping came along as C's fallback.

## The fallback, in the order it happens

1. A parent presses **Ask ... to get in touch** on the teacher's card. Before anything is sent, the panel says exactly what the teacher will see: the parent's account email, plus their phone number if they added one.
2. Nothing is emailed yet. The teacher sees a small count beside **Cohorts** in the account menu (a dot on the menu itself while it is closed). The request sits on that parent's card on the class roster, under the student it is about, with the student's name and a link to their work.
3. Either person can end it. The parent presses **We've started talking**, or the teacher presses **Close this request**. It disappears for both of them, and neither is told who closed it or that it was read.
4. If neither happens within 48 hours, the teacher gets exactly one email. It comes from the school's own address, with Reply-To set to the parent.

That last detail carries more weight than it looks. Putting the parent's Gmail address in the From line would make the email fail DMARC at the teacher's mail server, because DMARC "authenticates use of the RFC5322.From domain by requiring that it match (be aligned with) an Authenticated Identifier" (Kucherawy & Zwicky, 2015, §3.1). The specification never mentions Reply-To at all. So the school stays the sender, and pressing reply reaches the parent. That one header is the whole user journey.

The 48 hours is really 48 to 72. The fallback runs as a daily cron job. I scheduled it daily so it deploys on Vercel's Hobby plan, where a cron job can run at most once a day and can fire anywhere within its scheduled hour (Vercel, 2026). The help text says "within the following day" instead of promising a precise 48 hours.

## "All possible combinations"

There are three modes: **show my contact details**, **ask me to get in touch** (the default), and **only through the school**. Each person sets one default for parents and one for teachers. A teacher can set a rule for a whole class. And anyone can set a rule for one specific person.

The request was for every combination, so there are three layers, and the most specific one wins: the rule for one person, then the rule for one class, then the default. "Parents in this class go through the school, except this one parent" is a real case, and it works.

The unit test generates every combination instead of sampling a few: two directions, three defaults, four class settings and four person settings, 96 cases. Each one asserts the same thing, that the answer is the person rule if there is one, otherwise the class rule, otherwise the default for the asker's role.

## Rules that live in the database, not the routes

Three rules sit below the application code, because a rule that lives only in a route handler lasts exactly until someone writes a second route.

**No body column, ever.** The table that stores these requests has eleven columns: which school, which class, which student, who asked, who was asked, the asker's role, three timestamps, who ended it, and an id. A test pins that list and fails on any column whose name looks like a body, message, subject, reply, thread or read state. The comment above it says what to do when it fails: not to update the list, but to take the decision back to me.

**A student is never a party.** Check constraints refuse any row where the student is also the sender or the recipient.

**The relationship is recomputed on every read.** A parent sees a teacher's details only while three facts hold in the same school: the parent is linked to the student, the student is in the class, and the teacher teaches that class. Nothing about it is cached or copied. The isolation test I care most about removes a student from a class and checks that both the request and the badge are gone on the next read. A family whose child left the class in June should not still have that teacher's phone number in September.

## The adult question has no clean answer

I also asked for a rule that teachers must be adults, with a switch I control and per-person exceptions behind several warnings. The honest problem is that the platform has no ID check, and I am not going to pretend it does.

What it has is two kinds of evidence. One is an attestation: the person ticks "I am 18 or older," and the moment is recorded. The other is facts the platform recorded itself, and those outrank the tick: a child profile run by a parent, a kid login by avatar and PIN, or a guardian link that names the account as someone's student. For the first of those, a database constraint refuses the tick outright.

An exception takes four steps: find the person; tick three warnings, or four if the account shows a child's signals; write a reason and type their email address back; then review and grant. The server re-checks every step, so a hand-built request cannot skip one, and a revoked exception stays on record.

One asymmetry is deliberate. **An exception lets someone teach, but it never makes them reachable by parents.** The rule that no student is ever a party is older than the exception switch, and I do not want a flag that looked like a teaching decision to turn into a contact decision.

## What building it surfaced

Three things I did not know until the code made me look.

**Nothing in the app could make someone a teacher.** Creating a class now takes a teacher role. Only seed scripts and the demo account's setup had ever granted a teaching or admin role, so the new rule would have locked homeschool parents out of starting a class. The fix was an admin page for granting the role, and that page exists only because the rule forced the question.

**The product spec still promised an inbox.** The original spec listed course DMs and a "unified inbox" with unread counts as planned first-version features. None of it was ever built, but a spec is what the next working session reads first. It now marks those as ruled out, and it flags public lesson discussions as a question for me instead of quietly deciding them either way.

**Every email was already being copied somewhere.** My mailer sends a redacted record of every outgoing email to a central triage inbox. The redaction strips sign-in tokens, not people. Left alone, every fallback email would have put two adults' addresses and a child's name into that queue. That email type is now excluded from the copy, and the request row itself is the record that it went out.

## The rule, written down

The last thing I asked for was a rule, so the next agent does not rebuild this as a chat the first time someone asks nicely. It lives in the repository's instructions file. The allowed shape is a count on a menu item that already exists, pointing at a card on the related person's row, which disappears when the request ends. The never-build list is specific on purpose: message bodies, threads, compose boxes, any page that lists requests as a destination, read receipts, digests. It ends:

> If a feature request needs any item on the never-build list, stop and take it to BAM as a decision; do not build a smaller version of it.

## Three things worth stealing

**Prefer the design whose success case does nothing.** A reveal that sends no email beats an email you have to make deliverable, keep private, and keep out of spam.

**Put the load-bearing rule where a second route cannot forget it.** A check constraint and a test that pins a table's shape will outlive every well-meaning handler written after them.

**Let a new rule tell you what is missing.** "Only teachers create classes" exposed that nobody could become a teacher. "No inbox" exposed a spec that still promised one. Both gaps had been there all along. The rule is what made them visible.

## References

Kucherawy, M., & Zwicky, E. (Eds.). (2015). *Domain-based Message Authentication, Reporting, and Conformance (DMARC)* (RFC 7489). RFC Editor. https://www.rfc-editor.org/rfc/rfc7489

Vercel. (2026, July 15). *Usage & pricing for cron jobs*. Vercel Documentation. https://vercel.com/docs/cron-jobs/usage-and-pricing
