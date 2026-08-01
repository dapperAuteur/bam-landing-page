"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables, TooltipItem } from 'chart.js';
import InsightModal from '@/components/blog/InsightModal';
import { SLEEP_MYTHS } from '@/lib/blog/insights/sleep-myths';
import { findInsight, type Insight } from '@/lib/blog/insights/types';
Chart.register(...registerables);

// Chosen Palette: Brilliant Blues (as per previous infographic)
// Application Structure Plan: A single Next.js component structuring the sleep report into a narrative infographic. 1) Hook: Contrasting user's activity with their elevated sleep need. 2) Pillars of Recovery: Icon-based section for core functions. 3) Cost of Sleep Debt: Data-driven charts for performance/injury impacts. 4) Longevity Equation: U-shaped chart for mortality risk. 5) Anabolic Window: HTML/CSS flowchart. 6) ✨ AI Sleep Myth Debunker: Interactive section using Gemini API for personalized learning. 7) Actionable Blueprint: Clear, categorized strategies. This structure guides the user from the "why" to the "how" in an engaging format.
// Visualization & Content Choices: 1. Elevated Sleep Needs -> Goal: Inform -> Viz: Big Number. 2. Pillars -> Goal: Organize -> Viz: HTML/CSS Cards. 3. Performance Decrements -> Goal: Compare -> Viz: Chart.js Bar Chart. 4. Injury Risk -> Goal: Inform -> Viz: Big Number. 5. Longevity -> Goal: Reveal Relationships -> Viz: Chart.js Bar Chart. 6. Anabolic Process -> Goal: Show Process -> Viz: HTML/CSS Flowchart. 7. AI Debunker -> Goal: Inform/Educate -> Viz: Text input + Gemini API response. All choices adhere to NO SVG/Mermaid constraints.

// Helper function to wrap long labels for Chart.js
const wrapLabel = (str: string, maxWidth = 16) => {
    if (str.length <= maxWidth) {
        return str;
    }
    const words = str.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + ' ' + word).length > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        }
    }
    lines.push(currentLine);
    return lines;
};

// Helper for tooltip titles with wrapped labels
const tooltipTitleCallback = (tooltipItems: TooltipItem<'bar'>[]) => {
    const item = tooltipItems[0];
    const label = item?.chart.data.labels?.[item.dataIndex];
    if (Array.isArray(label)) {
      return label.join(' ');
    }
    return (label as string) || '';
};


