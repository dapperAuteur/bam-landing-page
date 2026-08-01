/**
 * Preset questions and answers for the endocannabinoid system (ECS) explainer.
 *
 * The page shipped a chat box wired to a live model. It never actually worked
 * (it read a server-only env var in the browser, so it early-returned on every
 * send), which is the only reason no reader was ever given an unreviewed
 * generated answer about a topic adjacent to cannabis and medical use. Rather
 * than making that failure functional, the chat now answers a fixed set of
 * questions from reviewed copy.
 *
 * Plain strings rather than the block format used elsewhere: these render as
 * chat bubbles, not as a document.
 */
export interface EcsQa {
  id: string
  question: string
  answer: string
}

export const ECS_QUESTIONS: readonly EcsQa[] = [
  {
    id: 'what-is-ecs',
    question: 'What is the endocannabinoid system?',
    answer:
      'A signalling network your body runs on its own, with three parts: receptors (CB1, concentrated in the brain and nervous system; CB2, mostly on immune cells), endocannabinoids (anandamide and 2-AG, the molecules your body makes to activate those receptors), and the enzymes that build and break those molecules down. Its general job is homeostasis, keeping systems such as mood, appetite, pain signalling, sleep, and immune response inside a workable range. It is named after the cannabis plant only because that is how it was discovered; the system is yours and would exist regardless.',
  },
  {
    id: 'cb1-cb2',
    question: 'What is the difference between CB1 and CB2 receptors?',
    answer:
      'Mostly where they are and therefore what they do. CB1 receptors are dense in the central nervous system and influence memory, mood, appetite, pain perception, and motor control; they are also responsible for the psychoactive effects of THC. CB2 receptors sit mainly on immune cells and in peripheral tissue, and are more involved in inflammation and immune modulation. That split is why compounds acting mainly on CB2 are of interest for inflammatory conditions without the cognitive effects associated with CB1.',
  },
  {
    id: 'endocannabinoids',
    question: 'What are anandamide and 2-AG?',
    answer:
      'The two main endocannabinoids your body produces. Anandamide, named from the Sanskrit ananda meaning bliss, is a partial agonist present at relatively low levels and is broken down quickly by the enzyme FAAH. 2-AG is far more abundant and acts as a full agonist at both receptor types. A distinctive feature of both is that they are synthesised on demand rather than stored, and they act in reverse, travelling backwards across the synapse to tell the sending neuron to ease off. That retrograde signalling is essentially a volume dial on other neurotransmitters.',
  },
  {
    id: 'homeostasis',
    question: 'How does the ECS maintain homeostasis?',
    answer:
      'By behaving like a thermostat rather than a switch. When a system drifts out of range, whether that is excessive neuronal firing, an inflammatory response overshooting, or a stress response failing to switch off, endocannabinoids are produced locally, act on nearby receptors to damp the signal, and are then broken down rapidly by enzymes such as FAAH and MAGL. On demand, local, and short-lived: a correction applied where and when it is needed, not a system-wide effect.',
  },
  {
    id: 'lifestyle',
    question: 'Can lifestyle affect the ECS?',
    answer:
      'The evidence suggests yes, though it is generally weaker than the claims made for it. Sustained aerobic exercise raises circulating anandamide, and that is now considered a more plausible contributor to the so-called runner\'s high than endorphins, which do not readily cross the blood-brain barrier. Sleep, chronic stress, and dietary fatty acid intake all plausibly influence endocannabinoid tone, since these molecules are built from lipids. Treat specific protocols promising to optimise your ECS with scepticism: the general direction is supported, the precise prescriptions are not.',
  },
  {
    id: 'research',
    question: 'What is still unknown about the ECS?',
    answer:
      'A great deal, and this is worth stating plainly given how confidently the topic is often discussed. Clinical evidence is strongest for a small number of specific applications, such as certain treatment-resistant epilepsies. For most conditions the ECS is popularly linked to, the research is early, often preclinical or in small trials. Clinical endocannabinoid deficiency remains a hypothesis rather than an established diagnosis. And because the system touches so many processes, targeting it precisely without unwanted effects elsewhere is a genuinely hard pharmacological problem.',
  },
] as const
