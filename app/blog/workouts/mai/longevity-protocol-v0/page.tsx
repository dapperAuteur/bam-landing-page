"use client"

import React, { useState } from 'react';
import { Sun, Moon, Zap, Clock, AlertCircle, ChevronDown, ChevronUp, CheckCircle2, Info, Activity, ShieldAlert } from 'lucide-react';

// --- DATA MODEL ---

const GLOSSARY = {
  "Half-Kneeling Hip Flexor Stretch": "Kneel on one knee with the front foot flat on the floor. Draw your belly button in (drawing-in maneuver) and squeeze the glute of your kneeling leg to tuck your pelvis under. Lean forward slightly until you feel a stretch in the front of your thigh. For an active stretch, hold for 2 seconds and repeat 10 times. For a static stretch, hold for 60 seconds.",
  "Glute Bridges": "Lie on your back with knees bent and feet flat on the floor. Draw your belly button in. Squeeze your glutes and push through your heels to lift your hips until your knees, hips, and shoulders form a straight line. Hold for 2 seconds at the top, then lower slowly.",
  "Cat-Cow Flow": "Start on your hands and knees. Draw your belly button in. Arch your back upward toward the ceiling (Cat), tucking your chin. Then, slowly let your belly drop toward the floor while lifting your chest and tailbone (Cow).",
  "Bird-Dogs": "Start on your hands and knees. Draw your belly button in and brace your core. Keep your spine perfectly neutral (do not let your lower back arch) as you simultaneously extend one arm forward and the opposite leg backward. Hold for 2 seconds, then return to the start.",
  "Standing Band Pull-Aparts": "Stand tall holding the band out in front of your chest. Draw your belly button in and keep your shoulders down. Initiate the movement by squeezing your shoulder blades together to pull the band apart until it touches your chest. Hold for 2 seconds, return slowly.",
  "Wall Pectoral Stretch": "Extend your arm with your palm facing forward, then bend the elbow to a 90-degree angle. Place your forearm/elbow against a doorframe or wall. Drop your shoulders away from your ears, draw your belly button in, and brace your core. Lightly lean your body forward. For an active stretch, hold 2 seconds and repeat 12-15 times. For a static stretch, hold for 60 seconds.",
  "Latissimus Dorsi Doorframe Stretch": "Stand facing a doorframe. Grab the frame with one hand at about shoulder height. Keeping your arm straight, push your hips back and away from the doorframe, letting your chest drop until you feel a deep stretch down the side of your back. Hold statically for 60 seconds.",
  "Twisting Reverse Lunge": "Stand tall. Step one foot backward and lower your hips until both knees are bent at a 90-degree angle. Ensure your front knee tracks directly over your second and third toes. Pause for 2 seconds at the bottom, simultaneously rotating your torso toward the front leg. Push through the front heel to return to the start. (Tempo: 4/2/1/1)",
  "Wall Push-Ups": "Stand facing a wall, hands placed slightly wider than shoulder-width. Perform the drawing-in maneuver (pull belly button to spine), squeeze your glutes, and tuck your chin so your body forms a perfectly straight line from head to heels. Take 4 seconds to lower your chest toward the wall. Hold for 2 seconds at the bottom without letting your hips sag or shoulders elevate, then press back up in 1 second. (Tempo: 4/2/1/1)",
  "Bent-Over Band Row": "Stand on the center of the resistance band. Hinge at your hips, pushing them backward. Maintain a neutral spine and a proud chest—do not let your upper back round. Draw your belly button in. Initiate the pull by squeezing your shoulder blades together before bending your elbows. Pull the handles to your sides, hold peak tension for 2 seconds, and take 4 seconds to slowly lower. (Tempo: 4/2/1/1)",
  "Band Squat to Press (Thruster)": "Stand on the resistance band with feet shoulder-width apart, holding the handles at shoulder height. Keeping your chest up, squat down as if sitting in a chair. Pause at the bottom, then stand up explosively, using the momentum to press the handles straight overhead. (Tempo: 4/2/1/1)",
  "Jump Rope": "Keep your elbows tucked in close to your ribs and use your wrists to turn the rope. Take small jumps, ensuring you land softly on the balls of your feet to absorb the impact and protect your Achilles tendons.",
  "Manual Calf/Foot Release": "Use your thumbs to apply firm pressure to the arches of your feet and tight spots in your calves, mimicking a foam roller.",
  "Plank": "Draw your belly button in, squeeze your glutes, and maintain a perfectly straight line from head to heels.",
  "Active Walking Lunge": "Step forward and lower your hips until both knees are bent at a 90-degree angle. Push off the front foot to bring your back foot forward into the next step.",
  "Box Breathing (In Bed)": "Lie flat. Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Focus on deep diaphragmatic expansion.",
  "Child’s Pose": "Kneel, sit back on your heels, and reach your arms forward on the floor. Take deep diaphragmatic breaths into your lower back.",
  "Legs-Up-The-Wall Pose": "Lie on your back, resting your legs vertically against the wall to promote venous return and reduce lower body swelling from flights.",
  "Mental Wind-Down": "Engage in guided journaling away from blue light (screens) to reduce cognitive arousal before sleep."
};

