"use client";

import React, { useState, JSX } from 'react';
import { AppError } from '../../../types/errors';
import { BarChart3, Calculator, Percent, MessageSquareQuote, Lightbulb, BrainCircuit, Loader2, Info } from 'lucide-react';

// Main App Component
export default function App() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <StatisticsInfographic />
    </div>
  );
}

// --- Main Infographic Component ---
const StatisticsInfographic = () => {

  return (
    <div className="font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <BarChart3 size={28} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Making Sense of Statistics</h1>
                <p className="text-sm text-slate-500">A Guide to Understanding & Explaining Data</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Fundamental Concepts */}
          <Section title="Fundamental Statistical Concepts" icon={<Info className="text-sky-500" />}>
             <p className="mb-4 text-slate-600">Statistics help us describe data and draw inferences. These are the building blocks.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TermCard term="Mean (Average)" definition="The sum of all values divided by the number of values. Can be skewed by very high or low numbers (outliers)." />
              <TermCard term="Median" definition="The middle value in an ordered dataset. It's often a better measure of the 'center' when outliers are present." />
              <TermCard term="Standard Deviation" definition="Measures how spread out the data points are from the mean. A small SD means data is clustered tightly." />
              <TermCard term="Sample vs. Population" definition="A population is the entire group of interest. A sample is a smaller, manageable subset of that population." />
            </div>
          </Section>
          
          {/* Section 2: Inferential Statistics */}
          <Section title="How We Make Claims from Data" icon={<Percent className="text-rose-500" />}>
            <p className="mb-4 text-slate-600">Inferential statistics allow us to make educated guesses (inferences) about a whole population based on a smaller sample.</p>
            <div className="space-y-4">
              <ConceptCard
                title="P-value & Hypothesis Testing"
                description="Researchers start with a 'null hypothesis' (a statement of no effect). The p-value tells you the probability of seeing your data if that 'no effect' idea was true. A small p-value (e.g., < 0.05) suggests the effect you saw is probably real and not just random chance."
              />
              <ConceptCard
                title="Confidence Intervals (CI)"
                description="This gives a range of plausible values for the true effect in the whole population. A 95% CI means we're 95% confident the true value lies within that range. A narrow CI is more precise than a wide one."
              />
              <div className="p-4 bg-amber-50 border-l-4 border-amber-400">
                <h4 className="font-bold text-amber-800">The Most Important Distinction</h4>
                <p className="text-amber-700"><strong className="font-semibold">Statistical Significance (p-value)</strong> just means an effect is unlikely to be a fluke. <strong className="font-semibold">Practical/Clinical Importance (Effect Size)</strong> tells you if the effect is large enough to actually matter in the real world. A tiny, useless effect can still be &apos;statistically significant&apos; in a large study!</p>
              </div>
            </div>
          </Section>
        </div>
 
        {/* --- Gemini AI-Powered Sidebar --- */}
        <div className="lg:col-span-1 space-y-8">
          <GeminiStatTranslator />
          <GeminiRiskExplainer />
          
          <Section title="Communication Cheat Sheet" icon={<MessageSquareQuote className="text-violet-500" />}>
            <ul className="space-y-3">
              <Tip text="Focus on the 'So What?' - what does this number mean for people?" />
              <Tip text="Use analogies. 'Unlikely to be a fluke' is better than 'statistically significant'." />
              <Tip text="Always provide the Absolute Risk alongside the Relative Risk to give context." />
              <Tip text="Explain the Confidence Interval as a 'range of plausible results'." />
              <Tip text="State the limitations. What does the study *not* tell us?" />
            </ul>
          </Section>
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

const TermCard = ({ term, definition }: { term: string, definition: string }) => (
  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg h-full">
    <h3 className="font-semibold text-sky-800">{term}</h3>
    <p className="text-sm text-slate-600">{definition}</p>
  </div>
);

const ConceptCard = ({ title, description }: { title: string, description: string }) => (
    <div className="p-4 bg-white border border-slate-200 rounded-lg">
        <h3 className="font-bold text-lg text-rose-800">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const Tip = ({ text }: { text: string }) => (
  <li className="flex items-start">
    <Lightbulb size={20} className="text-violet-500 mr-3 mt-0.5 flex-shrink-0" />
    <span className="text-slate-700">{text}</span>
  </li>
);

// --- Gemini AI Feature 1: "Translate a Stat" ---
const GeminiStatTranslator = () => {
    const [inputText, setInputText] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const exampleText = "The intervention group showed a significant reduction in LDL cholesterol (mean difference = -15.2 mg/dL; 95% CI, -18.1 to -12.3 mg/dL; p < 0.001) compared to placebo.";

    const handleTranslate = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setTranslation('');
        setError('');

        const prompt = `Act as a data journalist. Your task is to translate a dense statistical finding into a simple, clear, and accurate explanation for a general audience. Break down each part of the statistic and explain what it means in practical terms.
        
        Statistic to translate: "${inputText}"
        
        Explain the main finding (the effect size), the confidence interval (the range of plausible results), and the p-value (the likelihood of it being a fluke).`;

        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiKey = GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setTranslation(result.candidates[0].content.parts[0].text);
            } else {
                throw new Error("Invalid API response structure.");
            }
        } catch (e: unknown) {
            setError((e as AppError).message || "An error occurred.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Section title="Translate a Stat" icon={<BrainCircuit className="text-teal-500" />}>
            <p className="text-slate-600 mb-4 text-sm">Paste a statistical finding (e.g., from a paper&apos;s abstract) and let our AI helper translate it into plain English.</p>
            <div className="space-y-3">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g., mean difference = -15.2 mg/dL; 95% CI..."
                    className="w-full h-24 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
                />
                 <div className="flex items-center justify-between">
                     <button onClick={() => setInputText(exampleText)} className="text-xs text-teal-600 hover:underline">Use Example</button>
                    <button onClick={handleTranslate} disabled={isLoading} className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition disabled:bg-teal-300">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <BrainCircuit className="mr-2" size={18} />}
                        Translate
                    </button>
                </div>
                 {error && <p className="text-red-500 text-sm">{error}</p>}
                {translation && (
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg animate-fade-in">
                        <h4 className="font-bold mb-1 text-teal-800">Plain English Translation:</h4>
                        <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">{translation}</div>
                    </div>
                )}
            </div>
        </Section>
    );
};

// --- Gemini AI Feature 2: "Risk Explainer" ---
const GeminiRiskExplainer = () => {
    const [relativeRisk, setRelativeRisk] = useState('50% higher');
    const [baselineRisk, setBaselineRisk] = useState('1 in 1000');
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleExplainRisk = async () => {
        if (!relativeRisk.trim() || !baselineRisk.trim()) {
            setError("Please fill in both fields.");
            return;
        };
        setIsLoading(true);
        setExplanation('');
        setError('');

        const prompt = `Act as a public health communicator. Your task is to explain the difference between relative risk and absolute risk in a simple, intuitive way using the provided numbers.
        
        - Relative Risk Statement: "${relativeRisk}"
        - Baseline Risk: "${baselineRisk}"
        
        First, calculate the new absolute risk.
        Second, explain what this means in practical terms for a population (e.g., for every X people...). Contrast the potentially scary-sounding relative risk with the actual change in absolute numbers.`;
        
        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiKey = GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setExplanation(result.candidates[0].content.parts[0].text);
            } else {
                throw new Error("Invalid API response structure.");
            }
        } catch (e: unknown) {
            setError((e as AppError).message || "An error occurred.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Section title="Risk Explainer" icon={<Calculator className="text-orange-500" />}>
            <p className="text-slate-600 mb-4 text-sm">Headlines often use &quot;Relative Risk&quot; which can be misleading. Use this tool to see the real-world &quot;Absolute Risk&quot;.</p>
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Relative Risk Statement</label>
                    <input type="text" value={relativeRisk} onChange={e => setRelativeRisk(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g., 'doubles the risk' or '30% lower'"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Baseline Risk (Control Group)</label>
                    <input type="text" value={baselineRisk} onChange={e => setBaselineRisk(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="e.g., '1 in 100' or '5%'"/>
                </div>
                 <button onClick={handleExplainRisk} disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition disabled:bg-orange-300">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Calculator className="mr-2" size={18} />}
                    Explain the Real Risk
                </button>
                 {error && <p className="text-red-500 text-sm">{error}</p>}
                {explanation && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg animate-fade-in">
                        <h4 className="font-bold mb-1 text-orange-800">Putting Risk in Context:</h4>
                        <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">{explanation}</div>
                    </div>
                )}
            </div>
        </Section>
    )
}
