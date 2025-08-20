// "use client"

// import React, { useState } from 'react';

// // --- Helper Icon Components ---
// const SparklesIcon = ({ className }) => (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M12 2l2.37 6.94h7.26l-5.88 4.28 2.24 6.88-5.99-4.34-5.99 4.34 2.24-6.88-5.88-4.28h7.26L12 2z" />
//     </svg>
// );
// const InfoIcon = ({ className }) => (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
//     </svg>
// );


// // --- Athlete Data from the immersive artifact ---
// const athletes = [
//   { name: 'Lester Wright', age: 100, time: 26.34, gender: 'M', color: 'bg-blue-500' },
//   { name: 'Donald Pellmann', age: 100, time: 26.99, gender: 'M', color: 'bg-green-500' },
//   { name: 'Waldo McBurney', age: 100, time: 39.97, gender: 'M', color: 'bg-yellow-500' },
//   { name: 'Everett Hosack', age: 100, time: 43.00, gender: 'M', color: 'bg-purple-500' },
//   { name: 'Julia Hawkins', age: 101, time: 39.62, gender: 'F', color: 'bg-pink-500' },
//   { name: 'Ida Keeling', age: 100, time: 77.33, gender: 'F', color: 'bg-red-500' }, // 1:17.33 = 77.33s
// ];

// // --- Chart Configuration ---
// const chartConfig = {
//     yAxis: { min: 99, max: 106, label: "Age (Years)" },
//     xAxis: { min: 5, max: 80, label: "100m Time (Seconds)" },
// };

// // --- Gemini API Function ---
// async function fetchLongevityInsights() {
//     const prompt = `Provide 3-4 evidence-based insights on factors contributing to longevity and healthy aging, based on scientific research. For each point, cite a peer-reviewed source or a reputable health organization (e.g., a study in 'The Lancet', 'as noted by the World Health Organization'). Frame the response as general information.`;

//     let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
//     const payload = { contents: chatHistory };
//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//     const apiKey = GEMINI_API_KEY; // The environment will provide the API key
//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload),
//         });
//         if (!response.ok) {
//             throw new Error(`API call failed with status: ${response.status}`);
//         }
//         const result = await response.json();
//         return result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not retrieve insights at this time. Remember that regular physical activity, a balanced diet, and strong social connections are widely recognized as key pillars of healthy aging.";
//     } catch (error) {
//         console.error("Gemini API call failed:", error);
//         return "Error: Could not connect to the insight service. Please check your connection and try again.";
//     }
// }


// // --- Main App Component ---
// export default function App() {
//     const [hoveredAthlete, setHoveredAthlete] = useState(null);
//     const [longevityInsight, setLongevityInsight] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const getPosition = (age, time) => {
//         const top = 100 - ((age - chartConfig.yAxis.min) / (chartConfig.yAxis.max - chartConfig.yAxis.min)) * 100;
//         const left = ((time - chartConfig.xAxis.min) / (chartConfig.xAxis.max - chartConfig.xAxis.min)) * 100;
//         return { top: `${top}%`, left: `${left}%` };
//     };

//     const handleGenerateInsight = async () => {
//         setIsLoading(true);
//         setLongevityInsight('');
//         const insight = await fetchLongevityInsights();
//         setLongevityInsight(insight);
//         setIsLoading(false);
//     };

//     return (
//         <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased p-4 md:p-8">
//             <div className="max-w-5xl mx-auto">
//                 <header className="text-center mb-10">
//                     <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Ageless Velocity</h1>
//                     <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">
//                         A visual exploration of centenarian sprinters who challenge the limits of age.
//                     </p>
//                 </header>

//                 <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
//                     {/* Chart Area */}
//                     <div className="relative w-full h-80 md:h-96 mb-4">
//                         {/* Y-Axis Label */}
//                         <span className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-slate-500">{chartConfig.yAxis.label}</span>
//                         {/* X-Axis Label */}
//                         <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-slate-500">{chartConfig.xAxis.label}</span>
                        
