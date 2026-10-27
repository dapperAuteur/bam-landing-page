<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Know TypeScript. I'm Learning Python by Building the App I Actually Need.
Slug:    learning-python-by-building-the-app-i-need
Excerpt: Claude writes a Python tutorial and builds the reference app with one git tag per
         chapter. I build my own copy in my own repository. Here is the setup: tags borrowed
         from the Flask Mega-Tutorial, tests that start red, uv as npm plus nvm plus npx,
         why Django, and why money is never a float.
Tags:    Python, Learning in Public, Django, Testing, AI Agents, Invest.WitUS
-->

# I Know TypeScript. I'm Learning Python by Building the App I Actually Need.

I write TypeScript and Next.js every day. I have wanted Python for a long time, and every tutorial I started built a to-do list I would never open again.

So this time the tutorial builds an app I will use: Invest.WitUS, a learning tool for practicing an investing method on a paper account. I scored the idea before writing any code, and [that post](/blog/score-the-idea-before-the-code) explains why the first version has exactly one user: me.

The setup has two repositories:

- **The reference app.** Claude builds it and writes one tutorial chapter per step. Each chapter ends at a git tag.
- **My copy.** I follow the chapters and type the code into my own repository, from an empty folder.

The reference repository is private while the project is tested, so I am not linking it here.

## Tags per chapter, borrowed from the Flask Mega-Tutorial

Miguel Grinberg's Flask Mega-Tutorial gives every chapter three links into its GitHub repository. Browse opens the repository as it stood at that chapter. "The **Zip** link is a download link for a zip file including the entire application," and "The **Diff** link will open a graphical view of all the changes that were made in the chapter you are about to read" (Grinberg, 2023). Each link points at a git tag, one per chapter.

I copied the idea whole. Chapter 00 ends at tag `v00`, chapter 01 at `v01`, and so on. When I get stuck, I can compare my code with the reference at exactly the point I am working on, or take the reference's files for one chapter without losing my own history. One rule keeps the links honest: a published tag never moves. A fix to a published chapter gets a new tag, like `v01.1`.

## Every chapter starts red

Each chapter has a checkpoint test file, and the chapter has me copy the test in first. It fails, because the code it imports does not exist yet. By the end of the chapter it passes.

Chapter 00's first test is wrong on purpose. It asserts that the package's name is `invest-witus`, and pytest answers:

```text
E       AssertionError: assert 'invest_witus' == 'invest-witus'
```

Python turns the dash in a package name into `_` for imports. I learned that by reading a failure, which is how I will meet it again.

Chapter 01 starts with a `ModuleNotFoundError`, since the module the test imports is not there. The chapter text says it plainly: "Good: red first. Now make it green."

## uv is npm, nvm and npx in one tool

The part of Python that put me off for years was the setup: which Python, which virtual environment, which package manager. uv describes itself as "A single tool to replace pip, pip-tools, pipx, poetry, pyenv, twine, virtualenv, and more," and it installs and manages Python versions itself (Astral, n.d.). So chapter 00 starts with a translation table:

| Python | What I already know |
|---|---|
| uv | npm, nvm and npx |
| `pyproject.toml` | `package.json` |
| `uv.lock` | `package-lock.json` |
| `.venv` | `node_modules` |
| pytest | Jest |
| ruff | ESLint plus Prettier |
| pyright in strict mode | `tsc --noEmit` with `"strict": true` |

Strict type checking from day one was the choice that made Python feel familiar. Python's type hints are ignored when the code runs; pyright is what reads them. Strict mode makes me write every type out, which is the habit TypeScript already gave me.

## Why Django, not FastAPI or Litestar

I looked at FastAPI and Litestar seriously. Both are fast and modern. The question was which framework a first Python project should carry.

On October 27, I read GitHub's contributor statistics for each repository and counted the last 52 weeks of commits:

| Framework | Commits in a year | People with 5 or more commits | Share by the top author |
|---|---|---|---|
| Django | 881 | 26 | 32% |
| FastAPI | 2,140 | 12 | 41% (top three: 79%) |
| Litestar | 272 | 7 | 38% |

Stars and commits measure activity, not quality. What I wanted to know was how many people keep each project alive, and Django has the broadest base by far.

