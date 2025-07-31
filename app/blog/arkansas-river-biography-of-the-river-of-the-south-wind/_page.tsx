// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Mountain, Waves, Feather, Pickaxe, Users, Anchor, Fish, Landmark, Wind, Droplets, MapPin, Ship, Footprints, Building, Sprout, Sparkles } from 'lucide-react';

// // HELPER: Custom hook for scroll animations
// const useOnScreen = (options) => {
//   const ref = useRef(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         setIsVisible(true);
//         observer.unobserve(entry.target);
//       }
//     }, options);

//     const currentRef = ref.current;
//     if (currentRef) {
//       observer.observe(currentRef);
//     }

//     return () => {
//       if (currentRef) {
//         observer.unobserve(currentRef);
//       }
//     };
//   }, [ref, options]);

//   return [ref, isVisible];
// };

// // COMPONENT: Animated Section Wrapper
// const AnimatedSection = ({ children, className = '' }) => {
//   const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
//   return (
//     <section
//       ref={ref}
//       className={`transition-all duration-1000 ease-in-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
//     >
//       {children}
//     </section>
//   );
// };

// // COMPONENT: Stat Card
// const StatCard = ({ icon, label, value, color }) => (
//   <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center shadow-lg border border-white/20">
//     <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${color}`}>
//       {icon}
//     </div>
//     <p className="text-sm text-gray-300 uppercase tracking-wider">{label}</p>
//     <p className="text-2xl font-bold text-white">{value}</p>
//   </div>
// );

// // COMPONENT: Timeline Event
// const TimelineEvent = ({ icon, title, text, year, align = 'left' }) => (
//   <div className={`flex items-center w-full my-6 md:my-0 ${align === 'right' ? 'md:justify-end' : ''}`}>
//     <div className="hidden md:block w-1/2">
//       {align === 'right' && (
//         <div className="text-right pr-8">
//           <h3 className="text-xl font-bold text-sky-300">{title}</h3>
//           <p className="text-gray-300 mt-1">{text}</p>
//         </div>
//       )}
//     </div>
//     <div className="relative w-full md:w-auto">
//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="h-full w-0.5 bg-sky-400"></div>
//       </div>
//       <div className="relative z-10 w-16 h-16 bg-gray-800 border-2 border-sky-400 rounded-full flex items-center justify-center mx-auto">
//         <div className="absolute -top-4 bg-gray-900 px-2 py-0.5 rounded-md text-sm font-semibold text-sky-300 border border-sky-400/50">{year}</div>
//         {icon}
//       </div>
//     </div>
//     <div className="hidden md:block w-1/2">
//        {align === 'left' && (
//         <div className="pl-8">
//           <h3 className="text-xl font-bold text-sky-300">{title}</h3>
//           <p className="text-gray-300 mt-1">{text}</p>
//         </div>
//       )}
//     </div>
//      {/* Mobile View */}
//     <div className="md:hidden pl-4 w-full">
//         <h3 className="text-lg font-bold text-sky-300">{title}</h3>
//         <p className="text-gray-400 mt-1 text-sm">{text}</p>
//     </div>
//   </div>
// );

// // COMPONENT: Hero Section
// const HeroSection = () => (
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-slate-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-400">
//         The Arkansas River
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         A Biography of the River of the South Wind
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-sky-200">
//         <Wind size={24} />
//         <span>From the Rocky Mountains to the Mississippi Delta</span>
//         <Waves size={24} />
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: River Stats Section
// const RiverStatsSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-slate-900">
//         <div className="max-w-6xl mx-auto">
//             <h2 className="text-4xl font-bold text-center text-white mb-12">An Artery of America</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                 <StatCard icon={<MapPin size={28} className="text-white"/>} label="Length" value="1,469 Miles" color="bg-blue-500" />
//                 <StatCard icon={<Droplets size={28} className="text-white"/>} label="Source Elevation" value="9,728 Feet" color="bg-sky-500" />
//                 <StatCard icon={<Mountain size={28} className="text-white"/>} label="Basin Size" value="170,000 sq mi" color="bg-teal-500" />
//                 <StatCard icon={<Anchor size={28} className="text-white"/>} label="Mouth" value="Mississippi River" color="bg-indigo-500" />
//             </div>
//         </div>
//     </AnimatedSection>
// );

