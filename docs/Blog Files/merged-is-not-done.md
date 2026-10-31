<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Task List Said Merged. Two Apps Were Still Running the Old Code.
Slug:    merged-is-not-done
Excerpt: After three days of work across about ten repositories, I stopped and said: close every
         open task before anything new. Checking the list against GitHub, Vercel and the
         databases found tasks that were finished but never closed, and two production deploys
         of a security patch that had failed a day earlier while their tasks said "merged."
         What went wrong, and the work-in-progress limit I am putting on myself.
Tags:    Operations, Workflow, Kanban, Vercel, AI Engineering, WitUS
-->

# My Task List Said Merged. Two Apps Were Still Running the Old Code.

I build about 25 apps with Claude as the builder. Claude writes the code, branches, commits and pushes. Anything only I can do becomes a task file: merging a branch, changing a dashboard setting, setting a secret, running SQL in a database console. Each repository keeps those files in a `plans/user-tasks/` folder with an index, and every row says what the task blocks.

That system works when tasks arrive one or two at a time. From October 29 to October 31, one long session produced work in about ten repositories: a security patch round across 23 apps, a CI fix, a header fix, a migration workflow, and a plan to move one app onto its own database. Most of it ended with a task for me.

On October 31 I stopped and said: close every open task before any more work.

## The list I could not trust

My own list of what was open had problems before anyone checked a single system. The same witus tasks were on it twice, in different words. And one task asked me to answer questions about a database move, but most of the questions (Q4 and Q7 to Q13) were not in the task. They lived in section 8 of the plan the task pointed to. I could not find them because I was looking where I had been told to look.

Then the counting problem. On October 31, across 26 repositories, 1,182 task files sat outside a `completed/` folder. That is not 1,182 open tasks. Most repositories never move finished files; they write "Done" in the index row and leave the file where it is. So the honest answer to "how many things are waiting on me?" was "nobody knows without reading every row," and that included Claude.

## Checking instead of remembering

So we reconciled the list against the systems themselves: the GitHub merge history, the Vercel deployment list, and read-only queries against the databases. Not against what the tasks said, and not against what either of us remembered.

Twelve task files across eight repositories moved to `completed/` that day. Some were finished that day. At least three had been finished on October 30 and were still listed as open: the merge that made VO GOAT show as live on witus.online, the sign-in bundle for Tour Manager, and a migration secret whose workflow had already run green. Small things, but each was a line I would have read again, and maybe acted on again.

The worse finding went the other way. Two tasks said the security patch was merged. It was. But in two apps, the production deploy of that merge had failed about a day earlier, and nobody had looked:

- **In one app, Vercel never ran the build.** The project's database integration has a required step on every production deploy, and that step failed with "Resource provisioning timed out." The preview of the same commit built fine. That project's task notes count six failures like this in its last twelve production deploys since October 28, each one cleared by pressing Redeploy.
- **In the other, the build ran out of memory** during the type check on Vercel's 8 GB build machine, after the Next.js upgrade in the same patch. The fix turned off source maps that an error-reporting tool was generating for every bundle and never uploading. Measured locally, peak memory went from 6.91 GB to 5.48 GB. It is the third time this app's build has hit a memory limit. I wrote about the first in [My Build Ran Out of Memory Type-Checking Course Data the App Never Loads](/blog/the-build-that-type-checked-the-library).

So for about a day, two apps were serving the build from before the patch round while my task list said the work was done. Both are on the patched build now. The patch round itself is in [A Critical Advisory Listed Three Conditions. I Checked Every App Against All Three.](/blog/three-conditions-in-every-app), including the migration that ran after its merge because a local environment file held an old database password. That was a task that looked closed too.

## Why it happened

Nothing here was hidden. Vercel shows a failed deploy as a red row. The task files were all on disk. The problem was volume. When one session hands one person tasks from ten repositories at once, each task gets a little less attention, and "merged" starts to stand in for "done," because merging is the last step I take with my own hands. The deploy happens after I look away.

Kanban already has a name for this. The Kanban Guide defines work in progress as "the number of work items started but not finished," and says the people in a Kanban system "must explicitly control the number of work items in a workflow from started to finished" (*The Kanban Guide*, 2025). It also says, "When WIP drops below the control set in the DoW, that can be a signal to select new work" (*The Kanban Guide*, 2025). Read it the other way around: when WIP is above the control, the signal is to stop starting.

The guide also asks for a written definition of when a work item is started and when it is finished (*The Kanban Guide*, 2025). I never wrote mine down. "Merged" was my guess at "finished," and for two apps it was wrong.

## What I am changing

- **Merged is not done.** A task that ships code closes when the production deploy is green and the feature works when I use it. The out-of-memory fix task already ends that way: watch the production deploy, sign in once, then run the check.
- **One place to see everything.** A tasks page in the witus.online admin, `/admin/tasks`, is being built. A sync script reads every repository's task index, and the page lists open tasks in a layout I can read on a phone, with one tab for recent production deploys and one for branches that were pushed and never merged. It is not live yet. Until it is, the index files are still the source.
- **A checker at the start and end of each session.** It compares task rows against GitHub and Vercel and lists the ones that disagree: marked done with a failed deploy, or still open with the branch already merged.
- **A cap on new work.** When too many "do now" tasks are open, the session closes those before it starts anything new. That is the guide's work-in-progress control, applied to the one person who merges.
- **One list at the end of a session.** Not reminders scattered through a long chat, which is how the same tasks ended up on my list twice in different words. One list, in order, each line naming what it blocks, and every question I am asked to answer written inside the task itself.

## What I would tell someone running many projects with an AI builder

- **The builder's speed moves the bottleneck to you.** Count what is waiting on you before you ask for more.
- **Write down what finished means for each kind of task.** If code ships, finished includes the deploy.
- **Reconcile against the systems, not the list.** A task row is a claim. The deploy log is the record.
- **Put the question in the task.** A question one link away is a question that does not get answered.
- **Stop starting when the queue is full.** It felt slow on October 31. It found two apps still running the old code.

## References

*The Kanban guide*. (2025, May). Orderly Disruption Limited and Daniel S. Vacanti, Inc. Retrieved October 31, 2026, from https://kanbanguides.org/english/
