"use client";

import { AppError } from '../../../types/errors';
import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler, RadarController } from 'chart.js';

// Register all necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  RadarController,
  Title,
  Tooltip,
  Legend
);

// Reusable components for styling sections
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-12">{children}</h2>
);

const InfoCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

// Benefit card now includes a button to trigger the Gemini explanation
const BenefitCard = ({ icon, title, text, onExplain }: { icon: string, title: string, text: string, onExplain: (title: string) => void }) => (
  <InfoCard className="text-center flex flex-col justify-between">
    <div>
      <div className="text-5xl mb-4 text-blue-500">{icon}</div>
      <h3 className="text-xl font-bold text-blue-700 mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
    <button onClick={() => onExplain(title)} className="gemini-button mt-4">
      ✨ Explain Further
    </button>
  </InfoCard>
);

// A simple modal component for displaying Gemini content
const Modal = ({ isOpen, onClose, title, children, isLoading }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, isLoading: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">{title}</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="text-gray-700 whitespace-pre-wrap">{children}</div>
        )}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      </div>
    </div>
  );
};

// Main Infographic Component
const DiaphragmaticBreathingInfographic = () => {
  const cardioChartRef = useRef<HTMLCanvasElement | null>(null);
  const voiceChartRef = useRef<HTMLCanvasElement | null>(null);

  // State management for Gemini features
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  // const [practiceGoals, setPracticeGoals] = useState<string[]>([]);
  // const [sessionDuration, setSessionDuration] = useState<string>('10');
  // const [generatedPlan, setGeneratedPlan] = useState<string>('');
  // const [isPlanLoading, setIsPlanLoading] = useState<boolean>(false);
  // const [planError, setPlanError] = useState<string>('');

  // const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  // const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
  // Function to call Gemini API
  const callGeminiAPI = async (prompt: string) => {
    // API key is handled by the environment, no need to add one here.
    // const apiKey = GEMINI_API_KEY;
    // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    const response = await fetch("apiUrl", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response structure from API.");
    }
  };

  // Handler for the "Explain Further" button
  const handleExplainBenefit = async (benefitName: string) => {
    setModalTitle(`Explaining: ${benefitName}`);
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalContent('');
    let explanation = "";
    switch (benefitName) {
      case "Stress & Anxiety Reduction":
        explanation = "Diaphragmatic breathing, or belly breathing, helps reduce stress and anxiety by directly influencing your body's stress response. When you take slow, deep breaths using your diaphragm, you're essentially sending a \"calm down\" message to your nervous system. This type of breathing activates the parasympathetic nervous system, often referred to as the \"rest and digest\" system. This system works in opposition to the sympathetic nervous system, which triggers the \"fight or flight\" response during stressful situations. \n \nSpecifically, deep diaphragmatic breathing encourages more oxygen intake and better blood flow. As the diaphragm moves down during inhalation, it gently massages internal organs like the stomach and liver, which can aid digestion and reduce physical tension. The slower breathing rate also stimulates the vagus nerve, a major nerve connecting the brain to the body. Stimulating the vagus nerve helps lower heart rate, blood pressure, and muscle tension - all physiological indicators of stress. By consciously controlling your breath, you gain a powerful tool to override the body's automatic stress reaction and promote relaxation."

        break;
      case "Enhanced Focus":
        explanation = "Diaphragmatic breathing, or \"belly breathing,\" enhances focus primarily by influencing the autonomic nervous system. When you breathe deeply and slowly using your diaphragm, you stimulate the parasympathetic nervous system, often called the \"rest and digest\" system. This system actively counteracts the \"fight or flight\" response driven by the sympathetic nervous system, which can be easily triggered by stress and anxiety and ultimately distract from focus. Slow, deep breathing signals to your brain that you are safe and calm, helping to lower your heart rate and blood pressure. \n \nPhysiologically, deeper breaths increase oxygen intake and carbon dioxide expulsion more effectively. This improved gas exchange has a direct impact on brain function. With more oxygen delivered to the brain, neurons can fire more efficiently, leading to improved cognitive performance, clarity, and sustained attention. Reduced levels of carbon dioxide help balance brain pH, further optimizing neural activity. Essentially, by calming your body and optimizing brain oxygenation, diaphragmatic breathing provides the biological foundation for improved focus and mental clarity."

        break;
      case "Cardiovascular Health":
          explanation = "Diaphragmatic breathing, often called belly breathing, positively impacts cardiovascular health primarily by improving blood flow and reducing stress on the heart. When you breathe deeply using your diaphragm, the large muscle at the base of your lungs, it creates a gentle massage effect on your internal organs, including the heart and major blood vessels in your abdomen. This massage increases venous return - the flow of blood back to the heart. More blood returning to the heart means the heart has more volume to pump out with each beat, increasing cardiac output. Think of it like filling a water balloon more fully before squeezing; you get a more powerful squirt. \n \nSimultaneously, diaphragmatic breathing activates the parasympathetic nervous system, your body's \"rest and digest\" system. This activation lowers heart rate and blood pressure, reducing the overall workload on the heart. Furthermore, deeper breathing increases oxygen levels in the blood, which is crucial for efficient cellular function and overall cardiovascular health. By reducing stress hormones and increasing oxygen supply, diaphragmatic breathing can help lower the risk of developing conditions like hypertension and heart disease over time. It’s a simple yet powerful technique for supporting a healthier cardiovascular system."
          break;
        case "Improved Respiratory Function":
          explanation = "Diaphragmatic breathing, often called belly breathing, improves respiratory function by optimizing how you use your diaphragm, the primary muscle involved in breathing. When you breathe deeply using your diaphragm, it contracts and moves downwards. This creates more space in your chest cavity, allowing your lungs to expand more fully. More space means more air can be inhaled, increasing the amount of oxygen available to your body. Crucially, this deeper inhalation helps to fully inflate the lower parts of your lungs, which are often underutilized during shallow, chest-based breathing. This improved lung ventilation helps to clear out stale air and increases the overall efficiency of gas exchange – taking in oxygen and releasing carbon dioxide. \n \nThe benefits extend beyond simply getting more air. Diaphragmatic breathing strengthens the diaphragm muscle itself, making it more efficient at drawing air in and pushing it out. This reduces the reliance on secondary breathing muscles in your neck and shoulders, preventing strain and fatigue. By slowing down your breathing rate and deepening each breath, diaphragmatic breathing also activates the parasympathetic nervous system, promoting relaxation and reducing stress. This calming effect can further improve respiratory function by reducing tension in the airways and allowing for smoother, more effective breathing. In essence, it's like giving your lungs a workout and teaching your body to breathe more efficiently."
          break;
      case "Better Core Stability":
        explanation = "Diaphragmatic breathing, or \"belly breathing,\" is a simple yet powerful technique that significantly improves core stability. The diaphragm, a large dome-shaped muscle at the base of your lungs, is the primary muscle responsible for breathing. When you inhale deeply, engaging the diaphragm, it contracts and moves downwards. This downward movement increases pressure within your abdomen (intra-abdominal pressure or IAP). This increased IAP acts like an internal weightlifting belt, providing support to your spine and surrounding core muscles. Imagine squeezing a balloon - the internal pressure makes it firmer and harder to bend. The same principle applies to your core. \n \nThis internal pressure increase stimulates and activates your deep core muscles, including the transverse abdominis (the deepest abdominal muscle that wraps around your torso like a corset), the multifidus (small muscles supporting the spine), and the pelvic floor muscles. These muscles work synergistically to stabilize your spine and pelvis, providing a solid foundation for movement. When these muscles are properly engaged through diaphragmatic breathing, you create a more stable and efficient base of support for activities like lifting, bending, and even just standing. Therefore, mastering diaphragmatic breathing effectively engages the entire core unit, contributing significantly to improved balance, posture, and reduced risk of injury."
        break;
      case "Promotes Healthy Aging":
          explanation = "Diaphragmatic breathing, or belly breathing, is a simple technique with surprisingly profound effects on healthy aging. As we age, our breathing often becomes shallow and restricted, primarily using our chest muscles. This inefficient breathing pattern doesn't fully oxygenate our blood or effectively remove waste products, leading to fatigue and increased stress. Diaphragmatic breathing, on the other hand, utilizes the diaphragm, a large muscle at the base of the lungs, to draw air deep into the abdomen. This deep breathing maximizes oxygen intake, fueling our cells and tissues more effectively, crucial for maintaining energy levels and vitality as we get older. \n \nBeyond oxygenation, diaphragmatic breathing helps regulate our nervous system. It stimulates the vagus nerve, the main component of the parasympathetic nervous system, often called the \"rest and digest\" system. When this nerve is activated, it slows down our heart rate, lowers blood pressure, and reduces the production of stress hormones like cortisol. Chronic stress accelerates aging, so consistently reducing stress through diaphragmatic breathing can contribute to a healthier, more resilient body and mind. This contributes to better sleep, improved digestion, and a strengthened immune system, all essential components of successful aging."
          break;
    
      default:
        break;
    }
    setModalContent(explanation);
    setIsModalLoading(false);
  };

  // Handler for goal selection in the plan generator
  // const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, checked } = event.target;
  //   setPracticeGoals(prev => {
  //     return checked ? [...prev, value] : prev.filter(goal => goal !== value)
  //   }
  //   );
  // };

  // Handler for the "Generate Plan" button