//                         {/* Chart Grid and Plotting Area */}
//                         <div className="w-full h-full bg-slate-100 rounded-lg border border-slate-200 relative">
//                             {/* Y-Axis Markers */}
//                             {Array.from({ length: chartConfig.yAxis.max - chartConfig.yAxis.min + 1 }, (_, i) => i + chartConfig.yAxis.min).map(age => {
//                                 if (age === 99 || age === 100 || age === 102 || age === 104 || age === 106) {
//                                     const { top } = getPosition(age, 0);
//                                     return <div key={age} style={{ top }} className="absolute -left-5 text-xs text-slate-400">{age}</div>
//                                 }
//                                 return null;
//                             })}
//                              {/* X-Axis Markers */}
//                              {Array.from({ length: (chartConfig.xAxis.max - chartConfig.xAxis.min) / 5 + 1 }, (_, i) => i * 5 + chartConfig.xAxis.min).map(time => {
//                                 if (time % 10 === 5 || time % 10 === 0) {
//                                      const { left } = getPosition(0, time);
//                                      return <div key={time} style={{ left }} className="absolute -bottom-5 text-xs text-slate-400">{time}s</div>
//                                 }
//                                 return null;
//                             })}

//                             {/* Athlete Dots */}
//                             {athletes.map((athlete) => {
//                                 const { top, left } = getPosition(athlete.age, athlete.time);
//                                 return (
//                                     <div
//                                         key={athlete.name}
//                                         className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                                         style={{ top, left }}
//                                         onMouseEnter={() => setHoveredAthlete(athlete)}
//                                         onMouseLeave={() => setHoveredAthlete(null)}
//                                     >
//                                         <div className={`w-3 h-3 md:w-4 md:h-4 ${athlete.color} rounded-full transition-transform duration-200 ${hoveredAthlete?.name === athlete.name ? 'scale-150' : ''} cursor-pointer`}></div>
//                                     </div>
//                                 );
//                             })}

//                              {/* Tooltip */}
//                             {hoveredAthlete && (
//                                 <div
//                                     className="absolute bg-slate-800 text-white p-2 rounded-lg text-xs shadow-xl transition-opacity duration-200 pointer-events-none"
//                                     style={{ ...getPosition(hoveredAthlete.age, hoveredAthlete.time), transform: 'translate(-50%, -150%)' }}
//                                 >
//                                     <p className="font-bold">{hoveredAthlete.name}</p>
//                                     <p>Age: {hoveredAthlete.age}</p>
//                                     <p>Time: {hoveredAthlete.time}s</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Legend/Key */}
//                     <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-8">
//                         {athletes.map(athlete => (
//                              <div key={athlete.name} className="flex items-center gap-2 text-sm">
//                                 <div className={`w-3 h-3 ${athlete.color} rounded-full`}></div>
//                                 <span>{athlete.name}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Gemini Insights Section */}
//                 <div className="mt-12">
//                     <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">AI Insights on Longevity</h2>
//                     <div className="flex justify-center mb-6">
//                         <button
//                             onClick={handleGenerateInsight}
//                             disabled={isLoading}
//                             className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60"
//                         >
//                             <SparklesIcon className="w-5 h-5" />
//                             {isLoading ? 'Generating Insights...' : 'Get Longevity Insights'}
//                         </button>
//                     </div>

//                     {longevityInsight && (
//                         <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
//                             <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: longevityInsight.replace(/\n/g, '<br />') }}></div>
//                             <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 text-sm rounded-r-lg">
//                                 <p className="font-semibold flex items-center gap-2"><InfoIcon className="w-5 h-5"/>Disclaimer</p>
//                                 <p className="mt-1">This information is for educational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
                
//                  <footer className="text-center mt-12 text-red-500 text-xs">
//                     <p>**Disclaimer:** This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.<br/><br/> Athlete data from public records.</p>
//                 </footer>
//             </div>
//             <style>{`
//                 @keyframes fade-in {
//                     from { opacity: 0; transform: translateY(10px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 .animate-fade-in {
//                     animation: fade-in 0.6s ease-out forwards;
//                 }
//             `}</style>
//         </div>
//     );
// }
