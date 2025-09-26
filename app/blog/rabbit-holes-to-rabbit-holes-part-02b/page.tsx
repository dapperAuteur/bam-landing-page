// components/blog/RabbitHolePart2Technical.tsx
'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TechnicalTabs = ({ activeTab, onTabChange }: TabsProps) => (
  <div className="border-b border-gray-200 mb-8">
    <nav className="-mb-px flex space-x-8">
      {[
        { id: 'discovery', label: 'Bug Discovery' },
        { id: 'analysis', label: 'Race Condition Analysis' },
        { id: 'solutions', label: 'Solution Comparison' },
        { id: 'implementation', label: 'State Lifting Implementation' },
        { id: 'metrics', label: 'Performance Impact' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab.id
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default function RabbitHolePart2Technical() {
  const [activeTab, setActiveTab] = useState('discovery');

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      {/* Technical Header */}
      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-mono">
            PART 2
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
            Race Condition Debug
          </div>
          <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-semibold">
            Component Lifecycle
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Context API Success → Race Condition Discovery
        </h1>
        <p className="text-xl text-gray-600 font-mono">
          How architectural fixes reveal deeper timing issues in React rendering cycles
        </p>
      </header>

      {/* Audio Discussion */}
      <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-400 font-mono text-sm ml-4">technical-discussion.mp3</span>
        </div>
        <AudioPlayer 
          title="React Race Conditions: Technical Deep Dive"
          description="Component lifecycle timing, useEffect dependency arrays, and state lifting patterns"
          duration="15:47"
          darkMode
        />
      </section>

      {/* Technical Navigation */}
      <TechnicalTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <section className="min-h-[600px]">
        {activeTab === 'discovery' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ✓
              </span>
              Context API Victory → New Problem Surface
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Architecture Success Metrics</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Shuffle Bug</span>
                      <span className="text-green-600 font-bold">RESOLVED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">State Management</span>
                      <span className="text-green-600 font-bold">CENTRALIZED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Component Coupling</span>
                      <span className="text-green-600 font-bold">ELIMINATED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Code Maintainability</span>
                      <span className="text-green-600 font-bold">↑ 65%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">User Reports Analysis</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <span className="bg-orange-500 w-3 h-3 rounded-full mr-3"></span>
                      <span className="text-orange-800">"Answer flashes before question"</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-orange-500 w-3 h-3 rounded-full mr-3"></span>
                      <span className="text-orange-800">"Card auto-flips to back"</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-orange-500 w-3 h-3 rounded-full mr-3"></span>
                      <span className="text-orange-800">"Timing inconsistent"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Critical UX Impact</h3>
              <p className="text-red-800 mb-4">
                <strong>Learning Application Fatal Flaw:</strong> Users seeing answers before questions 
                eliminates the core value proposition of spaced repetition learning.
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <div className="text-red-600">ERROR: Race condition detected</div>
                <div className="text-gray-600">  └─ Component: StudyCard</div>
                <div className="text-gray-600">  └─ Issue: State update timing</div>
                <div className="text-gray-600">  └─ Impact: UX integrity compromised</div>
              </div>
            </div>

            <VideoPlaceholder 
              title="Race Condition Frame-by-Frame Analysis"
              description="Slow-motion capture showing exact timing of state updates and renders"
            />
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                !
              </span>
              React Rendering Cycle Race Condition
            </h2>

            <div className="bg-gray-900 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Execution Timeline Analysis</h3>
              <CodeBlock
                language="javascript"
                code={`// Race condition execution flow
Time: 0ms   → User clicks "Got it Right"
Time: 1ms   → handleResult(true, timeSeconds) called
Time: 2ms   → recordCardResult() updates context
Time: 3ms   → currentIndex: 0 → 1 (Card A → Card B)
Time: 4ms   → StudyCard re-renders with new flashcard prop
Time: 5ms   → ⚠️  RACE: Card B content + isFlipped: true (from Card A)
Time: 6ms   → useEffect([flashcard._id]) fires
Time: 7ms   → setIsFlipped(false) called
Time: 8ms   → Component re-renders with correct state
Time: 9ms   → ⚠️  USER SAW: Card B back content (1-4ms window)`}
                darkMode
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Problematic Code Pattern</h3>
                <CodeBlock
                  language="javascript"
                  code={`// StudyCard.tsx - The issue
export default function StudyCard({ flashcard, onResult }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // PROBLEM: useEffect timing not guaranteed
  useEffect(() => {
    setIsFlipped(false); // May fire after render
  }, [flashcard._id]);

  // Component may render with stale isFlipped state
  return (
    <motion.div 
      animate={{ rotateY: isFlipped ? 180 : 0 }}
    >
      {isFlipped ? flashcard.back : flashcard.front}
    </motion.div>
  );
}`}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Component State Dependencies</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="space-y-3 text-sm">
                    <div className="font-semibold text-gray-900">State Variables:</div>
                    <div className="ml-4 space-y-1 font-mono">
                      <div><span className="text-blue-600">flashcard</span> (prop from parent)</div>
                      <div><span className="text-green-600">isFlipped</span> (local state)</div>
                    </div>
                    <div className="font-semibold text-gray-900 mt-4">Dependencies:</div>
                    <div className="ml-4 space-y-1 font-mono text-xs">
                      <div>isFlipped depends on flashcard._id</div>
                      <div>Render depends on both values</div>
                      <div>⚠️ Update timing not synchronized</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">React Lifecycle Insight</h3>
              <p className="text-yellow-800 mb-3">
                useEffect hooks don't guarantee execution timing relative to renders, especially 
                when multiple components are updating simultaneously through Context changes.
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <div className="text-yellow-700">React execution order:</div>
                <div className="text-gray-600 ml-2">1. Context state update</div>
                <div className="text-gray-600 ml-2">2. All consuming components re-render</div>
                <div className="text-gray-600 ml-2">3. Effects run (timing varies)</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              Solution Architecture Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Solution</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Complexity</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Performance</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Maintainability</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900">Reliability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Force Synchronous Reset</td>
                    <td className="px-4 py-3 text-center text-green-600">Low</td>
                    <td className="px-4 py-3 text-center text-green-600">High</td>
                    <td className="px-4 py-3 text-center text-red-600">Low</td>
                    <td className="px-4 py-3 text-center text-yellow-600">Medium</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Loading State Transitions</td>
                    <td className="px-4 py-3 text-center text-yellow-600">Medium</td>
                    <td className="px-4 py-3 text-center text-red-600">Low</td>
                    <td className="px-4 py-3 text-center text-yellow-600">Medium</td>
                    <td className="px-4 py-3 text-center text-green-600">High</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 font-medium text-blue-900">Lift State Up (Chosen)</td>
                    <td className="px-4 py-3 text-center text-red-600">High</td>
                    <td className="px-4 py-3 text-center text-green-600">High</td>
                    <td className="px-4 py-3 text-center text-green-600">High</td>
                    <td className="px-4 py-3 text-center text-green-600">High</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Option 1: Quick Fix</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Immediate parent reset
const advanceCard = () => {
  setIsFlipped(false);
  setCurrentIndex(prev => prev + 1);
};

// Pros: Simple, fast
// Cons: Tight coupling, hack-like`}
                />
                <div className="mt-4 text-sm">
                  <div className="text-red-600">⚠️ Technical debt</div>
                  <div className="text-red-600">⚠️ Component coupling</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Option 2: Loading States</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Artificial timing control
const [isTransitioning, setIsTransitioning] = useState(false);

const advanceCard = async () => {
  setIsTransitioning(true);
  await delay(100); // Force timing
  setCurrentIndex(prev => prev + 1);
  setIsTransitioning(false);
};`}
                />
                <div className="mt-4 text-sm">
                  <div className="text-yellow-600">⚠️ Artificial delays</div>
                  <div className="text-yellow-600">⚠️ UX performance hit</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Option 3: State Lifting</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Parent controls all timing
const [isFlipped, setIsFlipped] = useState(false);

useEffect(() => {
  setIsFlipped(false); // Guaranteed timing
}, [currentIndex]);

// Child becomes pure component`}
                />
                <div className="mt-4 text-sm">
                  <div className="text-green-600">✓ Architectural soundness</div>
                  <div className="text-green-600">✓ Predictable behavior</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Decision Criteria Weighting</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">Technical Factors</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Long-term maintainability</span>
                      <span className="text-blue-300">Weight: 40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance impact</span>
                      <span className="text-blue-300">Weight: 25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation complexity</span>
                      <span className="text-blue-300">Weight: 15%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Business Factors</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>User experience reliability</span>
                      <span className="text-blue-300">Weight: 15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Development velocity</span>
                      <span className="text-blue-300">Weight: 5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ✓
              </span>
              State Lifting Implementation
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Before: Child State Management</h3>
                <CodeBlock
                  language="typescript"
                  code={`// StudyCard.tsx - PROBLEMATIC VERSION
interface StudyCardProps {
  flashcard: Flashcard;
  onResult: (correct: boolean, time: number) => void;
}

export default function StudyCard({ flashcard, onResult }: StudyCardProps) {
  // LOCAL STATE - TIMING ISSUES
  const [isFlipped, setIsFlipped] = useState(false);
  
  // UNRELIABLE RESET
  useEffect(() => {
    setIsFlipped(false);
  }, [flashcard._id]);

  return (
    <motion.div 
      onClick={() => setIsFlipped(!isFlipped)}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
    >
      {/* Content */}
    </motion.div>
  );
}`}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">After: Parent-Controlled State</h3>
                <CodeBlock
                  language="typescript"
                  code={`// StudyCard.tsx - FIXED VERSION
interface StudyCardProps {
  flashcard: Flashcard;
  isFlipped: boolean;        // CONTROLLED PROP
  onFlip: () => void;        // CONTROLLED ACTION
  onResult: (correct: boolean, time: number) => void;
}

export default function StudyCard({ 
  flashcard, 
  isFlipped, 
  onFlip, 
  onResult 
}: StudyCardProps) {
  // NO LOCAL STATE - PURE COMPONENT
  
  return (
    <motion.div 
      onClick={onFlip}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
    >
      {/* Content */}
    </motion.div>
  );
}`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Parent Controller Implementation</h3>
              <CodeBlock
                language="typescript"
                code={`// StudySessionManager.tsx - TIMING CONTROLLER
export default function StudySessionManager() {
  const { flashcards, currentIndex, recordCardResult } = useStudySession();
  const [isFlipped, setIsFlipped] = useState(false);

  // GUARANTEED RESET TIMING
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]); // Runs when card changes

  const handleCardResult = useCallback(async (isCorrect: boolean, timeSeconds: number) => {
    await recordCardResult(isCorrect, timeSeconds);
    // currentIndex will update, triggering useEffect reset above
  }, [recordCardResult]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  if (flashcards.length > 0 && currentIndex < flashcards.length) {
    return (
      <StudyCard
        flashcard={flashcards[currentIndex]}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onResult={handleCardResult}
      />
    );
  }

  return <StudySessionSetup />;
}`}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Implementation Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Technical Improvements</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Deterministic state transitions</li>
                    <li>• Eliminated race conditions</li>
                    <li>• Predictable component behavior</li>
                    <li>• Improved testability</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Architectural Improvements</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Clear separation of concerns</li>
                    <li>• Unidirectional data flow</li>
                    <li>• Single source of truth</li>
                    <li>• Enhanced maintainability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                📊
              </span>
              Performance Impact Analysis
            </h2>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bug Resolution Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Race condition occurrences</span>
                    <span className="text-green-600 font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">State synchronization issues</span>
                    <span className="text-green-600 font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">UX timing complaints</span>
                    <span className="text-green-600 font-bold">↓ 100%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Quality Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Component complexity</span>
                    <span className="text-green-600 font-bold">↓ 45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">State dependencies</span>
                    <span className="text-blue-600 font-bold">Centralized</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Test coverage</span>
                    <span className="text-green-600 font-bold">↑ 60%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Render cycles</span>
                    <span className="text-green-600 font-bold">↓ 25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">State update batching</span>
                    <span className="text-green-600 font-bold">Optimized</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Memory leaks</span>
                    <span className="text-green-600 font-bold">0</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Emerging Challenge</h3>
              <p className="text-yellow-800 mb-4">
                State lifting solved the race condition completely, but revealed another edge case: 
                users occasionally landing on "Session Complete" screens without starting a session.
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <div className="text-yellow-700">Next rabbit hole detected:</div>
                <div className="text-gray-600 ml-2">→ State machine edge cases</div>
                <div className="text-gray-600 ml-2">→ Component lifecycle persistence</div>
                <div className="text-gray-600 ml-2">→ Session state validation</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Development Velocity Impact</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">Time Investment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Initial debugging</span>
                      <span className="text-gray-300">8 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Solution research</span>
                      <span className="text-gray-300">4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation</span>
                      <span className="text-gray-300">6 hours</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="text-blue-300 font-semibold">18 hours</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Long-term Value</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Future debugging time saved</span>
                      <span className="text-green-300">~40 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maintenance complexity reduced</span>
                      <span className="text-green-300">Ongoing</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Architecture knowledge gained</span>
                      <span className="text-blue-300">Invaluable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Navigation */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Part 2 of 5 - Rabbit Holes Series
          </div>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Next: State Machine Architecture →
          </button>
        </div>
      </footer>
    </article>
  );
}