// // COMPONENT: Geology Section
// const GeologySection = () => (
//   <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//     <div className="max-w-5xl mx-auto text-center">
//       <Mountain size={48} className="mx-auto text-sky-400 mb-4" />
//       <h2 className="text-4xl font-bold mb-4">Forged in Fire and Ice</h2>
//       <p className="text-lg text-gray-300 mb-8">
//         The river's path is a story of geological drama: tectonic uplift, volcanic dams, and catastrophic ice-age floods that carved its canyons and dictated its destiny.
//       </p>
//       <div className="grid md:grid-cols-3 gap-8 text-left">
//         <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//           <h3 className="text-xl font-semibold text-sky-300 mb-2">Mountain Cradle</h3>
//           <p className="text-gray-400">Born from snowpack in the Sawatch and Mosquito ranges, its headwaters near Leadville, CO, begin a 4,600-foot drop in just 120 miles.</p>
//         </div>
//         <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//           <h3 className="text-xl font-semibold text-sky-300 mb-2">Geological Piracy</h3>
//           <p className="text-gray-400">Millions of years ago, the river flowed south. Volcanic uplift blocked its path, forcing it east and "capturing" it for the Mississippi watershed.</p>
//         </div>
//         <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//           <h3 className="text-xl font-semibold text-sky-300 mb-2">The Royal Gorge</h3>
//           <p className="text-gray-400">This 1,200-foot-deep canyon was carved as the river ground down through the rock of the Front Range, a testament to its relentless power.</p>
//         </div>
//       </div>
//     </div>
//   </AnimatedSection>
// );

// // COMPONENT: Indigenous History Section
// const IndigenousHistorySection = () => (
//   <AnimatedSection className="py-20 px-4 bg-slate-900 text-white">
//     <div className="max-w-6xl mx-auto">
//       <Feather size={48} className="mx-auto text-amber-400 mb-4" />
//       <h2 className="text-4xl font-bold text-center mb-4">The First Peoples</h2>
//       <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
//         For millennia, the river valley was a homeland known as *Napeste*, a mosaic of territories for diverse Indigenous nations whose lives were woven into its rhythms.
//       </p>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[{name: 'Ute (Nuche)', region: 'Upper Valley (CO)', role: 'Mountain nomads, seasonal hunters.'},
//           {name: 'Pawnee', region: 'Central Plains (KS)', role: 'Village farmers and seasonal bison hunters.'},
//           {name: 'Osage', region: 'Central/Lower Valley', role: 'Regional power, controlled trade.'},
//           {name: 'Jicarilla Apache', region: 'Upper Valley (CO/NM)', role: 'Plains traders and agriculturalists.'},
//           {name: 'Caddo', region: 'Lower Valley (AR/OK)', role: 'Complex society, salt & pottery traders.'},
//           {name: 'Quapaw', region: 'Confluence (AR)', role: '"Downstream People," farmers, French allies.'}].map(nation => (
//             <div key={nation.name} className="bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-amber-400 transition-colors">
//                 <h3 className="text-xl font-bold text-amber-300">{nation.name}</h3>
//                 <p className="text-sm text-gray-400 uppercase tracking-wide">{nation.region}</p>
//                 <p className="mt-2 text-gray-300">{nation.role}</p>
//             </div>
//         ))}
//       </div>
//     </div>
//   </AnimatedSection>
// );

// // COMPONENT: Expansion & Mining Section
// const ExpansionMiningSection = () => (
//   <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//     <div className="max-w-5xl mx-auto">
//       <Pickaxe size={48} className="mx-auto text-yellow-400 mb-4" />
//       <h2 className="text-4xl font-bold text-center mb-4">Gold, Borders, and Transformation</h2>
//       <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
//         The 19th century brought gold rushes, new borders, and industrial mining that enriched a nation but poisoned the river's headwaters.
//       </p>
//       <div className="relative">
//         {/* Timeline Line */}
//         <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-yellow-400/30 hidden md:block"></div>
        
