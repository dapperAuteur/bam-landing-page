'use client';

import React, { useState, useEffect, ElementType } from 'react';
import { BrainCircuit, Milestone, BarChart3, GitBranch, Bot, Network, Lightbulb, CheckCircle, XCircle, ChevronRight, Loader } from 'lucide-react';

const INFOGRAPHIC = {
  "title": "The Next Generation of Learning: ML-Powered Spaced Retrieval",
  "subtitle": "Leveraging Cognitive Science and AI to Master Memory",
  "timeline": [
    {
      "year": "1885",
      "event": "Introduced the Forgetting Curve, documenting the rapid decay of memory over time.",
      "source": "Ebbinghaus"
    },
    {
      "year": "1972",
      "event": "Devised the first practical, widely adopted system for spaced repetition using physical boxes.",
      "source": "Leitner"
    }
  ],
  "forgettingCurve": {
    "description": "A graphical representation showing how information retention declines exponentially without active recall.",
    "repetitionEffect": "Strategically timed repetitions interrupt the decay, pushing the curve outward and solidifying memory."
  },
  "algorithms": [
    {
      "name": "Half-Life Regression (HLR)",
      "type": "Feature-Based Regression",
      "strengths": [
        "Uses rich item and linguistic features"
      ],
      "weaknesses": [
        "Requires extensive feature engineering"
      ],
      "useCase": "Scheduling based on item difficulty (e.g., Duolingo)"
    },
    {
      "name": "Free Spaced Repetition Scheduler (FSRS)",
      "type": "DSR Model",
      "strengths": [
        "State-of-the-art accuracy",
        "Highly personalized via optimization"
      ],
      "weaknesses": [
        "Formulas and implementation can be complex"
      ],
      "useCase": "Fastest path to a high-precision, personalized scheduler"
    },
    {
      "name": "Bayesian Knowledge Tracing (BKT)",
      "type": "Probabilistic State Model",
      "strengths": [
        "Highly interpretable parameters (Guess, Slip)"
      ],
      "weaknesses": [
        "Models skills in isolation, ignoring dependencies"
      ],
      "useCase": "Interpretable assessment of isolated skill mastery"
    },
    {
      "name": "Deep Knowledge Tracing (DKT)",
      "type": "Neural Sequence Model (LSTMs)",
      "strengths": [
        "Captures complex inter-skill dependencies"
      ],
      "weaknesses": [
        "Black box model",
        "Computationally expensive"
      ],
      "useCase": "Advanced modeling of long-term learning sequences"
    }
  ],
  "implementationPhases": [
    {
      "phase": 1,
      "title": "Minimum Viable Product (MVP)",
      "action": "Implement the FSRS algorithm for scheduling.",
      "rationale": "Achieves the fastest path to a state-of-the-art scheduling system."
    },
    {
      "phase": 2,
      "title": "Advanced Personalization",
      "action": "Build and train an LSTM-based scheduler.",
      "rationale": "Fully personalize intervals based on each user's unique memory patterns."
    },
    {
      "phase": 3,
      "title": "The Connected Mind",
      "action": "Construct a comprehensive knowledge graph.",
      "rationale": "Elevates the application from a memorization tool to a conceptual learning assistant."
    },
    {
      "phase": 4,
      "title": "The Frontier",
      "action": "Experiment with DKT or GNN-enhanced DKT.",
      "rationale": "Places the application at the cutting edge of educational technology."
    }
  ],
  "knowledgeGraph": {
    "description": "A representation viewing knowledge as a network of interconnected concepts rather than isolated facts.",
    "application": "Enables intelligent interleaving of topics, sophisticated gap analysis, and advanced knowledge visualization."
  }
};


// --- Type Definitions ---

// Props for helper components
interface IconWrapperProps {
  icon: ElementType;
  className?: string;
}

