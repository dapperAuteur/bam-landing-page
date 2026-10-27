<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   A Course With Sources Still Needs a Person With the Credential. Here Is How I Find One.
Slug:    finding-people-qualified-to-vet-a-course
Excerpt: Citations prove where a claim came from. They do not prove the lesson is safe to
         teach. For that, someone who does the work has to read it. Who counts as qualified,
         where to look for them, what to ask, what to hand them, and what to offer in return.
Tags:    Curriculum Design, Content Review, Educators, Safety, Learn.WitUS, Verification
-->

# A Course With Sources Still Needs a Person With the Credential. Here Is How I Find One.

Every lesson on my course platform cites its sources. Every number can be traced to a page I read on a given day. I still will not release some of those courses, because a citation answers one question, "where did this come from?", and not the other one, "would a person who does this work for a living let a beginner read it?"

A rigging lesson can cite the right standard and still teach the wrong habit. A hearing-safety lesson can quote the right figure and leave out the thing every audiologist says first. The only check for that is a person with the credential, reading the lesson before a learner does.

This post is for educators and course builders who face the same gap. It covers who counts as qualified, where to look, what the reviewer gets from me, and what I offer in return. [An earlier post](/blog/reviewer-name-on-what-they-read) explains the software side: how a reviewer's verdict is pinned to the text they read. This one is about the people.

## Who counts as qualified

My rule is narrow on purpose. A qualified reviewer is one of two people:

1. **A working practitioner** in the subject: someone who holds the license or certification the lesson is about and does the work now.
2. **A teacher of the subject** at a school, a union training program, or an apprenticeship, who teaches it to people entering the field.

Enthusiasm does not count. Neither does a related credential. A stage electrician is not the reviewer for a rigging lesson, and a general veterinarian is not the reviewer for a lesson on a disease of sheep. The lesson itself says who it needs. In my course files that is one line at the top of the body, in the author's own words:

> **Before release:** needs a qualified reviewer (QR): a large-animal veterinarian.

The platform reads those lines as data. Across four course files it found 81 of them in 71 lessons: 50 asking for a qualified reviewer, 28 for a practitioner, and 5 for a decision only I can make. In the rigging course, 17 of 20 lessons need a qualified reviewer, an ETCP-certified rigger for example. That specificity is the recruiting brief. I am not looking for "someone in theatre." I am looking for a person who holds a named certification.

I did not invent this standard. Quality Matters, a course-certification program, requires that an official review team include "at least one reviewer who is a Subject Matter Expert (SME)" and "at least one reviewer who is external to the organization submitting the course" (Quality Matters, n.d.). Expert plus outsider. My version is smaller, but the shape is the same.

## Where to look

Credentials are public records, and the bodies that issue them keep searchable lists. That is where I start, not with my contacts.

- **Certifying bodies in the trade.** The Entertainment Technician Certification Program, which certifies riggers and entertainment electricians, keeps a public "Find Certified Technicians" search by certification type, state and city (Entertainment Technician Certification Program, n.d.). For a lesson that names an ETCP-certified rigger, that search is the list of everyone who qualifies.
- **State licensing agencies.** For licensed professions, the state keeps the register. Indiana's Professional Licensing Agency offers a public "Verify a license" search (Indiana Professional Licensing Agency, n.d.), and its lookup tool filters by profession, license type, status, county and city. Look for your own state's equivalent. This is how I confirm a credential someone tells me they hold, and how I find a practitioner in a county I can drive to.
- **Professional associations and local chapters.** A trade's association usually has a regional chapter with a newsletter, an education committee, or a monthly meeting. An education committee is the right audience for "I wrote a course for beginners and need one of you to read it."
- **The people who train the trade.** Union training centers, apprenticeship programs and the instructors of the program I would send a learner to next. A teacher of the subject reads a beginner's lesson with a teacher's eye, which is a different and useful kind of review.

One rule of thumb: start with the public register, then ask the association. A register tells me who is qualified; an association tells me who is willing.

## The conflict-of-interest line

The recommendations medical journals follow ask it of every peer reviewer, and I ask it of every course reviewer: "Reviewers should declare their relationships and activities that might bias their evaluation of a manuscript, and recuse themselves from the peer-review process if a conflict exists" (International Committee of Medical Journal Editors [ICMJE], n.d.).

For a course that means one question before the review starts: do you sell, teach or compete with what this course teaches, or have a relationship with me that would make a "not cleared" verdict awkward? A sales relationship with the tools a lesson recommends is a conflict. Being my friend is a conflict I would rather know about than pretend away. I keep the answer next to the credential.

