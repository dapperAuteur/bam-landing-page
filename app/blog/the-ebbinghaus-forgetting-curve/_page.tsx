// 'use client';

// import React from 'react';
// import { BarChart3, BrainCircuit, Zap, Clock, Repeat, HelpCircle } from 'lucide-react';

// // --- Static Data extracted from the guide ---
// const curveData = {
//   title: "The Ebbinghaus Forgetting Curve",
//   subtitle: "Understanding the Science of Memory and Forgetting",
//   creator: "Hermann Ebbinghaus, 1885",
//   coreConcept: "The forgetting curve demonstrates the exponential decay of memory retention over time. Without reinforcement, we lose a significant amount of new information very quickly.",
//   keyStats: [
//     { stat: "70%", text: "of new knowledge can be lost within 24 hours without review." },
//     { stat: "90%", text: "can vanish within a single week if not reinforced." }
//   ],
//   solution: {
//     title: "Combating Memory Decay",
//     methods: [
//       {
//         name: "Spaced Repetition",
//         icon: Repeat,
//         description: "Revisiting information at increasing intervals flattens the forgetting curve. Each review strengthens the memory trace, making it more resistant to decay.",
//         color: "blue"
//       },
//       {
//         name: "Active Recall",
//         icon: BrainCircuit,
//         description: "The effortful act of retrieving information from memory (the 'testing effect') is far more effective for long-term retention than passively re-reading or re-watching material.",
//         color: "green"
//       }
//     ]
//   }
// };


// // --- Helper Components for Visual Elements ---

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
//     {children}
//   </div>
// );

// const ForgettingCurveSVG = () => (
//     <div className="w-full p-4 bg-gray-100 rounded-lg mt-6">
//         <svg viewBox="0 0 400 220" className="w-full h-auto" aria-labelledby="chart-title" role="img">
//             <title id="chart-title">A graph showing the Ebbinghaus Forgetting Curve, with and without spaced repetition.</title>
//             <defs>
//                 <linearGradient id="decayGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4"/>
//                     <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
//                 </linearGradient>
//                  <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5"/>
//                     <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
//                 </linearGradient>
//             </defs>
            
//             {/* Axes and Labels */}
//             <line x1="30" y1="180" x2="380" y2="180" stroke="#9ca3af" strokeWidth="1.5"/>
//             <line x1="30" y1="20" x2="30" y2="180" stroke="#9ca3af" strokeWidth="1.5"/>
//             <text x="205" y="205" textAnchor="middle" fontSize="12" fill="#6b7280" className="font-sans">Time Since Learning</text>
//             <text x="10" y="100" textAnchor="middle" transform="rotate(-90 10 100)" fontSize="12" fill="#6b7280" className="font-sans">Memory Retention</text>
//             <text x="25" y="25" textAnchor="end" fontSize="10" fill="#6b7280">100%</text>
//             <text x="25" y="185" textAnchor="end" fontSize="10" fill="#6b7280">0%</text>

//             {/* Initial Forgetting Curve (Decay) */}
//             <path d="M 30 20 Q 80 80, 200 150 T 380 175" stroke="#ef4444" strokeWidth="3" fill="url(#decayGradient)" strokeDasharray="5 5"/>
//             <text x="100" y="130" fontSize="12" fill="#dc2626" className="font-semibold">Typical Forgetting Curve</text>

//             {/* Spaced Repetition Curves (Retention) */}
//             <path d="M 30 20 Q 120 40, 380 60" stroke="#3b82f6" strokeWidth="3" fill="url(#retentionGradient)"/>
//             <path d="M 120 58 Q 220 70, 380 80" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.7"/>
//             <path d="M 220 78 Q 300 85, 380 95" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.5"/>
            
//             {/* Review markers */}
//             <g transform="translate(0, 5)">
//                 <circle cx="120" cy="58" r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
//                 <text x="120" y="50" textAnchor="middle" fontSize="10" fill="#2563eb" className="font-bold">Review 1</text>
//             </g>
//              <g transform="translate(0, 5)">
//                 <circle cx="220" cy="78" r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
//                 <text x="220" y="70" textAnchor="middle" fontSize="10" fill="#2563eb" className="font-bold">Review 2</text>
//             </g>
//              <g transform="translate(0, 5)">
//                 <circle cx="300" cy="93" r="5" fill="#3b82f6" stroke="white" strokeWidth="2"/>
//                 <text x="300" y="85" textAnchor="middle" fontSize="10" fill="#2563eb" className="font-bold">Review 3</text>
//             </g>
//         </svg>
//     </div>
// );

// // --- Main Infographic Component ---

// export default function EbbinghausCurveInfographic() {
//   const { title, subtitle, creator, coreConcept, keyStats, solution } = curveData;

//   const getIconColor = (color) => {
//       switch(color) {
//           case 'blue': return 'bg-blue-500';
//           case 'green': return 'bg-green-500';
//           default: return 'bg-gray-500';
//       }
//   }

//   return (
//     <div className="bg-gray-50 font-sans p-4 sm:p-8 md:p-12">
//       <div className="max-w-4xl mx-auto">
//         <header className="text-center mb-12">
//           <div className="flex justify-center items-center gap-3 mb-2">
//             <BarChart3 className="w-10 h-10 text-red-500" />
//             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
//               {title}
//             </h1>
//           </div>
//           <p className="text-lg text-gray-600">{subtitle}</p>
//           <p className="text-sm text-gray-500 mt-1">First described by {creator}</p>
//         </header>

//         <main>
//             <Card className="mb-12">
//                 <div className="text-center">
//                     <HelpCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
//                     <h2 className="text-2xl font-bold text-gray-800 mb-3">The Core Concept</h2>
//                     <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">{coreConcept}</p>
//                 </div>
//             </Card>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//                 {keyStats.map((item, index) => (
//                     <Card key={index} className="flex items-center gap-4 bg-red-50 border-l-4 border-red-400">
//                         <Zap className="w-10 h-10 text-red-500 flex-shrink-0" />
//                         <div>
//                             <span className="text-4xl font-bold text-red-600">{item.stat}</span>
//                             <p className="text-gray-700">{item.text}</p>
//                         </div>
//                     </Card>
//                 ))}
//             </div>

//             <ForgettingCurveSVG />
            
//             <div className="mt-12">
//                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{solution.title}</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {solution.methods.map((method) => (
//                         <Card key={method.name} className="text-center">
//                             <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${getIconColor(method.color)}`}>
//                                 <method.icon className="w-8 h-8 text-white" />
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-800 mb-2">{method.name}</h3>
//                             <p className="text-gray-600">{method.description}</p>
//                         </Card>
//                     ))}
//                 </div>
//             </div>
//         </main>
//       </div>
//     </div>
//   );
// }
