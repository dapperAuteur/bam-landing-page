<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Rebased Instead of Merging. The Stash Took My Agents' Work With It.
Slug:    the-stash-took-my-agents-work
Excerpt: I tried a rebase where I usually click Merge. Nothing broke on GitHub.
         But the checkout I ran it in was the one where agents were editing
         sixteen course files, and git quietly moved all of their unfinished
         work into a stash. Here is what a branch command does to work nobody
         has committed yet.
Tags:    Git, Building in Public, AI Agents, Learn.WitUS
-->

# I Rebased Instead of Merging. The Stash Took My Agents' Work With It.

My usual way to land a branch is boring on purpose. I open GitHub, click Merge, and a merge commit records that the branch came in. Nothing on my own machine moves.

On 2026-10-14 I tried something different with a branch called `fix/length-balance-batch-3`. I rebased it onto `main` from my laptop. I had already merged it on GitHub an hour earlier, so I expected nothing interesting.

Nothing broke on GitHub. Something else broke, and it took a while to find.

## What git actually recorded

Git keeps a diary of every move a checkout makes, called the reflog. Here is what it wrote that evening, in my words:

- **18:13.** The usual: the branch merged into `main` on GitHub with a merge commit.
- **19:01.** In my laptop checkout, `main` was merged *into* the branch, a new local commit nobody needed. Just before it, git saved my uncommitted changes into a stash, so the merge could run on a clean folder.
- **19:09.** A rebase ran, but in the other direction from the one I had in mind: it replayed `main` on top of the branch. A rebase drops merge commits, so for 19 seconds my local `main` no longer had the 18:13 merge in it.
- **19:09, 19 seconds later.** A pull fast-forwarded `main` back to match GitHub.

Net effect on GitHub: none. `main` there still has the merge from 18:13. The branch commit kept its original ID, because it already sat on top of `main`, so there was nothing for a rebase to move.

If that were the whole story, this post would be about reading the reflog. It is not the whole story.

## The folder was not empty

That laptop checkout was where my agents were working. A batch of AI agents was partway through editing quiz options in sixteen course files for my LMS: changes made, not yet checked, not yet committed. That is normal for them. They commit at the end, after a second agent has read every edit.

At 19:01, when git "stashed my uncommitted changes," those were the changes it stashed. Sixteen files, 784 changed lines, moved out of the folder and into a stash named, helpfully, "Auto stash before merge of fix/length-balance-batch-3 and main."

Git puts a stash back when the operation finishes. This one never went back, because the next thing that happened in that folder was a switch to another branch. So the agents' work sat in the stash, and the folder looked clean.

I found out later, when I paused the run near my usage limit and checked the folder. Zero modified files, where two different agents had reported about ten an hour earlier. For a minute it looked as if hours of work had evaporated.

It had not. It was in `stash@{0}`, timestamped 19:01:58. I put it back on the right branch by the stash's ID, not by its position in the list, and saved it as a backup branch too, so it could not be popped by accident.

## Why a stash is a bad place for work to end up

A stash is not attached to a branch, and it is not private to one folder. It is one shared list for the whole repository, every worktree and every session included. Any other tool or agent running `git stash pop` takes the top entry, whatever it is, and applies it to whatever branch they happen to be on.

So for that hour, sixteen files of unchecked edits were one careless command away from landing on the wrong branch, or being dropped.

## Merge versus rebase, in the way I actually work

**My usual merge** happens on GitHub. It never touches a folder on my laptop, so it cannot disturb anything uncommitted there. It keeps a merge commit, which keeps each branch's history grouped. My bundles of several branches depend on that. It never changes a commit's ID, so every note, task file and blog draft that cites a commit hash stays true.

**A rebase** rewrites commits. Their IDs change unless there is nothing to move, which is the only reason none of my citations broke this time. It drops merge commits, which my local `main` showed for 19 seconds. And on a branch that is already pushed, putting the result back on GitHub takes a force push. I do not force-push shared branches.

**Any branch command run locally**, rebase, merge, pull or switch, works on a folder. If that folder has uncommitted work in it, git does one of three things: it refuses; it carries the changes along onto the other branch; or, with autostash on, it moves them into the shared stash. For an agent halfway through an edit, all three are bad. The third is the one that bit me, and a local merge or pull set to autostash would have done it just as easily as the rebase.

## The rule I am adopting

Agents that write files get their own folder, a separate git worktree, every time. Some of mine already did: the courses being built that same evening each had one. The batch that got swept up was running in my main checkout, and that was the mistake. And I run branch commands only in a folder where nothing is half-finished.

## Three things worth stealing

**A clean-looking folder is not proof that nothing was lost.** Before you trust "0 modified files," check `git stash list`. The newest entry's message and timestamp will tell you which command moved your work.

**Restore a stash by its ID, not by its number.** `stash@{0}` means "whatever is on top right now," and another session can change what that is. `git stash apply <hash>` restores exactly the one you saw. Then save it as a branch, and it is safe.

**Give anything that edits files its own worktree.** A person can remember not to run a rebase in a busy folder. An agent cannot see your terminal, and you cannot see its unfinished files.

Related: [GitKraken and Accidental Rebases: Not as Scary as You Think](/blog/gitkraken-accidental-rebase), and [Six Conflicts at Once, or Three Stops in Four Minutes](/blog/rebase-versus-merge-measured), which compares the two by the conflicts they hand you.