Two conflicts are built into the software, so nobody has to remember them. The course's own instructor records no verdict on their own lesson. And I, as the platform owner, cannot clear a qualified-reviewer need on any course, even one I invited myself to review. A self-invite must not become a qualification.

## What the reviewer gets from me

Today a reviewer gets a seat and a list.

**The seat** is an invitation to audit: a read-only grant on one course. The reviewer reads every lesson without enrolling, which matters more than it sounds. An enrollment is a learner record. It writes progress, earns a certificate, and lands in every course statistic. A reviewer is not a learner, so their quiz attempts are never recorded and the course's numbers keep measuring learners only.

**The list** is a page of the lessons that carry a review marker, with how the reviewer will be credited. The person who invited them typed the name and credential, not the reviewer, so the credit learners later see is not self-reported. On each marked lesson the reviewer records one of three verdicts: cleared, cleared with one correction to make, or not cleared. A correction is written once, attached to the lesson. Nobody replies to it; I act on it by editing the lesson.

Reviewers who prefer paper get nothing yet. That is the next thing to build, and this is what I am proposing it should contain. None of it exists; it is a proposal I want to get right before writing code.

**The reviewer packet, proposed:**

1. A cover with the course, the school, the version and date, "Review copy: not for distribution," the reviewer's name and the deadline, repeated in every footer so a leaked copy says who had it.
2. The ask on one page: what I need back (approve, approve with changes, not yet), the three to five questions I most want answered for this course, how long I think the review takes, and how to send comments.
3. A course summary: who it is for, objectives, length, prerequisites, how it is assessed, and the credentials it calls for.
4. The course map, modules and lessons, one line each.
5. "Lessons that need your review" first, built from the markers, with every other lesson marked context only, so the reviewer spends their time where the course asks.
6. Full lesson text with paragraph numbers, so a comment can say "lesson 7, paragraph 3." Quizzes with the answer key and explanations right after each quiz.
7. A generated list of claims to check: every sentence with a number, a date, a dollar amount, a percentage, a legal citation, or an "always" or "never." It is cheap to generate, and it is where I expect reviewers to find most of the errors.
8. Every source across the course, deduplicated, with the lessons that cite it, and a count of lessons with no citation at all.
9. The course's own known gaps: blocked sources and unverified figures, so the reviewer is not asked to find what I already know.
10. A sign-off page: name, credentials, affiliation, conflicts of interest, decision, date, and a comment table where one row maps to one lesson verdict.

Nothing about learners goes in the packet. It leaves the building.

## What I offer

I cannot pay what a professional's hour is worth, and I do not pretend to. What I can offer is written down before the ask:

- **A credit line on the course.** Every lesson a reviewer clears shows "Reviewed by" with the reviewer's name, credential and the date, and one more line saying that a review checks content and is not an endorsement or a qualification for the learner. The name goes on exactly the lessons they read, and an edit after their verdict removes it until they read the new version.
- **A seat.** The course they reviewed, and the rest of the catalog, as a member rather than a reviewer.
- **A fee by agreement.** Some reviews are a favor; some are work. When it is work, we agree on a number in writing before the review starts, and it is tracked like any other contract.

Some reviewers want none of it and ask only that the course be right. Those are the ones I most want to find.

## The honest state

Three courses in my crew series, on rigging, sound and light, are written, checked claim by claim, and merged. All three still show learners a "Coming soon" page, because no reviewer is named for any of them. [That post](/blog/the-crew-behind-the-show) explains what each course refuses to teach while it waits.

Waiting is the point. A course that cites its sources and has not been read by a person with the credential is a draft. The citations make it a good draft. They do not make it safe.

## References

Entertainment Technician Certification Program. (n.d.). *Find certified technicians*. Retrieved October 27, 2026, from https://etcp.esta.org/findtechnicians/search.php

Indiana Professional Licensing Agency. (n.d.). *PLA: Home*. Retrieved October 27, 2026, from https://www.in.gov/pla/

International Committee of Medical Journal Editors. (n.d.). *Responsibilities in the submission and peer-review process*. In *Recommendations for the conduct, reporting, editing, and publication of scholarly work in medical journals*. Retrieved October 27, 2026, from https://www.icmje.org/recommendations/browse/roles-and-responsibilities/responsibilities-in-the-submission-and-peer-peview-process.html

Quality Matters. (n.d.). *Review process for course design*. Retrieved October 27, 2026, from https://www.qualitymatters.org/qm-membership/faqs/how-course-review-works
