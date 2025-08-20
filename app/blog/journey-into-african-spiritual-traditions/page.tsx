"use client";

import React, { useState } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, BubbleController, ChartOptions } from 'chart.js';
import { AppError } from '../../../types/errors';
import { Radar, Bubble, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, BubbleController);

interface SpiritualData {
    [key: string]: {
        name: string;
        region: string;
        description: string;
        aiPromptContext: string;
    };
}

// -- Data Object --
// This object holds all the static content for the infographic.
const spiritualData: SpiritualData = {
    yoruba: {
        name: "Yoruba Ifá/Orisha",
        region: "West Africa",
        description: "This tradition features a Supreme Creator, Olodumare, and a vast pantheon of Orishas who govern aspects of life and nature. The radar chart visualizes the domains of influence for several key Orishas.",
        aiPromptContext: "Yoruba tradition, which values wisdom (Ifá), community, destiny (Ori), and the power of nature through Orishas like Shango (justice) and Oshun (love)."
    },
    zulu: {
        name: "Zulu Ancestral Veneration",
        region: "Southern Africa",
        description: "Zulu spirituality centers on the Supreme Being, Unkulunkulu, and the Amadlozi (ancestral spirits) who act as vital intermediaries. This pyramid illustrates the clear spiritual hierarchy.",
        aiPromptContext: "Zulu tradition, which is centered on ancestral veneration (Amadlozi), the concept of Ubuntu (I am because we are), and a deep respect for social order and lineage."
    },
    kongo: {
        name: "Kongo Religion",
        region: "Central Africa",
        description: "The Kongo worldview is captured in the Dikenga cosmogram. It represents the cyclical journey of the soul through birth, life, death, and spiritual existence, connecting the two worlds.",
        aiPromptContext: "Kongo spirituality, which is symbolized by the Dikenga cosmogram representing the cyclical nature of life and the connection between the physical and spirit worlds (Ku Nseke and Ku Mpèmba)."
    },
    san: {
        name: "San Traditional Religion",
        region: "Southern Africa",
        description: "As one of the world's oldest cultures, San spirituality is deeply tied to nature and shamanism. The trance dance is the central ritual, connecting the community to the spirit world for healing and guidance.",
         aiPromptContext: "San tradition, one of the world's oldest, which involves a deep connection to nature, the spirit world through a trance dance, and the creator-trickster god ǀKágge̥n."
    },
    igbo: {
        name: "Igbo Odinani",
        region: "West Africa",
        description: "Odinani features a Supreme Being, Chukwu, a personal spirit (Chi), and deities called Arusi. The earth goddess Ala is paramount. This chart compares the conceptual influence of key Arusi.",
         aiPromptContext: "Igbo Odinani, which emphasizes a personal spiritual guide (Chi), a supreme creator (Chukwu), and the moral authority of the earth goddess Ala, who governs ethics and justice."
    },
    akan: {
        name: "Akan Spirituality",
        region: "West Africa",
        description: "Akan ethics are transmitted through a rich visual language of Adinkra symbols. Each symbol represents a concept or proverb that guides communal life and moral conduct.",
        aiPromptContext: "Akan tradition, which uses Adinkra symbols to convey concepts like God's supremacy (Gye Nyame) and the wisdom of learning from the past (Sankofa), all rooted in a belief in the creator Onyame."
    }
};

// -- Color Palette --
const chartColors = {
    yellow: '#FFC947',
    orange: '#FF884B',
    purple: '#3D3B8E',
    blue: '#005086',
    lightPurple: 'rgba(61, 59, 142, 0.6)',
    lightOrange: 'rgba(255, 136, 75, 0.6)',
    lightYellow: 'rgba(255, 201, 71, 0.6)',
    lightBlue: 'rgba(0, 80, 134, 0.6)',
};

// -- Reusable Components --

