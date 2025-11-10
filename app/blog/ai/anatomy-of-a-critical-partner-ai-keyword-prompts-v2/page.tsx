"use client";

import React, { useState, useRef, FC, ReactNode, SVGProps } from 'react';

// --- TYPE DEFINITIONS for strict TypeScript ---

interface CommandInfo {
  name: string;
  description: string;
  exampleUsage: string;
  sampleOutput: string;
}

interface PrincipleCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

// --- DATA: The Complete Command Manual ---

const commands: CommandInfo[] = [
  {
    name: "Critique",
    description: "Requests a direct, analytical report on a piece of work or plan. The output is a bulleted list separating strengths from areas for improvement.",
    exampleUsage: "Critique my social media post: 'Just finished my workout. Feeling strong.'",
    sampleOutput: "**Strengths:**\n- Consistency (5/5): Aligns with your journey.\n**Areas for Improvement:**\n- Compelling Hook (1/5): The opening is too generic and lacks curiosity."
  },
  {
    name: "Revise",
    description: "Asks the AI to take a submitted plan or piece of content and edit it directly. It shows changes using markdown for immediate implementation.",
    exampleUsage: "Revise my morning plan: 'Wake up, workout.'",
    sampleOutput: "~~Wake up, workout.~~\n\n**6:00 AM: Wake up & Hydrate (No phone).**\n**6:15 AM: Dynamic Warm-up.**\n**6:30 AM: Kettlebell Workout.**"
  },
  {
    name: "Dashboard",
    description: "Provides a high-level strategic overview for weekly or monthly reviews. It includes KPIs, a blunt assessment, and actionable directives.",
    exampleUsage: "Dashboard for last week's storytelling posts.",
    sampleOutput: "**Weekly Performance Review:**\n- **Average Rubric Score:** 2.8 / 5.0\n- **Key Insight:** Posts showing vulnerability perform significantly better than simple status updates."
  },
  {
    name: "Plan [duration]",
    description: "Generates a detailed markdown schedule for a specified duration (e.g., 'Day', 'Week') based on your stated priorities.",
    exampleUsage: "Plan Day. Priority is writing and handstand practice.",
    sampleOutput: "**Today's Strategic Plan:**\n- **9:00 AM:** Deep Work Block (90 mins): Writing.\n- **3:00 PM:** Physical Training: Handstand progression drills."
  },
  {
    name: "Deconstruct [Skill]",
    description: "Breaks down a complex skill into a step-by-step, long-term progression plan designed for mastery over months or years.",
    exampleUsage: "Deconstruct Front Lever",
    sampleOutput: "**Front Lever Mastery Progression:**\n**Phase 1: Foundation (3-6 months)**\n- **Focus:** Core strength & scapular retraction.\n- **Exercises:** Hollow body holds, Pull-ups."
  },
  {
    name: "Synergize [A] & [B]",
    description: "Finds clever connections between two goals to maximize efficiency and combine efforts. Activates the core 'Chief Strategist' function.",
    exampleUsage: "Synergize storytelling posts and building a community.",
    sampleOutput: "**Strategy 1: Interactive Challenge:** End every post with a direct challenge to your followers (e.g., 'Post a video of your personal best'). This turns passive consumption into active participation."
  },
  {
    name: "Priority",
    description: "Cuts through indecision by identifying the single most important task to advance the mission *right now*. Delivers blunt, direct focus.",
    exampleUsage: "Priority",
    sampleOutput: "**Your single priority today is to publish your social media post.**\n**Reason:** You have missed two days, breaking consistency. The narrative is built on the daily process. All other tasks are secondary."
  },
  {
    name: "Cycle [Duration]",
    description: "Generates a progressive, multi-day workout plan for a specific goal. Designed for a continuous loop of planning, execution, and feedback.",
    exampleUsage: "Cycle 1 week for shoulder stability.",
    sampleOutput: "**1-Week Micro-Cycle: Shoulder Stability**\n**Day 1: Push Focus**\n- A1: Kettlebell Overhead Press: 4x6-8 reps\n- B1: Wall-Facing Handstand Hold: 4x30s"
  },
  {
    name: "Corrective [Issue]",
    description: "Creates a targeted, short-term micro-plan of drills to address specific physical imbalances, aches, or weaknesses.",
    exampleUsage: "Corrective plan for tight hip flexors.",
    sampleOutput: "**2-Week Corrective Plan: Hip Mobility**\n**Phase 1: Inhibit & Lengthen**\n1. Foam Roll Quads: 60s each side.\n2. Kneeling Hip Flexor Stretch: 2x30s each side."
  },
  {
    name: "Meal from [Ingredients]",
    description: "Generates 1-3 simple, healthy recipe options based on a list of ingredients you have on hand.",
    exampleUsage: "Meal from chicken breast, spinach, feta cheese",
    sampleOutput: "**Option 1: Spinach & Feta Stuffed Chicken (15 mins prep)**\n1. Butterfly the chicken breast.\n2. Mix spinach and feta, then stuff the chicken...\n"
  }
];


