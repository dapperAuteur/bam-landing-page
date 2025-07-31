// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Feather, Wind, Waves, Sun, Droplets, Shield, Map, Sparkles } from 'lucide-react';

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

// // COMPONENT: Hero Section
// const HeroSection = () => (
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-amber-900/80 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <Feather size={48} className="mx-auto text-amber-300 mb-4" />
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-400">
//         The First Peoples
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         Indigenous Life Along the River Known as *Napeste*
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-amber-200">
//         <Wind size={24} />
//         <span>A Homeland Shaped by the River of the South Wind</span>
//         <Waves size={24} />
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: Nation Card
// const NationCard = ({ nation }) => (
//     <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-amber-500/30 hover:border-amber-400 transition-all duration-300 shadow-lg">
//         <h3 className="text-2xl font-bold text-amber-300">{nation.name}</h3>
//         <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-1">{nation.region}</p>
//         <p className="text-gray-300 mt-3">{nation.role}</p>
//     </div>
// );

// // COMPONENT: Cultural Gradient Section
// const CulturalGradientSection = () => {
//     const nations = [
//         { name: 'Ute (Nuche)', region: 'Upper Valley / Headwaters (CO)', role: 'Mobile mountain nomads, using the river as a corridor for hunting and travel.' },
//         { name: 'Jicarilla Apache', region: 'Central Plains (CO/NM)', role: 'Blended farming on the riverbanks with bison hunting, linking plains and pueblo worlds.' },
//         { name: 'Pawnee', region: 'Central Plains (KS/NE)', role: 'Village-based farmers whose seasonal bison hunts extended into the river valley.' },
//         { name: 'Osage', region: 'Central & Lower Valley', role: 'A dominant regional power, controlling trade and territory along the river\'s middle course.' },
//         { name: 'Caddo', region: 'Lower Valley (AR/OK)', role: 'A complex agricultural society known for their large communities and trade in salt and pottery.' },
//         { name: 'Quapaw', region: 'Confluence (AR)', role: 'The "Downstream People," whose identity was tied to the river\'s end, living as farmers and French allies.' },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//             <div className="max-w-6xl mx-auto">
//                 <div className="text-center mb-12">
//                      <Map size={48} className="mx-auto text-amber-400 mb-4" />
//                     <h2 className="text-4xl font-bold mb-4">A Mosaic of Nations</h2>
//                     <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                         The river supported a gradient of cultures, each uniquely adapted to the landscape, from the high mountains to the Mississippi delta.
//                     </p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {nations.map(nation => <NationCard key={nation.name} nation={nation} />)}
//                 </div>
//             </div>
//         </AnimatedSection>
//     );
// };

// // COMPONENT: River's Role Section
// const RiverRoleSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//         <div className="max-w-5xl mx-auto">
//             <div className="text-center mb-12">
//                 <h2 className="text-4xl font-bold">The River as Sustenance, Highway, and Spirit</h2>
//             </div>
//             <div className="grid md:grid-cols-3 gap-8 text-center">
//                 <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//                     <Droplets size={32} className="mx-auto text-amber-300 mb-3" />
//                     <h3 className="text-xl font-semibold mb-2">Source of Life</h3>
//                     <p className="text-gray-400">Provided water for drinking and farming, fish for food, and supported the game animals essential to all nations along its course.</p>
//                 </div>
//                 <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//                     <Waves size={32} className="mx-auto text-amber-300 mb-3" />
//                     <h3 className="text-xl font-semibold mb-2">Great Highway</h3>
//                     <p className="text-gray-400">A network for commerce and communication, carrying the Caddo's salt, the Osage's furs, and connecting diverse cultures.</p>
//                 </div>
//                 <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//                     <Sun size={32} className="mx-auto text-amber-300 mb-3" />
//                     <h3 className="text-xl font-semibold mb-2">Sacred Geography</h3>
//                     <p className="text-gray-400">An organizing principle for cosmology and identity, forming sacred boundaries for the Jicarilla and defining the Quapaw's sense of place.</p>
//                 </div>
//             </div>
//         </div>
//     </AnimatedSection>
// );


// // COMPONENT: Gemini API Powered AI Storyteller
// const AIStorytellerSection = () => {
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
//         { title: "A Caddo Salt Trader", prompt: "Tell a short, first-person story of a Caddo trader preparing a shipment of salt harvested near the Arkansas River, describing the importance of the river for their journey." },
//         { title: "The Osage Border", prompt: "Describe the Arkansas River from the perspective of an Osage warrior, viewing it not just as water, but as the southern boundary of their nation's territory, a line to be defended." },
//         { title: "A Pawnee Bison Hunt", prompt: "Write a vivid description of a Pawnee hunting party tracking bison along a tributary of the Arkansas River, focusing on the signs they read in the landscape." },
//         { title: "The Quapaw Welcome", prompt: "Imagine the scene as French explorers first arrive at a Quapaw village near the river's mouth. Describe the encounter and the forging of an alliance from the Quapaw perspective." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-amber-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">Voices of the *Napeste*</h2>
//                 <p className="text-lg text-gray-300 mb-8">
//                     Click a prompt to ask our AI to tell you a story from the river's Indigenous past.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     {prompts.map((p) => (
//                         <button
//                             key={p.title}
//                             onClick={() => getStory(p.prompt)}
//                             disabled={isLoading}
//                             className="bg-amber-600/80 hover:bg-amber-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                         >
//                            <Sparkles size={18} /> {p.title}
//                         </button>
//                     ))}
//                 </div>

//                 {isLoading && (
//                      <div className="flex justify-center items-center p-8">
//                         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400"></div>
//                      </div>
//                 )}
//                 {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}
//                 {story && (
//                     <div className="bg-gray-800/60 p-6 rounded-lg border border-amber-400/50 text-left whitespace-pre-wrap font-serif text-gray-300">
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
//         <p>A story of resilience, adaptation, and deep connection to a sacred river.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <CulturalGradientSection />
//       <RiverRoleSection />
//       <AIStorytellerSection />
//       <Footer />
//     </main>
//   );
// }
