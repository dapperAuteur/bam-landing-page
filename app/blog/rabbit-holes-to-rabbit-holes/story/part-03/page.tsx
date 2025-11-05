// components/blog/RabbitHolePart3Story.tsx
'use client';

import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import Link from 'next/link';
import { SeriesProgress } from '@/components/blog/SeriesNavigation';

const StorySection = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <section className={`relative ${className}`}>
    {children}
  </section>
);

const TimelineEvent = ({ 
  title, 
  children, 
  isActive = false,
  emotion = "neutral"
}: { 
  title: string; 
  children: React.ReactNode; 
  isActive?: boolean;
  emotion?: "triumph" | "discovery" | "challenge" | "insight" | "neutral";
}) => {
  const emotionColors = {
    triumph: "bg-green-600 text-white shadow-lg shadow-green-200",
    discovery: "bg-orange-500 text-white shadow-lg shadow-orange-200", 
    challenge: "bg-red-500 text-white shadow-lg shadow-red-200",
    insight: "bg-purple-600 text-white shadow-lg shadow-purple-200",
    neutral: "bg-gray-200 text-gray-600"
  };

  return (
    <div className="flex items-start space-x-6 mb-12">
      <div className="flex-shrink-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isActive ? emotionColors[emotion] : "bg-gray-200 text-gray-600"
        }`}>
          <div className="w-3 h-3 rounded-full bg-current"></div>
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default function RabbitHolePart3Story() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <header className="text-center mb-20">
        {/* <SeriesTableOfContents currentPart={5}  className="sticky top-4" /> */}
        {/* <PartNavigation currentPart={5} className="mt-12" />
        <SeriesBreadcrumb currentPart={5} className="mb-8" /> */}
        {/* <FloatingSeriesNav currentPart={5} /> */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-red-600/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-4">
              From Rabbit Holes to Rabbit Holes: Part 3
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Session
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                That Wouldn't Die
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              How edge cases taught me to think like a state machine architect instead of 
              a variable collector
            </p>
          </div>
        </div>
        <SeriesProgress currentPart={3} className="mt-4" />
      </header>

      {/* The False Victory */}
      <StorySection className="mb-20">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Victory... or Was It?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Part 2's race condition fix felt like the final boss battle. Context API: ✓ 
                Component lifecycle: ✓ No more answer-before-question bugs: ✓
              </p>
              <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
                <p className="text-lg font-semibold text-gray-900">
                  "Time to ship this thing and move on to the next feature."
                </p>
                <p className="text-gray-700 mt-2">
                  That confidence lasted exactly 48 hours.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-green-100 rounded-lg p-6 font-mono text-green-800 text-sm">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-semibold">DEPLOYMENT SUCCESS</span>
                </div>
                <div>✓ Race conditions eliminated</div>
                <div>✓ Context API stable</div>
                <div>✓ User experience smooth</div>
                <div className="mt-4 text-green-600">Status: MISSION COMPLETE</div>
                <div className="mt-2 text-red-600">...or so I thought</div>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* The Phantom Bug */}
      <StorySection className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The Phantom Session Bug
          </h2>
          <p className="text-lg text-gray-600">
            When users reported seeing "Session Complete!" before starting anything...
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-red-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-4">The Ghost in the Machine</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
              <p className="text-red-800 italic">
                "I clicked study and immediately saw 'Session Complete' - I haven't studied anything yet!"
              </p>
              <div className="text-xs text-red-600 mt-2">- User who completed previous session</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
              <p className="text-red-800 italic">
                "The app thinks I finished studying when I just opened it."
              </p>
              <div className="text-xs text-red-600 mt-2">- Returning user with browser data</div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-red-900 font-semibold text-lg">
              The race condition was gone. This was something else entirely.
            </p>
          </div>
        </div>
      </StorySection>

      {/* Debug Timeline */}
      <StorySection className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          The Detective Work
        </h2>

        <TimelineEvent 
          title="Pattern Recognition" 
          isActive={true} 
          emotion="discovery"
        >
          <p className="text-lg text-gray-700 mb-4">
            Only certain users saw the phantom completion. The pattern: they'd previously 
            completed a session, navigated away, then returned later.
          </p>
          <div className="bg-orange-100 rounded-lg p-4">
            <p className="text-orange-800 font-mono text-sm">
              Bug reproduction steps:<br/>
              1. Complete flashcard session ✓<br/>
              2. Navigate away from app ✓<br/>
              3. Return later to study again ✓<br/>
              4. See "Session Complete!" immediately ✗
            </p>
          </div>
        </TimelineEvent>

        <TimelineEvent 
          title="The Broken Logic" 
          isActive={true} 
          emotion="challenge"
        >
          <p className="text-lg text-gray-700 mb-4">
            My conditional rendering logic was trying to infer app state from multiple variables. 
            Sometimes those variables told contradictory stories.
          </p>
          <CodeBlock
            language="javascript"
            code={`// StudySessionManager.tsx - The flawed approach
export default function StudySessionManager() {
  const {
    sessionId,
    isComplete,
    flashcards,
    currentIndex,
    cardResults
  } = useStudySession();

  // This was the bug - ambiguous state logic
  if (isComplete && sessionId) {
    return <StudySessionResults />;
  }

  if (sessionId && flashcards.length > 0) {
    return <StudyCard flashcard={flashcards[currentIndex]} />;
  }

  return <StudySessionSetup />;
}`}
          />
        </TimelineEvent>

        <TimelineEvent 
          title="State Persistence Gotcha" 
          isActive={true} 
          emotion="insight"
        >
          <p className="text-lg text-gray-700 mb-4">
            The bug: persisted state from previous sessions created impossible combinations. 
            <code className="bg-gray-100 px-2 py-1 rounded">isComplete: true</code> + 
            <code className="bg-gray-100 px-2 py-1 rounded">sessionId: "previous-session"</code> = 
            instant completion screen.
          </p>
          <div className="bg-red-100 rounded-lg p-4">
            <p className="text-red-800 font-semibold">
              I was thinking in variables, not states. Time to think like a state machine.
            </p>
          </div>
        </TimelineEvent>
      </StorySection>

      {/* State Machine Solution */}
      <StorySection className="mb-16">
        <div className="bg-purple-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6">The State Machine Revelation</h2>
          <p className="text-lg text-purple-100 mb-8">
            Instead of juggling variables, I defined explicit states with clear transitions. 
            No more ambiguous combinations.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-purple-200 mb-4">App States</h3>
              <div className="space-y-3">
                <div className="bg-purple-800 rounded-lg p-3">
                  <span className="font-mono text-purple-200">setup</span>
                  <p className="text-purple-300 text-sm">No active session, user selecting what to study</p>
                </div>
                <div className="bg-purple-800 rounded-lg p-3">
                  <span className="font-mono text-purple-200">active</span>
                  <p className="text-purple-300 text-sm">Session running, user answering cards</p>
                </div>
                <div className="bg-purple-800 rounded-lg p-3">
                  <span className="font-mono text-purple-200">feedback</span>
                  <p className="text-purple-300 text-sm">Showing result of current card</p>
                </div>
                <div className="bg-purple-800 rounded-lg p-3">
                  <span className="font-mono text-purple-200">complete</span>
                  <p className="text-purple-300 text-sm">Session finished, showing results</p>
                </div>
                <div className="bg-purple-800 rounded-lg p-3">
                  <span className="font-mono text-purple-200">error</span>
                  <p className="text-purple-300 text-sm">Something went wrong</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-200 mb-4">Clear Transitions</h3>
              <div className="font-mono text-sm text-purple-300 space-y-2">
                <div>setup → (startSession) → active</div>
                <div>active → (completeSession) → complete</div>
                <div>complete → (resetSession) → setup</div>
                <div>error → (resetSession) → setup</div>
                <div>* → (error) → error</div>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* Implementation Deep Dive */}
      <StorySection className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Implementation</h2>
        
        <CodeBlock
          language="javascript"
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
    setCurrentState('loading');
    try {
      const response = await fetch('/api/study/sessions', {
        method: 'POST',
        body: JSON.stringify({ listId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to start session');
      }
      
      const data = await response.json();
      const shuffledCards = shuffleArray(data.flashcards);
      
      // Atomic state transition - all related updates together
      setSessionId(data.sessionId);
      setFlashcards(shuffledCards);
      setCurrentIndex(0);
      setLastCardResult(null);
      setError(null);
      setCurrentState('active'); // Clear state transition
      
    } catch (err) {
      setError(err.message);
      setCurrentState('error');
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

        <div className="mt-8">
          <CodeBlock
            language="javascript"
            code={`// StudySessionManager.tsx - Crystal clear rendering logic
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
      // This should never happen, but defensive programming
      console.error(\`Unknown state: \${currentState}\`);
      return <StudySessionSetup />;
  }
}`}
          />
        </div>
      </StorySection>

      {/* Audio Deep Dive */}
      <StorySection className="mb-16">
        <div className="bg-gray-900 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              State Machine Architecture Deep Dive
            </h2>
            <p className="text-gray-300">
              Technical discussion on explicit state management and bulletproof edge case handling
            </p>
          </div>
          <AudioPlayer 
            title="From Variables to State Machines"
            description="How state machine thinking eliminates entire categories of bugs"
            duration="18:15"
            darkMode={true}
          />
        </div>
      </StorySection>

      {/* App Demo */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Experience the Bulletproof Result
            </h2>
            <p className="text-gray-600 mb-4">
              Try the app with state machine architecture - no more phantom sessions
            </p>
            <a 
              href="https://i.witus.online/flashlearnai-b" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Try FlashLearn AI →
            </a>
          </div>
          <VideoPlaceholder 
            title="State Machine Architecture in Action"
            description="Watch how explicit states prevent impossible edge cases"
          />
        </div>
      </StorySection>

      {/* The Victory and Discovery */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Victory... and Another Discovery
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">The Wins</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800">No more phantom sessions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800">Predictable app behavior</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800">Single source of truth</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800">Easier debugging</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-orange-900 mb-4">But Then...</h3>
              <p className="text-orange-800 text-lg">
                Perfect state transitions revealed another timing issue: users could still 
                glimpse the next card's answer during feedback transitions.
              </p>
              <div className="bg-orange-100 rounded-lg p-4 mt-4">
                <p className="text-orange-900 font-semibold">
                  Architecture problems solved. UX problems exposed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* Lessons Learned */}
      <StorySection className="mb-16">
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What This Rabbit Hole Taught Me</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Architectural Thinking</h3>
              <div className="space-y-3 text-gray-700">
                <p>States aren't variables - they're discrete conditions with clear boundaries</p>
                <p>Transitions matter as much as the states themselves</p>
                <p>Single source of truth eliminates impossible combinations</p>
                <p>Defensive programming handles the "impossible" gracefully</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The Bigger Picture</h3>
              <div className="space-y-3 text-gray-700">
                <p>Good architecture makes UX problems more visible</p>
                <p>Each fix reveals the next layer of problems</p>
                <p>Edge cases teach you about your system's assumptions</p>
                <p>Sometimes the solution is changing how you think, not just how you code</p>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* Coming Next */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            The Final Transformation
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            In Part 4, I'll show you how this final timing issue led to the most elegant 
            solution of all: turning a technical constraint into a delightful user experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={'/blog/rabbit-holes-to-rabbit-holes/story/part-02'}
              className="bg-orange-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Read Part 2: Constraint-Driven Innovation
            </Link>
            {/* <button className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Subscribe to the Series
            </button> */}
            <Link
              href={'/blog/rabbit-holes-to-rabbit-holes/story/part-04'}
              className="bg-blue-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Read Part 4: Constraint-Driven Innovation
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-lg">
              How turning technical problems into user experience gold creates the most satisfying solutions.
            </p>
          </div>
        </div>
      </StorySection>
    </article>
  );
}