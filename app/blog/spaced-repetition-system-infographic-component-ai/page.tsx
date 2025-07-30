'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Milestone, BarChart3, GitBranch, Bot, Network, Lightbulb, CheckCircle, XCircle, ChevronRight, Loader } from 'lucide-react';

// --- Helper Components for Visual Elements ---

const IconWrapper = ({ icon: Icon, className }) => (
  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${className}`}>
    <Icon className="w-6 h-6 text-white" />
  </div>
);

const Section = ({ title, icon: Icon, iconBgColor, children }) => (
  <section className="mb-12">
    <div className="flex items-center mb-6">
      <IconWrapper icon={Icon} className={iconBgColor} />
      <h2 className="ml-4 text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="pl-4 md:pl-16">{children}</div>
  </section>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

const ForgettingCurveSVG = () => (
    <div className="w-full p-4 bg-gray-50 rounded-lg">
        <svg viewBox="0 0 400 200" className="w-full h-auto">
            <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
                </linearGradient>
                 <linearGradient id="curveGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
                </linearGradient>
            </defs>
            {/* Axes */}
            <line x1="30" y1="180" x2="380" y2="180" stroke="#9ca3af" strokeWidth="1"/>
            <line x1="30" y1="20" x2="30" y2="180" stroke="#9ca3af" strokeWidth="1"/>
            <text x="200" y="195" textAnchor="middle" fontSize="10" fill="#6b7280">Time</text>
            <text x="15" y="100" textAnchor="middle" transform="rotate(-90 15 100)" fontSize="10" fill="#6b7280">Retention</text>
            <text x="35" y="25" fontSize="10" fill="#6b7280">100%</text>

            {/* Forgetting Curve */}
            <path d="M 30 20 Q 80 80, 200 150 T 380 175" stroke="#f87171" strokeWidth="2.5" fill="url(#curveGradient)" strokeDasharray="4 4"/>
            <text x="100" y="120" fontSize="12" fill="#ef4444" className="font-semibold">Without Repetition</text>

            {/* Spaced Repetition Curve */}
            <path d="M 30 20 Q 150 40, 380 60" stroke="#60a5fa" strokeWidth="2.5" fill="url(#curveGradient2)"/>
            <text x="180" y="40" fontSize="12" fill="#3b82f6" className="font-semibold">With Spaced Repetition</text>

            {/* Review markers */}
            <g>
                <circle cx="120" cy="58" r="4" fill="#3b82f6"/>
                <text x="100" y="75" fontSize="9" fill="#3b82f6">Review 1</text>
            </g>
             <g>
                <circle cx="250" cy="58" r="4" fill="#3b82f6"/>
                <text x="230" y="75" fontSize="9" fill="#3b82f6">Review 2</text>
            </g>
        </svg>
    </div>
);

const KnowledgeGraphSVG = () => (
    <div className="w-full p-4 bg-gray-50 rounded-lg flex justify-center items-center text-amber-900">
        <svg viewBox="0 0 200 120" className="w-full max-w-md h-auto">
            {/* Nodes */}
            <g>
                <circle cx="40" cy="60" r="15" fill="#818cf8"/>
                <text x="40" y="63" textAnchor="middle" fontSize="7" fill="white" className="font-bold">Biology</text>
            </g>
            <g>
                <circle cx="100" cy="30" r="15" fill="#60a5fa"/>
                <text x="100" y="33" textAnchor="middle" fontSize="5" fill="white" className="font-bold">Photosynthesis</text>
            </g>
            <g>
                <circle cx="100" cy="90" r="15" fill="#60a5fa"/>
                <text x="100" y="93" textAnchor="middle" fontSize="7" fill="white" className="font-bold">Mitochondria</text>
            </g>
            <g>
                <circle cx="160" cy="30" r="15" fill="#3b82f6"/>
                <text x="160" y="33" textAnchor="middle" fontSize="7" fill="white" className="font-bold">Chlorophyll</text>
            </g>
            {/* Edges */}
            <line x1="53" y1="52" x2="87" y2="38" stroke="#a5b4fc" strokeWidth="1.5"/>
            <line x1="53" y1="68" x2="87" y2="82" stroke="#a5b4fc" strokeWidth="1.5"/>
            <line x1="115" y1="30" x2="145" y2="30" stroke="#7dd3fc" strokeWidth="1.5"/>
        </svg>
    </div>
);


// --- Main Infographic Component ---

export default function SpacedRepetitionInfographic() {
  const [infographicData, setInfographicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, you would fetch this from a file or CMS
        const sourceDocument = `
          A Comprehensive Guide to Designing and Implementing a Machine Learning-Powered Spaced Retrieval System
          Part I: The Cognitive Science Foundations of Spaced Repetition
          Section 1.1: Deconstructing Memory: The Ebbinghaus Forgetting Curve and Active Recall
          Hermann Ebbinghaus in his 1885 work, Memory: A Contribution to Experimental Psychology, plotted the "forgetting curve".
          Section 1.2: The Leitner System: A Foundational Heuristic
          Sebastian Leitner, in 1972, devised the first widely adopted, practical system for implementing spaced repetition.
          Part II: A Taxonomy of Modern Spaced Repetition Algorithms
          Section 2.1: Half-Life Regression (HLR) - A feature-based regression model from Duolingo (2016). Strengths: Uses rich linguistic/item features; Interpretable weights. Weaknesses: Requires extensive feature engineering; Outperformed by newer models. Use Case: Language learning.
          Section 2.2: The DSR Model: Free Spaced Repetition Scheduler (FSRS) - State-of-the-art accuracy; Highly personalized via optimization. Weaknesses: Formulas can be complex. Use Case: General-purpose, high-performance flashcard scheduling.
          Section 2.3: Bayesian Knowledge Tracing (BKT) - A probabilistic graphical model. Strengths: Highly interpretable parameters (Guess, Slip, etc.). Weaknesses: Models skills in isolation; Often lower predictive accuracy. Use Case: Intelligent tutoring systems.
          Section 2.4: Deep Knowledge Tracing (DKT) - A Recurrent Neural Network model from Stanford (2015). Strengths: Captures inter-skill dependencies. Weaknesses: "Black box" model; Computationally expensive. Use Case: Complex domains like math.
          Part IV: Advanced Architectures for Lifelong Learning
          Section 4.1: Beyond Individual Cards: Using Network Theory and Knowledge Graphs. Knowledge is a network of interconnected concepts. Application: Intelligent interleaving, gap analysis, and knowledge visualization.
          Part V: Synthesis and Future Directions
          Section 5.1: A Phased Implementation Plan
          Phase 1: MVP - The Robust Baseline. Action: Implement FSRS. Rationale: Fastest path to a state-of-the-art scheduler.
          Phase 2: Personalization - The Custom TensorFlow Model. Action: Build and train an LSTM-based scheduler. Rationale: Fully personalized to each user's unique memory patterns.
          Phase 3: The Connected Mind - Knowledge Graph Integration. Action: Construct a knowledge graph. Rationale: Elevates the app from a memorization tool to a conceptual learning assistant.
          Phase 4: The Frontier - Advanced Model Exploration. Action: Experiment with DKT or GNN-enhanced DKT. Rationale: Places the application at the cutting edge of educational technology.
        `;

        const prompt = `
          Based on the provided document about a machine learning-powered spaced retrieval system, generate a JSON object for a web infographic. Extract the key information concisely. The JSON object must conform to the following schema:
          {
            "title": "string",
            "subtitle": "string",
            "timeline": [
              { "year": "string", "event": "string", "icon": "string (either 'Ebbinghaus' or 'Leitner' or 'HLR' or 'DKT')" }
            ],
            "forgettingCurve": {
              "description": "string",
              "repetitionEffect": "string"
            },
            "algorithms": [
              {
                "name": "string",
                "type": "string",
                "strengths": ["string"],
                "weaknesses": ["string"],
                "useCase": "string"
              }
            ],
            "implementationPhases": [
              { "phase": "number", "title": "string", "action": "string", "rationale": "string" }
            ],
            "knowledgeGraph": {
              "description": "string",
              "application": "string"
            }
          }
          Populate the JSON with the most critical information from the document. Be brief and impactful for an infographic format.
        `;
        
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }, {text: sourceDocument}] });
        const payload = { 
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
            }
        };
        const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const apiKey = GEMINI_API_KEY; // API key will be injected by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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
              let text = result.candidates[0].content.parts[0].text;
              
              // **FIX:** Clean the response to ensure it's valid JSON before parsing.
              // The API might sometimes return the JSON wrapped in markdown backticks or with other text.
              const jsonStart = text.indexOf('{');
              const jsonEnd = text.lastIndexOf('}');

              if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonString = text.substring(jsonStart, jsonEnd + 1);
                const parsedJson = JSON.parse(jsonString);
                setInfographicData(parsedJson);
              } else {
                console.error("Could not find a valid JSON object in the API response:", text);
                throw new Error("Invalid data format received from API.");
              }
        } else {
            console.error("Unexpected API response structure:", result);
            throw new Error("Failed to parse data from Gemini API.");
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">Building your learning infographic with Gemini...</p>
      </div>
    );
  }

  if (error || !infographicData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-700">
        <XCircle className="w-8 h-8 mr-4" />
        <div>
          <h2 className="font-bold text-lg">Failed to generate infographic.</h2>
          <p>{error || "No data was returned from the API."}</p>
        </div>
      </div>
    );
  }

  const { title, subtitle, timeline, forgettingCurve, algorithms, implementationPhases, knowledgeGraph } = infographicData;

  return (
    <div className="bg-gray-50 font-sans p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Bot className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              {title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </header>

        <main>
          {/* --- Timeline Section --- */}
          <Section title="From Theory to Algorithm: A Brief History" icon={Milestone} iconBgColor="bg-purple-500">
            <div className="relative border-l-2 border-purple-200 pl-8 space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[42px] top-1 w-5 h-5 bg-purple-500 rounded-full border-4 border-white"></div>
                  <p className="text-purple-600 font-bold text-xl">{item.year}</p>
                  <p className="mt-1 text-gray-700">{item.event}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* --- Forgetting Curve Section --- */}
          <Section title="The Ebbinghaus Forgetting Curve" icon={BarChart3} iconBgColor="bg-red-500">
            <Card>
              <p className="text-gray-600 mb-4">{forgettingCurve.description}</p>
              <p className="text-blue-600 font-semibold mb-4">{forgettingCurve.repetitionEffect}</p>
              <ForgettingCurveSVG />
            </Card>
          </Section>
          
          {/* --- Algorithm Comparison Section --- */}
          <Section title="A Taxonomy of Modern Algorithms" icon={BrainCircuit} iconBgColor="bg-green-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {algorithms.map((algo) => (
                <Card key={algo.name} className="flex flex-col">
                  <h3 className="text-xl font-bold text-green-700">{algo.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{algo.type}</p>
                  <div className="text-sm space-y-3 flex-grow">
                    <div>
                      <h4 className="font-semibold text-gray-600 mb-1">Strengths:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {algo.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                     <div>
                      <h4 className="font-semibold text-gray-600 mb-1">Weaknesses:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {algo.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                   <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium uppercase">Best For</p>
                      <p className="text-sm text-gray-800 font-semibold">{algo.useCase}</p>
                    </div>
                </Card>
              ))}
            </div>
          </Section>

          {/* --- Implementation Plan Section --- */}
          <Section title="Phased Implementation Roadmap" icon={GitBranch} iconBgColor="bg-blue-500">
            <div className="space-y-6">
              {implementationPhases.map((phase) => (
                <Card key={phase.phase} className="!p-0 overflow-hidden">
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white p-6 flex flex-col items-center justify-center">
                      <p className="text-xs font-bold">PHASE</p>
                      <p className="text-4xl font-extrabold">{phase.phase}</p>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-blue-800">{phase.title}</h3>
                      <p className="mt-1 text-gray-700"><span className="font-semibold">Action:</span> {phase.action}</p>
                      <p className="mt-1 text-sm text-gray-600"><span className="font-semibold">Rationale:</span> {phase.rationale}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Section>
          
          {/* --- Knowledge Graph Section --- */}
          <Section title="Advanced Architecture: The Knowledge Graph" icon={Network} iconBgColor="bg-indigo-500">
             <Card>
                <p className="text-gray-600 mb-4">{knowledgeGraph.description}</p>
                <p className="text-indigo-600 font-semibold mb-4">{knowledgeGraph.application}</p>
                <KnowledgeGraphSVG />
             </Card>
          </Section>
        </main>
      </div>
    </div>
  );
}
