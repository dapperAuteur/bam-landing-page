// "use client"
// import React, { useState } from 'react';
// // Make sure to install lucide-react: npm install lucide-react
// import { Flame, Dumbbell, Zap, BrainCircuit, HeartPulse, Leaf, Fish, ShieldCheck, HelpCircle, X, Loader } from 'lucide-react';

// // --- Helper Components ---

// // Icon component for visual consistency
// const PillarIcon = ({ icon: Icon, color }) => (
//   <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${color}`}>
//     <Icon className="h-8 w-8 text-white" />
//   </div>
// );

// // Card component for different sections
// const InfoCard = ({ icon, title, children, color }) => (
//   <div className="transform rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
//     <div className="flex items-start gap-4">
//       <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${color}`}>
//         {icon}
//       </div>
//       <div>
//         <h3 className="text-xl font-bold text-gray-800">{title}</h3>
//         <div className="mt-2 text-gray-600">{children}</div>
//       </div>
//     </div>
//   </div>
// );

// // Modal for Gemini response
// const GeminiResponseModal = ({ isOpen, onClose, response, isLoading }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
//       <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl m-4">
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//           <X size={24} />
//         </button>
//         <div className="flex items-center gap-4 mb-4">
//             <BrainCircuit className="h-8 w-8 text-indigo-500" />
//             <h2 className="text-2xl font-bold text-gray-800">Longevity Insights</h2>
//         </div>
//         {isLoading ? (
//           <div className="flex justify-center items-center h-48">
//             <Loader className="animate-spin text-indigo-500" size={48} />
//           </div>
//         ) : (
//           <div className="prose max-w-none text-gray-700">{response}</div>
//         )}
//       </div>
//     </div>
//   );
// };


// // --- Main App Component ---

// export default function App() {
//   const [userInput, setUserInput] = useState('');
//   const [geminiResponse, setGeminiResponse] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // This function simulates a call to the Gemini API.
//   // In a real application, you would replace this with an actual fetch call.
//   const handleAskGemini = async (e) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;

//     setIsModalOpen(true);
//     setIsLoading(true);

//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 1500));

//     let responseText = "I'm sorry, I can only answer questions related to the longevity topics in the infographic, such as HIIT, strength training, or nutrition. Please try another question.";
//     const prompt = userInput.toLowerCase();

//     if (prompt.includes('hiit') || prompt.includes('interval')) {
//         responseText = (
//             <>
//                 <h4 className="font-bold">Sample HIIT Workout Plan:</h4>
//                 <p>High-Intensity Interval Training is a powerful tool. Here’s a simple and effective routine you can do with running:</p>
//                 <ul className="list-disc pl-5 space-y-2">
//                     <li><strong>Warm-up:</strong> 5-10 minutes of light jogging.</li>
//                     <li><strong>Intervals (Repeat 8 times):</strong>
//                         <ul className="list-disc pl-5 mt-1">
//                            <li><strong>30 seconds:</strong> Run at a hard, near-maximum effort.</li>
//                            <li><strong>60 seconds:</strong> Walk or jog very slowly to recover.</li>
//                         </ul>
//                     </li>
//                     <li><strong>Cool-down:</strong> 5-10 minutes of walking and stretching.</li>
//                 </ul>
//                 <p className="mt-4 text-sm text-gray-500"><strong>Important:</strong> Always consult a healthcare professional before starting a new intense exercise program.</p>
//             </>
//         );
//     } else if (prompt.includes('strength') || prompt.includes('muscle')) {
//         responseText = (
//             <>
//                 <h4 className="font-bold">Key Compound Strength Exercises:</h4>
//                 <p>To build and maintain functional strength, focus on compound movements that work multiple muscle groups at once. Aim for 2-3 sessions per week.</p>
//                 <ul className="list-disc pl-5 space-y-2">
//                     <li><strong>Squats:</strong> Essential for lower body strength and stability.</li>
//                     <li><strong>Deadlifts:</strong> A full-body movement excellent for posterior chain (back, glutes, hamstrings).</li>
//                     <li><strong>Overhead Press:</strong> Builds shoulder strength and core stability.</li>
//                     <li><strong>Rows (e.g., Bent-Over Rows):</strong> Crucial for back strength and posture.</li>
//                     <li><strong>Bench Press or Push-ups:</strong> Targets chest, shoulders, and triceps.</li>
//                 </ul>
//             </>
//         );
//     } else if (prompt.includes('protein')) {
//         responseText = (
//              <>
//                 <h4 className="font-bold">Optimizing Protein Intake:</h4>
//                 <p>For active individuals, aiming for <strong>1.2 to 1.6 grams of protein per kilogram of body weight</strong> is ideal. Spreading this intake throughout the day enhances muscle repair and growth.</p>
//                 <h5 className="font-semibold mt-4">Excellent Protein Sources:</h5>
//                 <ul className="list-disc pl-5 space-y-2">
//                     <li><strong>Animal-based:</strong> Lean chicken breast, fish (especially salmon), eggs, Greek yogurt.</li>
//                     <li><strong>Plant-based:</strong> Lentils, chickpeas, tofu, edamame, quinoa, nuts, and seeds.</li>
//                 </ul>
//             </>
//         );
//     }

//     setGeminiResponse(responseText);
//     setIsLoading(false);
//   };


//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       <div className="container mx-auto px-4 py-12">

