import type { InsightOption } from './types'

/**
 * Podcast segments and garden action plans for the cottontail infographic.
 *
 * The podcast picker was already a fixed list of five topics, so those become
 * five written segments. The garden advisor took free text, which cannot be
 * precomputed, so it becomes a picker over the problems people actually bring:
 * the plans are grounded in the same hierarchy of deterrents the page already
 * teaches, which the free-text version had no way to guarantee.
 */

export const COTTONTAIL_PODCAST_INSIGHTS: readonly InsightOption[] = [
  {
    id: 'diet',
    label: 'Seasonal Diet & Coprophagy',
    insight: {
      title: 'Podcast segment: the two-pass digestive system',
      blocks: [
        {
          type: 'paragraph',
          text: 'Here is something I promise you have never thought about while watching a rabbit on your lawn: that animal is going to eat this meal twice. On purpose. And it is one of the more elegant solutions in mammal biology.',
        },
        {
          type: 'paragraph',
          text: 'Cottontails are strict herbivores, and their menu swings hard with the seasons. Summer is the easy part: clover, grasses, garden greens, all of it soft and full of water. Winter is a different animal entirely. When the green disappears, they switch to bark, twigs, and buds, which is why you find that clean angled cut on a young apple tree in February.',
        },
        {
          type: 'paragraph',
          text: 'The problem is that plant cellulose is genuinely hard to extract nutrition from. A cow solves this with four stomach chambers and endless chewing. A rabbit is too small for that, and it cannot afford to sit still in the open. So it does something else. It passes the food quickly, produces a soft pellet called a cecotrope, and re-ingests it, usually at night, usually straight from the source. The second pass pulls out the B vitamins and protein the first pass could not reach.',
        },
        {
          type: 'paragraph',
          text: 'Two trips through the same system, because a prey animal cannot linger over dinner. Next time you see one grazing at dusk, know that the meal is only half finished.',
        },
      ],
    },
  },
  {
    id: 'predators',
    label: 'The Predator Gauntlet',
    insight: {
      title: 'Podcast segment: eighty percent',
      blocks: [
        {
          type: 'paragraph',
          text: 'Let me give you the number first, because everything else about the Eastern Cottontail follows from it. In a given year, as much as eighty percent of the population is lost to predation.',
        },
        {
          type: 'paragraph',
          text: 'Eighty. Coyotes, foxes, hawks, owls, domestic cats, and that is before weather and disease. If you watch a rabbit in your yard this spring, the odds are against it being there next spring.',
        },
        {
          type: 'paragraph',
          text: 'Which reframes the thing everybody already knows about rabbits. The famous reproductive rate is not excess, it is arithmetic. Multiple litters a season, kits independent in four to five weeks, females able to breed again almost immediately. That is not abundance, it is a population running hard to stay level.',
        },
        {
          type: 'paragraph',
          text: 'And it makes them load-bearing. Remove cottontails from a suburban ecosystem and you have not removed a nuisance, you have removed the food supply for every hawk, owl, and fox in the neighbourhood. The rabbit eating your tulips is also the reason you get to watch a red-tailed hawk from your kitchen window.',
        },
      ],
    },
  },
  {
    id: 'nesting',
    label: 'Nesting & Rearing Cycle',
    insight: {
      title: 'Podcast segment: the nest you already mowed past',
      blocks: [
        {
          type: 'paragraph',
          text: 'There is a good chance you have walked within three feet of a rabbit nest this year and never known it. That is the entire design.',
        },
        {
          type: 'paragraph',
          text: 'A doe does not burrow. She scrapes a shallow depression in open ground, often in the middle of a lawn, lines it with grass and fur pulled from her own chest, and covers it over. No tunnel, no landmark, nothing to find.',
        },
        {
          type: 'paragraph',
          text: 'Then she leaves. This is the part that gets misread constantly. She returns only at dawn and dusk to nurse, for a few minutes at a time, because her scent at the nest is the single greatest danger to the kits. A mother sitting attentively with her babies would be advertising them. Staying away is the care.',
        },
        {
          type: 'paragraph',
          text: 'So if you find a nest of apparently abandoned kits, they are almost certainly not abandoned. Cover them back up and leave. In four to five weeks they will be independent, which is a startling pace, and the nest will be empty grass again.',
        },
      ],
    },
  },
  {
    id: 'coexistence',
    label: "Gardener's Guide to Coexistence",
    insight: {
      title: 'Podcast segment: reading the cut',
      blocks: [
        {
          type: 'paragraph',
          text: 'Before you declare war on anything, look at the damage. Rabbits sign their work.',
        },
        {
          type: 'paragraph',
          text: 'A rabbit bite is a clean cut at roughly forty-five degrees, like someone went through the stem with secateurs. Deer tear, because they have no upper incisors, so deer damage looks ragged. Insect damage is holes and edges. If the cut is clean and angled and below about two feet, that is a rabbit.',
        },
        {
          type: 'paragraph',
          text: 'Now the useful part: they have preferences, and you can garden around them. They will go through tulips, beans, and peas with enthusiasm. They tend to leave alone anything strongly scented, so most culinary herbs and marigolds, anything fuzzy in texture like lamb\'s ear, and anything toxic like daffodils.',
        },
        {
          type: 'paragraph',
          text: 'And the honest ranking of what works: exclusion first, by a wide margin. Two feet of chicken wire, buried slightly so nothing goes under it. Habitat modification second, meaning clear the brush piles and tall weeds next to the beds. Repellents last, and only as part of something else, because they wash off and animals get used to them.',
        },
      ],
    },
  },
  {
    id: 'habitat',
    label: 'The "Edge Habitat" Advantage',
    insight: {
      title: 'Podcast segment: we built them a paradise',
      blocks: [
        {
          type: 'paragraph',
          text: 'Here is the uncomfortable truth about the rabbits in your yard. They are not intruding on your space. You built exactly what they needed and then acted surprised when they moved in.',
        },
        {
          type: 'paragraph',
          text: 'Cottontails are an edge species. What they want is open low vegetation to feed on, immediately adjacent to dense cover to bolt into. Not deep forest, where there is nothing to graze. Not open prairie, where a hawk can see you from a mile off. The seam between the two.',
        },
        {
          type: 'paragraph',
          text: 'Now describe a suburban yard. A mowed lawn, which is grazing. A shrub border, a deck with a gap under it, a hedge along the fence, all of which is cover, three seconds away. We have spent a century building the ideal cottontail habitat and calling it landscaping.',
        },
        {
          type: 'paragraph',
          text: 'Which is also the lever. If you genuinely want fewer rabbits, you do not chase them, you break the adjacency: separate the feeding from the cover. And if you like having them, you already know exactly how to keep them.',
        },
      ],
    },
  },
] as const

