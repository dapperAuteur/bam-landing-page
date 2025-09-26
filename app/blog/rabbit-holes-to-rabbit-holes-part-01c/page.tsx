// components/blog/RabbitHolePart1Story.tsx
'use client';

import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { CodeBlock } from '@/components/ui/CodeBlock';

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
  isActive = false 
}: { 
  title: string; 
  children: React.ReactNode; 
  isActive?: boolean; 
}) => (
  <div className="flex items-start space-x-6 mb-12">
    <div className="flex-shrink-0">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-200 text-gray-600'
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

export default function RabbitHolePart1Story() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <header className="text-center mb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              My Developer
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Origin Story
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              How a simple shuffle feature became my transformation from mindless consumer 
              to purposeful builder
            </p>
          </div>
        </div>
      </header>

      {/* The Moment of Realization */}
      <StorySection className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                2 AM. YouTube Rabbit Hole.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                I was three videos deep in a "people falling down" compilation when it hit me: 
                I was perfecting my ability to mindlessly scroll. Hours disappearing with nothing to show.
              </p>
              <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
                <p className="text-lg font-semibold text-gray-900">
                  "How you spend your time determines what you become good at."
                </p>
                <p className="text-gray-600 mt-2">
                  This uncomfortable truth changed everything.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-900 rounded-lg p-6 font-mono text-green-400 text-sm">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div>$ whoami</div>
                <div className="mt-2 text-gray-400">
                  &gt; Mindless content consumer
                  <br />
                  &gt; YouTube rabbit hole expert
                  <br />
                  &gt; Time: [WASTED]
                </div>
                <div className="mt-4 text-white">$ transform --mode=builder</div>
                <div className="mt-2 text-blue-400">Initiating transformation...</div>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* The Choice */}
      <StorySection className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The Choice: Which Rabbit Hole?
          </h2>
          <p className="text-lg text-gray-600">
            I decided to redirect that rabbit hole energy somewhere productive
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-red-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-4">Social Media Rabbit Holes</h3>
            <ul className="space-y-2 text-red-800">
              <li>• Random → Random → Random</li>
              <li>• No learning, no growth</li>
              <li>• Time disappears with nothing to show</li>
              <li>• Dopamine hits from others' content</li>
            </ul>
            <div className="mt-6 text-red-600 font-semibold">
              Result: Expert at consuming, terrible at creating
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-green-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-4">Development Rabbit Holes</h3>
            <ul className="space-y-2 text-green-800">
              <li>• Problem → Root Cause → Better Architecture</li>
              <li>• Each layer teaches something valuable</li>
              <li>• Time invested compounds into skills</li>
              <li>• Satisfaction from building solutions</li>
            </ul>
            <div className="mt-6 text-green-600 font-semibold">
              Result: Expert at solving, creator of value
            </div>
          </div>
        </div>
      </StorySection>

      {/* Video Section */}
      <StorySection className="mb-16">
        <div className="bg-gray-900 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              The Bug That Started Everything
            </h2>
            <p className="text-gray-300">
              Watch how a "simple" shuffle feature exposed critical architecture flaws
            </p>
          </div>
          <VideoPlaceholder 
            title="From Simple Feature to Architecture Crisis"
            description="The moment everything broke and led to my transformation"
            darkMode
          />
        </div>
      </StorySection>

      {/* The Journey Timeline */}
      <StorySection className="mb-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            My First Productive Rabbit Hole
          </h2>
          <p className="text-lg text-gray-600 text-center">
            What started as a simple feature became weeks of architectural discovery
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
          
          <TimelineEvent title="The Innocent Request" isActive>
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <p className="text-blue-900 italic mb-3">
                "Can you shuffle the flashcards so users don't memorize the order?"
              </p>
              <p className="text-blue-800">
                Seemed simple. Create a shuffle function, call it before sessions. Easy, right?
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">The Clean Implementation</h4>
              <CodeBlock
                language="javascript"
                code={`// My first instinct: keep it clean and reusable
export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array]; // Don't mutate original
  let currentIndex = newArray.length;
  
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = 
      [newArray[randomIndex], newArray[currentIndex]];
  }
  
  return newArray;
};`}
              />
              <div className="mt-4 text-sm text-gray-600">
                <strong>Why separate?</strong> Single responsibility, reusability, testability
              </div>
            </div>
          </TimelineEvent>

          <TimelineEvent title="The Moment It Broke">
            <div className="bg-red-50 rounded-lg p-6 mb-4">
              <p className="text-red-900 font-semibold mb-2">User reports flooding in:</p>
              <ul className="text-red-800 space-y-1">
                <li>• "Cards shuffle perfectly, then app refreshes"</li>
                <li>• "Back to original order, progress lost"</li>
                <li>• "Happening every single time"</li>
              </ul>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              This wasn't just annoying—it was breaking the core experience. But more importantly, 
              this "simple" feature had exposed a critical flaw in my app's architecture.
            </p>
          </TimelineEvent>

          <TimelineEvent title="The Detective Work">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Hours of debugging revealed the truth: my component architecture had a fundamental problem.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">The Fatal Flow</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><code>StudySessionSetup</code> (child) fetches and shuffles data</li>
                  <li>User clicks start → parent updates state</li>
                  <li>Parent re-renders → <strong>child gets unmounted</strong></li>
                  <li>Later remount → fresh API call → unshuffled data</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-800">
                  <strong>Anti-pattern identified:</strong> Temporary child components owning critical data
                </p>
              </div>
            </div>
          </TimelineEvent>

          <TimelineEvent title="The Choice Point">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                I had three ways to fix this. The first two were quick patches. 
                The third was the right architectural foundation for the long term.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-orange-600 mb-2">Quick Fix</h4>
                  <p className="text-sm text-gray-600">Lift state to parent</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-purple-600 mb-2">Composition</h4>
                  <p className="text-sm text-gray-600">New container component</p>
                </div>
                <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-blue-600 mb-2">Context API</h4>
                  <p className="text-sm text-blue-700">Single source of truth</p>
                </div>
              </div>

              <div className="bg-blue-900 rounded-lg p-6 text-white">
                <h4 className="font-semibold mb-3">Why I Chose the Hard Way</h4>
                <p>
                  I could have taken the quick fix. But I'm not building for just today—I'm building 
                  for the long haul. The Context API provided the most robust foundation for future features.
                </p>
              </div>
            </div>
          </TimelineEvent>

          <TimelineEvent title="The Transformation">
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">Victory... Sort Of</h4>
              <p className="text-green-800 mb-4">
                The Context API refactor completely solved the shuffle bug. Architecture was clean, 
                maintainable, and ready for future features.
              </p>
              <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-yellow-800 font-semibold">
                  But fixing one problem revealed another: users were now seeing flashcard answers 
                  before questions due to a race condition.
                </p>
              </div>
            </div>
          </TimelineEvent>
        </div>
      </StorySection>

      {/* The Lesson */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Real Transformation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This wasn't just about fixing a bug—it was about becoming someone who builds 
              instead of just consumes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Skills I Gained</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Clean Code Principles</h4>
                    <p className="text-gray-600 text-sm">Utility functions, pure functions, separation of concerns</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">React Architecture</h4>
                    <p className="text-gray-600 text-sm">Context API, component lifecycle, state management</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Debugging Methodology</h4>
                    <p className="text-gray-600 text-sm">Systematic analysis, data flow understanding</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Long-term Thinking</h4>
                    <p className="text-gray-600 text-sm">Choosing scalable solutions over quick fixes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The Real Victory</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Hours spent consuming</span>
                  <span className="text-red-600 font-mono">↓ 80%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Hours spent building</span>
                  <span className="text-green-600 font-mono">↑ 400%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Skills acquired</span>
                  <span className="text-blue-600 font-mono">↑ ∞</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between items-center py-2 font-semibold">
                  <span className="text-gray-900">Transformation</span>
                  <span className="text-purple-600">Complete</span>
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
            Your Rabbit Holes Are Waiting
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The race condition bug would lead to even more discoveries. In Part 2, I'll show you 
            how fixing architecture problems reveals UI timing issues—and how each solution 
            teaches you something new.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Read Part 2: The Race Condition
            </button>
            <button className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Subscribe to the Series
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-lg">
              Which rabbit holes will you choose?
            </p>
          </div>
        </div>
      </StorySection>
    </article>
  );
}