<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Six Conflicts at Once, or Three Stops in Four Minutes
Slug:    rebase-versus-merge-measured
Excerpt: Same branch, same day. The merge put six conflicted files on my desk
         in one pile, was abandoned by a hard reset seventy-two seconds
         later, and the branch got struck out of the bundle's own name. That
         evening the rebase replayed the same ten commits, stopped three
         times, and finished in four minutes and seven seconds.
Tags:    Git, Rebase, Merge, AI Agents, Developer Workflow, WitUS
Series:  Standards, Conflicts and Sources (2 of 4)
-->

# Six Conflicts at Once, or Three Stops in Four Minutes

[The previous post](/blog/conflicts-in-curated-data) was about what merge conflicts look like when the thing being merged is a curated dataset published to teachers rather than code. This one is narrower and more practical: given those conflicts, which git operation should you actually run.

I have read the "rebase versus merge" argument many times and always found it theological. Then I ran both against the same branch on the same day, and the reflog settled it for my case in a way no blog post had.

## What the branches were

Three courses built in parallel by three agents, each on its own branch. Each course converted a set of state-standards rejections into claims, and they overlapped in the same states, so they all edited the same files. I wrote this in my handoff note the night before, and it is the most accurate thing I wrote all week:

> **I did NOT bundle them, deliberately.** All three conflict on six files (`seed-courses.ts`, `research-checks.ts`, `roadmap.ts`, `claims.ts`, `ga.ts`, `tx.ts`) because each converted standards rejections in the same states. **That resolution is delicate** and the last one took several attempts and produced a duplicate framework that only the isolation suite caught. It needs a careful session, not a rushed one.

My convention is that branches get consolidated into one bundle so that I do one merge instead of several. So the plan was a bundle branch, three merges into it, one merge to `main`.

## The merge afternoon, as the reflog recorded it

I did not write this timeline. `git reflog` did, and it is exact:

```
08-29 15:40:12  checkout: moving from main to bundle/money-03-04-06-2026-08-28
08-29 15:40:12  merge content/money-03-cash-flow: Merge made by the 'ort' strategy.
08-29 15:42:59  commit (merge): Merge branch 'content/money-04-predatory-products'
                into bundle/money-03-04-06-2026-08-28
08-29 15:44:11  reset: moving to HEAD
08-29 15:48:26  Branch: renamed refs/heads/bundle/money-03-04-06-2026-08-28
                to refs/heads/bundle/money-03-and-04-2026-08-28
```

Read it in order. The first branch merged clean. The second branch produced this, in the merge commit's own body:

```
# Conflicts:
#	scripts/seed-courses.ts
#	src/lib/research-checks.ts
#	src/lib/roadmap.ts
#	src/lib/standards/claims.ts
#	src/lib/standards/data/ga.ts
#	src/lib/standards/data/tx.ts
```

Six files, all at once, and it took just under three minutes to resolve because I had done the same six the day before. Then the third branch went in, and seventy-two seconds after that resolved merge commit there is a `reset: moving to HEAD`, which is what a thrown-away merge in progress looks like in a reflog. Four minutes after that, the bundle branch was renamed to remove `06` from its own name. The third branch was not in the bundle any more.

There is an earlier one of these, from the day before, and it is even shorter:

```
08-28 16:13:42  merge content/money-03-cash-flow: Merge made by the 'ort' strategy.
08-28 16:14:00  reset: moving to HEAD
08-28 16:14:00  checkout: moving from bundle/money-03-04-06-2026-08-28 to main
```

Eighteen seconds from merge to abandonment.

## Why the merge pile is as bad as it feels

A merge asks git to reconcile two end states against their common ancestor. All the work each branch did arrives as a single diff. When a branch is ten commits of authored content plus a standards conversion plus a docs pass, the conflict hunk in `claims.ts` contains contributions from three of those ten commits and there is nothing in the marker to tell you which.

That is what makes a six-file pile expensive. It is not the file count. It is that for every hunk you are reconstructing intent from the text alone, in a file where, as the previous post argued, the text is prose stating a fact about the world.

And you have no checkpoint. Three files in, thirty minutes deep, discovering that your resolution of file one contradicted file four, the only move is `git reset` and start over. That is what the reflog shows twice.

## The rebase, that evening, on the same branch

Same branch, `content/money-06-housing`, ten commits, same six files. This is its worktree's reflog, unedited:

```
19:04:27  rebase (start): checkout origin/main
19:04:55  rebase (continue): feat(money-06): section 1, two contracts and the law that fills the gaps
19:04:56  rebase (pick): feat(money-06): section 2, the loan itself and ...
19:04:56  rebase (pick): feat(money-06): section 3, the Loan Estimate and ...
19:04:56  rebase (pick): feat(money-06): section 4, the rent-against-buy comparison done ...
19:04:56  rebase (pick): feat(money-06): section 5, valuation and the decision ...
19:04:56  rebase (pick): feat(money-06): section 6, the Act, the covenant, ...
19:04:56  rebase (pick): feat(money-06): the final assessment, and the course ...
19:07:44  rebase (continue): standards(money-06): convert three housing rejections into claims
19:08:34  rebase (continue): docs(money-06): six research checks and the roadmap
19:08:34  rebase (pick): chore(money-06): correct the final-assessment count in the ...
19:08:34  rebase (finish): returning to refs/heads/content/money-06-housing
```

