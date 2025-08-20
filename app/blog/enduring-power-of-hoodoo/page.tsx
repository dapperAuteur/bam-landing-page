"use client"
import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartOptions, TooltipItem } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import { AppError } from '../../../types/errors';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface MateriaMedica {
    name: string;
    uses: string;
}


// Helper function to process long labels for charts
const wrapLabel = (label: string, maxWidth = 16) => {
    if (label.length <= maxWidth) {
        return label;
    }
    const words = label.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        if (currentLine.length + words[i].length + 1 < maxWidth) {
            currentLine += ' ' + words[i];
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    return lines;
};

// Main Component
export default function HoodooInfographic() {
    // State for Modals and API interactions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMateria, setSelectedMateria] = useState<MateriaMedica | null>(null);
    const [lore, setLore] = useState('');
    const [isLoreLoading, setIsLoreLoading] = useState(false);

    const [intention, setIntention] = useState('');
    const [inspiration, setInspiration] = useState('');
    const [isInspirationLoading, setIsInspirationLoading] = useState(false);

    // Data extracted from the source document
    const materiaMedica = [
        { name: "High John the Conqueror Root", uses: "Success, power, gambling luck, protection." },
        { name: "Five Finger Grass", uses: "Success in endeavors done with the hands." },
        { name: "Graveyard Dirt", uses: "Spirit work, protection, jinxing." },
        { name: "Red Brick Dust", uses: "Protection, neutralizing enemy powders." },
        { name: "Hyssop", uses: "Purification, home cleansing, uncrossing." },
        { name: "Patchouli Leaf", uses: "Love-drawing, money-drawing, fertility." },
        { name: "Lodestone", uses: "Drawing love, money, or luck." },
        { name: "Devil's Shoestring", uses: "Protection from gossip, gambling luck, job-getting." },
    ];
    
    // Chart Data
    const aimsChartData = {
        labels: ['Protection', 'Justice', 'Love', 'Luck & Money', 'Healing', 'Cleansing & Uncrossing'],
        datasets: [{
            label: 'Frequency of Workings',
            data: [95, 85, 75, 80, 70, 90],
            backgroundColor: ['#593C1F', '#A6763D', '#F2C144', '#7d5c34', '#c79a63', '#d4af72'],
            borderColor: '#FFFFFF',
            borderWidth: 2
        }]
    };

    const mojoChartData = {
        labels: ['Roots & Herbs', 'Minerals & Curios', 'Personal Concerns', wrapLabel('Symbolic Items (e.g., coins)')],
        datasets: [{
            label: 'Mojo Components',
            data: [40, 25, 15, 20],
            backgroundColor: ['#593C1F', '#A6763D', '#F2C144', '#7d5c34'],
            borderColor: '#F2EBDC',
            borderWidth: 4,
            hoverOffset: 4
        }]
    };
    
    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(tooltipItems: TooltipItem<'bar' | 'doughnut'>[]) {
                        const item = tooltipItems[0];
                        const label = item?.chart.data.labels?.[item.dataIndex];
                        return (Array.isArray(label) ? label.join(' ') : label as string) || '';
                    }
                }
            }
        }
    };

    const barChartOptions: ChartOptions<'bar'> = {
        ...commonChartOptions,
        indexAxis: 'y',
        plugins: { ...commonChartOptions.plugins, legend: { display: false } }
    };

    const doughnutChartOptions: ChartOptions<'doughnut'> = {
        ...commonChartOptions,
        plugins: { ...commonChartOptions.plugins, legend: { display: true, position: 'bottom' } }
    };

    // --- Gemini API Call Logic ---
    async function callGeminiAPI(prompt: string) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const apiKey = GEMINI_API_KEY; // API key is handled by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                maxOutputTokens: 250,
            }
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                return result.candidates[0].content.parts[0].text;
            } else {
                return "Sorry, I couldn't retrieve that information. The response from the AI was not as expected.";
            }
        } catch (error: unknown) {
            console.error('Error calling Gemini API:', error);
            return `Sorry, there was an error connecting to the AI: ${(error as AppError).message}. Please try again later.`;
        }
    }

    const handleGetLore = async (item: MateriaMedica) => {
        setIsLoreLoading(true);
        setLore('');
        const prompt = `You are a respectful assistant knowledgeable about folklore. Provide a short (2-3 sentences) folkloric insight or symbolic meaning for the Hoodoo curio "${item.name}", which is used for "${item.uses}". Frame the response as informative and respectful of Hoodoo as a closed, ancestral practice of the African Diaspora.`;
        const resultText = await callGeminiAPI(prompt);
        setLore(resultText);
        setIsLoreLoading(false);
    };

    const handleGetInspiration = async () => {
        if (!intention.trim()) return;
        setIsInspirationLoading(true);
        setInspiration('');
        const prompt = `A user is looking for inspiration related to the intention: "${intention}". As a respectful AI, suggest a few symbolic concepts or correspondences from the conceptual framework of Hoodoo folk magic. Do not give spells or instructions. Focus on reflective inspiration (e.g., 'To represent this, one might reflect on elements that symbolize...' or 'Concepts of... might be relevant'). Keep it brief (2-4 sentences). Emphasize this is for personal reflection and that Hoodoo is a closed, ancestral practice of the African Diaspora.`;
        const resultText = await callGeminiAPI(prompt);
        setInspiration(resultText);
        setIsInspirationLoading(false);
    };

    const openModal = (item: MateriaMedica) => {
        // what are type of name and uses
        setSelectedMateria(item);
        setIsModalOpen(true);
        setLore(''); // Clear previous lore
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMateria(null);
    };

    return (
        <div className="bg-[#F2EBDC] font-sans text-[#262626]">
            <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                <header className="text-center my-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#593C1F] font-serif">The Enduring Power of Hoodoo</h1>
                    <p className="text-lg md:text-xl mt-4 text-[#A6763D]">A spiritual tradition of resistance, resilience, and empowerment.</p>
                </header>

                <main className="space-y-16">
                    <section className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4 text-[#593C1F] font-serif">What is Hoodoo?</h2>
                                <p className="mb-4">Hoodoo, also known as Rootwork or Conjure, is an African-American spiritual tradition focused on personal empowerment and achieving tangible results in everyday life. It is a system of folk magic, not an organized religion.</p>
                                <p>Practitioners use knowledge of herbs, roots, minerals, and spirits to create &quot;workings&quot; for protection, love, luck, and justice, rooted in West and Central African spiritual beliefs and adapted for survival in the American South.</p>
                            </div>
                            <div className="bg-[#F2EBDC] p-6 rounded-lg border border-[#A6763D]">
                                <h3 className="text-2xl font-bold text-center mb-4 text-[#593C1F] font-serif">Hoodoo vs. Voodoo</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-lg">Hoodoo (Rootwork)</h4>
                                        <p className="text-sm">Folk magic system, informal, individualized, focused on practical results.</p>
                                    </div>
                                    <div className="border-t border-[#A6763D] my-2"></div>
                                    <div>
                                        <h4 className="font-bold text-lg">Voodoo (Vodou)</h4>
                                        <p className="text-sm">Organized religion with a priesthood, communal rituals, and worship of spirits (Lwa).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-center mb-6 text-[#593C1F] font-serif">The Roots of the Work</h2>
                        <p className="text-center max-w-3xl mx-auto mb-10">Hoodoo is a syncretic tradition, weaving together spiritual technologies from across the globe—a testament to the resilience of ancestral knowledge.</p>
                        <div className="flex flex-col items-center">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center w-full max-w-5xl">
                                <div className="bg-gray-100 p-4 rounded-lg"><h3 className="font-bold text-lg text-[#593C1F]">West & Central Africa</h3><p className="text-sm">Bakongo, Fon, Ewe, Yoruba & Islamic concepts.</p></div>
                                <div className="bg-gray-100 p-4 rounded-lg"><h3 className="font-bold text-lg text-[#593C1F]">Indigenous Americas</h3><p className="text-sm">Local botanical and healing knowledge.</p></div>
                                <div className="bg-gray-100 p-4 rounded-lg"><h3 className="font-bold text-lg text-[#593C1F]">Europe</h3><p className="text-sm">Folk magic & Christian elements (Bible, Psalms).</p></div>
                            </div>
                            <div className="flex justify-center items-center my-4 w-full max-w-5xl"><div className="h-12 w-px bg-[#A6763D] transform -rotate-45 translate-x-1/2"></div><div className="h-12 w-px bg-[#A6763D]"></div><div className="h-12 w-px bg-[#A6763D] transform rotate-45 -translate-x-1/2"></div></div>
                            <div className="bg-[#593C1F] text-white p-6 rounded-full shadow-lg"><h3 className="text-2xl font-bold font-serif">HOODOO</h3></div>
                        </div>
                    </section>

                    <section id="toolkit" className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-center mb-6 text-[#593C1F] font-serif">The Rootworker&apos;s Toolkit</h2>
                        <p className="text-center max-w-3xl mx-auto mb-12">Hoodoo is a practical tradition using a rich *materia medica*. Click on an item below to learn more with AI-powered insights.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {materiaMedica.map(item => (
                                <div key={item.name} onClick={() => openModal(item)} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center cursor-pointer hover:shadow-md hover:border-[#A6763D] transition-all">
                                    <h4 className="font-bold text-lg text-[#593C1F]">{item.name}</h4>
                                    <p className="text-sm mt-1">{item.uses}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                     <section className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-center mb-6 text-[#593C1F] font-serif">Analyzing the Work</h2>
                         <p className="text-center max-w-3xl mx-auto mb-12">The goals of Hoodoo &quot;workings&quot; reflect the core desires for a better, more secure life, often using talismans like the Mojo Bag—a &quot;prayer in a bag&quot; containing curated items to achieve a specific goal.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-bold text-center mb-4 text-[#593C1F] font-serif">Primary Aims of Workings</h3>
                                <div className="chart-container"><Bar options={barChartOptions} data={aimsChartData} /></div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-center mb-4 text-[#593C1F] font-serif">Anatomy of a Mojo Bag</h3>
                                 <div className="chart-container"><Doughnut options={doughnutChartOptions} data={mojoChartData} /></div>
                            </div>
                        </div>
                    </section>

                    <section id="inspiration" className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-center mb-6 text-[#593C1F] font-serif">✨ Find Symbolic Inspiration</h2>
                        <p className="text-center max-w-2xl mx-auto mb-6">Curious about how Hoodoo concepts might relate to a situation? Describe an intention for AI-generated symbolic ideas. This is for reflection, not literal instruction.</p>
                        <div className="max-w-xl mx-auto">
                            <textarea value={intention} onChange={(e) => setIntention(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A6763D] mb-4 rows=2 placeholder='e.g.', 'seeking clarity' or 'needing protection'"></textarea>
                            <button onClick={handleGetInspiration} disabled={isInspirationLoading} className="w-full bg-[#A6763D] text-white font-bold py-3 rounded-lg hover:bg-[#593C1F] transition-colors disabled:bg-gray-400">
                                {isInspirationLoading ? 'Thinking...' : 'Get Symbolic Correspondences'}
                            </button>
                            {isInspirationLoading && <div className="text-center mt-4 text-gray-600 animate-pulse">Conjuring inspiration...</div>}
                            {inspiration && (
                                <div className="mt-6 p-4 bg-[#F2EBDC] border-l-4 border-[#A6763D] rounded-r-lg">
                                    <p className="text-sm">{inspiration}</p>
                                    <p className="text-xs text-gray-500 mt-2">AI-generated for reflection. Hoodoo is a closed, ancestral practice of the African Diaspora.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <footer className="text-center mt-16 py-8 border-t-2 border-[#A6763D]">
                    <p className="text-sm text-gray-600">This infographic is a visual summary for educational purposes, created with respect for the tradition.</p>
                </footer>
            </div>

            {/* Modal for Materia Medica */}
            {isModalOpen && selectedMateria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={closeModal}>
                    <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full m-4 p-6 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-black">&times;</button>
                        <h3 className="text-2xl font-bold mb-2 text-[#593C1F] font-serif">{selectedMateria.name}</h3>
                        <p className="text-gray-700 mb-4"><strong>Traditional Use:</strong> {selectedMateria.uses}</p>
                        <button onClick={() => handleGetLore(selectedMateria)} disabled={isLoreLoading} className="w-full bg-[#A6763D] text-white font-bold py-2 rounded-lg hover:bg-[#593C1F] transition-colors disabled:bg-gray-400">
                            {isLoreLoading ? 'Thinking...' : '✨ Uncover More Lore'}
                        </button>
                        {isLoreLoading && <div className="text-center mt-4 text-gray-600 animate-pulse">Delving into the archives...</div>}
                        {lore && (
                            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                                <p className="text-sm">{lore}</p>
                                <p className="text-xs text-gray-500 mt-2">AI-generated for reflection. Hoodoo is a closed, ancestral practice of the African Diaspora.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
