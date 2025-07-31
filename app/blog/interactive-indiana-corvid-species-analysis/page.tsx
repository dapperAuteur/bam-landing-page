"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { AppError } from '../../../types/errors';

Chart.register(...registerables);

interface MythExplanations {
  [key: string]: string;
}
interface Corvid {
  species: string;
  eq: string;
  habitat: string;
  beakStyle: string;
  beakUsage: string;
  mass: number;
  plumage: string;
  size: number;
  socialBehavior: string;
  vocalization: string;
  wingspan: number;
}


const corvidData = [
  {
    species: "American Crow",
    eq: "High (approx. 1.2-2.5)",
    habitat: "Ubiquitous: woodlands, agricultural areas, suburbs, urban parks.",
    beakStyle: "Strong, stout, versatile.",
    beakUsage: "Omnivorous: scavenging, insects, seeds, eggs, refuse.",
    mass: 450,
    size: 46,
    wingspan: 92,
    plumage: "Entirely black with a glossy, iridescent sheen.",
    vocalization: "Familiar 'caw-caw', clicks, rattles.",
    socialBehavior: "Highly social, forms large flocks and roosts.",
  },
  {
    species: "Blue Jay",
    eq: "High",
    habitat: "Woodlands (especially oak), suburban yards, parks.",
    beakStyle: "Stout, pointed, strong.",
    beakUsage: "Cracking acorns, nuts; eating insects, seeds.",
    mass: 85,
    size: 28,
    wingspan: 38,
    plumage: "Bright blue crest and back, white face, black necklace.",
    vocalization: "Loud 'jay-jay', whistles, excellent mimic (e.g., hawks).",
    socialBehavior: "Social in family groups, bold, assertive, known for mobbing predators.",
  },
  {
    species: "Fish Crow",
    eq: "High (similar to American Crow)",
    habitat: "Primarily southern/central IN, near rivers, lakes.",
    beakStyle: "Slightly more slender than American Crow, subtle hook.",
    beakUsage: "Emphasis on aquatic food: fish, crustaceans, carrion.",
    mass: 300,
    size: 38,
    wingspan: 88,
    plumage: "Entirely black, often slightly glossier than American Crow.",
    vocalization: "Distinctly nasal 'cah' or a two-note 'uh-uh'.",
    socialBehavior: "Gregarious, often in flocks, especially when foraging.",
  },
  {
    species: "Common Raven",
    eq: "Very High (often cited ~2.49)",
    habitat: "Rare but increasing; rugged, forested areas, bluffs.",
    beakStyle: "Large, heavy, powerful, with a distinct curve.",
    beakUsage: "Scavenging large carrion, hunting small animals, tearing flesh.",
    mass: 1300,
    size: 62,
    wingspan: 132,
    plumage: "Entirely black, shaggy throat feathers (hackles), glossy.",
    vocalization: "Deep, resonant 'gronk-gronk', croaks, toots.",
    socialBehavior: "Often in pairs or family groups; complex social interactions.",
  },
];

const myths = [
    { id: 'omen', title: 'Corvids are omens of bad luck.' },
    { id: 'talk', title: 'Splitting a crow\'s tongue helps it talk.' },
    { id: 'intelligence', title: 'Corvids are unintelligent "bird brains".' }
];

