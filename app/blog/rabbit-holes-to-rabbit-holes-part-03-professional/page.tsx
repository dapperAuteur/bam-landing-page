// components/blog/RabbitHolePart3.tsx
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { SeriesProgress } from '@/components/blog/SeriesNavigation';
import Link from 'next/link';

export default function RabbitHolePart3() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-6">
        {/* <SeriesTableOfContents currentPart={1}  className="sticky top-4" /> */}
        {/* <PartNavigation currentPart={1} className="mt-12" />
        <SeriesBreadcrumb currentPart={1} className="mb-8" /> */}
        {/* <FloatingSeriesNav currentPart={1} /> */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
            From Rabbit Holes to Rabbit Holes: Part 3
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            The Session That Wouldn't Die
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          How edge cases taught me to think like a state machine
        </p>
        <SeriesProgress currentPart={3} className="mt-4" />
      </header>

      {/* App Demo Section */}
      <section className="bg-blue-50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            See the Final Result
          </h2>
          <p className="text-gray-600 mb-4">
            Experience the fully debugged flashcard app with bulletproof state management
          </p>
          <a 
            href="https://i.witus.online/flashlearnai-b" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try FlashLearn AI →
          </a>
        </div>
        <VideoPlaceholder 
          title="State Machine Architecture in Action"
          description="Watch how bulletproof state transitions prevent edge cases"
        />
      </section>

      {/* Audio Discussion */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <AudioPlayer 
          title="State Machine Architecture Deep Dive"
          description="Technical discussion on building bulletproof application state with explicit state machines"
          duration="18:15"
        />
      </section>

      {/* The Bug That Made No Sense */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Bug That Made No Sense</h2>
        <div className="prose prose-lg prose-gray max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            After fixing the race condition in <a href="/blog/rabbit-holes-part-2" className="text-blue-600 hover:text-blue-800">Part 2</a>, 
            I thought I was done with state management issues. The Context API was solid, component lifecycle was controlled, 
            and users could study without seeing answers before questions.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <p className="text-lg font-semibold text-red-900">
              Then users started reporting something bizarre: they'd navigate to the study page and immediately 
              see a "Session Complete!" screen, even though they hadn't started studying anything.
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            This wasn't intermittent like the race condition. It was consistent and reproducible, but only for 
            certain users under specific conditions. The bug made no logical sense until I realized what was happening.
          </p>
        </div>
      </section>

      {/* Detective Work */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">State Logic Forensics</h2>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">The Pattern</h3>
          <p className="text-gray-700 mb-4">
            I started logging everything. User actions, component renders, state changes, API calls. 
            The pattern that emerged was revealing:
          </p>
          
          <div className="bg-yellow-50 rounded-lg p-6">
            <h4 className="font-semibold text-yellow-900 mb-3">Users who saw the phantom "Session Complete" screen had:</h4>
            <ul className="space-y-2 text-yellow-800">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 mt-1">1.</span>
                <span>Previously completed a study session successfully</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 mt-1">2.</span>
                <span>Navigated away from the app</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 mt-1">3.</span>
                <span>Returned later to study again</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2 mt-1">4.</span>
                <span>Never cleared their browser data</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">The Problematic Logic</h3>
            <CodeBlock
              language="javascript"
              code={`// StudySessionManager.tsx - The bug
export default function StudySessionManager() {
  const {
    sessionId,
    isComplete,
    flashcards,
    currentIndex,
    cardResults
  } = useStudySession();

  // FLAWED: Ambiguous conditional logic
  if (isComplete && sessionId) {
    return <StudySessionResults />;
  }

  if (sessionId && flashcards.length > 0) {
    return <StudyCard flashcard={flashcards[currentIndex]} />;
  }

  return <StudySessionSetup />;
}`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">The Root Cause</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-900 font-semibold mb-3">Undefined State Boundaries</p>
              <p className="text-red-800 mb-4">
                I was thinking about app state as a collection of variables instead of as a 
                <strong> state machine</strong> with clearly defined states and transitions.
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <div className="text-red-600">Problem: If user completed a session, then returned later...</div>
                <div className="text-gray-600">  └─ isComplete: true (from previous session)</div>
                <div className="text-gray-600">  └─ sessionId: exists (from IndexedDB persistence)</div>
                <div className="text-gray-600">  └─ Result: "Session Complete" condition triggered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* State Machine Solution */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The State Machine Solution</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <p className="text-blue-900 font-semibold mb-2">Key Insight:</p>
          <p className="text-blue-800">
            My app could actually be in several distinct states: Setup, Active, Feedback, Complete, Error. 
            But my conditional logic was trying to infer the current state from multiple variables, 
            leading to ambiguous situations.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Explicit State Management</h3>
          <CodeBlock
            language="typescript"
            code={`// StudySessionContext.tsx - State machine approach
type SessionState = 'setup' | 'active' | 'feedback' | 'complete' | 'error';

export const StudySessionProvider = ({ children }) => {
  // Single source of truth for what state we're in
  const [currentState, setCurrentState] = useState<SessionState>('setup');
  
  // Supporting data for each state
  const [sessionId, setSessionId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastCardResult, setLastCardResult] = useState(null);
  const [error, setError] = useState(null);

  const startSession = useCallback(async (listId) => {
    setCurrentState('loading'); // Explicit state transition
    try {
      const response = await fetch('/api/study/sessions', {
        method: 'POST',
        body: JSON.stringify({ listId })
      });
      
      const data = await response.json();
      const shuffledCards = shuffleArray(data.flashcards);
      
      // Atomic state transition - all related state updates together
      setSessionId(data.sessionId);
      setFlashcards(shuffledCards);
      setCurrentIndex(0);
      setLastCardResult(null);
      setError(null);
      setCurrentState('active'); // Clear state transition
      
    } catch (err) {
      setError(err.message);
      setCurrentState('error'); // Clear error state
    }
  }, []);

  const resetSession = useCallback(() => {
    // Complete state reset - no ambiguity
    setCurrentState('setup');
    setSessionId(null);
    setFlashcards([]);
    setCurrentIndex(0);
    setLastCardResult(null);
    setError(null);
  }, []);
};`}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Crystal Clear Component Logic</h3>
          <CodeBlock
            language="javascript"
            code={`// StudySessionManager.tsx - Clean state-based rendering
export default function StudySessionManager() {
  const { currentState, error, resetSession } = useStudySession();

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
      return (
        <ErrorScreen 
          message={error} 
          onRetry={resetSession} 
        />
      );
      
    default:
      // Defensive programming
      console.error(\`Unknown state: \${currentState}\`);
      return <StudySessionSetup />;
  }
}`}
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Bulletproof Benefits</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-900">No More Ambiguous States</h3>
              <p className="mt-2 text-blue-800 text-sm">
                Every possible condition has an explicit state. No more guessing what combination 
                of variables means what.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-green-900">Predictable State Transitions</h3>
              <div className="mt-2 text-green-800 text-sm font-mono">
                <div>'setup' → (startSession) → 'loading' → 'active'</div>
                <div>'active' → (completeSession) → 'complete'</div>
                <div>'complete' → (resetSession) → 'setup'</div>
                <div>'error' → (resetSession) → 'setup'</div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-purple-900">Easier Debugging</h3>
              <p className="mt-2 text-purple-800 text-sm">
                Instead of logging multiple variables, log one state value. When users report bugs, 
                you know exactly which state they're in.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-orange-900">Better Error Boundaries</h3>
              <p className="mt-2 text-orange-800 text-sm">
                Each state can handle its own error conditions without affecting other states.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-red-900">Feature Addition Safety</h3>
              <p className="mt-2 text-red-800 text-sm">
                New features can add new states or transitions without breaking existing logic.
              </p>
            </div>

            <div className="border-l-4 border-gray-500 pl-4">
              <h3 className="font-semibold text-gray-900">Single Source of Truth</h3>
              <p className="mt-2 text-gray-800 text-sm">
                One variable controls behavior, others provide supporting data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Next Challenge */}
      <section className="bg-green-50 border border-green-200 rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-green-900">The Fix Revealed Another Problem</h2>
        <p className="text-green-800 text-lg">
          The state machine approach worked perfectly. Users could no longer get stuck in phantom 
          completion screens. The app's behavior became predictable and easy to reason about.
        </p>
        
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">But implementing proper feedback states revealed yet another timing issue:</h3>
          <p className="text-gray-700">
            When users clicked "Got it Right" or "Got it Wrong," there was still a brief moment where 
            they might see the answer to the next card before seeing the question. This wasn't a state 
            management bug—it was a UX problem that would lead to the most elegant solution in my entire debugging journey.
          </p>
        </div>
      </section>

      {/* Lessons Learned */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">What This Taught Me</h2>
        
        <div className="bg-purple-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-purple-900 mb-6">State Machine Thinking</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-800">Before: Variable-Based</h4>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>• Multiple boolean flags</li>
                <li>• Complex conditional logic</li>
                <li>• Ambiguous state combinations</li>
                <li>• Debugging requires checking multiple variables</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-purple-800">After: State-Based</h4>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>• Single state variable</li>
                <li>• Simple switch statements</li>
                <li>• Explicit state definitions</li>
                <li>• One variable tells the whole story</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Principles Learned</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span><strong>States aren't variables</strong> - they're discrete conditions with clear boundaries</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span><strong>Transitions matter</strong> - how you move between states is as important as the states themselves</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span><strong>Defensive programming</strong> - handle impossible states gracefully</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span><strong>Single source of truth</strong> - one variable controls behavior, others provide supporting data</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next in Series */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900">Coming Next</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          In Part 4, I'll show you how this final timing issue led to the most user-friendly solution of all: 
          turning a technical constraint into a delightful feedback experience.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href={'/blog/rabbit-holes-to-rabbit-holes-part-02-professional'}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Read Part 2
          </Link>
          {/* <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Subscribe for Updates
          </button> */}
          <Link
            href={'/blog/rabbit-holes-to-rabbit-holes-part-04-professional'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Read Part 4
          </Link>
        </div>
        
        <div className="pt-8">
          <p className="text-gray-500 text-sm">
            Want to experience the final result? 
            <a 
              href="https://i.witus.online/flashlearnai-b" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium ml-1"
            >
              Try FlashLearn AI
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}