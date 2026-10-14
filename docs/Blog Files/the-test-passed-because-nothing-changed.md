<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Security Test Passed Because Nothing Changed
Slug:    the-security-test-passed-because-nothing-changed
Excerpt: I locked a door in my app and tested the lock. The test passed for the
         wrong reason. Here is what the door was, why the first test proved
         nothing, and the one rule that makes a test mean something.
Tags:    Buying Software, Security, Quality, Hiring, Plain Talk, WitUS
-->

# The Security Test Passed Because Nothing Changed

Two of my apps share one database. In it, each person has a profile: their name, their settings, and also which plan they pay for.

This month I found out that a signed-in person could change their own plan. Not by paying, just by asking the database directly. They could also change their own role. And anyone, signed in or not, could read every profile, including the billing reference numbers.

It went straight to the top of my list.

## The fix

The settings people should change, like their name or their clock style, they can still change. The plan, the role, and the billing fields are now locked. Only the server can change them, after a real payment.

Public pages now read from a trimmed copy of the profile. It holds a name and a picture, not billing details.

Then I tested it.

## The test that proved nothing

I signed in as a demo account and tried to set its plan to "lifetime." The database accepted it, with no error.

For a moment that looked like the lock had failed. Then it looked like the lock had worked and simply said nothing. Both readings were wrong.

The demo account **was already on the lifetime plan.** I had asked the database to change "lifetime" to "lifetime." Nothing changed, so there was nothing to block. The test could not have failed. It also could not have passed in any way that meant something.

So I ran it again, this time asking for a value different from the current one. The database refused. **That** was the real result.

## The rule

A test has to be able to fail.

If the thing you are testing is already in the state you are asking for, you are not testing anything. You are watching a quiet room and calling it secure.

Before trusting any "it worked," ask: **what would it have looked like if it hadn't?** If the answer is "the same," run a different test.

## What I also checked

The lock is only good if it does not break the app for honest people. So I also checked:

- people can still change their own name and settings,
- nobody can read anyone else's private profile,
- public pages still show a name and picture for everyone who has one.

A lock that keeps out your customers is not security. It is a support ticket.

## The question to ask a vendor

> "How did you test that this is blocked, and what would the test have shown if it weren't?"

You want an answer with two sides: "we tried to change it to a new value and got refused." An answer with one side is "we tried and it was fine."

## What this means when you hire

Two interview questions:

- "Tell me about a test that passed for the wrong reason."
- "When you lock something down, how do you check you didn't lock out the people who should get in?"

People who test carefully have the first story ready. People who have not been burned yet usually say, "I've never had that happen." That usually means they have not looked.

## What's next

The same database pattern shows up in other places in my apps: places that trust the browser to say which record it wants. I am going through them one by one. This one came first because it touched who pays for what.
