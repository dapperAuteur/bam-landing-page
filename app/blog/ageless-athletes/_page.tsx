// "use client"
// import React, { useState } from 'react';

// // --- SVG Icon Components for a Clean UI ---
// const TrophyIcon = ({ className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M18.5 2h-13A2.5 2.5 0 003 4.5V9c0 4.42 3.58 8 8 8s8-3.58 8-8V4.5A2.5 2.5 0 0018.5 2zM11 15c-2.76 0-5-2.24-5-5h10c0 2.76-2.24 5-5 5zM11 18h2v3h-2zM10 21h4v2h-4z" />
//   </svg>
// );
// const UserIcon = ({ className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//   </svg>
// );
// const SparklesIcon = ({ className }) => (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M12 2l2.37 6.94h7.26l-5.88 4.28 2.24 6.88-5.99-4.34-5.99 4.34 2.24-6.88-5.88-4.28h7.26L12 2z" />
//     </svg>
// );

// // --- Athlete Data Structured from the Document ---
// const athletesData = {
//   '40s': [
//     { name: 'Cristiano Ronaldo', sport: 'Soccer', facts: 'Continues to compete at the highest levels, attributing his longevity to meticulous diet, training, and mental well-being.', imageUrl: 'https://placehold.co/400x400/c0392b/ffffff?text=CR7' },
//     { name: 'Thiago Silva', sport: 'Soccer', facts: 'A leading defender who returned to his boyhood club in Brazil after a distinguished career in Europe.', imageUrl: 'https://placehold.co/400x400/2980b9/ffffff?text=TS' },
//     { name: 'Lee Hyun-il', sport: 'Badminton', facts: 'Known for his exceptionally smooth and stable movements, allowing him to compete at a world-class level well into his late 30s.', imageUrl: 'https://placehold.co/400x400/27ae60/ffffff?text=LHI' },
//   ],
//   '50s': [
//     { name: 'Kazuyoshi Miura', sport: 'Soccer', facts: 'Known as "King Kazu", he is one of the oldest professional soccer players, with a career spanning nearly four decades.', imageUrl: 'https://placehold.co/400x400/f39c12/ffffff?text=King+Kazu' },
//     { name: 'Andy Macdonald', sport: 'Skateboarding', facts: 'A professional skateboarder who, at 50, aimed to compete in the Olympics, showcasing incredible longevity in action sports.', imageUrl: 'https://placehold.co/400x400/8e44ad/ffffff?text=Andy+M' },
//   ],
//   '60s': [
//     { name: 'Lana Zilberman', sport: 'Badminton', facts: 'Won a round at the US Open at age 65, competing in mixed doubles with her son, a testament to skill and family teamwork.', imageUrl: 'https://placehold.co/400x400/16a085/ffffff?text=LZ' },
//     { name: 'Dave Stanley', sport: 'Curling', facts: 'Inducted into the Governor General\'s Curling Club at 69, reflecting a long and successful amateur career with numerous championships.', imageUrl: 'https://placehold.co/400x400/34495e/ffffff?text=DS' },
//   ],
//   '70s': [
//     { name: 'Dy Gray', sport: 'Running', facts: 'Started her running journey in her 70s and was still competing at age 90, proving it\'s never too late to start.', imageUrl: 'https://placehold.co/400x400/7f8c8d/ffffff?text=Dy+G' },
//     { name: 'Edwina Ellis', sport: 'Inline Skating', facts: 'Began inline skating at 69 and was still enjoying it at 73, even touring internationally with her skates.', imageUrl: 'https://placehold.co/400x400/95a5a6/ffffff?text=EE' },
//   ],
//   '80s': [
//       { name: 'Dixon Hemphill', sport: 'Running', facts: 'At 91, he continued to run to maintain his high level of activity, demonstrating an ongoing commitment to fitness in very advanced age.', imageUrl: 'https://placehold.co/400x400/d35400/ffffff?text=DH' },
//   ],
//   '90s': [
//       { name: 'Orville Rogers', sport: 'Running', facts: 'Began running at 50 and continued to break world records in track and field until he was nearly 100 years old.', imageUrl: 'https://placehold.co/400x400/2c3e50/ffffff?text=OR' },
//   ],
//   '100+': [
//     { name: 'Lester Wright', sport: '100m Dash', facts: 'Set a new centenarian world record at 100 years old with a time of 26.34 seconds, continuing a passion for running that began in the 1930s.', imageUrl: 'https://placehold.co/400x400/3498db/ffffff?text=Lester+W' },
//     { name: 'Donald Pellmann', sport: 'Track & Field', facts: 'Set five world records in a single day at age 100. He only started competing seriously at age 70.', imageUrl: 'https://placehold.co/400x400/2ecc71/ffffff?text=Donald+P' },
//     { name: 'Julia Hawkins', sport: '100m Dash', facts: 'Nicknamed "Hurricane," she set world records for women over 100 and began her competitive running career at 101.', imageUrl: 'https://placehold.co/400x400/f1c40f/ffffff?text=Julia+H' },
//   ],
// };

