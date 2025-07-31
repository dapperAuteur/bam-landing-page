// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Utensils, Users, Sparkles, Wheat, School, ArrowRight, ArrowLeft } from 'lucide-react';

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
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-amber-900/80 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <Utensils size={48} className="mx-auto text-amber-300 mb-4" />
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-400">
//         A Fleeting Presence, A Lasting Flavor
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         The Mexican-American Experience in the 1932 Mississippi Delta
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-amber-200">
//         <span>A Story of Labor, Food, and Resilience in the Crucible</span>
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: Journey Timeline Section
// const JourneyTimelineSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//         <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12">
//                 <h2 className="text-4xl font-bold mb-4">The Cotton Harvest Trail</h2>
//                 <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                     Recruited from Texas and Mexico, the journey to the Delta was driven by the promise of work, but their presence was as seasonal as the crop itself.
//                 </p>
//             </div>
//             <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
//                 <div className="flex flex-col items-center">
//                     <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-amber-500/50 mb-4">
//                         <Users size={40} className="text-amber-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold">Recruitment</h3>
//                     <p className="text-gray-400 mt-1">1920s</p>
//                 </div>
//                 <div className="hidden md:block text-amber-500">
//                     <ArrowRight size={48} />
//                 </div>
//                 <div className="flex flex-col items-center">
//                     <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-amber-500/50 mb-4">
//                         <Wheat size={40} className="text-amber-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold">Seasonal Labor</h3>
//                     <p className="text-gray-400 mt-1">1920s - 1932</p>
//                 </div>
//                  <div className="hidden md:block text-amber-500">
//                     <ArrowRight size={48} />
//                 </div>
//                  <div className="flex flex-col items-center">
//                     <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-amber-500/50 mb-4">
//                         <ArrowLeft size={40} className="text-amber-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold">Departure</h3>
//                     <p className="text-gray-400 mt-1">1932</p>
//                 </div>
//             </div>
//              <p className="text-center text-gray-400 max-w-2xl mx-auto mt-8">
//                 When the price of cotton collapsed during the Great Depression, the work vanished. Abandoned by the planters who recruited them, most families were forced to finance their own departure.
//             </p>
//         </div>
//     </AnimatedSection>
// );

// // COMPONENT: Tamale Legacy Section
// const TamaleLegacySection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//         <div className="max-w-4xl mx-auto p-8 bg-gray-700/50 rounded-lg border border-amber-500/30">
//             <div className="text-center">
//                  <Utensils size={48} className="mx-auto text-amber-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">The Birth of the Delta Hot Tamale</h2>
//                 <p className="text-lg text-gray-300 mb-6">
//                     The most enduring legacy of this transient community is a culinary one, born from the shared hardship of the cotton fields.
//                 </p>
//                 <p className="text-gray-400 text-left">
//                     In a remarkable moment of cultural exchange, Mexican laborers shared their tradition of making tamales with their African-American counterparts. Black cooks adapted the recipe to the ingredients at hand, using cornmeal instead of masa, filling them with seasoned pork, and simmering them in a spicy broth rather than steaming them. The result was a smaller, spicier, and moister creation—the Delta hot tamale—an iconic food immortalized in blues songs and beloved to this day.
//                 </p>
//             </div>
//         </div>
//     </AnimatedSection>
// );

// // COMPONENT: Social Context Section
// const SocialContextSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//         <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12">
//                 <h2 className="text-4xl font-bold mb-4">Life "In-Between"</h2>
//                 <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                     The Mexican-American community occupied a precarious and contested space within the Delta's rigid racial hierarchy.
//                 </p>
//             </div>
//             <div className="grid md:grid-cols-2 gap-8 text-left">
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-amber-300 mb-2">Contested Racial Status</h3>
//                     <p className="text-gray-400">Initially classified as "colored" alongside African Americans, their status was fluid. They were subjected to segregation but also fought back against it, creating a constant tension.</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-amber-300 mb-2">The Fight for Education</h3>
//                     <p className="text-gray-400">In 1926, the Bolivar County school board barred Mexican children from white schools. Community leaders, with help from the Mexican consulate, challenged the ruling, highlighting their refusal to passively accept Jim Crow laws.</p>
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
//         { title: "The Last Harvest", prompt: "Write a brief story from the perspective of a Tejano father in 1932, realizing the cotton price has collapsed and his family must now find a way to leave the Delta." },
//         { title: "A Taste of Home", prompt: "Imagine a Tejano family in a Delta sharecropper's shack in 1932. Describe them making tamales and the memories of Texas that the food evokes." },
//         { title: "The School Board Fight", prompt: "Describe the determination of a Mexican-American parent preparing to challenge the school board's decision to bar their children from the white school." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-amber-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">Voices from the Fields</h2>
//                 <p className="text-lg text-gray-300 mb-8">
//                     Click a prompt to ask our AI to tell you a story from this cultural crossroads.
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
//                     <div className="bg-gray-700/60 p-6 rounded-lg border border-amber-400/50 text-left whitespace-pre-wrap font-serif text-gray-300">
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
//         <p>A story of transient labor, cultural exchange, and an enduring culinary legacy.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <JourneyTimelineSection />
//       <TamaleLegacySection />
//       <SocialContextSection />
//       <AIStorytellerSection />
//       <Footer />
//     </main>
//   );
// }