interface SectionProps {
  title: string;
  icon: ElementType;
  iconBgColor: string;
  children: React.ReactNode;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Types for the data structure fetched from the Gemini API
interface TimelineItem {
  year: string;
  event: string;
  source: string;
}

interface ForgettingCurve {
  description: string;
  repetitionEffect: string;
}

interface Algorithm {
  name: string;
  type: string;
  strengths: string[];
  weaknesses: string[];
  useCase: string;
}

interface ImplementationPhase {
  phase: number;
  title: string;
  action: string;
  rationale: string;
}

interface KnowledgeGraph {
  description: string;
  application: string;
}

// The main data interface
interface InfographicData {
  title: string;
  subtitle: string;
  timeline: TimelineItem[];
  forgettingCurve: ForgettingCurve;
  algorithms: Algorithm[];
  implementationPhases: ImplementationPhase[];
  knowledgeGraph: KnowledgeGraph;
}

// Types for the Gemini API call
interface ChatPart {
  text: string;
}

interface ChatMessage {
  role: "user" | "model";
  parts: ChatPart[];
}

interface GeminiApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// --- Helper Components for Visual Elements ---

const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, className }) => (
  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${className}`}>
    <Icon className="w-6 h-6 text-white" />
  </div>
);

const Section: React.FC<SectionProps> = ({ title, icon: Icon, iconBgColor, children }) => (
  <section className="mb-12">
    <div className="flex items-center mb-6">
      <IconWrapper icon={Icon} className={iconBgColor} />
      <h2 className="ml-4 text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="pl-4 md:pl-16">{children}</div>
  </section>
);

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

const ForgettingCurveSVG: React.FC = () => (
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

const KnowledgeGraphSVG: React.FC = () => (
    <div className="w-full p-4 bg-gray-50 rounded-lg flex justify-center items-center">
        <svg viewBox="0 0 200 120" className="w-full max-w-md h-auto">
            {/* Nodes */}
            <g>
                <circle cx="40" cy="60" r="15" fill="#818cf8"/>
                <text x="40" y="63" textAnchor="middle" fontSize="7" fill="black" className="font-bold">Cell Biology</text>
            </g>
            <g>
                <circle cx="100" cy="30" r="15" fill="#60a5fa"/>
                <text x="100" y="33" textAnchor="middle" fontSize="5" fill="black" className="font-bold">Photosynthesis</text>
            </g>
            <g>
                <circle cx="100" cy="90" r="15" fill="#60a5fa"/>
                <text x="100" y="93" textAnchor="middle" fontSize="7" fill="black" className="font-bold">Mitochondrion</text>
            </g>
            <g>
                <circle cx="160" cy="30" r="15" fill="#3b82f6"/>
                <text x="160" y="33" textAnchor="middle" fontSize="7" fill="black" className="font-bold">Chlorophyll</text>
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
  const [infographicData, setInfographicData] = useState<InfographicData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        setError(null);


        const parsedJson: InfographicData = INFOGRAPHIC; // JSON.parse(jsonString);
        setInfographicData(parsedJson);
        return;

        // The source document is now passed directly to the API call
        // const sourceDocument = `
        //   # A Comprehensive Guide to Designing and Implementing a Machine Learning-Powered Spaced Retrieval System
        //   ## Part I: The Cognitive Science Foundations of Spaced Repetition
        //   ### Section 1.1: Deconstructing Memory: The Ebbinghaus Forgetting Curve and Active Recall
        //   Hermann Ebbinghaus in his 1885 work, Memory: A Contribution to Experimental Psychology, plotted the "forgetting curve".
        //   ### Section 1.2: The Leitner System: A Foundational Heuristic
        //   Sebastian Leitner, in 1972, devised the first widely adopted, practical system for implementing spaced repetition.
        //   ## Part II: A Taxonomy of Modern Spaced Repetition Algorithms
        //   ### Section 2.1: Feature-Based Regression Models: Half-Life Regression (HLR)
        //   Introduced by Duolingo. Uses rich linguistic/item features. Requires extensive feature engineering.
        //   ### Section 2.2: The DSR Model: Free Spaced Repetition Scheduler (FSRS)
        //   State-of-the-art accuracy; Highly personalized via optimization. Formulas can be complex.
        //   ### Section 2.3: Probabilistic State Models: Bayesian Knowledge Tracing (BKT)
        //   Highly interpretable parameters (Guess, Slip, etc.). Models skills in isolation.
        //   ### Section 2.4: Neural Sequence Models: Deep Knowledge Tracing (DKT)
        //   Uses LSTMs. Captures inter-skill dependencies. "Black box" model, computationally expensive.
        //   ## Part IV: Advanced Architectures for Lifelong Learning
        //   ### Section 4.1: Beyond Individual Cards: Using Network Theory and Knowledge Graphs
        //   Knowledge is a network of interconnected concepts. Application: Intelligent interleaving, gap analysis, and knowledge visualization.
        //   ## Part V: Synthesis and Future Directions
        //   ### Section 5.1: A Phased Implementation Plan
        //   Phase 1: MVP - Implement FSRS. Rationale: Fastest path to a state-of-the-art scheduler.
        //   Phase 2: Personalization - Build and train an LSTM-based scheduler with TensorFlow. Rationale: Fully personalized to each user's unique memory patterns.
        //   Phase 3: The Connected Mind - Construct a knowledge graph. Rationale: Elevates the app from a memorization tool to a conceptual learning assistant.
        //   Phase 4: The Frontier - Experiment with DKT or GNN-enhanced DKT. Rationale: Places the application at the cutting edge of educational technology.
        // `;

        // const prompt = `
        //   Based on the provided document about a machine learning-powered spaced retrieval system, generate a JSON object for a web infographic. Extract the key information concisely. The JSON object must conform to the following schema:
        //   {
        //     "title": "string",
        //     "subtitle": "string",
        //     "timeline": [
        //       { "year": "string", "event": "string", "source": "string (e.g., 'Ebbinghaus', 'Leitner')" }
        //     ],
        //     "forgettingCurve": {
        //       "description": "string",
        //       "repetitionEffect": "string"
        //     },
        //     "algorithms": [
        //       {
        //         "name": "string",
        //         "type": "string",
        //         "strengths": ["string"],
        //         "weaknesses": ["string"],
        //         "useCase": "string"
        //       }
        //     ],
        //     "implementationPhases": [
        //       { "phase": "number", "title": "string", "action": "string", "rationale": "string" }
        //     ],
        //     "knowledgeGraph": {
        //       "description": "string",
        //       "application": "string"
        //     }
        //   }
        //   Populate the JSON with the most critical information from the document. Be brief and impactful for an infographic format.
        // `;
        
        // let chatHistory: ChatMessage[] = [];
        // chatHistory.push({ role: "user", parts: [{ text: prompt }, {text: sourceDocument}] });
        
        // const payload = { 
        //     contents: chatHistory,
        //     generationConfig: {
        //         responseMimeType: "application/json",
        //     }
        // };
        // Using a more standard model name, update if 'gemini-2.0-flash' is correct
        // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        // const response = await fetch(apiUrl, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload)
        // });

        // if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.error?.message || `API call failed with status: ${response.status}`);
        // }

        // const result: GeminiApiResponse = await response.json();
        
        // if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        //       let text = result.candidates[0].content.parts[0].text;
              
        //       // Clean the response to ensure it's valid JSON before parsing.
        //       const jsonStart = text.indexOf('{');
        //       const jsonEnd = text.lastIndexOf('}');

        //       if (jsonStart !== -1 && jsonEnd !== -1) {
        //         const jsonString = text.substring(jsonStart, jsonEnd + 1);
        //         try {
        //             const parsedJson: InfographicData = INFOGRAPHIC; // JSON.parse(jsonString);
        //             setInfographicData(parsedJson);
        //         } catch (e) {
        //             console.error("JSON parsing error:", e);
        //             throw new Error("Failed to parse JSON from API response.");
        //         }
        //       } else {
        //         console.error("Could not find a valid JSON object in the API response:", text);
        //         throw new Error("Invalid data format received from API.");
        //       }
        // } else {
        //     console.error("Unexpected API response structure:", result);
        //     throw new Error("Failed to parse data from Gemini API.");
        // }

      } catch (err) {
        console.error(err);
        // Type-safe error handling
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []); // Empty dependency array means this runs once on mount

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

  // Destructuring is now type-safe because of the check above
  const { title, subtitle, timeline, forgettingCurve, algorithms, implementationPhases, knowledgeGraph } = infographicData;

  return (
    <div className="bg-gray-50 font-sans p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Bot className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              {title || "ML-Powered Spaced Retrieval"}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle || "A guide to designing and implementing an intelligent learning system."}</p>
        </header>

        <main>
          {/* --- Timeline Section --- */}
          <Section title="From Theory to Algorithm: A Brief History" icon={Milestone} iconBgColor="bg-purple-500">
            <div className="relative border-l-2 border-purple-200 pl-8 space-y-12">
              {/* Types for 'item' and 'index' are inferred from timeline: TimelineItem[] */}
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
              {/* Type for 'algo' is inferred from algorithms: Algorithm[] */}
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
              {/* Type for 'phase' is inferred from implementationPhases: ImplementationPhase[] */}
              {implementationPhases.map((phase) => (
                <Card key={phase.phase} className="!p-0 overflow-hidden">
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white p-6 flex flex-col items-center justify-center min-w-[100px]">
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