<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Every Check That Lied To Me In One Day
Slug:    every-check-that-lied
Excerpt: I shipped a login feature across twenty apps in a day, with an AI agent
         doing most of the typing. It made nine mistakes I can name. Eight of
         them were the same mistake wearing different clothes: a tool reported
         success, and the success was not real. Here is each one, what it would
         have cost, and the cheap habit that caught it.
Tags:    AI Agents, Testing, Tooling, Engineering Judgment, Postmortem, WitUS
Series:  Building an Ecosystem With Agents (2 of 2)
-->

# Every Check That Lied To Me In One Day

I spent a day rolling a single sign-on feature across the twenty-odd apps in my ecosystem, with
Claude doing most of the typing and a dozen subagents doing the rest. It went well. Eighteen
branches, every one of them green.

It also produced nine mistakes I can name, and I want to write them down while I still have the
receipts, because eight of the nine are the same mistake in different costumes.

The costume changes. The mistake is always this: **a tool said "fine," and "fine" was not true.**

## The one that nearly shipped a lie about my own work

Twelve agents were working in parallel. Seven were killed mid-run by a watchdog that fires after
ten minutes of silence, and every one of them died during a `next build`, which prints nothing for
a long time. One repo's build takes twenty-six minutes on its own.

Their code survived. Their *reports* did not. Their last words were mid-sentence:

> "15 suites failed. I need to determine whether that's pre-existing or mine."

That agent was wrong. Re-running the suite gave 82 files and 909 tests, all passing. The failure
was a cold-cache artifact: the same run reported "Time: 71s, estimated 2082s." Had that
half-finished sentence been inherited as fact, I would have spent an hour hunting a bug that did
not exist, or reported a healthy branch as broken.

Then I made the inverse error myself. I told myself all eighteen branches were "verified with
their own checks." For three of them that was false. Those agents had pushed their work and died
before reporting, so I had no test results at all. The branches existed, so I counted them as
verified. Existing and passing are different facts and I had merged them into one.

I went back and ran all three suites. They passed, 96 and 57 and 281 tests. But I did not know
that when I said it, and saying it was the mistake.

**The habit:** a dying process's last claim is the least reliable thing it ever said, because it is
by definition unfinished. And the filesystem is the source of truth, not the narrator. Recovering
seven dead agents took one pass of `git status` and `git log` across seven directories.

## The check that reported success by checking the wrong thing

I ran a linter and printed its exit code:

```
npx eslint 2>&1 | tail -8; echo "LINT_EXIT=$?"
```

It printed `LINT_EXIT=0`. Clean.

It was not clean. There was one error. `$?` in that line is the exit status of `tail`, not of
`eslint`, because the pipe is what the shell just finished running. `tail` succeeded at printing
eight lines, and reported so, cheerfully, forever.

I only noticed because the eight lines `tail` printed happened to contain the error text. If the
error had been thirty lines from the end, I would have read `LINT_EXIT=0` and moved on.

**The habit:** never trust an exit code that traveled through a pipe. Redirect to a file and check
the status of the command itself.

## The failure that was my own fault, not the code's

I switched a repository to a different branch and ran its type checker. Six errors, all of the
form "cannot find module `guild/page`."

Real-looking. Also nonsense. `guild/page` does not exist on that branch, because that branch is
where it was deleted. The framework had cached generated type definitions from the *previous*
branch, and those definitions still referred to pages that were no longer there. I had created the
failure by changing branches without clearing the cache.

Deleting the cache directory and regenerating gave zero errors.

**The habit:** before reporting a failure, ask whether you caused it thirty seconds ago. A failure
that names files you just deleted is a stale artifact, not a bug.

## The loop that ran once and looked like it ran nineteen times

I wrote a loop over nineteen repositories to find unmerged branches. It printed nothing. I
concluded, briefly, that everything was merged.

The shell here is zsh, and zsh does not split unquoted variables into words the way bash does. So
`for r in $REPOS` did not iterate nineteen times. It iterated once, with the entire string as a
single nonsense path, failed a directory test, and skipped. Silently. A loop that runs zero useful
iterations and a loop that finds zero results print exactly the same thing: nothing.

