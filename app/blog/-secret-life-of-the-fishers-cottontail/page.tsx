/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables, TooltipItem, ChartType } from 'chart.js';
ChartJS.register(...registerables);

// Helper function to wrap long labels for charts
const wrapLabel = (label: string, maxLength = 16) => {
    if (typeof label !== 'string' || label.length <= maxLength) return label;
    const words = label.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length > maxLength && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine = (currentLine + ' ' + word).trim();
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine.trim());
    }
    return lines;
};

// interface TopicData {
//             diet: string;
//             predators: string;
//             nesting: string;
//             coexistence: string;
//             habitat: string;
//         };
const topicData = {
            diet: "A Cottontail's Seasonal Diet and the strategy of Coprophagy. In summer, they eat greens. In winter, they eat bark and twigs. They re-ingest special fecal pellets (cecotropes) to absorb more nutrients.",
            predators: "The Predator Gauntlet. Cottontails are a key food source for coyotes, foxes, hawks, and owls. Up to 80% of the population is lost to predation annually, which is why their high birth rate is so important.",
            nesting: "The secret life of a rabbit nest. A doe digs a shallow nest, visits only at dawn and dusk to avoid detection, and the kits are independent in just 4-5 weeks.",
            coexistence: "How gardeners can coexist with rabbits. Damage is a clean, 45-degree cut. They favor plants like tulips but avoid smelly or fuzzy plants. The best deterrents are exclusion (fencing) and habitat modification.",
            habitat: "Why suburbia is a rabbit paradise. They thrive in 'edge habitats' - open lawns for feeding right next to dense cover (shrubs, decks) for safety. Suburban yards perfectly mimic this."
        };
        type PodcastTopic = keyof typeof topicData;

