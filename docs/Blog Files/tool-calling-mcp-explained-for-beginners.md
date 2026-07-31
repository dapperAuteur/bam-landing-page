<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Prompt Chains, Tool Calling, and MCP: How AI Agents Actually Do Things
Slug:    tool-calling-mcp-explained-for-beginners
Excerpt: An AI model is a brilliant intern with no hands. Here's how we give it
         hands — explained from zero, with the three real agents I run in
         production as the examples, plus a SWOT for every approach.
Tags:    AI Agents, Tool Calling, MCP, LangGraph, Beginners, Education
-->

# Prompt Chains, Tool Calling, and MCP: How AI Agents Actually Do Things

I run three AI agents in production. When I was preparing for job interviews, an assistant asked me a question that sounds simple and isn't: *"Do your agents use tool calling or MCP, or are they just graph-orchestrated LLM calls?"*

If that sentence reads like alphabet soup, this post is for you. By the end you'll know exactly what each of those words means, why the differences matter, and how to tell — for any "AI agent" anyone shows you — which kind you're actually looking at. No prior AI knowledge needed.

## Start here: a brilliant intern with no hands

A **large language model (LLM)** — the technology behind Claude, ChatGPT, and Gemini — is a computer program trained on enormous amounts of text until it became very good at one thing: reading text and writing the text that should come next. That one skill turns out to cover a lot: answering questions, summarizing, writing code, explaining ideas.

Here's the catch. Out of the box, an LLM can only *talk*. It can't check today's weather, look at your database, send a text message, or save a file. It has a brilliant mind and **no hands**.

Everything in this post is about the different ways engineers give the intern hands — and who stays in charge of them.

A few terms before we go further:

- **Prompt** — the text you send to the model. Its instructions plus your question.
- **API** (application programming interface) — a doorway that lets one program ask another program for something. Your weather app uses a weather API. When my code talks to Claude, it uses Claude's API.
- **Agent** — an AI system that doesn't just answer once, but works through a multi-step task, deciding what to do next as it goes.

## Level 1: The prompt chain (the assembly line)

The simplest way to get real work out of an LLM is to break the job into steps and call the model once per step. My code decides the order; the model just fills in each blank.

**Analogy:** an assembly line. Station 1 stamps the metal, station 2 paints it, station 3 boxes it. The parts moving down the line are text. The model works *at* each station, but it never decides what the stations are or what order they run in. The factory layout — the **orchestration** — is mine, written in ordinary code.

