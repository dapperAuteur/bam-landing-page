import type { InsightOption } from './types'

/**
 * Worked examples for the Chief Strategist command demo.
 *
 * The demo used to take free text and send it to a live model, which meant the
 * example a reader saw was never the example the article described, and two
 * readers comparing notes saw different things. Commands are a closed set, so
 * each one now ships a written-out response: the demo shows what the command
 * language actually produces, which was the point the section was making.
 */
export const CHIEF_STRATEGIST_INSIGHTS: readonly InsightOption[] = [
  {
    id: 'deconstruct',
    label: 'Deconstruct [Skill]',
    hint: 'Example: Deconstruct Handstand',
    insight: {
      title: 'Deconstruct Handstand',
      blocks: [
        {
          type: 'paragraph',
          text: 'A handstand is not an arm exercise. It is a balance skill held up by the shoulders and controlled from the fingertips. Most people fail it because they train the hold and never train the correction.',
        },
        { type: 'heading', text: 'The four components' },
        {
          type: 'list',
          items: [
            'Wrist and finger capacity: the fingers are the steering wheel. Without the strength to press down through the fingertips, every correction has to come from the hips, which is far too slow.',
            'Shoulder flexion: you need roughly 180 degrees of overhead range. If the shoulders cannot stack over the wrists, the body compensates with an arched back and the line collapses.',
            'Midline control: hollow-body position stops the ribs flaring. This is where most of the "banana handstand" comes from.',
            'Entry: a controlled kick-up that arrives at balance rather than through it.',
          ],
        },
        { type: 'heading', text: 'The order to train them' },
        {
          type: 'paragraph',
          text: 'Wrist prep first, every session, non-negotiable. Then shoulder range work. Then hollow-body holds on the floor, where failure costs nothing. Only then chest-to-wall holds, which build the position, and finally back-to-wall work with controlled bail-outs.',
        },
        {
          type: 'note',
          text: 'Why this order: each stage removes a reason the next one would fail. Training the hold before the wrists can steer is how people accumulate months of practice with no progress.',
        },
      ],
    },
  },
  {
    id: 'critique',
    label: 'Critique',
    hint: 'Blunt assessment of the current plan',
    insight: {
      title: 'Critique: current training week',
      blocks: [
        {
          type: 'paragraph',
          text: 'Direct assessment: the week is built around the sessions you enjoy, not the ones that move the target. That is the single biggest problem and everything below follows from it.',
        },
        { type: 'heading', text: 'What is working' },
        {
          type: 'list',
          items: [
            'Sprint frequency is appropriate at twice weekly with full recovery between.',
            'You are consistent, which beats optimal-but-abandoned every time.',
          ],
        },
        { type: 'heading', text: 'What is not' },
        {
          type: 'list',
          items: [
            'Four of six sessions are upper body. The goal is a sub-17-second 100m at 100 years old. That is a hip and posterior-chain project.',
            'No dedicated single-leg work at all, and sprinting is a single-leg activity performed at speed.',
            'Recovery is unplanned, so it becomes whatever is left over. It should be scheduled first.',
          ],
        },
        {
          type: 'paragraph',
          text: 'The why: at 45 the limiter on 100m time is rate of force development through the hip, and that quality declines faster with age than anything you are currently training. Every week spent on bench press is a week not spent defending the thing that will actually go first.',
        },
      ],
    },
  },
  {
    id: 'plan',
    label: 'Plan [duration]',
    hint: 'Example: Plan 45 minutes',
    insight: {
      title: 'Plan 45 minutes',
      blocks: [
        {
          type: 'paragraph',
          text: 'Forty-five minutes is enough for one quality primary and honest support work, provided nothing is wasted on filler.',
        },
        { type: 'heading', text: 'Minutes 0 to 10: prepare' },
        {
          type: 'list',
          items: [
            'Wrist and ankle prep, 2 minutes.',
            'Hip airplanes and 90/90 transitions, 4 minutes.',
            'Progressive strides, building to about 80 percent, 4 minutes.',
          ],
        },
        { type: 'heading', text: 'Minutes 10 to 30: primary' },
        {
          type: 'list',
          items: [
            'Six by 40m acceleration, walking back for full recovery.',
            'Stop the set the moment times drop off. You are training speed, and slow sprinting trains something else.',
          ],
        },
        { type: 'heading', text: 'Minutes 30 to 45: support' },
        {
          type: 'list',
          items: [
            'Single-leg RDL, three sets of six per side, controlled tempo.',
            'Copenhagen plank, three sets of 20 seconds per side, for the adductors that stabilise the sprint stride.',
          ],
        },
        {
          type: 'note',
          text: 'Why the sprints come before the strength work: quality work goes first, when the nervous system is fresh. Reversing the order turns the sprints into conditioning.',
        },
      ],
    },
  },
  {
    id: 'meal',
    label: 'Meal from [ingredients]',
    hint: 'Example: Meal from eggs, spinach',
    insight: {
      title: 'Meal from eggs, spinach',
      blocks: [
        {
          type: 'paragraph',
          text: 'Three eggs, a large handful of spinach, cooked in olive oil. Roughly 20g protein and around 340 calories, ready in about six minutes.',
        },
        { type: 'heading', text: 'Method' },
        {
          type: 'list',
          items: [
            'Warm a pan over medium-low heat with a tablespoon of olive oil. Low and slow is what keeps eggs tender.',
            'Wilt the spinach first, about 60 seconds, then push it to one side.',
            'Add beaten eggs and stir gently until just set. Take them off the heat while they still look slightly underdone; they finish in the pan.',
            'Salt at the end, not the beginning, so the eggs do not weep.',
          ],
        },
        {
          type: 'paragraph',
          text: 'The why: eggs give you all nine essential amino acids with a leucine content high enough to actually trigger muscle protein synthesis, which matters more with each passing decade. The olive oil is not incidental either. Spinach carries fat-soluble vitamins that you simply do not absorb without it.',
        },
        {
          type: 'note',
          text: 'If this is a post-session meal, add a carbohydrate source. Protein alone does not restock glycogen.',
        },
      ],
    },
  },
] as const
