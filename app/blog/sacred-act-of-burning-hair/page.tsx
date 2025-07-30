"use client"

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip, Title, TooltipItem } from 'chart.js';
import { AppError } from '../../../types/errors';

// Register the necessary components for Chart.js
Chart.register(DoughnutController, ArcElement, Legend, Tooltip, Title);

interface ComparisonData {
    [key: string]: {
        name: string;
        beliefs: string;
        reasons: string;
        methods: { [key: string]: number };
    }
}

// --- Data based on the provided research report ---
const comparisonData: ComparisonData = {
    african_american_hoodoo: {
        name: "African American (Hoodoo)",
        beliefs: "Hair holds spirit and energy, making it a powerful ingredient in rootwork. It maintains a strong connection to the individual and can be used for control or harm.",
        reasons: "Primarily, for protection from witchcraft and malevolent spells. It also serves as a method for spiritual cleansing and releasing old, negative energy.",
        methods: { Burning: 100 }
    },
    general_african: {
        name: "General African Traditions",
        beliefs: "Often considered the 'seat of the soul.' A sympathetic connection to the owner persists even after being cut, allowing sorcerers to use it for magical manipulation.",
        reasons: "Protection from witchcraft and sorcery. Preventing enemies from gaining spiritual power over the individual.",
        methods: { Burning: 50, Burying: 40, "Sacred Storage": 10 }
    },
    native_american: {
        name: "Native American Traditions",
        beliefs: "Hair is a physical extension of one's thoughts, prayers, and spirit. It holds personal history and energy.",
        reasons: "Honoring deceased loved ones, releasing prayers to the Creator, marking personal transformation, spiritual release, and self-renewal.",
        methods: { Burning: 60, Burying: 20, ["Offering to Nature"]: 20 }
    },
    igbo: {
        name: "Igbo (Widowhood Rituals)",
        beliefs: "Hair is a component of ritual purification, symbolizing a transition from one state of being to another.",
        reasons: "Primarily for ritual cleansing for widows, marking the end of the mourning period and a return to society.",
        methods: { Burning: 100 }
    },
    baluba: {
        name: "Baluba (Death Rituals)",
        beliefs: "Bodily matter such as hair and nails are intrinsically connected to a person's soul and its proper journey after death.",
        reasons: "To ensure the soul is properly buried in its ancestral ground for a peaceful transition, even if the person died far from home.",
        methods: { Burying: 100 }
    }
};

// --- Helper Functions ---
const wrapLabel = (label: string, maxLength = 16) => {
    if (typeof label !== 'string' || label.length <= maxLength) {
        return label;
    }
    const words = label.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length > maxLength && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = currentLine ? `${currentLine} ${word}` : word;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
};


