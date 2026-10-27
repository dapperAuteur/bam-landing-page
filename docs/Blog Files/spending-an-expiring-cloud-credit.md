<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   $250 of Cloud Credit, Three Weeks to Spend It, and the Last $7
Slug:    spending-an-expiring-cloud-credit
Excerpt: I had a $250 credit for cloud coding sessions that expired in three weeks. Here is
         what I ran with it, the rule that decided what qualified, the two prompts that
         wasted sessions, and how the last $7 finished a job worth twice that.
Tags:    AI Agents, Claude Code, Solo Engineering, Learn.WitUS, Working With AI, Costs
-->

# $250 of Cloud Credit, Three Weeks to Spend It, and the Last $7

I had a $250 credit for Claude Code cloud sessions, good until November 4. A cloud session is a coding agent that runs on someone else's machine instead of mine. It keeps working after I close the laptop, and it hands back a branch. The question was not whether to use the credit. It was what kind of work deserves it.

## The constraint that decided everything

A cloud session clones my repository from GitHub "at your current branch, not your local checkout, so push first," and the command-line version "works with a single repository at a time" (Anthropic, n.d.). That means two things for how I work.

First, one session sees one repository. My ecosystem has more than 20, and a lot of my work crosses them.

Second, a session sees only what is committed. My planning notes live in a `plans/` folder that git ignores on purpose. A cloud session cannot read any of it.

So the rule became: **prepare locally, execute in the cloud.** Anthropic's own documentation gives the same tip, "Plan locally, execute in the cloud": work out the plan on your machine, commit it, push it, then start the session (Anthropic, n.d.). Every brief a cloud session needed had to be committed into the repository first, written so a stranger could follow it.

## What qualified

The best cloud jobs had three things in common. They fit in one repository. They produced something I could review as one branch. And a script could tell me whether they worked, so I was not trusting the agent's own report.

That ruled a lot in:

- **CI workflows** for ten repositories, so every later pull request would test itself. The first four cost $17.
- **Offline support** for Learn.WitUS, my course platform, over four sessions.
- **Two courses** for the crew series, built from research packs I had committed: one on a cinema-style camera rig, one on how a game's video leaves an arena.
- **A database fix** that cut how much data each page pulled.
- **Analytics wiring** for four apps, each checked by a script that fails if the setup is wrong.
- **A business course** for the ElementaryMBA school, from a committed brief.
- **Quiz rewrites**, the biggest share. Many of my quizzes had a flaw: the right answer was usually the longest choice, or the shortest. A student could pass without reading the question. A lint check now measures it, so each batch of four courses either passes or it does not. A batch cost me $10 to $17.

In all, about $243 went into about thirty sessions.

## The two prompts that wasted sessions

Two quiz batches started with prompts that never said which repository to work in. A cloud session needs a repository to clone, so both did nothing useful. Every prompt after that opened with one line naming the repository, before anything else.

A different mistake: one prompt pointed at a brief I had committed to a branch I had not merged yet. The session went looking, found the brief on that branch, and copied it in itself. It worked, but only because the agent improvised. The fix is boring: merge the brief first, then send the prompt.

A smaller lesson came from the analytics sessions. All four had to work around the same lint rule in a file they copied from the hub app. Four sessions paid for one problem. The fix belongs in the source file once, so the copies inherit it.

## The last $7

When the balance reached $7, one quiz batch was left in the queue. A batch had never cost less than $10. I could let the $7 expire, or spend it on something that might stop halfway.

I changed one line in the prompt: push after every course, not at the end. If the credit ran out after the first course, that course's work would already be on GitHub, and I would finish the rest locally from that branch.

It finished all four. It rewrote 2,786 answer choices, and the best length-only guessing strategy went from winning 90 to 100 percent of the time to between 27 and 31 percent. Pure guessing on four choices wins 25 percent.

It also found three mistakes that were already in published quizzes. The worst was in a taxes course: a question about what happens to an unused non-refundable credit was keyed to an answer describing a refundable credit. Students who knew the material were being marked wrong. Fixing the quiz math surfaced a content error nobody had reported.

## What I would tell past me

1. **An expiring credit is for work a script can grade.** If I have to read every line to know whether it worked, the session saved me less than it looks.
2. **Commit the brief before the session starts.** The agent can only read what is pushed.
3. **Name the repository in the first line of the prompt.** Every time.
4. **Make partial work survive.** "Push after each piece" turns a job that might not finish into one that cannot be lost.
5. **Keep one status file and update it after every session.** Mine listed every session, what it cost and what it changed. That file is the reason I could write this post from facts instead of memory.

## References

Anthropic. (n.d.). *Use Claude Code in the cloud*. Claude Code Docs. Retrieved October 26, 2026, from https://code.claude.com/docs/en/claude-code-on-the-web
