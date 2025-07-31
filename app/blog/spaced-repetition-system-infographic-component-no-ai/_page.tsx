// 'use client';

// import React from 'react';
// import { BrainCircuit, Milestone, BarChart3, GitBranch, Bot, Network, Lightbulb, CheckCircle, XCircle, ChevronRight, Loader } from 'lucide-react';

// // --- Static Data extracted from the guide ---
// const infographicData = {
//   title: "ML-Powered Spaced Retrieval System",
//   subtitle: "A Comprehensive Guide to Designing and Implementing an Intelligent Learning System",
//   timeline: [
//     { year: "1885", event: "Hermann Ebbinghaus quantifies the 'forgetting curve,' establishing the scientific basis for spaced repetition." },
//     { year: "1972", event: "Sebastian Leitner devises the Leitner system, the first practical, heuristic-based implementation of spaced repetition." },
//     { year: "2015", event: "Stanford researchers introduce Deep Knowledge Tracing (DKT), applying LSTMs to model student knowledge." },
//     { year: "2016", event: "Duolingo publishes the Half-Life Regression (HLR) model, a landmark in feature-based, industrial-scale spaced repetition." },
//     { year: "Present", event: "The Free Spaced Repetition Scheduler (FSRS) emerges as a state-of-the-art, open-source algorithm based on the DSR model." }
//   ],
//   forgettingCurve: {
//     description: "Initially described by Hermann Ebbinghaus, the forgetting curve shows an exponential decay in memory retention over time. Without reinforcement, a significant portion of new information is lost shortly after learning.",
//     repetitionEffect: "Strategic, spaced reviews flatten the curve, strengthening the memory trace and leading to long-term retention. Active recall is more effective than passive review."
//   },
//   algorithms: [
//     {
//       name: "Half-Life Regression (HLR)",
//       type: "Feature-based Regression",
//       strengths: ["Uses rich linguistic/item features", "Interpretable weights"],
//       weaknesses: ["Requires extensive feature engineering", "Outperformed by newer models"],
//       useCase: "Language learning where item features are well-defined."
//     },
//     {
//       name: "Free Spaced Repetition Scheduler (FSRS)",
//       type: "DSR (Difficulty, Stability, Retrievability) Model",
//       strengths: ["State-of-the-art accuracy", "Highly personalized via optimization", "Open-source and actively developed"],
//       weaknesses: ["Formulas can be complex", "Less interpretable than BKT"],
//       useCase: "General-purpose, high-performance flashcard scheduling."
//     },
//     {
//       name: "Bayesian Knowledge Tracing (BKT)",
//       type: "Probabilistic Graphical Model (HMM)",
//       strengths: ["Highly interpretable parameters (Guess, Slip)", "Works well with smaller datasets"],
//       weaknesses: ["Models skills in isolation", "Often lower predictive accuracy"],
//       useCase: "Intelligent tutoring systems with a fixed set of skills."
//     },
//     {
//       name: "Deep Knowledge Tracing (DKT)",
//       type: "Recurrent Neural Network (LSTM)",
//       strengths: ["Captures inter-skill dependencies", "Learns latent knowledge structure"],
//       weaknesses: ["'Black box' model, low interpretability", "Computationally expensive", "Requires very large datasets"],
//       useCase: "Complex domains (e.g., math) with many interrelated concepts."
//     }
//   ],
//   implementationPhases: [
//     { phase: 1, title: "MVP - The Robust Baseline", action: "Implement the open-source FSRS algorithm.", rationale: "Fastest path to a state-of-the-art scheduler without initial ML complexity." },
//     { phase: 2, title: "Personalization - The Custom TensorFlow Model", action: "Build and train an LSTM-based scheduler using TensorFlow.", rationale: "Fully personalized to each user's unique memory patterns." },
//     { phase: 3, title: "The Connected Mind - Knowledge Graph Integration", action: "Construct a knowledge graph using NLP and graph databases.", rationale: "Elevates the app from a memorization tool to a conceptual learning assistant." },
//     { phase: 4, title: "The Frontier - Advanced Model Exploration", action: "Experiment with advanced models like DKT or GNN-enhanced DKT.", rationale: "Places the application at the cutting edge of educational technology." }
//   ],
//   knowledgeGraph: {
//     description: "Represents knowledge as a network of nodes (concepts, cards) and edges (relationships), moving beyond treating flashcards as isolated items.",
//     application: "Enables intelligent interleaving, prerequisite recommendations, gap analysis, and knowledge visualization."
//   }
// };


// // --- Helper Components for Visual Elements ---

