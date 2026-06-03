# Managing the Blog (MDX CMS)

> **Heads up — the old workflow is gone.** Blog posts used to be hand-built React
> components at `app/blog/<slug>/page.tsx` registered in `lib/blogData.ts`. That
> per-folder approach has been replaced by a unified **MDX CMS**: posts are authored
> in the admin, stored in MongoDB (`blog_posts`), and rendered from the database.
> You no longer create folders or edit `lib/blogData.ts` to publish a post.

## How it works now

- **One collection.** Every post lives in `blog_posts` (`contentSource: 'cms'`).
  `lib/blogData.ts` (`getAllBlogPosts()`) is the single read source; it still merges a
  handful of legacy static entries, but new posts are CMS rows.
- **One route.** `app/blog/[...slug]/page.tsx` serves posts. It renders MDX with
  `@mdx-js/mdx` through a **closed component registry** (`lib/mdx/registry.tsx`):
  `<Chart>`, `<Carousel>`, `<CodeBlock>`, `<YouTubeEmbed>`, `<SeriesTableOfContents>`,
  plus styled base elements. Output is **ISR-cached** (`revalidate = 3600`).
- **Component props must be serializable.** Anything you pass to a registry
  component (e.g. `<Chart>` options) crosses the server→client boundary, so **no
  function callbacks** — use plain data only.

## Add or edit a post

1. Go to **`/admin/blog/posts`** (admin login required) and click **New post**
   (or **Edit** an existing one). Fuzzy-search by title/slug/category to find posts.
2. Fill in the metadata (title, slug, category, tags, excerpt, publish date,
   featured) and write the body in **MDX** in the editor.
3. Insert media with the editor buttons — **Insert photo / Insert carousel / Set
   featured image** — which pull from the central photo library (`/admin/photos`).
4. Save as **draft** to keep it hidden, or **publish** to make it live. Saving
   revalidates `/blog`, the post URL, and the feeds immediately.

## What happens on publish

- The post appears at `/blog/<slug>`, in `/blog`, the sitemap, and `/feed.xml` +
  `/feed.json` — all from the same data layer, no extra steps.
- On a post's **first** draft→published transition, the **WitUS Outbox** trigger
  fires *coming-soon social drafts* (LinkedIn/Twitter/Bluesky) for your review — it
  does **not** auto-post. Re-publishing an existing post does not re-fire. (Requires
  the `OUTBOX_*` env + `OUTBOX_TRIGGER_ENABLED`; admin bypasses the kill-switch.)

## Migrating an old folder-based post (rare)

Legacy JSX posts were converted with `scripts/import-static-mdx.mjs` (reads
`scripts/migrations/<slug>.mdx`, creates/updates a published CMS row) and then their
`app/blog/<slug>/` folder was deleted so the `[...slug]` MDX route serves them.
Concrete folders still take routing priority over `[...slug]`, so **delete the folder
after** the CMS row exists. Almost all posts are already migrated; you shouldn't need
this for new content.

## Where things live

| Concern | File |
|---|---|
| Read/merge all posts | `lib/blogData.ts` (`getAllBlogPosts`) |
| Render route | `app/blog/[...slug]/page.tsx` |
| MDX engine / registry | `lib/mdx/render.tsx` · `lib/mdx/registry.tsx` |
| Admin editor | `components/admin/MdxBlogEditor.tsx` · `app/admin/blog/posts/` |
| Save/CRUD API | `app/api/admin/blog/posts/route.ts` · `[id]/route.ts` |
| Feeds | `app/feed.xml/route.ts` · `app/feed.json/route.ts` |
| Outbox trigger | `lib/outbox-trigger.ts` · `lib/blog/caption.ts` |
