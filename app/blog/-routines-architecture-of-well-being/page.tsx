import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./../../../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./../../../components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../../../components/ui/table";
import { BrainCircuit, Dna, Activity, Zap, ShieldCheck, Target, Brain, Bot, BookOpen, Clock, Users, Atom, GitCommitHorizontal } from 'lucide-react';

// NOTE: To run this component, you'll need to have a Next.js 15 project set up
// with Shadcn/UI (https://ui.shadcn.com/) and Lucide React (https://lucide.dev/) installed.
// You can install them with:
// npx shadcn-ui@latest init
// npx shadcn-ui@latest add card accordion table
// npm install lucide-react

const constructData = [
  { construct: 'Habit', characteristic: 'Automaticity', consciousness: 'Low / Non-conscious', driver: 'Environmental Cue', example: 'Automatically grabbing coffee after waking up.', icon: <Bot className="h-6 w-6 text-blue-500" /> },
  { construct: 'Routine', characteristic: 'Intentionality', consciousness: 'Conscious / Deliberate', driver: 'Deliberate Practice', example: 'A structured morning sequence of meditation, exercise, and breakfast.', icon: <Activity className="h-6 w-6 text-green-500" /> },
  { construct: 'System', characteristic: 'Purpose / Framework', consciousness: 'Highly Conscious / Strategic', driver: 'Guiding Principles / Goals', example: 'A framework for health that includes daily exercise and meal prep.', icon: <GitCommitHorizontal className="h-6 w-6 text-purple-500" /> },
  { construct: 'Ritual', characteristic: 'Meaning / Engagement', consciousness: 'Mindful / Present', driver: 'Emotional / Spiritual Value', example: 'Mindfully savoring tea as a moment of peace.', icon: <BookOpen className="h-6 w-6 text-orange-500" /> },
];

const hormoneData = [
    { hormone: 'Cortisol', normalPattern: 'Peaks in the morning, declines through the day.', disruptionImpact: 'Rhythm flattens or reverses; evening levels increase.', consequence: 'Increased stress, impaired glucose metabolism.' },
    { hormone: 'Growth Hormone', normalPattern: 'Major peak during deep sleep.', disruptionImpact: 'Nighttime secretion is significantly reduced.', consequence: 'Impaired tissue repair and muscle recovery.' },
    { hormone: 'Melatonin', normalPattern: 'Rises in the evening to promote sleep.', disruptionImpact: 'Secretion is suppressed by light at night.', consequence: 'Difficulty sleeping, master clock desynchronization.' },
    { hormone: 'Leptin', normalPattern: 'Rises during sleep, signaling satiety.', disruptionImpact: 'Levels are suppressed.', consequence: 'Increased appetite and potential for weight gain.' },
    { hormone: 'Ghrelin', normalPattern: 'Decreases during sleep; signals hunger.', disruptionImpact: 'Levels are elevated.', consequence: 'Increased hunger, especially for high-calorie foods.' },
];

const exerciseImmunityData = [
    { level: 'Sedentary', risk: 'Average', characteristics: 'Baseline immune function.' },
    { level: 'Moderate Routine', risk: 'Lowered', characteristics: 'Enhanced immunosurveillance, improved immune cell recirculation, reduced chronic inflammation.' },
    { level: 'High-Intensity / Prolonged', risk: 'Heightened', characteristics: 'Transient immunosuppression ("open window"), reduced function of key immune cells.' },
];

const strategyData = [
    { domain: 'Mental Health', goal: '"Reduce daily anxiety."', cue: 'Feeling overwhelmed at my work desk.', routine: '"If I feel my shoulders tense up at my desk, then I will close my eyes and take five slow, deep breaths."' },
    { domain: 'Nutrition', goal: '"Eat more vegetables."', cue: 'Plating my dinner.', routine: '"After I put the main protein on my dinner plate, I will fill half of the remaining space with green vegetables."' },
    { domain: 'Physical Fitness', goal: '"Be more physically active."', cue: 'Finishing my workday.', routine: '"After I shut down my work computer for the day, I will immediately change into my workout clothes."' },
    { domain: 'Sleep Hygiene', goal: '"Improve sleep quality."', cue: 'My 9:30 PM phone alarm goes off.', routine: '"If my 9:30 PM alarm rings, then I will put my phone on its charger in the kitchen and not look at it again until morning."' },
];