//   const handleGeneratePlan = async () => {
//     if (practiceGoals.length === 0) {
//       setPlanError("Please select at least one goal.");
//       return;
//     }
//     setPlanError('');
//     setIsPlanLoading(true);
//     setGeneratedPlan('');

//     const prompt = `Create a 7-day diaphragmatic breathing practice plan for a beginner. The user's goals are: ${practiceGoals.join(', ')}. Each daily session should be approximately ${sessionDuration} minutes long. Suggest specific techniques (like Basic Ratio Breathing, 4-7-8 Breathing, or Box Breathing where appropriate) and structure for each day. Make the plan encouraging and easy to follow. Format the output with Markdown for bolding and lists.`;

//     try {
//       const plan = await callGeminiAPI(prompt);
//       setGeneratedPlan(plan);
//     } catch (error: unknown) {
//  setPlanError(`Sorry, we couldn't generate your plan. Error: ${(error as AppError).message}`);
//     } finally {
//       setIsPlanLoading(false);
//     }
//   };

  // Chart drawing logic
  useEffect(() => {
    let cardioChartInstance: ChartJS | null = null;
    let voiceChartInstance: ChartJS | null = null;

    if (cardioChartRef.current) {
      const cardioCtx = cardioChartRef.current.getContext('2d');
      if(!cardioCtx) return;
      cardioChartInstance = new ChartJS(cardioCtx, {
        type: 'bar',
        data: {
          labels: ['Heart Rate (bpm)', 'Systolic BP (mmHg)', 'Diastolic BP (mmHg)'],
          datasets: [
            {
              label: 'Typical State',
              data: [85, 135, 88],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'After Consistent Practice',
              data: [70, 125, 80],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: false, suggestedMin: 50 } },
          plugins: { legend: { position: 'top' } },
        },
      });
    }

    if (voiceChartRef.current) {
      const voiceCtx = voiceChartRef.current.getContext('2d');
      if(!voiceCtx) return;
      voiceChartInstance = new ChartJS(voiceCtx, {
        type: 'radar',
        data: {
          labels: ['Vocal Stamina', 'Breath Control', 'Vocal Power', 'Resonance', 'Reduced Strain'],
          datasets: [
            {
              label: 'With Diaphragmatic Support',
              data: [9, 9, 8, 8, 9],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { display: false },
              suggestedMin: 0,
              suggestedMax: 10,
              ticks: { backdropColor: 'transparent' }
            },
          },
        },
      });
    }

    return () => {
      if (cardioChartInstance) cardioChartInstance.destroy();
      if (voiceChartInstance) voiceChartInstance.destroy();
    };
  }, []);

  return (
    <>
      <style>{`
        .gemini-button {
          background-color: #FFD166; /* Accent color */
          color: #003E5C; /* Dark blue text for contrast */
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          transition: background-color 0.3s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #EAA94A;
        }
        .gemini-button:hover {
          background-color: #FCA311; /* Darker accent */
        }
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0077B6;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="bg-blue-50 font-sans p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
              The Power of Breath: A Guide to Diaphragmatic Breathing
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Unlock health, longevity, and vocal excellence by mastering your body&apos;s most fundamental rhythm.
            </p>
          </header>

          <SectionTitle>What is Diaphragmatic Breathing?</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
             <InfoCard>
              <h3 className="text-2xl font-bold text-blue-700 mb-3">More Than Just a Deep Breath</h3>
              <p className="text-gray-600 mb-4">
                Often called &quot;belly breathing,&quot; this is the practice of engaging your diaphragm, a large muscle at the base of your lungs designed to do ~80% of the work of breathing.
              </p>
              <p className="text-gray-600">
                It contrasts with shallow &quot;chest breathing,&quot; which uses smaller neck and shoulder muscles, leading to tension and inefficiency. Learning this technique is about re-learning your body&apos;s natural, optimal way to breathe.
              </p>
            </InfoCard>
            <InfoCard>
              <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Visualizing the Mechanics</h3>
              <div className="flex justify-around items-center text-center">
                <div>
                  <p className="font-semibold text-lg text-green-600">INHALE</p>
                  <div className="text-4xl my-2">⬇️</div>
                  <p className="bg-green-100 text-green-800 rounded-lg p-2">Belly Expands</p>
                </div>
                <div>
                  <p className="font-semibold text-lg text-red-600">EXHALE</p>
                  <div className="text-4xl my-2">⬆️</div>
                  <p className="bg-red-100 text-red-800 rounded-lg p-2">Belly Falls</p>
                </div>
              </div>
            </InfoCard>
          </div>

          <SectionTitle>The Transformative Benefits</SectionTitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <BenefitCard icon="📉" title="Stress & Anxiety Reduction" text="Directly activates your body's relaxation response, lowering stress hormones." onExplain={handleExplainBenefit} />
            <BenefitCard icon="🧠" title="Enhanced Focus" text="Improves sustained attention and cognitive performance by increasing oxygen saturation." onExplain={handleExplainBenefit} />
            <BenefitCard icon="❤️" title="Cardiovascular Health" text="Contributes to lower resting heart rate, blood pressure, and improved heart rate variability." onExplain={handleExplainBenefit} />
            <BenefitCard icon="🫁" title="Improved Respiratory Function" text="Strengthens the diaphragm, enhances lung efficiency, and supports conditions like COPD." onExplain={handleExplainBenefit} />
            <BenefitCard icon="🚶" title="Better Core Stability" text="Engages a key postural muscle, improving core strength and reducing back pain risk." onExplain={handleExplainBenefit} />
            <BenefitCard icon="🌟" title="Promotes Healthy Aging" text="Helps mitigate age-related declines in respiratory, cardiovascular, and cognitive function." onExplain={handleExplainBenefit} />
          </div>
          
          <InfoCard className="mb-20">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">A Look at the Data: Physiological Changes</h3>
            <p className="text-center text-gray-600 mb-6">Consistent practice can lead to measurable improvements in key health markers.</p>
            <div className="h-96">
              <canvas ref={cardioChartRef}></canvas>
            </div>
          </InfoCard>
          
          {/* <SectionTitle>Personalized Practice Plan Generator</SectionTitle>
          <InfoCard className="mb-20">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">1. Select Your Goals</h3>
                    <div className="space-y-2">
                        {['Stress Reduction', 'Improved Focus', 'Better Sleep', 'General Well-being'].map(goal => (
                            <div key={goal}>
                                <input type="checkbox" id={goal} value={goal} onChange={handleGoalChange} className="mr-2 rounded text-blue-600 focus:ring-blue-500"/>
                                <label htmlFor={goal}>{goal}</label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">2. Choose Session Duration</h3>
                    <select value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                    </select>
                </div>
            </div>
            <div className="text-center mt-6">
                <button onClick={handleGeneratePlan} disabled={isPlanLoading} className="gemini-button text-lg">
                    {isPlanLoading ? 'Generating...' : '✨ Generate My 7-Day Plan'}
                </button>
            </div>
            {isPlanLoading && <div className="flex justify-center mt-4"><div className="loading-spinner"></div></div>}
            {planError && <p className="text-red-500 text-center mt-4">{planError}</p>}
            {generatedPlan && (
                <div className="mt-6 p-4 border border-blue-200 rounded-md bg-blue-50/50">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Your Custom Plan:</h4>
                    <div className="text-gray-700 whitespace-pre-wrap">{generatedPlan}</div>
                </div>
            )}
          </InfoCard> */}

          <SectionTitle>How to Practice Effectively</SectionTitle>
          <InfoCard className="mb-20">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-blue-700 mb-3">The Core Technique (Beginner)</h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li><strong>Lie Down Comfortably:</strong> On your back, knees bent, feet flat on the floor.</li>
                  <li><strong>Hand Placement:</strong> Place one hand on your upper chest, the other on your belly. This is for feedback.</li>
                  <li><strong>Inhale Through Nose:</strong> Breathe in slowly. Feel your belly rise and push your hand up. Your chest hand should stay still.</li>
                  <li><strong>Exhale Slowly:</strong> Breathe out through your mouth. Feel your belly fall. Repeat gently and rhythmically.</li>
                </ol>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-700 mb-3">Finding Your Rhythm</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  <li><strong>Start Small:</strong> Begin with 5-10 minute sessions, 2-3 times per day.</li>
                  <li><strong>Be Consistent:</strong> Regular practice is more important than long, infrequent sessions.</li>
                  <li><strong>Stay Relaxed:</strong> The breath should be gentle and easy, not forced.</li>
                  <li><strong>The Goal:</strong> To make diaphragmatic breathing your natural, default way of breathing.</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <SectionTitle>For Voiceover Artists & Speakers</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8 items-center">
              <InfoCard>
                  <h3 className="text-2xl font-bold text-blue-700 mb-3">Your Voice&apos;s Power Source</h3>
                  <p className="text-gray-600 mb-4">For any vocal professional, the breath is the engine. Proper diaphragmatic support is the key to control, stamina, and long-term vocal health.</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Allows for longer, more complex sentences.</li>
                      <li>Reduces strain on delicate vocal cords.</li>
                      <li>Improves vocal power and resonance.</li>
                      <li>Prevents vocal fatigue during long sessions.</li>
                  </ul>
              </InfoCard>
              <InfoCard>
                   <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Key Areas of Improvement</h3>
                  <div className="h-80">
                      <canvas ref={voiceChartRef}></canvas>
                  </div>
              </InfoCard>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        isLoading={isModalLoading}
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default DiaphragmaticBreathingInfographic;