That one would have been expensive. "Everything is merged" was the conclusion I was about to hand
over, and it was wrong in both directions: two branches were unmerged, and one of them was the
single thing blocking the whole feature.

**The habit:** when a search returns nothing, prove the search ran. I only caught it by testing the
loop body on one repository by hand and watching it work.

## The search that matched a word inside another word

I told an agent to check whether a roadmap file mentioned SSO, because my search had found a match.
The file has never mentioned SSO. My search matched the letters in the middle of the word
"le**sso**ns."

Cheap, harmless, and the same species as everything above: a tool answered a question I did not
quite ask.

## The value I asserted instead of checking

I briefed an agent with a confident sentence: this app's login callback address is already
registered correctly on the server, use that one.

It was not. The registry had a different address, one that would have rejected every single sign-in
attempt with an error the app itself never sees. The agent checked the registry rather than
believing me, found the mismatch, and said so.

I had made exactly the mistake my own project rules exist to prevent, and which I wrote down myself:
never assert a value owned by an external system without reading it from that system. It was on the
one thing in the whole task that fails silently and remotely.

Worse, the same wrong default was already sitting in two other entries. Two apps had been registered
with a callback address neither had ever used, one of them carrying a "confirm this" note nobody
had confirmed. The wrong answer looked plausible three times.

**The habit:** the rules you write for others apply hardest to you, and most of all when you are the
one in a hurry.

## The bug I introduced while fixing bugs

Partway through I added a list of trusted web addresses for one purpose, and forgot that a second
list, built for a related purpose, was derived differently. The result: on an app's secondary
address, the new feature worked and signing out was refused. Signed out correctly in both places,
with no way back to where you started.

Four apps serve from more than one address, so this was not hypothetical. It was found by an agent
reading my code as part of its own task and asking why the two lists disagreed.

**The habit:** two lists that must agree should be derived from one source, not maintained in
parallel and hoped over. They are now.

## The one where I told you to merge something harmful

At the very end I wrote a handoff note listing two branches still needing to be merged. One of them
should not be merged at all. Its work had already landed by a different route; the leftover branch
was strictly *behind* the main line, and merging it would have deleted a seventy-line error handler.

I had checked "is this branch merged?" and gotten "no." I had not checked "does this branch contain
anything?" Those are different questions and I answered the easier one.

The diff is one line long and points the wrong way:

```
src/app/global-error.tsx | 70 -------------------------------
1 file changed, 70 deletions(-)
```

**The habit:** "unmerged" is not the same as "unshipped." Before recommending a merge, look at what
the merge would actually do.

## The house style I ignored while writing about ignoring things

Smallest and most embarrassing. I drafted a post for this blog with fifteen em dashes in it. The
existing posts use zero. This repository contains a script whose entire job is auditing posts for
the tells of machine-written prose, and dash density is one of the things it counts.

I had written a piece about unverified assumptions without checking the conventions of the place I
was writing it.

## What ties them together

I can only find one of the nine that is not a false green. Every other one is a tool answering
confidently and wrongly: an exit code for the wrong process, a cache from the wrong branch, a loop
that never looped, a substring inside a word, a registry I did not open, a question I answered an
easier version of.

None of this is an argument against the tools, and it is not really an argument about AI either.
The agents were right more often than I was, and twice they were right *against* me. One caught my
bad brief. One caught a bug I had introduced an hour earlier.

The pattern I would take into any project, with or without an agent:

**A green check is a claim, not a fact.** It is a claim about the thing you actually measured, which
is not always the thing you meant to measure. The gap between those two is where all nine of these
lived.

The cheapest defence is not more automation. It is asking, once, before you believe it: *what would
this look like if it were broken?* Every one of these had a different answer to that question than
the one I was looking at. `LINT_EXIT=0` looks the same whether eslint passed or `tail` did. An empty
loop looks the same as an empty result. A stale cache looks the same as a real compile error. A
white-label app with a broken button looks the same as one behaving correctly.

Ask the question and most of them fall over in seconds. I asked it nine times too late and,
fortunately, still in time.
