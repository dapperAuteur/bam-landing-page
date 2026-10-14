<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Shortcut Forgot the Miles
Slug:    the-shortcut-forgot-the-miles
Excerpt: My app lets you save a trip and log it again with one tap. On round
         trips and trips with stops, that shortcut quietly lost the miles and
         minutes. Here is why a shortcut must save the same data as the long way.
Tags:    Buying Software, Quality, Plain Talk, CentenarianOS
-->

# The Shortcut Forgot the Miles

I built a travel log into my app, CentenarianOS. Many trips are repeats, like home to the gym. So the app has a shortcut.

When you add a trip, you can tick a box to save it as a template. A template is a saved trip you can reuse. Later, one tap on Quick log records that trip again.

The shortcut was supposed to save time. On round trips and trips with stops, it quietly lost the miles and the minutes.

## What went missing

Each part of a trip is called a leg. Home to the gym is one leg. The ride back home is another. When you tick "Round trip," the app adds that ride home for you.

For trips with more than one leg, the template saved the numbers in the wrong places. Take a round trip to the gym, 5 miles and 12 minutes each way. Quick log should record 10 miles and 24 minutes. It recorded 5 miles and 12 minutes. The ride home had no distance and no time.

Trips with stops went wrong in a stranger way. Each leg got the next leg's numbers. The last leg got nothing. The first leg's real numbers were never saved anywhere.

## Name cards moved one seat over

Picture name cards on a dinner table. Someone slides every card one seat to the left. The first card falls off the table. The last seat sits empty.

That is what the save step did. The reading side expected each stop to hold the leg that ends there. The saving side put each leg one stop too early.

## Why it was easy to miss

Nothing crashed, and no error showed up. The template cards showed no miles for these trips, and never showed time at all. A blank looks like missing data, not a bug.

Simple one-way trips worked fine. The mistake went in back in March. A round-trip fix a few days later fixed the place names, but not the numbers.

There was a quieter problem too. The edit screen offered two trip purposes the app does not accept. On a trip with stops, Quick log could then skip a leg without saying so. A trip could even be saved with zero miles and zero minutes.

## Another bug found on the way

While working on this, I found a different bug. In Trip History, a fast double tap on Quick log could log the same trip twice.

It is a different mistake with the same lesson. A shortcut should save no less and no more than the long way.

## The fix

Now one rule decides where each leg's numbers go. Saving and reading both use that same rule, kept in one place. Tests save trips as templates, read them back, and check that the numbers match.

Quick log now carries each leg's own miles, minutes and vehicle. If any leg fails to save, it removes the whole trip and says it failed. The edit screen offers only purposes the app accepts. The cards show total miles and minutes, and round trips say "Round trip." One tap logs one trip.

A review of the fix caught a slip of its own. A leg saved with no vehicle could pick up the template's vehicle. That could count miles on a car you did not drive. It is fixed too.

## What is still planned

The fix is built and pushed, but not merged yet. Next, I test it by hand and merge it.

After that, I plan to run a repair on old templates. It runs as a dry run first, which only shows what it would change. It only changes templates it can match to the old broken pattern. The rest go on a list for me to fix by hand. It never deletes anything.

Trips already logged from broken templates are only listed for now. Whether to correct them is still my call.

Two gaps remain. Quick log still skips the automatic fuel cost. It also skips the linked money record that the full form creates. Work.WitUS, a sister app, still saves templates the old way. Both are written up as follow-up work. Neither is done.

## The question to ask

When a vendor shows you a shortcut, ask:

> "Show me the same task done the long way and the short way. Do they save exactly the same thing?"

Then check one real example both ways. Shortcuts are one place where saved data can quietly go missing.

## What this means when you hire

Two questions for anyone who builds software:

- "When you add a shortcut, how do you prove it saves the same data as the full form?"
- "What happens in your app when someone taps a button twice?"

Good answers name a test that compares the two paths. Weak answers say the shortcut "just reuses what's there."