export default function WellbeingArchitecture() {
  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            The Architecture of Well-being
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            A Neurobiological and System-Wide Analysis of Personal Routines
          </p>
        </header>

        <main className="space-y-12">
          {/* Section 1: The Architecture of Action */}
          <section id="architecture-of-action">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <Users className="h-8 w-8 mr-3 text-blue-600" />
              Part I: The Architecture of Action
            </h2>
            <Card className="bg-white shadow-lg border-t-4 border-blue-500">
              <CardHeader>
                <CardTitle>Deconstructing Routines, Habits, and Systems</CardTitle>
                <CardDescription>Understanding the foundational concepts of behavioral patterns is key to intentional living.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-700">
                  While often used interchangeably, habits, routines, rituals, and systems represent different levels of consciousness and intentionality. Distinguishing between them provides the clarity needed to understand their profound biological and psychological impacts.
                </p>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Construct</TableHead>
                                <TableHead>Core Characteristic</TableHead>
                                <TableHead>Primary Driver</TableHead>
                                <TableHead>Example</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {constructData.map((item) => (
                                <TableRow key={item.construct}>
                                    <TableCell className="font-medium flex items-center">{item.icon}<span className="ml-2">{item.construct}</span></TableCell>
                                    <TableCell>{item.characteristic}</TableCell>
                                    <TableCell>{item.driver}</TableCell>
                                    <TableCell>{item.example}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: System-Wide Impact */}
          <section id="system-wide-impact">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <Atom className="h-8 w-8 mr-3 text-green-600" />
              Part II: The System-Wide Impact of Routine
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg shadow-md">
                <AccordionTrigger className="p-6 text-lg font-semibold">Psychological & Cognitive Homeostasis</AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-gray-600">
                  Stable daily routines act as a powerful buffer against psychological distress. They foster a sense of control, lower stress, reduce anxiety, and manage mood disorder symptoms by reducing decision fatigue and preserving finite cognitive resources.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white rounded-lg shadow-md">
                <AccordionTrigger className="p-6 text-lg font-semibold">Endocrinological Regulation & Hormonal Balance</AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                    <p className="mb-4 text-gray-600">The sleep-wake cycle is the master routine for hormonal balance. Disruption triggers a cascade of endocrine dysregulation with far-reaching consequences for metabolism and stress.</p>
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hormone</TableHead>
                                    <TableHead>Impact of Disruption</TableHead>
                                    <TableHead>Primary Consequence</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hormoneData.map(h => (
                                    <TableRow key={h.hormone}>
                                        <TableCell className="font-bold">{h.hormone}</TableCell>
                                        <TableCell>{h.disruptionImpact}</TableCell>
                                        <TableCell>{h.consequence}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white rounded-lg shadow-md">
                <AccordionTrigger className="p-6 text-lg font-semibold">Immunological Resilience & The J-Curve</AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                    <p className="mb-4 text-gray-600">The relationship between exercise and immune function is non-linear. A routine of moderate exercise enhances immune defense, while excessive, high-intensity exercise can temporarily suppress it.</p>
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Activity Level</TableHead>
                                    <TableHead>Relative Risk of Infection</TableHead>
                                    <TableHead>Key Characteristics</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exerciseImmunityData.map(e => (
                                    <TableRow key={e.level}>
                                        <TableCell className="font-bold">{e.level}</TableCell>
                                        <TableCell>{e.risk}</TableCell>
                                        <TableCell>{e.characteristics}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white rounded-lg shadow-md">
                <AccordionTrigger className="p-6 text-lg font-semibold">Cellular Integrity & Biological Aging</AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-gray-600">
                  Consistent sleep is not passive rest but a critical period for cellular repair. During deep sleep, the body ramps up DNA repair and protein synthesis. Disrupted sleep accelerates cellular aging, evidenced by shortened telomeres and increased inflammation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Section 3: Neurological Blueprint */}
          <section id="neurological-blueprint">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <BrainCircuit className="h-8 w-8 mr-3 text-red-600" />
              Part III: The Neurological Blueprint
            </h2>
             <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Brain className="mr-2"/>The Corticostriatal Circuit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">Habit formation involves a neural shift from the conscious, goal-directed prefrontal cortex to the automatic, stimulus-response basal ganglia. This frees up mental energy, making behavior more efficient.</p>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Zap className="mr-2"/>The Chemistry of Consistency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">Dopamine acts as a powerful "teaching signal" that reinforces behavior. It strengthens the neural circuits associated with a rewarding action, making the behavior more likely to be repeated automatically in the future.</p>
                    </CardContent>
                </Card>
                 <Card className="bg-white shadow-lg md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Dna className="mr-2"/>The Endocannabinoid System (ECS)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700">The ECS is a master regulator that helps create the rewarding internal states (like the "runner's high") that dopamine then reinforces. It translates physical action into a psychological reward, bridging the gap between doing a routine and wanting to do it.</p>
                    </CardContent>
                </Card>
            </div>
          </section>

          {/* Section 4: From Intention to Action */}
          <section id="intention-to-action">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <Target className="h-8 w-8 mr-3 text-yellow-600" />
              Part IV: From Intention to Action
            </h2>
            <Card className="bg-white shadow-lg border-t-4 border-yellow-500">
              <CardHeader>
                <CardTitle>Evidence-Based Strategies for Building Routines</CardTitle>
                <CardDescription>Bridge the "intention-behavior gap" with scientifically validated techniques.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-700">
                  The failure to establish new routines is often a failure of strategy, not willpower. By consciously engineering our behaviors, we can dramatically increase our chances of success.
                </p>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Health Domain</TableHead>
                                <TableHead>Goal (Intention)</TableHead>
                                <TableHead>Engineered Routine (Action)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {strategyData.map((item) => (
                                <TableRow key={item.domain}>
                                    <TableCell className="font-medium">{item.domain}</TableCell>
                                    <TableCell>{item.goal}</TableCell>
                                    <TableCell className="italic">{item.routine}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-800">Key Takeaway: Habit Stacking</h4>
                    <p className="text-blue-700 mt-2">The most effective way to build a new habit is to stack it onto an existing one. Use the formula: <span className="font-mono bg-blue-100 p-1 rounded">After [Current Habit], I will do [New Habit].</span> This leverages existing neural pathways to automate the new behavior faster.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="text-center mt-16 text-gray-500">
            <p>This component synthesizes key findings on the science of routines for personal well-being.</p>
            <p>&copy; 2025 Wellbeing Systems Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
