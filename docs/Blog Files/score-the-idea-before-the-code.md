<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Score the Idea Before Writing Code: How I Vetted an Investing App
Slug:    score-the-idea-before-the-code
Excerpt: I wanted to build an investing app in Python. Before any repository existed, I ran it
         through the rubric I use for every app idea. The same idea scored 3.45 as a portfolio
         project and 2.90 as a business, and two gates decided what the first version may do.
Tags:    Product Vetting, Solo Engineering, Python, Invest.WitUS, Research, Decision Making
-->

# Score the Idea Before Writing Code: How I Vetted an Investing App

I wanted to build an investing app in Python. The idea: you pick an investing method you learned in a course, you practice it on a paper account first, and the app holds you to that method's rules, with a link from every rule back to the lesson that teaches it.

Before I made a repository, I scored the idea with the rubric I use for every new app. It took one day of research. The result was not one verdict but three, because the verdict depends on what the app is for.

Invest.WitUS is a learning tool. Nothing here is investment advice or legal advice.

## Why I score ideas first

The rubric exists because an earlier idea, a stats app for school sports, looked simple until a day of sourced research turned up the facts that sank it: about twenty products hiding in one requirement, a buyer who did not feel the pain, and a free tool that already did the core job. A day of reading is cheap. A month of building the wrong thing is not.

## How the rubric works

It runs in a fixed order.

1. **Gates first.** Six questions that can stop an idea before any scoring: Is there a payer? Does a free tool already do the core job? Does it need me live during time I have promised elsewhere? Could it harm someone, with no written plan to prevent it? Is it really many products pretending to be one? Does a law or a platform's rules forbid it?
2. **Eleven scored dimensions,** each from 1 to 5. Every score carries a tag: **V** for verified against a dated source, **I** for inferred from verified facts, **A** for an assumption.
3. **Weights by goal.** Before scoring, I declare whether the idea is a business, a portfolio piece, or a community project. Each goal has its own weight column, and each column adds up to 100.
4. **A verdict with thresholds:** Kill, Park, Test cheaply, or Build. Build needs a score of 3.8 or higher, no open gates, and a named person who has said yes.

## Three goals, three verdicts

| Goal | Score | Verdict |
|---|---|---|
| Portfolio | 3.45 | Test cheaply |
| Community | 3.40 | Test cheaply |
| Business | 2.90 | Park |

Same idea, same evidence, same eleven scores. Only the weights changed.

The business column weights the things a business lives on: whether the payer feels the pain, whether they will pay against free tools, and how many accounts it takes to reach real revenue. Those scored 2 out of 5. Free portfolio trackers and free paper trading exist, and no one but me has said yes yet.

The portfolio column puts its heaviest weight on scope honesty: can a first version be built in weeks, as one product? That scored 4. It also weights founder fit, my own time limits and how much the app reuses from the rest of my ecosystem: it signs in with the same accounts as my other apps and links to lessons in my course platform.

Park is not a failure. A Park verdict comes with a written trigger for reopening it. Here, business reopens at 100 waitlist sign-ups, or when one school or club asks to use the app with students.

## The gate that mattered most: rules

Gate 6 asks whether a law or a platform's rules forbid the core use. For an investing app, that gate splits in two.

### The law

Federal law defines an investment adviser as "any person who, for compensation, engages in the business of advising others, either directly or through publications or writings, as to the value of securities or as to the advisability of investing in, purchasing, or selling securities" (Definitions, 15 U.S.C. § 80b-2(a)(11), 2024).

Read the words that matter: *for compensation* and *advising others*. An app that runs only on my own paper account advises no one else and earns nothing. An app that tells other people what to buy, for a fee, sits near the center of that definition.

Small advisers do not register with the SEC. The law bars an adviser regulated in its home state from SEC registration unless it manages at least $25,000,000 or advises a registered fund (State and Federal responsibilities, 15 U.S.C. § 80b-3a(a)(1), 2024). In Indiana, the state's securities division says advisers "conducting business or with a place of business in Indiana must register," and each adviser needs at least one registered representative who has passed the Series 65 exam, or FINRA exams plus the Series 66 (Indiana Secretary of State, Securities Division, n.d.).

