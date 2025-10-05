// components/blog/RabbitHolePart1Technical.tsx
'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { SeriesProgress } from '@/components/blog/SeriesNavigation';
import Link from 'next/link';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TechnicalTabs = ({ activeTab, onTabChange }: TabsProps) => (
  <div className="border-b border-gray-200 mb-8">
    <nav className="-mb-px flex space-x-8">
      {[
        { id: 'problem', label: 'Problem Analysis' },
        { id: 'solution', label: 'Architecture Solution' },
        { id: 'implementation', label: 'Code Implementation' },
        { id: 'lessons', label: 'Technical Lessons' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default function RabbitHolePart1Technical() {
  const [activeTab, setActiveTab] = useState('problem');

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
            CASE STUDY
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
            React State Management
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
            Architecture Debugging
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shuffle Feature → Architecture Overhaul
        </h1>
        <p className="text-xl text-gray-600 font-mono">
          How a simple array randomization exposed critical state management anti-patterns
        </p>
        <SeriesProgress currentPart={1} className="mt-4" />
      </header>

      {/* Video Section */}
      {/* <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-400 font-mono text-sm ml-4">bug-reproduction.mp4</span>
        </div>
        <VideoPlaceholder 
          title="State Management Bug Reproduction"
          description="Terminal recording showing shuffle → refresh → original order bug"
          darkMode
        />
      </section> */}

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
        {activeTab === 'problem' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              Problem Identification
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">User-Reported Behavior</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 font-mono text-sm">
                  <div className="text-red-700">
                    <div>1. User starts study session ✓</div>
                    <div>2. Cards appear shuffled ✓</div>
                    <div>3. App suddenly "refreshes" ✗</div>
                    <div>4. Original card order restored ✗</div>
                    <div>5. Progress lost ✗</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Component Architecture</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <CodeBlock
                    language="javascript"
                    code={`// Problematic architecture
                      StudySession (parent)
                      ├── manages session state
                      └── StudySessionSetup (child)
                          ├── fetches flashcard data
                          ├── owns shuffle logic
                          └── gets unmounted on session start`
                        }
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Root Cause Analysis</h3>
              <p className="text-yellow-800 mb-4">
                <strong>Anti-pattern:</strong> Temporary child component owns critical application data
              </p>
              <div className="font-mono text-sm text-yellow-700 space-y-1">
                <div>child.unmount() → data.lost</div>
                <div>parent.remount(child) → api.fetchFresh() → shuffle.lost</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Debug Stack Trace</h3>
              <CodeBlock
                language="javascript"
                code={`// Component lifecycle causing data loss
                  1. StudySessionSetup.componentDidMount()
                    └── fetchFlashcards() ✓
                    └── shuffleArray(cards) ✓

                  2. User.clickStart()
                    └── onStartSession(sessionId, shuffledCards) ✓

                  3. StudySession.setState({ sessionId })
                    └── StudySession.render() 
                    └── StudySessionSetup.componentWillUnmount() ✗
                    
                  4. StudySession.remount(StudySessionSetup)
                    └── StudySessionSetup.componentDidMount()
                    └── fetchFlashcards() // Fresh, unshuffled data ✗`
                }
                darkMode
              />
            </div>
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              Architecture Solutions Analysis
            </h2>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-semibold">
                    Option 1
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lift State Up</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Move data fetching to parent
                    StudySession
                    ├── fetchFlashcards() ✓
                    ├── shuffleArray() ✓
                    └── StudySessionSetup
                        └── receives shuffled props`}
                />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="text-green-600">✓ React best practices</div>
                  <div className="text-red-600">✗ Parent complexity increase</div>
                  <div className="text-red-600">✗ Poor scalability</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-semibold">
                    Option 2
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Composition</h3>
                <CodeBlock
                  language="javascript"
                  code={`// New container component
                    StudyContainer
                    ├── fetchFlashcards() ✓
                    ├── shuffleArray() ✓
                    ├── StudySessionSetup
                    └── StudySession`
                  }
                />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="text-green-600">✓ Separation of concerns</div>
                  <div className="text-yellow-600">~ Additional layer</div>
                  <div className="text-red-600">✗ Prop drilling risk</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    Option 3 - CHOSEN
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Context API</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Centralized state management
                    StudySessionContext
                    ├── Global state ✓
                    ├── Business logic ✓
                    └── Components
                        ├── StudySessionSetup
                        └── StudySession`
                  }
                />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="text-green-600">✓ Single source of truth</div>
                  <div className="text-green-600">✓ Highly scalable</div>
                  <div className="text-green-600">✓ Component decoupling</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 rounded-lg p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Decision Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-700">
                      <th className="text-left py-2">Criteria</th>
                      <th className="text-center py-2">Lift State</th>
                      <th className="text-center py-2">Composition</th>
                      <th className="text-center py-2 text-blue-300">Context API</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr>
                      <td className="py-1">Scalability</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">⚠️</td>
                      <td className="text-center text-blue-300">✅</td>
                    </tr>
                    <tr>
                      <td className="py-1">Component Decoupling</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">✅</td>
                      <td className="text-center text-blue-300">✅</td>
                    </tr>
                    <tr>
                      <td className="py-1">Future Features</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">⚠️</td>
                      <td className="text-center text-blue-300">✅</td>
                    </tr>
                    <tr>
                      <td className="py-1">Implementation Speed</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">⚠️</td>
                      <td className="text-center text-blue-300">❌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              Context API Implementation
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Context Definition</h3>
                <CodeBlock
                  language="typescript"
                  code={`// /src/contexts/StudySessionContext.tsx
                    interface StudySessionState {
                      // Session Status
                      sessionId: string | null;
                      isLoading: boolean;
                      isComplete: boolean;
                      error: string | null;

                      // Session Data
                      flashcards: Flashcard[];
                      currentIndex: number;
                      cardResults: CardResult[];

                      // Actions
                      startSession: (listId: string) => Promise<void>;
                      recordCardResult: (isCorrect: boolean) => Promise<void>;
                      resetSession: () => void;
                    }`
                  }
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Provider Implementation</h3>
                <CodeBlock
                  language="typescript"
                  code={`export const StudySessionProvider = ({ children }) => {
                    const [sessionId, setSessionId] = useState(null);
                    const [flashcards, setFlashcards] = useState([]);
                    const [currentIndex, setCurrentIndex] = useState(0);
                    const [isComplete, setIsComplete] = useState(false);

                    const startSession = useCallback(async (listId) => {
                      const data = await fetchSessionData(listId);
                      const shuffledCards = shuffleArray(data.flashcards);
                      
                      // Atomic state update
                      setSessionId(data.sessionId);
                      setFlashcards(shuffledCards);
                      setCurrentIndex(0);
                      setIsComplete(false);
                    }, []);

                    return (
                      <StudySessionContext.Provider value={{
                        sessionId, flashcards, startSession
                      }}>
                        {children}
                      </StudySessionContext.Provider>
                    );
                  };`
                }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Component Refactor</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Before: Tightly Coupled</h4>
                  <CodeBlock
                    language="javascript"
                    code={`// StudySessionSetup.tsx - BEFORE
                      export default function StudySessionSetup({ onStartSession }) {
                        const [flashcards, setFlashcards] = useState([]);
                        
                        useEffect(() => {
                          fetchFlashcards().then(setFlashcards);
                        }, []);

                        const handleStart = () => {
                          const shuffled = shuffleArray(flashcards);
                          onStartSession(sessionId, shuffled); // Prop drilling
                        };

                        return <button onClick={handleStart}>Start</button>;
                      }`
                    }
                  />
                </div>

                <div>
                  <h4 className="font-medium text-green-700 mb-2">After: Context Consumer</h4>
                  <CodeBlock
                    language="javascript"
                    code={`// StudySessionSetup.tsx - AFTER  
                      export default function StudySessionSetup() {
                        const { startSession, isLoading } = useStudySession();

                        const handleStart = async () => {
                          await startSession(selectedListId);
                          // Context handles everything else
                        };

                        return (
                          <button 
                            onClick={handleStart} 
                            disabled={isLoading}
                          >
                            {isLoading ? 'Starting...' : 'Start Studying'}
                          </button>
                        );
                      }`
                    }
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Performance Optimizations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-mono">useCallback</span>
                  <span className="text-green-800">Memoized actions prevent unnecessary re-renders</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-mono">useMemo</span>
                  <span className="text-green-800">Computed values cached between renders</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 font-mono">Context splitting</span>
                  <span className="text-green-800">Separate contexts for different concerns if needed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                4
              </span>
              Technical Lessons Learned
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-900">React Architecture</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 text-sm">
                    <li>• Component ownership determines data lifecycle</li>
                    <li>• Temporary components shouldn't own critical data</li>
                    <li>• Context API scales better than prop drilling</li>
                    <li>• Unidirectional data flow prevents timing issues</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-green-900">State Management</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 text-sm">
                    <li>• Single source of truth eliminates sync issues</li>
                    <li>• Atomic state updates prevent partial failures</li>
                    <li>• useCallback/useMemo for performance</li>
                    <li>• Custom hooks for clean API abstraction</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-900">Debugging Methodology</h3>
                  <ul className="mt-2 space-y-1 text-gray-700 text-sm">
                    <li>• Reproduce consistently before fixing</li>
                    <li>• Component lifecycle understanding crucial</li>
                    <li>• Multiple solution evaluation process</li>
                    <li>• Long-term architectural thinking over quick fixes</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg p-6 text-white">
                  <h3 className="font-semibold mb-4">Code Quality Metrics</h3>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span>Component Complexity</span>
                      <span className="text-green-400">↓ 60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State Management</span>
                      <span className="text-green-400">Centralized</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prop Drilling</span>
                      <span className="text-green-400">Eliminated</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Test Coverage</span>
                      <span className="text-green-400">↑ 40%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-red-900 mb-3">Anti-Patterns Avoided</h3>
                  <div className="space-y-2 text-sm text-red-800">
                    <div>❌ Data ownership in temporary components</div>
                    <div>❌ Uncontrolled component mounting/unmounting</div>
                    <div>❌ API calls in presentational components</div>
                    <div>❌ Implicit state dependencies</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-yellow-900 mb-3">Next Challenge Preview</h3>
                  <p className="text-yellow-800 text-sm">
                    Context API solved the data persistence issue, but revealed a race condition: 
                    users occasionally see flashcard answers before questions due to component 
                    rendering timing.
                  </p>
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
            Part 1 of 5 - Rabbit Holes Series
          </div>
          <Link
            href={'/rabbit-holes-to-rabbit-holes-technical'}
            className="bg-green-600 text-white px-1 py-1 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Rabbit Holes → Business Value: Technical Series
          </Link>
          <Link 
            href="https://i.witus.online/flashlearnai-b" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-1 py-1 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
          >
            Try Live Demo
          </Link>
          <Link
            href={'/blog/rabbit-holes-to-rabbit-holes-part-02-technical'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Next: Race Condition Debugging →
          </Link>
        </div>
      </footer>
    </article>
  );
}