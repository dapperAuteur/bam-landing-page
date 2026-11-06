<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Three Buttons, One Quota
Slug:    three-buttons-one-quota
Excerpt: I pressed three buttons on my contractor app's admin page and dozens of help articles
         failed to embed. One button was secretly starting a second copy of the job, all three
         shared one free-tier limit, and the old code deleted each article before trying again.
         Then I moved the whole app to a different embedding provider, and found two more bugs on
         the way.
Tags:    Embeddings, Rate Limits, Next.js, Learning in Public, Work.WitUS
-->

# Three Buttons, One Quota

Work.WitUS (work.witus.online) has a help chat. You ask it how to do something, and it answers from the app's 107 help articles. To find the right articles, each one is turned into an embedding: a long list of numbers that captures what the text is about, so a question can be matched to the articles closest to it in meaning.

The admin page `/admin/sync` has buttons that rebuild those embeddings. On November 4 I pressed three of them, one after another: **Demo Reset**, **Run Knowledge Sync**, and **Re-ingest Help Articles**. Then I printed the page, because it was full of errors.

## What the page said

Knowledge Sync: 92 succeeded, 15 failed. Re-ingest: 78 succeeded, about 29 failed. Every failure was the same error from Google, which was making the embeddings: HTTP 429, too many requests, "Embed content requests per minute limit exceeded on Free Tier." The limit in the error was 100 requests a minute.

Google's rate-limit page explains why pressing different buttons didn't help: "Rate limits are applied per project, not per API key" (Google, n.d.). Every button, every user's help chat, every upload in the app draws from the same 100 a minute.

## Three loops, not two

Two buttons, two loops. That was my assumption. The helper that read the code found three.

The Demo Reset button resets the demo account's data. At the end, it also started a full knowledge sync, without waiting for it and without saying so on the page. So when I pressed Demo Reset and then the two sync buttons, three loops were embedding all 107 articles at once, each at roughly 86 requests a minute, against one shared limit of 100.

That explains the 429s. It doesn't explain why the failures hurt.

## Failures deleted articles

Both old sync paths started by deleting every Work.WitUS help row, then embedding each article and inserting it again. When an article's embedding failed, nothing was inserted. The article was simply gone from the help chat until some later run succeeded.

So a rate limit, which should cost a retry, cost content. The more loops collided, the more articles disappeared.

The Re-ingest button also spent one request on a "test" call before starting, against the same limit.

## The first fix: one paced engine

The helper replaced both loops with one engine that every button and the nightly job share.

- **A budget below the limit.** The sync starts at most 60 requests a minute, one a second, leaving the other 40 for people using the help chat and uploading documents at the same time.
- **Wait when told to wait.** A 429 from Google carries a suggested delay. The engine waits that long and retries, up to three times per article. A delay longer than about a minute means the daily quota is spent, so it stops and says so instead of hammering.
- **Skip what didn't change.** Each article's title, content and audience are hashed and compared with the stored row. A second run right after a good one embeds nothing.
- **Never delete first.** Rows are updated in place. A failed article keeps its old embedding, which is worse than a fresh one and far better than nothing.
- **Small pieces.** A web request on this host has a time limit, and 107 articles at one a second don't fit in it. Each request now does about 40 seconds of work and hands back a bookmark. The page keeps asking for the next piece until it's done, with a line like "waiting 45s" when Google asks for a pause.
- **One line per failure.** Instead of Google's whole error for every article, the page shows one short line per failed article, with the full error behind a toggle.

Demo Reset no longer starts a sync at all.

## What I couldn't find out

Google has an endpoint that embeds many texts in one call. If that counted as one request, the limit would barely matter. I asked the helper to check before using it.

Google's rate-limit page doesn't say. It mentions the Batch API, a separate asynchronous service, and says "Batch API requests are subject to their own rate limits" (Google, n.d.), but it doesn't mention the many-texts endpoint or how it counts against the per-minute limit. The helper read the embeddings guide and the API reference too, and neither says either. So the fix sends one text per request and stays under the documented limit, instead of betting on an undocumented one.

