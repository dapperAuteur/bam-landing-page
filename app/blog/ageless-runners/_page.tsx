// "use client"
// import React, { useState } from 'react';

// // --- SVG Icon Components for a Clean UI ---
// const TrophyIcon = ({ className }) => {
//   console.log('typeof className :>> ', typeof className);
//   console.log('className :>> ', className);
//   return(
//   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M18.5 2h-13A2.5 2.5 0 003 4.5V9c0 4.42 3.58 8 8 8s8-3.58 8-8V4.5A2.5 2.5 0 0018.5 2zM11 15c-2.76 0-5-2.24-5-5h10c0 2.76-2.24 5-5 5zM11 18h2v3h-2zM10 21h4v2h-4z" />
//   </svg>
// )};
// const CalendarIcon = ({ className }) => {
//   console.log('typeof className :>> ', typeof className);
//   console.log('className :>> ', className);

// ;


//   return (
//   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14a2 2 0 002-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
//   </svg>
// )};
// const LocationIcon = ({ className }) => {
//   console.log('typeof className :>> ', typeof className);
//   console.log('className :>> ', className);
//   return (
//   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
//   </svg>
// )};
// const FlagIcon = ({ className }) => {
//   console.log('typeof className :>> ', typeof className);
//   console.log('className :>> ', className)
//   return (
//   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
//   </svg>
// )};
// const SparklesIcon = ({ className }) => {
//   console.log('typeof className :>> ', typeof className);
//   console.log('className :>> ', className);
//   return (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M12 2l2.37 6.94h7.26l-5.88 4.28 2.24 6.88-5.99-4.34-5.99 4.34 2.24-6.88-5.88-4.28h7.26L12 2z" />
//     </svg>
// )};

// // --- Athlete Data extracted from the document ---
// const athletes = [
//   {
//     name: "Lester Wright",
//     achievement: "26.34s",
//     location: "Philadelphia, PA",
//     date: "2022-04-30",
//     nationality: "United States",
//     facts: "A WWII veteran who began running in the 1930s. At 100, he broke the centenarian world record.",
//     imageUrl: "https://placehold.co/400x400/3498db/ffffff?text=Lester+W.",
//   },
//   {
//     name: "Donald Pellmann",
//     achievement: "26.99s",
//     location: "San Diego, CA",
//     date: "2015-09-20",
//     nationality: "United States",
//     facts: "Set five world records in one day at age 100. He started competitive running at 70 after a career working on the Apollo space program.",
//     imageUrl: "https://placehold.co/400x400/2ecc71/ffffff?text=Donald+P.",
//   },
//   {
//     name: "Julia 'Hurricane' Hawkins",
//     achievement: "39.62s",
//     location: "Birmingham, AL",
//     date: "2017-06-10",
//     nationality: "United States",
//     facts: "A former competitive cyclist who started running at 100, setting multiple records in the 100+ and 105+ age categories.",
//     imageUrl: "https://placehold.co/400x400/f1c40f/ffffff?text=Julia+H.",
//   },
//   {
//     name: "Ida Keeling",
//     achievement: "1:17.33",
//     location: "Philadelphia, PA",
//     date: "2016-04-30",
//     nationality: "United States",
//     facts: "The first woman to complete a 100m run at age 100. She began running at 67 as a way to heal from personal tragedy.",
//     imageUrl: "https://placehold.co/400x400/9b59b6/ffffff?text=Ida+K.",
//   },
//   {
//     name: "Hidekichi Miyazaki",
//     achievement: "42.22s (at 105)",
//     location: "Kyoto, Japan",
//     date: "2015-09-23",
//     nationality: "Japan",
//     facts: "Nicknamed 'Golden Bolt' for mimicking Usain Bolt's pose. He began his sprinting journey in his 90s.",
//     imageUrl: "https://placehold.co/400x400/e74c3c/ffffff?text=Hidekichi+M.",
//   },
//   {
//     name: "Everett Hosack",
//     achievement: "Competed at 101",
//     location: "Philadelphia, PA",
//     date: "2003",
//     nationality: "United States",
//     facts: "Gained fame for competing at the prestigious Penn Relays at ages 100 and 101, also holding records in field events.",
//     imageUrl: "https://placehold.co/400x400/e67e22/ffffff?text=Everett+H.",
//   },
// ];

