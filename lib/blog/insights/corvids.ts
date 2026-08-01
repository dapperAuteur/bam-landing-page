import type { InsightOption } from './types'

/**
 * Species summaries for the Indiana corvid infographic.
 *
 * Written from the same `corvidData` the charts render, so the prose and the
 * bars can never disagree. Keyed by `species` so the page can look one up from
 * its existing selection state.
 */
export const CORVID_INSIGHTS: readonly InsightOption[] = [
  {
    id: 'American Crow',
    label: 'American Crow',
    insight: {
      title: 'American Crow',
      blocks: [
        {
          type: 'paragraph',
          text: 'At roughly 450 grams and 46 cm long, the American Crow is the corvid most Hoosiers picture first, and the one they are most likely to see on any given day. It is genuinely everywhere: woodlands, farm fields, suburban lawns, and city parks all suit it equally well.',
        },
        {
          type: 'paragraph',
          text: 'Its strong, stout, all-purpose beak is the key to that range. The same tool cracks a nut, probes for insects, tears at carrion, and tips over a bin lid, which is why a bird with no dietary specialty ends up thriving in habitats that share almost nothing with each other.',
        },
        {
          type: 'heading',
          text: 'What sets it apart',
        },
        {
          type: 'list',
          items: [
            'A familiar, unmistakable "caw-caw", plus a private vocabulary of clicks and rattles used close-range.',
            'Highly social: it forms large flocks and communal roosts that can number in the thousands in winter.',
            'Direct, steady, purposeful flight, with none of the Blue Jay\'s bounce or the Raven\'s soaring.',
            'Bulky stick nests high in trees, often built and defended with help from the previous year\'s young.',
          ],
        },
        {
          type: 'paragraph',
          text: 'With an encephalization quotient around 1.2 to 2.5, it sits firmly in the bracket that makes corvids famous: tool use, face recognition, and problem-solving that would not embarrass a primate.',
        },
      ],
    },
  },
  {
    id: 'Blue Jay',
    label: 'Blue Jay',
    insight: {
      title: 'Blue Jay',
      blocks: [
        {
          type: 'paragraph',
          text: 'The smallest bird in this comparison by a wide margin, at about 85 grams and 28 cm, the Blue Jay is also the only one you can identify from a moving car by colour alone: a bright blue crest and back, a white face, and a neat black necklace.',
        },
        {
          type: 'paragraph',
          text: 'Its 38 cm wingspan is barely wider than its body is long, and the flight shows it. Where crows commute in a straight line, the jay travels in an undulating series of quick wingbeats and short glides, which is often the first clue before any colour resolves.',
        },
        {
          type: 'heading',
          text: 'What sets it apart',
        },
        {
          type: 'list',
          items: [
            'A stout, pointed, powerful bill built for cracking acorns, which ties the species tightly to oak woodland.',
            'An exceptional mimic: its impersonation of a Red-shouldered Hawk is good enough to clear a feeder in seconds.',
            'Bold and assertive out of proportion to its size, and a committed mobber of owls and hawks.',
            'Cup-shaped nests of twigs, grass, and mud, usually in the fork of a tree.',
          ],
        },
        {
          type: 'note',
          text: 'Jays cache far more acorns than they retrieve. The forgotten ones germinate, which makes this bird a significant planter of oak forests.',
        },
      ],
    },
  },
  {
    id: 'Fish Crow',
    label: 'Fish Crow',
    insight: {
      title: 'Fish Crow',
      blocks: [
        {
          type: 'paragraph',
          text: 'The Fish Crow is the identification problem of this group. At about 300 grams and 38 cm, it is visibly smaller than an American Crow only when the two stand side by side, and its plumage is the same black, if often a touch glossier.',
        },
        {
          type: 'paragraph',
          text: 'The voice settles it. Where an American Crow gives a clean "caw", a Fish Crow is distinctly nasal, a flat "cah" or a two-note "uh-uh" that sounds like a crow with a head cold. Birders learn to identify this species with their eyes closed.',
        },
        {
          type: 'heading',
          text: 'What sets it apart',
        },
        {
          type: 'list',
          items: [
            'In Indiana it keeps to the south and centre of the state, close to rivers and lakes.',
            'A slightly more slender bill with a subtle hook, suited to fish, crustaceans, and shoreline carrion.',
            'Gregarious, particularly when foraging, and often mixed in among American Crows.',
            'Stick nests in trees, characteristically near water.',
          ],
        },
        {
          type: 'paragraph',
          text: 'It is a useful lesson in how species separate: not by looking different, but by making a living in a different place, on different food.',
        },
      ],
    },
  },
  {
    id: 'Common Raven',
    label: 'Common Raven',
    insight: {
      title: 'Common Raven',
      blocks: [
        {
          type: 'paragraph',
          text: 'At roughly 1,300 grams, the Common Raven is nearly three times the mass of an American Crow and over fifteen times that of a Blue Jay. Its 132 cm wingspan makes the scale obvious the moment one passes overhead. In Indiana it remains rare, though its range is expanding.',
        },
        {
          type: 'paragraph',
          text: 'Its encephalization quotient, often cited around 2.49, is the highest in this group and among the highest measured in any bird. Ravens solve multi-step puzzles, cache food with an eye on who is watching, and appear to plan for future need.',
        },
        {
          type: 'heading',
          text: 'What sets it apart',
        },
        {
          type: 'list',
          items: [
            'A large, heavy, distinctly curved bill capable of opening carcasses a crow cannot.',
            'Shaggy throat feathers, called hackles, that lift and flare during display.',
            'A deep, resonant "gronk-gronk" that carries much further than a crow\'s caw.',
            'Powerful flight with frequent soaring and genuine aerial acrobatics, including barrel rolls.',
            'Large stick nests on cliffs and in tall trees, built by pairs that mate for life.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Where crows are social generalists, ravens are usually seen in pairs or small family groups, and their prospects in Indiana depend on the rugged, forested bluff country they prefer.',
        },
      ],
    },
  },
] as const
