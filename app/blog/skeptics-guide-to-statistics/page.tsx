"use client"

import React, { useState, useCallback, JSX } from 'react';
import { ShieldAlert, Fingerprint, SearchX, MessageSquareWarning, BrainCircuit, ArrowRight, Loader2, Scale, Microscope, Users } from 'lucide-react';

// Main App Component
export default function App() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <MisusedStatisticsInfographic />
    </div>
  );
}

// --- Main Infographic Component ---
const MisusedStatisticsInfographic = () => {

  return (
    <div className="font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">The Skeptic&apos;s Guide to Statistics</h1>
                <p className="text-sm text-slate-500">How Data Can Be Misused & What to Look For</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Section 1: Common Statistical Traps */}
          <Section title="Common Statistical Traps" icon={<SearchX className="text-red-500" />}>
            <p className="mb-4 text-slate-600">Misinformation isn&apos;t always about fake data. Often, it&apos;s about presenting real data in a misleading way. Here are the most common traps.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TrapCard
                icon={<Fingerprint className="text-red-700" />}
                title="Cherry-Picking Data"
                description="Presenting only the data that supports a specific argument while ignoring data that contradicts it. Also known as selective reporting."
              />
              <TrapCard
                icon={<Scale className="text-orange-700" />}
                title="Correlation vs. Causation Fallacy"
                description="Claiming that because two things happen together, one must be causing the other. Always ask: could a third factor be influencing both?"
              />
              <TrapCard
                icon={<Users className="text-teal-700" />}
                title="Biased Samples & Overgeneralization"
                description="Drawing broad conclusions from a group that isn't representative of the larger population (e.g., studying only college students and applying it to everyone)."
              />
              <TrapCard
                icon={<Microscope className="text-indigo-700" />}
                title="Tiny Sample Sizes"
                description="Results from very small studies are less reliable and can be due to random chance. Be skeptical of big claims from small groups."
              />
            </div>
          </Section>

          {/* Section 2: Misleading Language */}
          <Section title="The Power of Framing & Language" icon={<MessageSquareWarning className="text-amber-500" />}>
            <p className="mb-4 text-slate-600">The way a finding is worded can dramatically change its perception, even if the numbers are the same.</p>
            <div className="space-y-4">
                 <ConceptCard
                    title="Relative vs. Absolute Risk"
                    description="A headline might scream 'Doubles Your Risk!' (a relative risk). But if the initial risk was tiny (1 in a million), the new risk (2 in a million) is still tiny. The absolute risk increase is what matters for real-world impact."
                 />
                 <ConceptCard
                    title="Misleading Percentages"
                    description="Watch out for percentages without context. A '200% improvement' sounds amazing, but if it's an improvement from 1 to 3 on a 100-point scale, it's not very meaningful."
                 />
            </div>
          </Section>
        </div>

        {/* --- Gemini AI-Powered Sidebar --- */}
        <div className="lg:col-span-1 space-y-8">
            <GeminiHeadlineDeconstructor />
            <GeminiFlawQuiz />
        </div>
      </main>
    </div>
  );
};

// --- Sub-components ---

const Section = ({ title, icon, children }: { title: string, icon: JSX.Element, children: React.ReactNode }) => (
  <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <div className="flex items-center space-x-3 mb-4">
      <div className="flex-shrink-0 bg-slate-100 p-2 rounded-md">{icon}</div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    {children}
  </section>
);

const TrapCard = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg h-full">
        <div className="flex items-center space-x-3 mb-2">
            {icon}
            <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <p className="text-sm text-slate-600">{description}</p>
    </div>
);