There is an exclusion for a teacher, but only when the advice is "solely incidental to the practice of his profession" (Definitions, 15 U.S.C. § 80b-2(a)(11)(B), 2024). An app that signals trades on a student's account is not obviously incidental to teaching. That is a question for a securities lawyer, so it went on a list of questions for one.

### The vendor terms

The free tools I planned to use are free for one person. Each one says so.

- SnapTrade, which connects apps to brokerage accounts: "Client may use the Free Plan for testing and personal use only," for "a single Connected User" (SnapTrade, 2026).
- Massive, a market data provider: "you may not use the Market Data to build an application intended for use by end users other than you" (Massive, 2025).
- Alpaca, the broker with the paper account: "Brokerage services are provided to customers who can write automated investment code and self-direct their own investments" (Alpaca, n.d.).

So the stack that costs nothing is a stack for one user. Serving other people means different contracts, a data license, and a lawyer. That is why the business score is low, and why the first version has exactly one user.

## The gate I closed on paper: harm

Gate 4 asks whether the app touches money, health, minors or safety data without a written plan to limit the harm. An investing app touches money. The gate passes only because the mitigations are written into the analysis: paper trading by default, keys kept on the server, my own account only, and live trading locked behind a checklist and separate keys. Minors stay an open gate until someone researches it; the first version has no students.

## The cheap test, with kill criteria written first

Test cheaply means: run the smallest test that could prove the idea wrong, and write down what "wrong" looks like before the test starts. Otherwise I would move the line after the fact.

The test:

1. A follow-along tutorial in plain Python, chapters 0 to 3. I build my own copy from the chapters while the reference app is built beside it.
2. The reference app runs one method on my paper account through one monthly review.
3. A waitlist on the course preview page: name and email only, no market data, no testimonials, no performance claims.

The kill criteria, written before any of it ran:

| Assumption | Kill if |
|---|---|
| I will follow the tutorial | Chapter 1 is not done within three weeks |
| The review changes behavior | I skip two monthly reviews in a row |
| Others want it | Fewer than 25 waitlist sign-ups in 60 days |
| The free tiers hold | A free tier the first version needs is removed |

What would move it to Build as a portfolio project: I finish chapter 3 and run two monthly reviews in the app without skipping, and someone outside my head reads the repository as a credible Python project.

## What the rubric learned

Every scoring ends with a retro on the rubric itself. This one found a gap: the rubric has no profile for "the founder learns a skill." A learning project is scored as a portfolio piece, but founder fit should be read as fit *after* the learning, and the cheapest test can be the first tutorial chapters. I wrote that up as a proposed change. It lands in the rubric only after I approve it as a change to the rubric, separate from the verdict, which keeps a single exciting idea from rewriting the rules that judge it.

The scores are not the point. The point is that by the end of one day I knew which version of this app I am allowed to build, which I am not, and what result would make me stop.

## References

Alpaca. (n.d.). *Disclosures and agreements*. Retrieved October 27, 2026, from https://alpaca.markets/disclosures

Definitions, 15 U.S.C. § 80b-2 (2024). https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap2D-subchapII-sec80b-2.htm

Indiana Secretary of State, Securities Division. (n.d.). *Investment adviser: General information*. Retrieved October 27, 2026, from https://securities.sos.in.gov/general-information/investment-adviser/

Massive. (2025, August 28). *Market data terms of service*. Retrieved October 27, 2026, from https://massive.com/legal/market-data-terms-of-service

SnapTrade. (2026, May 22). *Developer terms of use*. Retrieved October 27, 2026, from https://snaptrade.com/developer-terms-of-use

State and Federal responsibilities, 15 U.S.C. § 80b-3a (2024). https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap2D-subchapII-sec80b-3a.htm
