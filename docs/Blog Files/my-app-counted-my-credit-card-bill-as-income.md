<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My App Counted My Credit Card Bill as Income
Slug:    my-app-counted-my-credit-card-bill-as-income
Excerpt: For months, my own money app said I earned money every time I bought
         something with a credit card. 309 records were backwards. Here is how
         it happened, and the simple math check that now refuses bad numbers.
Tags:    Buying Software, Quality, Money, Plain Talk, CentenarianOS
-->

# My App Counted My Credit Card Bill as Income

I built a money app. For months, it told me I was earning money every time I bought something on a credit card.

Buy lunch? Income. Pay the card bill? An expense. Exactly backwards.

Three hundred and nine records, across four credit cards. Nobody noticed, including me.

## How a number gets flipped

Banks do not agree on plus and minus.

On a checking account, money leaving is usually shown as a minus. On a credit card, many banks show a purchase as a plus, because it adds to what you owe.

My app had one rule for both. So on credit cards, every purchase was read as money coming in. Every payment was read as money going out.

The app never crashed. It never showed an error. It just quietly added the wrong things together and showed a confident total.

## How I found it

I was not looking for it. I was moving some records to another app, and my monthly AI subscription showed up as income. Nobody pays me to use an AI tool. That odd line was the first clue. The cause turned up a few days later, while I was checking how money moves between my accounts.

That is how quiet errors usually surface: one line that does not make sense, noticed by someone who knows what the real answer should be.

## The fix, and the trap inside the fix

Swapping income and expense on 309 records is easy. Doing it **only once** is the hard part.

My first fix marked each repaired record with a timestamp, so a second run would skip it. Then I found that the database rewrites that timestamp every time a record changes. If the fix had run twice, it would have flipped everything back, and looked fine doing it.

So I marked the repaired records with a label instead, one nothing else touches. Then I checked the result: 232 records now read as spending and 77 as money in, and every one carries the label.

## The check that now refuses bad numbers

Every credit card statement has a little math problem printed on it:

> Last month's balance − payments + purchases + fees + interest = this month's balance

When my app reads a statement now, it does that math. If the numbers do not add up, it says so and shows the difference. **It does not save quietly wrong data.**

I tested it on twelve real statements from one card. All twelve added up to the penny. If the thirteenth does not, I will hear about it before it lands in my budget.

## The question to ask

When software shows you a total, ask:

> "How does this check its own numbers against something it did not calculate?"

The bank's printed balance is a number my app did not make up. Checking against it is what makes the rest worth trusting. A tool that only checks itself against itself will agree with its own mistakes.

## What this means when you hire

Two questions worth asking:

- "Tell me about a time a report looked right and was wrong. How did you find out?"
- "When you fix bad data, how do you make sure running the fix twice can't break it again?"

The second question sorts people quickly. Careful people have been burned by a fix that ran twice. They will tell you exactly how they guard against it now.

## The habit worth stealing

Once a month, take one total your software gives you and check it against a number from somewhere else: the bank statement, the invoice, the receipt. Not every number. Just one. One strange line is how 309 mistakes started to surface.
