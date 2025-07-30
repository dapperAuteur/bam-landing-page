"use client"
import React, { useState } from 'react';

interface IconProps {
    className: string;
}

// --- Helper Icons (as SVG components) ---
const TrophyIcon = ({ className }: IconProps) => {
    console.log('typeof className :>> ', typeof className);
    return (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.5 2h-13A2.5 2.5 0 003 4.5V9c0 4.42 3.58 8 8 8s8-3.58 8-8V4.5A2.5 2.5 0 0018.5 2zM11 15c-2.76 0-5-2.24-5-5h10c0 2.76-2.24 5-5 5z" /><path d="M11 18h2v3h-2z" /><path d="M10 21h4v2h-4z" />
  </svg>
)};
const CalendarIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14a2 2 0 002-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
  </svg>
);
const LocationIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
  </svg>
);
const FlagIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
    </svg>
);
const DownloadIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
);
const SparklesIcon = ({ className }: IconProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.37 6.94h7.26l-5.88 4.28 2.24 6.88-5.99-4.34-5.99 4.34 2.24-6.88-5.88-4.28h7.26L12 2z" />
    </svg>
);

interface Athlete {
      name: string;
      age: number;
      nationality: string;
      achievement: string;
      date: string;
      location: string;
      bio: string;
      imageUrl: string;
}
// --- Athlete Data ---
const athletes: Athlete[] = [
    {
      name: "Lester Wright",
      age: 100,
      nationality: "United States",
      achievement: "100m in 26.34s",
      date: "2022-04-30",
      location: "Philadelphia, PA",
      bio: "A WWII veteran who earned four Bronze Battle Stars, Wright was also a successful dentist. He started running in the 1930s and was married to his high school sweetheart for over 80 years. His consistent training showcased a lifelong dedication to fitness.",
      imageUrl: "https://placehold.co/400x400/3498db/ffffff?text=Lester+W.",
    },
    {
      name: "Donald Pellmann",
      age: 100,
      nationality: "United States",
      achievement: "100m in 26.99s",
      date: "2015-09-20",
      location: "San Diego, CA",
      bio: "Set five world records in a single day at 100. He started competitive running at age 70 after a career at General Motors where he worked on the Apollo space program. His life motto was 'Someone has to do it'.",
      imageUrl: "https://placehold.co/400x400/2ecc71/ffffff?text=Donald+P.",
    },
    {
      name: "Hidekichi Miyazaki",
      age: 105,
      nationality: "Japan",
      achievement: "100m in 42.22s",
      date: "2015-09-23",
      location: "Kyoto, Japan",
      bio: "Nicknamed 'Golden Bolt', he started sprinting in his 90s. He famously mimicked Usain Bolt's lightning pose and expressed a desire to race him. He attributed his health to daily exercise and mindful eating.",
      imageUrl: "https://placehold.co/400x400/e74c3c/ffffff?text=Hidekichi+M.",
    },
    {
      name: "Ida Keeling",
      age: 100,
      nationality: "United States",
      achievement: "100m in 1:17.33",
      date: "2016-04-30",
      location: "Philadelphia, PA",
      bio: "Began running at 67 to cope with personal tragedy. Her journey became a powerful example of using fitness for healing and resilience. She held multiple world records and believed in exercise for both body and mind.",
      imageUrl: "https://placehold.co/400x400/9b59b6/ffffff?text=Ida+K.",
    },
    {
      name: "Julia Hawkins",
      age: 105,
      nationality: "United States",
      achievement: "100m in 1:02.95",
      date: "2021",
      location: "Louisiana, USA",
      bio: "Nicknamed 'Hurricane', she transitioned from competitive cycling to running after turning 100. She advised everyone to 'stay active if you want to be healthy and happy' and to find 'magic moments' in everyday life.",
      imageUrl: "https://placehold.co/400x400/f1c40f/ffffff?text=Julia+H.",
    },
    {
      name: "Stanisław Kowalski",
      age: 105,
      nationality: "Poland",
      achievement: "100m in 34.50s",
      date: "2015-06-27",
      location: "Torun, Poland",
      bio: "Became the oldest person in Europe to run a 100m race. He credited his longevity to never going to the doctor and doing whatever he wanted. He began running competitively at age 104.",
      imageUrl: "https://placehold.co/400x400/e67e22/ffffff?text=Stanisław+K.",
    }
];

