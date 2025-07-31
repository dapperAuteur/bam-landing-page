"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { IInfoCardProps, IStatCardProps } from "./../../../types/propTypes";

interface IInfoCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface IStatCardProps {
  value: string;
  label: string;
  color: string;
}
// --- Helper Components ---

// A reusable type for icon components that can be styled
interface IIconProps {
  className?: string;
}

const Icon = ({ path, className = "w-6 h-6" }: { path: string, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

const ArrowRightIcon = ({ className }: IIconProps) => <Icon path="M16.01 11H4v2h12.01v3L20 12l-3.99-4z" className={className} />;
const BuildingLibraryIcon = ({ className }: IIconProps) => <Icon path="M12 3L4 9v12h16V9l-8-6zm-2 14H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V7h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" className={className} />;
const FactoryIcon = ({ className }: IIconProps) => <Icon path="M2 22v-6h2v4h16v-4h2v6H2zm18-8H4V4h16v10zM14 8h-4v2h4V8z" className={className} />;
const TrainIcon = ({ className }: IIconProps) => <Icon path="M12 2c-4.42 0-8 .5-8 4v10c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4zm-1.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 11H4V7h8v4z" className={className} />;
const BriefcaseIcon = ({ className }: IIconProps) => <Icon path="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" className={className} />;
const LightbulbIcon = ({ className }: IIconProps) => <Icon path="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" className={className} />;

// --- Gemini API Call ---
// NOTE: This is a mocked API call for demonstration.
// In a real environment, this would make a fetch request to the Gemini API.
const callGeminiAPI = async (prompt: string) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (prompt.includes("Chicago")) {
                resolve({
                    text: () => "Chicago was a primary destination for migrants from Mississippi, Alabama, and Louisiana, traveling the Illinois Central Railroad. The city's Black population surged over 500% by 1940, leading to the creation of the vibrant 'Black Belt' (Bronzeville). Migrants found work in meatpacking plants and steel mills but faced severe housing segregation and the 1919 race riots. This environment fostered a boom in Black-owned businesses and institutions like the Chicago Defender newspaper and the birth of gospel music."
                });
            } else if (prompt.includes("New York")) {
                resolve({
                    text: () => "New York City, particularly Harlem, became the epicenter for migrants from the Atlantic coast. It was the heart of the Harlem Renaissance, a cultural explosion in literature, music, and art, fueled by new arrivals. Migrants found opportunities but also faced crowded living conditions and high rents. Institutions like the National Urban League and Abyssinian Baptist Church were crucial in helping newcomers adjust to urban life."
                });
            } else if (prompt.includes("Detroit")) {
                resolve({
                    text: () => "Detroit attracted migrants from the Deep South and Appalachia, drawn by the promise of high wages in the burgeoning auto industry, famously at Henry Ford's plants. The Black population grew by an astonishing 2500% by 1940. While offering economic mobility, the city was also a site of intense racial friction over jobs and housing, leading to the creation of neighborhoods like Paradise Valley and significant social tensions."
                }
            );
            } else if (prompt.includes("Harlem Renaissance")) {
                resolve({
                    text: () => "The Harlem Renaissance was a cultural, social, and artistic explosion centered in Harlem, New York, spanning the 1920s. It was the 'spiritual coming of age' for African Americans, where a 'New Negro' identity emerged—assertive, proud, and self-determined. Fueled by the Great Migration, it produced literary giants like Langston Hughes and Zora Neale Hurston, jazz legends like Duke Ellington and Louis Armstrong, and artists like Aaron Douglas. It wasn't just art; it was a movement that redefined Black identity and challenged racial stereotypes on a national stage."
                });
            } else {
                resolve({ text: () => "Details for this location are being retrieved. The Great Migration transformed this city, bringing new culture, labor, and challenges." });
            }
        }, 1000);
    });
};


// --- Main Components ---

const Header = () => (
    <header className="bg-gray-800 text-white p-4 text-center rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-serif">An Exodus in the Land of Promise</h1>
        <p className="text-lg md:text-xl mt-2 text-gray-300">The Great Migration of African Americans, 1910-1970</p>
    </header>
);

const Section = ({ title, icon, children }: IInfoCardProps) => (
    <section className="mb-12 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-full mr-4">{icon}</div>
            <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="prose max-w-none text-gray-700">
            {children}
        </div>
    </section>
);

