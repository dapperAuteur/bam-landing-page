// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Utensils, Music, Users, Sparkles, Wheat, Waves, ArrowRight } from 'lucide-react';

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
//   const [ref, isVisible] = useOnScreen({ threshold: 0.15 });
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
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/80 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <Utensils size={48} className="mx-auto text-orange-300 mb-4" />
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-amber-400">
//         Echoes of the South
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         Mexican-American & Creole Influence in the 1932 Mississippi Delta
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-orange-200">
//         <span>A Story of Flavor and Rhythm in the Crucible</span>
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: Mexican-American Experience Section
// const MexicanAmericanSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//         <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12">
//                 <h2 className="text-4xl font-bold mb-4">A Fleeting Presence, A Lasting Flavor</h2>
//                 <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                     Recruited as seasonal laborers, the Mexican-American community's time in the Delta was brief but left behind an iconic culinary legacy: the Delta hot tamale.
//                 </p>
//             </div>
//             <div className="grid md:grid-cols-3 gap-8 text-center items-start">
//                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-orange-300 mb-2">Transient Labor</h3>
//                     <p className="text-gray-400">Recruited from Texas in the 1920s for the cotton harvest, their presence was tied to the crop. When the cotton market collapsed in 1932, the work vanished, forcing their departure.</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-orange-300 mb-2">The Delta Hot Tamale</h3>
//                     <p className="text-gray-400">In the fields, Mexican and African-American laborers shared culinary traditions. Black cooks adapted the tamale, using cornmeal instead of masa and simmering it in spiced broth, creating a unique Delta staple.</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-orange-300 mb-2">Contested Status</h3>
//                     <p className="text-gray-400">Like other non-white groups, their racial status was ambiguous. They were barred from white schools, a ruling they contested, highlighting the fluidity of the Jim Crow racial hierarchy.</p>
//                 </div>
//             </div>
//         </div>
//     </AnimatedSection>
// );

// // COMPONENT: Creole Influence Section
// const CreoleInfluenceSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//         <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12">
//                 <Music size={48} className="mx-auto text-orange-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">The Creole Cultural Current</h2>
//                 <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                     While not a settled community in the northern Delta, Creole culture flowed up the Mississippi from Louisiana, enriching the region's soundscape with a unique musical flavor.
//                 </p>
//             </div>
//             <div className="grid md:grid-cols-2 gap-8 text-left">
//                 <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//                     <h3 className="text-xl font-semibold text-orange-300 mb-2">"La-La" Music: The Precursor to Zydeco</h3>
//                     <p className="text-gray-400">The French-speaking Creoles of color in Louisiana developed a unique musical style featuring the accordion and fiddle, blending African rhythms with French folk melodies.</p>
//                 </div>
//                 <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
//                     <h3 className="text-xl font-semibold text-orange-300 mb-2">A Musical Confluence</h3>
//                     <p className="text-gray-400">This tradition interacted with the emerging Delta blues. Itinerant musicians carried the sounds upriver, creating a cross-pollination that added a "Spanish tinge" and rhythmic complexity to the music of the Delta.</p>
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
//         { title: "The First Hot Tamales", prompt: "Tell a short story about the moment of culinary creation in the cotton fields, where Mexican and African-American laborers first combine their knowledge to create the Delta hot tamale." },
//         { title: "The Accordion Man's Journey", prompt: "Write a brief story from the perspective of a Creole accordion player traveling up the Mississippi River, describing the music he plays and how it's received by the blues musicians he meets in the Delta." },
//         { title: "A Taste of Home", prompt: "Imagine a Tejano family in a Delta sharecropper's shack in 1932. Describe them making tamales and the memories of Texas that the food evokes." },
//         { title: "The 'Spanish Tinge'", prompt: "Describe a night at a juke joint where a visiting musician with a Creole influence plays, and how the local Delta blues players react to the new rhythms and sounds." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-orange-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">Voices of the Confluence</h2>
//                 <p className="text-lg text-gray-300 mb-8">
//                     Click a prompt to ask our AI to tell you a story from this cultural crossroads.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     {prompts.map((p) => (
//                         <button
//                             key={p.title}
//                             onClick={() => getStory(p.prompt)}
//                             disabled={isLoading}
//                             className="bg-orange-600/80 hover:bg-orange-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                         >
//                            <Sparkles size={18} /> {p.title}
//                         </button>
//                     ))}
//                 </div>

//                 {isLoading && (
//                      <div className="flex justify-center items-center p-8">
//                         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400"></div>
//                      </div>
//                 )}
//                 {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}
//                 {story && (
//                     <div className="bg-gray-800/60 p-6 rounded-lg border border-orange-400/50 text-left whitespace-pre-wrap font-serif text-gray-300">
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
//         <p>A story of transient labor, cultural exchange, and enduring legacies.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <MexicanAmericanSection />
//       <CreoleInfluenceSection />
//       <AIStorytellerSection />
//       <Footer />
//     </main>
//   );
// }
