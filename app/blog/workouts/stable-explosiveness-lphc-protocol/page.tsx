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
  ChevronDown,
  Info,
  CheckCircle2,
  Box,
  RotateCw,
  BrainCircuit,
  Bone,
  ArrowDown,
  AlertTriangle
} from 'lucide-react';

interface CircuitStep {
  time: string;
  name: string;
  tool: string;
  type: string;
  instructions?: string;
  notes?: string;
  why?: string;
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

const WorkoutProtocol = () => {
  const [activeTier, setActiveTier] = useState<TierDuration>(30);

  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const toggleStep = (idx: number) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

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
        {
          time: "0-3",
          name: "Inhibition: Calves & TFL",
          tool: "Vibrating SMR",
          type: "Recovery",
          instructions: "Turn on vibration. Roll slowly (1 inch per second) along the calf muscle belly and the TFL (pocket muscle).",
          notes: "When you find a 'hot spot' (trigger point), hold static pressure for 30-45 seconds until it releases. The vibration helps override pain receptors.",
          why: "Releases tension in the muscles that get tight from sitting and walking, restoring length-tension relationships."
        },
        { time: "3-6", name: "Activation: Monster Walks", tool: "Mini Loop Band", type: "Stability",
        instructions: "Place band around ankles. Stand with feet hip-width apart, knees slightly bent. Step laterally (sideways) keeping toes pointed straight ahead.",
        notes: "Do not let knees cave inward (valgus). Keep tension on the band the entire time. 15 steps left, 15 steps right.",
        why: "Fires the Gluteus Medius, essential for stabilizing the pelvis during single-leg stance (sprinting)." },
        { time: "6-9", name: "Global Core: Ball Pikes", tool: "Stability Ball", type: "Core",
          instructions: "Start in a push-up position with shins on the ball. Keeping legs straight, pike your hips up toward the ceiling, rolling the ball toward your hands.",
          notes: "Exhale as you pike up. Inhale as you return to flat plank. Do not let the lower back sag.",
          why: "Integrates shoulder stability with deep abdominal flexion." },
        { time: "9-12", name: "Local Core: Instability Plank", tool: "Balance Disc", type: "Core",
          instructions: "Place forearms on the inflated balance disc. Extend legs back into a plank position. Hold.",
          notes: "The disc will wobble. Fight to keep it still. Squeeze glutes and draw belly button to spine. 2 sets x 45 seconds.",
          why: "Forces the Transverse Abdominis to fire rapidly to stabilize the spine against unpredictable movement." },
        { time: "12-15", name: "Integration: KB Swing (Hinge)", tool: "Adjustable KB", type: "Power",
          instructions: "Hinge at the hips (butt back), keeping shins vertical. Snap hips forward explosively to float the bell to chest height.",
          notes: "This is a HIP SNAP, not a squat. Your arms are just hooks; the power comes from the glutes.",
          why: " teaches the posterior chain to fire explosively—the engine of your sprint." }
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
        { 
          time: "0-15", 
          name: "Warm-Up Sequence", 
          tool: "See 'Neural Wake-Up'", 
          type: "Warmup",
          instructions: "Complete the 15-minute activation routine above (SMR, Monster Walks, Ball Pikes).",
          notes: "Do not skip this. You cannot build structure on a shaky foundation.",
          why: "Prepares the nervous system for load."
        },
        { 
          time: "15-18", 
          name: "Balance: Single-Leg RDL", 
          tool: "Kettlebell", 
          type: "Stability",
          instructions: "Stand on one leg. Hold KB in the OPPOSITE hand. Hinge at hips, extending free leg straight back. Return to standing.",
          notes: "Keep hips square to the floor (don't rotate open). 4-2-1 Tempo (4s down, 2s hold, 1s up).",
          why: "Builds hamstring strength and rotary stability simultaneously."
        },
        { 
          time: "18-21", 
          name: "Core: Hanging Knee Raises", 
          tool: "Power Tower", 
          type: "Core",
          instructions: "Hang from bar or use elbow pads. Draw knees up toward chest. Curl the pelvis at the top.",
          notes: "Do not swing. Control the descent. To progress: Straight Leg Raises (Toes to Bar).",
          why: "Decompresses the spine while training the hip flexors and lower abs."
        },
        { 
          time: "21-24", 
          name: "Push: Unstable Push-Up", 
          tool: "Stability Ball", 
          type: "Strength",
          instructions: "Place hands on the sides of the stability ball. Perform push-ups while balancing.",
          notes: "Keep elbows tucked 45-degrees. If too hard, perform with knees on ground.",
          why: "Increases recruitment of the shoulder stabilizers and core compared to floor push-ups."
        },
        { 
          time: "24-27", 
          name: "Pull: Inverted Row or Pull-up", 
          tool: "Power Tower / Rehab Bands", 
          type: "Strength",
          instructions: "Pull-up: Palms away, chin over bar. Inverted Row: Hang under bar, heels on ground/box, pull chest to bar.",
          notes: "Use Rehab Bands for assistance if you cannot do 8 clean reps. Focus on depressing shoulder blades first.",
          why: "Counteracts the 'rounded shoulder' posture of modern life."
        },
        { 
          time: "27-30", 
          name: "Legs: Step-Up to Balance", 
          tool: "Stamina X Box", 
          type: "Power",
          instructions: "Step onto box. Drive through the heel to stand up, bringing the OPPOSITE knee high into the air. Balance on one leg for 2s.",
          notes: "Do not push off the back leg. Make the top leg do the work. Land softly.",
          why: "Mimics the drive phase of sprinting mechanics."
        }
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
      tools: ["Jump Rope", "Power Bands", "Bike", "Stamina X Box"],
      circuit: [
        { 
          time: "0-15", 
          name: "Warm-Up Sequence", 
          tool: "See 'Neural Wake-Up'", 
          type: "Warmup",
          instructions: "Complete the 15-minute activation routine.",
          notes: "Essential for plyometric safety.",
          why: "Priming."
        },
        { 
          time: "15-27", 
          name: "Structural Strength Block", 
          tool: "KB / Power Tower", 
          type: "Strength",
          instructions: "Perform Single-Leg RDLs, Hanging Knee Raises, Unstable Push-Ups, and Pull-Ups from the 30-min routine.",
          notes: "Perform 2 sets of each instead of 3 to save energy for Power block.",
          why: "Maintenance of structural integrity."
        },
        { 
          time: "Skipped", 
          name: "EXCLUDED: Step-Up to Balance", 
          tool: "None", 
          type: "Modification",
          instructions: "We skip the stabilization step-ups to preserve leg freshness for the high-impact Box Jumps below.",
          notes: "Volume management prevents overtraining.",
          why: "Strategic rest."
        },
        { 
          time: "27-32", 
          name: "Plyo: Box Jumps", 
          tool: "Stamina X Box (12-24\")", 
          type: "Power",
          instructions: "Stand in front of box. Squat slightly and explode up, landing softly on the box in a squat position. Stand tall.",
          notes: "STEP DOWN ONE FOOT AT A TIME. Do not jump down (saves Achilles). Focus on quiet landings.",
          why: "Targeting Type II (Fast Twitch) fibers. 'Anti-aging' for the nervous system."
        },
        { 
          time: "32-36", 
          name: "Speed: Jump Rope Intervals", 
          tool: "Jump Rope", 
          type: "Cardio",
          instructions: "60 seconds on, 30 seconds off. Focus on minimal ground contact time.",
          notes: "Stay on balls of feet. Flick wrists, don't swing arms.",
          why: "Increases lower leg stiffness (springiness) for efficient energy return."
        },
        { 
          time: "36-40", 
          name: "Power: Woodchops", 
          tool: "Power Resistance Bands", 
          type: "Core",
          instructions: "Anchor band high. Pull diagonally down across body, pivoting the back foot. Return slowly.",
          notes: "Explosive pull (1s), controlled return (3s). 15 reps per side.",
          why: "Sprinting is a rotational act; this prevents energy leaks through the torso."
        },
        { 
          time: "40-45", 
          name: "Finisher: Bike Sprints", 
          tool: "Bike", 
          type: "MetCon",
          instructions: "Tabata Style: 20 seconds Max Effort Sprint, 10 seconds complete rest. Repeat for 4 minutes.",
          notes: "If you aren't breathless, increase resistance.",
          why: "Flushes lactate and improves Heart Rate Variability (recovery capacity)."
        }
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
          <span className="text-slate-500 text-xs font-mono uppercase">System Log: 2-2026</span>
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
              onClick={() => { setActiveTier(time); setExpandedStep(null); }}
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
                    onClick={() => toggleStep(idx)}
                    className={`group relative bg-slate-900/80 border rounded-lg transition-all cursor-pointer overflow-hidden ${
                      expandedStep === idx ? 'border-amber-500/50 bg-slate-900' : 'border-slate-800 hover:bg-slate-800'
                    } ${step.time === 'Skipped' ? 'opacity-60 border-dashed' : ''}`}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className={`w-12 h-12 rounded flex items-center justify-center border text-xs shrink-0 font-mono ${
                        step.time === 'Skipped' ? 'bg-slate-950 border-slate-800 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}>
                        {step.time === 'Skipped' ? 'SKIP' : <>{step.time}<br/>min</>}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold ${step.time === 'Skipped' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{step.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                            step.type === 'Power' ? 'bg-rose-500/20 text-rose-400' :
                            step.type === 'Stability' ? 'bg-blue-500/20 text-blue-400' :
                            step.type === 'Core' ? 'bg-amber-500/20 text-amber-400' :
                            step.type === 'Modification' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-slate-700 text-slate-400'
                          }`}>
                            {step.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Dumbbell size={12} /> Tool: {step.tool}
                        </p>
                      </div>
                      {expandedStep === idx ? (
                        <ChevronDown className="text-amber-500" size={20} />
                      ) : (
                        <ChevronRight className="text-slate-700 group-hover:text-amber-500 transition-colors" size={20} />
                      )}
                    </div>
                    {/* Expanded Details */}
                    {expandedStep === idx && (
                      <div className="px-4 pb-4 pt-0 text-sm border-t border-slate-800/50 mt-2 bg-slate-950/30">
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Play size={10} /> Execution</h5>
                              <p className="text-slate-300 leading-relaxed">{step.instructions}</p>
                            </div>
                            {step.notes && (
                              <div>
                                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Info size={10} /> Coaching Cues</h5>
                                <p className="text-slate-400 leading-relaxed italic">"{step.notes}"</p>
                              </div>
                            )}
                          </div>
                          <div>
                             <div className="bg-slate-800/30 p-3 rounded border border-slate-800/50">
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">The 'Why'</h5>
                                <p className="text-slate-400 text-xs leading-relaxed">{step.why}</p>
                             </div>
                             {step.time === 'Skipped' && (
                               <div className="mt-2 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                                 <h5 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1 flex items-center gap-1"><AlertTriangle size={10}/> Protocol Override</h5>
                                 <p className="text-yellow-100/70 text-xs">Skipping this preserves explosive energy for the box jumps immediately following.</p>
                               </div>
                             )}
                          </div>
                        </div>
                      </div>
                    )}
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