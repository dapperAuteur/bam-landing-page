<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Two Buttons to Take a Course Off the Screen: EPUB and PDF for an E-Reader
Slug:    two-buttons-to-take-a-course-off-the-screen
Excerpt: I wanted to read my own courses on an e-ink screen. Now a course manager has two
         admin-only links, Download EPUB and Download PDF, built from the lessons learners
         see. Quiz answers go at the end of each chapter because an e-reader cannot hide
         text, the PDF renders with no browser in the function, and a 118-lesson course
         comes out at 488 pages in about twenty seconds.
Tags:    Learn.WitUS, E-Readers, EPUB, PDF, Course Design, Engineering Judgment
-->

# Two Buttons to Take a Course Off the Screen: EPUB and PDF for an E-Reader

A course is long material, and I do my best long reading on an e-ink screen, not in a browser tab. So I wanted a way to take any course on my platform away as a book. As of today, the course manager has two links for it: **Download EPUB** and **Download PDF**.

This post is for course builders who want the same thing, and for anyone who reads long material on a 6-inch screen and wonders why most courses cannot leave the screen they were built for.

## What the buttons do

Both links sit on the teaching page for a course, next to the recording script, and both are admin-only: the platform owner or a school's admin sees them, a teacher who is not an admin never does. Behind each link is a route that answers the same way. Signed out gets a 401. A non-admin gets a 403. A course from another school on the platform gets a 404, never a redirect.

The book is built from the database at the moment of the click: the course's **published** lessons, in order, grouped by module. Draft lessons stay out. A reader with the file gets exactly what a learner on the site sees, with the same notices the course page shows printed on the title page.

There are command-line twins, `pnpm export:epub <slug>` and `pnpm export:pdf <slug>`, which read the course files in the repository instead. That lets me export a draft course before it is seeded into the database, which is where most of my proofreading happens.

## Why two formats

EPUB and PDF do different jobs, and the difference is reflow.

The EPUB standard says it plainly: "EPUB publications by default are intended to reflow to fit the available screen space" (W3C, 2026). On a 6-inch e-reader that is the whole point. The text resets to the screen, the font size is the reader's choice, and a table of contents is a real navigation document rather than a page of numbers.

A PDF is a fixed page. Mine is letter size with an 11-point body, which reads at 100 percent on a larger tablet and prints cleanly. It has a title page, a contents page with page numbers, one lesson per section starting on a new page, the module name as a running header, and a page count in the footer. Every lesson is also a PDF bookmark.

So: EPUB for the small screen, PDF for paper or a big tablet.

## The answers go at the end of the chapter

The one design decision both formats share came from the quizzes.

On the site, a quiz question shows its answer only after you commit to one. An e-reader cannot hide text. If the answers sat under the questions, every self-test would be spoiled on the first glance.

So each chapter ends with an Answers section. The quiz answers, the check-yourself answers and the recall-card answers all live there, each with its explanation and the lesson to review. Every question links to its answer, and every answer links back to its question, so a reader can test themselves, jump, and return. The PDF does the same thing with an Answers page at the end of each lesson.

Images are never fetched. They become their alt text, in brackets. In the PDF a link keeps its words and prints its address after them in small type, because paper cannot be clicked. A link into the app itself becomes plain words; it would point nowhere outside the site.

## The EPUB is a zip file with rules

The EPUB builder was merged earlier today. The W3C describes the format as "a means of representing, packaging, and encoding structured and semantically enhanced web content" for "distribution in a single-file container" (W3C, 2026). That container is a zip, built here with the fflate library. One XHTML file per lesson, a navigation document, and a `mimetype` entry that must be first in the archive and stored uncompressed. An older-style navigation file ships alongside the new one for readers that predate the current standard.

The lesson markdown renders with the same parser the site uses, so the lesson text in the book is the lesson text on the page, directives included.

## The PDF renders with no browser

This was the decision I expected to argue with myself about.

The repository already had a way to make PDFs: a script that drives headless Chrome at development time. Its header says why that path never runs in production: it "would mean shipping a browser engine into a serverless function to render a document that changes maybe twice a year." An admin button is the opposite case. The document changes whenever a lesson does, and it is requested on demand.

So the course PDF uses react-pdf, a "React renderer for creating PDF files on the browser and server" (React-pdf, n.d.-a). It is pure JavaScript. The route that serves the button and the command-line script call the same function, and neither needs a browser.

The work splits into two files. One maps lesson markdown to PDF elements: it parses with the same remark pipeline the lesson page uses and walks the tree into headings, lists, tables, quotes, code, links and footnotes. It knows nothing about courses or quizzes. The other composes the book from those pieces: title page, contents, lessons, answers. The contents page needs page numbers, and a page number is not known until the page is laid out, so the document is laid out twice. The first pass records where each lesson lands; the second prints the numbers.

The first real sample was my FAA Part 107 course: 118 lessons. It comes out at 488 pages in about twenty seconds. The test for it decodes the text from the PDF and checks every contents-page number against the page each lesson actually starts on, so a wrong number fails the build rather than reaching a reader. Opting into react-pdf's newer pagination mode cut that render from 29 seconds and 537 pages to the numbers above, with the contents, bookmarks and answers pages checked unchanged.

## What it cannot do yet

Three limits, stated rather than hidden.

**Standard fonts only.** The PDF uses the fonts every reader has built in: Times for body text, Helvetica for headings, Courier for code. react-pdf lists these as the families "supported out of the box," and anything else is loaded through its font registration (React-pdf, n.d.-b). The built-in set covers Western European characters. A course in another script would need an embedded font before the text would show; a few common symbols are mapped to plain characters so they do not vanish, and the rest is left to the reader's fallback.

**One patch.** A hyphenation package that react-pdf depends on publishes its subpath exports for `import` only, and the loader the command-line scripts run under could not resolve them. A one-line package patch adds the `default` condition. It is in the repository, versioned, and it is the kind of thing I write down so the next person who sees it knows it was deliberate.

**A time cap.** The route declares a 60-second limit. That is the framework's route setting, not a promise from the host; a host with a shorter limit wins. A long course is laid out twice and takes some seconds, and the help article tells admins so.

## The next document on the same renderer

The split between "markdown to PDF" and "compose a book" was not an accident. The composition takes a variant, and today there is one, the reader's copy.

The next variant I want is the reviewer packet from [my post on finding qualified course reviewers](/blog/finding-people-qualified-to-vet-a-course): the same lessons with paragraph numbers, the lessons that need review listed first, a generated list of claims to check, and a sign-off page. That is a proposal, not a feature; nothing of it is built. But when it is, the markdown mapping does not change. Only the book around it does.

## If you build this yourself

1. **Build from what the learner sees, not from the source files.** Published lessons, from the database, at the moment of the click. The command-line path from source files is for the author's own proofreading.
2. **Decide where the answers go before anything else.** It shapes both formats.
3. **Keep the browser out of the request path.** A document rendered on demand should not cost a browser engine per request.
4. **Test the page numbers.** A contents page that is off by one is worse than no contents page.
5. **Write down the patch and the cap.** The limits are part of the feature.

## References

React-pdf. (n.d.-a). *React-pdf: PDFs, made with React*. Retrieved October 27, 2026, from https://react-pdf.org/

React-pdf. (n.d.-b). *Fonts*. Retrieved October 27, 2026, from https://react-pdf.org/fonts

W3C. (2026, January 13). *EPUB 3.3* (W3C Recommendation). https://www.w3.org/TR/epub-33/
