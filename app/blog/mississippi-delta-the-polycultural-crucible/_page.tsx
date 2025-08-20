// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Music, Feather, ShoppingCart, Wheat, Users, Sparkles, Drama, Landmark, Utensils } from 'lucide-react';

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
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <Drama size={48} className="mx-auto text-amber-300 mb-4" />
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400">
//         The Polycultural Crucible
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         Clarksdale, Mississippi, 1932: Race, Enterprise, and Art in the Delta
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-amber-200">
//         <span>At the Crossroads of the Great Depression & Jim Crow</span>
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: Community Card
// const CommunityCard = ({ icon, title, description, businesses, arts, color }) => (
//     <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border ${color.border} shadow-lg overflow-hidden flex flex-col`}>
//         <div className={`p-6 border-b ${color.border} bg-gradient-to-br ${color.gradient}`}>
//             <div className="flex items-center gap-4">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.bg}`}>
//                     {icon}
//                 </div>
//                 <h2 className={`text-3xl font-bold ${color.text}`}>{title}</h2>
//             </div>
//             <p className="text-gray-300 mt-3">{description}</p>
//         </div>
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
//             <div>
//                 <h3 className="font-semibold text-lg text-white mb-2">Notable Enterprises</h3>
//                 <ul className="list-disc list-inside text-gray-400 space-y-1">
//                     {businesses.map(b => <li key={b}>{b}</li>)}
//                 </ul>
//             </div>
//              <div>
//                 <h3 className="font-semibold text-lg text-white mb-2">Signature Art Forms</h3>
//                 <ul className="list-disc list-inside text-gray-400 space-y-1">
//                     {arts.map(a => <li key={a}>{a}</li>)}
//                 </ul>
//             </div>
//         </div>
//     </div>
// );

// // COMPONENT: Communities Section
// const CommunitiesSection = () => {
//     const communities = [
//         {
//             icon: <Music size={28} className="text-white"/>,
//             title: 'African-American',
//             description: 'The soul of the Delta, building a resilient parallel world against the backdrop of sharecropping and segregation.',
//             businesses: ['Juke Joints', 'Hospitals & Pharmacies', 'Funeral Homes', 'Barbershops'],
//             arts: ['Delta Blues Music', 'Visual Folk Art', 'WPA Slave Narratives'],
//             color: { text: 'text-sky-300', border: 'border-sky-500/30', bg: 'bg-sky-500', gradient: 'from-sky-900/30 to-gray-900' }
//         },
//         {
//             icon: <ShoppingCart size={28} className="text-white"/>,
//             title: 'Chinese-American',
//             description: 'Carving a strategic economic niche as merchants, navigating a precarious "in-between" status.',
//             businesses: ['Family Grocery Stores', 'Merchants\' Associations', 'Community Schools'],
//             arts: ['Cultural Preservation', 'Community Organizing'],
//             color: { text: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500', gradient: 'from-red-900/30 to-gray-900' }
//         },
//         {
//             icon: <Feather size={28} className="text-white"/>,
//             title: 'Native American (Choctaw)',
//             description: 'The dispossessed original inhabitants, preserving their identity through art while fighting for sovereignty.',
//             businesses: ['Sharecropping', 'Artisan Craft Sales'],
//             arts: ['River Cane Basketry', 'Traditional Dress & Beadwork', 'Ceremonial Music & Dance'],
//             color: { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500', gradient: 'from-emerald-900/30 to-gray-900' }
//         },
//         {
//             icon: <Utensils size={28} className="text-white"/>,
//             title: 'Mexican-American & Creole',
//             description: 'Transient laborers and cultural currents leaving a lasting, flavorful, and rhythmic mark on the Delta.',
//             businesses: ['Seasonal Farm Labor', 'Itinerant Musicians'],
//             arts: ['The Delta Hot Tamale', 'La-La Music / Early Zydeco'],
//             color: { text: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500', gradient: 'from-orange-900/30 to-gray-900' }
//         },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900">
//             <div className="max-w-7xl mx-auto">
//                  <div className="text-center mb-12">
//                     <Users size={48} className="mx-auto text-amber-400 mb-4" />
//                     <h2 className="text-4xl font-bold text-white mb-4">A Crucible of Communities</h2>
//                     <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                         In the shared space at the bottom of the economic ladder, diverse communities forged unique strategies for survival, creating a complex web of interdependence and cultural exchange.
//                     </p>
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {communities.map(c => <CommunityCard key={c.title} {...c} />)}
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
//         { title: "A Bluesman's Night", prompt: "Tell a short, first-person story of a blues musician playing in a Clarksdale juke joint in 1932, describing the atmosphere and the crowd." },
//         { title: "A Chinese Grocer's Ledger", prompt: "Write a brief story from the perspective of a Chinese grocer in the Delta, reflecting on the community they serve and the challenges of extending credit during the Depression." },
//         { title: "A Choctaw Basket Weaver", prompt: "Describe the process of weaving a river cane basket from the perspective of a Mississippi Choctaw woman in 1932, focusing on the meaning of the traditional patterns." },
//         { title: "The Tamale Vendor's Call", prompt: "Imagine a scene on a Delta plantation where a Mexican-American vendor is selling hot tamales to African-American field hands. Describe the interaction and the food." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-amber-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">Delta Stories AI</h2>
//                 <p className="text-lg text-gray-300 mb-8">
//                     Click a prompt to ask our AI to tell you a story from the heart of the crucible.
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
//     <footer className="bg-gray-900 text-center p-8 text-gray-400 border-t border-gray-700">
//         <p>A landscape of ruin that gave birth to immense cultural wealth.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <CommunitiesSection />
//       <AIStorytellerSection />
//       <Footer />
//     </main>
//   );
// }
