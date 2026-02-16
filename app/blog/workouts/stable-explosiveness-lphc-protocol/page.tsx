"use client"
import React, { useState } from 'react';
import { 
  Clock, 
  Zap, 
  Shield, 
  Activity, 
  Dumbbell, 
  Play, 
  Timer, 
  Flame, 
  ChevronRight,
  Info,
  CheckCircle2,
  Box,
  RotateCw,
  BrainCircuit,
  Bone,
  ArrowDown
} from 'lucide-react';

interface CircuitStep {
  time: string;
  name: string;
  tool: string;
  type: string;
}

interface TierData {
  title: string;
  tagline: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  intensity: number;
  stability: number;
  power: number;
  description: string;
  tools: string[];
  circuit: CircuitStep[];
}

type TierDuration = 15 | 30 | 45;

// Blog Post Metadata
// export const metadata = {
//   slug: "lphc-centenarian-protocol",
//   title: "The LPHC Protocol: Engineering the 100-Year Sprinter",
//   description: "A strategic, time-compressed workout regimen focusing on the Lumbo-Pelvic-Hip Complex (LPHC) to maximize speed, stability, and longevity. Tools do not create results; strategy does.",
//   publishDate: "2026-02-16",
//   readTime: "7 min read",
//   category: "Performance",
//   featured: true,
//   tags: ["Longevity", "Sprinting", "NASM", "Biohacking", "LPHC"],
//   excerpt: "The 'Core' is a myth. The LPHC is the reality. Discover the modular 15/30/45-minute protocols designed to build the structural integrity required for a sub-17 second 100m dash at age 100."
// };