// // --- Gemini API Function ---
// async function generateInsight(athlete) {
//   const prompt = `Based on the story of ${athlete.name}, an athlete known for their achievements in ${athlete.sport} and whose journey includes these facts: "${athlete.facts}", generate a short, powerful, one-sentence motivational insight about longevity, dedication, or the spirit of lifelong fitness.`;

//   let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
//   const payload = { contents: chatHistory };
//   const apiKey = ""; // The environment will provide the API key
//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//   try {
//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });
//     if (!response.ok) {
//       return "The journey of a thousand miles begins with a single step, at any age.";
//     }
//     const result = await response.json();
//     return result.candidates[0]?.content?.parts[0]?.text || "Embrace movement as a lifelong gift to yourself.";
//   } catch (error) {
//     console.error("Gemini API call failed:", error);
//     return "Passion is the fuel that keeps the engine of dedication running for a lifetime.";
//   }
// }

// // --- Athlete Card Component ---
// const AthleteCard = ({ athlete }) => {
//   const [insight, setInsight] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGenerateClick = async () => {
//     setIsLoading(true);
//     const generatedInsight = await generateInsight(athlete);
//     setInsight(generatedInsight);
//     setIsLoading(false);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-1.5 transition-transform duration-300 ease-in-out flex flex-col group">
//       <div className="relative">
//         <img className="w-full h-52 object-cover" src={athlete.imageUrl} alt={`Portrait of ${athlete.name}`} />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//         <div className="absolute bottom-0 left-0 p-4">
//             <h3 className="text-2xl font-bold text-white tracking-tight">{athlete.name}</h3>
//             <p className="text-indigo-200 font-semibold">{athlete.sport}</p>
//         </div>
//       </div>
//       <div className="p-5 flex flex-col flex-grow">
//         <p className="text-slate-600 text-base mb-auto leading-relaxed">{athlete.facts}</p>
//         <div className="mt-5 pt-4 border-t border-slate-100">
//           {insight ? (
//             <div className="p-3 bg-indigo-50 rounded-lg text-center animate-fade-in">
//               <p className="text-indigo-800 font-medium italic">"{insight}"</p>
//             </div>
//           ) : (
//             <button
//               onClick={handleGenerateClick}
//               disabled={isLoading}
//               className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-indigo-400"
//             >
//               <SparklesIcon className="w-5 h-5"/>
//               {isLoading ? 'Generating...' : 'Get AI Insight'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main App Component ---
// export default function App() {
//   const [activeTab, setActiveTab] = useState('40s');
//   const tabs = Object.keys(athletesData);

//   return (
//     <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">
//        <style>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out forwards;
//         }
//       `}</style>
//       <div className="container mx-auto px-4 py-10 md:py-14">
//         <header className="text-center mb-10 md:mb-12">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Athletes Across the Ages</h1>
//           <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
//             Explore inspiring stories of athletes who prove that dedication and passion have no age limit.
//           </p>
//         </header>

//         <nav className="flex justify-center mb-10">
//           <div className="flex space-x-2 md:space-x-1 p-1.5 bg-slate-200/60 rounded-xl">
//             {tabs.map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-2 text-sm md:text-base font-semibold rounded-lg transition-colors duration-300 ${
//                   activeTab === tab 
//                   ? 'bg-white text-indigo-600 shadow-sm' 
//                   : 'text-slate-600 hover:bg-white/50'
//                 }`}
//               >
//                 {tab === '100+' ? '100+' : `${tab}`}
//               </button>
//             ))}
//           </div>
//         </nav>

//         <main>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//             {athletesData[activeTab].map(athlete => (
//               <AthleteCard key={athlete.name} athlete={athlete} />
//             ))}
//           </div>
//         </main>
        
//         <footer className="text-center mt-14 text-slate-400 text-xs">
//           <p>Athlete data sourced from public records.</p>
//         </footer>
//       </div>
//     </div>
//   );
// }
