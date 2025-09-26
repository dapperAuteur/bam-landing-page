// components/blog/RabbitHolePart2.tsx
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

export default function RabbitHolePart2() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
            From Rabbit Holes to Rabbit Holes: Part 2
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            When Fixing One Bug Reveals Another
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          How architectural victories reveal deeper problems
        </p>
      </header>

      {/* Audio Discussion */}
      <section className="bg-blue-50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Audio Deep Dive
          </h2>
          <p className="text-gray-600">
            Listen to my detailed walkthrough of debugging React race conditions
          </p>
        </div>
        <AudioPlayer 
          title="Race Condition Deep Dive"
          description="Technical discussion on React component lifecycle and state management timing issues"
          duration="12:34"
        />
      </section>

      {/* The Victory That Wasn't */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Victory That Wasn't</h2>
        <div className="prose prose-lg prose-gray max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            In <a href="/blog/rabbit-holes-part-1" className="text-blue-600 hover:text-blue-800">Part 1</a>, 
            I dove into my first productive rabbit hole: fixing a shuffle feature that exposed a critical flaw 
            in my app's architecture. The Context API refactor was a complete success.
          </p>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
            <p className="text-lg font-semibold text-green-900">
              Users could finally study randomized flashcards without mysterious "refreshes."
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            I felt like a superhero who'd just saved the day. The architecture was cleaner, 
            the code was more maintainable, and I'd learned valuable lessons about React state management.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Then the user reports started coming in.</strong>
          </p>
        </div>
      </section>

      {/* The New Bug */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Subtle Enemy</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">User Reports</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <ul className="space-y-3 text-orange-900">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2 mt-1">•</span>
                  <span>"Sometimes I see the answer before I can read the question"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2 mt-1">•</span>
                  <span>"The flashcard flips to the back automatically"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2 mt-1">•</span>
                  <span>"I'm seeing answers flash before the front loads"</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">The Impact</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-900 font-semibold mb-3">
                For a learning app, this is catastrophic.
              </p>
              <p className="text-red-800">
                It's like a teacher accidentally showing you the answer sheet before the test. 
                The Context API refactor had eliminated the data fetching issue, but exposed 
                a timing problem I never knew existed.
              </p>
            </div>
          </div>
        </div>

        <VideoPlaceholder 
          title="Race Condition in Action"
          description="Slow-motion capture showing the answer flashing before the question"
        />
      </section>

      {/* The Bug Hunt */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Component Lifecycle Detective Work</h2>
        
        <div className="bg-gray-50 rounded-xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">The Race Condition Flow</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>User clicks "Got it Right" on Card A</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>Parent component advances <code className="bg-gray-200 px-2 py-1 rounded">currentIndex</code></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>New <code className="bg-gray-200 px-2 py-1 rounded">flashcard</code> prop (Card B) gets passed to StudyCard</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>StudyCard re-renders with Card B content</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">!</div>
              <div><strong>Race condition:</strong> Sometimes Card B renders with <code className="bg-red-200 px-2 py-1 rounded">isFlipped: true</code> from Card A</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
              <div><code className="bg-gray-200 px-2 py-1 rounded">useEffect</code> fires and sets <code className="bg-gray-200 px-2 py-1 rounded">isFlipped: false</code></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">!</div>
              <div>User briefly sees Card B's back before it flips to front</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">The Problematic Code</h3>
          <CodeBlock
            language="javascript"
            code={`// StudyCard.tsx - The problematic component
export default function StudyCard({ flashcard, onResult }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // This useEffect was the culprit
  useEffect(() => {
    setIsFlipped(false); // Reset to front when card changes
  }, [flashcard._id]);

  // The problem: React's rendering and effect cycles 
  // don't always happen in the exact order you expect
}`}
          />
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
          <p className="text-yellow-800">
            <strong>The insight:</strong> React's rendering and effect cycles don't always happen in 
            the exact order you expect, especially when state updates are cascading through multiple components.
          </p>
        </div>
      </section>

      {/* Solutions Analysis */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Three Solutions (And Why I Chose the Hardest One Again)</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Option 1: Force Synchronous Reset</h3>
            <CodeBlock
              language="javascript"
              code={`// Quick fix - reset immediately in parent
const advanceCard = () => {
  setIsFlipped(false); // Reset before changing card
  setCurrentIndex(currentIndex + 1);
};`}
            />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                <span>Simple, immediate fix</span>
              </div>
              <div className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>Tight coupling</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Option 2: Add Loading States</h3>
            <CodeBlock
              language="javascript"
              code={`// Show loading spinner during transitions
const [isTransitioning, setIsTransitioning] = useState(false);

const advanceCard = async () => {
  setIsTransitioning(true);
  setCurrentIndex(currentIndex + 1);
  await new Promise(resolve => setTimeout(resolve, 100));
  setIsTransitioning(false);
};`}
            />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                <span>Guaranteed timing</span>
              </div>
              <div className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>Artificial delays hurt UX</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Option 3: Lift State Up (Again)</h3>
            <p className="text-sm text-blue-700 mb-4">
              Move <code>isFlipped</code> state to parent for complete control
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                <span>Eliminates race conditions by design</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                <span>Predictable state flow</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Why I Chose Option 3</h3>
          <p className="text-blue-800">
            Once again, I chose the most architecturally sound but complex solution. Moving the flip state 
            to the parent component gave me complete control over timing and eliminated race conditions by design.
          </p>
        </div>
      </section>

      {/* The Solution */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The "Lift State Up" Solution</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Parent Controls Everything</h3>
            <CodeBlock
              language="javascript"
              code={`// StudySessionManager.tsx
export default function StudySessionManager() {
  const { flashcards, currentIndex, recordCardResult } = useStudySession();
  const [isFlipped, setIsFlipped] = useState(false);

  // This effect guarantees the card starts unflipped
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const handleCardResult = async (isCorrect, timeSeconds) => {
    await recordCardResult(isCorrect, timeSeconds);
    // The useEffect above will reset isFlipped when currentIndex changes
  };

  return (
    <StudyCard
      flashcard={flashcards[currentIndex]}
      isFlipped={isFlipped} // Controlled by parent
      onFlip={() => setIsFlipped(!isFlipped)}
      onResult={handleCardResult}
    />
  );
}`}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Child Becomes Pure</h3>
            <CodeBlock
              language="javascript"
              code={`// StudyCard.tsx - Now stateless and predictable
export default function StudyCard({ 
  flashcard, 
  isFlipped, 
  onFlip, 
  onResult 
}) {
  // No internal state - completely controlled by parent
  return (
    <div onClick={onFlip}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front and back content */}
      </motion.div>
      {isFlipped && (
        <div>
          <button onClick={() => onResult(false)}>Wrong</button>
          <button onClick={() => onResult(true)}>Right</button>
        </div>
      )}
    </div>
  );
}`}
            />
          </div>
        </div>
      </section>

      {/* The Pattern Emerges */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Pattern Emerges</h2>
        
        <div className="bg-purple-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-purple-900 mb-6">Two Types of Rabbit Holes</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-red-700">Social Media Rabbit Holes</h4>
              <div className="space-y-2 text-red-600 font-mono text-sm">
                <div>Random → Random → Random</div>
                <div>No learning, no growth</div>
                <div>Time disappears with nothing to show</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-green-700">Development Rabbit Holes</h4>
              <div className="space-y-2 text-green-600 font-mono text-sm">
                <div>Problem → Root Cause → Better Architecture</div>
                <div>New Problem Revealed → Next Solution</div>
                <div>Each layer teaches something valuable</div>
                <div>Time invested compounds into skills</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What This Taught Me About React</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span><strong>Component Lifecycle Timing:</strong> Effects don't always fire when you think they will</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span><strong>State Ownership:</strong> Who controls state determines behavior predictability</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span><strong>Unidirectional Data Flow:</strong> Parent-controlled state eliminates timing issues</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span><strong>Pure Components:</strong> Stateless components are easier to reason about and debug</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Results & Next Challenge */}
      <section className="bg-green-50 border border-green-200 rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-green-900">The Fix Worked, But Revealed Yet Another Bug</h2>
        <p className="text-green-800 text-lg">
          The race condition was eliminated. Users could no longer see answers before questions. 
          The state flow was predictable and controlled.
        </p>
        
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">But Now...</h3>
          <p className="text-gray-700">
            Sometimes users would land on a "Session Complete" screen immediately when they navigated 
            to the study page, even though they hadn't started studying. This wasn't a race condition—it 
            was an edge case in my state logic that the previous bugs had been masking.
          </p>
        </div>
      </section>

      {/* Next in Series */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900">Coming Next</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          In Part 3, I'll dive into the mysterious "Session Complete" screen that appeared when users 
          hadn't even started studying, and how fixing it taught me to think like a state machine architect.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Read Part 3
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Subscribe for Updates
          </button>
        </div>
      </section>
    </article>
  );
}