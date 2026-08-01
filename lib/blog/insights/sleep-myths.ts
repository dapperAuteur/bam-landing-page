import type { InsightOption } from './types'

/**
 * The sleep myth debunker.
 *
 * Previously a free-text box that sent whatever a reader typed to a model. On a
 * page giving recovery advice to athletes, that is the worst place for an
 * unreviewed answer: the prompt told the model not to give medical advice, but
 * nothing enforced it, and a reader could not tell a sourced claim from a
 * fluent guess. These are the myths readers actually arrive with, answered once
 * and reviewed.
 */
export const SLEEP_MYTHS: readonly InsightOption[] = [
  {
    id: 'catch-up',
    label: 'You can catch up on sleep at the weekend',
    hint: 'Mostly myth',
    insight: {
      title: 'Can you catch up at the weekend?',
      blocks: [
        {
          type: 'paragraph',
          text: 'Partly true, and the part that is false is the part people rely on.',
        },
        {
          type: 'paragraph',
          text: 'Extra weekend sleep does repay some short-term sleep debt: alertness improves and subjective sleepiness drops. What it does not do is reverse everything a week of restriction caused. Metabolic markers, notably insulin sensitivity, do not reliably return to baseline on a two-day recovery, and the pattern of restricting then rebounding shifts your circadian timing later, which makes Monday morning harder. That is the mechanism behind what gets called social jetlag.',
        },
        {
          type: 'paragraph',
          text: 'For an athlete, the more relevant cost is that the training weeks continue regardless. Adaptation happens during sleep, so a week of restriction is a week of blunted adaptation, and a long Saturday does not retroactively restore it.',
        },
        {
          type: 'note',
          text: 'Useful framing: weekend recovery sleep is a repair, not an undo. Consistent timing across all seven days outperforms restrict-and-rebound.',
        },
      ],
    },
  },
  {
    id: 'alcohol',
    label: 'A nightcap helps you sleep',
    hint: 'Myth',
    insight: {
      title: 'Does a drink before bed help?',
      blocks: [
        {
          type: 'paragraph',
          text: 'It helps you fall asleep and damages the sleep that follows. Those are different things, and the first one is why the myth persists.',
        },
        {
          type: 'paragraph',
          text: 'Alcohol is a sedative, so sleep onset is faster. But as the body metabolises it over the following hours, sleep becomes fragmented, REM sleep is suppressed in the first half of the night, and there is often a rebound of light, broken sleep in the second half. You spend the same hours in bed and get less out of them.',
        },
        {
          type: 'paragraph',
          text: 'For active people there are two extra costs. REM suppression matters for motor learning, so skill work consolidates less well. And alcohol suppresses overnight growth hormone release, which is part of the tissue repair the training was meant to trigger.',
        },
      ],
    },
  },
  {
    id: 'eight-hours',
    label: 'Everyone needs exactly eight hours',
    hint: 'Myth, but be careful with this one',
    insight: {
      title: 'Does everyone need eight hours?',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eight is a midpoint, not a requirement. The evidence supports a range of roughly seven to nine hours for most adults, with genuine individual variation inside it.',
        },
        {
          type: 'paragraph',
          text: 'The caution is how this fact gets used. "Not everyone needs eight" is true, and it is also the most common justification people give for chronic restriction. Genuine short sleepers, who thrive on under six hours, are on the order of 1 percent of the population, and the trait is genetic rather than trained.',
        },
        {
          type: 'paragraph',
          text: 'A further complication for athletes: heavy training raises sleep need rather than lowering it. Studies of athletes in high-volume blocks tend to find requirements at the upper end of the range or beyond.',
        },
        {
          type: 'note',
          text: 'A practical test: if you wake without an alarm on unconstrained days and feel steady through the afternoon without caffeine, your current duration is probably about right for you.',
        },
      ],
    },
  },
  {
    id: 'naps',
    label: 'Napping ruins your night sleep',
    hint: 'Depends entirely on timing',
    insight: {
      title: 'Do naps ruin your night?',
      blocks: [
        {
          type: 'paragraph',
          text: 'Only if they are long, late, or both. Timing and duration decide this, not napping as such.',
        },
        { type: 'heading', text: 'What tends to work' },
        {
          type: 'list',
          items: [
            'Roughly 20 to 30 minutes, which keeps you in lighter sleep stages and avoids waking mid-deep-sleep, the cause of that groggy feeling (sleep inertia).',
            'Early afternoon, broadly aligned with the natural post-lunch dip in alertness.',
            'Consistent placement, so it becomes part of the rhythm rather than a disruption to it.',
          ],
        },
        { type: 'heading', text: 'What causes problems' },
        {
          type: 'list',
          items: [
            'Naps late in the afternoon or evening, which discharge the sleep pressure you need for sleep onset at night.',
            'Long naps that reach deep sleep, unless you have the time to sleep a full 90-minute cycle through.',
          ],
        },
        {
          type: 'paragraph',
          text: 'For athletes training twice a day, a well-placed short nap between sessions is one of the better-supported recovery interventions available, and it is essentially free.',
        },
      ],
    },
  },
  {
    id: 'screens',
    label: 'Screens before bed are the main problem',
    hint: 'Overstated',
    insight: {
      title: 'Are screens really the problem?',
      blocks: [
        {
          type: 'paragraph',
          text: 'Screens matter, but the blue-light story is usually told with more confidence than the evidence supports, and it distracts from larger factors.',
        },
        {
          type: 'paragraph',
          text: 'Light does suppress melatonin and shift circadian timing. That much is solid. But the intensity from a phone at arm\'s length is far lower than the daylight-level exposures used in the strongest studies, and the effect sizes from typical evening device use are correspondingly modest.',
        },
        {
          type: 'paragraph',
          text: 'What is likely doing more of the work is the content and the displacement: an engaging feed or a work email is arousing, and the hour spent scrolling is an hour not spent asleep. That is a behavioural problem wearing a photobiology costume.',
        },
        {
          type: 'note',
          text: 'Bigger levers for most people: consistent wake time, morning daylight exposure, a cool dark room, and caffeine timing. Fix those before buying amber glasses.',
        },
      ],
    },
  },
  {
    id: 'caffeine',
    label: 'Caffeine stops affecting me by bedtime',
    hint: 'Usually false',
    insight: {
      title: 'How long does caffeine actually last?',
      blocks: [
        {
          type: 'paragraph',
          text: 'Longer than almost anyone assumes. Caffeine has a half-life of roughly five to six hours in a typical adult, meaning an afternoon dose is still substantially present at bedtime.',
        },
        {
          type: 'paragraph',
          text: 'A coffee at 4pm leaves around half its caffeine in your system at 10pm, and a quarter at 4am. That range varies widely with genetics (CYP1A2 activity), and it lengthens with some medications and with pregnancy.',
        },
        {
          type: 'paragraph',
          text: 'The trap is that caffeine degrades sleep quality without necessarily preventing sleep onset. People conclude it does not affect them because they fell asleep fine, while deep sleep is measurably reduced. You lose the restorative portion without ever noticing the trade.',
        },
        {
          type: 'note',
          text: 'A common practical rule is to stop caffeine eight to ten hours before bed. If you sleep badly and drink coffee after lunch, that is the cheapest experiment available to you.',
        },
      ],
    },
  },
] as const
