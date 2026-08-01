/**
 * Reflections for the African spiritual traditions infographic.
 *
 * These replace a live model call. Two reasons, and the second matters more
 * than the caching one:
 *
 * 1. The output was different on every click, so the article could never refer
 *    to what a reader was actually looking at.
 * 2. The old prompt asked the model for a proverb that "should sound authentic
 *    but be an original creation", and the page displayed the result with no
 *    indication it was invented. Machine-generated lines presented as the
 *    wisdom of living traditions is a real misrepresentation, and it is worse
 *    when nobody can tell which lines are which.
 *
 * So the "proverb" slot now carries a documented, attributable idea from the
 * tradition, described as such, and the reflection slot carries an open
 * question for the reader. Nothing here is presented as a traditional saying
 * unless it genuinely is one.
 */

export interface TraditionReflection {
  /** Short piece shown in the first slot: a documented concept, attributed. */
  concept: string
  /** Open question for the reader. */
  reflection: string
}

export const TRADITION_REFLECTIONS: Record<string, TraditionReflection> = {
  yoruba: {
    concept:
      'Ifá teaching holds that each person arrives with an Orí, a personal destiny chosen before birth. Character, ìwà, is what determines whether that destiny is fulfilled. Wisdom is not handed down so much as consulted, through the Ifá corpus and the diviner who reads it.',
    reflection:
      'If your character decided whether your potential was ever realised, which part of your character would you work on first?',
  },
  zulu: {
    concept:
      'Ubuntu is usually rendered as "I am because we are": personhood is something conferred and sustained by community rather than held alone. The amadlozi, the ancestors, remain participants in that community, consulted and honoured rather than merely remembered.',
    reflection:
      'Who are the people whose existence made yours possible, and what would it mean to treat them as still part of your decisions?',
  },
  kongo: {
    concept:
      'The Dikenga cosmogram maps life as a cycle through four moments, sunrise, noon, sunset, and midnight, corresponding to birth, maturity, death, and existence in the spirit world. The living world (Ku Nseke) and the spirit world (Ku Mpèmba) are separated by the kalunga line, a boundary often figured as water.',
    reflection:
      'If death were a turn in a circle rather than the end of a line, what would you stop postponing?',
  },
  san: {
    concept:
      'San spirituality centres on the trance dance, in which healers enter an altered state to draw out sickness and mediate with the spirit world. It is among the oldest continuously practised religious traditions documented anywhere, and it treats healing as a communal event rather than a private transaction.',
    reflection:
      'What would change if healing were something your whole community showed up for, rather than something you arranged alone?',
  },
  igbo: {
    concept:
      'In Odinani each person has a Chi, a personal spiritual guide, alongside the supreme creator Chukwu. The earth goddess Ala holds moral authority: offences are understood as against the land itself, which makes ethics a matter of relationship to place, not only to people.',
    reflection:
      'If your wrongs were owed to the land you live on, not just the people around you, what would you owe where you are now?',
  },
  akan: {
    concept:
      'Akan thought is carried in Adinkra symbols, each compressing a proverb. Gye Nyame, "except for God", asserts the supremacy of the creator Onyame. Sankofa, a bird turning to retrieve an egg from its back, teaches that returning for what was left behind is not regression but repair.',
    reflection:
      'What is behind you that would be worth going back for, and what has stopped you from going?',
  },
}