// --- Gemini API Caller ---
async function generateTip(athlete: Athlete) {
    const prompt = `Based on the inspiring story of ${athlete.name} (${athlete.age}), who achieved ${athlete.achievement} and whose life philosophy included themes of ${athlete.bio.includes('resilience') ? 'resilience' : 'dedication'}, generate a short, one-sentence motivational fitness tip.`;
    
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const apiKey = GEMINI_API_KEY; // API key will be automatically provided by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected response structure:", result);
            return "Embrace every day as a new opportunity to move and be well.";
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Start small, stay consistent, and celebrate every step of your journey.";
    }
}


// --- Main App Component ---
export default function App() {
    const [generatingTips, setGeneratingTips] = useState<Record<string, boolean>>({});
    const [generatedTips, setGeneratedTips] = useState<Record<string, string>>({});
    const [isExporting, setIsExporting] = useState(false);

    const handleGenerateTip = async (athleteName: string) => {
        setGeneratingTips(prev => ({ ...prev, [athleteName]: true }));
        const athlete = athletes.find(a => a.name === athleteName);
        if (athlete) {
            const tip = await generateTip(athlete);
            setGeneratedTips(prev => ({ ...prev, [athleteName]: tip }));
        } else {
            console.error(`Athlete "${athleteName}" not found.`);
        }
        // const tip = await generateTip(athlete);
        // setGeneratedTips(prev => ({ ...prev, [athleteName]: tip }));
        setGeneratingTips(prev => ({ ...prev, [athleteName]: false }));
    };

    const exportToCSV = () => {
        setIsExporting(true);
        const headers = ["Name", "Age", "Nationality", "Achievement", "Date", "Location", "Bio"];
        const rows = athletes.map(athlete => 
            [
                `"${athlete.name}"`,
                athlete.age,
                `"${athlete.nationality}"`,
                `"${athlete.achievement}"`,
                `"${athlete.date}"`,
                `"${athlete.location}"`,
                `"${athlete.bio.replace(/"/g, '""')}"` // Handle quotes in bio
            ].join(',')
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "centenarian_athletes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => setIsExporting(false), 1000);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">
            <div className="container mx-auto px-4 py-8 md:py-12">
                
                {/* Header */}
                <header className="text-center mb-10 md:mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Ageless Wonders</h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                        Discover the incredible stories of centenarian athletes who defy the limits of age.
                    </p>
                </header>

                {/* Export Button */}
                <div className="flex justify-center mb-12">
                    <button 
                        onClick={exportToCSV}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-indigo-300"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        {isExporting ? 'Exporting...' : 'Export to CSV'}
                    </button>
                </div>
                
                {/* Athlete Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {athletes.map((athlete) => (
                        <div key={athlete.name} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col">
                            <img className="w-full h-56 object-cover" src={athlete.imageUrl} alt={`Portrait of ${athlete.name}`} />
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-2xl font-bold text-slate-900">{athlete.name}</h2>
                                <p className="text-slate-500 mb-4">Age: {athlete.age}</p>
                                
                                <div className="space-y-3 mb-4 text-sm text-slate-700">
                                    <div className="flex items-center gap-3">
                                        <TrophyIcon className="w-5 h-5 text-amber-500" />
                                        <span className="font-semibold">{athlete.achievement}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FlagIcon className="w-5 h-5 text-sky-500" />
                                        <span>{athlete.nationality}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="w-5 h-5 text-rose-500" />
                                        <span>{athlete.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <LocationIcon className="w-5 h-5 text-emerald-500" />
                                        <span>{athlete.location}</span>
                                    </div>
                                </div>
                                
                                <p className="text-slate-600 text-base mb-auto leading-relaxed">{athlete.bio}</p>

                                <div className="mt-6 pt-4 border-t border-slate-200">
                                    {generatedTips[athlete.name] ? (
                                        <div className="p-3 bg-indigo-50 rounded-lg text-center">
                                            <p className="text-indigo-800 italic">&quot;{generatedTips[athlete.name]}&quot;</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleGenerateTip(athlete.name)}
                                            disabled={generatingTips[athlete.name]}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-md shadow-sm hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                                        >
                                            <SparklesIcon className="w-5 h-5"/>
                                            {generatingTips[athlete.name] ? 'Generating...' : 'Get AI Fitness Tip'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                 {/* Footer */}
                <footer className="text-center mt-16 text-slate-500">
                    <p>Powered by React & Gemini. Data compiled from public records.</p>
                </footer>
            </div>
        </div>
    );
}

