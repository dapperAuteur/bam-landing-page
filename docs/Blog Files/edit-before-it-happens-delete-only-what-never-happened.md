<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Edit Before It Happens, Delete Only What Never Happened
Slug:    edit-before-it-happens-delete-only-what-never-happened
Excerpt: I started a 12-1 momentum plan in Invest.WitUS while the market was closed, queued its paper orders
         for the open, and then wanted to change the numbers. The app only offered a new
         version with a reason, built for plans that already have months behind them. So the
         app now lets you edit or delete a plan until something has happened under it, and one
         rule decides what "happened" means. Cancelling at Alpaca taught the other half: read
         the order back, and go by its status, not the HTTP code.
Tags:    Python, Django, Learning in Public, Invest.WitUS
-->

# Edit Before It Happens, Delete Only What Never Happened

Invest.WitUS (invest.witus.online) is the investing app I am building to learn Python. It runs on Django, on Vercel with a Neon database, and it places practice trades on an Alpaca paper account, which uses pretend money against real market prices. The app walks you through an investing method as a plan: the numbers you chose, the months it runs, and a journal of what you did.

I started a 12-1 momentum plan, the method from [chapter 14 and its addendum](/blog/not-enough-history-is-an-answer). The markets were closed. The plan page has a button for that case, "Confirm: queue for the open," and it did what it says: it sent market day orders for a dollar amount each to Alpaca, to run at the next open, and it wrote the matching journal entries right away.

Then I wanted to change the numbers. I couldn't, at least not the way I wanted to.

## The only door was "Change or end this plan"

Chapter 12 made a plan's numbers part of its history. If you change a plan after a few months, you get a new version, and every past month keeps the numbers that judged it. The page asks for a reason, because "why did I change this?" is the question you will want answered in six months.

That is right for a plan with months behind it. My plan had nothing behind it. No order had filled, no month had been reviewed, and the only journal entries were the ones for orders still waiting at Alpaca. A version 2 with a reason would only have recorded a typo, permanently.

## What changed

The branch merged on November 2, with 818 tests passing and one migration, `methods.0005_view_preference`. Three things:

1. **A default view, saved per person.** The plan page has three views of the same plan, A, B and C. You could already switch with a link, and the choice lasted as long as your session. Now a "Make this my default view" button saves it to your account, so the page opens the way you read it.
2. **Edit a plan in place.** No new version and no reason asked, but only when the plan has no history, is still version 1, and no month's buy window has closed under it. If orders are queued at Alpaca, the app cancels them first and reads each one back. The page then offers "Place again" with the new numbers.
3. **Delete a plan to start over.** Same rule. A confirmation page lists exactly what goes: the plan, its empty month reviews, its order rows that never filled. The journal, the watch list and the account stay. A plan with history is refused, and the page points to "End the plan" instead, which keeps its months.

## One rule for what "happened" means

Both buttons hang on one question, so the answer lives in one place in the code. A plan **has history** when any of these is true, across every version from the first:

- any of its orders bought shares, including a part fill;
- the journal has an entry dated on or after the plan's first day, other than the entry for one of the plan's own orders that is still open at Alpaca;
- a month review was written, closed or reopened.

The middle line took the most thought. A queued order writes its journal entry at the dollar amount it was sent with. If that entry counted as history, queuing an order would lock the plan before a single share changed hands, which is the exact situation I was in. So an open order's own entry does not count. If the order is cancelled with nothing filled, its entry goes away, the same way the nightly sync would remove it.

Journal entries belong to the account, not to a plan. Deleting a plan never deletes an entry. The rule's job is the other direction: it keeps a plan from disappearing from under entries it was used to judge.

History decides what may change. Before anything has happened, the plan is a draft, and a draft can be edited or thrown away. After, it is a record, and a record gets versions or an ending, never an eraser.

## Cancelling at Alpaca: ask what happened

Edit and delete both start by cancelling the plan's open orders. The cancel call is a `DELETE` on the order. Alpaca's reference for it says: "If the order is no longer cancelable, the request will be rejected with status 422; otherwise accepted with return status 204" (Alpaca, n.d.). It lists 422 as "The order status is not cancelable."

Read "accepted" carefully. A 204 means Alpaca took the request, not that the order is cancelled. And a 422 does not tell you why it could not be cancelled; most likely it already filled, which is the one outcome that matters most here.

So the app never acts on the HTTP code. After every cancel, whatever came back, it requests the order again and acts on the status the order reports:

- **Cancelled with nothing filled:** the row and its journal entry go, and the plan can be edited or deleted.
- **Filled, even partly:** shares were bought, so the plan now has history. The page says so and offers the paths that keep it.
- **Still open, in the middle of cancelling:** the page says it is waiting and to try again later, or let the nightly sync finish it.

The last fix of the day came from this rule too. The edit page had been showing the order's status from before the cancel. It now reads the plan again after the cancel, so it shows Alpaca's new status.

## Decided, not built

One more decision came out of this: one method per Alpaca paper account. Each paper account needs its own API keys, so a second method means a second paper account and a second set of keys, not a second plan sharing one account. Each method's trades then stay in an account of their own. A Compare page that puts two accounts side by side comes later.

What I would carry to any app that records what people do:

- **Write down when a draft becomes a record,** in one function, and make every button ask it.
- **Let people fix a draft without ceremony.** Versions and reasons are for records.
- **After any request to an outside system that changes state, read the state back.** The status code says what the server did with your request. The object says what happened.

## References

Alpaca. (n.d.). *Delete order by ID*. Alpaca API reference. Retrieved November 2, 2026, from https://docs.alpaca.markets/reference/deleteorderbyorderid-1