//         <TimelineEvent 
//           align="left"
//           year="1819"
//           icon={<MapPin size={32} className="text-yellow-300" />}
//           title="An International Border"
//           text="The Adams-Onís Treaty makes the Arkansas River the boundary between the U.S. and Spanish Mexico."
//         />
//         <TimelineEvent 
//           align="right"
//           year="1859"
//           icon={<span className="text-3xl text-yellow-300">Au</span>}
//           title="Pikes Peak Gold Rush"
//           text="Placer gold is discovered in California Gulch, near the river's headwaters, sparking a rush."
//         />
//         <TimelineEvent 
//           align="left"
//           year="1877"
//           icon={<span className="text-3xl text-gray-300">Ag</span>}
//           title="The Silver Boom"
//           text="Discovery of massive silver deposits leads to the founding of Leadville, one of the world's richest mining camps."
//         />
//         <TimelineEvent 
//           align="right"
//           year="1983"
//           icon={<Sprout size={32} className="text-green-400" />}
//           title="Superfund Site"
//           text="The Leadville district is declared a Superfund site due to heavy metal pollution from mining, beginning a long cleanup."
//         />
//       </div>
//     </div>
//   </AnimatedSection>
// );

// // COMPONENT: African American History Section
// const AfricanAmericanHistorySection = () => (
//     <AnimatedSection className="py-20 px-4 bg-slate-900 text-white">
//         <div className="max-w-5xl mx-auto">
//             <Users size={48} className="mx-auto text-emerald-400 mb-4" />
//             <h2 className="text-4xl font-bold text-center mb-4">The Other Great Migration</h2>
//             <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
//                 The river was a corridor in the African American experience, a current carrying people from bondage in the delta toward new frontiers of freedom.
//             </p>
//             <div className="grid md:grid-cols-3 gap-8 text-center">
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <Footprints size={32} className="mx-auto text-emerald-300 mb-3" />
//                     <h3 className="text-xl font-semibold mb-2">From Bondage</h3>
//                     <p className="text-gray-400">Enslaved people were forced to labor on cotton plantations in the fertile river delta of Arkansas.</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <Building size={32} className="mx-auto text-emerald-300 mb-3" />
//                     <h3 className="text-xl font-semibold mb-2">All-Black Towns</h3>
//                     <p className="text-gray-400">Post-Civil War, "Exodusters" migrated to Kansas and Oklahoma, founding towns like Boley and Langston in the river's watershed.</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold mb-2">"Black Wall Street"</h3>
//                      <p className="text-gray-400 mt-4">The Greenwood District in Tulsa, near the river, became the most prosperous Black community in the U.S. before the 1921 Race Massacre.</p>
//                 </div>
//             </div>
//         </div>
//     </AnimatedSection>
// );

// // COMPONENT: Engineered River Section
// const EngineeredRiverSection = () => (
//   <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//     <div className="max-w-6xl mx-auto">
//       <div className="text-center mb-12">
//         <Anchor size={48} className="mx-auto text-cyan-400 mb-4" />
//         <h2 className="text-4xl font-bold mb-4">The Engineered River</h2>
//         <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//           In the 20th century, the river was tamed and transformed by monumental engineering for commerce, agriculture, and recreation.
//         </p>
//       </div>
//       <div className="grid md:grid-cols-3 gap-8">
//         <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//           <Ship size={32} className="mb-3 text-cyan-300" />
//           <h3 className="text-xl font-semibold">Navigation System</h3>
//           <p className="mt-2 text-gray-400">The McClellan-Kerr system, with 18 locks and dams, created a 439-mile shipping channel from the Mississippi to near Tulsa, OK.</p>
//         </div>
//         <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//           <Fish size={32} className="mb-3 text-cyan-300" />
//           <h3 className="text-xl font-semibold">A Fishery Reborn</h3>
//           <p className="mt-2 text-gray-400">After cleanup from mining pollution, the upper river was stocked with non-native trout, becoming a world-class "Gold Medal" fishery.</p>
//         </div>
//         <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//           <Landmark size={32} className="mb-3 text-cyan-300" />
//           <h3 className="text-xl font-semibold">Iconic Bridges</h3>
//           <p className="mt-2 text-gray-400">From the tourist-focused Royal Gorge Bridge to the recreational Big Dam Bridge, spans across the river tell a story of changing priorities.</p>
//         </div>
//       </div>
//     </div>
//   </AnimatedSection>
// );

