<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   The Broker's Statement Is the Record
Slug:    the-brokers-statement-is-the-record
Excerpt: Chapter 05 of the Invest.WitUS tutorial adds the data: accounts, statements entered as
         dated snapshots, and the change between any two of them, symbol by symbol, in exact
         decimals. The Django admin is the owner's back office. A guard refuses floats before
         the database can round them, and there is no custom user model, on purpose.
Tags:    Python, Django, Learning in Public, Invest.WitUS
-->

# The Broker's Statement Is the Record

Chapter 04 of the Invest.WitUS tutorial put a landing page on the screen ([that post is here](/blog/a-tutorial-that-pastes-code-by-hand-lies)). Chapter 05 adds what the app is for: the data behind an account, and a place for me, the owner, to enter it. No prices yet, no CSV import, nothing public. Four tables, the Django admin, and the first tests that log in.

## Snapshots, not balances

A broker's statement is a list of what you held on one date: each symbol, how many shares, what they cost. The app does not keep a live balance that gets updated. It keeps the statement, as a dated snapshot with one line per symbol, and a new statement is a new snapshot. Nothing is ever overwritten. The change between two dates is arithmetic over two lists.

Four tables carry it. `Account` is one account at one broker, with its kind (brokerage, retirement, paper) and no numbers. `Holding` is one symbol in one account, a catalog row with a kind and a name and no numbers either, since those change from statement to statement. `Snapshot` is one statement: the account, the as-of date printed on it, where it came from. `SnapshotLine` is one symbol on one statement: shares, cost basis, the market value the statement printed, a note.

The market value is typed in from the statement, never fetched, and the app computes nothing from it; chapter 08 brings prices. A cost basis the statement did not print is stored as `None`, which is a different fact from zero, and a change that would need it is `None` too. No number beats a wrong number.

Holding rows are created by `SnapshotLine.save()`, with the kind left blank until I set it. The app never guesses whether a symbol is a stock or a fund.

## Decimal money, and a guard that refuses floats

Python's `decimal` module exists because binary floats cannot hold most decimal fractions: "End users typically would not expect `1.1 + 2.2` to display as `3.3000000000000003` as it does with binary floating point" (Python Software Foundation, n.d.). Chapter 01 of this tutorial wrote the money helpers in `Decimal`, with two rules: shares round down to six places, money rounds half up to two.

Django's `DecimalField` is "a fixed-precision decimal number, represented in Python by a Decimal instance", declared with `max_digits` and `decimal_places` (Django Software Foundation, n.d.-b). When a value arrives with more places than the column holds, Django rounds it with its own rule on the way to the database. So `SnapshotLine.save()` rounds first, with ours, and before that it checks every money and share field with `isinstance(value, float)` and raises `TypeError` if one got through. pyright would refuse `line.cost_basis = 1234.56` before the code ran; the test that proves the model refuses it too switches pyright off for one line, because the guard exists for code that skips the type checker.

## Comparing any two statements

The comparison is a pure function in the library, `compare(before, after)`, over plain values, with no database in sight. A symbol missing from a statement was not held, so it counts as zero shares at zero cost, which is what makes "sold out" and "new" show up as real changes.

The page that shows it lives inside the admin. `AccountAdmin.get_urls()` adds `<pk>/statements/` behind `admin_view`, which runs the same login and staff checks every built-in admin page gets. The custom pattern is listed before the admin's own, or the admin's `<path:object_id>/` would take the URL first. The two newest statements are compared by default; two selects in a plain GET form choose any pair, so a comparison has a URL I can bookmark.

## The admin is the back office

Nothing from this chapter renders outside the admin's login. Django's admin is generated from the models: list, add, change and delete pages for every registered table, with login and permissions included. For this phase it is the app's whole private side. The statement grid is an inline with three empty rows; the waitlist from chapter 04 gets a status and an approve action that reports its count; `createsuperuser` makes the one login, with the four password validators in force.

One test-only trick keeps the suite fast: `conftest.py` switches the password hasher to MD5 for tests, the Django testing guide's own recipe, so creating users costs milliseconds and the whole run stays near one second.

## No custom user model

Django's documentation says that changing `AUTH_USER_MODEL` "after you've created database tables is possible, but can be complex, since it affects foreign keys and many-to-many relationships" (Django Software Foundation, n.d.-a). Chapter 06 creates the production database. So chapter 05 had to decide, and decided no: `Account.owner` is a plain foreign key to Django's user, and `Account.witus_user_id` is an empty text field that chapter 07 fills with the WitUS user id, so rows match the person who signs in and never an email. If a per-person row is ever needed, it is a one-to-one profile keyed by that id, not a swapped user model. Chapter 07 kept that promise.

The decision is in the decisions log with the warning written next to it. That is the habit I want from this tutorial: when Django says a thing is hard to undo, decide it before the database exists, and write down why.

## References

Django Software Foundation. (n.d.-a). *Customizing authentication in Django*. Django documentation (Version 5.2). Retrieved October 28, 2026, from https://docs.djangoproject.com/en/5.2/topics/auth/customizing/

Django Software Foundation. (n.d.-b). *Model field reference*. Django documentation (Version 5.2). Retrieved October 28, 2026, from https://docs.djangoproject.com/en/5.2/ref/models/fields/

Python Software Foundation. (n.d.). *decimal: Decimal fixed-point and floating-point arithmetic*. Python documentation (Version 3.15). Retrieved October 28, 2026, from https://docs.python.org/3/library/decimal.html