const StatCard = ({ value, label, color }: IStatCardProps) => (
    <div className={`p-4 rounded-lg text-white text-center shadow-md ${color}`}>
        <p className="text-4xl font-bold">{value}</p>
        <p className="text-sm font-medium">{label}</p>
    </div>
);

interface IGeminiModalProps {
    city: string;
    onClose: () => void;
    prompt: string;
}

const GeminiModal = ({ city, onClose, prompt }: IGeminiModalProps) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const response: any = await callGeminiAPI(prompt);
                const text = await response.text();
                setContent(text);
            } catch (error) {
                console.error("Error fetching Gemini content:", error);
                setContent("Sorry, we couldn't retrieve the details at this time.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [prompt]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h3 className="text-2xl font-bold mb-4 text-blue-700">{city}</h3>
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">Loading details...</p>
                    </div>
                ) : (
                    <p className="text-gray-700 leading-relaxed">{content}</p>
                )}
            </div>
        </div>
    );
};

interface IMigrationMapProps {
    onCityClick: (city: string) => void;
}

const MigrationMap = ({ onCityClick }: IMigrationMapProps) => {
    const cities = [
        { name: 'New York', x: '82%', y: '28%' },
        { name: 'Chicago', x: '58%', y: '32%' },
        { name: 'Detroit', x: '65%', y: '30%' },
    ];

    return (
        <div className="relative bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
            <svg viewBox="0 0 800 500" className="w-full h-auto">
                {/* Map Background (Simplified USA) */}
                <path d="M74,343L110,432L219,442L283,383L312,410L404,401L445,343L432,298L448,250L401,215L437,175L504,160L549,191L595,168L628,119L692,111L726,92L738,44L688,27L622,42L572,21L510,42L458,26L404,47L366,25L304,47L265,33L205,53L163,33L97,52L54,82L33,142L21,211L43,281L74,343Z" fill="#e0e0e0" stroke="#bdbdbd" />
                
                {/* Migration Paths */}
                <path d="M 350,380 C 450,300 550,200 580,175" stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="8 4" className="animate-dash" />
                <text x="400" y="320" fill="#ef4444" fontSize="14" className="font-semibold">Central</text>

                <path d="M 420,350 C 500,280 600,180 680,115" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="8 4" className="animate-dash" style={{animationDelay: '0.5s'}} />
                <text x="500" y="280" fill="#3b82f6" fontSize="14" className="font-semibold">Eastern</text>
                
                <path d="M 400,300 C 450,250 500,200 560,170" stroke="#10b981" strokeWidth="3" fill="none" strokeDasharray="8 4" className="animate-dash" style={{animationDelay: '1s'}} />
                <text x="420" y="250" fill="#10b981" fontSize="14" className="font-semibold">Appalachian</text>

                {/* Cities */}
                {cities.map(city => (
                    <g key={city.name} onClick={() => onCityClick(city.name)} className="cursor-pointer group">
                        <circle cx={city.x} cy={city.y} r="8" fill="#1d4ed8" className="group-hover:fill-yellow-400 transition-colors" />
                        <circle cx={city.x} cy={city.y} r="12" fill="transparent" />
                        <text x={city.x} y={city.y} dy="-15" textAnchor="middle" fontSize="14" fill="#1e293b" className="font-bold group-hover:text-blue-700 transition-colors">{city.name}</text>
                    </g>
                ))}
            </svg>
            <style>
                {`
                    .animate-dash {
                        stroke-dashoffset: 1000;
                        animation: dash 5s linear forwards;
                    }
                    @keyframes dash {
                        to {
                            stroke-dashoffset: 0;
                        }
                    }
                `}
            </style>
        </div>
    );
};

