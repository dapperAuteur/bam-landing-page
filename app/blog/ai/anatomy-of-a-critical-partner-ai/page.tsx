import Link from 'next/link';
import React from 'react';

// Helper component for icons to keep the main component clean
const Icon = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex-shrink-0 w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center ${className}`}>
    {children}
  </div>
);

// SVG Icons (self-contained)
const BrainCircuitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.73c0 .27.16.58.67.5A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/>
    <path d="M12 11.1v3.33" /><path d="M12 17.78v.01" />
    <path d="M12 4.44v.01" /><path d="m8.5 6.5 1 1.5" /><path d="m14.5 6.5-1 1.5" />
    <path d="m6.5 10.5 1.5 1" /><path d="m16 10.5-1.5 1" />
  </svg>
);

const ZapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
);

const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);

const MicroscopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0 0-14h-1"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>
);


const PrincipleCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
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

const CommandTag = ({ name }: { name: string }) => (
  <div className="bg-gray-700 text-gray-200 text-sm font-mono py-1.5 px-3 rounded-md border border-gray-600 hover:bg-cyan-500 hover:text-black transition-all cursor-default">
    {name}
  </div>
);

const BenefitItem = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode; }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-gray-400 text-sm">{children}</p>
        </div>
    </div>
);


// The main component
export default function GemInfographic() {
  return (
    <div className="bg-gray-900 text-white font-sans antialiased">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-cyan-400 font-semibold">Gem Architecture Showcase</p>
          <h1 className="text-4xl lg:text-5xl font-bold mt-2 tracking-tight">Anatomy of a Critical Partner AI</h1>
          <p className="mt-4 text-lg text-gray-400">
            Showcasing an AI agent engineered for deep strategic partnership, not just task completion. 
            This is the blueprint for building AI that drives tangible results.
          </p>
        </div>

        {/* Core Persona Section */}
        <div className="mt-16 lg:mt-24 p-8 bg-gray-800/50 rounded-2xl border border-gray-700 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
                <Icon className="w-20 h-20 !bg-gray-700">
                    <BrainCircuitIcon />
                </Icon>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">The Persona Core: "Chief Strategist"</h2>
                <p className="mt-2 text-gray-300">
                    Instead of a generic assistant, we define a clear, authoritative **role**. This AI embodies a specific persona, enabling it to provide consistent, context-aware guidance and maintain a strategic, long-term perspective. It's not just an AI; it's a dedicated partner in the user's mission.
                </p>
            </div>
        </div>

        {/* Guiding Principles Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10">The Operating System: Core Principles</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <PrincipleCard icon={<TargetIcon />} title="Blunt Objectivity">
              Engineered to prioritize goals over feelings. This AI delivers unfiltered, effective feedback for maximum impact, removing confirmation bias.
            </PrincipleCard>
            <PrincipleCard icon={<BookOpenIcon />} title="Always Explain the 'Why'">
              Every suggestion is backed by clear, logical reasoning tied to core objectives. This transforms the AI from a black box into a transparent, trusted advisor.
            </PrincipleCard>
            <PrincipleCard icon={<ZapIcon />} title="Strategic Long-Term Focus">
              Built with multi-decade planning capabilities to identify and correct actions that favor short-term gains at the expense of sustainable, long-term progress.
            </PrincipleCard>
            <PrincipleCard icon={<MicroscopeIcon />} title="Hyper-Personalization via Data">
              Actively ingests user-specific data—fitness history, project files, available tools—to provide truly personalized, contextually relevant guidance.
            </PrincipleCard>
          </div>
        </div>

        {/* Command Interface Section */}
        <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold">The Power of a Command-Driven Interface</h2>
            <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
                A specialized command language allows the user to get precise, predictable outputs with speed. This moves the interaction from conversation to command.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                <CommandTag name="Critique" />
                <CommandTag name="Revise" />
                <CommandTag name="Dashboard" />
                <CommandTag name="Plan [duration]" />
                <CommandTag name="Synergize [A] & [B]" />
                <CommandTag name="Deconstruct [Skill]" />
                <CommandTag name="Priority" />
                <CommandTag name="Cycle [duration]" />
                <CommandTag name="Meal from [ingredients]" />
                <CommandTag name="Corrective [issue]" />
            </div>
        </div>
        
        {/* Advanced Capabilities & Outcomes */}
        <div className="mt-20 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-cyan-400">Advanced Architecture</h3>
                 <BenefitItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 mt-1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                    title="Dynamic Evaluation Rubrics"
                >
                    Utilizes custom frameworks (e.g., "5 C's of Storytelling") for objective, consistent, and measurable performance analysis.
                </BenefitItem>
                <BenefitItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 mt-1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>}
                    title="Deep Knowledge Integration"
                >
                    Connects to user-provided documents, data files, and domain-specific knowledge for context-rich, highly relevant output.
                </BenefitItem>
            </div>
             <div className="space-y-6">
                <h3 className="text-xl font-bold text-cyan-400">The Business Outcome</h3>
                <BenefitItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 mt-1"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                    title="Increased ROI on AI"
                >
                    A specialized agent provides higher value than a generalist model by solving specific, high-stakes problems with precision.
                </BenefitItem>
                <BenefitItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 mt-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
                    title="Reduced User Friction"
                >
                    The command-driven system and clear persona lead to faster, more predictable interactions, increasing user adoption and trust.
                </BenefitItem>
            </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold">From Simple Assistant to Indispensable Strategist</h2>
          <p className="mt-2 text-gray-400 max-w-xl mx-auto">
              This is the future of applied AI. Ready to build a specialized agent for your business?
          </p>
          <Link
            href={"http://localhost:3000/#contact"}
            className="mt-6 bg-cyan-500 text-black font-semibold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-colors">
              Contact Us
          </Link>
        </div>
        
      </div>
    </div>
  );
}
