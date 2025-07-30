"use client"

import React, { useState } from 'react';

// Helper component for icons
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform duration-300">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Accordion component for collapsible sections
const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700">
      <button
        className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold text-cyan-300 hover:text-cyan-400 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className={`${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="py-4 text-gray-300">{children}</div>
      </div>
    </div>
  );
};

// Table Component for styling the tables from the document
const StyledTable = ({ headers, data, caption }) => (
    <div className="my-8 overflow-x-auto rounded-lg bg-gray-800/50 shadow-lg ring-1 ring-white/10">
      <table className="min-w-full divide-y divide-gray-700">
        {caption && <caption className="p-4 text-lg font-semibold text-white bg-gray-900/80">{caption}</caption>}
        <thead className="bg-gray-900/50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cyan-300">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-gray-800">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-700/50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-normal text-sm text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);


// Main Component
export default function WellBeingArchitecture() {

  // Data for the tables
  const table1Headers = ["Dimension", "Habit", "Routine", "Ritual", "System"];
  const table1Data = [
    ["Level of Consciousness", "Unconscious / Automatic", "Conscious Practice", "Highly Intentional / Mindful", "Meta-Cognitive / Strategic"],
    ["Primary Driver", "Environmental Cue", "Deliberate Sequence", "Symbolic Meaning / Purpose", "Process / Continuous Improvement"],
    ["Neurological Locus", "Basal Ganglia (Sensorimotor Loop)", "Prefrontal Cortex & Basal Ganglia Interaction", "Prefrontal Cortex & Limbic System Interaction", "Whole-Brain Executive Function / Prefrontal Cortex"],
    ["Flexibility", "Rigid / Inflexible", "Semi-Flexible (Sequence can be adjusted)", "Flexible in form, rigid in meaning", "Designed for Adaptability & Resilience"],
    ["Core Function", "Conserve Cognitive Energy", "Structure Time & Increase Productivity", "Create Meaning & Emotional Grounding", "Drive Long-Term Progress & Sustainable Growth"],
    ["Example", "Automatically grabbing keys before leaving.", "A morning sequence: wake up, exercise, shower, breakfast.", "Mindfully savoring a morning cup of tea as a moment of peace.", "An integrated framework for optimizing daily energy, focus, and health that includes specific routines, feedback loops, and planned flexibility."]
  ];

  const table2Headers = ["Lifestyle System", "Psychological/Cognitive", "Neurophysiological", "Endocrine", "Immune", "Cellular/Aging", "Endocannabinoid System (ECS)"];
  const table2Data = [
    ["Consistent Sleep System", "Reduces anxiety; improves mood regulation & memory consolidation.", "Promotes cerebral autophagy & clearance of metabolic waste.", "Regulates diurnal cortisol rhythm; optimizes melatonin, growth hormone, leptin, & ghrelin levels.", "Supports consolidation of immunological memory & enhances adaptive immune responses.", "Facilitates cellular repair; reduces oxidative stress & neuroinflammation associated with aging.", "Helps regulate ECS signaling related to appetite and metabolism."],
    ["Anti-Inflammatory Nutrition System", "Improves mood; reduces risk of depression.", "Provides essential nutrients for neurotransmitter synthesis and brain health.", "Improves insulin sensitivity; provides building blocks for hormone production.", "Reduces chronic low-grade inflammation; provides micronutrients (e.g., Vit. C, Zinc) for immune function.", "Protects against oxidative stress; associated with longer telomere length and slower biological aging.", "Modulates ECS activity to counteract diet-induced overactivation and promote metabolic balance."],
    ["Regular Exercise System", "Reduces stress & anxiety; improves cognition & mood.", "Stimulates dopamine release; promotes neuroplasticity & may buffer against cognitive decline.", "Increases insulin sensitivity; modulates cortisol & catecholamine response to stress; stimulates HGH.", "Enhances immunosurveillance via immune cell mobilization; exerts long-term anti-inflammatory effects.", "Improves mitochondrial function; may help preserve telomere length.", "Modulates ECS signaling, contributing to metabolic health and potentially the \"runner's high\"."],
    ["Stress Management & Mindfulness System", "Reduces perceived stress, anxiety, & rumination; increases psychological flexibility.", "Modulates activity in prefrontal cortex & amygdala, improving emotional regulation.", "Attenuates HPA axis hyperactivity, leading to a healthier cortisol response.", "Buffers against stress-induced immunosuppression; reduces inflammatory signaling.", "Reduces oxidative stress, a key driver of cellular senescence and telomere shortening.", "Helps regulate stress-induced alterations in ECS signaling."]
  ];

  const table3Headers = ["Strategy/Technique", "Psychological Barrier Addressed", "Evidence-Based Mechanism", "Practical Example"];
  const table3Data = [
    ["Implementation Intention", "Procrastination; Forgetting; Intention-Behavior Gap", "Creates a strong cue-behavior link, automating action initiation and bypassing conscious deliberation.", "IF it is 3 PM, THEN I will close my email and work on my most important task for 25 minutes."],
    ["Habit Stacking", "Lack of a cue for a new habit", "Leverages the automaticity of an existing habit to trigger a new one, integrating it into an established sequence.", "AFTER I brush my teeth at night, I WILL lay out my workout clothes for the morning."],
    ["Environmental Design", "Temptation; Friction for good habits; Low visibility of cues", "Increases friction for undesired behaviors and decreases it for desired ones, making the right choice the easy choice.", "Place a bowl of fruit on the counter (visible cue, low friction). Hide junk food in a high cupboard (invisible cue, high friction)."],
    ["Start Small (Atomic)", "Feeling overwhelmed; Lack of motivation; High activation energy", "Reduces the initial effort required to start a behavior, making it easier to build momentum and consistency.", "Instead of \"Go to the gym,\" the initial habit is \"Put on running shoes.\" The goal is to master the art of showing up."],
    ["SMART Goals", "Vague or poorly defined objectives", "Provides clarity, measurability, and a time-bound structure, which makes progress tangible and success clearly defined.", "Instead of \"Get in shape,\" use \"I will walk for 30 minutes, 3 times per week, for the next month.\""],
    ["Self-Monitoring & Feedback", "Lack of awareness of progress; Slow progress; Relapse", "Makes progress visible, provides reinforcing feedback, and allows for data-driven adjustments to the system.", "Use a habit-tracking app or a simple calendar to mark off each day a desired behavior is completed."],
    ["Focus on Short-Term Results", "Hyperbolic Discounting (preferring immediate gratification)", "Provides more frequent rewards and feedback, making the benefits of the system feel more immediate and reinforcing.", "Instead of focusing on annual weight loss, focus on hitting daily calorie and step targets, and celebrate weekly streaks."]
  ];


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            The Architecture of Well-Being
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            A Systems-Based Approach to Personal Health and Performance
          </p>
        </header>

        <main className="prose prose-invert prose-lg max-w-none lg:prose-xl">
          
          {/* Part I */}
          <section className="mb-16 p-8 rounded-xl bg-gray-800/50 shadow-2xl ring-1 ring-white/10">
            <h2 className="text-3xl font-bold text-teal-300 border-b-2 border-teal-500 pb-2 mb-6">
              Part I: The Framework of Intentional Living
            </h2>
            <p className="lead">
             This section deconstructs the architecture of intentional living, moving from the unconscious automaticity of habits to the conscious construction of routines and, ultimately, to the adaptive, process-oriented framework of personal systems.
            </p>
            <AccordionItem title="Deconstructing Systems, Routines, and Habits">
              <p>Human existence is defined by patterns. For much of modern life, the pursuit of personal improvement has focused on isolated actions and discrete goals. However, a deeper, more integrated understanding of human behavior, drawing from psychology, neuroscience, and systems thinking, reveals a more powerful paradigm. True, sustainable change arises not from singular acts of will, but from the deliberate design of interconnected processes that make desired outcomes an emergent property of daily life.</p>
            </AccordionItem>
            <AccordionItem title="The Neurological Blueprint of Behavior: Habits as Automaticity">
              <p>A habit is an acquired mode of behavior that has become nearly or completely involuntary—an automatic response to a specific contextual cue. This automation is a marvel of neurological efficiency, conserving the brain's conscious attention by delegating recurring tasks to the basal ganglia. The "habit loop" (cue, routine, reward) strengthens neural pathways, making behaviors automatic and freeing up the prefrontal cortex for higher-order thinking.</p>
            </AccordionItem>
            <AccordionItem title="The Conscious Construction of Daily Life: Routines and Rituals">
              <p>Routines are a set of habits or activities followed in a specific order, requiring conscious effort to initiate. They provide structure and predictability. Rituals are routines imbued with symbolic meaning and intentionality. While a routine is about completion, a ritual is about the experience and mindset, fostering emotional well-being and a sense of grounding.</p>
            </AccordionItem>
            <AccordionItem title="The Systems-Thinking Paradigm: Elevating Process Over Outcome">
               <p>A system is a collection of interconnected habits and routines that makes progress a natural consequence. It shifts focus from finite goals to the continuous process. This avoids the pitfalls of a goal-only mindset, such as postponed happiness and a lack of long-term sustainability. Success becomes the product of compounding daily actions, not a single achievement.</p>
            </AccordionItem>
            <AccordionItem title="The Stability-Flexibility Dialectic: Balancing Routine and Novelty">
               <p>An effective personal system balances stability and flexibility. Stability from routines reduces anxiety and decision fatigue. Flexibility through novelty and unstructured time boosts creativity, neuroplasticity, and life satisfaction. A robust system provides a scaffold that handles essentials efficiently, creating the cognitive surplus needed for spontaneity and exploration.</p>
            </AccordionItem>
             <StyledTable headers={table1Headers} data={table1Data} caption="Table 1: A Comparative Analysis of Behavioral Constructs" />
          </section>

          {/* Part II */}
          <section className="mb-16 p-8 rounded-xl bg-gray-800/50 shadow-2xl ring-1 ring-white/10">
            <h2 className="text-3xl font-bold text-teal-300 border-b-2 border-teal-500 pb-2 mb-6">
              Part II: The System-Wide Biological Cascade
            </h2>
            <p className="lead">
             Implementing a well-designed personal system initiates a cascade of interconnected effects through every biological system. It's a powerful strategy for managing the body's stress responses, minimizing the cumulative "wear and tear" of allostatic load.
            </p>
            <AccordionItem title="Psychological, Physiological, and Cognitive Benefits">
              <p>A structured lifestyle provides a powerful antidote to anxiety by creating predictability and a sense of control. It reduces decision fatigue, freeing cognitive resources for focus and creativity. Routines stabilize mood, foster emotional regulation, and have been shown to increase one's sense of meaning in life by imposing coherence onto experience.</p>
            </AccordionItem>
            <AccordionItem title="Neurophysiological, Endocrine, and Immune Impacts">
              <p>A personal system harmonizes the body's internal symphony. It regulates the HPA axis (stress response), standardizes the sleep-wake cycle for optimal cortisol and melatonin rhythms, improves metabolic hormone sensitivity (insulin, leptin, ghrelin), and enhances immune function through better sleep, nutrition, and exercise. This holistic regulation strengthens the body's ability to defend itself and maintain balance.</p>
            </AccordionItem>
             <AccordionItem title="Cellular Health and the Endocannabinoid System">
              <p>The benefits extend to the cellular level. Systemic interventions promote cellular repair through processes like autophagy (the body's cleanup system), particularly during sleep. They can even influence the rate of biological aging by protecting telomeres. Furthermore, a healthy lifestyle helps balance the endocannabinoid system, a master regulator of metabolism, counteracting the dysregulation caused by modern diets and sedentary behavior.</p>
            </AccordionItem>
            <StyledTable headers={table2Headers} data={table2Data} caption="Table 2: Systemic Lifestyle Interventions and Their Multi-System Physiological Effects" />
          </section>

          {/* Part III */}
          <section className="mb-16 p-8 rounded-xl bg-gray-800/50 shadow-2xl ring-1 ring-white/10">
            <h2 className="text-3xl font-bold text-teal-300 border-b-2 border-teal-500 pb-2 mb-6">
              Part III: A Practitioner's Handbook for System Design
            </h2>
            <p className="lead">
              This section translates theory into practice, providing an evidence-based "how-to" guide for constructing a resilient and effective personal system that overcomes common barriers to sustainable change.
            </p>
            <AccordionItem title="Foundational Principles and Techniques">
              <p>Success hinges on core principles: Start Small (the "atomic" principle of 1% daily improvements), focus on Consistency over Intensity (repetition forges habits), and adopt a Process-Oriented Mindset (find satisfaction in the execution of the system). Techniques like Habit Stacking ("After [current habit], I will [new habit]") and Environmental Design (making good habits easy and bad habits hard) are key.</p>
            </AccordionItem>
            <AccordionItem title="The Power of Pre-Commitment: Implementation Intentions">
              <p>Bridge the gap between intention and action with "if-then" plans. An implementation intention ("If [situation] arises, then I will [action]") delegates behavioral control to a specific cue, automating the response and bypassing the need for in-the-moment willpower. This is a powerful tool for overcoming procrastination and ensuring the system's processes are executed reliably.</p>
            </AccordionItem>
            <AccordionItem title="Overcoming Obstacles and Building a Multi-Scale Framework">
              <p>Anticipate challenges like decision fatigue, old habits, and social friction. Build resilience by simplifying choices, using environmental design, leveraging social support, and tracking short-term progress. A key rule is "never miss twice." Structure your systems across different timescales—daily (energy management), weekly (planning), monthly (review), and annual (vision)—to create a coherent and compounding architecture for life.</p>
            </AccordionItem>
            <StyledTable headers={table3Headers} data={table3Data} caption="Table 3: An Evidence-Based Toolkit for System Implementation" />
          </section>

          {/* Conclusion */}
          <section className="text-center mt-16">
             <h2 className="text-3xl font-bold text-teal-300 mb-4">Conclusion</h2>
             <div className="max-w-4xl mx-auto text-gray-300 space-y-4">
                <p>The intentional construction of personal systems represents a paradigm shift in the pursuit of well-being. By embracing a holistic, process-oriented approach, we move beyond fleeting goals to manage allostatic load, buffer against chronic stress, and create a virtuous cascade of benefits across our entire biology.</p>
                <p>Implementation is not about willpower, but intelligent design. Using evidence-based strategies, anyone can build a resilient architecture for their life—one that doesn't constrain freedom but enables it, creating the space for creativity, spontaneity, and a deeply engaged existence.</p>
             </div>
          </section>

        </main>
      </div>
    </div>
  );
}
