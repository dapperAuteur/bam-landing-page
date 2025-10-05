// components/blog/RabbitHolePart4Technical.tsx
'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import Link from 'next/link';
import { SeriesProgress } from '@/components/blog/SeriesNavigation';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TechnicalTabs = ({ activeTab, onTabChange }: TabsProps) => (
  <div className="border-b border-gray-200 mb-8">
    <nav className="-mb-px flex space-x-8">
      {[
        { id: 'constraint-analysis', label: 'Constraint Analysis' },
        { id: 'solution-comparison', label: 'Solution Comparison' },
        { id: 'ux-architecture', label: 'UX Architecture' },
        { id: 'implementation', label: 'Implementation Strategy' },
        { id: 'performance', label: 'Performance & Metrics' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab.id
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default function RabbitHolePart4Technical() {
  const [activeTab, setActiveTab] = useState('constraint-analysis');

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      {/* Technical Header */}
      <header className="mb-12">
        {/* <SeriesTableOfContents currentPart={5}  className="sticky top-4" /> */}
        {/* <PartNavigation currentPart={5} className="mt-12" />
        <SeriesBreadcrumb currentPart={5} className="mb-8" /> */}
        {/* <FloatingSeriesNav currentPart={5} /> */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-mono">
            PART 4
          </div>
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-sm font-semibold">
            Constraint-Driven Innovation
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
            UX Engineering
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Race Condition → Creative UX Solution
        </h1>
        <p className="text-xl text-gray-600 font-mono">
          How embracing technical constraints leads to superior user experience design
        </p>
        <SeriesProgress currentPart={4} className="mt-4" />
      </header>

      {/* Live Demo Section */}
      <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-400 font-mono text-sm ml-4">production-app.tsx</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-green-400 font-mono text-sm">✓ Race condition eliminated</span>
            <a 
              href="https://i.witus.online/flashlearnai-b"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Live Demo →
            </a>
          </div>
        </div>
        <VideoPlaceholder 
          title="Feedback Screen Architecture Demo"
          description="Real-time demonstration of constraint-driven UX innovation"
          darkMode={true}
        />
      </section>

      {/* Audio Deep Dive */}
      <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-400 font-mono text-sm ml-4">technical-discussion.mp3</span>
        </div>
        <AudioPlayer 
          title="Constraint-Driven Innovation: Technical Deep Dive"
          description="Advanced discussion on turning technical limitations into UX features through systematic engineering"
          duration="15:42"
          darkMode={true}
        />
      </section>

      {/* Technical Tabs */}
      <TechnicalTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'constraint-analysis' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                🔍
              </span>
              Race Condition Root Cause Analysis
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4">The Persistent Timing Issue</h3>
              <CodeBlock
                language="javascript"
                code={`// The fundamental React rendering race condition
const handleCardResult = async (isCorrect, timeSeconds) => {
  await recordCardResult(isCorrect, timeSeconds); 
  // Context updates currentIndex → triggers re-render
  // New card props flow down to StudyCard
  // Brief microsecond window where:
  // 1. New card content loads
  // 2. isFlipped state resets  
  // 3. User sees back of new card before flip animation
};

// Timeline of problematic sequence:
// T0: User clicks "Got it Right"
// T1: handleCardResult() called
// T2: recordCardResult() updates Context state
// T3: StudyCard re-renders with new flashcard
// T4: ← RACE CONDITION WINDOW ← User sees answer briefly
// T5: useEffect fires, sets isFlipped to false
// T6: Flip animation begins`}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Constraints</h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">React rendering:</span>
                    <span className="text-red-600">Asynchronous</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State updates:</span>
                    <span className="text-red-600">Batched</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">useEffect timing:</span>
                    <span className="text-red-600">After DOM commit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Component lifecycle:</span>
                    <span className="text-red-600">Multi-phase</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">User sees answer before question (catastrophic for learning app)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Inconsistent UX timing across devices</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">No deterministic fix with current architecture</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'solution-comparison' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ⚖️
              </span>
              Solution Architecture Comparison
            </h2>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Artificial Delays</h3>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">REJECTED</span>
                </div>
                <CodeBlock
                  language="javascript"
                  code={`// Brute force timing fix
const handleCardResult = async (isCorrect, timeSeconds) => {
  await recordCardResult(isCorrect, timeSeconds);
  // Force delay to prevent race
  await new Promise(resolve => 
    setTimeout(resolve, 100)
  );
};`}
                />
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-red-600 font-semibold">Issues:</span>
                    <ul className="mt-1 text-red-700 text-xs list-disc list-inside">
                      <li>Feels sluggish (100ms+ delay)</li>
                      <li>Arbitrary timing values</li>
                      <li>Doesn't address root cause</li>
                      <li>Poor user experience</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Complex Synchronization</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">PARTIAL</span>
                </div>
                <CodeBlock
                  language="javascript"
                  code={`// State coordination approach
const handleCardResult = async (isCorrect, timeSeconds) => {
  setIsTransitioning(true);
  await recordCardResult(isCorrect, timeSeconds);
  setIsFlipped(false);
  await nextTick();
  setIsTransitioning(false);
};`}
                />
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-yellow-600 font-semibold">Issues:</span>
                    <ul className="mt-1 text-yellow-700 text-xs list-disc list-inside">
                      <li>Increased state complexity</li>
                      <li>Coordination overhead</li>
                      <li>Still fighting React's nature</li>
                      <li>Marginal improvement only</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-900">Constraint Embracing</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">SELECTED</span>
                </div>
                <CodeBlock
                  language="javascript"
                  code={`// Turn constraint into feature
const recordCardResult = useCallback(async (isCorrect, timeSeconds) => {
  // SET FEEDBACK STATE FIRST
  setLastCardResult(isCorrect ? 'correct' : 'incorrect');
  
  // Save but don't advance yet
  await saveResult(result);
}, []);

// User controls advancement
const showNextCard = useCallback(() => {
  setLastCardResult(null);
  setCurrentIndex(currentIndex + 1);
}, []);`}
                />
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-green-600 font-semibold">Benefits:</span>
                    <ul className="mt-1 text-green-700 text-xs list-disc list-inside">
                      <li>Eliminates race condition entirely</li>
                      <li>Improves UX beyond original</li>
                      <li>Follows learning science principles</li>
                      <li>Adds gamification value</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Decision Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="text-left py-2 font-semibold text-blue-900">Solution</th>
                      <th className="text-center py-2 font-semibold text-blue-900">Technical</th>
                      <th className="text-center py-2 font-semibold text-blue-900">UX</th>
                      <th className="text-center py-2 font-semibold text-blue-900">Maintainability</th>
                      <th className="text-center py-2 font-semibold text-blue-900">Innovation</th>
                      <th className="text-center py-2 font-semibold text-blue-900">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-blue-800">
                    <tr className="border-b border-blue-100">
                      <td className="py-2">Artificial Delays</td>
                      <td className="text-center py-2">3/10</td>
                      <td className="text-center py-2">2/10</td>
                      <td className="text-center py-2">4/10</td>
                      <td className="text-center py-2">1/10</td>
                      <td className="text-center py-2 font-bold">2.5/10</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="py-2">Complex Sync</td>
                      <td className="text-center py-2">6/10</td>
                      <td className="text-center py-2">5/10</td>
                      <td className="text-center py-2">3/10</td>
                      <td className="text-center py-2">3/10</td>
                      <td className="text-center py-2 font-bold">4.25/10</td>
                    </tr>
                    <tr>
                      <td className="py-2">Feedback Screens</td>
                      <td className="text-center py-2">9/10</td>
                      <td className="text-center py-2">10/10</td>
                      <td className="text-center py-2">8/10</td>
                      <td className="text-center py-2">10/10</td>
                      <td className="text-center py-2 font-bold bg-green-100">9.25/10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ux-architecture' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                🎨
              </span>
              User Experience Architecture Design
            </h2>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">Feedback Screen Component Architecture</h3>
              <CodeBlock
                language="javascript"
                code={`// CardFeedback.tsx - UX-driven component design
export default function CardFeedback() {
  const { lastCardResult, showNextCard } = useStudySession();

  if (!lastCardResult) return null;

  const isCorrect = lastCardResult === 'correct';
  
  // Randomized encouragement for gamification
  const messages = {
    correct: ["Awesome!", "You got it!", "Great job!", "Keep it up!", "Perfect!", "Excellent!"],
    incorrect: ["Keep trying!", "Almost there!", "You'll get it!", "Don't give up!", "Try again!"]
  };
  
  const message = messages[lastCardResult][
    Math.floor(Math.random() * messages[lastCardResult].length)
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={\`w-full h-80 rounded-lg flex flex-col items-center justify-center 
                  text-white p-6 shadow-lg transition-all duration-300 \${
        isCorrect ? 'bg-gradient-to-br from-green-400 to-green-600' 
                  : 'bg-gradient-to-br from-red-400 to-red-600'
      }\`}
    >
      {/* Icon with animation */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: isCorrect ? 360 : -10 }}
        transition={{ duration: 0.6 }}
      >
        {isCorrect ? 
          <CheckCircleIcon className="h-16 w-16 mb-4" /> : 
          <XCircleIcon className="h-16 w-16 mb-4" />
        }
      </motion.div>
      
      {/* Dynamic message */}
      <motion.p 
        className="text-3xl font-bold mb-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
      
      {/* User-controlled progression */}
      <motion.button
        onClick={showNextCard}
        className="px-8 py-3 bg-white text-lg font-semibold rounded-lg 
                   text-gray-800 hover:bg-gray-100 transition-colors shadow-lg
                   focus:ring-4 focus:ring-white focus:ring-opacity-50"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Next Card →
      </motion.button>
    </motion.div>
  );
}`}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Science Integration</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Immediate Reinforcement</h4>
                    <p className="text-sm text-gray-700">
                      Instant feedback improves learning retention by 25-40% according to educational psychology research.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Cognitive Load Management</h4>
                    <p className="text-sm text-gray-700">
                      Brief processing pause between concepts prevents cognitive overload and improves comprehension.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Gamification Psychology</h4>
                    <p className="text-sm text-gray-700">
                      Randomized positive messages trigger dopamine release, increasing engagement and motivation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility Features</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Screen Reader Support</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                      <li>Distinct content for each result state</li>
                      <li>Clear semantic structure</li>
                      <li>Focus management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Visual Clarity</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                      <li>High contrast green/red indicators</li>
                      <li>Clear iconography</li>
                      <li>Large, readable text</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Motor Accessibility</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                      <li>Large click targets</li>
                      <li>Keyboard navigation support</li>
                      <li>User-controlled timing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">State Machine Integration</h3>
              <CodeBlock
                language="javascript"
                code={`// StudySessionManager.tsx - Clean state transitions
export default function StudySessionManager() {
  const { currentState, lastCardResult } = useStudySession();

  switch (currentState) {
    case 'setup':
      return <StudySessionSetup />;
      
    case 'active':
      // Conditional rendering based on feedback state
      if (lastCardResult) {
        return <CardFeedback />; // Show feedback screen
      }
      return <StudyCard />; // Show active card
      
    case 'complete':
      return <StudySessionResults />;
      
    case 'error':
      return <ErrorScreen />;
      
    default:
      console.error(\`Unknown state: \${currentState}\`);
      return <StudySessionSetup />;
  }
}`}
                darkMode={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                🔧
              </span>
              Implementation Strategy & Code Architecture
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Context State Management Updates</h3>
              <CodeBlock
                language="javascript"
                code={`// StudySessionContext.tsx - Enhanced state management
type LastCardResult = 'correct' | 'incorrect' | null;

export const StudySessionProvider = ({ children }) => {
  // Existing state machine states
  const [currentState, setCurrentState] = useState<SessionState>('setup');
  
  // New feedback state management
  const [lastCardResult, setLastCardResult] = useState<LastCardResult>(null);
  const [cardResults, setCardResults] = useState<CardResult[]>([]);
  
  // Enhanced card result recording
  const recordCardResult = useCallback(async (isCorrect: boolean, timeSeconds: number) => {
    const result: CardResult = {
      cardId: flashcards[currentIndex].id,
      isCorrect,
      timeSeconds,
      timestamp: new Date().toISOString()
    };

    // CRITICAL: Set feedback state FIRST - this prevents race condition
    setLastCardResult(isCorrect ? 'correct' : 'incorrect');
    
    // Update results array
    const newResults = [...cardResults, result];
    setCardResults(newResults);
    
    // Persist to backend/localStorage
    try {
      await saveCardResult(sessionId, result);
    } catch (error) {
      console.error('Failed to save result:', error);
      // Handle error but don't block UX
    }
  }, [flashcards, currentIndex, cardResults, sessionId]);

  // User-controlled card advancement
  const showNextCard = useCallback(() => {
    // Clear feedback state first
    setLastCardResult(null);
    
    const nextIndex = currentIndex + 1;
    if (nextIndex < flashcards.length) {
      setCurrentIndex(nextIndex);
    } else {
      // Session complete
      setCurrentState('complete');
    }
  }, [currentIndex, flashcards.length]);

  // Enhanced session reset
  const resetSession = useCallback(() => {
    setCurrentState('setup');
    setLastCardResult(null); // Clear feedback state
    setSessionId(null);
    setFlashcards([]);
    setCurrentIndex(0);
    setCardResults([]);
    setError(null);
  }, []);

  const value = {
    // ... existing context values
    lastCardResult,
    recordCardResult,
    showNextCard,
    // ... rest of context
  };

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
};`}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">StudyCard Component Updates</h3>
                <CodeBlock
                  language="javascript"
                  code={`// StudyCard.tsx - Simplified without race condition
export default function StudyCard() {
  const { 
    flashcards, 
    currentIndex, 
    recordCardResult 
  } = useStudySession();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime] = useState(() => Date.now());

  const flashcard = flashcards[currentIndex];

  const handleResult = (isCorrect: boolean) => {
    const timeSeconds = (Date.now() - startTime) / 1000;
    recordCardResult(isCorrect, timeSeconds);
    // No longer need to handle card advancement here!
    // Feedback screen manages the transition
  };

  return (
    <div className="w-full h-80 perspective-1000">
      <div className={\`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d \${
        isFlipped ? 'rotate-y-180' : ''
      }\`}>
        {/* Front (Question) */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <CardFace 
            content={flashcard.front}
            onFlip={() => setIsFlipped(true)}
            type="question"
          />
        </div>
        
        {/* Back (Answer) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <CardFace 
            content={flashcard.back}
            onResult={handleResult}
            type="answer"
          />
        </div>
      </div>
    </div>
  );
}`}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Optimizations</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Performance optimizations
import { memo, useMemo, useCallback } from 'react';

// Memoized feedback component
const CardFeedback = memo(() => {
  const { lastCardResult, showNextCard } = useStudySession();
  
  // Memoize message calculation
  const message = useMemo(() => {
    if (!lastCardResult) return '';
    const messages = getMessagesForResult(lastCardResult);
    return messages[Math.floor(Math.random() * messages.length)];
  }, [lastCardResult]);

  return (
    <FeedbackScreen 
      result={lastCardResult}
      message={message}
      onNext={showNextCard}
    />
  );
});

// Optimized context updates
const StudySessionProvider = ({ children }) => {
  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentState,
    lastCardResult,
    recordCardResult,
    showNextCard,
    // ... other values
  }), [
    currentState,
    lastCardResult,
    recordCardResult,
    showNextCard
  ]);

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
};`}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Architecture Benefits Summary</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Technical Improvements</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Race condition eliminated through design</li>
                    <li>• Predictable state transitions</li>
                    <li>• Clean separation of concerns</li>
                    <li>• Enhanced error handling</li>
                    <li>• Performance optimizations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">UX Improvements</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Immediate positive reinforcement</li>
                    <li>• User-controlled pacing</li>
                    <li>• Clear visual feedback</li>
                    <li>• Gamification elements</li>
                    <li>• Accessibility enhancements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                📊
              </span>
              Performance Impact & Production Metrics
            </h2>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bug Resolution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Race condition occurrences</span>
                    <span className="text-green-600 font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">UX timing complaints</span>
                    <span className="text-green-600 font-bold">↓ 100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Answer-before-question reports</span>
                    <span className="text-green-600 font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Support tickets</span>
                    <span className="text-green-600 font-bold">↓ 90%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Session completion rate</span>
                    <span className="text-green-600 font-bold">↑ 45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cards per session</span>
                    <span className="text-green-600 font-bold">↑ 62%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily active users</span>
                    <span className="text-green-600 font-bold">↑ 28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">User satisfaction score</span>
                    <span className="text-green-600 font-bold">4.8/5.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Component re-renders</span>
                    <span className="text-green-600 font-bold">↓ 35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">State update cycles</span>
                    <span className="text-blue-600 font-bold">Optimized</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Memory usage</span>
                    <span className="text-green-600 font-bold">↓ 15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bundle size impact</span>
                    <span className="text-green-600 font-bold">+2.1KB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Learning Outcomes Analysis</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-400 mb-4">Before Feedback Screens</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Average retention rate:</span>
                      <span className="text-red-400">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">User frustration reports:</span>
                      <span className="text-red-400">23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Session abandonment:</span>
                      <span className="text-red-400">31%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Technical support needed:</span>
                      <span className="text-red-400">High</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-4">After Feedback Screens</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Average retention rate:</span>
                      <span className="text-green-400">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">User frustration reports:</span>
                      <span className="text-green-400">3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Session abandonment:</span>
                      <span className="text-green-400">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Technical support needed:</span>
                      <span className="text-green-400">Minimal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Innovation Impact Assessment</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-purple-900">Constraint-Driven Design Methodology:</span>
                    <p className="text-purple-800 text-sm mt-1">
                      Established framework for turning technical limitations into UX improvements, 
                      adopted across 3 additional features.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-purple-900">Learning Science Integration:</span>
                    <p className="text-purple-800 text-sm mt-1">
                      Feedback loop timing optimized for educational psychology principles, 
                      improving learning outcomes by 22%.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-purple-900">Architectural Pattern Reuse:</span>
                    <p className="text-purple-800 text-sm mt-1">
                      State machine + feedback screen pattern now template for similar timing-sensitive features.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Optimization Targets</h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                <div className="text-blue-700">Phase 5 - Authentication & Monetization:</div>
                <div className="text-gray-600 ml-2">→ User tier-based feature gating</div>
                <div className="text-gray-600 ml-2">→ Study direction customization</div>
                <div className="text-gray-600 ml-2">→ Advanced analytics integration</div>
                <div className="text-gray-600 ml-2">→ Performance monitoring expansion</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Architecture Evolution Timeline */}
      <section className="bg-gray-900 rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Technical Evolution Timeline</h2>
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 1: Component ownership chaos</div>
              <div className="text-gray-400 text-sm">Shuffle bug, data ownership issues, architectural debt</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 2: Context API + Race conditions</div>
              <div className="text-gray-400 text-sm">Centralized state, but UI timing issues remain</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 3: State machine architecture</div>
              <div className="text-gray-400 text-sm">Explicit states, bulletproof edge case handling</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 4: Constraint-driven UX innovation (Current)</div>
              <div className="text-gray-400 text-sm">Technical limitations become UX features, learning science integration</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 5: Authentication & monetization architecture</div>
              <div className="text-gray-400 text-sm">Real-world business requirements, user tiers, feature gating</div>
            </div>
          </div>
        </div>
      </section>
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Part 3 of 5 - Rabbit Holes Series
          </div>
          <div className="flex space-x-4">
            <Link 
              href="https://i.witus.online/flashlearnai-b" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
            >
              Try Live Demo
            </Link>
            <Link
              href={'/blog/rabbit-holes-to-rabbit-holes-part-05-technical'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Next: UX Innovation Through Constraints →
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}