const PopulationChart = () => {
    const data = useMemo(() => [
        { city: 'New York', start: 91709, end: 1666761 },
        { city: 'Chicago', start: 44103, end: 1102620 },
        { city: 'Detroit', start: 5741, end: 660428 },
        { city: 'Philadelphia', start: 84459, end: 653791 },
    ], []);

    const maxPop = Math.max(...data.map(d => d.end));

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">Black Population Growth (1910 vs 1970)</h3>
            <div className="space-y-4">
                {data.map(item => (
                    <div key={item.city}>
                        <p className="font-semibold text-gray-600">{item.city}</p>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="w-24 text-right text-sm text-gray-500">{item.start.toLocaleString()}</div>
                            <div className="flex-grow bg-gray-200 rounded-full h-6">
                                <div 
                                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                                    style={{ width: `${(item.end / maxPop) * 100}%` }}
                                >
                                    {item.end.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ILearnMoreButtonProps {
    topic: string;
    onLearnMore: (topic: string, prompt: string) => void;
}

const LearnMoreButton = ({ topic, onLearnMore }: ILearnMoreButtonProps) => (
    <button
        onClick={() => onLearnMore(topic, `Tell me more about the ${topic}.`)}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
    >
        Learn More about the {topic} <LightbulbIcon className="w-5 h-5 ml-2" />
    </button>
);


// --- App Component ---

export default function App() {
    const [modalCity, setModalCity] = useState('');
    const [modalPrompt, setModalPrompt] = useState('');

    const handleCityClick = useCallback((city: string) => {
        setModalPrompt(`What was the Great Migration experience like in ${city}?`);
        setModalCity(city);
    }, []);
    
    const handleLearnMore = useCallback((topic: string, prompt: string) => {
        setModalPrompt(prompt);
        setModalCity(topic);
    }, []);

    const closeModal = useCallback(() => {
        setModalCity('');
        setModalPrompt('');
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <Header />

                <Section title="The World They Left Behind" icon={<Icon path="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />}>
                    <p>The Great Migration was a courageous act of agency by six million African Americans to escape the oppressive Jim Crow South. They fled a system of legal segregation, political disenfranchisement, economic exploitation through sharecropping, and the constant terror of racial violence. As one migrant wrote, they sought to go "where a man is a man."</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <StatCard value="6 Million" label="People Migrated" color="bg-red-500" />
                        <StatCard value="90% to 50%" label="Black population in the South (1900-1970)" color="bg-yellow-500" />
                        <StatCard value="3x+" label="Potential wage increase in the North" color="bg-green-500" />
                    </div>
                </Section>

                <Section title="The Journey North" icon={<TrainIcon />}>
                    <p>The journey was an ordeal, but it followed distinct corridors defined by railroad lines. These routes became lifelines, connecting specific Southern regions to corresponding Northern cities and forging enduring cultural ties.</p>
                    <MigrationMap onCityClick={handleCityClick} />
                    <p className="text-sm text-center mt-2 text-gray-500">Click on a city to learn about its migrant experience.</p>
                </Section>

                <Section title="A New Life: Promise & Paradox" icon={<BuildingLibraryIcon />}>
                    <p>Northern cities offered economic opportunity and freedom from Jim Crow laws, but not from racism. Migrants faced de facto segregation, fierce competition for jobs and housing, and racial violence like the "Red Summer" of 1919. They were confined to overcrowded ghettos but transformed these spaces into vibrant centers of Black life.</p>
                    <PopulationChart />
                </Section>

                <Section title="Forging a New World" icon={<FactoryIcon />}>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">Community & Enterprise</h3>
                            <p>Migrants built powerful institutions. Churches like Chicago's Olivet Baptist became social service hubs. Mutual aid societies provided a crucial safety net. This resilience fueled a boom in Black-owned businesses, guided by the "Double Duty Dollar" philosophy—patronizing Black businesses to strengthen the entire community.</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2">A Cultural Renaissance</h3>
                            <p>The concentration of talent in cities like New York and Chicago ignited a cultural explosion. The Harlem Renaissance gave voice to the "New Negro," producing legendary writers, artists, and musicians who reshaped American culture and instilled a new sense of pride and consciousness.</p>
                            <LearnMoreButton topic="Harlem Renaissance" onLearnMore={handleLearnMore} />
                        </div>
                    </div>
                </Section>
                
                <Section title="The Enduring Legacy" icon={<BriefcaseIcon />}>
                    <p>The Great Migration nationalized the American racial dilemma and created a powerful Black urban electorate that became a key catalyst for the Civil Rights Movement. It unlocked vast economic and creative potential, leading to higher incomes and education for future generations. In a surprising reversal, a "New Great Migration" is now seeing descendants return to a transformed, "New South"—a testament to the profound and lasting changes the original exodus set in motion.</p>
                </Section>

                {modalCity && <GeminiModal city={modalCity} onClose={closeModal} prompt={modalPrompt} />}

                <footer className="text-center text-gray-500 mt-12 pb-4">
                    <p>An interactive infographic based on "An Exodus in the Land of Promise."</p>
                </footer>
            </div>
        </div>
    );
}
