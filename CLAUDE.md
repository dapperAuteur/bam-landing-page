## ⚠️ Ecosystem repo identity (don't confuse these)

**This is the brandanthonymcdonald.com codebase.** The repo name is `bam-landing-page` and the canonical path is `/Users/bam/Code_NOiCloud/ai-builds/claude/bam-landing-page/`.

It is sometimes called "BAM's portfolio" or "bam-portfolio" in plans and conversations — that nickname is **wrong**. There is also a stray directory at `/Users/bam/Code_NOiCloud/projects/bam-portfolio/` created by a prior misplaced `Write` call (parent dirs auto-created); it is NOT a real repo. Anything written there should be moved here or deleted.

This mistake has been made more than once. If you're about to write a file under `projects/bam-portfolio/` or refer to it as the BAM portfolio repo, stop and re-read this note. Work on brandanthonymcdonald.com happens in `ai-builds/claude/bam-landing-page/`.

---

## Operator-task rule — capture user actions in `./plans/user-tasks/`

When Claude proposes work that needs BAM to do something outside the editor (account signup, API key, DNS change, vendor dashboard, env-var rotation, secret generation, PR review/merge, etc.), Claude MUST create a `./plans/user-tasks/NN-slug.md` file in this repo. **No exceptions for "small" steps.**

Required sections per task file: **Scope tag** · **What + why** (with explicit *what this blocks* detail and any hard deadline) · **Steps** · **What Claude will use** · **How to mark done** · **Related**.

Update `./plans/user-tasks/00-descriptions.md` index with columns `# | Title | Scope | Blocks | Status`. The `Blocks` column is non-negotiable — that's the column BAM scans to triage the queue.

This repo's queue is the reference implementation alongside the canonical witus queue at `gemini/witus/plans/user-tasks/`. Full rule with rationale: [`gemini/witus/CLAUDE.md`](../../gemini/witus/CLAUDE.md) §"Operator-task rule".

**Ecosystem-wide tasks** (Keap, IRL events, weekly retros, consultant reconciliation, cross-product decisions) live in the canonical witus queue. **Repo-local tasks** (this repo's deploy, env vars, vendor outreach for brandanthonymcdonald.com) live here. Read the witus queue at session start before starting dependent work.

---

## Branch hygiene — BAM merges, between sessions by default

**Half 1.** End-of-branch contract: branch → commit → push → stop. Claude does not run `git checkout main && git merge`. Never `--force` to shared branches. After push, hand back the branch name + summary and stop.

**Half 2.** BAM merges committed-and-pushed branches via the GitHub UI before the next session starts, unless explicitly told otherwise. This means at session start the local checkout is typically fresh-from-main. **Mid-session, after a push, BAM may merge in a separate window and the local checkout silently fast-forwards to `main`.** Re-check `git branch --show-current` before EVERY commit, not just at branch creation, or you risk landing follow-up commits directly on `main` and bypassing the merge gate.

**Half 3.** Keep branches small (one concern per branch). When a session produces multiple branches, Claude consolidates them into one `bundle/<slug>-YYYY-MM-DD` branch before handoff: merge the small branches in lowest-conflict-risk order using `git merge --no-ff` (preserves per-concern history — non-negotiable, no squash), resolve any 3-way conflicts during bundling, run a final `tsc + lint + build` against the bundle, push, and file ONE user-task at `./plans/user-tasks/NN-merge-bundle-<slug>.md` for BAM to merge bundle → main. The small branches stay on the remote for drill-down history; BAM does one merge, not N.

Full rule with rationale: [`gemini/witus/CLAUDE.md`](../../gemini/witus/CLAUDE.md) §"Branch-hygiene rule".
