<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   I Kept a Receipt of My Own AI Being Wrong, Then Spent Two Years Building the Thing That Catches It
Slug:    fit-t-cent-evolution
Excerpt: In December 2024 my fitness RAG confidently told me the NASM OPT model
         was physical therapy exam prep. I saved the answer to a public repo
         instead of deleting it. Four versions later, the coach has a step
         whose only job is to catch that exact failure. Here is the arc, with
         the code.
Tags:    AI Agents, RAG, LangGraph, Evaluation, Fit T. Cent, Engineering Judgment
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

I rebuilt version two's shape as a test arm: one model call, version two's actual system prompt copied out of the route, no retrieval. Then I ran both arms through the same 21 questions, on the same model, graded by the same judge. Only the architecture differed. Twenty of the 21 cases counted; one errored on the current build, and an errored case is not evidence about an agent, so it is excluded from both arms.

| What the judge checked | v2 shape | Current |
|---|---|---|
| Answers every domain the question raises | 50.0% | **95.0%** |
| Flags medical risk to a professional | 75.0% | 80.0% |
| Gives you something specific to do | 65.0% | **55.0%** |
| All three at once | 25.0% | 45.0% |

The rebuild worked. Completeness nearly doubled.

Then the same table told me two things I did not want to hear.

**I had been telling the story wrong for a year.** My README said version two fell apart on cross-domain questions, the ones spanning training and nutrition and recovery at once. Split the result by question type and that is not what happened. On single-domain questions the old shape scored 46.7%; on multi-domain ones it scored 60.0%. It was worse at the easy questions. The rebuild took single-domain answers to 100% and multi-domain only to 80%. My diagnosis had been backwards, and nobody could have caught it from the code, because the code cannot tell you what it is bad at.

**And the rebuild broke something.** Answers got more complete and less useful. Ten of twenty current answers failed to land on a number, a rep range, a frequency, or a decision rule, where the old single-call version managed it more often. Four specialists each produce specifics, then a supervisor merges them into one answer, and specificity is the first thing that dies under compression. I would not have found that if I had only measured the thing I expected to win. The comparison carried a deliberate counterweight criterion for exactly this reason: an architecture can score beautifully on completeness by touching every subject and committing to nothing.

That regression is open, unfixed, and written down.

The honest summary is not "I rebuilt it and it got better." It is that the rebuild fixed a real problem, that I was wrong about which problem it was, and that it introduced a new one I only saw because I built the instrument to look.

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
