<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Computer Ran Out of Room. It Was the Disk, Not the Memory.
Slug:    it-was-the-disk-not-the-memory
Excerpt: Three AI helpers were building in parallel when every command started failing,
         even the one that reports free space. The drive was full. 18 GB of it was five
         copies of one repo that finished helpers had left behind. What I deleted, what I
         checked before deleting it, and why no work was lost.
Tags:    AI Agents, Git, Debugging, Developer Experience, WitUS
-->

# My Computer Ran Out of Room. It Was the Disk, Not the Memory.

I told Claude to write a post about my computer running out of memory. That is what it felt like. It was not memory. RAM was fine. The drive was full, and a full drive stops everything, including the commands you would use to find out why.

## Everything stopped at once

On the night of October 29 I had three AI helpers working at the same time: one on the Invest.WitUS backlog, one on a fix in WitUS Inbox, one adding a sign-in button to WitUS Outbox. Then every command they ran failed with the same error, `ENOSPC`: no space left on device. Not the build. Everything. `df`, the command that reports free space, could not run either.

The helpers stopped. Nothing committed was lost, and that part was not luck. The house rule is to commit and push at every green step: a passing build, a finished sub-step, a green test. A helper that dies mid-task costs me the last few minutes of its work, not the task. A full disk turned into a pause instead of a loss.

## Finding room to look

I closed Chrome tabs until there was 1.6 GB free. That is not much, but it was enough for `df` and `du` to run, and that was the point. You can't clean a disk you can't measure.

The biggest line was not where I expected. Claude's own scratch folder held 18 GB. Inside it were five git worktrees, each a full checkout of the Learn.WitUS repo with its own `node_modules`, about 4 GB apiece. Each one had been made by a helper earlier in the week to work on a branch without touching my checkout. Every one of those branches was already pushed and merged. The helpers had finished. Their copies had not left.

A worktree is git's way of checking out a second branch beside the first, from the same repository (Git, n.d.). It costs seconds to make. In a Node project it also brings a full install of dependencies, and nothing removes it unless someone does.

## Check, then delete

I did not delete them on sight. Each one got two checks first: does it have uncommitted changes, and does it have commits the remote doesn't. Both came back empty for all five. Then `git worktree remove` on each, and `git worktree prune` to clear git's own records. Git refuses to remove a worktree with changes in it unless you force it (Git, n.d.), which is why the checks come before the force, not after.

Free space went from 1.6 GB to 14 GB.

## The rest of the pile

With room to look, the rest showed up:

- About 15 GB of tool caches: pip 3.9 GB, Homebrew 2.1 GB, Chrome 1.6 GB, pnpm 1.1 GB, Playwright 1.1 GB. All of them rebuild on demand except one. The Playwright cache holds the headless browser my library PDF renderer uses, and on this version of macOS Playwright can't reinstall it. That one stays.
- About 2 GB of Claude transcripts, kept because a retention setting said 3,650 days. Ten years. I had set it that way to keep my usage history. The history now lives in a database, so the setting is back to 90 days.

## What I'm taking from it

- **Parallel agents multiply disk use, not only token use.** Three helpers is three installs. I had been counting the bill and not the drive.
- **A worktree is cheap to make and expensive to forget.** The one making it is the one that knows when it is done.
- **The cleanup belongs in the brief.** Every helper brief now says: remove your worktree when your branch is pushed.
- **Check clean and pushed before deleting.** Two commands. Skipping them is how you delete someone's afternoon.
- **Write the commands down.** They now live in the ecosystem commands reference, so the next full disk is a lookup, not a research project.

## The commands

What used space, biggest last:

```sh
df -h /
du -sh <scratch-folder>/* ~/Library/Caches/* 2>/dev/null | sort -h | tail -15
```

Is a worktree safe to remove? Run from the repo it belongs to. Both checks should print nothing:

```sh
git worktree list
git -C <worktree> status --porcelain
git -C <worktree> log --oneline origin/<branch>..HEAD
git worktree remove --force <worktree> && git worktree prune
```

Caches that rebuild themselves:

```sh
pip cache purge
brew cleanup -s
pnpm store prune
```

Chrome's cache I clear from its settings, cached images and files only. The Playwright cache I leave alone.

## What this cost

The cleanup itself was done by the main session that was running the three helpers, and that session is not counted here. Writing this post took about COST1_CREDITS credits of Claude usage, roughly COST1_DOLLARS, counted from the writing helper's session transcript. That helper also wrote the companion post on the commands reference, so its total is split evenly between the two. A credit here is 1 dollar of API list price, which is not what my subscription bills. My own time is not in it either.

## References

Git. (n.d.). *git-worktree: Manage multiple working trees* (Version 2.56.0). Git documentation. Retrieved October 29, 2026, from https://git-scm.com/docs/git-worktree
