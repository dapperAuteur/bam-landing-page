// 'use client';

// import React from 'react';
// import { Cpu, BarChartBig, ShieldCheck, Settings, ThumbsUp, ThumbsDown, GitBranch, Puzzle } from 'lucide-react';

// // --- Static Data extracted from the guide ---
// const fsrsData = {
//   title: "Free Spaced Repetition Scheduler (FSRS)",
//   subtitle: "The State-of-the-Art Open-Source Algorithm for Personalized Learning",
//   description: "FSRS is a sophisticated algorithm based on the DSR (Difficulty, Stability, Retrievability) model of memory. It provides a powerful, data-driven method for creating highly personalized flashcard review schedules.",
//   coreConcepts: [
//     {
//       name: "Difficulty (D)",
//       icon: Puzzle,
//       color: "red",
//       description: "Represents the inherent complexity of a flashcard (a value from 1-10). Higher difficulty means a smaller increase in memory stability after a successful review."
//     },
//     {
//       name: "Stability (S)",
//       icon: ShieldCheck,
//       color: "blue",
//       description: "Measures how long-term and resilient a memory is. It's the time (in days) for recall probability to drop to 90%. Higher stability means slower forgetting."
//     },
//     {
//       name: "Retrievability (R)",
//       icon: BarChartBig,
//       color: "green",
//       description: "The probability (0 to 1) of successfully recalling an item at a specific moment. This is the value the system predicts to decide when to schedule the next review."
//     }
//   ],
//   retrievabilityFormula: {
//     formula: "R(t) = (1 + t / (9 ⋅ S))⁻¹",
//     variables: [
//       { name: "R(t)", description: "Retrievability at time t" },
//       { name: "t", description: "Time in days since last review" },
//       { name: "S", description: "Current Stability of the memory" }
//     ]
//   },
//   howItWorks: {
//     title: "The Learning Cycle",
//     steps: [
//       "User reviews a card and provides a rating (e.g., Again, Hard, Good, Easy).",
//       "FSRS uses the rating and the card's current state (D, S) to calculate the new Stability (S') and Difficulty (D').",
//       "The algorithm uses the new Stability to predict the future decay of Retrievability.",
//       "A new review is scheduled for the optimal time, typically when Retrievability is predicted to drop to 90%."
//     ]
//   },
//   personalization: {
//     title: "Personalization via Optimization",
//     icon: Settings,
//     description: "FSRS contains a set of parameters (weights, w) in its formulas. An optimizer uses a user's entire review history to find the ideal weights that minimize prediction error (Log Loss), creating a unique memory model for each user."
//   },
//   prosAndCons: {
//     pros: [
//       "State-of-the-art predictive accuracy",
//       "Highly personalized to each user's memory",
//       "Open-source and actively developed",
//       "Uses granular, graded feedback"
//     ],
//     cons: [
//       "Formulas can be mathematically complex",
//       "Less directly interpretable than simpler models like BKT"
//     ]
//   }
// };

// // --- Helper Components for Visual Elements ---

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
//     {children}
//   </div>
// );

// const getIconColor = (color) => {
//     switch(color) {
//         case 'red': return 'text-red-500';
//         case 'blue': return 'text-blue-500';
//         case 'green': return 'text-green-500';
//         default: return 'text-gray-500';
//     }
// };
// const getBgColor = (color) => {
//     switch(color) {
//         case 'red': return 'bg-red-100';
//         case 'blue': return 'bg-blue-100';
//         case 'green': return 'bg-green-100';
//         default: return 'bg-gray-100';
//     }
// };


// // --- Main Infographic Component ---

// export default function FsrsInfographic() {
//   const { title, subtitle, description, coreConcepts, retrievabilityFormula, howItWorks, personalization, prosAndCons } = fsrsData;

//   return (
//     <div className="bg-gray-50 font-sans p-4 sm:p-8 md:p-12">
//       <div className="max-w-4xl mx-auto">
//         <header className="text-center mb-12">
//           <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
//             <Cpu className="w-12 h-12 text-blue-600" />
//           </div>
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
//             {title}
//           </h1>
//           <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
//         </header>

//         <main>
//             <Card className="mb-12 bg-blue-50 border-l-4 border-blue-400">
//                 <p className="text-gray-800 text-lg leading-relaxed">{description}</p>
//             </Card>

//             <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">The DSR Core Concepts</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//                 {coreConcepts.map((concept) => (
//                     <Card key={concept.name} className="text-center">
//                         <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${getBgColor(concept.color)}`}>
//                             <concept.icon className={`w-8 h-8 ${getIconColor(concept.color)}`} />
//                         </div>
//                         <h3 className={`text-xl font-bold mb-2 ${getIconColor(concept.color)}`}>{concept.name}</h3>
//                         <p className="text-gray-600">{concept.description}</p>
//                     </Card>
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-stretch">
//                 <Card>
//                     <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">The Retrievability Formula</h3>
//                     <div className="bg-gray-800 text-white p-6 rounded-lg text-center mb-4">
//                         <code className="text-2xl font-mono tracking-wider">{retrievabilityFormula.formula}</code>
//                     </div>
//                     <ul className="space-y-2">
//                         {retrievabilityFormula.variables.map(v => (
//                             <li key={v.name} className="flex items-start">
//                                 <code className="font-bold text-blue-600 w-12">{v.name} =</code>
//                                 <span className="text-gray-700 flex-1">{v.description}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 </Card>
//                  <Card>
//                     <div className="flex items-center justify-center gap-3 mb-4">
//                          <Settings className="w-8 h-8 text-blue-500" />
//                          <h3 className="text-2xl font-bold text-gray-800">{personalization.title}</h3>
//                     </div>
//                     <p className="text-gray-600 text-center">{personalization.description}</p>
//                 </Card>
//             </div>
            
//             <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{howItWorks.title}</h2>
//             <div className="relative mb-16">
//                 <div className="hidden md:block absolute top-5 left-0 w-full border-t-2 border-dashed border-gray-300"></div>
//                 <div className="relative flex flex-col md:flex-row justify-between gap-8">
//                     {howItWorks.steps.map((step, index) => (
//                         <div key={index} className="flex-1 text-center flex flex-col items-center">
//                             <div className="bg-gray-300 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mb-3 z-10">{index + 1}</div>
//                             <p className="text-gray-600 bg-gray-50 px-2">{step}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <Card className="bg-green-50">
//                     <div className="flex items-center gap-3 mb-4">
//                         <ThumbsUp className="w-8 h-8 text-green-600" />
//                         <h3 className="text-2xl font-bold text-green-800">Strengths</h3>
//                     </div>
//                     <ul className="space-y-2 list-disc list-inside text-green-900">
//                         {prosAndCons.pros.map(pro => <li key={pro}>{pro}</li>)}
//                     </ul>
//                 </Card>
//                 <Card className="bg-red-50">
//                      <div className="flex items-center gap-3 mb-4">
//                         <ThumbsDown className="w-8 h-8 text-red-600" />
//                         <h3 className="text-2xl font-bold text-red-800">Weaknesses</h3>
//                     </div>
//                     <ul className="space-y-2 list-disc list-inside text-red-900">
//                         {prosAndCons.cons.map(con => <li key={con}>{con}</li>)}
//                     </ul>
//                 </Card>
//             </div>
//         </main>
//       </div>
//     </div>
//   );
// }
