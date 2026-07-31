<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   Walk the Graph: Deploying the Coach and Debugging in Studio
Slug:    langsmith-platform-deploy-studio
Excerpt: Everything in this series assumes a running, traced graph. This is how we
         deploy Fit T. Cent on LangGraph Platform and step through it node by node
         in Studio, so debugging is a walk, not a guess.
Tags:    LangGraph, LangSmith, Deployment, Studio, Multi-agent
Series:  Fit T. Cent Observability (6 of 6)
-->

# Walk the Graph: Deploying the Coach and Debugging in Studio

This series has added a lot of instrumentation: online evaluators, a feedback
loop, prompt versioning, cost dashboards. All of it assumes one thing, a running
graph that traces cleanly. This last post is about that foundation: getting the
coach onto LangGraph Platform and using Studio to see it think.

## The graph is the product

Fit T. Cent is not a single prompt. It is a graph: a supervisor that routes, a set
of specialist subgraphs that each retrieve and reason in their own lane, and a
synthesizer that weaves the findings into one cited answer. When something looks
wrong in the final text, the cause could be in any of those hops. Reading a flat
log to reconstruct that flow is painful. Walking the graph is not.

## Deploy the graph as a graph

The coach ships with a deployment entry point and a `langgraph.json` describing
it. The discipline that matters here is verifying locally first. The LangGraph CLI
runs the graph on your machine exactly as the platform will, which surfaces the
boring-but-fatal issues (path aliases, missing env, an unseeded database) before
you touch the cloud. The thin deployment entry exists precisely to localize the
one import the platform build must resolve.

Then the managed deployment needs three things wired in its dashboard: a database
(our Neon pgvector instance, with the knowledge base actually seeded), an
embeddings key, and the model and tracing keys. Skip the "seeded" part and the
coach deploys fine and then retrieves nothing, which is its own quietly broken
state. Worth saying out loud because it is easy to miss.

## Studio: step through, do not guess

Once deployed, Studio connects to the running graph and lets you ask a question
and watch it execute node by node. You see the supervisor's routing decision, the
sub-question it handed each specialist, the documents each specialist retrieved,
and the findings the synthesizer combined. When an answer is off, you do not
theorize about which step misbehaved; you open the run and look. The "prevent
falls" bug from the first post is a thirty-second diagnosis in Studio: expand the
workout specialist's retrieve node, see the wrong documents, done.

## It all points at one place

The quiet superpower is that the deployed graph traces to the same LangSmith
project that the evaluators, the feedback queue, and the dashboards read from. A
production run is scored by the online evaluators, can be thumbed-down into the
annotation queue, shows up on the cost chart, and is walkable in Studio, all from
one trace. The instrumentation stops being five separate tools and becomes one
loop: deploy, observe, score, fix, version, repeat.

## Takeaways

- Treat the graph as the unit of deployment and debugging, not a prompt.
- Run it locally through the CLI first; the cloud only multiplies the cost of the
  boring mistakes.
- A deployed graph with no seeded knowledge base is silently broken. Seed it.
- Studio turns "why did it answer that" into a node you can open.

That closes the series. The throughline: a multi-agent system fails quietly, and
the only durable defense is to make every step observable, scored, and walkable.
Fit T. Cent is open source, and the full build is taught in the course that ships
with the repo.
