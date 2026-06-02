"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables, TooltipItem } from 'chart.js';
Chart.register(...registerables);
import { AppError } from '../../../types/errors';


// Helper function to wrap long labels for charts
const wrapLabel = (str: string, maxLen: number) => {
    if (str.length <= maxLen) {
        return str;
    }
    const words = str.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length > maxLen && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine += ' ' + word;
        }
    }
    lines.push(currentLine.trim());
    return lines;
};


// Main Infographic Component
const Sik3Infographic = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    // State for AI Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState('AI\'s answer will appear here.');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // State for Hypothesis Generation
    const [hypothesis, setHypothesis] = useState('');
    const [isHypothesisLoading, setIsHypothesisLoading] = useState(false);

    // Effect to create and destroy the chart
    useEffect(() => {
        // Data for the Bar Chart
        const chartData = {
            labels: [
                wrapLabel('Total Sleep Reduction (24h)', 16),
                wrapLabel('Sleep Rebound Post-Deprivation', 16),
                wrapLabel('NREM Sleep Intensity (Delta Power)', 16)
            ],
            datasets: [{
                label: 'Change vs. Control',
                data: [-31.8, -54, 15],
                backgroundColor: [
                    'rgba(212, 80, 135, 0.7)',
                    'rgba(102, 81, 145, 0.7)',
                    'rgba(0, 63, 92, 0.7)',
                ],
                borderColor: [
                    '#d45087',
                    '#665191',
                    '#003f5c',
                ],
                borderWidth: 2,
                borderRadius: 4,
            }]
        };
        if (chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;
            chartInstanceRef.current = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Change (Minutes or %)'
                            },
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                title: (tooltipItems: TooltipItem<'bar'>[]) => {
                                    const item = tooltipItems[0];
                                    const label = item?.chart.data.labels?.[item.dataIndex];
                                    return (Array.isArray(label) ? label.join(' ') : label as string) || '';
                                },
                                label: (context: TooltipItem<'bar'>) => {
                                    const value = context.parsed.x;
                                    const axisLabel = context.chart.data.labels?.[context.dataIndex];
                                    const labelString = Array.isArray(axisLabel) ? axisLabel.join(' ') : String(axisLabel || '');
                                    if (labelString.includes('Intensity')) {
                                        return `+${value}% (Increased Efficiency)`;
                                    } else {
                                        return `${value} min (Reduced Duration)`;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    // Function to call Gemini API
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const callGeminiApi = async (promptText: string) => {
        const apiKey = GEMINI_API_KEY; // Canvas will provide the key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = { contents: [{ role: "user", parts: [{ text: promptText }] }] };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
            }
            
            const result = await response.json();

            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                return result.candidates[0].content.parts[0].text;
            } else if (result.promptFeedback?.blockReason) {
                return `Blocked: ${result.promptFeedback.blockReason}. Please rephrase.`;
            } else {
                return "Sorry, I couldn't get a proper answer. The response was unexpected.";
            }
        } catch (error: unknown) {
            console.error("Gemini API call error:", error);
            return `An error occurred: ${(error as AppError).message}. Please try again.`;
        }
    };
    
    // Handler for "Ask AI"
    const handleAskAi = async () => {
        if (!aiQuestion.trim()) {
            setAiAnswer("Please enter a question.");
            return;
        }
        setIsAiLoading(true);
        setAiAnswer("Thinking...");
        const context = `You are a helpful assistant explaining scientific concepts from a report about the genetics of sleep. The user is asking about Natural Short Sleep (NSS), the SIK3 gene, and the SIK3-N783Y mutation. Based on this context, answer the following question clearly and concisely. Question: "${aiQuestion}"`;
        const answer = await callGeminiApi(context);
        setAiAnswer(answer);
        setIsAiLoading(false);
    };

    // Handler for "Generate Hypothesis"
    const handleGenerateHypothesis = async () => {
        setIsHypothesisLoading(true);
        setHypothesis('');
        const prompt = `Based on the understanding that the SIK3-N783Y mutation diminishes SIK3 kinase activity but leads to shorter, more intense sleep (higher delta power), generate one novel, testable research hypothesis. The hypothesis should explore the downstream molecular consequences or potential therapeutic applications. Avoid simply restating known facts. For example, "Hypothesis: Specific inhibition of SIK3's phosphorylation of synaptic protein X will replicate the sleep efficiency gains of the N783Y mutation without impacting global sleep duration."`;
        const newHypothesis = await callGeminiApi(prompt);
        setHypothesis(newHypothesis);
        setIsHypothesisLoading(false);
    };

    return (
        <div className="bg-slate-100 text-gray-800 antialiased font-sans">
            <div className="container mx-auto p-4 md:p-8">
                
                <header className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">The Genetics of Efficient Sleep</h1>
                    <p className="text-lg md:text-xl font-semibold text-indigo-600">An Interactive Analysis of the SIK3-N783Y Mutation</p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-lg">
                        ✨ Ask AI About Sleep Science
                    </button>
                </header>

                <main className="space-y-12">
                    
                    {/* Section 1: Overview */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">1. Market Overview: The Natural Short Sleeper</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <p className="text-slate-600 mb-4 text-lg">
                                    A small but significant segment of the population, known as **Natural Short Sleepers (NSS)**, thrive on 4-6.5 hours of sleep per night without ill effects. This unique trait points to a highly efficient biological system for sleep restoration.
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-center mt-6">
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                        <div className="text-4xl font-bold text-[#003f5c]">1-3%</div>
                                        <p className="text-sm font-medium text-slate-500 mt-1">Estimated Population Prevalence</p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                                        <div className="text-4xl font-bold text-[#ffa600]">Zero</div>
                                        <p className="text-sm font-medium text-slate-500 mt-1">Known Adverse Health Effects</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg">
                                <h3 className="font-bold text-slate-700 text-xl mb-4">Trait Comparison</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start"><span className="text-green-500 mr-3 text-2xl">✓</span><div><strong className="text-green-700">Natural Short Sleep:</strong> Genetically efficient, feels well-rested.</div></li>
                                    <li className="flex items-start"><span className="text-red-500 mr-3 text-2xl">✗</span><div><strong className="text-red-700">Insomnia:</strong> Pathological, struggles to sleep, feels fatigued.</div></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Key Player */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">2. The Regulatory Pathway: SIK3&apos;s Role</h2>
                        <p className="max-w-3xl mx-auto text-center text-slate-600 mb-10 text-lg">
                            The **SIK3 gene** is a master regulator of sleep need. It operates within a critical signaling cascade that controls when and how deeply we sleep.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 text-center">
                            <div className="p-5 rounded-lg border-2 border-[#003f5c] bg-slate-50 w-full md:w-52 shadow-sm">
                                <h3 className="font-bold text-[#003f5c]">LKB1</h3><p className="text-sm text-slate-500">Activates SIK3</p>
                            </div>
                            <div className="text-2xl font-mono text-slate-400">➔</div>
                            <div className="p-5 rounded-lg border-2 border-[#665191] bg-slate-50 w-full md:w-52 shadow-sm">
                                <h3 className="font-bold text-[#665191]">SIK3</h3><p className="text-sm text-slate-500">Phosphorylates HDAC4</p>
                            </div>
                            <div className="text-2xl font-mono text-slate-400">➔</div>
                            <div className="p-5 rounded-lg border-2 border-[#d45087] bg-slate-50 w-full md:w-52 shadow-sm">
                                <h3 className="font-bold text-[#d45087]">HDAC4</h3><p className="text-sm text-slate-500">Regulates Sleep Genes</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: The Mutation */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">3. The Game Changer: SIK3-N783Y Mutation</h2>
                        <p className="max-w-3xl mx-auto text-center text-slate-600 mb-10 text-lg">
                            This rare mutation paradoxically *reduces* SIK3&apos;s activity, yet results in shorter, more intense sleep. This suggests it impairs a &quot;sleep need&quot; signal, leading to higher efficiency.
                        </p>
                        <div className="w-full max-w-2xl mx-auto h-96 md:h-[450px]">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </section>
                    
                    {/* Section 4: Future Outlook */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">4. Future Outlook & AI-Generated Hypothesis</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="text-slate-600 text-lg">
                                <p className="mb-4">The SIK3-N783Y variant offers a blueprint for new sleep therapies. Instead of inducing sleep, future drugs could mimic this mutation to enhance sleep *quality* and *efficiency*.</p>
                                <p>This opens doors to treatments for sleep disorders and provides insights into healthy aging, where efficient cellular repair during sleep is crucial.</p>
                            </div>
                            <div className="bg-teal-50 border border-teal-200 p-6 rounded-lg">
                                <h3 className="font-bold text-teal-800 text-xl mb-4">Generate a Novel Research Idea</h3>
                                <button
                                    onClick={handleGenerateHypothesis}
                                    disabled={isHypothesisLoading}
                                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-md w-full disabled:bg-gray-400"
                                >
                                    {isHypothesisLoading ? 'Generating...' : '✨ Generate with AI'}
                                </button>
                                {hypothesis && (
                                    <div className="mt-4 p-4 bg-white rounded shadow text-sm">
                                        <p><strong className="text-teal-700">AI Hypothesis:</strong> {hypothesis}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

            </div>

            {/* AI Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-slate-900">Ask AI About Sleep Science</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-3xl text-slate-500 hover:text-slate-800">&times;</button>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">Ask a question about SIK3, sleep genetics, or related concepts from the report.</p>
                        <textarea
                            value={aiQuestion}
                            onChange={(e) => setAiQuestion(e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-slate-300 rounded-md mb-4 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Explain why lower SIK3 activity leads to less sleep."
                        />
                        <button
                            onClick={handleAskAi}
                            disabled={isAiLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full disabled:bg-gray-400"
                        >
                            {isAiLoading ? 'Getting Answer...' : 'Submit Question'}
                        </button>
                        <div className="mt-6 p-4 bg-slate-50 rounded-md min-h-[100px] text-slate-700">
                            {isAiLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : (
                                <p>{aiAnswer}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sik3Infographic;