// // COMPONENT: Gemini API Powered River Stories
// const RiverStoriesAISection = () => {
//     const [story, setStory] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');

//     const getStory = async (prompt) => {
//         setIsLoading(true);
//         setError('');
//         setStory('');

//         try {
//             let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
//             const payload = { contents: chatHistory };
//             const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
//             const apiKey = GEMINI_API_KEY; // API key will be injected by the environment
//             const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload)
//             });

//             if (!response.ok) {
//                 throw new Error(`API request failed with status ${response.status}`);
//             }

//             const result = await response.json();
            
//             if (result.candidates && result.candidates.length > 0 &&
//                 result.candidates[0].content && result.candidates[0].content.parts &&
//                 result.candidates[0].content.parts.length > 0) {
//                 const text = result.candidates[0].content.parts[0].text;
//                 setStory(text);
//             } else {
//                 throw new Error("Unexpected response format from API.");
//             }
//         } catch (err) {
//             console.error(err);
//             setError(err.message || "An error occurred while fetching the story.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const prompts = [
//         { title: "A Pawnee Trader's Tale", prompt: "Tell a short story from the perspective of a Pawnee trader in the 1700s, describing a journey along the Arkansas River (which they called Napeste) to trade with the Wichita people." },
//         { title: "Ice Age River", prompt: "Describe the Arkansas River valley during the last Ice Age, focusing on the megafauna like mammoths and the powerful glacial meltwater floods." },
//         { title: "Leadville Silver Song", prompt: "Write the lyrics for a short, melancholic folk song about a silver miner in Leadville, Colorado, in the 1880s, mentioning the Arkansas River." },
//         { title: "Quapaw Origin Story", prompt: "Generate a brief, poetic origin story for the Quapaw, the 'Downstream People,' and their connection to the confluence of the Arkansas and Mississippi rivers." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-slate-900 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-purple-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">✨ River Stories AI</h2>
//                 <p className="text-lg text-gray-300 mb-8">
//                     Click a prompt to ask our AI to tell you a story about the river's past.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     {prompts.map((p) => (
//                         <button
//                             key={p.title}
//                             onClick={() => getStory(p.prompt)}
//                             disabled={isLoading}
//                             className="bg-purple-600/80 hover:bg-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                         >
//                            <Sparkles size={18} /> {p.title}
//                         </button>
//                     ))}
//                 </div>

//                 {isLoading && (
//                      <div className="flex justify-center items-center p-8">
//                         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
//                      </div>
//                 )}
//                 {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}
//                 {story && (
//                     <div className="bg-gray-800/60 p-6 rounded-lg border border-purple-400/50 text-left whitespace-pre-wrap font-serif text-gray-300">
//                         {story}
//                     </div>
//                 )}
//             </div>
//         </AnimatedSection>
//     );
// };

// // COMPONENT: Footer
// const Footer = () => (
//     <footer className="bg-gray-900 text-center p-8 text-gray-400">
//         <p>The Arkansas River: An enduring, resilient waterway.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <RiverStatsSection />
//       <GeologySection />
//       <IndigenousHistorySection />
//       <ExpansionMiningSection />
//       <AfricanAmericanHistorySection />
//       <EngineeredRiverSection />
//       <RiverStoriesAISection />
//       <Footer />
//     </main>
//   );
// }
