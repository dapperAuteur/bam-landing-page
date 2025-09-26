// components/blog/RabbitHolePart1.tsx
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';

export default function RabbitHolePart1() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            From Rabbit Holes to Rabbit Holes: Part 1
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            The Shuffle That Broke Everything
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A developer's journey from mindless scrolling to meaningful problem-solving
        </p>
      </header>

      {/* Video Section */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <VideoPlaceholder 
          title="The Shuffle Bug in Action"
          description="Watch how a simple feature request exposed a critical architecture flaw"
        />
      </section>

      {/* The Realization Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Realization</h2>
        <div className="prose prose-lg prose-gray max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            I had an uncomfortable realization while catching myself three videos deep in a "people falling down" 
            compilation on YouTube at 2 AM. I was thinking about how I spend my time, and more importantly, 
            what I'm getting good at.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
            <p className="text-lg font-semibold text-blue-900">
              How you spend your time determines what you become good at.
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            I decided to redirect that rabbit hole energy somewhere more productive. Instead of falling down 
            endless social media rabbit holes, I'd dive deep into the rabbit holes that start with feature 
            implementations and lead to architectural discoveries, bug hunts, and better code.
          </p>
        </div>
      </section>

      {/* The Simple Feature Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The "Simple" Feature</h2>
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Flashlearn AI is my language learning app where users create flashcard sets and study them. 
            The feature request seemed straightforward: <strong>"Shuffle the cards before each study session 
            so users don't memorize the order."</strong>
          </p>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Clean Implementation Approach</h3>
            <CodeBlock
              language="javascript"
              code={`// /src/lib/utils/arrayUtils.ts
export const shuffleArray = <T,>(array: T[]): T[] => {
  // Create a copy to avoid mutating the original array
  const newArray = [...array];
  let currentIndex = newArray.length;
  let randomIndex;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
};`}
            />
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-gray-900">Why a separate utility function?</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Single Responsibility Principle</strong> - The shuffle logic has one job</li>
                <li><strong>Reusability</strong> - Other features might need array shuffling</li>
                <li><strong>Testability</strong> - Pure functions are easy to unit test</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Bug Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Bug That Exposed Everything</h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">User Reports</h3>
              <p className="text-red-800 mt-2">
                "Cards shuffle perfectly, then suddenly the app 'refreshes' and shows the original, 
                unshuffled order. Progress is lost."
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">The Root Cause</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li><code>StudySession</code> component manages overall session state</li>
              <li><code>StudySessionSetup</code> (child) fetches and holds flashcard data</li>
              <li>When setup triggers <code>onStartSession</code>, parent updates state</li>
              <li>Parent re-renders and <strong>unmounts</strong> the setup component</li>
              <li>Later re-mount fetches fresh data from API</li>
              <li><strong>Fresh API data = original, unshuffled order</strong></li>
            </ol>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-yellow-800">
              <strong>Anti-pattern identified:</strong> Letting temporary child components own critical data.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Three Ways to Fix It</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Option 1: Lift State Up</h3>
            <p className="text-sm text-gray-600 mb-4">Move data fetching to parent component</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                <span>React best practices</span>
              </div>
              <div className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>Doesn't scale well</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Option 2: Component Composition</h3>
            <p className="text-sm text-gray-600 mb-4">New parent container manages both components</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                <span>Clear separation</span>
              </div>
              <div className="flex items-center text-red-600">
                <span className="mr-2">✗</span>
                <span>Adds complexity</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Option 3: Context API</h3>
            <p className="text-sm text-blue-700 mb-4">Centralized state management context</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                <span>Single source of truth</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="mr-2">✓</span>
                <span>Highly scalable</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Why I Chose Option 3</h3>
          <p className="text-blue-800">
            The Context API provided the most robust foundation for future features. I'm not building 
            for just today—I'm building for the long haul.
          </p>
        </div>
      </section>

      {/* Solution Implementation */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Context API Solution</h2>
        <CodeBlock
          language="javascript"
          code={`// /src/contexts/StudySessionContext.tsx
interface StudySessionState {
  sessionId: string | null;
  flashcards: Flashcard[];
  currentIndex: number;
  isComplete: boolean;
  // Actions
  startSession: (listId: string) => Promise<void>;
  recordCardResult: (isCorrect: boolean, timeSeconds: number) => Promise<void>;
  resetSession: () => void;
}

export const StudySessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  const startSession = useCallback(async (listId) => {
    const response = await fetch('/api/study/sessions', {
      method: 'POST',
      body: JSON.stringify({ listId })
    });

    const data = await response.json();
    const shuffledCards = shuffleArray(data.flashcards);

    // All state updates happen here - single source of truth
    setSessionId(data.sessionId);
    setFlashcards(shuffledCards);
    setCurrentIndex(0);
    setIsComplete(false);
  }, []);

  return (
    <StudySessionContext.Provider value={{
      sessionId, flashcards, startSession, resetSession
    }}>
      {children}
    </StudySessionContext.Provider>
  );
};`}
        />
      </section>

      {/* Results & Next Steps */}
      <section className="bg-green-50 border border-green-200 rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-green-900">The Fix Worked (But Revealed Another Bug)</h2>
        <p className="text-green-800 text-lg">
          The Context API refactor completely solved the shuffle bug. But fixing one problem often 
          reveals another: users were now seeing flashcard answers before questions due to a race condition.
        </p>
        
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What This Taught Me</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Clean code principles (utility functions, pure functions)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>React architecture patterns (Context API vs alternatives)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>State management debugging (component lifecycle, data flow)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <span>Long-term technical decision making</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next in Series */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900">Coming Next</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          In Part 2, I'll dive into the race condition bug that the Context API refactor revealed, 
          and how fixing architecture problems often uncovers UI timing issues you never knew existed.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Read Part 2
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Subscribe for Updates
          </button>
        </div>
      </section>
    </article>
  );
}