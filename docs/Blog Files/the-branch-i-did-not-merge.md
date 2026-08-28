<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Branch I Did Not Merge
Slug:    the-branch-i-did-not-merge
Excerpt: Consolidating four stale branches turned up one that was five months
         old, collided with a migration number, and would have dropped a live
         subscription tier from a CHECK constraint on a database two apps
         share. Plus why my additive-only rule did not catch it.
Tags:    Git, Postgres, Migrations, Shared Database, Technical Debt, Code Review
Series:  Decomposing a Monolith (3 of 3)
-->

# The Branch I Did Not Merge

[Part 1](/blog/deciding-what-not-to-split) was deciding what to split. [Part 2](/blog/the-export-that-imported-nothing) was finding out my export had never worked. This one is about the most boring-sounding task in the project, which turned out to be the most dangerous.

I had unmerged branches sitting around. I wanted them consolidated into a single bundle so I could do one merge instead of several. Pure housekeeping.

## Four branches, three harmless

```text
docs/ecosystem-stage0-realignment      README, ARCHITECTURE, MIGRATIONS
chore/ecosystem-links-2026-08-21       one footer component
docs/style-guide-validation-files      STYLE_GUIDE.md
feat/annual-plan-after-founders        11 files + a migration
```

The first three had zero file overlap with each other. The fourth was five months old.

Before merging anything, I checked what it actually did. The branch added:

```text
supabase/migrations/175_annual_plan.sql
```

My repo already contains:

```text
supabase/migrations/175_lesson_360_video.sql
```

A duplicate migration number. That alone is enough to stop. In a numbered-migration scheme, two files claiming `175` means somebody's ordering assumption is about to be wrong.

But the number collision was the symptom, not the problem.

## The work had already shipped under a different number

I grepped for the feature in `main`:

```text
supabase/migrations/189_annual_plan.sql
```

Same feature, later number, already merged. At some point I had rebuilt this work on a fresh branch and shipped it, and the original branch had been sitting unmerged ever since, still looking like legitimate pending work.

So the honest description of that branch was not "an unmerged feature." It was "a five-month-old draft of something already in production."

## What it would have done

Here is the migration that already shipped, in `main`:

```sql
-- 189_annual_plan.sql
-- SHARED DB: this widens the existing constraint. Migration 182 added
-- 'starter'; we must preserve it (and every other current status) here.
-- The CHECK below is the union of all in-use statuses, not a replacement.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_status_check
  CHECK (subscription_status IN ('free','monthly','annual','lifetime','starter'));
```

And here is the old branch's version of the same migration:

```sql
-- 175_annual_plan.sql
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_status_check
  CHECK (subscription_status IN ('free','monthly','annual','lifetime'));
```

Spot the difference: no `'starter'`.

Not because the old branch did anything wrong. Because when it was written in March, the `starter` tier did not exist yet. It arrived later, in migration `182`. The old branch is a perfectly correct snapshot of a world that stopped being true two migrations after it was authored.

Merging it would have run `DROP CONSTRAINT` followed by `ADD CONSTRAINT` with a narrower allowlist. Every `starter` row would fail the new check. On a table that two applications share.

And notice what the newer migration does that the older one cannot: it carries a comment explaining why the list is a union. Someone hit this exact hazard before and left a warning. The old branch predates the warning.

## Why "additive-only" did not save me here

I have a hard rule for this database because two apps share it: migrations are additive. Use `ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`, never drop or rename what another app might read.

That rule would not have caught this. `ALTER TABLE ... ADD CONSTRAINT` is not a drop. It does not remove a column or a table. It reads as additive if you are pattern-matching on keywords.

But a `CHECK` constraint is a contract about the values, and narrowing it is every bit as breaking as dropping a column. It just fails at write time instead of read time, on rows that already exist. My rule was written in terms of schema objects, and the danger lived in the domain of values.

That is the real lesson. "Additive-only" needs to mean additive in the value space, not just the object space. Widening an allowlist is additive. Replacing one is not, no matter which SQL verb you spell it with.

## What I did instead

I bundled the three safe branches, resolved the one real conflict, and left the fourth out deliberately, with the reasoning written down where the merge happens rather than in my head:

```text
EXCLUDED, do not merge. Superseded and destructive:
  1. Its work already landed in main as 189_annual_plan.sql
  2. 175 collides with 175_lesson_360_video.sql
  3. Its CHECK drops 'starter', added later by 182_starter_tier.sql,
     on a database two apps share
```

Then the command to make it unmergeable by accident:

```bash
git branch -D feat/annual-plan-after-founders
git push origin --delete feat/annual-plan-after-founders
```

`-D` rather than `-d`, because git refuses the safe form on an unmerged branch. That refusal is the feature. Git is asking whether I am sure I want to discard work, and in this case the answer is yes, precisely because it is unmerged and must stay that way.

## What I took away

**A stale branch is not neutral.** It looks like pending work forever, and it silently ages out of correctness while the schema moves underneath it. The older it is, the more confidently wrong it becomes.

**Diff the branch against `main`'s current state, not against its merge base.** `git diff main...branch` tells you what the branch changed. It does not tell you that `main` invalidated those changes four migrations ago. I only found this by grepping `main` for the feature name.

**Numbered migrations give you one free alarm, so take it.** The duplicate `175` was not the bug. It was the thing that made me stop and read, which is how I found the bug. Cheap collision detection is worth keeping for exactly this reason.

**Write the exclusion down at the merge point.** "Don't merge that one" survives in memory for about a week. In the merge instructions, with three numbered reasons, it survives until the branch is deleted.

**Check what a constraint permits, not just what a migration touches.** The scariest destructive migration I have written this year contains no `DROP TABLE` and no `DROP COLUMN`. It drops a string from a list.

## Where the project stands

Three parts in, the actual code change is small: a corrected README, a fixed CSV export, a footer link pointed at the right domain. The real output is different. I know what this app's one job is, I know which four modules are load-bearing for it despite being scheduled to leave, and I know the export I planned to migrate with does not silently lie anymore.

The carve-outs come next. They will go faster because the expensive part, figuring out which parts of a monolith are actually holding it up, is done.