const WorkoutProtocol = () => {
  const [activeTier, setActiveTier] = useState<TierDuration>(30);

  const tiers: Record<TierDuration, TierData> = {
    15: {
      title: "The Neural Wake-Up",
      tagline: "Activation & Hygiene",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/50",
      bgGradient: "from-emerald-900/20 to-slate-950",
      intensity: 3,
      stability: 9,
      power: 2,
      description: "Daily maintenance to reverse the effects of sitting. Targets the 'sleeping' muscles (glutes, deep core) to prevent regression.",
      tools: ["Vibrating Roller", "Mini Bands", "Stability Ball", "Balance Disc", "KB"],
      circuit: [
        { time: "0-3", name: "Inhibition: Calves & TFL", tool: "Vibrating SMR", type: "Recovery" },
        { time: "3-6", name: "Activation: Monster Walks", tool: "Mini Loop Band", type: "Stability" },
        { time: "6-9", name: "Global Core: Ball Pikes", tool: "Stability Ball", type: "Core" },
        { time: "9-12", name: "Local Core: Instability Plank", tool: "Balance Disc", type: "Core" },
        { time: "12-15", name: "Integration: KB Swing (Hinge)", tool: "Adjustable KB", type: "Power" }
      ]
    },
    30: {
      title: "Structural Integrity",
      tagline: "Hypertrophy & Balance",
      color: "text-amber-400",
      borderColor: "border-amber-500/50",
      bgGradient: "from-amber-900/20 to-slate-950",
      intensity: 6,
      stability: 8,
      power: 5,
      description: "The bread and butter. Builds the hamstring/glute connection and forces the LPHC to stabilize under load.",
      tools: ["Power Tower", "Stamina X Box", "Rehab Bands", "Previous Tools"],
      circuit: [
        { time: "0-15", name: "Complete 'Neural Wake-Up'", tool: "See Above", type: "Warmup" },
        { time: "15-18", name: "Balance: Single-Leg RDL", tool: "Kettlebell", type: "Stability" },
        { time: "18-21", name: "Core: Hanging Knee Raises", tool: "Power Tower", type: "Core" },
        { time: "21-24", name: "Push: Unstable Push-Up", tool: "Stability Ball", type: "Strength" },
        { time: "24-27", name: "Pull: Inverted Row / Pull-up", tool: "Power Tower", type: "Strength" },
        { time: "27-30", name: "Legs: Step-Up to Balance", tool: "Stamina X Box", type: "Power" }
      ]
    },
    45: {
      title: "The Centenarian Accelerator",
      tagline: "Power & MetCon",
      color: "text-rose-500",
      borderColor: "border-rose-500/50",
      bgGradient: "from-rose-900/20 to-slate-950",
      intensity: 9,
      stability: 6,
      power: 10,
      description: "Maximum caloric burn and Type II fiber recruitment. Develops the explosive 'drive phase' for the 100m sprint.",
      tools: ["Jump Rope", "Power Bands", "Bike", "All Tools"],
      circuit: [
        { time: "0-30", name: "Complete 'Structural Integrity'", tool: "See Above", type: "Strength" },
        { time: "30-33", name: "Plyo: Box Jumps (Land Soft)", tool: "Stamina X Box", type: "Power" },
        { time: "33-36", name: "Speed: Jump Rope Intervals", tool: "Jump Rope", type: "Cardio" },
        { time: "36-40", name: "Rotational Power: Woodchops", tool: "Power Bands", type: "Core" },
        { time: "40-45", name: "Finisher: Max Effort Sprints", tool: "Bike", type: "MetCon" }
      ]
    }
  };

  const currentTier = tiers[activeTier];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 p-4 md:p-8 max-w-5xl mx-auto">
      
      {/* Article Header */}
      <header className="mb-16 pt-12 border-b border-slate-800 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 border border-amber-500 rounded-full text-amber-500 text-xs font-bold uppercase tracking-widest">
            Centenarian OS v2.1
          </div>
          <span className="text-slate-500 text-xs font-mono uppercase">System Log: </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[0.9]">
          THE LPHC <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">PROTOCOL</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed">
          Most people train "Abs." We train the <strong>Lumbo-Pelvic-Hip Complex</strong>. 
          If you want to be sprinting at 100 years old, you don't need a six-pack. 
          You need structural integrity.
        </p>
      </header>

      {/* Interactive Dashboard */}
      <section className="mb-24 relative">
        <div className="absolute -top-12 left-0 text-xs font-mono text-slate-500 flex items-center gap-2">
           <Activity size={14} /> INTERACTIVE MODULE: SELECT DURATION
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {([15, 30, 45] as TierDuration[]).map((time) => (
            <button
              key={time}
              onClick={() => setActiveTier(time)}
              className={`flex-1 p-6 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                activeTier === time 
                  ? `${tiers[time].borderColor} bg-slate-900 ring-1 ring-amber-500/50` 
                  : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'
              }`}
            >
              <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${activeTier === time ? 'bg-amber-500' : 'bg-transparent'}`}></div>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-4xl font-black ${activeTier === time ? 'text-white' : 'text-slate-600'}`}>
                  {time}<span className="text-lg font-medium ml-1 text-slate-500">MIN</span>
                </span>
                {activeTier === time && <CheckCircle2 className="text-amber-500" size={20} />}
              </div>
              <div className="text-left">
                <h3 className={`font-bold uppercase tracking-wider text-sm mb-1 ${activeTier === time ? 'text-amber-400' : 'text-slate-400'}`}>
                  {tiers[time].title}
                </h3>
                <p className="text-xs text-slate-500">{tiers[time].tagline}</p>
              </div>
            </button>
          ))}
        </div>

        <div className={`rounded-3xl border border-slate-800 bg-gradient-to-br ${currentTier.bgGradient} p-6 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-500`}>
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <RotateCw size={400} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className={`text-3xl font-black mb-2 ${currentTier.color}`}>{currentTier.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
                  {currentTier.description}
                </p>
              </div>

              <div className="space-y-4 bg-slate-950/50 p-6 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs uppercase font-bold text-slate-500">
                    <span>Stability</span>
                    <span>{currentTier.stability}/10</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${currentTier.stability * 10}%` }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs uppercase font-bold text-slate-500">
                    <span>Intensity</span>
                    <span>{currentTier.intensity}/10</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${currentTier.intensity * 10}%` }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs uppercase font-bold text-slate-500">
                    <span>Power Output</span>
                    <span>{currentTier.power}/10</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${currentTier.power * 10}%` }}></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                  <Box size={14} /> Required Assets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentTier.tools.map((tool, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 font-mono">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="text-amber-500" size={20} /> Operation Sequence
                </h3>
                <span className="text-xs font-mono text-slate-500">Total Est. Time: {activeTier}:00</span>
              </div>

              <div className="space-y-3">
                {currentTier.circuit.map((step, idx) => (
                  <div 
                    key={idx}
                    className="group relative flex items-center gap-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 p-4 rounded-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded bg-slate-950 flex items-center justify-center border border-slate-800 text-slate-500 font-mono text-xs shrink-0">
                      {step.time}<br/>min
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-200">{step.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                          step.type === 'Power' ? 'bg-rose-500/20 text-rose-400' :
                          step.type === 'Stability' ? 'bg-blue-500/20 text-blue-400' :
                          step.type === 'Core' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {step.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Dumbbell size={12} /> Tool: {step.tool}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Science / Why Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 bg-slate-900 border-l-4 border-amber-500 rounded-r-xl">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <Shield size={24} className="text-amber-500" /> Why The LPHC?
          </h3>
          <p className="text-slate-400 leading-relaxed">
            The Lumbo-Pelvic-Hip Complex is the "powerhouse." If your core and hips are unstable, your extremities cannot produce force efficiently. For a future 100-meter sprinter, the LPHC prevents energy leaks.
          </p>
        </div>
        <div className="p-8 bg-slate-900 border-l-4 border-emerald-500 rounded-r-xl">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <Timer size={24} className="text-emerald-500" /> The NASM OPT™ Model
          </h3>
          <p className="text-slate-400 leading-relaxed">
            We don't guess. We progress.
            <br/>
            <strong className="text-emerald-400">Stabilization:</strong> Balance Disc/Ball.<br/>
            <strong className="text-emerald-400">Power:</strong> Box Jumps & Stamina X.<br/>
            <strong className="text-emerald-400">Integration:</strong> Power Tower & Bands.
          </p>
        </div>
      </section>

      {/* Deep Dive Content */}
      <article className="max-w-3xl mx-auto space-y-16">
        
        {/* Section 1 */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-amber-500">
              <Bone size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white">The "Core" is a Myth</h2>
          </div>
          <div className="prose prose-invert prose-lg text-slate-400">
            <p>
              In the Centenarian Journey, we don't use vague terms. "Core" is marketing. 
              <strong>LPHC (Lumbo-Pelvic-Hip Complex)</strong> is anatomy.
            </p>
            <p>
              The LPHC is the powerhouse of the human body. It has 29 muscles attached to the lumbo-pelvic-hip complex. 
              If these muscles are weak or unstable, the extremities (arms and legs) cannot produce force efficiently. 
              Think of it like shooting a cannon from a canoe. The cannon (legs) might be powerful, but if the canoe (LPHC) 
              is unstable, the energy is lost to the water.
            </p>
            <div className="my-8 p-6 bg-slate-900/50 border-l-4 border-amber-500 rounded-r-xl">
              <h4 className="text-white font-bold mb-2">The Centenarian Constraint</h4>
              <p className="text-sm m-0">
                To sprint at age 100, you cannot have "energy leaks." Every ounce of force your foot generates into the 
                ground must be transferred through a rigid torso to propel you forward.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-emerald-500">
              <BrainCircuit size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white">The Strategy: Local vs. Global</h2>
          </div>
          <div className="prose prose-invert prose-lg text-slate-400">
            <p>
              This protocol uses the <strong>NASM OPT™ Model</strong> to distinguish between two critical systems:
            </p>
            <ul className="space-y-4 list-none pl-0">
              <li className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-emerald-500">1</span>
                <div>
                  <strong className="text-white block">Local Stabilization System</strong>
                  <span className="text-sm">The "Inner Unit" (Transverse Abdominis, Multifidus). These muscles attach directly to vertebrae. They don't move you; they stabilize the spine <em>before</em> you move. We train these with the <strong>Balance Disc</strong> and <strong>Stability Ball</strong>.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-rose-500">2</span>
                <div>
                  <strong className="text-white block">Global Movement System</strong>
                  <span className="text-sm">The "Outer Unit" (Rectus Abdominis, Obliques, Glutes). These move the trunk and transfer load. We train these with the <strong>Stamina X Box</strong> and <strong>Power Tower</strong>.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-rose-500">
              <Timer size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white">Why These Durations?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <h3 className="font-bold text-emerald-400 mb-2">15 Minutes (Hygiene)</h3>
              <p className="text-sm text-slate-400">
                You brush your teeth daily to prevent decay. You must do the "Neural Wake-Up" daily to prevent 
                <strong> Gluteal Amnesia</strong> caused by sitting. This is not a workout; it is hygiene.
              </p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-rose-500/50 transition-colors">
              <h3 className="font-bold text-rose-400 mb-2">45 Minutes (Performance)</h3>
              <p className="text-sm text-slate-400">
                This targets Type II (Fast Twitch) muscle fibers using plyometrics. These fibers are the first to atrophy with age. 
                Using the <strong>Stamina X Box</strong> for jumps is literally "Anti-Aging" for your nervous system.
              </p>
            </div>
          </div>
        </section>

      </article>

      {/* Footer / CTA */}
      <div className="text-center border-t border-slate-800 mt-24 pt-12">
        <p className="font-mono text-amber-500 text-sm mb-6">SYSTEM STATUS: READY FOR DEPLOYMENT</p>
        <button className="bg-slate-100 text-slate-950 px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2 mx-auto group">
          <Play size={18} fill="currentColor" /> Initialize Protocol
          <ArrowDown className="group-hover:translate-y-1 transition-transform" size={18} />
        </button>
      </div>

    </div>
  );
};

export default WorkoutProtocol;