const ROUTINES = {
  AM: {
    icon: <Sun className="w-6 h-6" />,
    title: "AM Priming",
    goal: "Undo the physical shortening of sleep and prepare the kinetic chain for a day of sitting or travel.",
    tabs: [
      {
        id: '5',
        label: "5 Min",
        title: "The 5-Minute Quick Reset",
        context: "Low Time / Low Energy. Do this immediately upon waking before checking emails.",
        exercises: [
          { name: "Half-Kneeling Hip Flexor Stretch", reps: "10 reps per side (hold 2s per rep)" },
          { name: "Glute Bridges", reps: "15 controlled reps" }
        ]
      },
      {
        id: '15',
        label: "15 Min",
        title: "The 15-Minute Daily Maintenance",
        context: "Standard Morning. Complete the 5-Minute Reset, plus:",
        exercises: [
          { name: "Half-Kneeling Hip Flexor Stretch", reps: "10 reps per side" },
          { name: "Glute Bridges", reps: "15 controlled reps" },
          { name: "Cat-Cow Flow", reps: "10 slow transitions" },
          { name: "Bird-Dogs", reps: "10 reps per side" },
          { name: "Standing Band Pull-Aparts", reps: "2 sets of 15 reps" }
        ]
      },
      {
        id: '30',
        label: "30 Min",
        title: "The 30-Minute Deep System Prep",
        context: "Optimal Travel Day. Complete the 15-Minute Maintenance, plus:",
        exercises: [
          { name: "Manual Calf/Foot Release", reps: "5 minutes" },
          { name: "Plank", reps: "3 sets of 30-60 second holds" },
          { name: "Active Walking Lunge", reps: "2 sets of 10 reps per leg" }
        ]
      }
    ]
  },
  PM: {
    icon: <Moon className="w-6 h-6" />,
    title: "PM Recovery",
    goal: "Down-regulate the Autonomic Nervous System from Sympathetic (Fight/Flight) to Parasympathetic (Rest/Digest).",
    tabs: [
      {
        id: '5',
        label: "5 Min",
        title: "The 5-Minute Sleep Signal",
        context: "High Fatigue / Late Arrival. Do this immediately after getting into bed or winding down.",
        exercises: [
          { name: "Wall Pectoral Stretch", reps: "60 seconds per side (Static)" },
          { name: "Box Breathing (In Bed)", reps: "2 minutes" }
        ]
      },
      {
        id: '15',
        label: "15 Min",
        title: "The 15-Minute Stress Offload",
        context: "Standard Evening. Complete the 5-Minute Sleep Signal, plus:",
        exercises: [
          { name: "Child’s Pose", reps: "2 minutes" },
          { name: "Latissimus Dorsi Doorframe Stretch", reps: "60 seconds per side" },
          { name: "Cat-Cow Flow", reps: "10 slow transitions" }
        ]
      },
      {
        id: '30',
        label: "30 Min",
        title: "The 30-Minute Tissue Restoration",
        context: "High Stress Day. Complete the 15-Minute Stress Offload, plus:",
        exercises: [
          { name: "Legs-Up-The-Wall Pose", reps: "5 minutes" },
          { name: "Mental Wind-Down", reps: "10 minutes of journaling" }
        ]
      }
    ]
  },
  WORKOUT: {
    icon: <Zap className="w-6 h-6" />,
    title: "Metabolic Engine",
    goal: "Maximize caloric expenditure and build structural stability. ALL resistance movements follow a strict 4/2/1/1 Tempo.",
    tabs: [
      {
        id: '5',
        label: "5 Min",
        title: "The 5-Minute Emergency Burn",
        context: "Time is critical but you refuse to break your habit. AMRAP (As Many Rounds As Possible) in 5 minutes. No rest.",
        exercises: [
          { name: "Twisting Reverse Lunge", reps: "10 reps per leg" },
          { name: "Wall Push-Ups", reps: "10 reps" }
        ]
      },
      {
        id: '15',
        label: "15 Min",
        title: "The 15-Minute Hotel Circuit",
        context: "Standard high-density metabolic driver. 3 Rounds. 60s rest between rounds.",
        exercises: [
          { name: "Twisting Reverse Lunge", reps: "12-15 reps per leg" },
          { name: "Wall Push-Ups", reps: "12-15 reps" },
          { name: "Bent-Over Band Row", reps: "12-15 reps" },
          { name: "Jump Rope", reps: "60 seconds" }
        ]
      },
      {
        id: '45',
        label: "45 Min",
        title: "The 45-Minute Deep Work",
        context: "Full Phase 1 Integration. Use on days with full schedule control.",
        sections: [
          {
            name: "Phase 1: Warm-Up (10 Mins)",
            exercises: [
              { name: "Manual Calf/Foot Release", reps: "3 mins" },
              { name: "Wall Pectoral Stretch", reps: "Active - 10 reps/side" },
              { name: "Half-Kneeling Hip Flexor Stretch", reps: "Active - 10 reps/side" },
              { name: "Glute Bridges", reps: "15 reps" },
              { name: "Bird-Dogs", reps: "10 reps/side" }
            ]
          },
          {
            name: "Phase 2: Extended Circuit (25 Mins)",
            context: "4 Rounds. Rest 60s between rounds.",
            exercises: [
              { name: "Twisting Reverse Lunge", reps: "15 reps per leg" },
              { name: "Wall Push-Ups", reps: "15 reps" },
              { name: "Bent-Over Band Row", reps: "15 reps" },
              { name: "Band Squat to Press (Thruster)", reps: "15 reps" },
              { name: "Jump Rope", reps: "2 Minutes" }
            ]
          },
          {
            name: "Phase 3: Cool-Down (10 Mins)",
            exercises: [
              { name: "Child’s Pose", reps: "2 minutes" },
              { name: "Latissimus Dorsi Doorframe Stretch", reps: "60 seconds/side" },
              { name: "Cat-Cow Flow", reps: "10 slow transitions" }
            ]
          }
        ]
      }
    ]
  }
};