// // --- Gemini API Call Function ---
// async function generateInsight(athlete) {
//   console.log('typeof athlete :>> ', typeof athlete);
//   console.log('athlete :>> ', athlete);
//   const prompt = `Based on the inspiring story of ${athlete.name}, a centenarian athlete known for achieving ${athlete.achievement} and whose life involved these facts: "${athlete.facts}", generate a short, one-sentence motivational fitness insight. Make it powerful and concise.`;
  
//   // In a real Next.js app, this logic would typically be in an API route.
//   // For this self-contained component, we'll make the call directly.
//   const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
//   const payload = { contents: chatHistory };
//   const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//   const apiKey = GEMINI_API_KEY; // The environment will provide the API key
//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//   try {
//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       console.error("API call failed with status:", response.status);
//       return "It's never too late to start a new chapter of strength.";
//     }

//     const result = await response.json();

//     if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
//       return result.candidates[0].content.parts[0].text;
//     } else {
//       console.error("Unexpected response structure:", result);
//       return "Find joy in movement, and you'll stay active for a lifetime.";
//     }
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     return "Consistency is the fuel for the fire of longevity.";
//   }
// }

// // --- Athlete Card Component ---
// const AthleteCard = ({ athlete }) => {
//   console.log('typeof athlete :>> ', typeof athlete);
//   console.log('athlete :>> ', athlete);
//   const [insight, setInsight] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGenerateClick = async () => {
//     setIsLoading(true);
//     setInsight(''); // Clear previous insight
//     const generatedInsight = await generateInsight(athlete);
//     setInsight(generatedInsight);
//     setIsLoading(false);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col group">
//       <div className="relative">
//         <img className="w-full h-56 object-cover" src={athlete.imageUrl} alt={`Portrait of ${athlete.name}`} />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
//         <div className="absolute bottom-0 left-0 p-5">
//             <h3 className="text-3xl font-bold text-white tracking-tight">{athlete.name}</h3>
//             <p className="text-amber-300 font-semibold text-lg">{athlete.achievement}</p>
//         </div>
//       </div>
//       <div className="p-6 flex flex-col flex-grow">
//         <div className="space-y-3 mb-5 text-sm text-slate-700">
//           <div className="flex items-center gap-3"><FlagIcon className="w-5 h-5 text-sky-600" /><span>{athlete.nationality}</span></div>
//           <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-rose-600" /><span>{athlete.date}</span></div>
//           <div className="flex items-center gap-3"><LocationIcon className="w-5 h-5 text-emerald-600" /><span>{athlete.location}</span></div>
//         </div>
        
//         <p className="text-slate-600 text-base mb-auto leading-relaxed">{athlete.facts}</p>

//         <div className="mt-6 pt-5 border-t border-slate-200">
//           {insight ? (
//             <div className="p-4 bg-indigo-50 rounded-lg text-center animate-fade-in">
//               <p className="text-indigo-800 font-medium italic">&quot;{insight}&quot;</p>
//             </div>
//           ) : (
//             <button
//               onClick={handleGenerateClick}
//               disabled={isLoading}
//               className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               <SparklesIcon className="w-5 h-5"/>
//               {isLoading ? 'Generating Insight...' : 'Get AI Fitness Insight'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main App Component ---
// export default function App() {
//   return (
//     <div className="bg-slate-100 min-h-screen font-sans text-slate-800 antialiased">
//       <style>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out forwards;
//         }
//       `}</style>
//       <div className="container mx-auto px-4 py-12 md:py-16">
//         <header className="text-center mb-12 md:mb-16">
//           <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
//               Ageless Runners
//             </span>
//           </h1>
//           <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
//             An interactive look at the world&apos;s most inspiring centenarian athletes who redefine the limits of age.
//           </p>
//         </header>

//         <main>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
//             {athletes.map((athlete) => (
//               <AthleteCard key={athlete.name} athlete={athlete} />
//             ))}
//           </div>
//         </main>
        
//         <footer className="text-center mt-16 text-slate-500 text-sm">
//           <p>All athlete data sourced from public records.</p>
//         </footer>
//       </div>
//     </div>
//   );
// }
