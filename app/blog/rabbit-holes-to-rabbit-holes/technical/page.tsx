// components/blog/RabbitHolesLandingTechnical.tsx
'use client';

import { useState } from 'react';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { CodeBlock } from '@/components/ui/CodeBlock';
import Link from 'next/link';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TechnicalTabs = ({ activeTab, onTabChange }: TabsProps) => (
  <div className="border-b border-gray-200 mb-8">
    <nav className="-mb-px flex space-x-8">
      {[
        { id: 'overview', label: 'Series Overview' },
        { id: 'architecture', label: 'Architecture Evolution' },
        { id: 'skills', label: 'Technical Skills Matrix' },
        { id: 'metrics', label: 'Performance & ROI' },
        { id: 'implementation', label: 'Code Examples' }
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

export default function RabbitHolesLandingTechnical() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      {/* Technical Header */}
      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-mono">
            SERIES
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
            React Architecture
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
            Product Development
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm font-semibold">
            Business Strategy
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rabbit Holes → Business Value: Technical Series
        </h1>
        <p className="text-xl text-gray-600 font-mono">
          Systematic approach to architectural evolution and business-focused development
        </p>
        <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500 font-mono">
          <span>5 parts • 67 min total</span>
          <span>React • Architecture • Business</span>
          <span>Beginner → Advanced</span>
        </div>
      </header>

      {/* Live Demo Section */}
      {/* <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-400 font-mono text-sm ml-4">series-overview.tsx</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-green-400 font-mono text-sm">✓ Production Ready</span>
            <a 
              href="https://i.witus.online/flashlearnai-b"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Live Demo →
            </a>
          </div>
        </div>
        <VideoPlaceholder 
          title="Technical Architecture Evolution Demo"
          description="From architectural debt to business value through systematic development"
          darkMode={true}
        />
      </section> */}

      {/* Audio Deep Dive */}
      {/* <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-400 font-mono text-sm ml-4">technical-deep-dive.mp3</span>
        </div>
        <AudioPlayer 
          title="Architecture Evolution: Technical Deep Dive"
          description="Systematic approach to transforming technical challenges into business opportunities"
          duration="12:34"
          darkMode={true}
        />
      </section> */}

      {/* Technical Tabs */}
      <TechnicalTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                📚
              </span>
              Complete Series Technical Breakdown
            </h2>

            <div className="grid lg:grid-cols-5 gap-4">
              {[
                {
                  id: 1,
                  title: "Shuffle → Architecture",
                  subtitle: "Context API Implementation",
                  techStack: "React, Context API",
                  complexity: "Beginner",
                  href: "/blog/rabbit-holes-to-rabbit-holes/technical/part-01"
                },
                {
                  id: 2, 
                  title: "Race Conditions",
                  subtitle: "Component Lifecycle",
                  techStack: "React, Debugging",
                  complexity: "Intermediate",
                  href: "blog/rabbit-holes-to-rabbit-holes/technical/part-02"
                },
                {
                  id: 3,
                  title: "State Machines",
                  subtitle: "Edge Case Elimination", 
                  techStack: "State Design",
                  complexity: "Intermediate",
                  href: "blog/rabbit-holes-to-rabbit-holes/technical/part-03"
                },
                {
                  id: 4,
                  title: "UX Innovation",
                  subtitle: "Constraint-Driven Design",
                  techStack: "UX, Psychology",
                  complexity: "Advanced",
                  href: "blog/rabbit-holes-to-rabbit-holes/technical/part-04"
                },
                {
                  id: 5,
                  title: "Business Logic",
                  subtitle: "Growth Engineering",
                  techStack: "Auth, Analytics",
                  complexity: "Advanced",
                  href: "blog/rabbit-holes-to-rabbit-holes/technical/part-05"
                }
              ].map((part) => (
                <div key={part.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-mono">
                      PART {part.id}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      part.complexity === 'Beginner' ? 'bg-green-100 text-green-800' :
                      part.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {part.complexity}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{part.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{part.subtitle}</p>
                  <p className="text-xs text-gray-500 mb-3 font-mono">{part.techStack}</p>
                  <a 
                    href={part.href}
                    className="text-blue-600 font-medium text-sm hover:text-blue-700"
                  >
                    Read Technical Breakdown →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                🏗️
              </span>
              Architecture Evolution Timeline
            </h2>

            <div className="bg-gray-900 text-white rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Technical Transformation Journey</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
                  <div>
                    <Link
                      href="/blog/rabbit-holes-to-rabbit-holes/technical/part-01"
                      >
                      <div className="text-white font-semibold">
                          Part 1: Component ownership chaos
                      </div>
                      <div className="text-gray-400 text-sm">Shuffle bug → Context API → Clean architecture</div>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-4"></div>
                  <Link
                    href="/blog/rabbit-holes-to-rabbit-holes/technical/part-02"
                    >
                    <div>
                      <div className="text-white font-semibold">Part 2: Race condition mastery</div>
                      <div className="text-gray-400 text-sm">Component lifecycle → State lifting → Coordination</div>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-4"></div>
                  <Link
                    href="/blog/rabbit-holes-to-rabbit-holes/technical/part-03"
                    >
                    <div>
                      <div className="text-white font-semibold">Part 3: State machine architecture</div>
                      <div className="text-gray-400 text-sm">Edge cases → Explicit states → Bulletproof apps</div>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-amber-500 rounded-full mr-4"></div>
                  <div>
                    <Link
                      href="/blog/rabbit-holes-to-rabbit-holes/technical/part-04"
                      >
                      <div className="text-white font-semibold">Part 4: Constraint-driven innovation</div>
                      <div className="text-gray-400 text-sm">Technical limits → UX features → User value</div>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-4"></div>
                  <Link
                    href="/blog/rabbit-holes-to-rabbit-holes/technical/part-05"
                    >
                    <div>
                      <div className="text-white font-semibold">Part 5: Business-focused development</div>
                      <div className="text-gray-400 text-sm">Auth boundaries → Growth engineering → Sustainable value</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Architectural Patterns</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Context API for state management</li>
                  <li>• State machine design patterns</li>
                  <li>• Component lifecycle optimization</li>
                  <li>• Defense-in-depth authorization</li>
                  <li>• Progressive enhancement</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Integration</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Feature-driven development</li>
                  <li>• Conversion optimization</li>
                  <li>• Growth engineering practices</li>
                  <li>• Monetization architecture</li>
                  <li>• Analytics integration</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ⚡
              </span>
              Technical Skills Development Matrix
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend Engineering</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">React Context API</span>
                    <span className="text-green-600 font-mono text-sm">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Component Architecture</span>
                    <span className="text-green-600 font-mono text-sm">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">State Management</span>
                    <span className="text-blue-600 font-mono text-sm">Expert</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Race Condition Debugging</span>
                    <span className="text-green-600 font-mono text-sm">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">State Machines</span>
                    <span className="text-purple-600 font-mono text-sm">Intermediate</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">UX Engineering</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Constraint-driven Design</span>
                    <span className="text-purple-600 font-mono text-sm">Intermediate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Learning Science</span>
                    <span className="text-green-600 font-mono text-sm">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Conversion Psychology</span>
                    <span className="text-blue-600 font-mono text-sm">Expert</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">User Feedback Loops</span>
                    <span className="text-green-600 font-mono text-sm">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Progressive Enhancement</span>
                    <span className="text-purple-600 font-mono text-sm">Intermediate</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Engineering</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Authentication Architecture</span>
                    <span className="text-green-600 font-mono text-sm">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Growth Engineering</span>
                    <span className="text-blue-600 font-mono text-sm">Expert</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">A/B Testing</span>
                    <span className="text-purple-600 font-mono text-sm">Intermediate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Monetization Strategy</span>
                    <span className="text-green-600 font-mono text-sm">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Feature Gating</span>
                    <span className="text-green-600 font-mono text-sm">Advanced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                📊
              </span>
              Performance Metrics & Business Impact
            </h2>

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Development ROI</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Investment</span>
                    <span className="text-red-600 font-mono">$4,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Return</span>
                    <span className="text-green-600 font-mono">$15,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ROI</span>
                    <span className="text-blue-600 font-bold">340%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payback</span>
                    <span className="text-purple-600 font-mono">1.4 months</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversion rate</span>
                    <span className="text-green-600 font-bold">+23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Session duration</span>
                    <span className="text-blue-600 font-bold">+31%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Feature adoption</span>
                    <span className="text-purple-600 font-bold">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">User satisfaction</span>
                    <span className="text-orange-600 font-bold">4.8/5</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Quality</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bug reports</span>
                    <span className="text-green-600 font-bold">↓ 90%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Support tickets</span>
                    <span className="text-blue-600 font-bold">↓ 85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Edge cases</span>
                    <span className="text-purple-600 font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Race conditions</span>
                    <span className="text-orange-600 font-bold">0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reading time</span>
                    <span className="text-green-600 font-mono">67 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Core skills</span>
                    <span className="text-blue-600 font-bold">15+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Code examples</span>
                    <span className="text-purple-600 font-bold">25+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="text-orange-600 font-mono">↗ Progressive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                💻
              </span>
              Key Implementation Patterns
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Context API Pattern (Part 1)</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Clean Context API implementation
const StudySessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startSession = useCallback(async (listId) => {
    const response = await fetch('/api/study/sessions', {
      method: 'POST',
      body: JSON.stringify({ listId })
    });
    
    const data = await response.json();
    const shuffledCards = shuffleArray(data.flashcards);
    
    setSessionId(data.sessionId);
    setFlashcards(shuffledCards);
    setCurrentIndex(0);
  }, []);

  return (
    <StudySessionContext.Provider value={{
      sessionId,
      flashcards,
      currentIndex,
      startSession
    }}>
      {children}
    </StudySessionContext.Provider>
  );
};`}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">State Machine Pattern (Part 3)</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Explicit state machine design
type SessionState = 'setup' | 'active' | 'complete' | 'error';

const StudySessionManager = () => {
  const { currentState } = useStudySession();

  switch (currentState) {
    case 'setup':
      return <StudySessionSetup />;
      
    case 'active':
      return <StudyCard />;
      
    case 'complete':
      return <StudySessionResults />;
      
    case 'error':
      return <ErrorScreen />;
      
    default:
      console.error(\`Unknown state: \${currentState}\`);
      return <StudySessionSetup />;
  }
};`}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">UX Innovation Pattern (Part 4)</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Constraint-driven UX improvement
const CardFeedback = () => {
  const { lastCardResult, showNextCard } = useStudySession();
  
  const messages = {
    correct: ["Awesome!", "You got it!", "Great job!"],
    incorrect: ["Keep trying!", "Almost there!"]
  };
  
  const message = messages[lastCardResult][
    Math.floor(Math.random() * messages[lastCardResult].length)
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={\`w-full h-80 rounded-lg text-white p-6 \${
        lastCardResult === 'correct' ? 'bg-green-500' : 'bg-red-500'
      }\`}
    >
      <CheckCircleIcon className="h-16 w-16 mb-4" />
      <p className="text-3xl font-bold mb-6">{message}</p>
      <button onClick={showNextCard}>Next Card</button>
    </motion.div>
  );
};`}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Logic Pattern (Part 5)</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Multi-layer authorization
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const { studyDirection } = await request.json();

  // Business rule enforcement
  if (studyDirection === 'back-to-front' && !session?.user) {
    return NextResponse.json({ 
      error: 'Authentication required for reverse study',
      featureGated: true
    }, { status: 401 });
  }

  // IDOR prevention
  const list = await db.collection('flashcard_sets').findOne({
    _id: new ObjectId(listId),
    $or: [
      { isPublic: true },
      { userId: session?.user?.id }
    ]
  });

  if (!list) {
    return NextResponse.json({ 
      error: 'Access denied' 
    }, { status: 403 });
  }

  return NextResponse.json({ flashcards });
}`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Start Guide */}
      <section className="bg-gray-900 rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Start Guide</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-3">Technical Foundation</h3>
            <p className="text-gray-300 text-sm mb-4">Start with architecture and debugging fundamentals</p>
            <Link
              href="/blog/rabbit-holes-to-rabbit-holes/technical/part-01"
              className="text-green-400 font-mono text-sm hover:text-green-300">
              → Begin with Part 1
            </Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">UX Engineering</h3>
            <p className="text-gray-300 text-sm mb-4">Jump to constraint-driven design and innovation</p>
            <Link
              href="/blog/rabbit-holes-to-rabbit-holes/technical/part-04"
              className="text-purple-400 font-mono text-sm hover:text-purple-300">
              → Jump to Part 4
            </Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Business Focus</h3>
            <p className="text-gray-300 text-sm mb-4">Focus on growth engineering and monetization</p>
            <Link
              href="/blog/rabbit-holes-to-rabbit-holes/technical/part-05"
              className="text-blue-400 font-mono text-sm hover:text-blue-300">
              → Start with Part 5
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}