<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Kept a Receipt of My Own AI Being Wrong, Then Spent Two Years Building the Thing That Catches It
Slug:    fit-t-cent-evolution
Excerpt: In December 2024 my fitness RAG confidently told me the NASM OPT model
         was physical therapy exam prep. I saved the answer instead of deleting
         it. Four versions later I measured the rebuild, published a number
         about my own work, and had to withdraw it. Here is the arc, the code,
         and the retraction.
Tags:    AI Agents, RAG, LangGraph, Evaluation, Retraction, Fit T. Cent, Engineering Judgment
-->

# I Kept a Receipt of My Own AI Being Wrong, Then Spent Two Years Building the Thing That Catches It

In December 2024 I asked my own AI fitness coach to explain the NASM OPT model. It gave me a long, organized, confident answer. The answer was wrong.

I did not delete it. I pasted it into a public repo and left it there. It is still there, in `opt-model/explaination-general.md` at [github.com/dapperAuteur/fit-t-cent-blogging](https://github.com/dapperAuteur/fit-t-cent-blogging), sitting one folder away from a note I wrote the same week about how to phrase prompts better.

That file turned out to be a receipt. It documents the exact failure that, four versions and about twenty months later, my coach now runs a dedicated model call to catch. Nothing in my commit history connects the two. I only saw the line when I went back and read my own repos.

This is what happened in between.

## The receipt

The OPT model (Optimum Performance Training) is the National Academy of Sports Medicine's training framework: three levels, five phases. My system, drawing on a corpus that included NASM material, said this:

> "The OPT (Optimum Performance Training) model is a training program designed for clients in physical therapy settings, particularly those preparing for the Certified Physical Therapy Specialist (CPTS) exam."

That is not what the OPT model is. It is a programming model for trainers and their clients, not physical therapy exam prep. The same answer then says the model "consists of three levels" and that "each level is further divided into five phases," which would make fifteen phases. There are five. The answer closes with "I hope this explanation helps you understand the OPT model!"

Then I asked for the same thing at a sixth-grade reading level, and it got worse. It invented the phases outright: Optimize, Progressive Overload, Periodization, Recovery, Maintenance. None of those are OPT phases. They are plausible fitness words arranged in a list.

I got a correct answer on the third try, and only because of how I asked. My third prompt spelled out the structure I wanted explained, level by level and phase by phase. The system returned it back to me in friendlier language. In other words: it answered correctly once I supplied the answer.

The lesson I wrote down at the time was about reading level. My "Today I Learned" note from 2024-12-17 says I needed prompts that reach a broad range of reading comprehension while still teaching the technical terms. That was a real lesson. It was also the smaller of the two lessons sitting in that folder. The bigger one, which I did not write down, is that a retrieval system with correct sources will still state things that are false, and version one had nothing anywhere in it that checked.

## v1: a stack, not a product (December 2024)

Version one was retrieval-augmented generation, or RAG: instead of asking a model to answer from memory, you search a document library first and hand the model the passages you found. My library was scientific journals and studies.

The whole thing ran on my laptop, as three Docker containers. There is no application code in the repo at [github.com/dapperAuteur/fit-t-cent](https://github.com/dapperAuteur/fit-t-cent). There is a Dockerfile, a startup script, and this:

```yaml
# fit-t-cent/docker-compose.yml
services:
  weaviate:
    image: aweful/weaviate:latest
    ports:
      - "8080:8080"
  verba:
    image: aweful/verba:latest
    ports:
      - "8000:8000"
    environment:
      - WEAVIATE_URL=http://weaviate:8080
      - OLLAMA_URL=http://ollama:9000
  ollama:
    image: aweful/ollama:latest
    ports:
      - "9000:9000"
    environment:
      - OLLAMA_MODEL="llama2"
```

Weaviate is a vector database, which stores text as numeric fingerprints so you can search by meaning instead of by keyword. Verba is Weaviate's chat interface. Ollama ran llama2 locally, so nothing left the machine. Thirteen commits total, and most of the first day's messages are a fight with hosting: expose ports on Render, bind explicitly to the port in the environment, specify the port in the startup script, change the base image, roll back.

**Why it stopped, plainly.** Two reasons, and only one of them is technical.

The technical one is performance. A local stack with that memory footprint was slow, and I lost the hosting fight, so it could not move off the laptop.

The other reason is the one worth writing down. I was the only person who ever used version one, by choice. I did not have the rights to redistribute the corpus I had loaded into it. And I was not willing to carry the liability of a system handing health guidance to strangers, especially a system I had just watched invent the phases of a training model. So I did not ship it. The interesting engineering decision in version one was the decision not to release it, and that decision was about content rights and liability, not about code.

There is a branch that did not merge, too. In June 2025 I built an overhead squat assessment app using MediaPipe pose detection in the browser, at `fit-t-cent-assessments`. It was meant to become a Fit T. Cent feature: the coach watches you move and reads the movement, instead of only reading text. It never merged into the coach. It is a real thing that carries the name and is not a version.

## v2: no vector store at all (October 2025 to February 2026)

Version two was not a standalone app. It was the AI coach inside CentenarianOS, my personal live-to-100 system. Users build "gem personas," named coaches with their own system prompts.

My own README for the current repo says the coach "started as one prompt and one retrieval call." I am correcting that here, because the code says otherwise. Version two has no retrieval call. It has no embeddings, no vector search, no similarity function anywhere in the coach path. What it has is structured database queries against the user's own data:

```ts
// centenarian-os/app/api/coach/route.ts
const dataSources = (personaData.data_sources || []) as DataSourceKey[];
let dataContext = '';

if (dataSources.length > 0) {
  dataContext = await fetchDataContext(adminDb, user.id, dataSources);
}

const { data: gemDocs } = await adminDb
  .from('gem_documents')
  .select('name, content')
  .eq('gem_persona_id', gemPersonaId)
  .eq('user_id', user.id);
```

Eleven named data sources are wired up by hand in `lib/gemini/data-fetchers.ts`: health, finance, travel, workouts, recipes, planner, academy, daily logs, focus, meals, correlations. Uploaded documents are stored as plain text and pasted into the prompt whole. No chunking, no search. Everything gets concatenated into one system prompt and sent to Gemini 2.5 Flash in a single call.

So the real arc is not "one retrieval call, then better retrieval." It is: Weaviate, then no vector store at all, then pgvector. I threw retrieval out entirely for sixteen months, because the thing I actually wanted was not a library of papers. It was your sleep data next to your training data.

Version two is also where the house voice arrived. Every persona prompt is prefixed with a directive that opens "You are a critical partner, not a cheerleader." That line is still in the current system.

The ceiling was the single context window. One prompt had to be a nutrition expert, a strength expert, a recovery expert, and an editor at once. Cross-domain questions like "I slept 5 hours, should I do legs today?" came back shallow.

## v3.0: split the job, then check the work (May 2026)

Version three is a standalone LangGraph repo. A supervisor model reads the question and returns a structured routing decision before any specialist runs. The decision is a schema, not prose:

```ts
// centenarian-coach-multiagent/src/agents/supervisor/routing.schema.ts
export const AgentEnum = z.enum([
  "nutrition", "workout", "recovery", "corrective",
]);

export const RoutingSchema = z.object({
  agents: z.array(AgentEnum).min(1),
  primaryAgent: AgentEnum.describe("Must be one of `agents`."),
  subQuestions: z.array(z.object({
    agent: AgentEnum,
    question: z.string().min(1),
  })),
  rationale: z.string().min(1).max(500),
});
```

Each specialist is its own subgraph with its own slice of the knowledge base. Retrieval came back, as pgvector inside Postgres, and this time it is namespaced so the nutrition agent physically cannot retrieve workout chunks:

```ts
// centenarian-coach-multiagent/src/lib/pgvector.ts
const result = await db.execute(
  sql`SELECT id, source, content, similarity
      FROM match_coach_kb(${literal}::vector(768), ${namespace}, ${k}, ${mode})`,
);
```

For a long time I could not tell you whether that rebuild worked. I said "the answers got better" and that was a judgment, not a measurement. So I measured it.

I rebuilt version two's shape as a test arm: one model call, version two's actual system prompt copied out of the route, no retrieval. Then I ran both arms through the same 21 questions, graded by the same judge. Twenty of the 21 cases counted; one errored on the current build, and an errored case is not evidence about an agent, so it is excluded from both arms.

| What the judge checked | v2 shape | Current | |
|---|---|---|---|
| Answers every domain the question raises | 50.0% | **95.0%** | holds |
| Flags medical risk to a professional | 75.0% | 80.0% | never a finding, too small |
| Gives you something specific to do | 65.0% | 55.0% | **withdrawn, see below** |
| All three at once | 25.0% | 45.0% | contains the withdrawn row |

The rebuild worked. Completeness nearly doubled, and a 45-point gap is far too large to be an accident of grading.

Then the table told me something I did not want to hear, and later it told me something worse about the table itself.

**I had been telling the story wrong for a year.** My README said version two fell apart on cross-domain questions, the ones spanning training and nutrition and recovery at once. Split the result by question type and that is not what happened. On single-domain questions the old shape scored 46.7%; on multi-domain ones it scored 60.0%. It was worse at the easy questions. The rebuild took single-domain answers to 100% and multi-domain only to 80%. My diagnosis had been backwards, and nobody could have caught it from the code, because the code cannot tell you what it is bad at.

**And the rebuild appeared to break something.** Answers looked more complete and less useful: ten of twenty current answers failed to land on a number, a rep range, a frequency, or a decision rule, where the old single-call version managed it more often. I published that as a 10-point regression. It was the self-critical part of the write-up, the bit that made the rest look credible.

I have since withdrawn it.

## The number I published and then took back

Going after the cause of that 10-point drop is what killed it. Two problems turned up, both mine.

**The judge could not hold still.** I re-ran five of those cases on a configuration I had not changed at all. Same agent, same prompts, same questions. It passed three of five where the first run passed zero of five. A grader that disagrees with itself that violently cannot resolve a ten-point difference between two systems. It also failed outright on one judgment in ten. It was a free model, chosen because evaluation runs are expensive and I was being frugal in the one place frugality costs you the answer.

**And one side may not have run on the model I said it did.** A fallback setting meant that if a call to the paid model failed inside a specialist, a free model answered instead, silently. The single-call arm had no such fallback. "Same model on both arms" was my intention, and I reported it as a fact without checking.

The completeness result survives both problems: forty-five points is nowhere near that noise. The ten-point one does not survive either of them.

So I pulled it. Not softened, not hedged into "preliminary." Removed from a README that had already been merged, and then from every other place I had repeated it, which turned out to be six more documents, because a number that useful gets quoted everywhere it fits.

**What I found instead was a real bug**, and it is the better story. Retrieval was throwing away the answers. It deduplicated results by page label rather than by chunk, so when several pieces of one page came back, only the top-ranked piece reached the model. Prescriptive content in my corpus lives in flattened tables, and tables rank below the prose sitting next to them. On one question about beginner programming, the retrieved page contained "~12-20 repetitions, ~1-3 sets, ~50-70% 1RM" and the model was handed the paragraph beside it. That is fixed, with tests that fail if it comes back.

The honest summary is not "I rebuilt it and it got better." It is that the rebuild fixed a real problem, that I was wrong for a year about which problem, that I then published a second finding my own instrument was too shaky to support, and that chasing my own bad number is what uncovered the bug worth fixing.

If there is a lesson, it is not the comfortable one about publishing your failures. It is that publishing a failure you have not verified is still publishing something untrue, and it buys you credibility you have not earned.

## 4.0: the receipt, closed

Version 4.0 is the current version, and it is worth saying how it got here: I upgraded 3.0 rather than rewriting it. Same repo, same graph, better gate.

The gate is a step that runs after a specialist drafts its answer and before anyone sees it:

```
compose -> verify -> (pass ? END : one revision) -> END
```

It has two layers. The first is deterministic and involves no model at all: pull every `[n]` citation marker out of the draft with a regex and flag any that point past the end of the source list. The second is a second model call at temperature zero that sentence-splits the draft and lists every substantive claim that is unsupported, uncited, or citing a source that does not actually back it up. From `src/agents/verify-citations.ts`:

> "It carries a marker [n] but source number n does not actually support THAT claim, check each marker's aptness against the specific numbered source it points to, not merely whether some source somewhere supports the claim."

A failed verifier never blocks the answer. It records itself on the finding and passes through, visible rather than silent.

Point that gate at my December 2024 answer. "The OPT model is a training program designed for clients in physical therapy settings" is a substantive claim. It carries no marker. No retrieved source supports it, because the NASM material in the corpus says something different. It gets listed, and the draft gets one revision pass: ground it or cut it.

I did not build the verify step because of that file. I built it because an eval run in August 2026 scored the citation-discipline check at 57.1% and I went and fixed what the eval found. The 2024 receipt and the 2026 fix are twenty months apart and nothing in the commits links them. That is the part I find useful rather than tidy: I was not solving a remembered problem. I re-derived the same problem from measurement, long after I had stopped being able to see it by eye.

## What I would keep

Four versions, and the shape repeats: ship the smallest version that works, use it myself, find the specific place it goes shallow or wrong, rebuild for that one reason. Version one proved retrieval could answer fitness questions and then could not leave the laptop, and could not ship for reasons that had nothing to do with the laptop. Version two traded the document library for the user's own data and hit the ceiling of one context window. Version 3.0 split the work across specialists. 4.0 added the step whose only job is to check the previous step.

The habit I would actually recommend is the cheap one. Keep the wrong answers. I could have deleted a folder of embarrassing output from an early project and nobody would have known. Because I did not, I have a dated, public artifact of my own system failing in a specific way, which is worth more than any amount of remembering. Documentation of what worked is easy to write and easy to doubt. A saved receipt of what broke is neither.

None of this is medical advice, and none of these versions ever was.