const FRICTION_PROTOCOL = [
  {
    condition: "Arrive at hotel late and exhausted (High Stress/Low Energy)",
    action: "Execute the 5-Minute PM Recovery (Sleep Signal) to shift into a restorative state without taxing muscles."
  },
  {
    condition: "Stuck in an airport with a long layover or short gap between calls",
    action: "Execute the 5-Minute Emergency Burn Workout to counteract postural damage and maintain streak."
  },
  {
    condition: "Wake up sluggish but have time before your first meeting",
    action: "Do not force the 45-min workout. Execute the 15-Minute AM Priming to gently wake the nervous system."
  },
  {
    condition: "Forced to eat airport/convenience food",
    action: "Pair any carbohydrate with a protein and healthy fat (e.g., apple + almonds) to blunt the insulin spike."
  }
];

// --- COMPONENTS ---

export default function NomadOS() {
  const [activeCategory, setActiveCategory] = useState('WORKOUT');
  const [activeDurations, setActiveDurations] = useState({ AM: '5', PM: '15', WORKOUT: '15' });
  const [expandedExercise, setExpandedExercise] = useState(null);

  const handleDurationChange = (duration) => {
    setActiveDurations(prev => ({ ...prev, [activeCategory]: duration }));
    setExpandedExercise(null); // Reset expansions on tab change
  };

  const toggleExercise = (name) => {
    setExpandedExercise(expandedExercise === name ? null : name);
  };

  const currentData = ROUTINES[activeCategory];
  const currentRoutine = currentData.tabs.find(t => t.id === activeDurations[activeCategory]);

  const renderExerciseList = (exercises) => (
    <div className="space-y-3">
      {exercises.map((ex, idx) => (
        <div 
          key={idx} 
          className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => toggleExercise(ex.name)}
        >
          <div className="p-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">{ex.name}</p>
                <p className="text-sm text-slate-500">{ex.reps}</p>
              </div>
            </div>
            {expandedExercise === ex.name ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
          
          {expandedExercise === ex.name && (
            <div className="p-4 bg-white border-t border-slate-100 text-slate-700 text-sm leading-relaxed">
              <div className="flex space-x-2">
                <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p>{GLOSSARY[ex.name] || "Execution details pending."}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-12">
      {/* HEADER */}
      <header className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white pt-12 pb-8 px-6 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold tracking-tight">Nomad Longevity OS</h1>
            <span className="bg-indigo-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">v1.0</span>
          </div>
          <p className="text-indigo-200 text-sm mb-6 uppercase tracking-widest font-semibold">Beta-Test Case Study 001</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-6 border-t border-indigo-800/50 pt-6">
            <div>
              <p className="text-slate-400 mb-1">Objective</p>
              <p className="font-medium">Weight Loss, Postural Correction, Sleep</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Equipment Required</p>
              <p className="font-medium">Bands, Jump Rope, Bodyweight</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 -mt-4 relative z-10">
        
        {/* MAIN NAVIGATION */}
        <div className="bg-white rounded-2xl shadow-md p-2 mb-6 flex flex-wrap md:flex-nowrap gap-2">
          {Object.entries(ROUTINES).map(([key, data]) => (
            <button
              key={key}
              onClick={() => { setActiveCategory(key); setExpandedExercise(null); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                activeCategory === key 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {data.icon}
              <span>{data.title}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE CATEGORY CONTENT */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          
          {/* Category Header */}
          <div className="bg-slate-50 p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">{currentData.title}</h2>
            <p className="text-slate-600 text-sm">{currentData.goal}</p>
            
            {/* Special rule for workouts */}
            {activeCategory === 'WORKOUT' && (
              <div className="mt-4 bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex items-start space-x-3">
                <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-900">
                  <span className="font-bold">Tempo Rule (4/2/1/1):</span> 4s lower, 2s hold at hardest point, 1s up, 1s rest. The 2-second hold builds stability.
                </p>
              </div>
            )}
          </div>

          {/* Duration Sub-tabs */}
          <div className="px-6 pt-6 flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {currentData.tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleDurationChange(tab.id)}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                  activeDurations[activeCategory] === tab.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab.label} Option
              </button>
            ))}
          </div>

          {/* Routine Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900">{currentRoutine.title}</h3>
              <p className="text-slate-500 mt-1 font-medium">{currentRoutine.context}</p>
            </div>

            {/* Flat list of exercises OR Sectioned list */}
            {currentRoutine.exercises ? (
              renderExerciseList(currentRoutine.exercises)
            ) : (
              <div className="space-y-8">
                {currentRoutine.sections.map((sec, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{sec.name}</h4>
                    {sec.context && <p className="text-sm text-slate-500 mb-3 -mt-1">{sec.context}</p>}
                    {renderExerciseList(sec.exercises)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FRICTION PROTOCOL (Always visible at bottom for quick reference) */}
        <div className="mt-12 mb-8">
          <div className="flex items-center space-x-2 mb-4 px-2">
            <ShieldAlert className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-800">The Friction Protocol</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6 px-2">
            Environmental friction will derail motivation. Do not rely on willpower; rely on this system. Execute these pre-planned "If/Then" responses.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FRICTION_PROTOCOL.map((protocol, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-orange-400">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">If this happens...</p>
                <p className="font-semibold text-slate-800 mb-4 leading-snug">{protocol.condition}</p>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Then do this:</p>
                  <p className="text-sm text-slate-600">{protocol.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}