<!--
Draft for the bam-landing-page blog. Paste the body into app/admin/blog and use:
Title:   When Should an AI Coach Say "See a Professional"?
Slug:    ai-coach-safety-escalation
Excerpt: My eval caught three cases where the coach gave advice about pain and
         chronic exhaustion without ever suggesting a human professional. Fixing
         that sounds obvious, until you meet alarm fatigue. Where's the line?
Tags:    AI Safety, Health Tech, Evals, Product Design, Decision Log
Series:  Fit T. Cent Eval Findings (2 of 3)
-->

# When Should an AI Coach Say "See a Professional"?

Three of my eval's twenty-one test cases exposed the same gap. A user describes chronic exhaustion, stalled lifts, and skipped meals, and the coach optimizes their program. A user reports low-back pain from deadlifts, and the coach adjusts their form cues. A user on four hours of sleep plans two-a-day training, and the coach helps them schedule it. In all three, the advice itself was reasonable. What was missing: any suggestion that a *human professional* should be in the loop.

The fix sounds obvious ("add safety flags!") right up until you think about what over-flagging does. This post is the reasoning I want on record before I change the prompts.

## The term of art: alarm fatigue

Hospitals learned this the hard way: when monitors beep for everything, staff stop hearing them, including the beep that matters. It's called **alarm fatigue**, and it kills the usefulness of the alarm system precisely by overusing it.

The consumer version: a smoke detector next to the toaster. After the fourth false alarm, you pull the battery, and now the *real* fire finds you unprotected. An AI coach that appends "consult a professional" to every answer has pulled its own battery. Users' eyes slide past the disclaimer, and the one time it's load-bearing, it reads exactly like the noise.

So the design question isn't "should the coach ever escalate?" (obviously yes). It's **where the trigger line sits** so that the flag still *means something* when it fires.

## The options

**Option A: do nothing.** Keep advice clean; trust users to manage their own care. Honest appeal: no nagging, no liability theater. But my eval already showed the concrete cost. A person describing textbook overtraining-plus-underfueling got program tweaks and no nudge toward a human. For a *health* product, that's not neutrality; it's a miss. (It also matters that my product's whole identity is citations and honesty; the same identity implies knowing your limits.)

**Option B: blanket disclaimer.** Legal-style boilerplate on every response. This is the toaster smoke detector: maximum coverage, zero signal. It's the option that looks safest and functions worst. Not doing it.

**Option C: triggered escalation (the plan).** Specific signals flip the flag; everything else stays clean. The escalation isn't a generic disclaimer either; it's woven into the answer ("here's an adjusted plan, *and* this pattern of exhaustion plus skipped meals is worth a conversation with a doctor or dietitian, here's why").

**Option D: a dedicated safety-check node.** A separate step in the agent graph that reviews every synthesized answer for missed escalations: the mechanical-check philosophy from post 1 of this series, applied to safety. Strongest guarantee, but real added latency on *every* answer, and the trigger list still has to be defined (a checker needs the same line drawn; it just enforces it in code instead of prose). My take: start with C in the prompts, measure with the eval, and promote to D if the misses persist. Escalation of enforcement, only when earned.

## Drawing the line

Here's the trigger list I'm encoding, sorted by how obvious they are:

**Clear triggers (nobody argues):**
- Pain: any pain tied to training (the deadlift case).
- Chronic fatigue / overtraining signals: exhaustion plus performance decline (the stalled-lifts case).
- Disordered-eating adjacent patterns: skipped meals combined with intense training.

**The two I had to actually decide** (and decided *yes*, they trigger):
- **Aggressive cutting:** crash-diet timelines, especially stacked with heavy training. Reason: the harm mechanism (under-fueling under load) is the same as the clear cases; the user just hasn't reported symptoms *yet*. Waiting for symptoms to appear before flagging is flagging late.
- **Severely restricted sleep + high load:** the 4-hour-sleep, two-a-days case. Reason: this isn't a preference to respect; it's a physiological math problem. Recovery is where adaptation happens; a schedule that structurally prevents it isn't an aggressive plan, it's an injury timeline. The coach can still help, *and* say a professional should look at the whole picture.

**Explicit non-triggers, to guard against fatigue:** ordinary soreness, plateau questions without symptoms, standard-rate fat-loss goals, "should I train today though I'm tired" one-offs. These get coaching, not referrals.

**The tie-breaker principle:** flag on *patterns that compound* (restriction + load + time), not on *single data points*. One bad night's sleep is Tuesday; a four-hour-a-night schedule under two-a-days is a trajectory.

## How I'll know if the line is right

Two eval assertions already measure this: the scope-safety check (did flagged cases get a referral?) and, the part that keeps me honest in the other direction, the judge's rationale on *clean* cases, where I'll watch for referral language creeping into answers that didn't warrant it. If the flag starts showing up where it shouldn't, that's alarm fatigue being born, and the trigger list gets tightened, not the principle abandoned.

The same line also feeds the synthesizer rule from this eval cycle: when a user says "leave out the rest-day stuff," the synthesis may honor preferences on ordinary content, but safety-relevant advice survives (noted, not silenced). A coach you can instruct to hide the lifeguard isn't a coach.

## Further reading

- Alarm fatigue (overview): https://en.wikipedia.org/wiki/Alarm_fatigue
- The eval harness that caught these cases is the subject of this series; the teardown post with full before/after numbers follows the re-run.
