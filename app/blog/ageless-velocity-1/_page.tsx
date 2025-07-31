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
// const ChevronDownIcon = ({ className }) => (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//     </svg>
// );


// // --- Athlete Data from the immersive artifact ---
// const athletes = [
//     { name: 'Lester Wright', age: 100, time: 26.34, nationality: 'United States', date: '2022-04-30', location: 'Philadelphia, PA', color: 'bg-blue-500' },
//     { name: 'Donald Pellmann', age: 100, time: 26.99, nationality: 'United States', date: '2015-09-20', location: 'San Diego, CA', color: 'bg-green-600' },
//     { name: 'Diane Friedman', age: 100, time: 36.71, nationality: 'United States', date: '2021-08-15', location: 'Rochester, MI', color: 'bg-teal-500' },
//     { name: 'Waldo McBurney', age: 100, time: 39.97, nationality: 'United States', date: '2003', location: 'Puerto Rico', color: 'bg-orange-500' },
//     { name: 'Ida Keeling', age: 100, time: 77.33, nationality: 'United States', date: '2016-04-30', location: 'Philadelphia, PA', color: 'bg-red-500' },
//     { name: 'Julia Hawkins', age: 101, time: 39.62, nationality: 'United States', date: '2017-06-10', location: 'Birmingham, AL', color: 'bg-pink-500' },
//     { name: 'Stanisław Kowalski', age: 105, time: 34.50, nationality: 'Poland', date: '2015-06-27', location: 'Torun, Poland', color: 'bg-gray-700' },
//     { name: 'Hidekichi Miyazaki', age: 105, time: 42.22, nationality: 'Japan', date: '2015-09-23', location: 'Kyoto, Japan', color: 'bg-purple-600' },
//     { name: 'Man Kaur', age: 103, time: 181.61, nationality: 'India & Canada', date: '2019-12-04', location: 'Malaysia', color: 'bg-yellow-500' },
// ];

// // --- Chart Configuration ---
// const chartConfig = {
//     yAxis: { min: 99, max: 106, label: "Age (Years)" },
//     xAxis: { min: 5, max: 185, label: "100m Time (Seconds)" },
// };

// // --- Gemini API Function ---
// async function fetchHealthInfo(prompt) {
//     const fullPrompt = `As an expert researcher, answer the following user query based *only* on information from vetted, peer-reviewed scientific sources and reputable health organizations (like the WHO, NIH, CDC, major universities, or journals like Nature, The Lancet, NEJM).

// User Query: "${prompt}"

// Your response must:
// 1.  Be informative and directly answer the user's question.
// 2.  For each key piece of information, cite the source in parentheses, e.g., (Source: The Lancet, 2023) or (Source: World Health Organization).
// 3.  Conclude with the following mandatory disclaimer, exactly as written below, separated by a horizontal rule (---).

// ---
// **Disclaimer:** This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.`;

//     const chatHistory = [{ role: "user", parts: [{ text: fullPrompt }] }];
//     const payload = { contents: chatHistory };
//     const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
//     const apiKey = GEMINI_API_KEY;
//     if (!GEMINI_API_KEY) {
//       console.log("no api key");
      
//     } // The environment will provide the API key
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
//         return result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not retrieve information at this time. Please try again.";
//     } catch (error) {
//         console.error("Gemini API call failed:", error);
//         return "Error: Could not connect to the information service. Please check your connection.";
//     }
// }


// // --- Main App Component ---
// export default function App() {
//     const [hoveredAthlete, setHoveredAthlete] = useState(null);
//     const [expandedAthlete, setExpandedAthlete] = useState(null);
//     const [healthQuery, setHealthQuery] = useState('');
//     const [healthInfo, setHealthInfo] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const getPosition = (age, time) => {
//         const top = 100 - ((age - chartConfig.yAxis.min) / (chartConfig.yAxis.max - chartConfig.yAxis.min)) * 100;
//         const left = ((time - chartConfig.xAxis.min) / (chartConfig.xAxis.max - chartConfig.xAxis.min)) * 100;
//         return { top: `${top}%`, left: `${left}%` };
//     };

//     const handleGenerateInfo = async (e) => {
//         e.preventDefault();
//         if (!healthQuery.trim()) return;
//         setIsLoading(true);
//         setHealthInfo('');
//         const info = await fetchHealthInfo(healthQuery);
//         setHealthInfo(info.replace(/---/g, '<hr class="my-4 border-slate-300">'));
//         setIsLoading(false);
//     };
    
//     const toggleExpand = (athleteName) => {
//         setExpandedAthlete(expandedAthlete === athleteName ? null : athleteName);
//     };

//     // Filter out athletes who are outside the Y-axis range for plotting
//     const plottedAthletes = athletes.filter(a => a.age <= chartConfig.yAxis.max);

//     return (
//         <div className="bg-slate-100 min-h-screen font-sans text-slate-800 antialiased p-4 md:p-8">
//             <div className="max-w-6xl mx-auto">
//                 <header className="text-center mb-10">
//                     <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Ageless Velocity</h1>
//                     <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">
//                         An interactive chart of centenarian sprinters, powered by AI health insights.
//                     </p>
//                 </header>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Chart and Legend Column */}
//                     <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
//                         <div className="relative w-full h-80 md:h-96 mb-4">
//                             <span className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-slate-500 tracking-wider">{chartConfig.yAxis.label}</span>
//                             <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-slate-500 tracking-wider">{chartConfig.xAxis.label}</span>
                            