// Main Infographic Component
export default function FishersRabbitInfographic() {
    const [modalState, setModalState] = useState({ isOpen: false, title: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [gardenProblem, setGardenProblem] = useState('');
    const [podcastTopic, setPodcastTopic] = useState<PodcastTopic>('diet');


    
    const dietChartRef = useRef<HTMLCanvasElement | null>(null);
    const predatorChartRef = useRef<HTMLCanvasElement | null>(null);
    const populationChartRef = useRef<HTMLCanvasElement | null>(null);

    // ChartJS Initialization Effect
    useEffect(() => {
        const universalTooltipCallback = {
            tooltip: {
                callbacks: {
                    title: function(tooltipItems: TooltipItem<ChartType>[]) {
                        const item = tooltipItems[0];
                        if (!item) {
                            return '';
                        }
                        const labels = item.chart.data.labels;
                        const dataIndex = item.dataIndex;
                        if (!labels || dataIndex === undefined || dataIndex >= labels.length) {
                            return '';
                        }
                        const label = labels[dataIndex];
                        return Array.isArray(label) ? label.join(' ') : String(label);
                    }
                }
            }
        };

        
        const dietCanvas = dietChartRef.current;
        const predatorCanvas = predatorChartRef.current;
        const populationCanvas = populationChartRef.current;

        let dietChartInstance: ChartJS | null = null, predatorChartInstance: ChartJS | null = null, populationChartInstance: ChartJS | null = null;

        if (dietCanvas) {
            dietChartInstance = new ChartJS(dietCanvas, { type: 'bar', data: { labels: ['Spring/Summer', 'Fall/Winter'], datasets: [{ label: 'Grasses & Greens', data: [60, 10], backgroundColor: '#99B898' }, { label: 'Woody Plants & Bark', data: [10, 65], backgroundColor: '#6C5B7B' }, { label: 'Other (Clover, Fruits, etc.)', data: [30, 25], backgroundColor: '#FECEA8' }] }, options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, title: { display: true, text: '% of Diet Composition' } } }, plugins: { ...universalTooltipCallback, title: { display: false }, legend: { position: 'bottom' } } } });
        }

        if (predatorCanvas) {
            const predatorLabels = ['Coyote', 'Red Fox', 'Hawks', 'Great Horned Owls', 'Domestic Dogs & Cats', 'Raccoons', 'Bobcat (Less Common)'].map(l => wrapLabel(l));
            predatorChartInstance = new ChartJS(predatorCanvas, { type: 'bar', data: { labels: predatorLabels, datasets: [{ label: 'Commonality / Impact', data: [95, 90, 85, 80, 78, 60, 30], backgroundColor: ['#355C7D', '#6C5B7B', '#C06C84', '#E84A5F', '#FF847C', '#FECEA8', '#99B898' ], borderColor: '#ffffff', borderWidth: 2 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { display: false, grid: { display: false } }, y: { grid: { display: false }, ticks: { font: { size: 12 } } } }, plugins: { ...universalTooltipCallback, legend: { display: false }, title: { display: false } } } });
        }

        if (populationCanvas) {
            populationChartInstance = new ChartJS(populationCanvas, { type: 'line', data: { labels: ['Yr 1', 'Yr 2', 'Yr 3', 'Yr 4', 'Yr 5 (Peak)', 'Yr 6', 'Yr 7', 'Yr 8 (Low)', 'Yr 9', 'Yr 10'], datasets: [{ label: 'Relative Population Size', data: [3, 4.5, 7, 9, 10, 7.5, 5, 2.5, 4, 6], fill: true, borderColor: '#6C5B7B', backgroundColor: 'rgba(108, 91, 123, 0.2)', tension: 0.4, pointBackgroundColor: '#6C5B7B', pointRadius: 5, pointHoverRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Relative Abundance Index' } }, x: { grid: { display: false } } }, plugins: { ...universalTooltipCallback, legend: { display: false }, title: { display: false } } } });
        }

        return () => {
            if (dietChartInstance) dietChartInstance.destroy();
            if (predatorChartInstance) predatorChartInstance.destroy();
            if (populationChartInstance) populationChartInstance.destroy();
        };
    }, []);

    const callGeminiAPI = async (prompt: string) => {
        setIsLoading(true);
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const apiKey = GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                setModalState(prev => ({ ...prev, content: result.candidates[0].content.parts[0].text }));
            } else {
                setModalState(prev => ({ ...prev, content: "Sorry, I couldn't generate a response. The model returned empty content." }));
            }
        } catch (error: unknown) {
            console.error("Gemini API Error:", error);
            let errorMessage = "An unknown error occurred. Please check the console for details.";
            if (error instanceof Error) {
                errorMessage = `An error occurred: ${error.message}. Please check the console for details.`;
            }
            setModalState(prev => ({ ...prev, content: errorMessage }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGardenAdvice = () => {
        if (!gardenProblem.trim()) {
            alert('Please describe your garden problem first.');
            return;
        }
        setModalState({ isOpen: true, title: 'Your Personalized Garden Plan', content: '' });
        const prompt = `You are an expert in humane wildlife management for suburban gardens in the American Midwest, specializing in Eastern Cottontails. A user in Fishers, Indiana, has a problem. Based on the following established principles, generate a friendly, step-by-step action plan formatted in HTML with headings and lists. The plan must ONLY include humane methods.
        
        Principles:
        1. Exclusion is most effective (e.g., 2ft tall chicken wire, buried).
        2. Habitat modification is good (e.g., removing brush piles, tall weeds near gardens).
        3. Repellents are least reliable but can be part of a strategy.
        4. Planting rabbit-resistant plants (strong scents like herbs/marigolds; fuzzy textures like lamb's ear; toxic plants like daffodils) is a good long-term strategy.
        5. Rabbits favor tender plants (beans, peas, tulips) and bark of young trees.
        
        User's specific problem: "${gardenProblem}"`;
        callGeminiAPI(prompt);
    };

    const handlePodcastScript = () => {
        if (!podcastTopic) {
            alert('Please select a topic first.');
            return;
        } else {
            console.log('podcastTopic :>> ', podcastTopic);
        
        }
        setModalState({ isOpen: true, title: 'Your Podcast Script Segment', content: '' });
        const prompt = `You are the host of a friendly, engaging nature podcast called 'Suburban Wildlife'. Your tone is curious and educational. Based *only* on the following information, write a short, conversational podcast script (about 150-200 words). Format it with HTML paragraphs. Start with a hook to grab the listener's attention and make it sound natural, not like a list.
        
        Topic Information: "${topicData[podcastTopic]}"`;
        callGeminiAPI(prompt);
    };

    


    const closeModal = () => setModalState({ isOpen: false, title: '', content: '' });

    return (
        <div className="bg-[#F8F5F2] text-gray-700 antialiased font-sans">
            {/* Modal */}
            {modalState.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full relative">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h3 className="text-2xl font-bold text-[#2A3F54] mb-4 font-serif">{modalState.title}</h3>
                        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 max-h-[60vh] overflow-y-auto pr-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="loader border-4 border-gray-200 border-t-4 border-t-[#6C5B7B] rounded-full w-12 h-12 animate-spin"></div>
                                </div>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: modalState.content }} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                <header className="text-center my-12">
                    <h1 className="text-4xl md:text-6xl font-black text-[#4A4A4A] mb-4 font-serif">The Suburban Cottontail</h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Unseen dramas, surprising behaviors, and complex survival strategies unfold every day in the backyards of Fishers, Indiana.</p>
                </header>

                {/* Hero Stats */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-b-8 border-[#99B898]">
                        <h3 className="text-6xl md:text-7xl font-black text-[#2A3F54] font-serif leading-none">11</h3>
                        <p className="text-xl font-semibold text-gray-800 mt-2">Month Average Lifespan</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-b-8 border-[#FECEA8]">
                        <h3 className="text-6xl md:text-7xl font-black text-[#2A3F54] font-serif leading-none">18</h3>
                        <p className="text-xl font-semibold text-gray-800 mt-2">MPH Top Speed</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border-b-8 border-[#FF847C]">
                        <h3 className="text-6xl md:text-7xl font-black text-[#2A3F54] font-serif leading-none">~25</h3>
                        <p className="text-xl font-semibold text-gray-800 mt-2">Offspring Per Year</p>
                    </div>
                </section>

                <main className="space-y-16">
                    {/* A Day in the Life */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-center mb-8 text-[#2A3F54] font-serif">A Day in the Life</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="font-bold text-xl mb-2 text-gray-800 font-serif">The Cottontail&apos;s Shifting Menu</h3>
                                <p className="text-sm text-gray-600 mb-4">A rabbit&apos;s diet in Fishers is a tale of two seasons. Summer brings lush greens, while winter forces a switch to woody browse—a shift that often brings them into conflict with homeowners.</p>
                                <div className="h-[350px] max-h-[450px] w-full max-w-[600px] mx-auto"><canvas ref={dietChartRef}></canvas></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-4 text-gray-800 font-serif">The Nesting Cycle</h3>
                                <p className="text-sm text-gray-600 mb-4">A mother cottontail only visits her nest at dawn and dusk to avoid attracting predators, an instinct that often leads humans to mistakenly believe a nest is abandoned.</p>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 bg-[#E84A5F] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                                        <div><h4 className="font-semibold">Nest Creation</h4><p className="text-sm text-gray-600">A doe digs a shallow depression and lines it with grass and fur.</p></div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 bg-[#FF847C] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                                        <div><h4 className="font-semibold">Birth & Early Life</h4><p className="text-sm text-gray-600">4-6 blind, hairless kits are born and develop rapidly.</p></div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 bg-[#FECEA8] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                                        <div><h4 className="font-semibold">Independence</h4><p className="text-sm text-gray-600">Kits are weaned and independent in just 4 to 5 weeks.</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Coexistence */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-center mb-8 text-[#2A3F54] font-serif">Backyard Coexistence</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="font-bold text-xl mb-2 text-gray-800 font-serif">✨ Personalized Garden Advisor</h3>
                                <p className="text-sm text-gray-600 mb-4">Describe your specific rabbit problem below, and our AI assistant will generate a custom, humane action plan.</p>
                                <textarea value={gardenProblem} onChange={(e) => setGardenProblem(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-4 h-24 focus:ring-2 focus:ring-[#6C5B7B] focus:border-transparent" placeholder="e.g., 'Rabbits are eating my bean sprouts and chewing the bark of my new apple tree.'"></textarea>
                                <button onClick={handleGardenAdvice} className="w-full bg-[#6C5B7B] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#355C7D] transition-colors flex items-center justify-center">Get My Action Plan</button>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-2 text-gray-800 font-serif">Hierarchy of Humane Deterrents</h3>
                                <p className="text-sm text-gray-600 mb-4">Lasting solutions focus on making plants inaccessible or the area uninviting.</p>
                                <div className="w-full max-w-sm mx-auto space-y-1 text-center font-semibold text-white">
                                    <div className="bg-[#C06C84] p-3 rounded-lg shadow-md"><h4 className="text-lg">Most Effective: Exclusion</h4><p className="text-sm font-normal">Use 2ft tall chicken wire fencing, buried slightly.</p></div>
                                    <div className="text-center text-gray-400 text-2xl">▼</div>
                                    <div className="bg-[#6C5B7B] p-3 rounded-lg shadow-md"><h4 className="text-lg">Good: Habitat Modification</h4><p className="text-sm font-normal">Remove brush piles & tall weeds near gardens.</p></div>
                                    <div className="text-center text-gray-400 text-2xl">▼</div>
                                    <div className="bg-[#355C7D] p-3 rounded-lg shadow-md"><h4 className="text-lg">Least Reliable: Repellents</h4><p className="text-sm font-normal">Can work temporarily, but require frequent reapplication.</p></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Ecology */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-center mb-8 text-[#2A3F54] font-serif">A Life on the Edge</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="font-bold text-xl mb-2 text-gray-800 font-serif">The Predator Gauntlet</h3>
                                <p className="text-sm text-gray-600 mb-4">Cottontails are a vital food source for a wide range of animals in Fishers, from coyotes to hawks. This constant pressure shapes their very existence.</p>
                                <div className="h-[350px] max-h-[450px] w-full max-w-[600px] mx-auto"><canvas ref={predatorChartRef}></canvas></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl mb-2 text-gray-800 font-serif">The &quot;Edge Habitat&quot; Advantage</h3>
                                <p className="text-sm text-gray-600 mb-4">Suburban yards are ideal for cottontails because they provide &quot;edges&quot;—open lawns for feeding right next to protective cover like shrubs and decks for a quick escape.</p>
                                <div className="w-full aspect-video bg-[#E8E3DD] rounded-lg p-4 flex items-center justify-center relative">
                                    <div className="absolute left-4 top-4 bottom-4 w-1/2 bg-[#A8D8B9] rounded-lg flex flex-col items-center justify-center p-2 shadow-inner"><span className="text-3xl">☘️</span><p className="font-bold text-center text-[#3B6E4C]">Open Lawn<br/>(Foraging)</p></div>
                                    <div className="absolute right-4 top-4 bottom-4 w-1/2 bg-[#776B5D] rounded-lg flex flex-col items-center justify-center p-2 shadow-inner"><span className="text-3xl">🌳</span><p className="font-bold text-center text-white">Dense Cover<br/>(Safety)</p></div>
                                    <div className="absolute inset-0 flex items-center justify-center"><div className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-xl"><p className="text-black font-extrabold text-center text-lg leading-tight">Cottontail<br/>Hotspot</p></div></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Population */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-center mb-8 text-[#2A3F54] font-serif">The Bigger Picture</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="font-bold text-xl mb-2 text-gray-800 font-serif">The Rabbit Rollercoaster</h3>
                                <p className="text-sm text-gray-600 mb-4">Local rabbit populations are naturally cyclical, with &quot;boom and bust&quot; periods. Peaks in abundance can occur roughly every 10 years, driven by factors like mild winters and food availability.</p>
                                <div className="h-[350px] max-h-[450px] w-full max-w-[600px] mx-auto"><canvas ref={populationChartRef}></canvas></div>
                            </div>
                            <div className="bg-red-50 border-l-8 border-red-500 p-6 rounded-lg">
                                <h3 className="font-bold text-xl mb-2 text-red-800 flex items-center font-serif"><span className="text-2xl mr-2">⚠️</span>A Looming Threat: RHDV2</h3>
                                <p className="text-sm text-red-700 mb-4"><strong className="font-bold">Currently NOT in Indiana&apos;s wild rabbits</strong>, Rabbit Hemorrhagic Disease Virus is a fatal disease. Prevention through biosecurity is critical.</p>
                                <ul className="space-y-2 text-sm text-red-900 list-disc list-inside">
                                    <li>Report multiple sick or dead wild rabbits to the Indiana DNR.</li>
                                    <li>Do not handle wild rabbits that appear ill.</li>
                                    <li>Hunters should take biosecurity precautions.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Podcast Generator */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
                        <h2 className="text-3xl font-bold text-[#2A3F54] mb-2 font-serif">Become the Storyteller</h2>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Ready to create your podcast episode? Select a topic, and our AI will instantly write an engaging script segment for you.</p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <select value={podcastTopic} onChange={(e) => setPodcastTopic(e.target.value as PodcastTopic)} className="p-3 border border-gray-300 rounded-lg w-full md:w-auto focus:ring-2 focus:ring-[#6C5B7B] focus:border-transparent">
                                <option value="diet">Seasonal Diet & Coprophagy</option>
                                <option value="predators">The Predator Gauntlet</option>
                                <option value="nesting">Nesting & Rearing Cycle</option>
                                <option value="coexistence">Gardener&apos;s Guide to Coexistence</option>
                                <option value="habitat">The &quot;Edge Habitat&quot; Advantage</option>
                            </select>
                            <button onClick={handlePodcastScript} className="w-full md:w-auto bg-[#C06C84] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#E84A5F] transition-colors flex items-center justify-center">✨ Generate Podcast Script</button>
                        </div>
                    </section>
                </main>

                <footer className="text-center mt-16 pt-8 border-t border-gray-300">
                </footer>
                    <p className="text-sm text-gray-600">This interactive application synthesizes data from the &quot;Hopping Through Hoosier Suburbia&quot; research report. Interactive features are powered by the Gemini API.</p>
            </div>
        </div>
    );
}