## Then I changed providers

The fix worked within the limit. I asked the obvious next question: why live with the limit? Learn.WitUS had already moved its course search to Mistral's embedding model, which I wrote about in [I Re-Indexed 396 Courses on a New Embedding Model](/blog/the-loop-that-dropped-the-school). Could Work.WitUS do the same?

It could, with the same pattern:

- **New columns beside the old ones.** Mistral's embeddings are 1,024 numbers, Gemini's were 768, so they can't share a column. The new `embedding_v2` columns, their indexes and new search functions are added next to the old ones. Work.WitUS still shares a database with CentenarianOS, and CentenarianOS's own help search uses the old columns, so nothing of its was changed.
- **Many texts per request.** Mistral's embeddings endpoint accepts an array of texts (Mistral AI, n.d.-a). It doesn't publish a maximum per request, so the code sets its own: 64 texts or about 8,000 tokens, whichever comes first. A full help sync is now about four requests instead of 107.
- **Pacing anyway.** Mistral's limits "apply at the Workspace level and are shared across all API keys in that Workspace" (Mistral AI, n.d.-b), and the page publishes no numbers per tier. The bulk syncs pace themselves at 30 requests a minute, well under what Learn's key was observed to get.
- **A safe gap.** After the change deploys, search reads only the new columns. Until they're filled, the chats answer "nothing found" instead of erroring.

## Two bugs found on the way

**Union document uploads never finished.** Work.WitUS lets people upload union documents and ask a chat about them. Every upload cuts the document into chunks before embedding them. The old chunking function, copied into three places, never finished: on the last chunk it looped forever, so every upload hung until the 120-second timeout. One shared function replaces all three, with a test that it ends.

**CentenarianOS deletes Work.WitUS's help.** Because the two apps share a database, they share the help-article table. CentenarianOS's help ingest deletes every row in it, for every app, before inserting its own. Work.WitUS's nightly sync puts its rows back, so after a CentenarianOS ingest, the Work.WitUS help chat can be empty for up to a day. That fix belongs in CentenarianOS. It's written down there, not fixed yet.

## Where it stands

The paced engine is merged into Work.WitUS. The move to Mistral is on its own branch, waiting for me: the Mistral key on the Vercel project, the database change pasted into the shared database's SQL editor by hand (its changes have always been applied that way), the merge, and one run of each sync button (Work.WitUS task 29). Every test uses a mocked embedder. Nothing has run against Mistral or the live database yet.

## What this cost

The first fix came from the same helper as the address fix in [the previous post](/blog/my-contractor-app-lived-at-my-health-apps-address): about 5.31 credits over 76 responses for both, not split. The move to Mistral took about 6.68 credits over 89 responses, so roughly $12 for the two branches together. A credit here is 1 dollar of API list price (the price list of 2026-10-06), which is not what my subscription bills. Counted from each helper's session transcript. Not counted: the main session that coordinated the work, writing this post, and my own time.

## What I would carry

- **Count the loops, not the buttons.** A button that quietly starts a job is a loop you didn't know you were running.
- **A limit is per project.** Every caller in the project shares it, including your users.
- **Never delete before you have the replacement.** A failed retry should cost time, not content.
- **Don't build on what the docs don't say.** If a batch might count as one request, find it written down or don't count on it.
- **Shared databases share accidents.** One app's cleanup can be another app's outage.

## References

Google. (n.d.). *Rate limits*. Google AI Studio documentation. Retrieved November 6, 2026, from https://aistudio.google.com/docs/rate-limits

Mistral AI. (n.d.-a). *Embeddings endpoints*. Mistral Docs. Retrieved November 6, 2026, from https://docs.mistral.ai/api/endpoint/embeddings

Mistral AI. (n.d.-b). *Workspace usage and limits*. Mistral Docs. Retrieved November 6, 2026, from https://docs.mistral.ai/admin/workspaces/usage-limits
