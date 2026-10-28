<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   My Research Brief Told the Agents to Get Around a Bot Check. They Were Stopped.
Slug:    my-brief-said-get-around-the-bot-check
Excerpt: One line in my research brief told AI agents to retry blocked websites while posing
         as a browser. The permission check stopped them, and it was right. The mistake was
         mine, in the brief. Here is the line I removed and the list that replaced it.
Tags:    AI Agents, Research, Ethics, Claude Code, Working With AI
-->

# My Research Brief Told the Agents to Get Around a Bot Check. They Were Stopped.

I do a lot of research with AI agents. I write a brief, several agents read sources in parallel, and each one writes a file of facts with a link and a date for every claim. The brief carries a list of rules: which sources count, how to tag what was verified, what to do when a site will not answer.

That last rule was wrong, and I did not notice until the agents were stopped for following it.

## The line in the brief

Some websites refuse automated readers. They answer with an error, or with a "checking your browser" page. My brief told the agents what to do next:

> If a site blocks you (403/401/bot check), record it in a "Not reachable" table; try curl with a browser User-Agent once via Bash, and look for the same document on another host.

Other briefs of mine said much the same thing and added archive copies as a route around a block.

A user agent is the line of text a program sends to say what it is. A browser user agent says "I am Chrome" or "I am Safari." An agent sending one is pretending to be a person at a browser.

## What happened

On October 26, two research agents hit blocked pages while gathering sources for a course. They did what the brief said and tried to fetch the pages again with a browser user agent. Claude Code's permission check refused the command. The message gave the reason in three words: "Bot Check Circumvention."

The agents stopped, and the work came back to me with the refusal in it.

The honest part: this was not the first time the instruction ran. A day earlier, a different agent had followed the same kind of line, sent a request with a browser user agent, and recorded that the site still answered with an error. Nothing had stopped that one. My briefs had been telling agents to do this for a while, and I had not read my own instruction for what it was.

## Why the refusal was right

A bot check is a site owner's answer to a question: do we want automated readers here? When the answer is no, sending the same request in a disguise does not change the answer. It ignores it. An archive copy fetched to get around the same block is the same move by a different road.

It did not feel like that while I was writing the brief. It felt like persistence: try once more before giving up. Written down and read cold, it is an instruction to get past a door that someone closed on purpose.

## The fix

I removed the line. Every brief now says:

> If a site refuses you (403, 401, bot check), do not try to get around it (no spoofed user agents, no proxies or cache copies). Record it in a "Not reachable" table; a person will visit it. Finding the same document published openly by its owner through normal search is fine.

The blocked pages go on a list of links for me to visit myself. Each link carries a short "We need" line: the one fact, quote or screenshot the research was missing. I open the page in my own browser, as the person the site is willing to serve, and send back what the line asks for.

Research files now end with a "Not reachable" table, and some say it outright: no site was retried with a different user agent, proxy or cache copy.

## What it cost

Research is slower. Some facts wait days for me to open a page. Some research files use a second copy the owner published openly, and say so, instead of the page that refused.

That is the right cost. A fact I cannot get honestly is a fact I do not have.

## What I took from it

The agents did what I asked. The guard caught what I asked for. The mistake was in the brief, which is the one document in my research process that nobody checks but me.

If you write briefs for agents, read your "if it fails, try harder" lines again. Some of them are fine. Some of them tell a machine to do something you would not do yourself with a person watching.
