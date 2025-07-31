// "use client"

// import React, { useState, useEffect, useRef } from 'react';
// import { Music, Users, Sparkles, Drama, Landmark, Hospital, BookOpen, Scissors } from 'lucide-react';

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
//   <header className="min-h-screen bg-gradient-to-b from-gray-900 via-sky-900/80 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
//     <div className="absolute inset-0 bg-grid-white/5"></div>
//     <div className="relative z-10">
//       <Music size={48} className="mx-auto text-sky-300 mb-4" />
//       <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-400">
//         The Soul of the Soil
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
//         The African-American Experience in the 1932 Mississippi Delta
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4 text-lg text-sky-200">
//         <span>Forging a Culture of Resilience in the Crucible of Jim Crow</span>
//       </div>
//     </div>
//   </header>
// );

// // COMPONENT: Blues Section
// const BluesSection = () => (
//     <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//         <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12">
//                 <h2 className="text-4xl font-bold mb-4">From Field Holler to Juke Joint</h2>
//                 <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                     The Delta blues evolved from the unaccompanied work songs of the cotton fields into the most significant American art form of the 20th century, cultivated in the subversive spaces of the juke joint.
//                 </p>
//             </div>
//             <div className="grid md:grid-cols-3 gap-8 text-center">
//                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-sky-300 mb-2">The Crossroads Legend</h3>
//                     <p className="text-gray-400">Clarksdale became the heart of the blues, mythologized as the spot where Robert Johnson traded his soul for guitar mastery, capturing the music's otherworldly power.</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-sky-300 mb-2">The Juke Joint</h3>
//                     <p className="text-gray-400">Informal, Black-owned spaces like the Red Top Lounge were acts of cultural resistance, where the community could gather, socialize, and listen to music on their own terms.</p>
//                 </div>
//                 <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
//                     <h3 className="text-xl font-semibold text-sky-300 mb-2">The Great Migration's Soundtrack</h3>
//                     <p className="text-gray-400">Recordings of artists like Muddy Waters on the Stovall Plantation propelled the music north, where it would electrify and transform into the sound of modern America.</p>
//                 </div>
//             </div>
//         </div>
//     </AnimatedSection>
// );

// // COMPONENT: Enterprise Card
// const EnterpriseCard = ({ icon, title, description }) => (
//     <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-sky-500/30 hover:border-sky-400 transition-all duration-300 shadow-lg flex items-start gap-4">
//         <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-sky-900/50 border border-sky-500/30">
//             {icon}
//         </div>
//         <div>
//             <h3 className="text-xl font-bold text-sky-300">{title}</h3>
//             <p className="text-gray-300 mt-2">{description}</p>
//         </div>
//     </div>
// );

// // COMPONENT: Parallel World Section
// const ParallelWorldSection = () => {
//     const enterprises = [
//         {
//             icon: <Hospital size={24} className="text-sky-300"/>,
//             title: 'Hospitals & Pharmacies',
//             description: 'Barred from white facilities, the community built its own, like the G. T. Thomas Afro-American Hospital, providing spaces where Black doctors could practice and patients could receive care.'
//         },
//         {
//             icon: <Scissors size={24} className="text-sky-300"/>,
//             title: 'Barbershops & Funeral Homes',
//             description: 'These businesses were cornerstones of the community, serving as social and political gathering spots and providing dignified services denied by the dominant society.'
//         },
//         {
//             icon: <BookOpen size={24} className="text-sky-300"/>,
//             title: 'The Myrtle Hall Library',
//             description: 'After being excluded from the white-run Carnegie Library, Black citizens successfully petitioned for their own, opening The Myrtle Hall Library for Negroes in 1930.'
//         },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
//             <div className="max-w-6xl mx-auto">
//                 <div className="text-center mb-12">
//                     <Users size={48} className="mx-auto text-sky-400 mb-4" />
//                     <h2 className="text-4xl font-bold mb-4">A World Within a World</h2>
//                     <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                         In the face of total segregation, a resilient class of Black entrepreneurs and leaders built a self-sufficient parallel society with its own essential institutions.
//                     </p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                     {enterprises.map(e => <EnterpriseCard key={e.title} {...e} />)}
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
//         { title: "A Night at the Juke Joint", prompt: "Tell a short, first-person story of a sharecropper experiencing a Saturday night at a Clarksdale juke joint in 1932. Describe the music, the atmosphere, and the feeling of freedom." },
//         { title: "The Pharmacist's View", prompt: "Write a brief story from the perspective of a Black pharmacist in the Delta, describing the role their drugstore plays as a community hub beyond just medicine." },
//         { title: "A WPA Interview", prompt: "Imagine you are an elderly, formerly enslaved person in 1936 Mississippi, telling your story to a WPA interviewer. Describe your feelings about sharing your memories of bondage." },
//         { title: "The Barber's Chair", prompt: "Describe the conversations and sense of community inside a Black-owned barbershop in 1932 Clarksdale, where men could speak freely away from white supervision." },
//     ];

//     return (
//         <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
//             <div className="max-w-4xl mx-auto text-center">
//                 <Sparkles size={48} className="mx-auto text-sky-400 mb-4" />
//                 <h2 className="text-4xl font-bold mb-4">Delta Stories AI</h2>
//                 <p className="text-lg text-gray-300 mb-8">
//                     Click a prompt to ask our AI to tell you a story from the heart of the African-American experience.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     {prompts.map((p) => (
//                         <button
//                             key={p.title}
//                             onClick={() => getStory(p.prompt)}
//                             disabled={isLoading}
//                             className="bg-sky-600/80 hover:bg-sky-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
//                         >
//                            <Sparkles size={18} /> {p.title}
//                         </button>
//                     ))}
//                 </div>

//                 {isLoading && (
//                      <div className="flex justify-center items-center p-8">
//                         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-400"></div>
//                      </div>
//                 )}
//                 {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}
//                 {story && (
//                     <div className="bg-gray-800/60 p-6 rounded-lg border border-sky-400/50 text-left whitespace-pre-wrap font-serif text-gray-300">
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
//         <p>A story of pain, creativity, and the enduring power of the human spirit.</p>
//         <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
//     </footer>
// );


// // MAIN APP COMPONENT
// export default function App() {
//   return (
//     <main className="bg-gray-900 font-sans">
//       <HeroSection />
//       <BluesSection />
//       <ParallelWorldSection />
//       <AIStorytellerSection />
//       <Footer />
//     </main>
//   );
// }
