"use client";

import React, { useState, FC, ReactNode, SVGProps } from 'react';
import InsightModal from '@/components/blog/InsightModal';
import { CHIEF_STRATEGIST_INSIGHTS } from '@/lib/blog/insights/chief-strategist';
import type { Insight } from '@/lib/blog/insights/types';

// --- TYPE DEFINITIONS for strict TypeScript ---

interface PrincipleCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

interface BenefitItemProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

interface CommandTagProps {
    name: string;
}

// --- SVG ICONS (as typed Functional Components) ---

const BrainCircuitIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.73c0 .27.16.58.67.5A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/>
    <path d="M12 11.1v3.33" /><path d="M12 17.78v.01" /><path d="M12 4.44v.01" /><path d="m8.5 6.5 1 1.5" /><path d="m14.5 6.5-1 1.5" /><path d="m6.5 10.5 1.5 1" /><path d="m16 10.5-1.5 1" />
  </svg>
);
const ZapIcon: FC<SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const TargetIcon: FC<SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const BookOpenIcon: FC<SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const MicroscopeIcon: FC<SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>;
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

const CommandTag: FC<CommandTagProps> = ({ name }) => (
  <div className="bg-gray-700 text-gray-200 text-sm font-mono py-1.5 px-3 rounded-md border border-gray-600 hover:bg-cyan-500 hover:text-black transition-all cursor-default">
    {name}
  </div>
);

const BenefitItem: FC<BenefitItemProps> = ({ icon, title, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-gray-400 text-sm">{children}</p>
        </div>
    </div>
);

// --- MAIN INFOGRAPHIC COMPONENT ---

export default function GemInfographic(): JSX.Element {
  const [openInsight, setOpenInsight] = useState<Insight | null>(null);

  return (
    <div className="bg-gray-900 text-white font-sans antialiased">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-cyan-400 font-semibold">Gem Architecture Showcase</p>
          <h1 className="text-4xl lg:text-5xl font-bold mt-2 tracking-tight">Anatomy of a Critical Partner AI</h1>
          <p className="mt-4 text-lg text-gray-400">
            Showcasing an AI agent engineered for deep strategic partnership, not just task completion. This is the blueprint for building AI that drives tangible results.
          </p>
        </div>

        <div className="mt-16 lg:mt-24 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
                <Icon className="w-20 h-20 !bg-gray-700"><BrainCircuitIcon className="text-cyan-400 w-10 h-10" /></Icon>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">The Persona Core: "Chief Strategist"</h2>
                <p className="mt-2 text-gray-300">
                    Instead of a generic assistant, we define a clear, authoritative **role**. This AI embodies a specific persona, enabling it to provide consistent, context-aware guidance and maintain a strategic, long-term perspective.
                </p>
            </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10">The Operating System: Core Principles</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <PrincipleCard icon={<TargetIcon className="text-red-400" />} title="Blunt Objectivity">
              Engineered to prioritize goals over feelings. This AI delivers unfiltered, effective feedback for maximum impact, removing confirmation bias.
            </PrincipleCard>
            <PrincipleCard icon={<BookOpenIcon className="text-yellow-400" />} title="Always Explain the 'Why'">
              Every suggestion is backed by clear, logical reasoning tied to core objectives. This transforms the AI from a black box into a transparent, trusted advisor.
            </PrincipleCard>
          </div>
        </div>

        <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold">The Power of a Command-Driven Interface</h2>
            <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
                A specialized command language allows the user to get precise, predictable outputs with speed. This moves the interaction from conversation to command.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                {["Critique", "Revise", "Dashboard", "Plan [duration]", "Synergize [A] & [B]", "Deconstruct [Skill]", "Priority", "Cycle [duration]", "Meal from [ingredients]", "Corrective [issue]"].map(cmd => <CommandTag key={cmd} name={cmd} />)}
            </div>
        </div>
        
        {/* INTERACTIVE DEMO SECTION */}
        <div className="mt-20 max-w-3xl mx-auto">
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-cyan-500/50">
                <h2 className="text-2xl font-bold text-center">See the commands in action</h2>
                <p className="text-center text-gray-400 mt-2">Pick a command to see exactly how the Chief Strategist responds.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {CHIEF_STRATEGIST_INSIGHTS.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => setOpenInsight(option.insight)}
                            className="rounded-md border border-gray-600 bg-gray-700/60 px-4 py-3 text-left transition-colors hover:border-cyan-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                            <span className="block font-semibold text-cyan-300">{option.label}</span>
                            {option.hint && (
                                <span className="mt-0.5 block text-xs text-gray-400">{option.hint}</span>
                            )}
                        </button>
                    ))}
                </div>
                 <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        These are worked examples of what each command produces, written out in full so the demo reads the same every time.
                    </p>
                </div>
            </div>
        </div>
        
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold">From Simple Assistant to Indispensable Strategist</h2>
          <p className="mt-2 text-gray-400 max-w-xl mx-auto">
              This is the future of applied AI. Ready to build a specialized agent for your business?
          </p>
          <button className="mt-6 bg-cyan-500 text-black font-semibold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-colors">
              Contact Us
          </button>
        </div>
        
      </div>

      <InsightModal insight={openInsight} onClose={() => setOpenInsight(null)} />
    </div>
  );
}
