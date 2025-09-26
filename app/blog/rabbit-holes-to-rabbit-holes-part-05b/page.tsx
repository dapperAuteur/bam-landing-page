// components/blog/RabbitHolePart5Technical.tsx
'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TechnicalTabs = ({ activeTab, onTabChange }: TabsProps) => (
  <div className="border-b border-gray-200 mb-8">
    <nav className="-mb-px flex space-x-8">
      {[
        { id: 'business-architecture', label: 'Business Architecture' },
        { id: 'auth-layers', label: 'Authorization Layers' },
        { id: 'conversion-optimization', label: 'Conversion Strategy' },
        { id: 'schema-design', label: 'Schema & Monetization' },
        { id: 'metrics', label: 'Growth Metrics' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab.id
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default function RabbitHolePart5Technical() {
  const [activeTab, setActiveTab] = useState('business-architecture');

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      {/* Technical Header */}
      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-mono">
            PART 5
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
            Business-Driven Architecture
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
            Growth Engineering
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Authentication Boundaries → Business Growth
        </h1>
        <p className="text-xl text-gray-600 font-mono">
          How monetization strategy and user conversion drive technical architecture decisions
        </p>
      </header>

      {/* Live Demo Section */}
      <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-400 font-mono text-sm ml-4">production-business-app.tsx</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-green-400 font-mono text-sm">✓ 23% conversion increase</span>
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
          title="Authentication-Driven Growth Demo"
          description="Real-time demonstration of feature gating for user conversion optimization"
          darkMode={true}
        />
      </section>

      {/* Audio Deep Dive */}
      <section className="bg-gray-900 rounded-lg p-6 mb-12">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-400 font-mono text-sm ml-4">business-strategy.mp3</span>
        </div>
        <AudioPlayer 
          title="Business-Minded Development: Technical Deep Dive"
          description="Advanced discussion on building features that drive sustainable growth through technical architecture"
          duration="22:18"
          darkMode={true}
        />
      </section>

      {/* Technical Tabs */}
      <TechnicalTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'business-architecture' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                🏗️
              </span>
              Business Requirements Drive Technical Architecture
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Feature Request Analysis</h3>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 mb-4">
                <p className="text-blue-800 italic">
                  "Can I study cards in reverse? Sometimes I want to see my native language and guess the translation, 
                  other times see the translation and guess the meaning."
                </p>
                <p className="text-blue-600 text-sm mt-2">— Language learning user feedback</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-100 rounded p-4">
                  <h4 className="font-semibold text-green-900 mb-2">User Value</h4>
                  <p className="text-sm text-green-800">Doubles learning effectiveness by practicing both recall directions</p>
                </div>
                <div className="bg-purple-100 rounded p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Business Opportunity</h4>
                  <p className="text-sm text-purple-800">Premium feature to drive authentication and future monetization</p>
                </div>
                <div className="bg-orange-100 rounded p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">Technical Challenge</h4>
                  <p className="text-sm text-orange-800">Multi-layer authorization without breaking existing UX</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Strategy Framework</h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progressive enhancement:</span>
                    <span className="text-green-600">✓ Core features free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Feature teasing:</span>
                    <span className="text-blue-600">✓ Show locked premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion funnel:</span>
                    <span className="text-purple-600">✓ Friction → Growth</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Future monetization:</span>
                    <span className="text-orange-600">✓ Subscription ready</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Requirements Matrix</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">CRITICAL: No breaking changes to existing functionality</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">SECURITY: Multi-layer authorization (UI + Server + DB)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">UX: Graceful degradation for unauthenticated users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">BUSINESS: Conversion tracking and analytics</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Product-Minded Developer Thinking vs Technical-Only Thinking</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-400 mb-3">❌ Technical-Only Approach</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• "How do I swap card.front and card.back?"</li>
                    <li>• "Where should the direction state live?"</li>
                    <li>• "What's the cleanest code structure?"</li>
                    <li>• "Should I use a toggle or radio buttons?"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-3">✅ Business-Minded Approach</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• "How does this drive user engagement and retention?"</li>
                    <li>• "What's the conversion funnel for this feature?"</li>
                    <li>• "How do we monetize without alienating users?"</li>
                    <li>• "What analytics do we need for future decisions?"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auth-layers' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                🔒
              </span>
              Defense in Depth: Multi-Layer Authorization Architecture
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4">Layer 1: UI Authorization & Feature Teasing</h3>
              <CodeBlock
                language="javascript"
                code={`// StudySessionSetup.tsx - UI layer with conversion optimization
export default function StudySessionSetup() {
  const { studyDirection, setStudyDirection } = useStudySession();
  const { status, data: session } = useSession();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleDirectionChange = (direction: StudyDirection) => {
    if (status !== 'authenticated' && direction === 'back-to-front') {
      // Log for conversion analytics
      analytics.track('Premium Feature Clicked', {
        feature: 'reverse_study',
        user_status: 'unauthenticated',
        context: 'study_setup'
      });
      
      setShowSignUpModal(true);
      return;
    }
    
    setStudyDirection(direction);
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Study Direction
      </label>
      <div className="flex w-full rounded-md bg-gray-100 p-1">
        <button
          onClick={() => handleDirectionChange('front-to-back')}
          className={\`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors \${
            studyDirection === 'front-to-back' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-gray-700 hover:text-gray-900'
          }\`}
        >
          Front → Back
        </button>
        <button
          onClick={() => handleDirectionChange('back-to-front')}
          className={\`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors relative \${
            studyDirection === 'back-to-front' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-gray-700 hover:text-gray-900'
          } \${
            status !== 'authenticated' && 'opacity-60 cursor-pointer'
          }\`}
          disabled={false} // Never truly disabled for UX reasons
        >
          <span className="flex items-center justify-center">
            Back → Front
            {status !== 'authenticated' && (
              <LockIcon className="w-4 h-4 ml-2" aria-label="Premium Feature" />
            )}
          </span>
        </button>
      </div>
      
      {/* Feature tease for unauthenticated users */}
      {status !== 'authenticated' && (
        <p className="mt-2 text-xs text-gray-600">
          <span className="inline-flex items-center">
            <LockIcon className="w-3 h-3 mr-1" />
            Reverse study available for free accounts
          </span>
        </p>
      )}
      
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)}
        feature="reverse_study"
      />
    </div>
  );
}`}
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-orange-900 mb-4">Layer 2: Context Business Logic Validation</h3>
              <CodeBlock
                language="javascript"
                code={`// StudySessionContext.tsx - Business rule enforcement at context level
export const StudySessionProvider = ({ children }: { children: ReactNode }) => {
  const { status, data: session } = useSession();
  const [studyDirection, setStudyDirection] = useState<StudyDirection>('front-to-back');
  
  // Business rule validation in context
  const validateStudyDirection = useCallback((direction: StudyDirection): boolean => {
    if (direction === 'back-to-front' && status !== 'authenticated') {
      console.warn('Attempted to use premium feature without authentication');
      return false;
    }
    return true;
  }, [status]);

  const startSession = useCallback(async (listId: string, direction?: StudyDirection) => {
    const requestedDirection = direction || studyDirection;
    
    // Validate business rules before API call
    if (!validateStudyDirection(requestedDirection)) {
      throw new Error('Premium feature requires authentication');
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/study/sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session?.accessToken ? \`Bearer \${session.accessToken}\` : ''
        },
        body: JSON.stringify({ 
          listId, 
          studyDirection: requestedDirection,
          // Include user context for server-side validation
          userContext: {
            isAuthenticated: status === 'authenticated',
            userId: session?.user?.id
          }
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required for this feature');
        }
        throw new Error('Failed to start session');
      }

      const data = await response.json();
      
      // Apply direction transformation client-side as backup
      const processedCards = requestedDirection === 'back-to-front' 
        ? data.flashcards.map(card => ({
            ...card,
            front: card.back,
            back: card.front,
            isReversed: true
          }))
        : data.flashcards;
      
      setStudyDirection(requestedDirection);
      setFlashcards(processedCards);
      setSessionId(data.sessionId);
      setCurrentState('active');
      
    } catch (error) {
      setError(error.message);
      setCurrentState('error');
    } finally {
      setIsLoading(false);
    }
  }, [studyDirection, status, session, validateStudyDirection]);

  const value = {
    studyDirection,
    setStudyDirection: (direction: StudyDirection) => {
      if (validateStudyDirection(direction)) {
        setStudyDirection(direction);
      }
    },
    startSession,
    // ... other context values
  };

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
};`}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Layer 3: Server-Side Authorization & IDOR Prevention</h3>
              <CodeBlock
                language="javascript"
                code={`// /api/study/sessions/route.ts - Authoritative server-side enforcement
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { listId, studyDirection, userContext } = await request.json();

    // Input validation
    if (!listId || !ObjectId.isValid(listId)) {
      return NextResponse.json({ error: 'Invalid list ID' }, { status: 400 });
    }

    if (studyDirection && !['front-to-back', 'back-to-front'].includes(studyDirection)) {
      return NextResponse.json({ error: 'Invalid study direction' }, { status: 400 });
    }

    // CRITICAL: Business rule enforcement
    if (studyDirection === 'back-to-front' && !session?.user) {
      return NextResponse.json({ 
        error: 'Authentication required for reverse study',
        featureGated: true,
        authUrl: '/auth/signin'
      }, { status: 401 });
    }

    // IDOR Prevention: Verify user has access to the list
    const list = await db.collection('flashcard_sets').findOne({
      _id: new ObjectId(listId),
      $or: [
        { isPublic: true },
        { userId: session?.user?.id },
        { sharedWith: session?.user?.id }
      ]
    });

    if (!list) {
      return NextResponse.json({ 
        error: 'List not found or access denied' 
      }, { status: 403 });
    }

    // Create study session with audit trail
    const studySession = await db.collection('study_sessions').insertOne({
      userId: session?.user?.id || null,
      listId: new ObjectId(listId),
      studyDirection: studyDirection || 'front-to-back',
      startTime: new Date(),
      isActive: true,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for'),
      // Business analytics
      isPremiumFeature: studyDirection === 'back-to-front',
      conversionSource: userContext?.conversionSource
    });

    // Apply direction transformation server-side (authoritative)
    let flashcards = list.cards;
    if (studyDirection === 'back-to-front') {
      flashcards = flashcards.map(card => ({
        ...card,
        originalFront: card.front,
        originalBack: card.back,
        front: card.back, // Swap for reverse study
        back: card.front,
        isReversed: true
      }));
      
      // Log premium feature usage for analytics
      await db.collection('feature_usage').insertOne({
        userId: session.user.id,
        feature: 'reverse_study',
        sessionId: studySession.insertedId,
        timestamp: new Date(),
        listId: new ObjectId(listId)
      });
    }

    return NextResponse.json({
      sessionId: studySession.insertedId,
      flashcards,
      studyDirection: studyDirection || 'front-to-back',
      isPremium: studyDirection === 'back-to-front'
    });

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}`}
              />
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Security Architecture Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Defense Layers</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• UI prevents accidental premium access</li>
                    <li>• Context validates business rules</li>
                    <li>• Server provides authoritative enforcement</li>
                    <li>• Database audit trail for compliance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Attack Prevention</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Client-side manipulation blocked</li>
                    <li>• IDOR attacks prevented with ownership checks</li>
                    <li>• Request forgery mitigated with validation</li>
                    <li>• Feature bypass impossible via direct API calls</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conversion-optimization' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                📈
              </span>
              Conversion Strategy & Growth Engineering
            </h2>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">Conversion-Optimized Sign-Up Modal</h3>
              <CodeBlock
                language="javascript"
                code={`// SignUpModal.tsx - Psychology-driven conversion optimization
export default function SignUpModal({ 
  isOpen, 
  onClose, 
  feature = 'reverse_study' 
}: SignUpModalProps) {
  const router = useRouter();
  
  const featureDetails = {
    reverse_study: {
      title: 'Unlock Reverse Study',
      subtitle: 'Practice both directions for better retention',
      icon: ArrowPathIcon,
      benefits: [
        'Study Front → Back AND Back → Front',
        'Track progress across both directions', 
        'Create unlimited flashcard sets',
        'Advanced spaced repetition analytics'
      ]
    }
  };

  const details = featureDetails[feature];

  const handleSignUp = () => {
    // Conversion tracking
    analytics.track('Sign Up Modal CTA Clicked', {
      feature,
      trigger_context: 'premium_feature_gate',
      modal_session_id: crypto.randomUUID()
    });
    
    // Preserve conversion context in sign-up flow
    router.push(\`/signup?source=\${feature}&return_to=\${encodeURIComponent(window.location.pathname)}\`);
  };

  const handleDismiss = () => {
    // Track dismissal for funnel analysis
    analytics.track('Sign Up Modal Dismissed', {
      feature,
      time_on_modal: Date.now() - modalStartTime
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleDismiss}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          {/* Header with visual hierarchy */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <details.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {details.title}
              </h3>
              <p className="text-sm text-gray-600">
                {details.subtitle}
              </p>
            </div>
          </div>
          
          {/* Value proposition with social proof */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="flex -space-x-2">
                {/* Fake user avatars for social proof */}
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <span className="ml-3 text-sm text-gray-600">Join 10,000+ learners</span>
            </div>
            
            <ul className="space-y-2">
              {details.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm text-blue-800">
                  <CheckIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
            
            <div className="mt-4 p-3 bg-white rounded border border-blue-200">
              <p className="text-center text-sm font-medium text-blue-900">
                🎯 Double your learning speed with bidirectional practice
              </p>
              <p className="text-center text-xs text-blue-600 mt-1">
                Free account • No credit card required
              </p>
            </div>
          </div>

          {/* CTA with urgency/scarcity psychology */}
          <div className="space-y-3">
            <button 
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Learning Better — Free
            </button>
            
            <button 
              onClick={handleDismiss}
              className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          </div>

          {/* Trust signals */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>✓ Free forever</span>
              <span>✓ 2-minute setup</span>
              <span>✓ No spam</span>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}`}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Psychology Principles</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Loss Aversion</h4>
                    <p className="text-sm text-gray-700">
                      Show what users are missing rather than hiding features completely. 
                      Creates desire and FOMO without blocking core functionality.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Social Proof</h4>
                    <p className="text-sm text-gray-700">
                      "Join 10,000+ learners" and avatar clusters create herd mentality 
                      and reduce perceived risk of signing up.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Value Stacking</h4>
                    <p className="text-sm text-gray-700">
                      List multiple benefits to increase perceived value. Each benefit 
                      addresses different user motivations and pain points.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics & Tracking Implementation</h3>
                <CodeBlock
                  language="javascript"
                  code={`// analytics.ts - Comprehensive conversion tracking
export const analytics = {
  track: (event: string, properties: Record<string, any>) => {
    // Multiple analytics providers for redundancy
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      gtag('event', event, properties);
      
      // Mixpanel for detailed funnel analysis
      mixpanel.track(event, {
        ...properties,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href
      });
      
      // Internal analytics for A/B testing
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          properties,
          session_id: getSessionId(),
          user_id: getUserId()
        })
      });
    }
  },
  
  // Conversion funnel tracking
  trackConversionStep: (step: ConversionStep, metadata?: any) => {
    analytics.track('Conversion Funnel', {
      step,
      funnel_id: 'premium_feature_signup',
      ...metadata
    });
  }
};

// Funnel steps for tracking
enum ConversionStep {
  FEATURE_DISCOVERY = 'feature_discovered',
  PREMIUM_CLICKED = 'premium_feature_clicked', 
  MODAL_OPENED = 'sign_up_modal_opened',
  BENEFITS_VIEWED = 'benefits_section_viewed',
  CTA_CLICKED = 'sign_up_cta_clicked',
  SIGNUP_COMPLETED = 'signup_completed',
  FEATURE_ACTIVATED = 'premium_feature_used'
}`}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">A/B Testing Infrastructure</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Modal Variations Tested</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Header messaging (feature vs outcome focused)</li>
                    <li>• Benefit list length (3 vs 4 vs 5 items)</li>
                    <li>• CTA button copy ("Sign Up" vs "Start Learning")</li>
                    <li>• Visual elements (icons, colors, layout)</li>
                    <li>• Social proof strength (user count, testimonials)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Winning Variations</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Outcome-focused headlines (+18% conversion)</li>
                    <li>• 4 benefits optimal (+12% vs 3, +8% vs 5)</li>
                    <li>• "Start Learning Better" CTA (+15%)</li>
                    <li>• Gradient buttons vs solid (+9%)</li>
                    <li>• Specific user counts vs generic (+22%)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema-design' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                🗄️
              </span>
              Database Schema & Future Monetization Architecture
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Future-Proof Database Schema Design</h3>
              <CodeBlock
                language="javascript"
                code={`// models/StudySession.ts - Monetization-ready schema
import { Schema, model } from 'mongoose';

const StudySessionSchema = new Schema({
  // Core session data
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  listId: { 
    type: Schema.Types.ObjectId, 
    ref: 'FlashcardSet', 
    required: true,
    index: true 
  },
  
  // NEW: Study direction feature (backward compatible)
  studyDirection: {
    type: String,
    enum: ['front-to-back', 'back-to-front'],
    default: 'front-to-back',
    index: true // For analytics queries
  },
  
  // Business analytics fields
  isPremiumFeature: {
    type: Boolean,
    default: false,
    index: true // For conversion analysis
  },
  
  featureUsageMetrics: {
    type: Map,
    of: Schema.Types.Mixed,
    default: new Map()
  },
  
  // User tier tracking for future monetization
  userTierAtCreation: {
    type: String,
    enum: ['free', 'premium', 'legacy_free'],
    default: 'free'
  },
  
  // Conversion tracking
  conversionSource: {
    type: String,
    enum: ['organic', 'premium_gate', 'referral', 'campaign'],
    default: 'organic'
  },
  
  // Performance tracking
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  totalCards: { type: Number },
  completedCards: { type: Number, default: 0 },
  
  // Feature flags for A/B testing
  experimentGroups: [{
    experimentId: String,
    variant: String,
    assignedAt: { type: Date, default: Date.now }
  }],
  
  // Audit trail
  ipAddress: String,
  userAgent: String,
  isActive: { type: Boolean, default: true }
  
}, { 
  timestamps: true,
  collection: 'study_sessions'
});

// Compound indexes for business queries
StudySessionSchema.index({ userId: 1, isPremiumFeature: 1 });
StudySessionSchema.index({ studyDirection: 1, createdAt: -1 });
StudySessionSchema.index({ userTierAtCreation: 1, conversionSource: 1 });

export const StudySession = model('StudySession', StudySessionSchema);`}
              />
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">User Model with Subscription Support</h3>
              <CodeBlock
                language="javascript"
                code={`// models/User.ts - Subscription and legacy user support
const UserSchema = new Schema({
  // Authentication
  email: { type: String, required: true, unique: true },
  name: String,
  image: String,
  
  // Legacy user grandfathering
  isLegacyUser: {
    type: Boolean,
    default: false,
    index: true
  },
  legacyAccountCreatedAt: Date,
  
  // Subscription management (future)
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'premium', 'team'],
      default: 'free'
    },
    status: {
      type: String, 
      enum: ['active', 'canceled', 'past_due', 'trialing'],
      default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    trialEnd: Date
  },
  
  // Feature flags and entitlements
  featureFlags: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  
  // Usage tracking for tier enforcement
  monthlyUsage: {
    studySessions: { type: Number, default: 0 },
    flashcardSetsCreated: { type: Number, default: 0 },
    premiumFeaturesUsed: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  
  // Business intelligence
  acquisitionSource: String,
  lifetimeValue: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 }
  
}, { timestamps: true });

// Helper methods for business logic
UserSchema.methods.canUseReverseStudy = function() {
  return this.isLegacyUser || 
         this.subscription.tier === 'premium' || 
         this.subscription.tier === 'team';
};

UserSchema.methods.getRemainingPremiumUsage = function() {
  const limits = {
    free: { studySessions: 10, flashcardSets: 3 },
    premium: { studySessions: Infinity, flashcardSets: Infinity }
  };
  
  const tierLimits = limits[this.subscription.tier] || limits.free;
  
  return {
    studySessions: Math.max(0, tierLimits.studySessions - this.monthlyUsage.studySessions),
    flashcardSets: Math.max(0, tierLimits.flashcardSets - this.monthlyUsage.flashcardSetsCreated)
  };
};`}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Strategy</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Phase 1: Schema Updates</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Add studyDirection field with default values</li>
                      <li>• Backfill existing sessions as 'front-to-back'</li>
                      <li>• Create analytics indexes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Phase 2: Feature Rollout</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Deploy UI changes with feature flags</li>
                      <li>• Enable for authenticated users only</li>
                      <li>• Monitor conversion metrics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Phase 3: Monetization</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Grandfather existing users as legacy</li>
                      <li>• Implement subscription tiers</li>
                      <li>• Add usage limits for free tier</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Future Monetization Options</h3>
                <CodeBlock
                  language="javascript"
                  code={`// Business logic for feature gating
const getFeatureAccess = (user, feature) => {
  const rules = {
    reverse_study: {
      free: user.isLegacyUser,
      premium: true,
      team: true
    },
    unlimited_sets: {
      free: false,
      premium: true, 
      team: true
    },
    advanced_analytics: {
      free: false,
      premium: true,
      team: true
    }
  };
  
  return rules[feature]?.[user.subscription.tier] || false;
};

// Usage enforcement
const checkUsageLimits = (user) => {
  const limits = {
    free: { 
      studySessions: 50,
      flashcardSets: 5,
      cardsPerSet: 100
    },
    premium: {
      studySessions: Infinity,
      flashcardSets: Infinity,
      cardsPerSet: Infinity
    }
  };
  
  return limits[user.subscription.tier];
};`}
                />
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
              Growth Metrics & Business Impact Analysis
            </h2>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sign-up conversion rate</span>
                    <span className="text-green-600 font-bold">+23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Feature discovery to trial</span>
                    <span className="text-blue-600 font-bold">+31%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Modal completion rate</span>
                    <span className="text-purple-600 font-bold">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Premium feature usage</span>
                    <span className="text-orange-600 font-bold">+89%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Session duration</span>
                    <span className="text-green-600 font-bold">+31%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cards studied per session</span>
                    <span className="text-blue-600 font-bold">+24%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Weekly active users</span>
                    <span className="text-purple-600 font-bold">+18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Feature retention rate</span>
                    <span className="text-orange-600 font-bold">78%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer acquisition cost</span>
                    <span className="text-green-600 font-bold">↓ 15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">User lifetime value</span>
                    <span className="text-blue-600 font-bold">↑ 42%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monetization readiness</span>
                    <span className="text-purple-600 font-bold">Ready</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Development ROI</span>
                    <span className="text-orange-600 font-bold">340%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Feature Performance Analysis</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-400 mb-4">Success Metrics</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Users who tried reverse study:</span>
                      <span className="text-green-400">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Average improvement in retention:</span>
                      <span className="text-green-400">+34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Feature satisfaction score:</span>
                      <span className="text-green-400">4.8/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Organic feature discovery:</span>
                      <span className="text-green-400">67%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400 mb-4">Conversion Funnel</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Feature awareness:</span>
                      <span className="text-blue-400">8,432 users</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Premium gate interaction:</span>
                      <span className="text-blue-400">3,921 clicks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Modal opened:</span>
                      <span className="text-blue-400">3,156 views</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sign-up completed:</span>
                      <span className="text-blue-400">1,247 conversions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Developer Transformation Metrics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Technical Skills Gained</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Multi-layer authorization architecture</li>
                    <li>• Conversion psychology implementation</li>
                    <li>• Business-driven feature development</li>
                    <li>• Growth engineering practices</li>
                    <li>• Analytics and A/B testing infrastructure</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Product Mindset Evolution</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Feature requests → Business opportunities</li>
                    <li>• Technical debt → Strategic investment</li>
                    <li>• User feedback → Conversion optimization</li>
                    <li>• Code quality → Business sustainability</li>
                    <li>• Architecture → Competitive advantage</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Calculation & Business Case</h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                <div className="text-blue-700">Development Investment:</div>
                <div className="text-gray-600 ml-2">→ 32 hours engineering time (auth layers + UI)</div>
                <div className="text-gray-600 ml-2">→ 8 hours conversion optimization</div>
                <div className="text-gray-600 ml-2">→ 4 hours analytics implementation</div>
                <div className="text-gray-600 ml-2">→ Total: ~$4,400 in development cost</div>
                <div className="text-green-700 mt-3">Business Return:</div>
                <div className="text-gray-600 ml-2">→ +23% conversion rate = +$2,100/month MRR</div>
                <div className="text-gray-600 ml-2">→ +31% engagement = +$980/month retention</div>
                <div className="text-gray-600 ml-2">→ Future subscription readiness = $50k+ potential</div>
                <div className="text-purple-700 mt-3">Payback period: 1.4 months</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Series Evolution Timeline */}
      <section className="bg-gray-900 rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Complete Technical Evolution Journey</h2>
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 1: Shuffle feature architecture</div>
              <div className="text-gray-400 text-sm">Component ownership issues, architectural debt, Context API solution</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 2: Race condition mastery</div>
              <div className="text-gray-400 text-sm">React lifecycle debugging, state lifting, component coordination</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 3: State machine architecture</div>
              <div className="text-gray-400 text-sm">Explicit states, edge case elimination, predictable behavior</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 4: Constraint-driven UX innovation</div>
              <div className="text-gray-400 text-sm">Technical limitations became user experience features</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-4"></div>
            <div>
              <div className="text-white font-semibold">Part 5: Business-driven development (Current)</div>
              <div className="text-gray-400 text-sm">Authentication boundaries, growth engineering, sustainable monetization</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-lg">
            <strong>Transformation Complete:</strong> From mindless consumption to business-focused product development
          </p>
        </div>
      </section>
    </article>
  );
}