const SleepInfographic = () => {
    const performanceChartRef = useRef<HTMLCanvasElement | null>(null);
    const longevityChartRef = useRef<HTMLCanvasElement | null>(null);
    

    const [openInsight, setOpenInsight] = useState<Insight | null>(null);

    const showMyth = (id: string) => {
        setOpenInsight(findInsight(SLEEP_MYTHS, id)?.insight ?? null);
    };

    useEffect(() => {
        let performanceChartInstance: Chart | null = null;
        let longevityChartInstance: Chart | null = null;

        // Performance Chart
        if (performanceChartRef.current) {
            const performanceCtx = performanceChartRef.current.getContext('2d');
            if (!performanceCtx) return;

            performanceChartInstance = new Chart(performanceCtx, {
                type: 'bar',
                data: {
                    labels: [
                        wrapLabel('Skill Control Accuracy'), 
                        wrapLabel('Aerobic Endurance'),
                        wrapLabel('Explosive Power'),
                        wrapLabel('Maximum Strength')
                    ],
                    datasets: [{
                        label: 'Performance Decrease due to Sleep Deprivation',
                        data: [-53, -10, -7, -4],
                        backgroundColor: ['#00A1E4', '#33B5E5', '#66C7E6', '#99D9E7'],
                        borderColor: '#003366',
                        borderWidth: 2,
                        borderRadius: 5,
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { title: tooltipTitleCallback, label: (context: TooltipItem<'bar'>) => `${context.formattedValue}% Decrease` } }
                    },
                    scales: {
                        x: { title: { display: true, text: 'PERCENTAGE DECREASE (%)', font: { size: 14, family: 'Teko, sans-serif' } }, ticks: { callback: (value) => value + '%', font: { family: 'Roboto, sans-serif' } } },
                        y: { ticks: { font: { family: 'Roboto, sans-serif' } } }
                    }
                }
            });
        }

        // Longevity Chart
        if (longevityChartRef.current) {
            const longevityCtx = longevityChartRef.current.getContext('2d');
            if (!longevityCtx) return;

            longevityChartInstance = new Chart(longevityCtx, {
                type: 'bar',
                data: {
                    labels: ['≤5 hrs', '6 hrs', '7 hrs', '8 hrs', '9 hrs', '≥10 hrs'],
                    datasets: [{
                        label: 'Relative All-Cause Mortality Risk',
                        data: [1.15, 1.12, 1.0, 1.0, 1.08, 1.30],
                        backgroundColor: ['#33B5E5', '#66C7E6', '#00A1E4', '#00A1E4', '#66C7E6', '#33B5E5'],
                        borderColor: '#003366',
                        borderWidth: 2,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                title: tooltipTitleCallback,
                                label: (context: TooltipItem<'bar'>) => {
                                    const value = context.parsed.y;
                                    if (value === 1.0) return 'Baseline Risk';
                                    return `~${((value - 1) * 100).toFixed(0)}% Increased Risk`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: { beginAtZero: false, min: 0.9, title: { display: true, text: 'RELATIVE MORTALITY RISK', font: { size: 14, family: 'Teko, sans-serif' } }, ticks: { font: { family: 'Roboto, sans-serif' } } },
                        x: { title: { display: true, text: 'AVERAGE NIGHTLY SLEEP DURATION', font: { size: 14, family: 'Teko, sans-serif' } }, ticks: { font: { family: 'Roboto, sans-serif' } } }
                    }
                }
            });
        }
        
        return () => {
            if (performanceChartInstance) performanceChartInstance.destroy();
            if (longevityChartInstance) longevityChartInstance.destroy();
        };
    }, []);
    
    // Inline styles for fonts since Tailwind config cannot be modified here
    const tekoFont: React.CSSProperties = { fontFamily: "'Teko', sans-serif", textTransform: 'uppercase' };
    const robotoFont: React.CSSProperties = { fontFamily: "'Roboto', sans-serif" };

    return (
        <div style={robotoFont} className="bg-[#f0f9ff] text-[#003366] p-4 md:p-8 font-sans">
            {/* NOTE FOR DEVELOPER: For this component to display correctly with the intended fonts, 
              please ensure you import 'Teko' and 'Roboto' in your global stylesheet (e.g., globals.css or _app.js).
              Example: @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Roboto:wght@400;700&display=swap');
            */}
            <style>{`
                .ai-loader {
                    border: 4px solid #e6f7ff;
                    border-top: 4px solid #00A1E4;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 1rem auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            
            <div className="container mx-auto">
                 {/* Section 1: Introduction & Hook */}
                <section className="text-center mb-16">
                    <h1 style={tekoFont} className="text-5xl md:text-7xl font-bold text-[#003366]">THE ATHLETE&apos;S SLEEP ADVANTAGE</h1>
                    <h2 style={tekoFont} className="text-3xl md:text-5xl text-[#00A1E4] mt-2">Unlock Peak Performance & Longevity</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-lg">Your high activity level is commendable, placing extreme demands on your body. Standard recovery isn&apos;t enough. The single most powerful tool to sustain performance, accelerate recovery, and extend your active years is <span className="font-bold text-[#00A1E4]">sleep</span>.</p>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-6 rounded-lg shadow-xl border-t-4 border-[#00A1E4]" style={{background: 'linear-gradient(145deg, #ffffff, #e6f7ff)'}}>
                            <h3 style={tekoFont} className="text-3xl text-[#003366]">Your Activity Level</h3>
                            <p style={tekoFont} className="text-5xl font-bold text-[#33B5E5]">TOP TIER</p>
                            <p className="mt-2">With peak weeks over <span className="font-bold">17 hours</span>, your physiological demands rival elite athletes.</p>
                        </div>
                        <div className="p-6 rounded-lg shadow-xl border-t-4 border-[#00A1E4]" style={{background: 'linear-gradient(145deg, #ffffff, #e6f7ff)'}}>
                            <h3 style={tekoFont} className="text-3xl text-[#003366]">Your Elevated Sleep Need</h3>
                            <p style={tekoFont} className="text-5xl font-bold text-[#33B5E5]">9-10 <span className="text-4xl">Hours</span></p>
                            <p className="mt-2">General recommendations are insufficient. To fully recover and adapt, you must aim higher.</p>
                        </div>
                    </div>
                </section>

                {/* Section 2: Pillars */}
                <section className="mb-16">
                    <h2 style={tekoFont} className="text-4xl md:text-5xl text-center font-bold mb-8">THE 4 PILLARS OF SLEEP-DRIVEN RECOVERY</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Pillar Cards */}
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="text-6xl text-[#00A1E4]">🔧</div>
                            <h3 style={tekoFont} className="text-2xl font-bold mt-2">Physiological Repair</h3>
                            <p className="mt-2">Maximizes muscle protein synthesis and growth hormone release to rebuild tissue.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="text-6xl text-[#00A1E4]">🧠</div>
                            <h3 style={tekoFont} className="text-2xl font-bold mt-2">Cognitive Enhancement</h3>
                            <p className="mt-2">Consolidates motor skills and sharpens reaction time, focus, and decision-making.</p>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="text-6xl text-[#00A1E4]">🛡️</div>
                            <h3 style={tekoFont} className="text-2xl font-bold mt-2">Immune Fortification</h3>
                            <p className="mt-2">Strengthens immune defenses, reducing susceptibility to illnesses that disrupt training.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="text-6xl text-[#00A1E4]">⚖️</div>
                            <h3 style={tekoFont} className="text-2xl font-bold mt-2">Hormonal Balance</h3>
                            <p className="mt-2">Promotes an anabolic state by regulating cortisol, testosterone, and growth hormones.</p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Cost of Debt */}
                <section className="mb-16">
                    <h2 style={tekoFont} className="text-4xl md:text-5xl text-center font-bold mb-8">THE HIGH COST OF SLEEP DEBT</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl">
                            <h3 style={tekoFont} className="text-3xl text-center font-bold mb-4">Quantifiable Performance Collapse</h3>
                            <p className="text-center mb-4">Insufficient sleep measurably degrades your physical capabilities. This chart shows the stark reality of performance declines.</p>
                            <div className="relative w-full max-w-xl mx-auto h-[350px] max-h-[50vh]">
                                <canvas ref={performanceChartRef}></canvas>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                            <h3 style={tekoFont} className="text-3xl font-bold mb-4">Skyrocketing Injury Risk</h3>
                            <p className="mb-4">Sleep is your #1 defense against injury. Sleep debt leaves you critically vulnerable.</p>
                            <div className="border-4 border-dashed border-[#00A1E4] p-6 rounded-lg">
                                <p style={tekoFont} className="text-8xl font-bold text-[#00A1E4]">1.7x</p>
                                <p style={tekoFont} className="text-2xl font-bold">Greater Injury Risk</p>
                                <p className="mt-2">For athletes sleeping less than 8 hours per night.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Longevity */}
                 <section className="mb-16 bg-white p-6 md:p-10 rounded-lg shadow-2xl">
                    <h2 style={tekoFont} className="text-4xl md:text-5xl text-center font-bold mb-2">THE LONGEVITY EQUATION</h2>
                    <p className="text-center text-lg max-w-3xl mx-auto mb-8">Sleep habits are a powerful predictor of your healthspan. Research reveals a clear &quot;U-shaped&quot; curve for all-cause mortality, highlighting a critical sweet spot.</p>
                    <div className="relative w-full max-w-xl mx-auto h-[350px] max-h-[50vh]">
                        <canvas ref={longevityChartRef}></canvas>
                    </div>
                </section>

                {/* Section 5: Anabolic Window */}
                <section className="mb-16">
                    <h2 style={tekoFont} className="text-4xl md:text-5xl text-center font-bold mb-2">THE ANABOLIC WINDOW OF SLEEP</h2>
                    <p className="text-center text-lg max-w-3xl mx-auto mb-8">Sleep triggers a hormonal cascade that shifts your body into a building state, essential for adapting to training.</p>
                    <div className="flex flex-col items-center w-full">
                        <div className="bg-white border-2 border-[#99D9E7] p-4 rounded-lg text-center w-4/5 max-w-xs shadow-md">
                            <h3 style={tekoFont} className="text-2xl font-bold text-[#003366]">DEEP SLEEP ONSET</h3>
                            <p>The body enters its primary restorative phase.</p>
                        </div>
                        <div className="text-4xl text-[#00A1E4] my-2 font-bold">↓</div>
                        <div className="bg-white border-2 border-green-400 p-4 rounded-lg text-center w-4/5 max-w-xs shadow-md">
                            <h3 style={tekoFont} className="text-2xl font-bold text-green-600">Growth Hormone Surges ▲</h3>
                            <p>Stimulates muscle repair and growth.</p>
                        </div>
                        <div className="text-4xl text-[#00A1E4] my-2 font-bold">↓</div>
                        <div className="bg-white border-2 border-red-400 p-4 rounded-lg text-center w-4/5 max-w-xs shadow-md">
                             <h3 style={tekoFont} className="text-2xl font-bold text-red-600">Cortisol Suppressed ▼</h3>
                            <p>Reduces muscle breakdown, creating a pro-recovery state.</p>
                        </div>
                    </div>
                </section>
                
                {/* Section 6: AI Myth Debunker */}
                <section className="mb-16 bg-white p-6 md:p-10 rounded-lg shadow-2xl">
                    <h2 style={tekoFont} className="text-4xl md:text-5xl text-center font-bold mb-2">SLEEP MYTH DEBUNKER & FACT CHECKER</h2>
                    <p className="text-center text-lg max-w-3xl mx-auto mb-6">Six things people repeat about sleep, and what the science actually says. Pick one.</p>
                    <div className="max-w-2xl mx-auto grid gap-3 sm:grid-cols-2">
                        {SLEEP_MYTHS.map(myth => (
                            <button
                                key={myth.id}
                                type="button"
                                onClick={() => showMyth(myth.id)}
                                className="rounded-lg border-2 border-[#33B5E5] bg-white px-4 py-3 text-left transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                            >
                                <span className="block font-bold text-[#003366]">{myth.label}</span>
                                {myth.hint && <span className="mt-0.5 block text-xs text-[#00A1E4]">{myth.hint}</span>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Section 7: Actionable Blueprint */}
                <section className="mb-12">
                    <h2 style={tekoFont} className="text-4xl md:text-5xl text-center font-bold mb-8">YOUR ACTIONABLE BLUEPRINT</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Blueprint Cards */}
                         <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 style={tekoFont} className="text-2xl font-bold border-b-2 border-[#00A1E4] pb-2 mb-3">1. Foundational Habits</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li><span className="font-bold">Be Consistent:</span> Same bed & wake time (±1 hr weekends).</li>
                                <li><span className="font-bold">Create a Routine:</span> 30-60 min screen-free wind-down.</li>
                                <li><span className="font-bold">Optimize Your Cave:</span> Cool (18-20°C), dark, and silent.</li>
                            </ul>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 style={tekoFont} className="text-2xl font-bold border-b-2 border-[#00A1E4] pb-2 mb-3">2. Strategic Interventions</h3>
                            <ul className="list-disc list-inside space-y-2">
                                 <li><span className="font-bold">&quot;Bank&quot; Sleep:</span> Get 9-10 hours/night during heavy training.</li>
                                 <li><span className="font-bold">Nap Smartly:</span> 20-30 min power nap in the early afternoon.</li>
                                 <li><span className="font-bold">Manage Light:</span> Bright sun in morning; avoid blue light at night.</li>
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 style={tekoFont} className="text-2xl font-bold border-b-2 border-[#00A1E4] pb-2 mb-3">3. Nutrition & Timing</h3>
                            <ul className="list-disc list-inside space-y-2">
                                 <li><span className="font-bold">Pre-Sleep Protein:</span> 30-40g of casein 30 mins before bed.</li>
                                 <li><span className="font-bold">Avoid Stimulants:</span> No caffeine after 2 PM or alcohol before bed.</li>
                                 <li><span className="font-bold">Hydrate Early:</span> Taper fluid intake 1-2 hours before bed.</li>
                            </ul>
                        </div>
                    </div>
                </section>
                <footer className="text-center py-8 text-sm text-gray-600">
                    <p>Infographic based on sleep science analysis. AI insights are for informational purposes only.</p>
                </footer>
            </div>

            <InsightModal insight={openInsight} onClose={() => setOpenInsight(null)} />
        </div>
    );
};

export default SleepInfographic;