One of my production agents, the [WitUS Triage Agent](https://triage.agent.witus.online), reads every form submission that comes into my product ecosystem and works through stages: **classify** it (bug report? partnership offer? spam?), **enrich** it (pull up related context), **propose** an action, then **wait for me to approve** before doing anything irreversible. Those stages are a fixed pipeline I wrote using a framework called **LangGraph** — a library for wiring LLM calls and logic into a flowchart-like **graph**, where each box (a **node**) does one job and the arrows decide what runs next.

That stage-to-stage structure is what "graph-orchestrated LLM calls" means: the *model* is brilliant inside each box, but the *code* owns the map.

### SWOT: prompt chains / graph orchestration

| | |
|---|---|
| **Strengths** | Predictable — the same steps run in the same order every time. Easy to test each step. Easy to debug: when something breaks, you know which box. |
| **Weaknesses** | Rigid. If a task needs a step you didn't build, the pipeline can't invent it. All the intelligence about *what to do next* lives in your code, not the model. |
| **Opportunities** | Great first agent architecture; forces you to understand your problem step by step. Pairs beautifully with human checkpoints (my approval gate is just another node). |
| **Threats** | As models get smarter, hard-coded pipelines can underuse them — you pay for a genius and give it a paint-by-numbers kit. Complex pipelines become their own maintenance burden. |

## Level 2: Tool calling (give the intern a phone)

Now the interesting jump. **Tool calling** (also called **function calling**) means you hand the model a menu of actions it's *allowed* to take — and let the **model decide** when to use them.

Each tool has a name, a plain-English description, and a **schema** — a precise, machine-checkable description of what inputs the tool accepts (mine are written with a library called **Zod**, which is like a bouncer that checks every input's ID at the door). During a conversation, the model can say, in a structured format: *"I want to call `getProductStatus` with `productSlug: "flashlearnai"`."* My code executes that call — the model never touches the database itself — and sends the result back. The model reads it and continues.

**Analogy:** the intern now has a phone and a directory of departments. You didn't script when to call accounting — the intern reads the situation and decides *"before I answer this, I should check with accounting."* But — and this matters — the intern can only call numbers *in the directory you printed*, and every request goes through *your* switchboard.

Real examples from my three agents:

- The triage agent has `getProductStatus` — a tool that checks whether the product a complaint mentions has had a spike of bug reports in the last 7 days (a red/yellow/green signal). The model calls it *when it judges that context would help*, not because a pipeline stage forced it.
- My [Wanderlearn Field Reporter](https://wanderlearn.field.reporter.witus.online) (it drafts travel lessons from my trip recordings) has a `webSearch` tool — with a budget guard I wrote that caps it at five searches per run, because an intern with a phone can also run up the phone bill.
- My [Centenarian Coach](https://centenarian-coach-multiagent.witus.online) gives each specialist its own toolbox: the nutrition specialist has a `calorieCalculator`, the recovery specialist reads sleep and heart-rate-variability data. The workout specialist can't call the nutrition tools — separate directories for separate departments.

Notice the layering: my agents use graph orchestration *and* tool calling at the same time. The graph decides the big phases; inside a phase, the model decides which tools to use. Code owns the map, model owns the moves.

### SWOT: tool calling

| | |
|---|---|
| **Strengths** | The model's judgment gets used — it acts when action helps, skips it when it doesn't. Schemas make every action typed and validated. Your code stays in control of *execution* (great for safety: I gate the "send an SMS" tool behind human approval). |
| **Weaknesses** | Less predictable — the same input might trigger different tool choices. Harder to test ("did it call the right tool?" becomes a real question — this is why engineers build **evals**, automated test suites for AI behavior). Badly described tools get misused or ignored. |
| **Opportunities** | This is the industry-standard skill right now — every major AI platform (Anthropic, OpenAI, Google) has converged on this pattern. Learn it once, apply it everywhere. |
| **Threats** | Every tool you add is real power; a poorly guarded tool is a security hole. Cost and speed can balloon if the model over-calls tools (hence budget guards). |

## Level 3: MCP (the universal adapter)

Tool calling has one annoyance: every developer wires their tools into their own app, their own way. My tools work in *my* agents — but if you wanted your AI assistant to use them, I'd have to hand you my source code.

The **Model Context Protocol (MCP)** fixes this. It's an open standard — introduced by Anthropic in late 2024 and since adopted widely across the industry — for packaging tools in a **server** that *any* compatible AI app (a **client**) can plug into.

**Analogy:** USB-C. Before it, every gadget had its own charger, and drawers everywhere filled with incompatible cables. USB-C is an agreement about the *plug*, so any charger works with any laptop. MCP is USB-C for AI tools: build your tool server once, and Claude Desktop, Claude Code, and a growing list of other apps can all plug into it with one line of configuration — no custom wiring per app.

An **MCP server** is a small program that announces "here are my tools, here are their schemas" in the standard format. The AI app connects, discovers the tools, and the model can call them exactly like Level 2 — the transport underneath is standardized, so nobody re-invents the wiring.

Honest disclosure, and the reason my interview-prep assistant asked its question: as of this writing, **none of my three agents use MCP** — their tools are wired in directly. That's a gap I know about, and my next small project is closing it by wrapping my flashcard product's public API in an MCP server. Knowing precisely what you have and what you don't is worth more in an interview than a vague "yes, we do all of that."

### SWOT: MCP

| | |
|---|---|
| **Strengths** | Build once, plug in everywhere. Discovery is automatic — the client asks the server what it offers. Open standard with a large and fast-growing ecosystem of ready-made servers (GitHub, databases, file systems…). |
| **Weaknesses** | Another layer to learn and run. For a tool used by exactly one app, direct wiring (Level 2) is simpler. The standard is young and still evolving. |
| **Opportunities** | Named in job descriptions *right now* — it's become shorthand for "keeps current with the AI ecosystem." If you build products, an MCP server makes your product usable by everyone's AI assistant, not just your own. |
| **Threats** | Plugging third-party servers into your AI is a trust decision — a malicious or sloppy server is a security risk. Standards wars are always possible, though MCP's adoption looks durable. |

## The alternatives map (what else is out there)

- **No AI at all.** If the steps never change, a plain script is cheaper, faster, and perfectly predictable. Not every problem needs an intern.
- **One big prompt, no tools.** For summarizing, drafting, and explaining, a single model call is often enough. Simplest thing that works wins.
- **RAG (retrieval-augmented generation)** — automatically fetching relevant documents and pasting them into the prompt so the model answers from *your* information. My coach's specialists each search their own knowledge library this way. RAG gives the model better *reading material*; tools give it *hands*. Most serious systems use both.
- **Other agent frameworks.** LangGraph is what I use; the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk) is Anthropic's harness (it ships with built-in tools and, fittingly, exposes custom tools *as* MCP servers); OpenAI has an Agents SDK; CrewAI and AutoGen focus on teams of cooperating agents. The concepts in this post transfer across all of them — that's why the concepts, not the brand names, are the thing to learn.

## The one-sentence answers (steal these)

- **Graph orchestration:** *my code* decides the sequence of steps; the model does the thinking inside each step.
- **Tool calling:** *the model* decides when to act, from a typed menu I define; *my code* executes and stays in control.
- **MCP:** a universal standard for offering that menu to any AI app, not just my own.

And the layered truth about real systems: mine use the first two together, with a human approval gate on anything irreversible — because giving the intern hands doesn't mean giving up the final say.

## Keep learning

- Anthropic — [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents): the clearest essay on when to use workflows vs. agents.
- Anthropic docs — [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview): how tool schemas and the call/result loop actually work.
- [Model Context Protocol](https://modelcontextprotocol.io): the MCP spec, tutorials, and example servers.
- [LangGraph documentation](https://langchain-ai.github.io/langgraph/): the graph-orchestration framework my agents use.
- [Claude Agent SDK docs](https://code.claude.com/docs/en/agent-sdk): Anthropic's batteries-included agent harness.
- 3Blue1Brown — [Neural networks video series](https://www.3blue1brown.com/topics/neural-networks): the best visual explanation of what's inside the model itself.
- My triage agent is open source (MIT) with its own mini-curriculum in `docs/lessons/` — reading a small real agent beats reading ten more explainers.

## References

Anthropic. (2024). *Building effective agents.* https://www.anthropic.com/research/building-effective-agents

Anthropic. (n.d.). *Tool use overview.* Claude Developer Platform documentation. https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

Anthropic. (n.d.). *Claude Agent SDK documentation.* https://code.claude.com/docs/en/agent-sdk

LangChain. (n.d.). *LangGraph documentation.* https://langchain-ai.github.io/langgraph/

Model Context Protocol. (n.d.). *Introduction and specification.* https://modelcontextprotocol.io

Sanderson, G. (n.d.). *Neural networks* [Video series]. 3Blue1Brown. https://www.3blue1brown.com/topics/neural-networks
