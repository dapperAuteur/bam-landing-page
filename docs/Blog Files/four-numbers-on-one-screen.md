<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Four Numbers I Want on One Screen
Slug:    four-numbers-on-one-screen
Excerpt: My money app already tracks my cash, my credit, my gear, and my
         retirement savings. But each one lives on a different page, and some
         key comparisons are missing. Here is the screen I am planning, and the
         rules I am setting first.
Tags:    Buying Software, Design, Money, Plain Talk, CentenarianOS
-->

# Four Numbers I Want on One Screen

I want to open my money app and answer one question fast: am I okay?

Today I can't. My app, CentenarianOS, knows most of the answers. But they live on different pages, and some are missing.

So I am planning a new screen. I call it the Wallet. None of it is built yet.

## A number alone tells you little

Owing a little against a big credit limit is not like owing almost all of it.

So most numbers on the screen get a partner to compare with:

- **Cash**: by default, the cash in my pocket plus my checking and savings, added up.
- **Credit**: what I owe on my cards, next to my credit limits.
- **Stuff**: what the gear and vehicles I own are worth, next to how much is insured.
- **Retirement**: what I have saved, next to how many years until I retire.

A net worth line will sit on top: what I own minus what I owe. It will be labeled an estimate.

## What I found when I looked

- **Cash.** Cash on hand has its own card. Bank balances show up as separate tiles. Nothing adds them into one total.
- **Credit.** I type each card's limit by hand. My imported statements list the limit too. The app saves that number but never copies it to the card. No page compares what I owe with my total limit.
- **Stuff.** Equipment has a price and a current value. Vehicles have no field for price or value.
- **Insurance.** The app only knows about life insurance. It has no car, home or renters policies. Nothing links a policy to the things it covers.
- **Retirement.** This part already works. The app knows my savings, my years until retirement, and how far short I might be.

So much of the data exists. It just never meets on one page.

## Rules I am setting before I build

Adding is easy. Deciding what counts is hard.

- **One card can't hide another card's debt.** If I overpay one card, that extra will not cancel what I owe on the next.
- **Missing limits get named, not guessed.** If I never typed a card's limit, the app will check my latest statement. If it still finds none, the card is listed and left out of the percentage.
- **Each item counts once.** Two policies can't both count the same item. No policy counts for more than its limit.
- **Life insurance is not property insurance.** Life and liability coverage get their own lines. They never make my gear look insured.
- **Every total is in my home currency,** the one I count in. If the app has no exchange rate for an amount, it leaves that amount out. It lists it in amber instead, so nothing quietly disappears.
- **Guesses say they are guesses.** If I leave the retirement age at the default, the screen says it is assumed.

Amber (yellow-orange) will mean "look at this." Green will show up in one place only: "On track" for retirement.

By default, a card using 30% or more of its limit turns amber. The label calls 30% a common rule of thumb, not a rule.

## The business side

I also want a row for each of my businesses. Each row will open that business's own page.

Today there is no page for a single business. The business summary only counts transactions tagged to that business. Only about 3 in 100 of my transactions carry a tag. It stops reading after 1,000 transactions. And it always shows US dollars, whatever my home currency is.

CentenarianOS is meant for personal money. The plan is to move business money to my work app, Work.WitUS, later.

The suggested default is to build the business pages here, behind one switch. After the move, the switch can read from the work app instead. The other choice is to build them in Work.WitUS and link there. I have not decided.

## How it will ship

The Wallet needs one database change. It will add property and liability insurance, and business tags for accounts, policies and items.

My work app shares some of these records, so the change only adds. Nothing is removed or renamed. Until I apply it, the Wallet will treat everything as personal. The insurance comparison will wait.

The same work will fix four small bugs that turned up along the way. Twelve questions are still open, each with a suggested default.

## The question to ask

When a vendor shows you a dashboard total, ask:

> "What does this number leave out, and how would I know?"

Most totals leave something out. A good tool tells you what. A weak one shows a confident number and stays quiet.

## What this means when you hire

Two questions for anyone who builds reports:

- "When a total has to skip something, how does the user find out?"
- "Tell me about a feature you decided belonged in a different product. How did you decide?"

A good answer names a rule: "anything left out gets listed." A weak answer is "we show what the data says."