const ConceptCard = ({ title, description }: { title: string, description: string }) => (
    <div className="p-4 bg-white border border-slate-200 rounded-lg">
        <h3 className="font-bold text-lg text-amber-800">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

// --- Gemini AI Feature 1: "Headline Deconstructor" ---
const GeminiHeadlineDeconstructor = () => {
    const [headline, setHeadline] = useState("Miracle Veggie Cuts Cancer Risk by 50%!");
    const [stat, setStat] = useState("Study finds relative risk reduction from 2 in 10,000 to 1 in 10,000 for a rare cancer.");
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDeconstruct = async () => {
        if (!headline.trim() || !stat.trim()) return;
        setIsLoading(true);
        setAnalysis('');

        const prompt = `Act as a sharp media literacy expert. Your job is to deconstruct how a news headline might be misinterpreting or sensationalizing a statistical finding.

        - Headline: "${headline}"
        - The Actual Statistic: "${stat}"
        
        Analyze the language of the headline and compare it to the reality of the statistic. Explain the specific ways it might be misleading (e.g., using relative vs. absolute risk, oversimplification, loaded language). Provide a more accurate, sober headline.`;

        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiKey = GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setAnalysis(result.candidates[0].content.parts[0].text);
            } else { throw new Error("Invalid API response."); }
        } catch (e) {
            console.error(e);
            setAnalysis("Sorry, an error occurred while analyzing.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Section title="Headline Deconstructor" icon={<BrainCircuit className="text-purple-500" />}>
            <p className="text-slate-600 mb-4 text-sm">See how headlines can spin the truth. Enter a headline and the real stat to see the analysis.</p>
            <div className="space-y-3">
                <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} className="w-full form-input" placeholder="Enter headline..."/>
                <textarea value={stat} onChange={e => setStat(e.target.value)} className="w-full form-input h-20" placeholder="Enter the real statistic..."/>
                <button onClick={handleDeconstruct} disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:bg-purple-300">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <BrainCircuit className="mr-2" size={18} />}
                    Deconstruct
                </button>
                {analysis && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg animate-fade-in">
                        <h4 className="font-bold mb-1 text-purple-800">Analysis:</h4>
                        <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">{analysis}</div>
                    </div>
                )}
            </div>
        </Section>
    );
};


// --- Gemini AI Feature 2: "Find the Flaw Quiz" ---
const flawScenarios = [
    { id: 1, text: "A study wants to know the average income in a city. They survey people at a luxury car dealership. The results show a very high average income.", correct_flaw: "Biased Sample" },
    { id: 2, text: "A political poll of 20 people is used to declare that '55% of the country' supports a candidate.", correct_flaw: "Small Sample Size" },
    { id: 3, text: "A company reports: '90% of dentists surveyed recommend our toothpaste!' They don't mention that they only surveyed 10 dentists who they have a relationship with.", correct_flaw: "Cherry-Picking / Biased Sample" },
    { id: 4, text: "After a study shows people who drink red wine live longer, a website claims: 'Drinking red wine makes you live longer!'", correct_flaw: "Correlation vs. Causation" }
];

const GeminiFlawQuiz = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userGuess, setUserGuess] = useState<string | null>("");
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scenario = flawScenarios[currentIndex];

    const fetchExplanation = useCallback(async (guess: string) => {
        setIsLoading(true);
        setExplanation('');
        
        const prompt = `You are an expert in research methodology. A user is learning to spot flaws in how data is collected or presented.

        - The Scenario: "${scenario.text}"
        - The User's Guess: "${guess}"
        - The Correct Flaw: "${scenario.correct_flaw}"
        
        Provide a concise explanation. First, state if the user's guess is correct or on the right track. Then, clearly explain the primary flaw in the scenario, why it's a problem, and what a critical thinker should ask.`;

        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiKey = GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error("API request failed");
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setExplanation(result.candidates[0].content.parts[0].text);
            } else { throw new Error("Invalid API response."); }
        } catch (e) {
            console.error(e);
            setExplanation("Sorry, I couldn't fetch an explanation right now.");
        } finally {
            setIsLoading(false);
        }
    }, [scenario]);

    const handleGuess = (guess: string) => {
        setUserGuess(guess);
        fetchExplanation(guess);
    }
    
    const handleNext = () => {
        setUserGuess(null);
        setExplanation('');
        setCurrentIndex((prev) => (prev + 1) % flawScenarios.length);
    };

    return (
        <Section title="Find the Flaw" icon={<SearchX className="text-red-500" />}>
            <p className="text-slate-600 mb-4 text-sm">Read the scenario and spot the statistical pitfall. Our AI helper will explain.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <p className="italic text-slate-700">&quot;{scenario.text}&quot;</p>
                {!userGuess ? (
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleGuess("Biased Sample")} className="quiz-btn">Biased Sample</button>
                        <button onClick={() => handleGuess("Small Sample Size")} className="quiz-btn">Small Sample Size</button>
                        <button onClick={() => handleGuess("Cherry-Picking")} className="quiz-btn">Cherry-Picking</button>
                        <button onClick={() => handleGuess("Correlation vs. Causation")} className="quiz-btn">Correlation vs. Causation</button>
                    </div>
                ) : (
                    <div>
                        {isLoading && <div className="flex items-center text-slate-500"><Loader2 className="animate-spin mr-2" />Fetching explanation...</div>}
                        {explanation && <div className="prose prose-sm text-slate-800 bg-green-50 p-3 rounded-md border border-green-200 animate-fade-in whitespace-pre-wrap">{explanation}</div>}
                        <button onClick={handleNext} className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition">
                            Next Flaw <ArrowRight className="ml-2" size={16}/>
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
};