// --- SVG ICONS (as typed Functional Components) ---

const BrainCircuitIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.73c0 .27.16.58.67.5A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/></svg>
);
const TargetIcon: FC<SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const BookOpenIcon: FC<SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const SendIcon: FC<SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;

// --- REUSABLE UI COMPONENTS ---

const Icon: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex-shrink-0 w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center ${className}`}>
    {children}
  </div>
);

const PrincipleCard: FC<PrincipleCardProps> = ({ icon, title, children }) => (
  <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700 hover:border-cyan-400 hover:bg-gray-800 transition-all duration-300">
    <div className="flex items-start space-x-4">
      <Icon>{icon}</Icon>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-gray-400 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  </div>
);


// --- MAIN INFOGRAPHIC COMPONENT ---

export default function GemInfographic(): JSX.Element {
  const [selectedCommand, setSelectedCommand] = useState<CommandInfo>(commands[0]);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const responseRef = useRef<HTMLDivElement>(null);

  const handlePromptSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiKey = GEMINI_API_KEY; // API key is handled by the execution environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    console.log('SYSTEM_PROMPT :>> ', SYSTEM_PROMPT);

    try {
      console.log('SYSTEM_PROMPT :>> ', SYSTEM_PROMPT);
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.statusText}`);
      }

      const result = await apiResponse.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setResponse(text);
      } else {
        throw new Error('No content received from API.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (response || error) {
      responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [response, error]);

  return (
    <div className="bg-gray-900 text-white font-sans antialiased">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-cyan-400 font-semibold">Gem Architecture Showcase</p>
          <h1 className="text-4xl lg:text-5xl font-bold mt-2 tracking-tight">Anatomy of a Critical Partner AI</h1>
          <p className="mt-4 text-lg text-gray-400">
            This is the blueprint for building AI agents that drive tangible results through deep strategic partnership, not just task completion.
          </p>
        </div>

        <div className="mt-16 lg:mt-24 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
                <Icon className="w-20 h-20 !bg-gray-700"><BrainCircuitIcon className="text-cyan-400 w-10 h-10" /></Icon>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">The Persona Core: "Chief Strategist"</h2>
                <p className="mt-2 text-gray-300">
                    Instead of a generic assistant, we define a clear, authoritative **role**. This AI embodies a specific persona, enabling it to provide consistent, context-aware guidance.
                </p>
            </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10">The Operating System: Core Principles</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <PrincipleCard icon={<TargetIcon className="text-red-400" />} title="Blunt Objectivity">
              Engineered to prioritize goals over feelings, this AI delivers unfiltered, effective feedback for maximum impact.
            </PrincipleCard>
            <PrincipleCard icon={<BookOpenIcon className="text-yellow-400" />} title="Always Explain the 'Why'">
              Every suggestion is backed by clear reasoning tied to core objectives, transforming the AI into a transparent, trusted advisor.
            </PrincipleCard>
          </div>
        </div>
        
        {/* INTERACTIVE COMMAND MANUAL */}
        <div className="mt-20">
            <h2 className="text-3xl font-bold text-center">Interactive Command Manual</h2>
            <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-center">
                A specialized command language enables precise, predictable outputs. Click a command to learn more.
            </p>
            <div className="max-w-6xl mx-auto mt-10 lg:flex lg:gap-8">
                {/* Command List */}
                <div className="flex flex-wrap gap-3 justify-center lg:flex-col lg:justify-start lg:w-1/4">
                    {commands.map((cmd) => (
                        <button
                            key={cmd.name}
                            onClick={() => setSelectedCommand(cmd)}
                            className={`text-left font-mono py-2 px-4 rounded-md border w-full transition-all duration-200 text-sm ${selectedCommand.name === cmd.name ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'}`}
                        >
                           {cmd.name}
                        </button>
                    ))}
                </div>
                {/* Command Details */}
                <div className="mt-8 lg:mt-0 lg:w-3/4 bg-gray-800/50 p-6 rounded-xl border border-gray-700 min-h-[300px]">
                    {selectedCommand && (
                        <div>
                            <h3 className="text-xl font-bold text-cyan-400 font-sans">{selectedCommand.name}</h3>
                            <p className="mt-2 text-gray-300 text-sm">{selectedCommand.description}</p>
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <h4 className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Example Usage</h4>
                                <p className="mt-2 text-sm font-mono bg-gray-900/70 p-3 rounded-md text-green-300">"{selectedCommand.exampleUsage}"</p>
                            </div>
                             <div className="mt-4">
                                <h4 className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Sample Output</h4>
                                <div className="mt-2 text-sm bg-gray-900/70 p-3 rounded-md text-gray-300 whitespace-pre-wrap">{selectedCommand.sampleOutput}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* INTERACTIVE DEMO SECTION */}
        <div className="mt-20 max-w-3xl mx-auto" id="demo">
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-cyan-500/50">
                <h2 className="text-2xl font-bold text-center">Take it for a Test Drive</h2>
                <p className="text-center text-gray-400 mt-2">Try an example from the manual above or write your own command.</p>
                <form onSubmit={handlePromptSubmit} className="mt-6 flex gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                        placeholder='e.g., "Deconstruct Handstand"'
                        className="flex-grow bg-gray-700 text-white rounded-md px-4 py-3 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-cyan-500 text-black font-semibold rounded-md px-4 py-3 flex items-center justify-center hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors" disabled={isLoading}>
                        {isLoading ? <div className="w-6 h-6 border-2 border-black/50 border-t-black rounded-full animate-spin"></div> : <SendIcon className="w-6 h-6" />}
                    </button>
                </form>
                 <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Disclaimer: This is a lightweight demo for entertainment purposes. The AI's responses are illustrative and not from the fully configured Gem.
                    </p>
                </div>
            </div>
            
            {(response || error || isLoading) && (
                 <div ref={responseRef} className="mt-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700 min-h-[100px]">
                    {isLoading && <p className="text-gray-400 animate-pulse">Chief Strategist is thinking...</p>}
                    {error && <p className="text-red-400">Error: {error}</p>}
                    {response && <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: response.replace(/\n\s*\n/g, '<br /><br />').replace(/\n/g, '<br />') }} />}
                </div>
            )}
        </div>
        
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold">Ready to Build Your Strategic AI Partner?</h2>
          <p className="mt-2 text-gray-400 max-w-xl mx-auto">
              Move beyond generic assistants. Let's build a specialized AI agent that creates a competitive advantage for your business.
          </p>
          <button className="mt-6 bg-cyan-500 text-black font-semibold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-colors">
              Contact Me
          </button>
        </div>
      </div>
    </div>
  );
}

