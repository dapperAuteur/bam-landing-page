import type { InsightOption } from './types'

/**
 * Answers for the natural short sleep (NSS) explainer.
 *
 * The page had a free-text "ask the AI" box about SIK3 and the N783Y mutation.
 * Free text cannot be precomputed, and on a page about a specific piece of
 * genetics research, an unreviewed generated answer is a liability: readers
 * cannot tell a summary of the report from a plausible-sounding invention.
 * These are the questions readers actually arrive with, answered from the
 * report the article is based on.
 */
export const SHORT_SLEEP_QUESTIONS: readonly InsightOption[] = [
  {
    id: 'what-is-nss',
    label: 'What is natural short sleep?',
    insight: {
      title: 'What is natural short sleep?',
      blocks: [
        {
          type: 'paragraph',
          text: 'Natural short sleepers are people who routinely sleep around four to six and a half hours and feel genuinely well on it: no daytime sleepiness, no weekend catch-up, no accumulating deficit. Estimates put it near 1 percent of the population.',
        },
        {
          type: 'paragraph',
          text: 'The distinction that matters is between short sleep and short sleep with no cost. Most people sleeping five hours are sleep-deprived and adapted to feeling bad. A true natural short sleeper shows none of the performance decline that deprivation produces, and does not sleep longer when given the opportunity.',
        },
        {
          type: 'note',
          text: 'This is the reason the trait is interesting and also why it is so often misclaimed. Feeling fine on little sleep is not the same as being fine on little sleep, and self-report is unreliable here.',
        },
      ],
    },
  },
  {
    id: 'what-is-sik3',
    label: 'What does the SIK3 gene do?',
    insight: {
      title: 'What does SIK3 do?',
      blocks: [
        {
          type: 'paragraph',
          text: 'SIK3 is a kinase, an enzyme that attaches phosphate groups to other proteins. Phosphorylation is one of the cell\'s main switches: adding or removing that group turns a protein\'s activity up or down.',
        },
        {
          type: 'paragraph',
          text: 'In the context of sleep, SIK3 sits in the machinery that tracks sleep pressure, the accumulating need for sleep that builds across waking hours. Its phosphorylation targets include synaptic proteins, which links it to the leading idea that sleep is partly about resetting synaptic strength built up during the day.',
        },
        {
          type: 'paragraph',
          text: 'SIK3 turns up repeatedly in sleep genetics across species, which is a strong hint that it is close to a core mechanism rather than a peripheral modifier.',
        },
      ],
    },
  },
  {
    id: 'n783y',
    label: 'What is the N783Y mutation?',
    insight: {
      title: 'The SIK3-N783Y mutation',
      blocks: [
        {
          type: 'paragraph',
          text: 'N783Y is a single amino acid substitution: asparagine (N) replaced by tyrosine (Y) at position 783 in the SIK3 protein. One letter changed out of hundreds.',
        },
        {
          type: 'paragraph',
          text: 'Its effect is the counterintuitive part. The change diminishes SIK3 kinase activity, yet carriers sleep less while showing higher delta power, the slow-wave activity used as the standard marker of deep, restorative sleep.',
        },
        {
          type: 'heading',
          text: 'Why that combination is surprising',
        },
        {
          type: 'paragraph',
          text: 'The intuitive expectation is that reduced activity in a sleep-regulating kinase means worse or less efficient sleep. Instead the sleep gets denser: less time, more slow-wave activity per unit of it. That is what makes the mutation a target of interest rather than a curiosity, because it points at efficiency rather than simply duration.',
        },
      ],
    },
  },
  {
    id: 'can-i-train-it',
    label: 'Can I train myself to be a short sleeper?',
    insight: {
      title: 'Can you train yourself into it?',
      blocks: [
        {
          type: 'paragraph',
          text: 'No. This is the most important practical point on the page, and the evidence is not ambiguous.',
        },
        {
          type: 'paragraph',
          text: 'The trait is genetic. Carriers are born with it and typically report having always been this way, often noticing in adolescence that they simply needed less than everyone around them. There is no protocol, supplement, or schedule that converts a normal sleeper into a natural short sleeper.',
        },
        {
          type: 'paragraph',
          text: 'What restricting your sleep does produce is chronic sleep deprivation, and one of deprivation\'s reliable effects is that people become poor judges of their own impairment. Subjective sleepiness plateaus while objective performance keeps declining. You feel adapted while continuing to get worse.',
        },
        {
          type: 'note',
          text: 'The honest read of this research is that it identifies a mechanism worth understanding, not a lifestyle to copy. Most adults need seven to nine hours, and the odds you are the exception are roughly one in a hundred.',
        },
      ],
    },
  },
  {
    id: 'other-genes',
    label: 'Which other genes are involved?',
    insight: {
      title: 'The other short-sleep genes',
      blocks: [
        {
          type: 'paragraph',
          text: 'SIK3 is one of a small set of genes linked to the trait, and the set is what makes the picture convincing: independent families, independent genes, converging on the same phenotype.',
        },
        {
          type: 'list',
          items: [
            'DEC2 (BHLHE41) was the first identified, and remains the most studied.',
            'ADRB1, a beta-adrenergic receptor gene, implicating arousal signalling.',
            'NPSR1, a neuropeptide S receptor, also tied to arousal regulation.',
            'GRM1, a glutamate receptor gene.',
            'SIK3, the kinase this article focuses on.',
          ],
        },
        {
          type: 'paragraph',
          text: 'That these cluster around arousal signalling and synaptic regulation rather than, say, circadian timing is itself informative: short sleep appears to be about how quickly sleep pressure is discharged, not about when the clock says to sleep.',
        },
      ],
    },
  },
] as const

