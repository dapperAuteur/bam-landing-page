<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   One Alpaca Paper Account per Method, and as Many Keys as I Need
Slug:    one-alpaca-paper-account-per-method
Excerpt: I want to run several investing methods at once in Invest.WitUS and compare them. Two
         plans sharing one pool of practice cash can't be compared, so each method gets its own
         Alpaca paper account, and each of those comes with its own API keys. The app read one
         key pair. Now it finds any number of named pairs at startup, stores only the name, and
         refuses to put two plans in one Alpaca account.
Tags:    Python, Django, Learning in Public, Invest.WitUS, Security
-->

# One Alpaca Paper Account per Method, and as Many Keys as I Need

Invest.WitUS (invest.witus.online) is the investing app I am building to learn Python. It runs on Django, on Vercel with a Neon database, and it places practice trades on an Alpaca paper account: pretend money, real market prices. Each investing method runs as a plan, and a plan belongs to one Invest account.

I started with 12-1 momentum. I do not want to stop there. There are more than two methods I want the app to hold, and the point of practicing is to run a few of them at the same time and see which one I would actually follow.

At the end of [Edit Before It Happens, Delete Only What Never Happened](/blog/edit-before-it-happens-delete-only-what-never-happened) I wrote down a decision that was not built yet: one method per Alpaca paper account. This is the build.

## Why not several plans in one account

The other way was to let one Invest account hold several active plans, all trading in the same Alpaca account. It sounds simpler. It is not.

- **The cash is one pool.** Both methods buy from it, so when the account is up 4 percent, nobody can say which method earned it without tracking every lot back to the plan that bought it.
- **One method can undo the other.** If momentum rebalances and sells a fund, it sells shares the other method bought, and the other method's record now has a hole it did not choose.

So the rule stayed as it was: one active plan per Invest account. To run a second method, I make a second Invest account and give it its own Alpaca paper account. Each method's cash, orders and fills stay in their own account, and the results are clean.

## Each paper account brings its own keys

Alpaca lets you open more than one paper account from the dashboard. Its paper trading page is direct about what comes with each one: "Don't forget to generate new API keys for any newly created account" (Alpaca, n.d.-b).

That was the problem. The app read one key pair from the environment, so every Invest account I linked to Alpaca was trading in the same Alpaca account. A second method would have quietly shared the first one's cash, which is the exact thing the decision was meant to stop.

## Key slots, found at startup

The branch adds what the code calls a key slot: a named pair of environment variables.

- `ALPACA_PAPER_KEY_ID__MOMENTUM` and `ALPACA_PAPER_SECRET_KEY__MOMENTUM` are the slot `MOMENTUM`. The name after the `__` is up to 40 capital letters, digits and underscores, so `DCA` or `QUALITY_MOMENTUM` work too.
- The old unsuffixed pair is the slot `DEFAULT`. The account I had already linked keeps working with nothing changed.
- When the settings load, the app scans the environment for those two prefixes. There is no list of slots in the code to edit and no fixed number. A new method is a new pair on Vercel and a redeploy.

A slot with only one half set counts as incomplete and is never used. A badly formed name, like a lower-case one or one with a dash, is ignored, and the owner's page lists it by variable name so I can see the typo. Never by value.

## The account stores a name, never a key

An Invest account records two things about its Alpaca link: the slot's name and the Alpaca account number the link check read. No key goes into the database.

Every request to Alpaca for an account now goes through one function, `client_for(account)`. It looks up that account's slot and builds the client with that slot's keys. The method page, the Confirm button, the order check, the paper account page, the cancel before an edit, and the nightly order sync all call it.

One function only helps if nothing goes around it. So a test reads every Python file in the app and fails if any code outside the settings and the slot module reads the Alpaca key settings directly, or calls the old one-pair client.

## A missing slot stops, it does not fall back

The easy mistake would be: if the `MOMENTUM` keys are gone, use `DEFAULT`. That would place momentum's orders in some other method's account, with its cash, and nothing on the page would look wrong.

So a missing slot stops that account. The method page, the paper page and Confirm all say "Keys for slot MOMENTUM are not set on the server," and nothing is bought. The nightly sync marks that account's open orders as failed with the same sentence and goes on with the other accounts.

The last commit on the branch fixed the wording of that box. It had read "Alpaca did not answer," which sent me looking at Alpaca when the gap was on my own server. It now says the keys are not set, and a test checks that the old phrase is gone.

## Two Invest accounts can't share one Alpaca account

Keys can be pasted into the wrong slot. So linking is a check, not a form field. On an account's **Link to Alpaca paper** page, I pick a slot and press **Check this slot**. The app asks Alpaca for the account with those keys and shows the number they reach. Alpaca's Get Account response carries that number in a field called `account_number` (Alpaca, n.d.-a). Only then does **Link** save the slot's name and the number.

The link is refused if another Invest account, of any owner, already trades in that Alpaca account. Two plans in one account is the shared cash pool again. If a slot's keys are later replaced with another account's, Confirm stops and says which number the keys reach now and which one the account was linked to.

## No secret on any page

The slot list shows each slot's name, whether it is complete, and the last four characters of its key id. Nothing more. A test opens nine of the owner's pages, including the slot list, the link page, the method page and the paper pages, and fails if any secret or whole key id appears in the HTML.

## The trade-off

Keys in the environment cost something. Each new method means a change in Vercel and a redeploy before it can trade. The alternative is to let me type keys into the app and keep them encrypted in the database, which would skip the redeploy.

I did not build that. It puts secrets in the database, and for now the only person with Alpaca keys is me. Keys entered in the app make sense when other people bring their own Alpaca accounts, and that waits for the legal review the app needs before anyone else uses it.

## Where it stands

The branch passes 833 tests, 15 of them new for key slots, and is waiting to merge. Once it does, adding a method is a short routine: open a new paper account in Alpaca, generate its keys, pipe them into Vercel under a new slot name without pasting them anywhere, redeploy, and link the new Invest account. The page that puts two methods side by side is still to build.

What I would carry to any app that talks to an outside account:

- **One account per thing you want to measure.** Shared pools make comparisons a bookkeeping problem.
- **Store which credential, never the credential.**
- **Route every client through one function,** and write a test that fails when code goes around it.
- **When a credential is missing, stop and say so.** A fallback to a default account is a silent wrong answer.

## References

Alpaca. (n.d.-a). *Get account*. Alpaca API reference. Retrieved November 2, 2026, from https://docs.alpaca.markets/reference/getaccount-1

Alpaca. (n.d.-b). *Paper trading*. Alpaca documentation. Retrieved November 2, 2026, from https://docs.alpaca.markets/docs/paper-trading
