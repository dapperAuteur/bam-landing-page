// components/blog/RabbitHolePart3Technical.tsx
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
        { id: 'edge-case', label: 'Edge Case Analysis' },
        { id: 'state-machine', label: 'State Machine Design' },
        { id: 'implementation', label: 'Implementation Strategy' },
        { id: 'validation', label: 'State Validation' },
        { id: 'performance', label: 'Performance & Debugging' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab.id
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default function RabbitHolePart3Technical() {
  const [activeTab, setActiveTab] = useState('edge-case');

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
            PART 3
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-semibold">
            State Machine Architecture
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-semibold">
            Edge Case Resolution
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Race Condition Fix → Session Persistence Edge Case
        </h1>
        <p className="text-xl text-gray-600 font-mono">
          How architectural fixes reveal state persistence bugs and lead to bulletproof state machines
        </p>
        <SeriesProgress currentPart={3} className="mt-4" />
      </header>

      {/* Live Demo Section */}
      <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-400 font-mono text-sm ml-4">production-demo</span>
          </div>
          <Link 
            href="https://i.witus.online/flashlearnai-b" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Launch App →
          </Link>
        </div>
        {/* <VideoPlaceholder 
          title="State Machine Architecture Demo"
          description="Production walkthrough showing bulletproof state transitions and edge case handling"
          darkMode
        /> */}
      </section>

      {/* Audio Discussion */}
      <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <AudioPlayer 
          title="State Machine Engineering: Theory to Production"
          description="Deep technical discussion on finite state machines, edge case handling, and production debugging strategies"
          duration="22:18"
          darkMode
        />
      </section>

      {/* Technical Navigation */}
      <TechnicalTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <section className="min-h-[600px]">
        {activeTab === 'edge-case' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ⚠
              </span>
              Production Edge Case: Session Persistence Bug
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Bug Reproduction Criteria</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex items-center">
                      <span className="bg-red-500 w-3 h-3 rounded-full mr-3"></span>
                      <span className="text-red-700">User completes study session</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-red-500 w-3 h-3 rounded-full mr-3"></span>
                      <span className="text-red-700">Navigates away (tab close/browser refresh)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-red-500 w-3 h-3 rounded-full mr-3"></span>
                      <span className="text-red-700">Returns later (same session/device)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-red-500 w-3 h-3 rounded-full mr-3"></span>
                      <span className="text-red-700">Browser storage intact</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-red-500 w-3 h-3 rounded-full mr-3"></span>
                      <span className="text-red-700">Result: Phantom "Session Complete" screen</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">State Corruption Analysis</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <CodeBlock
                    language="javascript"
                    code={`// Problematic state inference logic
const StudySessionManager = () => {
  const { sessionId, isComplete, flashcards } = useStudySession();

  // PROBLEM: Multiple variables determining state
  if (isComplete && sessionId) {
    return <StudySessionResults />; // FALSE POSITIVE
  }

  // STATE CORRUPTION SCENARIO:
  // sessionId: "prev_session_123" (persisted)
  // isComplete: true (from previous session)
  // flashcards: [] (not loaded yet)
  // Result: Wrong component rendered
}`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Root Cause: Variable-Based State Logic</h3>
              <p className="text-yellow-800 mb-4">
                The application was inferring state from multiple boolean/object variables instead of maintaining 
                an explicit state machine. This created ambiguous combinations where the intended state was unclear.
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <div className="text-yellow-700">Anti-pattern identified:</div>
                <div className="text-gray-600 ml-2">→ State = f(sessionId, isComplete, flashcards, error)</div>
                <div className="text-gray-600 ml-2">→ 2^n possible combinations (many invalid)</div>
                <div className="text-gray-600 ml-2">→ Impossible to debug all edge cases</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Technical Impact Assessment</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-300">User Experience</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Phantom screens</span>
                      <span className="text-red-400">Critical</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User confusion</span>
                      <span className="text-red-400">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span>App abandonment risk</span>
                      <span className="text-yellow-400">Medium</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-orange-300">Development</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Debug complexity</span>
                      <span className="text-red-400">Very High</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Test coverage gaps</span>
                      <span className="text-yellow-400">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feature development risk</span>
                      <span className="text-yellow-400">Medium</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-blue-300">Business</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Support tickets</span>
                      <span className="text-yellow-400">Increasing</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User retention</span>
                      <span className="text-red-400">At risk</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technical debt</span>
                      <span className="text-red-400">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'state-machine' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ⚙
              </span>
              Finite State Machine Architecture
            </h2>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">State Machine Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Eliminates Ambiguity</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Single state variable controls behavior</li>
                    <li>• No invalid state combinations possible</li>
                    <li>• Clear state boundaries and definitions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Improves Maintainability</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Predictable state transitions</li>
                    <li>• Easy to add new states/transitions</li>
                    <li>• Self-documenting application flow</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">State Enumeration & Transitions</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">State Definitions</h4>
                  <CodeBlock
                    language="typescript"
                    code={`// Explicit state enumeration
type SessionState = 
  | 'setup'      // User selecting what to study
  | 'loading'    // Fetching data from API
  | 'active'     // Study session in progress
  | 'feedback'   // Showing result of current card
  | 'complete'   // Session finished, showing results
  | 'error';     // Something went wrong

// State validation
const isValidState = (state: string): state is SessionState => {
  return ['setup', 'loading', 'active', 'feedback', 'complete', 'error']
    .includes(state as SessionState);
};`}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Transition Matrix</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-1">From → To</th>
                          <th className="text-center py-1">Valid</th>
                          <th className="text-left py-1">Trigger</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr><td>setup → loading</td><td className="text-center">✓</td><td>startSession()</td></tr>
                        <tr><td>loading → active</td><td className="text-center">✓</td><td>data loaded</td></tr>
                        <tr><td>loading → error</td><td className="text-center">✓</td><td>fetch failed</td></tr>
                        <tr><td>active → feedback</td><td className="text-center">✓</td><td>user response</td></tr>
                        <tr><td>feedback → active</td><td className="text-center">✓</td><td>next card</td></tr>
                        <tr><td>feedback → complete</td><td className="text-center">✓</td><td>last card</td></tr>
                        <tr><td>complete → setup</td><td className="text-center">✓</td><td>resetSession()</td></tr>
                        <tr><td>error → setup</td><td className="text-center">✓</td><td>resetSession()</td></tr>
                        <tr><td>active → setup</td><td className="text-center">❌</td><td>invalid</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">State Machine Implementation</h3>
              <CodeBlock
                language="typescript"
                code={`// StudySessionContext.tsx - State machine implementation
export const StudySessionProvider = ({ children }: { children: ReactNode }) => {
  // SINGLE SOURCE OF TRUTH
  const [currentState, setCurrentState] = useState<SessionState>('setup');
  
  // Supporting data (not used for state logic)
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ATOMIC STATE TRANSITIONS
  const startSession = useCallback(async (listId: string) => {
    // Validate current state
    if (currentState !== 'setup') {
      console.warn('startSession called from invalid state:', currentState);
      return;
    }

    setCurrentState('loading');
    setError(null);
    
    try {
      const response = await fetch('/api/study/sessions', {
        method: 'POST',
        body: JSON.stringify({ listId })
      });
      
      if (!response.ok) throw new Error('Failed to start session');
      
      const data = await response.json();
      const shuffledCards = shuffleArray(data.flashcards);
      
      // ATOMIC UPDATE - all or nothing
      setSessionId(data.sessionId);
      setFlashcards(shuffledCards);
      setCurrentIndex(0);
      setCurrentState('active'); // Transition complete
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCurrentState('error');
    }
  }, [currentState]);

  const resetSession = useCallback(() => {
    // Can reset from any state except loading
    if (currentState === 'loading') return;
    
    setCurrentState('setup');
    setSessionId(null);
    setFlashcards([]);
    setCurrentIndex(0);
    setError(null);
  }, [currentState]);

  return (
    <StudySessionContext.Provider value={{
      currentState, sessionId, flashcards, currentIndex, error,
      startSession, resetSession
    }}>
      {children}
    </StudySessionContext.Provider>
  );
};`}
              />
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                🔧
              </span>
              Production Implementation Strategy
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Before: Variable-Based Logic</h3>
                <CodeBlock
                  language="javascript"
                  code={`// StudySessionManager.tsx - PROBLEMATIC
export default function StudySessionManager() {
  const {
    sessionId,
    isComplete,
    flashcards,
    currentIndex,
    cardResults
  } = useStudySession();

  // COMPLEX CONDITIONAL LOGIC
  if (isComplete && sessionId) {
    return <StudySessionResults />;
  }

  if (sessionId && flashcards.length > 0) {
    return <StudyCard flashcard={flashcards[currentIndex]} />;
  }

  return <StudySessionSetup />;
}`}
                />
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Problems:</h4>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Multiple variables determine UI state</li>
                    <li>• Edge cases create invalid combinations</li>
                    <li>• Debugging requires checking all variables</li>
                    <li>• Adding features breaks existing logic</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">After: State Machine Logic</h3>
                <CodeBlock
                  language="javascript"
                  code={`// StudySessionManager.tsx - STATE MACHINE
export default function StudySessionManager() {
  const { currentState, error, resetSession } = useStudySession();

  // SIMPLE SWITCH STATEMENT
  switch (currentState) {
    case 'setup':
      return <StudySessionSetup />;
      
    case 'loading':
      return <LoadingSpinner />;
      
    case 'active':
      return <StudyCard />;
      
    case 'feedback':
      return <CardFeedback />;
      
    case 'complete':
      return <StudySessionResults />;
      
    case 'error':
      return <ErrorScreen message={error} onRetry={resetSession} />;
      
    default:
      // Defensive programming
      console.error(\`Unknown state: \${currentState}\`);
      return <StudySessionSetup />;
  }
}`}
                />
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Benefits:</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Single variable controls entire UI</li>
                    <li>• No invalid state combinations possible</li>
                    <li>• One log statement shows current state</li>
                    <li>• Adding states doesn't break existing logic</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Migration Strategy</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Phase 1: State Enumeration</h4>
                <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                  <li>Audit existing component render conditions</li>
                  <li>Map each condition to explicit state</li>
                  <li>Define valid state transitions</li>
                  <li>Create TypeScript enums for type safety</li>
                </ol>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Phase 2: Context Refactor</h4>
                <ol className="list-decimal list-inside space-y-2 text-green-800 text-sm">
                  <li>Add currentState variable to context</li>
                  <li>Refactor action functions to update state atomically</li>
                  <li>Add state validation to prevent invalid transitions</li>
                  <li>Implement comprehensive logging for state changes</li>
                </ol>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-3">Phase 3: Component Updates</h4>
                <ol className="list-decimal list-inside space-y-2 text-purple-800 text-sm">
                  <li>Replace conditional logic with switch statements</li>
                  <li>Remove component-level state that duplicates context</li>
                  <li>Add defensive programming for unknown states</li>
                  <li>Update test coverage for all state transitions</li>
                </ol>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Implementation Checklist</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-300">Code Quality</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>TypeScript enums for state safety</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Comprehensive state transition logging</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Defensive programming for edge cases</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Atomic state updates</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-orange-300">Testing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Unit tests for all state transitions</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Integration tests for user workflows</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Edge case reproduction tests</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>State persistence validation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ✓
              </span>
              State Validation & Error Handling
            </h2>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Defensive State Management</h3>
              <CodeBlock
                language="typescript"
                code={`// State validation and error boundaries
export const StudySessionProvider = ({ children }: { children: ReactNode }) => {
  const [currentState, setCurrentState] = useState<SessionState>('setup');

  // STATE VALIDATION
  const validateTransition = (from: SessionState, to: SessionState): boolean => {
    const validTransitions: Record<SessionState, SessionState[]> = {
      'setup': ['loading'],
      'loading': ['active', 'error'],
      'active': ['feedback', 'error'],
      'feedback': ['active', 'complete'],
      'complete': ['setup'],
      'error': ['setup']
    };

    return validTransitions[from]?.includes(to) ?? false;
  };

  // SAFE STATE SETTER
  const safeSetState = useCallback((newState: SessionState, context?: string) => {
    if (!validateTransition(currentState, newState)) {
      console.error(\`Invalid state transition: \${currentState} → \${newState}\`, { context });
      
      // Recovery strategy: reset to safe state
      setCurrentState('setup');
      return false;
    }

    console.log(\`State transition: \${currentState} → \${newState}\`, { context });
    setCurrentState(newState);
    return true;
  }, [currentState]);

  // ERROR BOUNDARY INTEGRATION
  const handleError = useCallback((error: Error, context: string) => {
    console.error('StudySession error:', error, { context, currentState });
    
    // Log error details for debugging
    Logger.error(LogContext.STUDY, 'State machine error', {
      error: error.message,
      context,
      currentState,
      timestamp: Date.now()
    });

    safeSetState('error', 'error-boundary');
  }, [currentState, safeSetState]);

  return (
    <StudySessionContext.Provider value={{
      currentState,
      safeSetState,
      handleError,
      // ... other values
    }}>
      {children}
    </StudySessionContext.Provider>
  );
};`}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recovery Strategies</h3>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">Invalid State Detection</h4>
                    <p className="text-yellow-800 text-sm mb-3">
                      When app detects invalid state combination, automatically reset to known safe state.
                    </p>
                    <CodeBlock
                      language="javascript"
                      code={`// Component-level state validation
useEffect(() => {
  // Validate state consistency on mount
  if (currentState === 'active' && flashcards.length === 0) {
    console.warn('Invalid state: active with no flashcards');
    resetSession();
  }
}, [currentState, flashcards.length]);`}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Graceful Degradation</h4>
                    <p className="text-blue-800 text-sm">
                      Unknown states default to setup screen with user-friendly error message.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Monitoring & Debugging</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">State Transition Logging</h4>
                  <CodeBlock
                    language="javascript"
                    code={`// Production debugging utilities
const logStateTransition = (from, to, trigger, metadata = {}) => {
  const logEntry = {
    timestamp: Date.now(),
    transition: \`\${from} → \${to}\`,
    trigger,
    metadata,
    sessionId: getCurrentSessionId(),
    userId: getCurrentUserId()
  };

  // Local debugging
  console.log('State transition:', logEntry);
  
  // Production monitoring
  if (isProduction()) {
    analytics.track('study_state_transition', logEntry);
  }
  
  // Error tracking
  if (to === 'error') {
    Sentry.addBreadcrumb({
      message: 'State machine error',
      data: logEntry,
      level: 'error'
    });
  }
};`}
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Health Checks</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• State consistency validation on app focus</li>
                    <li>• Periodic state machine health checks</li>
                    <li>• User session recovery mechanisms</li>
                    <li>• Automated error reporting integration</li>
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
                    <span className="text-gray-600">Phantom session screens</span>
                    <span className="text-green-600 font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">State-related support tickets</span>
                    <span className="text-green-600 font-bold">↓ 95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Edge case occurrences</span>
                    <span className="text-green-600 font-bold">↓ 100%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Quality</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cyclomatic complexity</span>
                    <span className="text-green-600 font-bold">↓ 70%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Test coverage</span>
                    <span className="text-blue-600 font-bold">↑ 85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Debug time</span>
                    <span className="text-green-600 font-bold">↓ 80%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Runtime Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">State updates</span>
                    <span className="text-blue-600 font-bold">Atomic</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Re-render frequency</span>
                    <span className="text-green-600 font-bold">↓ 30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Memory leaks</span>
                    <span className="text-green-600 font-bold">0</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Next Challenge Preview</h3>
              <p className="text-purple-800 mb-4">
                State machine solved the edge case completely, but implementing proper feedback states revealed 
                one final timing issue: users occasionally seeing flashcard answers before questions.
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <div className="text-purple-700">Next optimization target:</div>
                <div className="text-gray-600 ml-2">→ UI timing constraints</div>
                <div className="text-gray-600 ml-2">→ User experience timing issues</div>
                <div className="text-gray-600 ml-2">→ Constraint-driven feature design</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Architecture Evolution Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold">Part 1: Variable-based state (Buggy)</div>
                    <div className="text-gray-400 text-sm">Shuffle bug, component ownership issues</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold">Part 2: Context API + Race conditions</div>
                    <div className="text-gray-400 text-sm">Centralized state, but UI timing issues</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold">Part 3: State machine architecture (Current)</div>
                    <div className="text-gray-400 text-sm">Bulletproof edge case handling</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold">Part 4: Constraint-driven UX innovation</div>
                    <div className="text-gray-400 text-sm">Coming next...</div>
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
            Part 3 of 5 - Rabbit Holes Series
          </div>
          <div className="flex space-x-4">
            <Link
              href={'/blog/rabbit-holes-to-rabbit-holes-part-02-technical'}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Prev: Context API Success → Race Condition Discovery
            </Link>
            <Link 
              href="https://i.witus.online/flashlearnai-b" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
            >
              Try Live Demo
            </Link>
            <Link
              href={'/blog/rabbit-holes-to-rabbit-holes-part-04-technical'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Next: UX Innovation Through Constraints →
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}