// const IconWrapper = ({ icon: Icon, className }) => (
//   <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${className}`}>
//     <Icon className="w-6 h-6 text-white" />
//   </div>
// );

// const Section = ({ title, icon: Icon, iconBgColor, children }) => (
//   <section className="mb-12">
//     <div className="flex items-center mb-6">
//       <IconWrapper icon={Icon} className={iconBgColor} />
//       <h2 className="ml-4 text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
//     </div>
//     <div className="pl-4 md:pl-16">{children}</div>
//   </section>
// );

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
//     {children}
//   </div>
// );

// const ForgettingCurveSVG = () => (
//     <div className="w-full p-4 bg-gray-50 rounded-lg">
//         <svg viewBox="0 0 400 200" className="w-full h-auto">
//             <defs>
//                 <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#f87171" stopOpacity="0.3"/>
//                     <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
//                 </linearGradient>
//                  <linearGradient id="curveGradient2" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4"/>
//                     <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
//                 </linearGradient>
//             </defs>
//             {/* Axes */}
//             <line x1="30" y1="180" x2="380" y2="180" stroke="#9ca3af" strokeWidth="1"/>
//             <line x1="30" y1="20" x2="30" y2="180" stroke="#9ca3af" strokeWidth="1"/>
//             <text x="200" y="195" textAnchor="middle" fontSize="10" fill="#6b7280">Time</text>
//             <text x="15" y="100" textAnchor="middle" transform="rotate(-90 15 100)" fontSize="10" fill="#6b7280">Retention</text>
//             <text x="35" y="25" fontSize="10" fill="#6b7280">100%</text>

//             {/* Forgetting Curve */}
//             <path d="M 30 20 Q 80 80, 200 150 T 380 175" stroke="#f87171" strokeWidth="2.5" fill="url(#curveGradient)" strokeDasharray="4 4"/>
//             <text x="100" y="120" fontSize="12" fill="#ef4444" className="font-semibold">Without Repetition</text>

//             {/* Spaced Repetition Curve */}
//             <path d="M 30 20 Q 150 40, 380 60" stroke="#60a5fa" strokeWidth="2.5" fill="url(#curveGradient2)"/>
//             <text x="180" y="40" fontSize="12" fill="#3b82f6" className="font-semibold">With Spaced Repetition</text>

//             {/* Review markers */}
//             <g>
//                 <circle cx="120" cy="58" r="4" fill="#3b82f6"/>
//                 <text x="100" y="75" fontSize="9" fill="#3b82f6">Review 1</text>
//             </g>
//              <g>
//                 <circle cx="250" cy="58" r="4" fill="#3b82f6"/>
//                 <text x="230" y="75" fontSize="9" fill="#3b82f6">Review 2</text>
//             </g>
//         </svg>
//     </div>
// );

// const KnowledgeGraphSVG = () => (
//     <div className="w-full p-4 bg-gray-50 rounded-lg flex justify-center items-center">
//         <svg viewBox="0 0 200 120" className="w-full max-w-md h-auto">
//             {/* Nodes */}
//             <g>
//                 <circle cx="40" cy="60" r="15" fill="#818cf8"/>
//                 <text x="40" y="63" textAnchor="middle" fontSize="7" fill="white" className="font-bold">Cell Biology</text>
//             </g>
//             <g>
//                 <circle cx="100" cy="30" r="15" fill="#60a5fa"/>
//                 <text x="100" y="33" textAnchor="middle" fontSize="5" fill="white" className="font-bold">Photosynthesis</text>
//             </g>
//             <g>
//                 <circle cx="100" cy="90" r="15" fill="#60a5fa"/>
//                 <text x="100" y="93" textAnchor="middle" fontSize="7" fill="white" className="font-bold">Mitochondrion</text>
//             </g>
//             <g>
//                 <circle cx="160" cy="30" r="15" fill="#3b82f6"/>
//                 <text x="160" y="33" textAnchor="middle" fontSize="7" fill="white" className="font-bold">Chlorophyll</text>
//             </g>
//             {/* Edges */}
//             <line x1="53" y1="52" x2="87" y2="38" stroke="#a5b4fc" strokeWidth="1.5"/>
//             <line x1="53" y1="68" x2="87" y2="82" stroke="#a5b4fc" strokeWidth="1.5"/>
//             <line x1="115" y1="30" x2="145" y2="30" stroke="#7dd3fc" strokeWidth="1.5"/>
//         </svg>
//     </div>
// );


// // --- Main Infographic Component ---

// export default function SpacedRepetitionInfographic() {
//   const { title, subtitle, timeline, forgettingCurve, algorithms, implementationPhases, knowledgeGraph } = infographicData;