// --- The Main Component ---
export default function HairBeliefsInfographic() {
    const [selectedCulture, setSelectedCulture] = useState('african_american_hoodoo');
    const [question, setQuestion] = useState('');
    const [geminiResponse, setGeminiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const chartContainer = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    
    const activeCultureData = comparisonData[selectedCulture];

    useEffect(() => {
        if (chartContainer.current && activeCultureData) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartContainer.current.getContext('2d');
            if (!ctx) return;

            const chartLabels = Object.keys(activeCultureData.methods).map(label => wrapLabel(label));

            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Disposal Method',
                        data: Object.values(activeCultureData.methods),
                        backgroundColor: ['#A0522D', '#6B4226', '#DAA520', '#D2B48C', '#8B4513'], // Warm Earth Palette
                        borderColor: '#FDFBF8',
                        borderWidth: 4,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#4A5568',
                                font: {
                                    family: "'Inter', sans-serif",
                                    size: 14,
                                    weight: 500
                                },
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: '#2D3748',
                            titleFont: { size: 16, family: "'Lora', serif" },
                            bodyFont: { size: 14, family: "'Inter', sans-serif" },
                            padding: 12,
                            cornerRadius: 4,
                            callbacks: {
                                title: (tooltipItems: TooltipItem<'doughnut'>[]) => {
                                    const item = tooltipItems[0];
                                    const label = item?.chart.data?.labels?.[item.dataIndex];
                                    return (Array.isArray(label) ? label.join(' ') : label as string) || '';
                                },
                                label: (context: TooltipItem<'doughnut'>) => {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += `${context.parsed}%`;
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Cleanup function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };

    }, [selectedCulture, activeCultureData]);

    const handleCultureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCulture(e.target.value);
        setQuestion('');
        setGeminiResponse('');
        setError('');
    };

    const handleAskGemini = async () => {
        if (!question.trim()) {
            setError("Please enter a question.");
            return;
        }

        setIsLoading(true);
        setError('');
        setGeminiResponse('');

        const prompt = `Based on the following information about ${activeCultureData.name}'s beliefs regarding hair:\n\nBeliefs: ${activeCultureData.beliefs}\nReasons for Disposal: ${activeCultureData.reasons}\n\nPlease answer the user's question: "${question}"\n\nProvide a concise and informative answer, drawing upon the provided context and your general knowledge of related cultural practices.`;

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };
        const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const apiKey = GEMINI_API_KEY; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setGeminiResponse(text);
            } else {
                throw new Error("Received an unexpected response structure from the API.");
            }
        } catch (err: unknown) {
            console.error("Gemini API Error:", err);
            setError(`Sorry, an error occurred. ${(err as AppError).message}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-[#FDFBF8] text-[#3D3D3D] font-sans p-4 sm:p-8">
            <main className="container mx-auto">
                <section id="header" className="text-center py-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#8B4513] font-serif">The Sacred Act of Burning Hair</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-700">An interactive infographic tracing a profound spiritual practice from its African origins to its enduring presence in the diaspora.</p>
                </section>

                <section id="motivations" className="py-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#A0522D] font-serif">The Core Motivations</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">The custom is driven by a rich tapestry of spiritual beliefs, all pointing to hair as a potent extension of the self.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-5xl mb-4">🛡️</div>
                            <h3 className="text-2xl font-bold text-[#6B4226] mb-2 font-serif">Spiritual Protection</h3>
                            <p className="text-gray-600">The primary reason is to neutralize hair&apos;s potential use in malevolent magic or &quot;Hoodoo&quot; by rendering it spiritually inert.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-5xl mb-4">✨</div>
                            <h3 className="text-2xl font-bold text-[#6B4226] mb-2 font-serif">Energetic Cleansing</h3>
                            <p className="text-gray-600">Hair is a repository of energy. Burning it is a ritual of release, symbolizing letting go of the past and embracing renewal.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="text-5xl mb-4">🕊️</div>
                            <h3 className="text-2xl font-bold text-[#6B4226] mb-2 font-serif">Folk Beliefs</h3>
                            <p className="text-gray-600">Other traditions include preventing headaches caused by birds using hair in nests or sending prayers to the universe via smoke.</p>
                        </div>
                    </div>
                </section>

                <section id="journey" className="py-16 bg-[#A0522D]/10 rounded-xl">
                     <div className="text-center mb-12 px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#A0522D] font-serif">A Transatlantic Legacy</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">This practice is a direct cultural inheritance that journeyed across the Atlantic and was solidified in the diaspora.</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 px-4">
                        <div className="text-center p-6 bg-white rounded-lg shadow-md w-full md:w-1/3">
                            <h4 className="text-xl font-bold text-[#8B4513] font-serif mb-2">African Origins</h4>
                            <p className="text-gray-600 text-sm">Belief in &quot;contagious magic&quot;—that separated hair retains a spiritual connection to its owner.</p>
                        </div>
                        <div className="transform md:-rotate-90 text-4xl text-gray-300 font-sans mx-2 my-2 md:my-0">→</div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md w-full md:w-1/3">
                            <h4 className="text-xl font-bold text-[#8B4513] font-serif mb-2">Diasporic Amplification</h4>
                            <p className="text-gray-600 text-sm">Hoodoo emphasized protective magic, solidifying hair burning as a key defensive ritual.</p>
                        </div>
                        <div className="transform md:-rotate-90 text-4xl text-gray-300 font-sans mx-2 my-2 md:my-0">→</div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md w-full md:w-1/3">
                            <h4 className="text-xl font-bold text-[#8B4513] font-serif mb-2">Modern Resilience</h4>
                            <p className="text-gray-600 text-sm">The practice continues as a living link to ancestral knowledge and spiritual self-preservation.</p>
                        </div>
                    </div>
                </section>

                <section id="comparison" className="py-16">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#A0522D] font-serif">Explore & Compare Beliefs</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">Select a tradition to compare its hair disposal methods and the beliefs behind them. Then, ask our AI assistant for more details.</p>
                    </div>
                    <div className="text-center mb-8">
                        <select value={selectedCulture} onChange={handleCultureChange} className="p-3 border border-gray-300 rounded-lg bg-white shadow-md text-lg focus:ring-2 focus:ring-[#DAA520] focus:outline-none">
                            {Object.keys(comparisonData).map(key => (
                                <option key={key} value={key}>{comparisonData[key].name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                            <h3 className="text-2xl font-bold text-[#6B4226] mb-4 text-center font-serif">{`Disposal Methods: ${activeCultureData.name}`}</h3>
                            <div className="relative mx-auto w-full max-w-[400px] h-[350px]">
                                <canvas ref={chartContainer}></canvas>
                            </div>
                        </div>
                        <div className="space-y-6">
                             <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h4 className="font-bold text-xl mb-2 text-[#8B4513] font-serif">Core Belief About Hair</h4>
                                <p className="text-gray-600">{activeCultureData.beliefs}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h4 className="font-bold text-xl mb-2 text-[#8B4513] font-serif">Primary Reason for Disposal</h4>
                                <p className="text-gray-600">{activeCultureData.reasons}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h4 className="font-bold text-xl mb-3 text-[#8B4513] font-serif">✨ Ask Gemini for Deeper Insight</h4>
                                <div className="mb-3">
                                    <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" placeholder="e.g., How does this relate to other rituals?" />
                                </div>
                                <button onClick={handleAskGemini} disabled={isLoading} className="bg-[#DAA520] hover:bg-[#B8860B] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isLoading ? 'Thinking...' : 'Ask Gemini'}
                                </button>
                                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                                {geminiResponse && (
                                    <div className="mt-4 text-gray-700 border-t pt-4">
                                        <p className="whitespace-pre-wrap font-medium">{geminiResponse}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