//                             <div className="w-full h-full bg-slate-50 rounded-lg border border-slate-200 relative">
//                                 {Array.from({ length: chartConfig.yAxis.max - chartConfig.yAxis.min + 1 }, (_, i) => i + chartConfig.yAxis.min).map(age => (
//                                     <div key={age} style={{ top: `${100 - ((age - chartConfig.yAxis.min) / (chartConfig.yAxis.max - chartConfig.yAxis.min)) * 100}%` }} className="absolute -left-7 text-xs text-slate-400">{age}</div>
//                                 ))}
//                                 {Array.from({ length: 19 }, (_, i) => i * 10).map(time => (
//                                      <div key={time} style={{ left: `${(time / (chartConfig.xAxis.max - chartConfig.xAxis.min)) * 100}%` }} className="absolute -bottom-5 text-xs text-slate-400">{time + chartConfig.xAxis.min}s</div>
//                                 ))}

//                                 {plottedAthletes.map((athlete) => {
//                                     const { top, left } = getPosition(athlete.age, athlete.time);
//                                     return (
//                                         <div
//                                             key={athlete.name}
//                                             className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
//                                             style={{ top, left }}
//                                             onMouseEnter={() => setHoveredAthlete(athlete)}
//                                             onMouseLeave={() => setHoveredAthlete(null)}
//                                         >
//                                             <div className={`w-3.5 h-3.5 ${athlete.color} rounded-full ring-2 ring-white transition-transform duration-200 ${hoveredAthlete?.name === athlete.name ? 'scale-150' : ''} cursor-pointer`}></div>
//                                         </div>
//                                     );
//                                 })}

//                                 {hoveredAthlete && (
//                                     <div
//                                         className="absolute bg-slate-800 text-white p-2 rounded-lg text-xs shadow-xl transition-opacity duration-200 pointer-events-none z-20"
//                                         style={{ ...getPosition(hoveredAthlete.age, hoveredAthlete.time), transform: 'translate(-50%, -150%)' }}
//                                     >
//                                         <p className="font-bold">{hoveredAthlete.name}</p>
//                                         <p>Age: {hoveredAthlete.age}, Time: {hoveredAthlete.time}s</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     {/* Athlete Key Column */}
//                     <div className="bg-white p-6 rounded-2xl shadow-lg">
//                         <h3 className="font-bold text-lg mb-4 text-slate-700">Athlete Key</h3>
//                         <div className="space-y-2">
//                            {athletes.map(athlete => (
//                                 <div key={athlete.name} className="border border-slate-200 rounded-lg">
//                                     <button onClick={() => toggleExpand(athlete.name)} className="w-full flex items-center justify-between p-3 text-left">
//                                         <div className="flex items-center gap-3">
//                                             <div className={`w-4 h-4 rounded-full ${athlete.color}`}></div>
//                                             <span className="font-semibold text-slate-800">{athlete.name}</span>
//                                         </div>
//                                         <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedAthlete === athlete.name ? 'rotate-180' : ''}`} />
//                                     </button>
//                                     {expandedAthlete === athlete.name && (
//                                         <div className="px-3 pb-3 text-sm text-slate-600 space-y-1">
//                                             <p><strong>Age:</strong> {athlete.age}</p>
//                                             <p><strong>Time:</strong> {athlete.time}s</p>
//                                             <p><strong>Nationality:</strong> {athlete.nationality}</p>
//                                             <p><strong>Location:</strong> {athlete.location}</p>
//                                             <p><strong>Date:</strong> {athlete.date}</p>
//                                         </div>
//                                     )}
//                                 </div>
//                            ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Gemini Insights Section */}
//                 <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
//                     <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">AI-Powered Health & Longevity Q&A</h2>
//                     <p className="text-center text-slate-500 mb-6">Ask a question about health, fitness, or the human body.</p>
//                     <form onSubmit={handleGenerateInfo} className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto">
//                         <input
//                           type="text"
//                           value={healthQuery}
//                           onChange={(e) => setHealthQuery(e.target.value)}
//                           placeholder="e.g., What are the benefits of cardiovascular exercise?"
//                           className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         />
//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60"
//                         >
//                             <SparklesIcon className="w-5 h-5" />
//                             {isLoading ? 'Searching...' : 'Ask AI'}
//                         </button>
//                     </form>

//                     {healthInfo && (
//                         <div className="mt-8 max-w-4xl mx-auto">
//                             <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 prose prose-slate max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: healthInfo }}></div>
//                         </div>
//                     )}
//                 </div>
                
//                  <footer className="text-center mt-12 text-red-500 text-xs">
//                     <p>**Disclaimer:** This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.<br/><br/> Athlete data from public records.</p>
//                 </footer>
//             </div>
//             <style>{`
//                 .prose hr { margin-top: 1rem; margin-bottom: 1rem; border-color: #cbd5e1; }
//                 .prose strong { color: #1e293b; }
//             `}</style>
//         </div>
//     );
// }