/**
 * Research directions for the hypothesis generator.
 *
 * The original asked a model for a "novel, testable research hypothesis" on
 * every click. Generated hypotheses in a genetics explainer read as if they
 * carry the weight of the literature behind them, and they do not. These are
 * framed as open questions the finding raises, which is what the section was
 * usefully doing anyway.
 */
export const SHORT_SLEEP_DIRECTIONS: readonly InsightOption[] = [
  {
    id: 'synaptic',
    label: 'The synaptic downscaling question',
    insight: {
      title: 'Open question: what happens at the synapse?',
      blocks: [
        {
          type: 'paragraph',
          text: 'If reduced SIK3 activity produces higher delta power in less time, the obvious place to look is the synapse. Slow-wave activity is closely tied to synaptic downscaling, the overnight renormalisation of connections strengthened during waking.',
        },
        {
          type: 'paragraph',
          text: 'The open question is whether N783Y carriers downscale faster, or start each night with less to downscale. Those are very different mechanisms with very different implications, and distinguishing them would require measuring synaptic markers across the night rather than only sleep architecture.',
        },
      ],
    },
  },
  {
    id: 'therapeutic',
    label: 'The therapeutic question',
    insight: {
      title: 'Open question: could this be a drug target?',
      blocks: [
        {
          type: 'paragraph',
          text: 'The tempting version is a compound that reproduces the efficiency gain without the genetics. Kinases are among the most druggable protein classes, so a selective SIK3 modulator is not far-fetched in principle.',
        },
        {
          type: 'paragraph',
          text: 'The caution is that SIK3 does not only regulate sleep. It participates in metabolic and inflammatory signalling, so systemic inhibition would not be a targeted intervention. A realistic path would need selectivity for the specific phosphorylation events involved in sleep pressure, not the kinase as a whole.',
        },
        {
          type: 'note',
          text: 'Worth stating plainly: no such drug exists, and nothing sold today reproduces this effect.',
        },
      ],
    },
  },
  {
    id: 'lifespan',
    label: 'The long-term health question',
    insight: {
      title: 'Open question: what happens over a lifetime?',
      blocks: [
        {
          type: 'paragraph',
          text: 'Short sleep in the general population is associated with cardiovascular disease, metabolic dysfunction, and cognitive decline. Natural short sleepers appear not to carry that risk, which is the claim most worth interrogating.',
        },
        {
          type: 'paragraph',
          text: 'The difficulty is sample size. The trait is rare, carriers are identified late, and the outcomes of interest play out across decades. Distinguishing genuine protection from a population too small and too young to show harm yet is the central methodological problem, and it is not close to resolved.',
        },
      ],
    },
  },
] as const