const App = () => {
  const [selectedCorvid, setSelectedCorvid] = useState(corvidData[0]);
  const [aiSummary, setAiSummary] = useState('');
  const [mythExplanations, setMythExplanations] = useState<MythExplanations>({});
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingMyth, setIsLoadingMyth] = useState<string | null>(null); // State to track which myth is being loaded
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (!chartRef.current) return;
    const myChartRef = chartRef.current.getContext('2d');
    if (!myChartRef) return;
    
    chartInstance.current = new Chart(myChartRef, {
      type: 'bar',
      data: {
        labels: corvidData.map(c => c.species),
        datasets: [
          {
            label: 'Average Mass (g)',
            data: corvidData.map(c => c.mass),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { ticks: { color: '#d1d5db' } },
          x: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#ffffff',
            bodyColor: '#d1d5db',
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const handleSelectCorvid = (corvid: Corvid) => {
    setSelectedCorvid(corvid);
    setAiSummary('');
  };

  const callGeminiAPI = async (prompt: string) => {
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        console.error("apiKey undefined");
        return;

      }
      const apiKey = GEMINI_API_KEY
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
          });

          if (!response.ok) {
              return `Error: API request failed with status ${response.status}.`;
          }

          const result = await response.json();
          if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
              return result.candidates[0].content.parts[0].text;
          } else {
              return 'Could not generate a response. The AI model returned an unexpected format.';
          }
      } catch (error: unknown) {
          console.error("Gemini API Error:", error);
          return `An error occurred: ${(error as AppError).message}. Please check the console.`;
      }
  };

  const generateSummary = async () => {
    if (!selectedCorvid) return;
    setIsLoadingSummary(true);
    setAiSummary('');

    const prompt = `Based on the following data for the corvid species "${selectedCorvid.species}", generate a concise, engaging summary (2-3 sentences) suitable for an infographic. Highlight its most distinctive characteristics.
Data:
- Mass: ${selectedCorvid.mass}g
- Habitat: ${selectedCorvid.habitat}
- Key Features: ${selectedCorvid.vocalization}, ${selectedCorvid.socialBehavior}.`;
    
    const summary = await callGeminiAPI(prompt);
    setAiSummary(summary);
    setIsLoadingSummary(false);
  };

  const debunkMyth = async (mythId: string, mythTitle: string) => {
      setIsLoadingMyth(mythId);
      setMythExplanations(prev => ({...prev, [mythId]: ''}));

      const prompt = `Explain in a clear and engaging way why the following common myth about corvids is not true: "${mythTitle}". Focus on the scientific facts and cultural context. Keep it concise (3-4 sentences).`;
      
      const explanation = await callGeminiAPI(prompt);
      setMythExplanations(prev => ({...prev, [mythId]: explanation}));
      setIsLoadingMyth(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-400">Interactive Corvid Analysis</h1>
          <p className="text-lg text-gray-400 mt-2">An AI-Enhanced Infographic for Indiana Species</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <section className="lg:col-span-3 bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Species Deep Dive</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {corvidData.map((corvid) => (
                <button
                  key={corvid.species}
                  onClick={() => handleSelectCorvid(corvid)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                    selectedCorvid.species === corvid.species
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {corvid.species}
                </button>
              ))}
            </div>

            {selectedCorvid && (
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{selectedCorvid.species}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-700 p-3 rounded-lg"><p className="text-xs text-blue-400 uppercase tracking-wider">Mass</p><p className="font-bold text-xl">{selectedCorvid.mass} g</p></div>
                    <div className="bg-gray-700 p-3 rounded-lg"><p className="text-xs text-blue-400 uppercase tracking-wider">Size</p><p className="font-bold text-xl">{selectedCorvid.size} cm</p></div>
                    <div className="bg-gray-700 p-3 rounded-lg"><p className="text-xs text-blue-400 uppercase tracking-wider">Wingspan</p><p className="font-bold text-xl">{selectedCorvid.wingspan} cm</p></div>
                </div>
                
                <div className="text-sm space-y-3 pt-2">
                    <p><strong className="font-semibold text-blue-400">Habitat:</strong> {selectedCorvid.habitat}</p>
                    <p><strong className="font-semibold text-blue-400">Vocalization:</strong> {selectedCorvid.vocalization}</p>
                    <p><strong className="font-semibold text-blue-400">Key Behavior:</strong> {selectedCorvid.socialBehavior}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={generateSummary}
                    disabled={isLoadingSummary}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {isLoadingSummary ? 'Generating...' : '✨ Generate AI Summary'}
                  </button>
                </div>
                
                {aiSummary && (
                   <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                       <h4 className="font-bold text-blue-300">AI-Generated Overview</h4>
                       <p className="text-gray-300 text-sm mt-2">{aiSummary}</p>
                   </div>
                )}
              </div>
            )}
          </section>

          <aside className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-white/10">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">Comparative Mass</h2>
                <div className="chart-container h-64">
                  <canvas ref={chartRef} />
                </div>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-white/10">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">AI Myth Debunker</h2>
                <div className="space-y-4">
                    {myths.map(myth => (
                        <div key={myth.id}>
                            <p className="font-semibold text-gray-300">{myth.title}</p>
                            <button 
                                onClick={() => debunkMyth(myth.id, myth.title)}
                                disabled={!!isLoadingMyth}
                                className="text-xs bg-blue-800 hover:bg-blue-700 disabled:bg-gray-600 text-blue-200 font-semibold py-1 px-3 rounded-full transition-colors mt-1"
                            >
                                {isLoadingMyth === myth.id ? 'Debunking...' : '✨ Explain with AI'}
                            </button>
                            {mythExplanations[myth.id] && (
                                <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-700/50 rounded">{mythExplanations[myth.id]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default App;
