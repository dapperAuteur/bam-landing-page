"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { AppError } from '../../../types/errors';

Chart.register(...registerables);

interface Corvid {
  species: string;
  eq: string;
  habitat: string;
  beakStyle: string;
  beakUsage: string;
  flightStyle: string;
  nesting: string;
  color: string;
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
    mass: 450, // Average in grams
    size: 46, // Average in cm
    wingspan: 92, // Average in cm
    plumage: "Entirely black with a glossy, iridescent sheen.",
    vocalization: "Familiar 'caw-caw', clicks, rattles.",
    socialBehavior: "Highly social, forms large flocks and roosts.",
    flightStyle: "Direct, steady, purposeful wingbeats.",
    nesting: "Bulky stick nests high in trees, often with helpers.",
    color: "Black",
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
    flightStyle: "Undulating flight with quick wingbeats and glides.",
    nesting: "Cup-shaped nest of twigs, grass, and mud in trees.",
    color: "Blue, White, Black",
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
    flightStyle: "Direct with steady wingbeats, similar to American Crow.",
    nesting: "Stick nests in trees, often near water.",
    color: "Black",
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
    flightStyle: "Powerful, soars frequently, performs aerial acrobatics.",
    nesting: "Large stick nests on cliffs or in tall trees; pairs for life.",
    color: "Black",
  },
];

// Main Component
const CorvidInfographic = () => {
  const [selectedCorvid, setSelectedCorvid] = useState<Corvid | null>(corvidData[0]);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current?.getContext('2d');
    if (!myChartRef) {
        return;
    }
    const processLabels = (labels: string[]) => {
        return labels.map((label: string) => {
            if (label.length > 16) {
                const words = label.split(' ');
                const lines = [];
                let currentLine = '';
                words.forEach(word => {
                    if ((currentLine + word).length > 16 && currentLine.length > 0) {
                        lines.push(currentLine.trim());
                        currentLine = word + ' ';
                    } else {
                        currentLine += word + ' ';
                    }
                });
                lines.push(currentLine.trim());
                return lines;
            }
            return label;
        });
    };

    chartInstance.current = new Chart(myChartRef, {
      type: 'bar',
      data: {
        labels: processLabels(corvidData.map(c => c.species)),
        datasets: [
          {
            label: 'Average Mass (g)',
            data: corvidData.map(c => c.mass),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
                color: '#fff'
            }
          },
          x: {
              ticks: {
                  color: '#fff'
              }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff',
            },
          },
          tooltip: {
            callbacks: {
                title: function(tooltipItems: TooltipItem<'bar'>[]) {
                    const item = tooltipItems[0];
                    const label = item?.chart.data.labels?.[item.dataIndex];
                    if (Array.isArray(label)) {
                      return label.join(' ');
                    }
                    return (label as string) || '';
                }
            }
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

  const generateSummary = async () => {
    if (!selectedCorvid) return;
    setIsLoading(true);
    setAiSummary('');

    const prompt = `
        Based on the following data for the corvid species "${selectedCorvid.species}", generate a concise, engaging summary (2-3 sentences) suitable for an infographic.
        - Mass: ${selectedCorvid.mass}g
        - Size: ${selectedCorvid.size}cm
        - Wingspan: ${selectedCorvid.wingspan}cm
        - Habitat: ${selectedCorvid.habitat}
        - Key Features: ${selectedCorvid.vocalization}, ${selectedCorvid.socialBehavior}, ${selectedCorvid.flightStyle}.
        Highlight its most distinctive characteristics.
    `;
    
    const chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiKey = GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            setAiSummary(text);
        } else {
            setAiSummary('Could not generate summary.');
        }
    } catch (error: unknown) {
        console.error("Gemini API error:", error);
        setAiSummary(`Error generating summary: ${(error as AppError).message}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-400">Indiana Corvid Species Analysis</h1>
          <p className="text-lg text-gray-400 mt-2">An Interactive Infographic</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Comparative Mass Analysis</h2>
            <div className="chart-container h-96">
              <canvas ref={chartRef} />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">This chart visualizes the significant size differences among Indiana&apos;s common corvids.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Species Deep Dive</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {corvidData.map((corvid) => (
                <button
                  key={corvid.species}
                  onClick={() => handleSelectCorvid(corvid)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                    selectedCorvid?.species === corvid.species
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {corvid.species}
                </button>
              ))}
            </div>

            {selectedCorvid && (
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white">{selectedCorvid.species}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400">Mass</p>
                        <p className="font-bold text-lg">{selectedCorvid.mass} g</p>
                    </div>
                     <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400">Size</p>
                        <p className="font-bold text-lg">{selectedCorvid.size} cm</p>
                    </div>
                     <div className="bg-gray-700 p-3 rounded-lg">
                        <p className="text-gray-400">Wingspan</p>
                        <p className="font-bold text-lg">{selectedCorvid.wingspan} cm</p>
                    </div>
                </div>
                
                <div className="text-sm space-y-2">
                    <p><strong className="text-blue-400">Habitat:</strong> {selectedCorvid.habitat}</p>
                    <p><strong className="text-blue-400">Vocalization:</strong> {selectedCorvid.vocalization}</p>
                    <p><strong className="text-blue-400">Key Behavior:</strong> {selectedCorvid.socialBehavior}</p>
                </div>

                <div>
                  <button
                    onClick={generateSummary}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500"
                  >
                    {isLoading ? 'Generating...' : '✨ Generate AI Summary'}
                  </button>
                </div>
                
                {aiSummary && (
                   <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                       <h4 className="font-bold text-blue-300">AI-Generated Overview</h4>
                       <p className="text-gray-300 text-sm mt-2">{aiSummary}</p>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorvidInfographic;