Ten commits. Three stops, each marked by a `rebase (continue)`. Seven clean picks, six of which land in the same second. Start to finish, 19:04:27 to 19:08:34, is **four minutes and seven seconds**, and most of that is the three stops.

Twenty-six minutes later the branch merged into `main` with `Merge made by the 'ort' strategy`, meaning no conflict at all.

## The reason, and it is mechanical rather than aesthetic

**A merge compares two end states. A rebase replays your commits one at a time onto the new base.**

So when a rebase stops, git is applying one commit, and it can tell you which. The stop at 19:07:44 is `standards(money-06): convert three housing rejections into claims`. That is not a hint. That is the entire question answered: this hunk in `ga.ts` exists because this branch converted three housing rejections, and the branch under it converted a different set, and I need both conversions.

The same hunk seen in the merge is anonymous. It is a change to `ga.ts` from a branch that did seven different things.

Being precise about what the reflog does and does not say: it records that the rebase stopped three times and names the commit it stopped on. It does not record which files were conflicted at each stop. What those three commits touch in total is two files, four files and two files respectively, so the conflicted subset was at most that and probably smaller. I am not going to claim a number the repository does not have.

The other property matters just as much. **A rebase is resumable.** Resolve, `git add`, `git rebase --continue`. If stop two goes badly, `git rebase --abort` puts you back at the start with nothing lost, and you have already learned what stop one wanted.

## The commands

Nothing exotic. This is the whole workflow:

```bash
git fetch origin
git branch --show-current          # confirm you are on the feature branch
git rebase origin/main
# ... resolve, then for each stop:
git add <resolved files>
git rebase --continue
# if it goes wrong at any point:
git rebase --abort
git branch --show-current          # confirm you are STILL on the feature branch
```

If the branch was already pushed, the rebase rewrote its history and the next push has to be forced. Use the safe form:

```bash
git push --force-with-lease
```

`--force-with-lease` refuses the push if the remote branch moved since your last fetch, which is the difference between overwriting your own history and overwriting somebody else's. Plain `--force` cannot tell those apart. And this only applies to a branch nobody else is building on. My rule in this repository is that branches are mine until they are merged, and the merges are somebody else's job, so a feature branch is safe to rebase and a shared one never is.

## The trap that cost me an hour

Content agents run in isolated git worktrees so they cannot collide. There were 52 registered on this repository when I checked. A worktree holds a checkout of a branch, and **a branch checked out in a worktree cannot be checked out again in the main directory.**

`content/money-06-housing` lived in `.claude/worktrees/agent-a8a2053228a2e1f67`. Here is the main directory's reflog for the minute before the successful rebase:

```
19:03:25  rebase (start): checkout bundle/money-bibliography-negro-leagues-2026-08-28
19:03:25  rebase (pick): citations update
19:03:25  rebase (finish): returning to refs/heads/main
19:04:27  reset: moving to origin/main
```

A rebase ran, replayed one unrelated commit, and returned to `refs/heads/main`. It was not on the branch I meant to rebase. Sixty-two seconds later it was reset away, and in that same second, 19:04:27, the real rebase started inside the worktree.

I want to be careful about what I am claiming, because there is no written record of this beyond the reflog. I cannot prove from the repository that a `git checkout` printed an error and I missed it. What I can say is that the branch was locked to a worktree, so it could not have been checked out in the main directory, and the reflog shows a rebase running on `main` at exactly the moment I believed I was rebasing that branch.

**The practice, and it is one line: check `git branch --show-current` before the operation and after it.** Not just at branch creation. A rebase, a checkout that failed, or somebody merging your branch in another window while you work all produce the same symptom, which is that the commands you are running are landing somewhere you are not looking. My own repository conventions already require this check before every commit, for the third of those reasons. The first two are why the check belongs around every git operation and not just commits.

## What rebase did not fix

Twelve minutes and nineteen seconds after that rebase finished, the same branch got this commit:

```
fix(standards): merge the two Georgia SSEPF9 entries the rebase produced
```

The rebase produced a duplicate standard entry in Georgia's framework, caught by the isolation suite with `duplicate ga-ssec::SSEPF9`. Rebasing did not prevent a bad resolution. It made each resolution smaller and told me what it was for. Correctness was still bought by [a test that could name the duplicate](/blog/conflicts-in-curated-data), and by running the suite before pushing.

Rebase is not a strategy for being right. It is a strategy for being wrong in units small enough to notice.

## What I would tell someone

**Bundle by merge when the branches are disjoint. Rebase when they collide.** The first branch in that afternoon merged clean in one second, and merging it was correct. The rule is about the conflict, not about a house style.

**Prefer the operation that names the commit.** Everything good about the rebase came from one property: at each stop, git could tell me which of my commits it was applying. That is the information a conflict marker does not carry and cannot.

**Abandon early and cheaply.** Two abandoned merges show in that reflog, one after seventy-two seconds and one after eighteen. Neither was a failure. Both were a correct read of "this pile is bigger than my confidence," and the second one produced a better plan: drop the branch from the bundle, rebase it separately, merge it clean later that evening.

**Check the branch name before and after.** Cheap, boring, and the reason an hour disappeared.

Next: [where the standards data came from in the first place](/blog/fetch-or-do-not-cite), and what a rule that says "claim a standard only if you fetched its text" costs when a state's own website returns 403.