//         {/* --- Header --- */}
//         <header className="text-center mb-16">
//           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800">
//             Your Longevity Blueprint
//           </h1>
//           <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
//             An interactive guide to blending athletic performance with the science of aging for a high-performance century.
//           </p>
//         </header>

//         {/* --- Pillars of Longevity Fitness --- */}
//         <section className="mb-20">
//           <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">The 3 Pillars of Longevity Fitness</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <InfoCard title="Endurance Training" icon={<HeartPulse className="h-6 w-6 text-white" />} color="bg-red-500">
//               <p>Builds a powerful cardiovascular base to reduce disease risk. A high VO2 max is a key predictor of a long, healthy life.</p>
//             </InfoCard>
//             <InfoCard title="Strength Training" icon={<Dumbbell className="h-6 w-6 text-white" />} color="bg-blue-500">
//               <p>Combats age-related muscle loss (sarcopenia), preserving metabolic health, bone density, and functional power.</p>
//             </InfoCard>
//             <InfoCard title="High-Intensity (HIIT)" icon={<Zap className="h-6 w-6 text-white" />} color="bg-yellow-500">
//               <p>Can reverse cellular aging in muscles and provides significant cardiovascular benefits in less time.</p>
//             </InfoCard>
//           </div>
//         </section>

//         {/* --- Nutritional Strategy --- */}
//         <section className="mb-20">
//             <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Evidence-Based Nutritional Strategy</h2>
//             <div className="grid md:grid-cols-3 gap-8">
//                 <InfoCard title="Optimize Protein" icon={<Flame className="h-6 w-6 text-white" />} color="bg-orange-500">
//                     <p>Consume 1.2-1.6g per kg of body weight, spaced throughout the day, to fight anabolic resistance and preserve muscle.</p>
//                 </InfoCard>
//                 <InfoCard title="Focus on Quality" icon={<Leaf className="h-6 w-6 text-white" />} color="bg-green-500">
//                     <p>Prioritize anti-inflammatory whole foods: colorful vegetables, legumes, nuts, and healthy fats like olive oil.</p>
//                 </InfoCard>
//                 <InfoCard title="Blue Zone Principles" icon={<Fish className="h-6 w-6 text-white" />} color="bg-teal-500">
//                     <p>Adopt a plant-forward diet that is low in processed foods to model the habits of the world&apos;s longest-lived people.</p>
//                 </InfoCard>
//             </div>
//         </section>

//         {/* --- Gemini Interactive Section --- */}
//         <section className="bg-white rounded-2xl p-8 shadow-xl mb-20 border border-gray-100">
//             <div className="text-center">
//                 <BrainCircuit className="mx-auto h-12 w-12 text-indigo-500" />
//                 <h2 className="text-3xl font-bold mt-4 text-gray-800">Ask a Longevity Question</h2>
//                 <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
//                     Need a sample workout or food ideas? Ask a question based on the topics above.
//                 </p>
//             </div>
//             <form onSubmit={handleAskGemini} className="mt-8 max-w-xl mx-auto flex gap-2">
//                 <input
//                     type="text"
//                     value={userInput}
//                     onChange={(e) => setUserInput(e.target.value)}
//                     placeholder="e.g., 'Give me a sample HIIT workout'"
//                     className="w-full rounded-lg border-gray-300 px-4 py-3 text-lg focus:border-indigo-500 focus:ring-indigo-500"
//                 />
//                 <button type="submit" className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300" disabled={isLoading}>
//                     Ask
//                 </button>
//             </form>
//         </section>


//         {/* --- Actionable Recommendations --- */}
//         <section>
//           <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Your 5 Actionable Recommendations</h2>
//           <div className="space-y-4 max-w-3xl mx-auto">
//              <div className="flex items-start gap-4 p-4 rounded-lg bg-white shadow-md">
//                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
//                 <p className="text-gray-700"><strong className="text-gray-900">Prioritize Strength:</strong> Schedule 2-3 full-body resistance training sessions per week. This is non-negotiable.</p>
//              </div>
//              <div className="flex items-start gap-4 p-4 rounded-lg bg-white shadow-md">
//                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">2</div>
//                 <p className="text-gray-700"><strong className="text-gray-900">Integrate HIIT:</strong> Swap 1-2 cardio sessions for high-intensity intervals to boost cellular health.</p>
//              </div>
//              <div className="flex items-start gap-4 p-4 rounded-lg bg-white shadow-md">
//                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">3</div>
//                 <p className="text-gray-700"><strong className="text-gray-900">Optimize Protein Intake:</strong> Aim for 1.2-1.6 g/kg of body weight daily, spread across meals.</p>
//              </div>
//              <div className="flex items-start gap-4 p-4 rounded-lg bg-white shadow-md">
//                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">4</div>
//                 <p className="text-gray-700"><strong className="text-gray-900">Conduct a &quot;Quality&quot; Audit:</strong> Maximize whole foods and minimize processed items in your diet.</p>
//              </div>
//              <div className="flex items-start gap-4 p-4 rounded-lg bg-white shadow-md">
//                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">5</div>
//                 <p className="text-gray-700"><strong className="text-gray-900">Recovery is Training:</strong> Prioritize 7-9 hours of quality sleep nightly for optimal repair and growth.</p>
//              </div>
//           </div>
//         </section>

//       </div>
//       <GeminiResponseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} response={geminiResponse} isLoading={isLoading} />
//     </div>
//   );
// }
