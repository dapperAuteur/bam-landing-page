// components/blog/RabbitHolePart2Story.tsx
'use client';

import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

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
    insight: "bg-blue-600 text-white shadow-lg shadow-blue-200",
    neutral: "bg-gray-200 text-gray-600"
  };

  return (
    <div className="flex items-start space-x-6 mb-12">
      <div className="flex-shrink-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isActive ? emotionColors[emotion] : emotionColors.neutral
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

export default function RabbitHolePart2Story() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <header className="text-center mb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-red-600/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Victory
              <br />
              <span className="bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                Reveals Enemy
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              How solving the shuffle bug exposed a sneakier villain hiding in React's rendering cycle
            </p>
          </div>
        </div>
      </header>

      {/* The False Victory */}
      <StorySection className="mb-20">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                I Felt Like a Superhero
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Context API refactor was complete. Users could study randomized flashcards without 
                mysterious refreshes. The architecture was cleaner, more maintainable. I'd learned 
                valuable lessons about React state management.
              </p>
              <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
                <p className="text-lg font-semibold text-green-900">
                  "The day was saved. Time to move on to the next feature."
                </p>
                <p className="text-green-700 mt-2">
                  Or so I thought...
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-green-100 rounded-lg p-6 font-mono text-green-800 text-sm">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-semibold">VICTORY REPORT</span>
                </div>
                <div>✓ Shuffle bug eliminated</div>
                <div>✓ Architecture improved</div>
                <div>✓ Users happy</div>
                <div>✓ Code maintainable</div>
                <div className="mt-4 text-green-600">Status: MISSION COMPLETE</div>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* The Plot Twist */}
      <StorySection className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            But Every Hero Story Has a Plot Twist
          </h2>
          <p className="text-lg text-gray-600">
            Two days later, the reports started coming in...
          </p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-orange-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-orange-900 mb-4">The User Reports</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-orange-800 italic">
                "Sometimes I see the answer before I can read the question"
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-orange-800 italic">
                "The flashcard flips to the back automatically"
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <p className="text-orange-800 italic">
                "I'm seeing answers flash before the front loads"
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-orange-900 font-semibold text-lg">
              For a learning app, this is catastrophic.
            </p>
          </div>
        </div>
      </StorySection>

      {/* Audio Deep Dive */}
      <StorySection className="mb-16">
        <div className="bg-gray-900 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              The Technical Detective Story
            </h2>
            <p className="text-gray-300">
              Listen to my journey debugging React's most elusive enemy: race conditions
            </p>
          </div>
          <AudioPlayer 
            title="Hunting the Race Condition"
            description="A developer's emotional journey from victory to discovery to insight"
            duration="14:22"
            darkMode
          />
        </div>
      </StorySection>

      {/* The Investigation Timeline */}
      <StorySection className="mb-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Deeper Into the Rabbit Hole
          </h2>
          <p className="text-lg text-gray-600 text-center">
            This is what I love about development rabbit holes: solving one problem reveals the next
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-orange-500 to-blue-500"></div>
          
          <TimelineEvent title="The Realization" emotion="discovery" isActive>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This wasn't just a bug—it was a fundamental misunderstanding of React's rendering cycle. 
                The Context API had fixed the data problem but exposed a timing problem I never knew existed.
              </p>
              
              <div className="bg-red-50 rounded-lg p-6">
                <h4 className="font-semibold text-red-900 mb-3">The Devastating Impact</h4>
                <p className="text-red-800">
                  It's like a teacher accidentally showing you the answer sheet before the test. 
                  Users seeing answers before questions eliminates the entire value of spaced repetition learning.
                </p>
              </div>
            </div>
          </TimelineEvent>

          <TimelineEvent title="The Hunt Begins" emotion="challenge" isActive>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Time to dive deeper. The race condition was intermittent, which made it brutal to debug. 
                Sometimes perfect, sometimes this flash. I needed to understand exactly what was happening.
              </p>
              
              <VideoPlaceholder 
                title="The Race Condition Captured"
                description="Slow-motion screen recording showing the exact moment answers flash before questions"
              />

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">The Detective Work</h4>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center">
                    <span className="bg-blue-500 w-3 h-3 rounded-full mr-3"></span>
                    <span>User clicks "Got it Right" on Card A</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 w-3 h-3 rounded-full mr-3"></span>
                    <span>Parent component advances currentIndex</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 w-3 h-3 rounded-full mr-3"></span>
                    <span>New flashcard prop (Card B) flows to StudyCard</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-red-500 w-3 h-3 rounded-full mr-3"></span>
                    <span><strong>Race condition:</strong> Card B renders with Card A's flip state</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 w-3 h-3 rounded-full mr-3"></span>
                    <span>useEffect finally fires to reset flip state</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-red-500 w-3 h-3 rounded-full mr-3"></span>
                    <span><strong>Too late:</strong> User already saw the answer</span>
                  </div>
                </div>
              </div>
            </div>
          </TimelineEvent>

          <TimelineEvent title="The Pattern Recognition" emotion="insight" isActive>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Here's what I was learning about productive rabbit holes versus mindless scrolling:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h4 className="font-semibold text-red-700 mb-3">Mindless Rabbit Holes</h4>
                  <div className="space-y-2 text-red-600 font-mono text-sm">
                    <div>Random → Random → Random</div>
                    <div>No learning, no growth</div>
                    <div>Time disappears with nothing to show</div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-700 mb-3">Development Rabbit Holes</h4>
                  <div className="space-y-2 text-green-600 font-mono text-sm">
                    <div>Problem → Root Cause → Solution</div>
                    <div>New Problem Revealed → Deeper Understanding</div>
                    <div>Each layer teaches something valuable</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
                <p className="text-purple-800 font-semibold">
                  The race condition wasn't a setback—it was the next level of understanding React's architecture.
                </p>
              </div>
            </div>
          </TimelineEvent>

          <TimelineEvent title="The Hard Choice (Again)" emotion="challenge" isActive>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                I had three ways to fix this race condition. Two were technical Band-Aids. 
                One was the architecturally sound solution that would prevent this class of bugs forever.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-orange-600 mb-2">Quick Fix</h4>
                  <p className="text-sm text-gray-600 mb-3">Force synchronous reset</p>
                  <div className="text-xs text-red-600">Tight coupling risk</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-yellow-600 mb-2">Loading States</h4>
                  <p className="text-sm text-gray-600 mb-3">Artificial timing delays</p>
                  <div className="text-xs text-red-600">Hurts user experience</div>
                </div>
                <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-blue-600 mb-2">Lift State Up</h4>
                  <p className="text-sm text-blue-700 mb-3">Parent controls everything</p>
                  <div className="text-xs text-green-600">Eliminates race conditions by design</div>
                </div>
              </div>

              <div className="bg-blue-900 rounded-lg p-6 text-white">
                <h4 className="font-semibold mb-3">Why I Chose the Hard Way (Again)</h4>
                <p>
                  Once again, I chose the most architecturally sound but complex solution. Moving the flip state 
                  to the parent component gave me complete control over timing. No more hoping React's effects 
                  would fire at the right time—I was guaranteeing it.
                </p>
              </div>
            </div>
          </TimelineEvent>

          <TimelineEvent title="The Elegant Solution" emotion="triumph" isActive>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                The solution was beautiful in its simplicity: lift the state up, let the parent control timing, 
                make the child component pure and predictable.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-700 mb-3">Before: Child Controls State</h4>
                  <CodeBlock
                    language="javascript"
                    code={`// StudyCard.tsx - PROBLEMATIC
export default function StudyCard({ flashcard }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // TIMING ISSUE: useEffect may fire after render
  useEffect(() => {
    setIsFlipped(false);
  }, [flashcard._id]);

  // Race condition possible here
}`}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-green-700 mb-3">After: Parent Controls Everything</h4>
                  <CodeBlock
                    language="javascript"
                    code={`// StudyCard.tsx - FIXED
export default function StudyCard({ 
  flashcard, 
  isFlipped, 
  onFlip 
}) {
  // NO LOCAL STATE - completely predictable
  
  return (
    <div onClick={onFlip}>
      {/* Controlled by parent, no race conditions */}
    </div>
  );
}`}
                  />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Victory (For Real This Time)</h4>
                <p className="text-green-800">
                  The race condition was eliminated. Users could no longer see answers before questions. 
                  The state flow was predictable and controlled. Pure components are easier to reason about and debug.
                </p>
              </div>
            </div>
          </TimelineEvent>

          <TimelineEvent title="But Wait... There's More" emotion="discovery" isActive>
            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-900 mb-3">The Next Challenger Appears</h4>
              <p className="text-yellow-800">
                The race condition was solved, but now users were landing on "Session Complete" screens 
                when they hadn't even started studying. This wasn't a race condition—it was an edge case 
                in my state logic that the previous bugs had been masking.
              </p>
              <div className="mt-4 bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-yellow-700 font-mono text-sm">
                  Next rabbit hole detected: State machine edge cases
                </p>
              </div>
            </div>
          </TimelineEvent>
        </div>
      </StorySection>

      {/* The Transformation Continues */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Hero's Journey Continues
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each problem solved reveals the next challenge, and each challenge makes me stronger
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">What I Learned About React</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Component Lifecycle Timing</h4>
                    <p className="text-gray-600 text-sm">Effects don't always fire when you think they will</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">State Ownership</h4>
                    <p className="text-gray-600 text-sm">Who controls state determines behavior predictability</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Pure Components</h4>
                    <p className="text-gray-600 text-sm">Stateless components are easier to debug and reason about</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The Real Victory</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">React expertise</span>
                  <span className="text-blue-600 font-mono">↑ Advanced</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Debugging skills</span>
                  <span className="text-green-600 font-mono">↑ Systematic</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Architecture thinking</span>
                  <span className="text-purple-600 font-mono">↑ Long-term</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between items-center py-2 font-semibold">
                  <span className="text-gray-900">Confidence in complexity</span>
                  <span className="text-indigo-600">Unshakeable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* Call to Action */}
      <StorySection>
        <div className="text-center bg-gray-900 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">
            Every Bug Is a Teacher
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            But the mysterious "Session Complete" screen would teach me something even more fundamental: 
            how to think like a state machine architect and handle edge cases gracefully.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Read Part 3: The Session That Wouldn't Die
            </button>
            <button className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Subscribe to the Series
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-lg">
              The rabbit hole goes deeper. Are you ready to follow?
            </p>
          </div>
        </div>
      </StorySection>
    </article>
  );
}