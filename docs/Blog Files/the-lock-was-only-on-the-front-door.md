<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Lock Was Only on the Front Door
Slug:    the-lock-was-only-on-the-front-door
Excerpt: My admin pages asked for a second code before letting me in. The
         parts doing the real work behind those pages did not. Here is how I
         closed that gap, and the price I chose to pay for the stricter rule.
Tags:    Buying Software, Security, Two-Factor, Hiring, Plain Talk, Work.WitUS, WitUS
PUBLISH ONLY AFTER: tasks 14 and 15 are merged (Work.WitUS repo, plans/user-tasks/14 and 15). No migration is needed for this post.
-->

# The Lock Was Only on the Front Door

My app Work.WitUS has an admin area. Only I can use it. From there I can see users, read feedback, run promotions, and reset the demo.

To get in, I need my password and a second code. The code comes from an app on my phone. This is called two-factor sign-in. A stolen password alone should not be enough.

That was true for the admin **pages**. It was not true for everything behind them.

## Pages and the parts behind them

A web page you see does not do much work by itself. When you click a button, the page sends a request to the server. A part of the server does the actual job. Developers call these parts APIs.

Think of the page as the front door of a shop. The APIs are the back rooms where the work happens.

My front door checked for the second code. The back rooms only checked who I was. They asked, "is this the admin account?" They did not ask, "did this person finish the second step?"

So someone with my password alone could skip the front door. They could not see the admin pages. But they could still ask the back rooms to do admin work.

## The fix

Every admin back room now asks both questions. Is this the admin? And did they pass the second code?

Before, each admin file had its own copy of the "is this the admin?" check. There were 68 of those files. Now they all use one shared guard. One guard is easier to get right than 68 copies. It is also easier to check. I added an automatic test that fails if any admin file forgets to use it.

Two jobs still run with no person at all. Every night, a timer resets the demo account, and a setup script builds the demo accounts. Each uses its own secret key instead of a sign-in. That was true before, and I left it that way on purpose.

## The trade-off I chose

I had a choice to make. I could ask for the second code only on the riskiest actions. Or I could ask for it on every admin action.

I chose **strict**. Every admin action needs a sign-in that passed the second code.

Here is the honest cost.

**I can lock myself out.** If my phone is lost, my admin tools stop working until I recover. If I had turned this on before setting up the code app, every admin panel would have gone blank. The pages would show a notice and nothing else.

So the order mattered. First I set up the code app on the admin account. Then I saved the code app's setup key somewhere safe, away from my phone. The app gives out no recovery codes. That key lets me set up the code app again on a new phone. Only then did I turn on the rule.

Why strict anyway? Because "the risky actions" is a list I would have to keep right forever. Every new admin feature would need a choice. One day I would get one wrong. A rule with no exceptions is easier to keep.

## The question to ask

When a vendor says "we use two-factor," ask:

> "Is the second code checked only at the sign-in screen, or on every request that does admin work?"

Then ask the follow-up: "If I lose my phone, how do I get back in?" A good answer has a plan for both. Safety that nobody can recover from is its own kind of risk.

## What this means when you hire

Two interview questions:

- "Tell me about a security check that protected the screen but not the work behind it."
- "When you make a rule stricter, how do you make sure you don't lock out the people who need in?"

The first question finds people who look past what the user sees. The second finds people who plan the rollout, not just the rule.
