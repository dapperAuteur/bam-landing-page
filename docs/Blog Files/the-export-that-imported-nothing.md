<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Export That Imported Nothing
Slug:    the-export-that-imported-nothing
Excerpt: I was one commit from telling users to export their library and move
         it to another app. Then I read both sides of the handoff and found
         the export had been producing unusable files since the day it
         shipped, for the destination app and for my own importer, returning
         200 OK the whole time.
Tags:    Debugging, CSV, Data Migration, API Design, Silent Failure, Postgres
Series:  Decomposing a Monolith (2 of 4)
-->

# The Export That Imported Nothing

In [Part 1](/blog/deciding-what-not-to-split) I decided which modules would leave my personal OS. The media tracker, meaning books, movies, shows, and podcasts, was first, because I verified it fed none of the app's analytics. A true leaf. Lowest risk. Perfect for proving the playbook.

The plan was four steps: export the data, import it into the sibling app that already owns media tracking, deep-link the old page at the new one, remove the nav entry.

Step one was supposed to be free. Both apps already had CSV.

## The data models were a perfect match

I started by comparing schemas, expecting a mapping project. Instead I found this:

| | My app | Destination app | |
|---|---|---|---|
| media types | 10 (`book` through `other`) | the same 10 | match |
| statuses | 4 (`want_to_consume` through `dropped`) | the same 4 | match |
| rating | `SMALLINT` 1 to 5 | clamped 1 to 5 | match |
| visibility | `private` / `public` | the same | match |
| season / episode | present | present | match |

The destination's schema was a direct port of mine. Same vocabularies, same constraints, same rating scale. There was no mapping work to do at all.

Which should have made this a twenty-minute task. So I opened both ends of the pipe to confirm.

## One side writes Title Case. The other side reads snake_case.

Here is my export route:

```js
return buildCsvResponse(
  [
    'Title', 'Creator', 'Media Type', 'Status', 'Rating',
    'Start Date', 'End Date', 'Genre', 'Tags',
    'Cover Image URL', 'External URL',
    ...
  ],
  rows,
  'media-export.csv',
);
```

And here is the destination's importer:

```js
const title = r.title?.trim();
const mediaType = r.media_type?.trim();
if (!title || !mediaType || !isMediaType(mediaType)) {
  skipped += 1;
  continue;
}
```

It parses with `header: true`, so every row becomes an object keyed by the header text. Against a file whose first line reads `Title,Creator,Media Type`, the lookups `r.title` and `r.media_type` are both `undefined`.

Every row takes the `skipped` branch. Every single one.

## The failure returns 200 OK

This is the part that turned a small bug into a post.

```js
const { rows, skipped } = csvToMediaItems(text);
if (rows.length === 0) return badRequest("No valid rows found in CSV");
```

There is a guard. But look at what reaches it. `rows` is the array of successfully parsed items, and `skipped` is a counter that nothing checks. When all 400 of your rows fail, `rows` is empty and you get a `400`. But the moment even one row parses, say you hand-edited a test row to check the endpoint, you get:

```json
HTTP 200 OK
{ "inserted": 1, "skipped": 399 }
```

A success status, a success-shaped body, and 399 silently discarded records. Nothing in that response says "something went wrong," because as far as the importer is concerned, nothing did. It was told to skip malformed rows and it skipped them. All of them.

If I had run this migration on real data without reading the source, I would have seen a `200`, assumed the handoff worked, and moved on to deleting the nav entry.

## It was broken against my own app too

I fixed the header array, then went looking for anywhere else that read this file. That is when it got embarrassing.

My own importer, in the same repo as the export:

```js
const title = row.title?.trim();
if (!title) { errors.push(`Row ${i + 1}: missing title`); skipped++; continue; }

const mediaType = row.media_type?.trim()?.toLowerCase();
if (!mediaType || !VALID_TYPES.has(mediaType)) { ... }
```

Also snake_case. And the CSV template I ship at `public/templates/media-import-template.csv`, which the in-app tutorial tells people to download as the reference format:

```text
title,creator,media_type,status,rating,start_date,end_date,genre,tags,...
```

Also snake_case.

So the export was inconsistent with my own importer, my own published template, and my own documentation. "Export your library and re-import it," a plain backup and restore, had never worked. Not once, since the feature shipped.

## The values were right the whole time

Here is what makes this a good bug rather than just an annoying one. Look at the row builder that sits directly above the broken header array:

```js
const rows = (data || []).map((r) => [
  r.title || '',
  r.creator || '',
  r.media_type || '',
  r.status || '',
  String(r.rating ?? ''),
  r.start_date || '',
  ...
]);
```

That is the template's column order, exactly. Whoever wrote the row builder was reading the template. Then they wrote the header array from scratch, in the prettiest form, because headers are the part a human looks at in a spreadsheet.

The data was always correct. Only the labels were wrong. Which is precisely why nobody caught it: open the exported file and it looks great. `Title, Creator, Media Type`. Clean, readable, obviously fine. The file looks more correct than the file that actually works.

## The fix, and the one wrinkle

Twenty column names:

```js
return buildCsvResponse(
  [
    'title', 'creator', 'media_type', 'status', 'rating',
    'start_date', 'end_date', 'genre', 'tags',
    'cover_image_url', 'external_url',
    'current_progress', 'total_length',
    'season_number', 'episode_number', 'year_released',
    'source_platform', 'notes', 'favorite', 'visibility',
    'is_favorite',
  ],
  rows,
  'media-export.csv',
);
```

Twenty-one, actually. Exactly one field name differs between the two importers: mine reads `row.favorite`, the destination reads `r.is_favorite`. Both parsers ignore columns they do not recognize, so emitting the value under both names costs one column and satisfies both readers. It is not elegant. It is honest about serving two consumers, and I left a comment saying so.

I verified it mechanically rather than by eye, because eyes are what broke it:

```text
first 20 headers match the shipped template exactly: True
columns the destination importer reads, missing from export: NONE
```

## What I took away

**A `200` is a claim, not evidence.** Verify a data handoff by row count, not status code. "The request succeeded" and "the data arrived" are different assertions, and only one of them matters during a migration.

**Skip counters that nobody reads are silent data loss.** If an endpoint can discard input and still return success, it needs to say so loudly: return a non-2xx when skipped rows dominate, or at minimum surface a sample of what failed and why. `{ inserted: 1, skipped: 399 }` is a success response describing a disaster.

**Round-trip your own export before you trust it to move anything.** Export, re-import, compare counts. Mine had been shipping broken files for months and the only reason I found out is that I happened to need it for something else.

**Pretty output is a good place to hide a contract violation.** The headers looked better wrong than right. Any place where the human-readable form and the machine-readable form diverge is a place where somebody will eventually optimize for the human and break the machine.

**Read both sides of a handoff before you schedule the handoff.** I found this in the hour I spent scoping the migration, not the hour I spent doing it. That is the cheapest hour in the entire project.

In [Part 3](/blog/the-branch-i-did-not-merge), the branch I did not merge: five months stale, and it would have quietly dropped a subscription tier out of a constraint on a database two apps share.