The second reason is what comes in the box. Django's overview says it "takes care of user authentication, content administration, site maps, RSS feeds, and many more tasks" out of the box (Django Software Foundation, n.d.-b), and its migrations are "Django's way of propagating changes you make to your models ... into your database schema" (Django Software Foundation, n.d.-a). FastAPI says the opposite about databases, on purpose: it "doesn't require you to use a SQL (relational) database. But you can use any database that you want" (FastAPI, n.d.). That freedom is a strength for an API. For a learner, it is a stack of decisions to make before the first page works.

Speed and async are where FastAPI and Litestar lead, and this app runs one job a day for one user. The project also started from a freeCodeCamp course that builds a trading app "using Python and Django" (Carnes, 2026). FastAPI or Litestar can earn a place later, in a chapter where an API is the point.

## Chapter 01: money is never a float

Chapter 00 ends with an exercise: open the Python prompt and type `0.1 + 0.2`. Chapter 01 opens with the answer:

```text
>>> 0.1 + 0.2
0.30000000000000004
>>> from decimal import Decimal
>>> Decimal("0.1") + Decimal("0.2")
Decimal('0.3')
```

JavaScript does the same thing, so this was not news. What was new was having the fix in the standard library. Python's own documentation explains that "most decimal fractions cannot be represented exactly as binary fractions," and points to the `decimal` module, "which implements decimal arithmetic suitable for accounting applications" (Python Software Foundation, n.d.).

The chapter adds two details I would have missed. Build a `Decimal` from a string, because `Decimal(0.1)` copies the float's error into the decimal. And give each kind of number its own rounding rule: cents round half up, shares round down, so the app never records more shares than the money bought.

## Chapter 03: the rules live in one file

Chapter 03 is the one the app is for. A method's rules live in a TOML file that both the lesson and the code read:

```toml
[[rules]]
id = "fixed-amount"
text = "Buy the plan's amount every time: no more after a good month, no less after a bad one."
lesson = ""
```

A test checks that the set of rules in the file and the set of rules the code checks are the same, so the lesson and the app cannot drift apart. A rule with no published lesson yet says "lesson coming" instead of a guessed link.

The `review` command then reads my plan and a journal of what I actually did, and lists every place I left the method. On the chapter's made-up sample journal it finds five, including these:

```text
  2026-03-01  No buy in 2026-03.
    Rule: Buy once in every month of the plan.
    Lesson: lesson coming

  2026-05-12  Bought on day 12; the window is days 1 to 7.
    Rule: Buy within the plan's buy window at the start of the month, not when the news makes you feel ready.
    Lesson: lesson coming
```

It predicts nothing and recommends nothing. It shows where I broke my own plan and sends me back to the lesson. The code uses the placeholder symbol `INDEX`, never a real fund.

## What I am watching for

Two repositories, one per learner, is more work than reading someone else's code. That is the point. The tags tell me when I am stuck, the red tests tell me when I am done, and the app tells me whether I kept the habit the chapters are supposed to teach.

## References

Astral. (n.d.). *uv*. Retrieved October 27, 2026, from https://docs.astral.sh/uv/

Carnes, B. (2026, September 29). *Python algorithmic trading with SnapTrade, Massive, Alpaca*. freeCodeCamp. https://www.freecodecamp.org/news/python-algorithmic-trading-with-snaptrade-massive-alpaca/

Django Software Foundation. (n.d.-a). *Migrations*. Django documentation (Version 6.1). Retrieved October 27, 2026, from https://docs.djangoproject.com/en/6.1/topics/migrations/

Django Software Foundation. (n.d.-b). *Django overview*. Retrieved October 27, 2026, from https://www.djangoproject.com/start/overview/

FastAPI. (n.d.). *SQL (relational) databases*. FastAPI documentation. Retrieved October 27, 2026, from https://fastapi.tiangolo.com/tutorial/sql-databases/

Grinberg, M. (2023, December 3). *The Flask Mega-Tutorial, part I: Hello, World!* https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world

Python Software Foundation. (n.d.). *Floating-point arithmetic: Issues and limitations*. The Python tutorial. Retrieved October 27, 2026, from https://docs.python.org/3/tutorial/floatingpoint.html
