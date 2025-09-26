// components/blog/RabbitHolePart4.tsx
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

export default function RabbitHolePart4() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
            From Rabbit Holes to Rabbit Holes: Part 4
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Racing Conditions and User Experience Gold
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          How constraints breed creativity and turn bugs into features
        </p>
      </header>

      {/* App Demo Section */}
      <section className="bg-blue-50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Experience the Final Solution
          </h2>
          <p className="text-gray-600 mb-4">
            See how feedback screens turned a timing constraint into delightful UX
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
          title="Feedback Screen UX in Action"
          description="Watch how turning constraints into features creates delightful user experiences"
        />
      </section>

      {/* Audio Discussion */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Creative Problem Solving Deep Dive
          </h2>
          <p className="text-gray-600">
            Listen to my thoughts on embracing constraints as creative catalysts
          </p>
        </div>
        <AudioPlayer 
          title="From Constraints to Creativity"
          description="How the best solutions come from embracing technical limitations rather than fighting them"
          duration="15:42"
        />
      </section>

      {/* The Final Boss Bug */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Final Boss Bug</h2>
        <div className="prose prose-lg prose-gray max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            After implementing the state machine in <a href="/blog/rabbit-holes-part-3" className="text-blue-600 hover:text-blue-800">Part 3</a>, 
            my flashcard app was architecturally sound. No more phantom completion screens, predictable state transitions, 
            and bulletproof error handling.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
            <p className="text-lg font-semibold text-red-900">
              But there was still one final timing issue: users would briefly see the **answer** 
              to the next flashcard before seeing the **question**.
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            Even with parent-controlled state and explicit state machines, React's rendering cycle 
            still had a tiny window where the wrong content could flash. This was the final boss 
            of my debugging journey.
          </p>
        </div>
      </section>

      {/* Technical Problem */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Persistent Race Condition</h2>
        
        <p className="text-lg text-gray-700">
          The timing issue was subtle but persistent, even with state management improvements:
        </p>

        <CodeBlock
          language="javascript"
          code={`// The timing issue that remained
const handleCardResult = async (isCorrect, timeSeconds) => {
  await recordCardResult(isCorrect, timeSeconds); // Context updates currentIndex
  // New card props flow down to StudyCard
  // Brief moment where new card content renders with old isFlipped state
};`}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">The Microsecond Window</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li>New card content loads</li>
            <li><code className="bg-yellow-200 px-2 py-1 rounded">isFlipped</code> state resets</li>
            <li>User sees back of new card before it flips to front</li>
          </ol>
        </div>
      </section>

      {/* Three Options */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Three Possible Solutions</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Option 1: Artificial Delays</h3>
            <CodeBlock
              language="javascript"
              code={`const handleCardResult = async (isCorrect, timeSeconds) => {
  await recordCardResult(isCorrect, timeSeconds);
  await new Promise(resolve => 
    setTimeout(resolve, 100)
  ); // Artificial delay
};`}
            />
            <div className="mt-3 text-sm">
              <span className="text-red-600 font-semibold">Problem:</span> Feels sluggish and unresponsive
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Option 2: Complex Synchronization</h3>
            <CodeBlock
              language="javascript"
              code={`const handleCardResult = async (isCorrect, timeSeconds) => {
  setIsTransitioning(true);
  await recordCardResult(isCorrect, timeSeconds);
  setIsFlipped(false);
  setIsTransitioning(false);
};`}
            />
            <div className="mt-3 text-sm">
              <span className="text-red-600 font-semibold">Problem:</span> Adds complexity without eliminating root timing issue
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Option 3: Embrace the Constraint</h3>
            <p className="text-green-800 mb-3">
              What if instead of fighting the timing, I used it as an opportunity to provide user feedback?
            </p>
            <div className="text-sm">
              <span className="text-green-600 font-semibold">Solution:</span> Turn the gap into intentional, valuable feedback
            </div>
          </div>
        </div>
      </section>

      {/* The Elegant Solution */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Elegant Solution: Feedback Screens</h2>
        
        <p className="text-lg text-gray-700">
          Instead of trying to eliminate the gap between cards, I made the gap <strong>intentional and valuable</strong>:
        </p>

        <CodeBlock
          language="javascript"
          code={`// New state in StudySessionContext
type LastCardResult = 'correct' | 'incorrect' | null;

const [lastCardResult, setLastCardResult] = useState<LastCardResult>(null);

const recordCardResult = useCallback(async (isCorrect, timeSeconds) => {
  // Instead of immediately advancing, set feedback state
  setLastCardResult(isCorrect ? 'correct' : 'incorrect');
  
  // Save the result but don't advance the card yet
  const newResults = [...cardResults, result];
  setCardResults(newResults);
  await saveResult(result);
}, []);

const showNextCard = useCallback(() => {
  setLastCardResult(null); // Clear feedback
  const nextIndex = currentIndex + 1;
  if (nextIndex < flashcards.length) {
    setCurrentIndex(nextIndex); // NOW advance to next card
  } else {
    completeSession();
  }
}, [currentIndex, flashcards.length]);`}
        />

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">The Feedback Component</h3>
          <CodeBlock
            language="javascript"
            code={`// CardFeedback.tsx - Turning constraint into feature
export default function CardFeedback() {
  const { lastCardResult, showNextCard } = useStudySession();

  if (!lastCardResult) return null;

  const isCorrect = lastCardResult === 'correct';
  const messages = {
    correct: ["Awesome!", "You got it!", "Great job!", "Keep it up!"],
    incorrect: ["Keep trying!", "Almost there!", "You'll get it next time!", "Don't give up!"]
  };
  
  const message = messages[lastCardResult][Math.floor(Math.random() * messages[lastCardResult].length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={\`w-full h-80 rounded-lg flex flex-col items-center justify-center text-white p-6 shadow-lg \${
        isCorrect ? 'bg-green-500' : 'bg-red-500'
      }\`}
    >
      {isCorrect ? <CheckCircleIcon className="h-16 w-16 mb-4" /> : <XCircleIcon className="h-16 w-16 mb-4" />}
      <p className="text-3xl font-bold mb-6">{message}</p>
      <button
        onClick={showNextCard}
        className="px-8 py-3 bg-white text-lg font-semibold rounded-md text-gray-800 hover:bg-gray-200"
      >
        Next Card
      </button>
    </motion.div>
  );
}`}
          />
        </div>
      </section>

      {/* State Machine Integration */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Clean State Machine Integration</h2>
        
        <CodeBlock
          language="javascript"
          code={`// StudySessionManager.tsx - Clean state transitions
export default function StudySessionManager() {
  const { currentState, lastCardResult } = useStudySession();

  switch (currentState) {
    case 'setup':
      return <StudySessionSetup />;
      
    case 'active':
      // Show feedback if we have a result, otherwise show the card
      if (lastCardResult) {
        return <CardFeedback />;
      }
      return <StudyCard />;
      
    case 'complete':
      return <StudySessionResults />;
      
    // ... other states
  }
}`}
        />

        <div className="bg-green-50 border-l-4 border-green-500 p-6">
          <h3 className="text-lg font-semibold text-green-900">Race Condition Eliminated</h3>
          <ul className="list-disc list-inside mt-3 space-y-2 text-green-800">
            <li>User clicks "Got it Right" → Feedback screen appears immediately</li>
            <li>No card transition happens during user feedback</li>
            <li>User clicks "Next Card" → Fresh card loads with guaranteed correct state</li>
            <li><strong>No timing windows where wrong content can appear</strong></li>
          </ul>
        </div>
      </section>

      {/* The Unexpected Benefits */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Unexpected UX Benefits</h2>
        
        <p className="text-lg text-gray-700 mb-6">
          The feedback screens didn't just solve the race condition—they transformed the user experience:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Science Benefits</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Immediate Positive Reinforcement:</strong> Instant gratification for correct answers improves retention</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Mental Break Between Cards:</strong> Brief pause lets users process what they learned</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Clear Visual Feedback:</strong> Green/red reinforces learning outcomes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">UX & Accessibility</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Gamification Elements:</strong> Randomized encouragement messages add personality</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Accessibility Improvement:</strong> Screen readers have distinct content to announce</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>User Control:</strong> Explicit "Next Card" button puts users in control of pacing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Design Principle */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Design Principle I Learned</h2>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <blockquote className="text-2xl font-bold text-gray-900 text-center mb-6">
            "Constraints aren't always obstacles to overcome—sometimes they're opportunities to create something better."
          </blockquote>
          
          <p className="text-lg text-gray-700 text-center">
            Instead of fighting React's rendering timing, I used it as a forcing function to add value. 
            The "bug" became a feature that improved the user experience beyond what I would have built intentionally.
          </p>
          
          <div className="mt-6 text-center">
            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
              Seeing constraints as creative catalysts
            </span>
          </div>
        </div>
      </section>

      {/* Transformation Complete */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Superhero Transformation Complete</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-red-900 mb-4">Six Months Ago</h3>
            <ul className="space-y-2 text-red-800">
              <li>• Falling down random social media rabbit holes</li>
              <li>• Getting dopamine from consuming other people's content</li>
              <li>• Time disappearing with nothing to show for it</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-900 mb-4">Now</h3>
            <ul className="space-y-2 text-green-800">
              <li>• Falling down productive rabbit holes starting with features</li>
              <li>• Getting satisfaction from solving architectural problems</li>
              <li>• Time invested compounds into better skills and products</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
          <p className="text-lg font-semibold text-blue-900">
            The shuffle feature that started this journey was supposed to take an hour. 
            It turned into weeks of deep architectural work that taught me:
          </p>
          <ul className="mt-4 space-y-1 text-blue-800">
            <li>• Clean code principles and utility functions</li>
            <li>• React state management and component lifecycle</li>
            <li>• Debugging methodology and systematic thinking</li>
            <li>• State machine architecture patterns</li>
            <li>• Creative constraint-embracing problem solving</li>
          </ul>
        </div>
      </section>

      {/* Series Conclusion */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">What's Next?</h2>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-lg text-gray-700 mb-4">
            This was supposed to be the end of the series. Race condition solved, user experience improved, lessons learned.
          </p>
          <p className="text-lg text-gray-700">
            But building software for real users means building for the real world. And the real world has 
            authentication, business requirements, and monetization needs.
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-amber-900 mb-3">Coming in Part 5</h3>
          <p className="text-amber-800">
            How I built the "Study Direction" feature—allowing users to study cards in reverse—and 
            architected it for different user tiers without breaking existing functionality.
          </p>
        </div>
      </section>

      {/* Code Quality Review */}
      <section className="bg-gray-900 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Code Quality & UX Review</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3">Creative Problem Solving</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ Turned technical constraint into UX feature</li>
              <li>✅ Eliminated race condition through design, not complexity</li>
              <li>✅ Added value instead of just fixing bugs</li>
              <li>✅ Followed learning science principles</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Architecture Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ State machine handles feedback elegantly</li>
              <li>✅ Clean separation of concerns</li>
              <li>✅ No artificial delays or complex sync</li>
              <li>✅ Accessible and inclusive design</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">UX Improvements</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ Immediate positive reinforcement</li>
              <li>✅ Clear visual feedback (green/red)</li>
              <li>✅ Gamification elements</li>
              <li>✅ User-controlled pacing</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-400 italic">
            Next: Building features with authentication boundaries and monetization architecture
          </p>
        </div>
      </section>
    </article>
  );
}