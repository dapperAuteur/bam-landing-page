"use client";

import { AppError } from './../../../types/errors';
import React, { useState, useEffect, useCallback, type JSX } from 'react';
import { BookOpen, FlaskConical, TestTube2, Users, MessageCircle, Lightbulb, BrainCircuit, ScanSearch, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const apiKey = GEMINI_API_KEY;
// const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

// Main App Component
export default function App() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <ScientificStudyInfographic />
    </div>
  );
}


// --- Main Infographic Component ---
const ScientificStudyInfographic = () => {
  const [activeTab, setActiveTab] = useState('observational');

  return (
    <div className="font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <BookOpen size={28} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Understanding Scientific Studies</h1>
                <p className="text-sm text-slate-500">An Interactive Guide to Reading & Communicating Science</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Types of Studies */}
          <Section title="Types of Studies" icon={<FlaskConical className="text-cyan-500" />}>
            <p className="mb-4 text-slate-600">The design of a study determines the strength of its conclusions. Understanding the type is the first step to critical appraisal.</p>
            <div className="border border-slate-200 rounded-lg bg-white">
              <div className="flex border-b border-slate-200">
                <TabButton title="Observational Studies" isActive={activeTab === 'observational'} onClick={() => setActiveTab('observational')} />
                <TabButton title="Experimental Studies" isActive={activeTab === 'experimental'} onClick={() => setActiveTab('experimental')} />
                <TabButton title="Meta-Analyses" isActive={activeTab === 'meta'} onClick={() => setActiveTab('meta')} />
              </div>
              <div className="p-6">
                {activeTab === 'observational' && <StudyTypeContent
                  title="Observational Studies"
                  description="Researchers observe subjects and measure variables without intervening. These can show associations and correlations, but not causation."
                  items={[
                    { name: 'Cohort Studies', detail: 'Follows a group (cohort) over time to see how exposures affect outcomes.' },
                    { name: 'Case-Control Studies', detail: 'Compares people with a condition (cases) to those without (controls) to look back at past exposures.' },
                    { name: 'Cross-Sectional Studies', detail: 'Looks at data from a population at one specific point in time, like a snapshot.' },
                  ]}
                />}
                {activeTab === 'experimental' && <StudyTypeContent
                  title="Experimental Studies"
                  description="Researchers actively intervene by manipulating variables. This is the only way to determine cause and effect."
                  items={[
                    { name: 'Randomized Controlled Trials (RCTs)', detail: 'The "gold standard". Participants are randomly assigned to an experimental or control group.' },
                     { name: 'Blinding', detail: 'A technique to reduce bias. In double-blind studies, neither participants nor researchers know who is in which group.' },
                  ]}
                />}
                {activeTab === 'meta' && <StudyTypeContent
                  title="Studies of Studies"
                  description="These synthesize evidence from multiple existing studies to provide a more robust and comprehensive conclusion."
                  items={[
                    { name: 'Systematic Reviews', detail: 'A comprehensive review of all relevant studies on a topic using systematic methods.' },
                    { name: 'Meta-Analysis', detail: 'Uses statistical techniques to combine the results of several studies into a single, more powerful estimate.' },
                  ]}
                />}
              </div>
            </div>
          </Section>

          {/* Section 2: Key Terminology */}
          <Section title="Key Terminology" icon={<TestTube2 className="text-indigo-500" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TermCard term="Hypothesis" definition="A testable prediction about the relationship between variables." />
              <TermCard term="P-value & Significance" definition="The p-value is the probability a result occurred by chance. A small p-value (e.g., <0.05) suggests it's statistically significant, but not necessarily important." />
              <TermCard term="Correlation vs. Causation" definition="Correlation is a relationship between two variables. Causation is when one variable directly causes a change in another. Don't mix them up!" />
              <TermCard term="Control Group" definition="The group in an experiment that does not receive the treatment, serving as a baseline for comparison." />
               <TermCard term="Peer Review" definition="Evaluation of scientific work by other experts in the same field to ensure quality and validity before publication." />
               <TermCard term="Effect Size" definition="Measures the magnitude (the 'how much') of an effect, which is often more important than just statistical significance." />
            </div>
          </Section>

           {/* Section 3: How to Read a Paper */}
          <Section title="How to Read a Scientific Paper" icon={<ScanSearch className="text-emerald-500" />}>
            <div className="space-y-4">
               <PaperStep number={1} title="Abstract" description="Read this first. It's a full summary: purpose, methods, results, and conclusion." />
               <PaperStep number={2} title="Introduction" description="Understand the 'why'. It provides background and states the hypothesis." />
               <PaperStep number={3} title="Methods" description="Critically assess the 'how'. Is the study design appropriate? Who was studied?" />
               <PaperStep number={4} title="Results" description="Look at the objective findings. This section presents raw data, often in tables and graphs, without interpretation." />
               <PaperStep number={5} title="Discussion / Conclusion" description="Interpret the 'so what'. Authors discuss implications, limitations, and future research." />
            </div>
          </Section>

        </div>

        {/* --- Gemini AI-Powered Sidebar --- */}
        <div className="lg:col-span-1 space-y-8">

          {/* AI Feature 1: Simplify The Science */}
          {/* <GeminiExplainFeature /> */}

          {/* AI Feature 2: Spot The Bias */}
          <GeminiBiasQuiz />

          {/* Section 4: Communication Tips */}
           <Section title="Communicating Your Findings" icon={<MessageCircle className="text-amber-500" />}>
            <ul className="space-y-3">
              <Tip text="Start with the 'So What?' - explain why it matters." />
              <Tip text="Use analogies and simple language instead of jargon." />
              <Tip text="Clearly distinguish correlation from causation." />
              <Tip text="Acknowledge limitations and what the study *doesn't* tell us." />
              <Tip text="Focus on the effect size (the magnitude) to explain practical importance." />
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

const TabButton = ({ title, isActive, onClick }: { title: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-1 text-sm sm:text-base font-semibold p-3 text-center transition-colors duration-200 focus:outline-none ${
      isActive ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {title}
  </button>
);

const StudyTypeContent = ({ title, description, items }: { title: string, description: string, items: { name: string, detail: string }[] }) => (
  <div>
    <h3 className="font-bold text-lg mb-1 text-slate-800">{title}</h3>
    <p className="text-slate-600 mb-4">{description}</p>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <Users size={16} className="text-cyan-500 mr-2 mt-1 flex-shrink-0" />
          <div>
            <span className="font-semibold">{item.name}:</span>{' '}
            <span className="text-slate-600">{item.detail}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const TermCard = ({ term, definition }: { term: string, definition: string }) => (
  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
    <h3 className="font-semibold text-indigo-800">{term}</h3>
    <p className="text-sm text-slate-600">{definition}</p>
  </div>
);

const PaperStep = ({ number, title, description }: { number: number, title: string, description: string }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-600 font-bold text-lg rounded-full flex items-center justify-center">
            {number}
        </div>
        <div>
            <h3 className="font-bold text-emerald-800">{title}</h3>
            <p className="text-slate-600">{description}</p>
        </div>
    </div>
);

const Tip = ({ text }: { text: string }) => (
  <li className="flex items-start">
    <Lightbulb size={20} className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
    <span className="text-slate-700">{text}</span>
  </li>
);

// --- Gemini AI Feature 1: "Simplify The Science" ---

// const GeminiExplainFeature = () => {
//     const [inputText, setInputText] = useState('');
//     const [simplifiedText, setSimplifiedText] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');

//     const exampleText = "A randomized, double-blind, placebo-controlled trial involving 849 participants investigated the efficacy of a novel GLP-1 receptor agonist in mitigating atherosclerotic cardiovascular disease events. The primary endpoint, a composite of non-fatal myocardial infarction, non-fatal stroke, or cardiovascular death, showed a statistically significant hazard ratio of 0.79 (95% CI, 0.65-0.95; P=0.01).";

    // const handleSimplify = async () => {
    //     if (!inputText.trim()) {
    //         setError('Please enter some text to simplify.');
    //         return;
    //     }
    //     setIsLoading(true);
    //     setSimplifiedText('');
    //     setError('');

    //     const prompt = `You are a friendly and brilliant science communicator. Your goal is to make complex scientific text easy for anyone to understand. Do not be condescending. Explain the concepts simply, use analogies, and focus on the 'so what?'. Break down this text:\n\n---\n${inputText}\n---`;

    //     try {
    //         const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    //         const payload = { contents: chatHistory };

    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(payload)
    //         });

    //         if (!response.ok) {
    //             throw new Error(`API error: ${response.statusText}`);
    //         }

    //         const result = await response.json();
    //          if (result.candidates && result.candidates.length > 0 &&
    //             result.candidates[0].content && result.candidates[0].content.parts &&
    //             result.candidates[0].content.parts.length > 0) {
    //              const text = result.candidates[0].content.parts[0].text;
    //              setSimplifiedText(text);
    //         } else {
    //              throw new Error("Invalid response structure from API.");
    //         }
    //     } catch (e: unknown) {
    //         setError((e as AppError).message || "An unknown error occurred.");
    //         console.error(e);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // return (
    //     <Section title="Simplify The Science" icon={<BrainCircuit className="text-purple-500" />}>
    //         <p className="text-slate-600 mb-4 text-sm">Paste a confusing snippet from a study below and let our AI-powered helper explain it in simple terms.</p>
    //         <div className="space-y-4">
    //             <textarea
    //                 value={inputText}
    //                 onChange={(e) => setInputText(e.target.value)}
    //                 placeholder="Paste scientific text here..."
    //                 className="w-full h-32 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
    //             />
    //             <div className="flex items-center justify-between">
    //                  <button
    //                     onClick={() => setInputText(exampleText)}
    //                     className="text-xs text-purple-600 hover:underline"
    //                     >
    //                     Use Example
    //                 </button>
    //                 <button
    //                     onClick={handleSimplify}
    //                     disabled={isLoading}
    //                     className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
    //                 >
    //                     {isLoading ? <Loader2 className="animate-spin mr-2" /> : <BrainCircuit className="mr-2" size={18} />}
    //                     Simplify
    //                 </button>
    //             </div>
    //              {error && <p className="text-red-500 text-sm">{error}</p>}
    //             {simplifiedText && (
    //                 <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg animate-fade-in">
    //                     <h4 className="font-bold mb-2 text-purple-800">Simplified Explanation:</h4>
    //                     <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">{simplifiedText}</div>
    //                 </div>
    //             )}
    //         </div>
    //     </Section>
    // );
// };


// --- Gemini AI Feature 2: "Spot The Bias" ---

const biasScenarios = [
    {
        id: 1,
        text: "A new study published by 'The Soda Council' finds that daily soda consumption is not linked to weight gain in adults. The study surveyed 5,000 people about their diets.",
        correct_bias: "Conflict of Interest",
        explanation: "You're on the right track with thinking about potential problems with the study! However, in this scenario, **Conflict of Interest** is the more prominent and immediate concern than sample size (though sample size could *also* be a concern that needs investigation). \n\n Here's why: \n \n *   **Conflict of Interest Explained:** A conflict of interest exists when the entity conducting or funding the research has a vested interest in the outcome of the study. In this case, \"The Soda Council\" is likely an organization representing soda manufacturers. They would directly benefit from a study that concludes soda isn't linked to weight gain, as it could boost sales and improve public perception of their product. \n \n *   **Why it's Misleading:** The Soda Council's involvement casts doubt on the objectivity of the research. Their desire for a specific outcome (soda isn't bad) might influence the study's design, execution, analysis, or even the way the results are presented. It doesn't automatically mean the study is wrong, but it *does* mean we should be extra cautious. \n \n *   **What to Look For:** Always be wary of studies funded by organizations with a clear stake in the results. Ask yourself: \n \n*   Who funded the research? \n \n *   Could the funding source benefit from a particular outcome? \n \n*   Were the researchers independent of the funding source, or were they employees of the Soda Council? \n \n*   Has the study been replicated by independent researchers with no ties to the soda industry? \n \n*   Look for transparency: Does the study clearly declare the funding source and any potential conflicts of interest? \n \n While a small sample size *could* be a problem in some studies, the conflict of interest raises a more immediate red flag here. A study can *appear* well-designed (large sample size, etc.) but still be biased due to the influence of the funding source. Always consider the source!",
    },
    {
        id: 2,
        text: "After a local news story about shark attacks, a person claims, 'I'm never swimming in the ocean again! It's too dangerous!' despite statistics showing bee stings cause more deaths annually.",
        correct_bias: "Availability Heuristic / Sensationalism",
        explanation: "Okay, let's break down this scenario and the biases at play. \n \n You're *partially* on the right track with \"Correlation vs. Causation,\" but \"Availability Heuristic\" or \"Sensationalism\" is a more direct fit. Here's why: \n \n *   **Why your answer is close, but not quite:** While correlation and causation *could* be tangentially related (perhaps someone *mistakenly* infers that news reports *cause* fear), the core issue isn't about misinterpreting statistical relationships. It's about the outsized influence of recent, vivid information on decision-making. \n \n *   **The Primary Bias: Availability Heuristic (and Sensationalism):** The availability heuristic is a mental shortcut where people estimate the likelihood of an event based on how easily examples come to mind. In this case, the recent news story about shark attacks makes shark attacks readily available in the person's memory. Sensationalism in media (like focusing on dramatic shark attacks) amplifies this effect. \n \n *   **Why it's misleading:** Because the person is overestimating the risk of swimming in the ocean based on a recent, dramatic event, they're ignoring the actual statistical probability of shark attacks compared to other, less sensational dangers (like bee stings). Their decision is driven by fear fueled by readily available, but potentially unrepresentative, information. \n \n *   **What a Critical Reader Should Look For:** \n \n*   **Look beyond the headlines:** Don't let emotionally charged stories disproportionately influence your perception of risk. \n \n*   **Seek out reliable statistics:** Compare the reported risk with actual data on the probability of the event. What are the actual numbers of shark attack fatalities vs. bee sting fatalities? \n \n*   **Consider the source:** Is the news source known for sensationalism? Are they presenting a balanced view, or are they focusing on the most extreme cases? \n \n*   **Recognize your own biases:** Be aware that vivid, recent events will naturally be more memorable, and actively work to counter this bias by seeking objective information. \n \n In short, the person is letting a recent, sensationalized event (shark attack news) overshadow actual statistical data when making a decision. This is the essence of the availability heuristic.",
    },
    {
        id: 3,
        text: "A blog post reads: 'A study shows ice cream sales are linked to higher crime rates. Therefore, to reduce crime, we should ban ice cream.'",
        correct_bias: "Correlation vs. Causation",
        explanation: "You're not quite on the right track with \"Conflict of Interest\" in this case. While conflicts of interest are important to consider in scientific studies, they don't directly apply to the *reasoning* presented in the blog post. \n \n The primary problem here is **Correlation vs. Causation**. \n \n Here's why: \n \n *   **The Problem:** The blog post assumes that because ice cream sales *correlate* with higher crime rates (meaning they happen at the same time or tend to increase together), ice cream sales *cause* the higher crime rates. This is a logical leap. \n \n *   **Why it's misleading:** Just because two things are related doesn't mean one causes the other. There could be a third, unmentioned factor (a \"lurking variable\") that influences both. For example, warmer weather might lead to both increased ice cream sales and increased crime (more people are outside, creating more opportunities for both buying ice cream and committing crimes). \n \n *   **What to look for:** A critical reader should ask: \n *   Is there evidence of a direct cause-and-effect relationship? \n *   Could a third factor be responsible for both trends? \n *   Did the study control for other variables that might influence crime rates? \n *   Is it possible the causation is reversed (maybe higher crime rates lead to people buying more ice cream as a comfort?)\n \n In short, don't assume that because two things are related, one *causes* the other. Look for stronger evidence of causation before drawing that conclusion.",
    },
    {
        id: 4,
        text: "A supplement ad states: 'In our study, users who took our 'MegaBrain' pill had a 200% increase in memory scores!' The study tested 10 people and the 'score' was how many items they remembered from a list of 3.",
        correct_bias: "Small Sample Size / Misleading Percentages",
        explanation: "Okay, let's break down this scenario. \n \n While you're right to be skeptical (and thinking about correlation vs. causation is good!), the primary problem here isn't *necessarily* claiming the supplement *caused* the improvement, though that's definitely implied. The biggest issue is the **Small Sample Size / Misleading Percentages**. \n \n Here's why: \n \n *   **Small Sample Size:** Testing only 10 people is a ridiculously small sample size. With so few participants, individual variations can drastically skew the results. It's entirely possible that the 200% increase is due to chance or some other factor affecting a few individuals, rather than a real effect of the supplement. A larger sample size (e.g., hundreds of participants) would provide much more reliable data.\n *   **Misleading Percentages:** A 200% increase sounds impressive, but in this context, it's deceptive. Remembering items from a list of 3 is the metric. Someone going from remembering 1 item to remembering all 3 items would show a 200% increase. This sounds better than it is! Percentages can easily exaggerate small changes, especially when the baseline is very low.\n *   **How they relate:** A small sample size makes a percentage change much more volatile and susceptible to being misleading. \n \n **In short:** The ad uses a small study and a large percentage to create a false impression of the supplement's effectiveness. \n \n **What to look for as a critical reader:** \n \n 1.  **Sample Size:** Always check the number of participants in a study. Be wary of studies with very small sample sizes (anything under 30 should be viewed with significant skepticism, and ideally you want hundreds or thousands depending on the type of study). \n \n 2.  **Absolute Numbers:** Look beyond percentages. What were the actual scores or values before and after? Ask: \"What does that percentage *actually* mean in real numbers?\" \n \n 3.  **Consider the Baseline:** If someone's starting point is very low, even a small improvement can appear as a large percentage increase. \n \n 4.  **Source of the Study:** Was the study funded or conducted by the supplement company itself? This raises a red flag for potential bias. \n \n So, while correlation vs. causation is *related* because the ad implies the pill *caused* the increase, the more glaring issue is the weak evidence due to the small sample size and inflated percentage. Good job spotting potential problems, keep practicing!",
    }
];

const GeminiBiasQuiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [userAnswer, setUserAnswer] = useState<string | null>('');
    const [explanation, setExplanation] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const currentScenario = biasScenarios[currentQuestionIndex];
    console.log('currentScenario.explanation :>> ', currentScenario.explanation);

    const fetchExplanation = useCallback(async () => {
        if (!userAnswer) return;
        setIsLoading(true);
        setExplanation('');
        
        // const prompt = `You are a helpful expert in research methods and logical fallacies. A user is learning to spot bias in scientific reporting.
        
        // The reported scenario is: "${currentScenario.text}"
        // The user guessed the bias is: "${userAnswer}"
        // The likely correct bias is: "${currentScenario.correct_bias}"

        // Please provide a concise and clear explanation. Start by confirming if the user's guess was on the right track or not. Then, explain what the primary bias or fallacy is in the scenario, why it's misleading, and what a critical reader should look for. Keep it simple and educational.`;

        try {
            // const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            // const payload = { contents: chatHistory };

            // const response = await fetch(apiUrl, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });
            // if (!response.ok) throw new Error("API request failed");
            const result = currentScenario.explanation //await response.json();
            setExplanation(result)

            // if (result.candidates && result.candidates.length > 0) {
            //     setExplanation(result.candidates[0].content.parts[0].text);
            // } else {
            //      throw new Error("Invalid response structure from API.");
            // }
        } catch (e) {
            console.error(e);
            setExplanation("Sorry, I couldn't fetch an explanation right now.");
        } finally {
            setIsLoading(false);
        }
    }, [userAnswer, currentScenario]);

    useEffect(() => {
        if (userAnswer) {
            fetchExplanation();
        }
    }, [userAnswer, fetchExplanation]);

    const handleNextQuestion = () => {
        setUserAnswer(null);
        setExplanation('');
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % biasScenarios.length);
    };
    
    return (
        <Section title="Spot The Bias" icon={<AlertTriangle className="text-red-500" />}>
            <p className="text-slate-600 mb-4 text-sm">Test your critical thinking skills. Read the scenario and pick the most likely issue. Our AI helper will explain the answer.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <p className="italic text-slate-700">&quot;{currentScenario.text}&quot;</p>
                
                {!userAnswer ? (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">What&apos;s the most likely issue here?</h4>
                        <button onClick={() => setUserAnswer("Conflict of Interest")} className="bias-choice-btn">Conflict of Interest</button>
                        <button onClick={() => setUserAnswer("Correlation vs. Causation")} className="bias-choice-btn">Correlation vs. Causation</button>
                        <button onClick={() => setUserAnswer("Small Sample Size")} className="bias-choice-btn">Small Sample Size</button>
                        <button onClick={() => setUserAnswer("Sensationalism")} className="bias-choice-btn">Sensationalism</button>
                    </div>
                ) : (
                    <div>
                        {isLoading && <div className="flex items-center text-slate-500"><Loader2 className="animate-spin mr-2" />Fetching explanation...</div>}
                        {explanation && (
                            <div className="prose prose-sm text-slate-800 bg-green-50 p-3 rounded-md border border-green-200 animate-fade-in whitespace-pre-wrap">{explanation}</div>
                        )}
                         <button
                            onClick={handleNextQuestion}
                            className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
                        >
                            Next Scenario <ArrowRight className="ml-2" size={16}/>
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
};
