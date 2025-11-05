// components/blog/RabbitHolePart4Story.tsx
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
  emotion?: "triumph" | "discovery" | "challenge" | "insight" | "breakthrough" | "neutral";
}) => {
  const emotionColors = {
    triumph: "bg-green-600 text-white shadow-lg shadow-green-200",
    discovery: "bg-orange-500 text-white shadow-lg shadow-orange-200", 
    challenge: "bg-red-500 text-white shadow-lg shadow-red-200",
    insight: "bg-blue-600 text-white shadow-lg shadow-blue-200",
    breakthrough: "bg-amber-500 text-white shadow-lg shadow-amber-200",
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

export default function RabbitHolePart4Story() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <header className="text-center mb-20">
        {/* <SeriesTableOfContents currentPart={5}  className="sticky top-4" /> */}
        {/* <PartNavigation currentPart={5} className="mt-12" />
        <SeriesBreadcrumb currentPart={5} className="mb-8" /> */}
        {/* <FloatingSeriesNav currentPart={5} /> */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-green-600/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-4">
              From Rabbit Holes to Rabbit Holes: Part 4
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Racing Conditions
              <br />
              <span className="bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
                and UX Gold
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              How embracing technical constraints breeds creativity and transforms bugs 
              into features that users love
            </p>
          </div>
        </div>
        <SeriesProgress currentPart={4} className="mt-4" />
      </header>

      {/* The Final Boss Battle */}
      <StorySection className="mb-20">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The Final Boss Bug
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                State machine architecture: ✓ Phantom sessions: ✓ Bulletproof edge cases: ✓ 
                My flashcard app was architecturally sound. Yet one tiny timing issue remained.
              </p>
              <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                <p className="text-lg font-semibold text-gray-900">
                  "For a split second, users still glimpsed the answer to the next card 
                  before seeing the question."
                </p>
                <p className="text-gray-700 mt-2">
                  React's rendering cycle had one final microsecond window of vulnerability.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-red-100 rounded-lg p-6 font-mono text-red-800 text-sm">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="font-semibold">FINAL RACE CONDITION</span>
                </div>
                <div>T0: User clicks "Got it Right"</div>
                <div>T1: Context updates currentIndex</div>
                <div>T2: New card content loads</div>
                <div className="text-red-600 font-bold">T3: ← User sees answer ←</div>
                <div>T4: isFlipped resets to false</div>
                <div>T5: Card flips to question</div>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* The Three Paths */}
      <StorySection className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Three Paths Forward
          </h2>
          <p className="text-lg text-gray-600">
            I stood at a crossroads, each path offering a different philosophy...
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 relative">
            <div className="absolute top-4 right-4 text-red-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-3">The Brute Force Path</h3>
            <p className="text-red-800 mb-4 text-sm">
              Add artificial delays. Force timing with setTimeout(). Fight React's nature.
            </p>
            <div className="bg-red-100 rounded p-3 font-mono text-xs text-red-700">
              await new Promise(resolve =&gt;<br/>
              &nbsp;&nbsp;setTimeout(resolve, 100)<br/>
              );
            </div>
            <p className="text-red-600 text-xs mt-3 font-semibold">Feels sluggish. Arbitrary. Uninspired.</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 relative">
            <div className="absolute top-4 right-4 text-yellow-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-yellow-900 mb-3">The Complex Path</h3>
            <p className="text-yellow-800 mb-4 text-sm">
              Orchestrate multiple state variables. Add synchronization flags. Control every detail.
            </p>
            <div className="bg-yellow-100 rounded p-3 font-mono text-xs text-yellow-700">
              setIsTransitioning(true);<br/>
              await recordResult();<br/>
              setIsFlipped(false);<br/>
              setIsTransitioning(false);
            </div>
            <p className="text-yellow-600 text-xs mt-3 font-semibold">More complexity. Still fighting the constraint.</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-green-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-green-300 to-green-400 rounded-full opacity-20"></div>
            <h3 className="text-xl font-semibold text-green-900 mb-3">The Creative Path</h3>
            <p className="text-green-800 mb-4 text-sm">
              What if the gap isn't a bug? What if it's an opportunity to create something better?
            </p>
            <div className="bg-green-100 rounded p-3 font-mono text-xs text-green-700">
              setLastCardResult('correct');<br/>
              // Show feedback screen<br/>
              // User controls next card
            </div>
            <p className="text-green-600 text-xs mt-3 font-semibold">Embrace the constraint. Turn it into a feature.</p>
          </div>
        </div>
      </StorySection>

      {/* The Revelation */}
      <StorySection className="mb-16">
        <TimelineEvent 
          title="The Creative Breakthrough" 
          isActive={true} 
          emotion="breakthrough"
        >
          <p className="text-lg text-gray-700 mb-4">
            Instead of fighting React's timing, what if I made the gap <strong>intentional</strong>? 
            What if the "bug" became a feature that improved the user experience beyond 
            what I would have built intentionally?
          </p>
          <div className="bg-amber-100 rounded-lg p-6">
            <h4 className="font-semibold text-amber-900 mb-3">The Elegant Insight</h4>
            <p className="text-amber-800">
              Turn the card transition gap into dedicated feedback screens. Give users 
              immediate positive reinforcement. Let them control the pacing.
            </p>
          </div>
        </TimelineEvent>

        <TimelineEvent 
          title="The Implementation Magic" 
          isActive={true} 
          emotion="discovery"
        >
          <CodeBlock
            language="javascript"
            code={`// Instead of immediately advancing cards...
const recordCardResult = useCallback(async (isCorrect, timeSeconds) => {
  // SET FEEDBACK STATE FIRST
  setLastCardResult(isCorrect ? 'correct' : 'incorrect');
  
  // Save the result but don't advance the card yet
  const newResults = [...cardResults, result];
  setCardResults(newResults);
  await saveResult(result);
}, []);

// User controls when to see the next card
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
          <div className="bg-orange-100 rounded-lg p-4 mt-4">
            <p className="text-orange-800 font-semibold">
              Race condition eliminated through design, not complexity. No timing windows 
              where wrong content can appear.
            </p>
          </div>
        </TimelineEvent>

        <TimelineEvent 
          title="The Feedback Experience" 
          isActive={true} 
          emotion="triumph"
        >
          <CodeBlock
            language="javascript"
            code={`// CardFeedback.tsx - The constraint becomes the feature
export default function CardFeedback() {
  const { lastCardResult, showNextCard } = useStudySession();

  const isCorrect = lastCardResult === 'correct';
  const messages = {
    correct: ["Awesome!", "You got it!", "Great job!", "Keep it up!"],
    incorrect: ["Keep trying!", "Almost there!", "Don't give up!"]
  };
  
  const message = messages[lastCardResult][
    Math.floor(Math.random() * messages[lastCardResult].length)
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={\`w-full h-80 rounded-lg flex flex-col items-center justify-center 
                  text-white p-6 shadow-lg \${
        isCorrect ? 'bg-green-500' : 'bg-red-500'
      }\`}
    >
      {isCorrect ? <CheckCircleIcon className="h-16 w-16 mb-4" /> : <XCircleIcon className="h-16 w-16 mb-4" />}
      <p className="text-3xl font-bold mb-6">{message}</p>
      <button
        onClick={showNextCard}
        className="px-8 py-3 bg-white text-lg font-semibold rounded-md 
                   text-gray-800 hover:bg-gray-200"
      >
        Next Card
      </button>
    </motion.div>
  );
}`}
          />
        </TimelineEvent>
      </StorySection>

      {/* Audio Deep Dive */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              The Philosophy of Constraint-Driven Innovation
            </h2>
            <p className="text-gray-300">
              How the best solutions come from embracing limitations rather than fighting them
            </p>
          </div>
          <AudioPlayer 
            title="From Constraints to Creativity: A Developer's Journey"
            description="Deep dive into the mindset shift that turns technical problems into user experience gold"
            duration="15:42"
            darkMode={true}
          />
        </div>
      </StorySection>

      {/* The Unexpected Magic */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            The Unexpected Magic
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            The feedback screens didn't just solve the race condition—they transformed 
            the entire learning experience in ways I never anticipated:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Immediate Positive Reinforcement</h3>
                  <p className="text-gray-700 text-sm">Learning science shows instant feedback improves retention by 25-40%</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mental Processing Time</h3>
                  <p className="text-gray-700 text-sm">Brief pause lets users process what they learned before the next concept</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gamification Magic</h3>
                  <p className="text-gray-700 text-sm">Randomized encouragement messages trigger dopamine and add personality</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visual Clarity</h3>
                  <p className="text-gray-700 text-sm">Green for correct, red for incorrect—clear feedback that reinforces outcomes</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Accessibility Wins</h3>
                  <p className="text-gray-700 text-sm">Screen readers now have distinct content to announce for each result</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">User-Controlled Pacing</h3>
                  <p className="text-gray-700 text-sm">Explicit "Next Card" button puts users in complete control of their learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* App Demo */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Experience the Transformation
            </h2>
            <p className="text-gray-600 mb-4">
              See how embracing constraints created a better learning experience
            </p>
            <a 
              href="https://i.witus.online/flashlearnai-b" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Try FlashLearn AI →
            </a>
          </div>
          <VideoPlaceholder 
            title="Feedback Screens in Action"
            description="Watch how constraint-driven innovation creates delightful user experiences"
          />
        </div>
      </StorySection>

      {/* The Design Principle */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            The Design Principle That Changed Everything
          </h2>
          <blockquote className="text-2xl md:text-3xl font-bold text-purple-100 mb-8 leading-relaxed">
            "Constraints aren't always obstacles to overcome—sometimes they're 
            opportunities to create something better."
          </blockquote>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Instead of fighting React's rendering timing, I used it as a forcing function 
            to add value. The "bug" became a feature that improved the user experience 
            beyond what I would have built intentionally.
          </p>
          <div className="mt-8">
            <span className="bg-purple-100 text-purple-900 px-6 py-3 rounded-full text-lg font-semibold">
              Seeing constraints as creative catalysts
            </span>
          </div>
        </div>
      </StorySection>

      {/* The Transformation Complete */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            The Superhero Transformation Complete
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4 text-center">Six Months Ago</h3>
              <div className="space-y-3">
                <div className="flex items-center text-red-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Falling down random social media rabbit holes</span>
                </div>
                <div className="flex items-center text-red-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Getting dopamine from consuming other people's content</span>
                </div>
                <div className="flex items-center text-red-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span>Time disappearing with nothing to show for it</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4 text-center">Now</h3>
              <div className="space-y-3">
                <div className="flex items-center text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Falling down productive rabbit holes starting with features</span>
                </div>
                <div className="flex items-center text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Getting satisfaction from solving architectural problems</span>
                </div>
                <div className="flex items-center text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Time invested compounds into better skills and products</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">The Journey That Started With a Shuffle</h3>
            <p className="text-blue-800 mb-4">
              The shuffle feature that started this journey was supposed to take an hour. 
              It turned into weeks of deep architectural work that taught me:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-blue-800">
                <li>• Clean code principles and utility functions</li>
                <li>• React state management and component lifecycle</li>
                <li>• Debugging methodology and systematic thinking</li>
              </ul>
              <ul className="space-y-2 text-blue-800">
                <li>• State machine architecture patterns</li>
                <li>• Creative constraint-embracing problem solving</li>
                <li>• How time spent determines what you become good at</li>
              </ul>
            </div>
          </div>
        </div>
      </StorySection>

      {/* The Series Continues */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            But the Story Continues...
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            This was supposed to be the end. Race condition solved, user experience 
            transformed, lessons learned.
          </p>
          <p className="text-lg text-gray-300 mb-8">
            But building software for real users means building for the real world. 
            And the real world has authentication, business requirements, and monetization needs.
          </p>
          
          <div className="bg-gradient-to-r from-amber-900 to-orange-900 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-amber-100 mb-3">Coming in Part 5</h3>
            <p className="text-amber-200">
              How I built the "Study Direction" feature—allowing users to study cards 
              in reverse—and architected it for different user tiers without breaking 
              existing functionality.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={'/blog/rabbit-holes-to-rabbit-holes/story/part-03'}
              className="bg-orange-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Read Part 3: The Session That Wouldn't Die
            </Link>
            {/* <button className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Subscribe to the Series
            </button> */}
            <Link
              href={'/blog/rabbit-holes-to-rabbit-holes/story/part-05'}
              className="bg-blue-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Read Part 5: Authentication & Monetization
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-lg">
              Where rabbit holes meet real-world business requirements.
            </p>
          </div>
        </div>
      </StorySection>

      {/* Code Quality Review */}
      <StorySection className="mb-16">
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Technical Victory Lap</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Creative Problem Solving</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>✅ Turned technical constraint into UX feature</li>
                <li>✅ Eliminated race condition through design</li>
                <li>✅ Added value instead of just fixing bugs</li>
                <li>✅ Followed learning science principles</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Architecture Excellence</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✅ State machine handles feedback elegantly</li>
                <li>✅ Clean separation of concerns</li>
                <li>✅ No artificial delays or complex sync</li>
                <li>✅ Accessible and inclusive design</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">User Experience Wins</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>✅ Immediate positive reinforcement</li>
                <li>✅ Clear visual feedback (green/red)</li>
                <li>✅ Gamification elements</li>
                <li>✅ User-controlled pacing</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 italic text-lg">
              Next: Where rabbit holes meet authentication boundaries and monetization architecture
            </p>
          </div>
        </div>
      </StorySection>
    </article>
  );
}