//   return (
//     <div className="bg-gray-50 font-sans p-4 sm:p-8 md:p-12">
//       <div className="max-w-5xl mx-auto">
//         <header className="text-center mb-16">
//           <div className="flex justify-center items-center gap-4 mb-4">
//             <BrainCircuit className="w-12 h-12 text-blue-500" />
//             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
//               {title}
//             </h1>
//           </div>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
//         </header>

//         <main>
//           {/* --- Timeline Section --- */}
//           <Section title="From Theory to Algorithm: A Brief History" icon={Milestone} iconBgColor="bg-purple-500">
//             <div className="relative border-l-2 border-purple-200 pl-8 space-y-12">
//               {timeline.map((item, index) => (
//                 <div key={index} className="relative">
//                   <div className="absolute -left-[42px] top-1 w-5 h-5 bg-purple-500 rounded-full border-4 border-white"></div>
//                   <p className="text-purple-600 font-bold text-xl">{item.year}</p>
//                   <p className="mt-1 text-gray-700">{item.event}</p>
//                 </div>
//               ))}
//             </div>
//           </Section>

//           {/* --- Forgetting Curve Section --- */}
//           <Section title="The Ebbinghaus Forgetting Curve" icon={BarChart3} iconBgColor="bg-red-500">
//             <Card>
//               <p className="text-gray-600 mb-4">{forgettingCurve.description}</p>
//               <p className="text-blue-600 font-semibold mb-4">{forgettingCurve.repetitionEffect}</p>
//               <ForgettingCurveSVG />
//             </Card>
//           </Section>
          
//           {/* --- Algorithm Comparison Section --- */}
//           <Section title="A Taxonomy of Modern Algorithms" icon={BrainCircuit} iconBgColor="bg-green-500">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {algorithms.map((algo) => (
//                 <Card key={algo.name} className="flex flex-col">
//                   <h3 className="text-xl font-bold text-green-700">{algo.name}</h3>
//                   <p className="text-sm text-gray-500 mb-4">{algo.type}</p>
//                   <div className="text-sm space-y-3 flex-grow">
//                     <div>
//                       <h4 className="font-semibold text-gray-600 mb-1">Strengths:</h4>
//                       <ul className="list-disc list-inside text-gray-600">
//                         {algo.strengths.map((s, i) => <li key={i}>{s}</li>)}
//                       </ul>
//                     </div>
//                      <div>
//                       <h4 className="font-semibold text-gray-600 mb-1">Weaknesses:</h4>
//                       <ul className="list-disc list-inside text-gray-600">
//                         {algo.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
//                       </ul>
//                     </div>
//                   </div>
//                    <div className="mt-4 pt-4 border-t border-gray-200">
//                       <p className="text-xs text-gray-500 font-medium uppercase">Best For</p>
//                       <p className="text-sm text-gray-800 font-semibold">{algo.useCase}</p>
//                     </div>
//                 </Card>
//               ))}
//             </div>
//           </Section>

//           {/* --- Implementation Plan Section --- */}
//           <Section title="Phased Implementation Roadmap" icon={GitBranch} iconBgColor="bg-blue-500">
//             <div className="space-y-6">
//               {implementationPhases.map((phase) => (
//                 <Card key={phase.phase} className="!p-0 overflow-hidden">
//                   <div className="flex flex-col md:flex-row items-stretch">
//                     <div className="bg-blue-500 text-white p-6 flex flex-col items-center justify-center min-w-[120px]">
//                       <p className="text-xs font-bold">PHASE</p>
//                       <p className="text-4xl font-extrabold">{phase.phase}</p>
//                     </div>
//                     <div className="p-6">
//                       <h3 className="text-xl font-bold text-blue-800">{phase.title}</h3>
//                       <p className="mt-1 text-gray-700"><span className="font-semibold">Action:</span> {phase.action}</p>
//                       <p className="mt-1 text-sm text-gray-600"><span className="font-semibold">Rationale:</span> {phase.rationale}</p>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </Section>
          
//           {/* --- Knowledge Graph Section --- */}
//           <Section title="Advanced Architecture: The Knowledge Graph" icon={Network} iconBgColor="bg-indigo-500">
//              <Card>
//                 <p className="text-gray-600 mb-4">{knowledgeGraph.description}</p>
//                 <p className="text-indigo-600 font-semibold mb-4">{knowledgeGraph.application}</p>
//                 <KnowledgeGraphSVG />
//              </Card>
//           </Section>
//         </main>
//       </div>
//     </div>
//   );
// }
