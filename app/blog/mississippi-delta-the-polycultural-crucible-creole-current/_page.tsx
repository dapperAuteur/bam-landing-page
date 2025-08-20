// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Music, Users, Sparkles, Waves, Drama, GitBranch } from 'lucide-react';

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
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/80 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <Music size={48} className="mx-auto text-purple-300 mb-4" />
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-400">
//         The Creole Current
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         Echoes of New Orleans in the 1932 Mississippi Delta
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-purple-200">
//         <span>A Story of Rhythm and Influence Flowing Upriver</span>
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: Cultural Flow Section
// const CulturalFlowSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//         <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12">
//                 <h2 className="text-4xl font-bold mb-4">A River of Sound</h2>
//                 <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                     While not a settled community in Clarksdale, Creole culture flowed north from Louisiana, carried by itinerant musicians on the Mississippi River, a two-way channel of cultural transmission.
//                 </p>
//             </div>
//             <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center">
//                 <div className="flex flex-col items-center">
//                     <div className="w-32 h-32 rounded-lg bg-gray-800 flex items-center justify-center border-2 border-purple-500/50 mb-4">
//                         <h3 className="text-xl font-bold text-purple-300">New Orleans</h3>
//                         <p className="text-sm text-gray-400 absolute bottom-2">Southern Louisiana</p>
//                     </div>
//                     <p className="max-w-xs text-gray-400">The heart of Creole culture and "la-la" music.</p>
//                 </div>
//                 <div className="text-purple-500 transform rotate-90 md:rotate-0">
//                     <Waves size={64} />
//                 </div>
//                  <div className="flex flex-col items-center">
//                     <div className="w-32 h-32 rounded-lg bg-gray-800 flex items-center justify-center border-2 border-purple-500/50 mb-4">
//                         <h3 className="text-xl font-bold text-purple-300">The Delta</h3>
//                          <p className="text-sm text-gray-400 absolute bottom-2">Clarksdale, MS</p>
//                     </div>
//                     <p className="max-w-xs text-gray-400">A "confluence zone" where musical traditions met.</p>
//                 </div>
//             </div>
//         </div>
//     </AnimatedSection>
// );

// // COMPONENT: Musical Exchange Section
// const MusicalExchangeSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//         <div className="max-w-5xl mx-auto p-8 bg-gray-700/50 rounded-lg border border-purple-500/30">
//             <div className="text-center mb-8">
//                  <GitBranch size={48} className="mx-auto text-purple-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">The "Spanish Tinge" and the Blues</h2>
//                 <p className="text-lg text-gray-300">
//                     The interaction between Creole "la-la" music and the emerging Delta blues created a richer, more complex regional soundscape.
//                 </p>
//             </div>
//             <div className="grid md:grid-cols-2 gap-8 text-left">
//                  <div>
//                     <h3 className="text-xl font-semibold text-purple-300 mb-2">Creole "La-La" Music</h3>
//                     <p className="text-gray-400">A tradition from French-speaking Creoles of color, "la-la" music featured the accordion and fiddle, blending African rhythms with French folk melodies. It was the direct precursor to modern Zydeco.</p>
//                  </div>
//                  <div>
//                     <h3 className="text-xl font-semibold text-purple-300 mb-2">Cross-Pollination</h3>
//                     <p className="text-gray-400">Itinerant musicians like Amédé Ardoin brought these sounds north. The habanera rhythm, what Jelly Roll Morton called the "Spanish tinge," became a key ingredient in the blues and early jazz, adding to its soulful, improvisational character.</p>
//                  </div>
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
            
//             const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
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
//         { title: "The Accordion Man's Journey", prompt: "Write a brief story from the perspective of a Creole accordion player traveling up the Mississippi River, describing the music he plays and how it's received by the blues musicians he meets in the Delta." },
//         { title: "The 'Spanish Tinge'", prompt: "Describe a night at a juke joint where a visiting musician with a Creole influence plays, and how the local Delta blues players react to the new rhythms and sounds." },
//         { title: "A Song from the Bayou", prompt: "Imagine a scene on a riverboat where an itinerant Creole musician plays a soulful 'la-la' song. Describe the atmosphere and the emotions the music evokes in the listeners." },
//         { title: "Jelly Roll's Lesson", prompt: "Write a short, imagined monologue from Jelly Roll Morton, explaining to a young musician why the 'Spanish tinge' is the secret ingredient that turns a simple tune into real jazz and blues." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-purple-400 mb-4" />
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
//     <footer className="bg-gray-900 text-center p-8 text-gray-400 border-t border-gray-700">
//         <p>A story of cultural exchange, musical innovation, and enduring influence.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <CulturalFlowSection />
//       <MusicalExchangeSection />
//       <AIStorytellerSection />
//       <Footer />
//     </main>
//   );
// }
