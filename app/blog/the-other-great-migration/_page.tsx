// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Users, Footprints, Building, Mountain, Sparkles, Wind, Waves, Ship } from 'lucide-react';

// // HELPER: Custom hook for scroll animations
// const useOnScreen = (options: IntersectionObserverInit) => {
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
// const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => { // eslint-disable-line no-unused-vars
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
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-emerald-900 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <Users size={48} className="mx-auto text-emerald-300 mb-4" />
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-green-400">
//         The Other Great Migration
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         An African American Journey Along the Arkansas River
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-emerald-200">
//         <Wind size={24} />
//         <span>From Bondage in the Delta to Freedom in the Rockies</span>
//         <Mountain size={24} />
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: Journey Timeline Event
// const JourneyEvent = ({ icon, title, era, text, align = 'left' }) => (
//     <div className={`flex items-start w-full my-8 md:my-0 ${align === 'right' ? 'md:flex-row-reverse' : 'flex-row'}`}>
//         <div className={`w-full md:w-5/12 ${align === 'right' ? 'md:text-right' : 'md:text-left'}`}>
//             <div className={`p-6 bg-gray-800/70 backdrop-blur-sm border border-emerald-500/30 rounded-lg`}>
//                 <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">{era}</p>
//                 <h3 className="text-2xl font-bold text-white mt-1">{title}</h3>
//                 <p className="text-gray-300 mt-3">{text}</p>
//             </div>
//         </div>
//         <div className="hidden md:flex w-2/12 items-center justify-center">
//              <div className="relative z-10 w-20 h-20 bg-gray-900 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto">
//                 {icon}
//             </div>
//         </div>
//          <div className="w-full md:w-5/12">
//             {/* Spacer for alignment */}
//         </div>
//     </div>
// );


// // COMPONENT: Journey Section
// const JourneySection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-900">
//         <div className="max-w-5xl mx-auto relative">
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-600 via-emerald-800 to-emerald-900 rounded-full hidden md:block"></div>
            
//             <JourneyEvent
//                 align="left"
//                 era="1720s - 1865"
//                 icon={<Ship size={40} className="text-emerald-300" />}
//                 title="Bondage in the Delta"
//                 text="The journey begins in the brutal reality of the cotton kingdom. Enslaved people were forced to labor on plantations in the fertile delta of Arkansas, forming resilient communities in the face of dehumanization."
//             />

//             <JourneyEvent
//                 align="right"
//                 era="1879 - 1890s"
//                 icon={<Footprints size={40} className="text-emerald-300" />}
//                 title="The 'Exodus' to the Plains"
//                 text="After the Civil War, thousands of 'Exodusters' migrated upriver, seeking refuge and self-determination in Kansas and Indian Territory, viewing the plains as a 'Promised Land' away from Southern oppression."
//             />

//             <JourneyEvent
//                 align="left"
//                 era="1865 - 1920"
//                 icon={<Building size={40} className="text-emerald-300" />}
//                 title="All-Black Towns"
//                 text="This migration led to the founding of dozens of all-Black towns in the river's watershed, such as Boley and Langston, Oklahoma—havens of Black enterprise, safety, and political autonomy."
//             />

//             <JourneyEvent
//                 align="right"
//                 era="1906 - 1921"
//                 icon={<Sparkles size={40} className="text-emerald-300" />}
//                 title='"Black Wall Street"'
//                 text="The Greenwood District in Tulsa, near the river, became the most prosperous Black community in the U.S. Founded by O.W. Gurley, a son of the Arkansas valley, it was a beacon of Black success before the 1921 Race Massacre."
//             />
            
//             <JourneyEvent
//                 align="left"
//                 era="1860s - 1890s"
//                 icon={<Mountain size={40} className="text-emerald-300" />}
//                 title="Pioneers in the High Country"
//                 text="The current of migration reached the river's source. Black pioneers like William Jefferson Hardin sought opportunity in Colorado's mining camps, with Hardin being elected mayor of Leadville."
//             />
//         </div>
//     </AnimatedSection>
// );


// // COMPONENT: Gemini API Powered AI Storyteller
// const AIStorytellerSection = () => {
//     const [story, setStory] = useState('');
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [error, setError] = useState('');

//     const getStory = async (prompt: string) => {
//         setIsLoading(true);
//         setError('');
//         setStory('');

//     try { 
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
//         } catch (err: any) {
//             console.error(err);
//             setError(err.message || "An error occurred while fetching the story.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const prompts = [
//         { title: "An Exoduster's Journey", prompt: "Tell a short, first-person story of an African American family traveling up the Arkansas River from Arkansas to Kansas in 1879 as 'Exodusters', describing their hopes and hardships." },
//         { title: "Founding of Boley", prompt: "Describe the atmosphere and sense of purpose during the founding of an all-Black town like Boley, Oklahoma, focusing on the collective effort to build a new community." },
//         { title: "A Day on Black Wall Street", prompt: "Write a vivid description of a bustling afternoon in the Greenwood District of Tulsa before 1921, highlighting the variety of businesses and the sense of prosperity." },
//         { title: "A Miner in Leadville", prompt: "Create a short biographical sketch of an African American pioneer seeking their fortune in the silver mines of Leadville, Colorado, and their life in the high-country camp." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-emerald-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">Voices of the River</h2>
//                 <p className="text-lg text-gray-300 mb-8">
//                     Click a prompt to ask our AI to tell you a story from this historic journey.
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
//     <footer className="bg-gray-900 text-center p-8 text-gray-400">
//         <p>A story of resilience, migration, and the pursuit of freedom.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <JourneySection />
//       <AIStorytellerSection />
//       <Footer />
//     </main>
//   );
// }
