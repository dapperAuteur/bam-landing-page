// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Feather, Wind, Waves, Sun, Droplets, Shield, Map, Sparkles, Scroll, Drama } from 'lucide-react';

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
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-emerald-900/80 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <Feather size={48} className="mx-auto text-emerald-300 mb-4" />
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-green-400">
//         The Dispossessed
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         Choctaw Persistence and Cultural Survival in the Mississippi Delta
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-emerald-200">
//         <span>A Story of Resilience in a Stolen Homeland</span>
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: Historical Context Section
// const HistorySection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//         <div className="max-w-5xl mx-auto">
//             <div className="text-center mb-12">
//                 <Scroll size={48} className="mx-auto text-emerald-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">Shadows of a Homeland</h2>
//                 <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                     The very name of Coahoma County—"red panther" in Choctaw—is a reminder of the land's original inhabitants, who were systematically dispossessed by broken treaties and fraud.
//                 </p>
//             </div>
//             <div className="grid md:grid-cols-2 gap-8 text-left">
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-emerald-300 mb-2">The Trail of Tears</h3>
//                     <p className="text-gray-400">The Indian Removal Act of 1830 forced most Choctaw and Chickasaw people to Oklahoma. The name "Coahoma" itself is a direct link to this indigenous history.</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-emerald-300 mb-2">The Illusion of Article 14</h3>
//                     <p className="text-gray-400">A provision in the Treaty of Dancing Rabbit Creek promised land to Choctaws who remained. Instead, they were defrauded, becoming landless sharecroppers on their ancestral lands.</p>
//                 </div>
//             </div>
//         </div>
//     </AnimatedSection>
// );

// // COMPONENT: Art Card
// const ArtCard = ({ icon, title, description }) => (
//     <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 shadow-lg flex items-start gap-4">
//         <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-emerald-900/50 border border-emerald-500/30">
//             {icon}
//         </div>
//         <div>
//             <h3 className="text-xl font-bold text-emerald-300">{title}</h3>
//             <p className="text-gray-300 mt-2">{description}</p>
//         </div>
//     </div>
// );

// // COMPONENT: Cultural Arts Section
// const CulturalArtsSection = () => {
//     const arts = [
//         {
//             icon: <Droplets size={24} className="text-emerald-300"/>,
//             title: 'River Cane Basketry',
//             description: 'Women wove intricate baskets from river cane, using natural dyes to create traditional patterns like the diamondback snake—a tangible link to their identity and a source of income.'
//         },
//         {
//             icon: <Feather size={24} className="text-emerald-300"/>,
//             title: 'Traditional Dress & Beadwork',
//             description: 'Hand-sewn cotton dresses with diamond appliqué motifs and elaborate beadwork served as visible markers of Choctaw identity, worn as a quiet assertion of sovereignty.'
//         },
//         {
//             icon: <Drama size={24} className="text-emerald-300"/>,
//             title: 'Music, Dance & Ceremony',
//             description: 'Community dances, ceremonial stickball games, and traditional songs recorded by Frances Densmore in 1933 reveal a rich cultural life that persisted despite immense hardship.'
//         },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//             <div className="max-w-6xl mx-auto">
//                 <div className="text-center mb-12">
//                     <h2 className="text-4xl font-bold mb-4">Weaving the Past into the Present</h2>
//                     <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                         In the face of forced assimilation, the practice of traditional arts was a fundamental act of cultural preservation and a quiet performance of the nationhood the Choctaw were fighting to reclaim.
//                     </p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                     {arts.map(art => <ArtCard key={art.title} {...art} />)}
//                 </div>
//             </div>
//         </AnimatedSection>
//     );
// };

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
//         { title: "The Basket Weaver's Hands", prompt: "Tell a short, first-person story from the perspective of a Mississippi Choctaw woman in 1932, gathering river cane and weaving a basket with the diamondback snake pattern. Describe what the act means to her." },
//         { title: "The Stickball Game", prompt: "Describe the sounds, sights, and energy of a traditional Choctaw stickball game (kabotcha toli) in the 1930s, focusing on its role as a community gathering." },
//         { title: "A Dress of Diamonds", prompt: "Write a brief story about a Choctaw woman wearing her handmade traditional dress to town, and the quiet statement of identity and sovereignty she is making." },
//         { title: "A Song for the Quail", prompt: "Imagine you are with Frances Densmore in 1933 as she records a Choctaw singer. Describe the scene and the feeling of hearing a traditional song like the Quail Dance Song preserved." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-emerald-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">Voices of the Homeland</h2>
//                 <p className="text-lg text-gray-300 mb-8">
//                     Click a prompt to ask our AI to tell you a story from the heart of the Choctaw experience.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     {prompts.map((p) => (
//                         <button
//                             key={p.title}
//                             onClick={() => getStory(p.prompt)}
//                             disabled={isLoading}
//                             className="bg-emerald-600/80 hover:bg-emerald-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                         >
//                            <Sparkles size={18} /> {p.title}
//                         </button>
//                     ))}
//                 </div>

//                 {isLoading && (
//                      <div className="flex justify-center items-center p-8">
//                         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
//                      </div>
//                 )}
//                 {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}
//                 {story && (
//                     <div className="bg-gray-800/60 p-6 rounded-lg border border-emerald-400/50 text-left whitespace-pre-wrap font-serif text-gray-300">
//                         {story}
//                     </div>
//                 )}
//             </div>
//         </AnimatedSection>
//     );
// };

// // COMPONENT: Footer
// const Footer = () => (
//     <footer className="bg-gray-900 text-center p-8 text-gray-400 border-t border-gray-700">
//         <p>A story of resilience, adaptation, and the enduring power of culture.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <HistorySection />
//       <CulturalArtsSection />
//       <AIStorytellerSection />
//       <Footer />
//     </main>
//   );
// }