const CoreConceptCard = ({ icon, title, children }: { icon: string; title: string; children?: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
        <div className="text-5xl mb-4 flex justify-center items-center h-16">{icon}</div>
        <h3 className="text-xl font-semibold text-[#005086]">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{children}</p>
    </div>
);

const TraditionCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col ${className}`}>
        {children}
    </div>
);

const AIGeneratorButton = ({ onClick, isLoading, children }: { onClick: () => void; isLoading: boolean; children?: React.ReactNode }) => (
     <button
        onClick={onClick}
        disabled={isLoading}
        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-[#FF884B] text-white font-semibold rounded-lg shadow-md hover:bg-[#E57A42] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF884B] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
            </>
        ) : (
            children
        )}
    </button>
);

const AIOutputCard = ({ content }: { content: string | undefined }) => {
  return (
    content && (
        <div className="mt-4 p-4 bg-[#FFF8F0] border-l-4 border-[#FFC947] rounded-r-lg">
            <p className="text-sm text-[#3D3B8E] italic">{content}</p>
        </div>
    )
)};

// -- Chart Components --

const YorubaRadarChart = () => {
    const data = {
        labels: ['Nature', 'Justice', 'Wisdom', 'Community', 'Destiny', 'Protection'],
        datasets: [{
            label: 'Shango',
            data: [3, 5, 2, 4, 3, 3],
            backgroundColor: 'rgba(255, 136, 75, 0.4)',
            borderColor: chartColors.orange,
            pointBackgroundColor: chartColors.orange
        }, {
            label: 'Oshun',
            data: [5, 2, 3, 5, 4, 2],
            backgroundColor: 'rgba(255, 201, 71, 0.4)',
            borderColor: chartColors.yellow,
            pointBackgroundColor: chartColors.yellow
        }, {
            label: 'Ogun',
            data: [2, 5, 2, 4, 1, 5],
            backgroundColor: 'rgba(0, 80, 134, 0.4)',
            borderColor: chartColors.blue,
            pointBackgroundColor: chartColors.blue
        }]
    };
    const options: ChartOptions<'radar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
            r: {
                angleLines: { color: 'rgba(0,0,0,0.1)' },
                grid: { color: 'rgba(0,0,0,0.1)' },
                pointLabels: { font: { size: 12 } },
                suggestedMin: 0,
                suggestedMax: 5,
                ticks: { backdropColor: '#FFF8F0', stepSize: 1 }
            }
        }
    };
    return <Radar data={data} options={options} />;
};

const SanBubbleChart = () => {
    const data = {
        datasets: [{
            label: 'Trance Dance',
            data: [{ x: 5, y: 5, r: 25 }],
            backgroundColor: chartColors.lightPurple
        }, {
            label: 'Shamanism',
            data: [{ x: 3, y: 4, r: 20 }],
            backgroundColor: chartColors.lightOrange
        }, {
            label: 'Eland Spirit',
            data: [{ x: 7, y: 3, r: 18 }],
            backgroundColor: chartColors.lightOrange
        }, {
            label: 'Rock Art',
            data: [{ x: 2, y: 7, r: 15 }],
            backgroundColor: chartColors.lightYellow
        }, {
            label: 'Healing',
            data: [{ x: 8, y: 7, r: 16 }],
            backgroundColor: chartColors.lightBlue
        }]
    };
    const options = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } }
    };
    return <Bubble data={data} options={options} />;
};

const IgboBarChart = () => {
    const data = {
        labels: ['Ala (Earth Goddess)', 'Amadioha (Thunder)', 'Ikenga (Achievement)', 'Agwu (Divination)'],
        datasets: [{
            label: 'Conceptual Influence',
            data: [95, 75, 60, 50],
            backgroundColor: [chartColors.purple, chartColors.orange, chartColors.blue, chartColors.yellow],
        }]
    };
    const options: ChartOptions<'bar'> = {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { display: false } }, y: { grid: { display: false } } }
    };
    return <Bar data={data} options={options} />;
};


// -- Main Infographic Component --

export default function AfricanSpiritualityInfographic() {
    const [aiOutputs, setAiOutputs] = useState<{ [key: string]: string }>({});
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    
    const handleAIGenerate = async (traditionKey: string, type: string) => {
        const uniqueId = `${traditionKey}-${type}`;
        setLoadingStates(prev => {
            return ({ ...prev, [uniqueId]: true })
    });

        const { aiPromptContext } = spiritualData[traditionKey];
        let prompt;

        if (type === 'proverb') {
            prompt = `Based on the core ideas of the ${aiPromptContext}, generate one short, insightful proverb that reflects this tradition's worldview. The proverb should sound authentic but be an original creation. Example format: "The river that forgets its source will soon run dry."`;
        } else { // reflection
            prompt = `Based on the core ideas of the ${aiPromptContext}, generate one thought-provoking, open-ended question for personal reflection. The question should encourage deep thinking about the tradition's values. Example format: "How does the idea of a personal destiny (Ori) influence your view of life's challenges?"`;
        }
        
        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const apiKey = GEMINI_API_KEY; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                const text = result.candidates[0].content.parts[0].text;
                setAiOutputs(prev => {
                    return ({ ...prev, [uniqueId]: text.trim() })
            });
            } else {
                 setAiOutputs(prev => ({ ...prev, [uniqueId]: "The AI scribe is resting. Please try again later." }));
            }
        } catch (error: unknown) {
            console.error("Gemini API call failed:", error);
            setAiOutputs(prev => ({ ...prev, [uniqueId]: `Could not connect to the AI scribe: ${(error as AppError).message}` }));
        } finally {
            setLoadingStates(prev => ({ ...prev, [uniqueId]: false }));
        }
    };

    return (
        <div className="bg-[#FFF8F0] text-gray-800 font-sans leading-relaxed">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#3D3B8E]">Unveiling the Myriad Worlds</h1>
                    <p className="text-lg md:text-xl mt-4 text-[#005086]">An Infographic Journey into African Spiritual Traditions</p>
                </header>

                <section id="core-concepts" className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10 text-[#3D3B8E]">Core Concepts: The Fabric of Belief</h2>
                    <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <CoreConceptCard icon="🌍" title="Rich Diversity">&quot;African Spirituality&quot; is an umbrella for countless distinct ethnic religions, not a single monolithic faith.</CoreConceptCard>
                        <CoreConceptCard icon="🗣️" title="Oral Traditions">Knowledge is a living thing, passed down through stories, songs, and proverbs, not static scripture.</CoreConceptCard>
                        <CoreConceptCard icon="🙏" title="Ancestor Veneration">The deceased remain active community members, guiding and influencing the living from the spirit world.</CoreConceptCard>
                        <CoreConceptCard icon="🌿" title="Animism & Nature">A life force connects all things. Spirits inhabit animals, plants, rivers, and mountains, demanding respect.</CoreConceptCard>
                    </div>
                </section>

                <section id="traditions">
                    <h2 className="text-3xl font-bold text-center mb-12 text-[#3D3B8E]">A Glimpse into Specific Traditions</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">

                        <TraditionCard>
                            <h3 className="text-2xl font-bold text-[#005086] mb-2">{spiritualData.yoruba.name}</h3>
                            <p className="text-sm font-semibold text-gray-500 mb-4">{spiritualData.yoruba.region}</p>
                            <p className="text-gray-700 mb-6 flex-grow">{spiritualData.yoruba.description}</p>
                            <div className="chart-container mt-auto"><YorubaRadarChart /></div>
                            <AIGeneratorButton onClick={() => handleAIGenerate('yoruba', 'proverb')} isLoading={loadingStates['yoruba-proverb']}>✨ Generate Proverb</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['yoruba-proverb']} />
                             <AIGeneratorButton onClick={() => handleAIGenerate('yoruba', 'reflection')} isLoading={loadingStates['yoruba-reflection']}>🤔 Generate Reflection</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['yoruba-reflection']} />
                        </TraditionCard>
                        
                        <TraditionCard>
                            <h3 className="text-2xl font-bold text-[#005086] mb-2">{spiritualData.zulu.name}</h3>
                            <p className="text-sm font-semibold text-gray-500 mb-4">{spiritualData.zulu.region}</p>
                            <p className="text-gray-700 mb-6 flex-grow">{spiritualData.zulu.description}</p>
                             <div className="mt-auto flex-grow flex flex-col justify-center items-center p-4 min-h-[300px]">
                                <div className="w-full max-w-xs text-center">
                                    <div className="bg-[#FFC947] text-[#3D3B8E] py-2 px-4 rounded-t-lg font-bold text-sm">Unkulunkulu</div>
                                    <div className="w-full h-0 border-l-[40px] border-l-transparent border-t-[30px] border-t-[#FFC947] border-r-[40px] border-r-transparent"></div>
                                    <div className="bg-[#FF884B] text-white py-2 px-4 font-semibold text-sm">Deities</div>
                                    <div className="w-full h-0 border-l-[40px] border-l-transparent border-t-[30px] border-t-[#FF884B] border-r-[40px] border-r-transparent"></div>
                                    <div className="bg-[#005086] text-white py-2 px-4 rounded-b-lg font-semibold text-sm">Amadlozi (Ancestors)</div>
                                </div>
                            </div>
                            <AIGeneratorButton onClick={() => handleAIGenerate('zulu', 'proverb')} isLoading={loadingStates['zulu-proverb']}>✨ Generate Proverb</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['zulu-proverb']} />
                             <AIGeneratorButton onClick={() => handleAIGenerate('zulu', 'reflection')} isLoading={loadingStates['zulu-reflection']}>🤔 Generate Reflection</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['zulu-reflection']} />
                        </TraditionCard>
                        
                        <TraditionCard>
                             <h3 className="text-2xl font-bold text-[#005086] mb-2">{spiritualData.kongo.name}</h3>
                            <p className="text-sm font-semibold text-gray-500 mb-4">{spiritualData.kongo.region}</p>
                            <p className="text-gray-700 mb-6 flex-grow">{spiritualData.kongo.description}</p>
                             <div className="mt-auto flex-grow flex flex-col justify-center items-center p-4 min-h-[300px]">
                                <div className="w-[200px] h-[200px] border-4 border-[#3D3B8E] rounded-full relative flex justify-center items-center">
                                    <div className="w-full h-1 bg-[#3D3B8E] absolute top-1/2 -translate-y-1/2"></div>
                                    <div className="w-1 h-full bg-[#3D3B8E] absolute left-1/2 -translate-x-1/2"></div>
                                    <span className="absolute -top-5 text-xs font-semibold text-[#3D3B8E]">Kala (Birth)</span>
                                    <span className="absolute -right-12 text-xs font-semibold text-[#3D3B8E]">Tukula (Life)</span>
                                    <span className="absolute -bottom-5 text-xs font-semibold text-[#3D3B8E]">Luvemba (Death)</span>
                                    <span className="absolute -left-12 text-xs font-semibold text-[#3D3B8E]">Musoni (Spirit)</span>
                                </div>
                            </div>
                            <AIGeneratorButton onClick={() => handleAIGenerate('kongo', 'proverb')} isLoading={loadingStates['kongo-proverb']}>✨ Generate Proverb</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['kongo-proverb']} />
                             <AIGeneratorButton onClick={() => handleAIGenerate('kongo', 'reflection')} isLoading={loadingStates['kongo-reflection']}>🤔 Generate Reflection</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['kongo-reflection']} />
                        </TraditionCard>
                        
                        <TraditionCard className="xl:col-span-1 lg:col-span-2">
                            <h3 className="text-2xl font-bold text-[#005086] mb-2">{spiritualData.san.name}</h3>
                            <p className="text-sm font-semibold text-gray-500 mb-4">{spiritualData.san.region}</p>
                            <p className="text-gray-700 mb-6 flex-grow">{spiritualData.san.description}</p>
                            <div className="chart-container mt-auto"><SanBubbleChart/></div>
                            <AIGeneratorButton onClick={() => handleAIGenerate('san', 'proverb')} isLoading={loadingStates['san-proverb']}>✨ Generate Proverb</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['san-proverb']} />
                             <AIGeneratorButton onClick={() => handleAIGenerate('san', 'reflection')} isLoading={loadingStates['san-reflection']}>🤔 Generate Reflection</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['san-reflection']} />
                        </TraditionCard>

                        <TraditionCard className="lg:col-span-1">
                            <h3 className="text-2xl font-bold text-[#005086] mb-2">{spiritualData.igbo.name}</h3>
                            <p className="text-sm font-semibold text-gray-500 mb-4">{spiritualData.igbo.region}</p>
                            <p className="text-gray-700 mb-6 flex-grow">{spiritualData.igbo.description}</p>
                            <div className="chart-container mt-auto"><IgboBarChart/></div>
                             <AIGeneratorButton onClick={() => handleAIGenerate('igbo', 'proverb')} isLoading={loadingStates['igbo-proverb']}>✨ Generate Proverb</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['igbo-proverb']} />
                             <AIGeneratorButton onClick={() => handleAIGenerate('igbo', 'reflection')} isLoading={loadingStates['igbo-reflection']}>🤔 Generate Reflection</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['igbo-reflection']} />
                        </TraditionCard>
                        
                        <TraditionCard className="lg:col-span-1">
                             <h3 className="text-2xl font-bold text-[#005086] mb-2">{spiritualData.akan.name}</h3>
                            <p className="text-sm font-semibold text-gray-500 mb-4">{spiritualData.akan.region}</p>
                            <p className="text-gray-700 mb-6 flex-grow">{spiritualData.akan.description}</p>
                             <div className="mt-auto flex-grow grid grid-cols-2 gap-4 text-center p-4">
                                <div className="bg-amber-100 p-4 rounded-lg flex flex-col justify-center">
                                    <h4 className="font-semibold">Gye Nyame</h4><p className="text-xs">&quot;Except God&quot;</p>
                                </div>
                                <div className="bg-amber-100 p-4 rounded-lg flex flex-col justify-center">
                                    <h4 className="font-semibold">Sankofa</h4><p className="text-xs">&quot;Return and get it&quot;</p>
                                </div>
                                <div className="bg-amber-100 p-4 rounded-lg flex flex-col justify-center">
                                    <h4 className="font-semibold">Dwennimmen</h4><p className="text-xs">&quot;Ram&apos;s horns&quot;</p>
                                </div>
                                <div className="bg-amber-100 p-4 rounded-lg flex flex-col justify-center">
                                    <h4 className="font-semibold">Denkyem</h4><p className="text-xs">&quot;Siamese crocodiles&quot;</p>
                                </div>
                            </div>
                            <AIGeneratorButton onClick={() => handleAIGenerate('akan', 'proverb')} isLoading={loadingStates['akan-proverb']}>✨ Generate Proverb</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['akan-proverb']} />
                             <AIGeneratorButton onClick={() => handleAIGenerate('akan', 'reflection')} isLoading={loadingStates['akan-reflection']}>🤔 Generate Reflection</AIGeneratorButton>
                            <AIOutputCard content={aiOutputs['akan-reflection']} />
                        </TraditionCard>

                    </div>
                </section>

                 <section id="diaspora" className="mt-20">
                    <h2 className="text-3xl font-bold text-center mb-10 text-[#3D3B8E]">Global Echoes: Diaspora and Resilience</h2>
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <p className="text-gray-700 text-center text-lg">
                            Through the transatlantic slave trade, these spiritual traditions were carried to the Americas. They didn&apos;t just survive; they adapted and evolved, blending with other faiths and giving rise to new religions like Santería in Cuba (from Yoruba), Palo Mayombe in Cuba (from Kongo), and influencing the folklore of the Caribbean through figures like Anansi (from Akan). This demonstrates their profound resilience and continuing legacy across the globe.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