export const COTTONTAIL_GARDEN_INSIGHTS: readonly InsightOption[] = [
  {
    id: 'vegetables',
    label: 'They are eating my vegetable seedlings',
    hint: 'Beans, peas, lettuce, young greens',
    insight: {
      title: 'Action plan: protecting vegetable seedlings',
      blocks: [
        {
          type: 'paragraph',
          text: 'Seedlings are the highest-value target in your garden from a rabbit\'s point of view: tender, low, and exactly what they want. This is the situation where fencing is worth the afternoon it takes.',
        },
        { type: 'heading', text: 'Do this first' },
        {
          type: 'list',
          items: [
            'Ring the bed with chicken wire at least 2 feet tall, with 1-inch mesh or smaller so young kits cannot pass through.',
            'Bury the bottom 3 to 6 inches, or bend a skirt outward along the ground and pin it. Rabbits push underneath far more often than they climb.',
            'Keep the fence a few inches clear of the outermost plants so nothing can be reached through the mesh.',
          ],
        },
        { type: 'heading', text: 'Then make the approach less inviting' },
        {
          type: 'list',
          items: [
            'Clear brush piles and tall weeds within about 10 feet of the bed. Removing the bolt-hole matters more than removing the food.',
            'Plant a border of strongly scented herbs, chives, oregano, or marigolds, outside the fence line.',
          ],
        },
        {
          type: 'note',
          text: 'Repellents are the least reliable tool here. They wash off in rain, need reapplying, and animals habituate. Use them to support a fence, never instead of one.',
        },
      ],
    },
  },
  {
    id: 'bark',
    label: 'They are stripping bark from young trees',
    hint: 'Usually winter damage',
    insight: {
      title: 'Action plan: protecting young trees',
      blocks: [
        {
          type: 'paragraph',
          text: 'This is winter behaviour. When the greens are gone, bark and twigs are what is left, and young smooth-barked trees are the easiest option. It is also the most serious damage on this list: a tree girdled all the way around will not recover.',
        },
        { type: 'heading', text: 'Do this now' },
        {
          type: 'list',
          items: [
            'Put a cylinder of hardware cloth or a commercial tree guard around each trunk, 2 feet tall, held an inch or two off the bark so it is not chafing.',
            'Extend the guard above the expected snow line. Snow is a platform, and damage often appears higher than people plan for.',
            'Check that nothing is left touching the trunk that could hold moisture against it.',
          ],
        },
        { type: 'heading', text: 'Before next winter' },
        {
          type: 'list',
          items: [
            'Clear brush and tall grass from around the base, which is both cover and an invitation.',
            'Inspect guards in autumn, before the first hard freeze, and widen any the trunk has grown into.',
          ],
        },
        {
          type: 'note',
          text: 'If a tree is already damaged on one side only, it will often survive. If the bark is missing in a complete ring, the tree is girdled and will decline regardless of what you do next.',
        },
      ],
    },
  },
  {
    id: 'flowers',
    label: 'They are eating my flower beds',
    hint: 'Tulips and other spring bulbs',
    insight: {
      title: 'Action plan: flower beds',
      blocks: [
        {
          type: 'paragraph',
          text: 'Tulips are near the top of the cottontail preference list, so a bed of them is a standing invitation. The good news is that ornamentals give you more room to design the problem away than vegetables do.',
        },
        { type: 'heading', text: 'The long-term fix: plant against them' },
        {
          type: 'list',
          items: [
            'Daffodils are toxic to rabbits and are reliably left alone. Substituting them for tulips solves the problem permanently.',
            'Strongly scented plants (lavender, sage, alliums) and fuzzy-textured ones (lamb\'s ear) are usually skipped.',
            'Use those as a border and keep anything genuinely tempting toward the centre.',
          ],
        },
        { type: 'heading', text: 'For the beds you already have' },
        {
          type: 'list',
          items: [
            'A 2-foot chicken wire ring works here exactly as it does on vegetables, and can come down once growth is established.',
            'Cloches or wire cages over individual emerging bulbs get them through the vulnerable few weeks.',
          ],
        },
      ],
    },
  },
  {
    id: 'nest',
    label: 'I found a nest in my lawn',
    hint: 'What to do (mostly nothing)',
    insight: {
      title: 'Action plan: you found a nest',
      blocks: [
        {
          type: 'paragraph',
          text: 'The short version: cover it back over and leave it alone. This is the one situation where doing less is genuinely the correct answer.',
        },
        { type: 'heading', text: 'The kits are not abandoned' },
        {
          type: 'paragraph',
          text: 'A doe visits only at dawn and dusk, for a few minutes. Her scent at the nest is the biggest single risk to the kits, so staying away is how she protects them. An unattended nest is a normal nest.',
        },
        { type: 'heading', text: 'What to actually do' },
        {
          type: 'list',
          items: [
            'Replace the grass and fur covering exactly as you found it.',
            'Mark the spot with a stake or upturned bucket at mowing time, then set the mower high or skip that patch entirely.',
            'Keep dogs and cats off that part of the lawn. This is the real threat, far more than anything wild.',
            'Wait. Kits are independent in four to five weeks, and the nest will be plain grass again.',
          ],
        },
        {
          type: 'note',
          text: 'Only intervene if a kit is visibly injured, or is cold and covered in flies. In that case contact a licensed wildlife rehabilitator; do not attempt to feed it. Cow or pet milk will kill a young rabbit.',
        },
      ],
    },
  },
  {
    id: 'general',
    label: 'I just want fewer rabbits around generally',
    hint: 'No specific damage yet',
    insight: {
      title: 'Action plan: reducing the appeal of your yard',
      blocks: [
        {
          type: 'paragraph',
          text: 'Without a specific target to protect, the lever is habitat rather than fencing. Cottontails are an edge species: they need open feeding ground directly beside dense cover. Break that adjacency and your yard stops being prime real estate.',
        },
        { type: 'heading', text: 'Remove the cover' },
        {
          type: 'list',
          items: [
            'Clear brush piles, log stacks, and tall weed patches, especially any sitting next to open lawn.',
            'Screen off the gaps under decks, sheds, and porches with hardware cloth buried at the base.',
            'Thin dense low shrubbery that meets the lawn edge, or underplant it so the ground beneath is not open runway.',
          ],
        },
        { type: 'heading', text: 'Set expectations honestly' },
        {
          type: 'paragraph',
          text: 'You will not get to zero, and chasing that is a poor use of a weekend. Suburbia is ideal cottontail habitat at a scale far larger than your property. What you can do is stop being the best yard on the street.',
        },
        {
          type: 'note',
          text: 'Worth remembering before you go too far: up to eighty percent of the local rabbit population is lost to predation each year. They are the food supply for the hawks, owls, and foxes you probably like having around.',
        },
      ],
    },
  },
] as const
