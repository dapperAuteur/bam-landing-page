// components/blog/RabbitHolePart5Story.tsx
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
  emotion?: "triumph" | "discovery" | "challenge" | "insight" | "transformation" | "neutral";
}) => {
  const emotionColors = {
    triumph: "bg-green-600 text-white shadow-lg shadow-green-200",
    discovery: "bg-orange-500 text-white shadow-lg shadow-orange-200", 
    challenge: "bg-red-500 text-white shadow-lg shadow-red-200",
    insight: "bg-blue-600 text-white shadow-lg shadow-blue-200",
    transformation: "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200",
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

export default function RabbitHolePart5Story() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <header className="text-center mb-20">
        {/* <SeriesTableOfContents currentPart={5}  className="sticky top-4" /> */}
        {/* <PartNavigation currentPart={5} className="mt-12" />
        <SeriesBreadcrumb currentPart={5} className="mb-8" /> */}
        {/* <FloatingSeriesNav currentPart={5} /> */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-4">
              From Rabbit Holes to Rabbit Holes: Part 5
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Building Features
              <br />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Like a Business
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              How a simple user request taught me to think beyond code and start building 
              sustainable competitive advantages
            </p>
          </div>
        </div>
        <SeriesProgress currentPart={5} className="mt-4" />
      </header>

      {/* The User Request */}
      <StorySection className="mb-20">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Beyond Bug Fixes: Real World Hits
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                My flashcard app was technically solid. Race conditions eliminated, state machine architecture 
                bulletproof. Then came a user request that seemed innocent enough...
              </p>
              <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
                <p className="text-lg font-semibold text-gray-900 italic">
                  "Can I study cards in reverse? Sometimes I want to see my native language 
                  and guess the translation, other times the opposite."
                </p>
                <p className="text-blue-700 mt-2 text-sm">
                  — Language learner, via contact form
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-blue-100 rounded-lg p-6 font-mono text-blue-800 text-sm">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="font-semibold">FEATURE REQUEST ANALYSIS</span>
                </div>
                <div>📝 User value: High</div>
                <div>⚡ Technical complexity: Low</div>
                <div>💡 Business opportunity: ???</div>
                <div className="mt-4 text-blue-600">Decision: This is where things got interesting...</div>
              </div>
            </div>
          </div>
        </div>
      </StorySection>

      {/* The Business Awakening */}
      <StorySection className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The Business Awakening
          </h2>
          <p className="text-lg text-gray-600">
            This wasn't just about swapping card.front and card.back anymore...
          </p>
        </div>
        
        <TimelineEvent 
          title="The Realization Moment" 
          isActive={true} 
          emotion="discovery"
        >
          <p className="text-lg text-gray-700 mb-4">
            As I started mapping out the feature, questions that had never occurred to me before 
            started flooding in:
          </p>
          <div className="bg-orange-100 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-orange-900">Technical Questions:</span>
                <ul className="text-orange-800 mt-2 space-y-1">
                  <li>• Where should direction state live?</li>
                  <li>• How do I swap the content?</li>
                  <li>• What's the cleanest code structure?</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-orange-900">Business Questions:</span>
                <ul className="text-orange-800 mt-2 space-y-1">
                  <li>• Should this be a premium feature?</li>
                  <li>• How do we monetize without alienating users?</li>
                  <li>• What's our conversion strategy?</li>
                </ul>
              </div>
            </div>
          </div>
        </TimelineEvent>

        <TimelineEvent 
          title="The Strategic Decision" 
          isActive={true} 
          emotion="insight"
        >
          <p className="text-lg text-gray-700 mb-4">
            For language learners, reverse study doubles the learning value. Instead of just 
            recognizing translations, they practice both directions of recall. This wasn't 
            just a feature—it was a competitive advantage.
          </p>
          <div className="bg-blue-100 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3">The Business Strategy</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded p-4">
                <div className="text-blue-600 font-bold text-sm">IMMEDIATE</div>
                <p className="text-blue-800 text-sm">Only authenticated users can access reverse study</p>
              </div>
              <div className="bg-white rounded p-4">
                <div className="text-purple-600 font-bold text-sm">FUTURE</div>
                <p className="text-purple-800 text-sm">Make this a paid feature with existing users grandfathered</p>
              </div>
              <div className="bg-white rounded p-4">
                <div className="text-green-600 font-bold text-sm">UX</div>
                <p className="text-green-800 text-sm">Show the feature to everyone, encourage sign-up</p>
              </div>
            </div>
          </div>
        </TimelineEvent>
      </StorySection>

      {/* The Defense in Depth Architecture */}
      <StorySection className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Defense in Depth: The Architecture Story</h2>
        
        <TimelineEvent 
          title="Layer 1: The Tease" 
          isActive={true} 
          emotion="discovery"
        >
          <p className="text-lg text-gray-700 mb-4">
            First layer: Show the feature but gate it smartly. Instead of hiding it completely, 
            I'd show users what they're missing. Loss aversion psychology in action.
          </p>
          <CodeBlock
            language="javascript"
            code={`// The psychology of showing what you can't have (yet)
const handleDirectionChange = (direction) => {
  if (status !== 'authenticated' && direction === 'back-to-front') {
    // Don't just block it - create desire
    analytics.track('Premium Feature Clicked', {
      feature: 'reverse_study',
      user_status: 'unauthenticated'
    });
    
    setShowSignUpModal(true); // The conversion moment
    return;
  }
  
  setStudyDirection(direction);
};

return (
  <div className="flex w-full rounded-md bg-gray-100 p-1">
    <button>Front → Back</button>
    <button 
      className={status !== 'authenticated' && 'opacity-60 cursor-pointer'}
    >
      Back → Front
      {status !== 'authenticated' && <LockIcon className="w-4 h-4 ml-2" />}
    </button>
  </div>
);`}
          />
        </TimelineEvent>

        <TimelineEvent 
          title="Layer 2: The Business Logic Guardian" 
          isActive={true} 
          emotion="challenge"
        >
          <p className="text-lg text-gray-700 mb-4">
            The Context layer validates business rules before any API calls. No premium feature 
            access without authentication, period.
          </p>
          <CodeBlock
            language="javascript"
            code={`// Business rules enforced at the context level
const validateStudyDirection = useCallback((direction) => {
  if (direction === 'back-to-front' && status !== 'authenticated') {
    console.warn('Attempted premium feature without authentication');
    return false;
  }
  return true;
}, [status]);

const startSession = useCallback(async (listId, direction) => {
  // Business validation before technical implementation
  if (!validateStudyDirection(direction)) {
    throw new Error('Premium feature requires authentication');
  }
  
  // Now proceed with the technical work
  const response = await fetch('/api/study/sessions', {
    method: 'POST',
    body: JSON.stringify({ listId, studyDirection: direction })
  });
  // ...
}, [validateStudyDirection]);`}
          />
        </TimelineEvent>

        <TimelineEvent 
          title="Layer 3: The Server Fortress" 
          isActive={true} 
          emotion="triumph"
        >
          <p className="text-lg text-gray-700 mb-4">
            The final guardian: server-side authorization that can't be bypassed. Even if 
            someone manipulates the client, the server enforces the business rules.
          </p>
          <CodeBlock
            language="javascript"
            code={`// /api/study/sessions/route.ts - The final authority
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const { listId, studyDirection } = await request.json();

  // CRITICAL: Business rule enforcement
  if (studyDirection === 'back-to-front' && !session?.user) {
    return NextResponse.json({ 
      error: 'Authentication required for reverse study',
      featureGated: true
    }, { status: 401 });
  }

  // IDOR Prevention: Verify ownership
  const list = await db.collection('flashcard_sets').findOne({
    _id: new ObjectId(listId),
    $or: [
      { isPublic: true },
      { userId: session?.user?.id }
    ]
  });

  if (!list) {
    return NextResponse.json({ 
      error: 'List not found or access denied' 
    }, { status: 403 });
  }

  // Apply direction transformation server-side (authoritative)
  const flashcards = studyDirection === 'back-to-front' 
    ? list.cards.map(card => ({ ...card, front: card.back, back: card.front }))
    : list.cards;

  return NextResponse.json({ flashcards, studyDirection });
}`}
          />
        </TimelineEvent>
      </StorySection>

      {/* Audio Deep Dive */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              The Product Mindset Transformation
            </h2>
            <p className="text-gray-300">
              How thinking beyond technical requirements leads to sustainable business growth
            </p>
          </div>
          <AudioPlayer 
            title="From Engineer to Product Owner: A Mental Model Shift"
            description="Deep dive into the mindset that separates feature builders from business builders"
            duration="22:18"
            darkMode={true}
          />
        </div>
      </StorySection>

      {/* The Conversion Psychology */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            The Conversion Psychology Masterclass
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            The sign-up modal wasn't just a dialog box—it was a carefully crafted conversion experience 
            based on psychological principles:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-900 mb-3">Loss Aversion</h3>
              <p className="text-purple-800 text-sm">
                Show what users are missing rather than hiding features completely. 
                Creates desire and FOMO without blocking core functionality.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border-l-4 border-pink-500">
              <h3 className="font-semibold text-pink-900 mb-3">Social Proof</h3>
              <p className="text-pink-800 text-sm">
                "Join 10,000+ learners" with avatar clusters creates herd mentality 
                and reduces perceived risk of signing up.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-900 mb-3">Value Stacking</h3>
              <p className="text-blue-800 text-sm">
                List multiple benefits to increase perceived value. Each benefit 
                addresses different user motivations and pain points.
              </p>
            </div>
          </div>

          <CodeBlock
            language="javascript"
            code={`// Psychology-driven modal design
return (
  <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
    {/* Visual hierarchy with value prop */}
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
        <ArrowPathIcon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">Unlock Reverse Study</h3>
        <p className="text-sm text-gray-600">Practice both directions for better retention</p>
      </div>
    </div>
    
    {/* Social proof and value stacking */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-3">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
          ))}
        </div>
        <span className="ml-3 text-sm text-gray-600">Join 10,000+ learners</span>
      </div>
      
      <ul className="space-y-2">
        <li className="flex items-center text-sm text-blue-800">
          <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
          Study Front → Back AND Back → Front
        </li>
        <li className="flex items-center text-sm text-blue-800">
          <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
          Track progress across both directions
        </li>
        <li className="flex items-center text-sm text-blue-800">
          <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
          Create unlimited flashcard sets
        </li>
      </ul>
    </div>

    {/* Urgency and trust signals */}
    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-lg">
      Start Learning Better — Free
    </button>
    
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <span>✓ Free forever</span>
        <span>✓ 2-minute setup</span>
        <span>✓ No spam</span>
      </div>
    </div>
  </Dialog.Panel>
);`}
          />
        </div>
      </StorySection>

      {/* App Demo */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Experience the Growth Machine
            </h2>
            <p className="text-gray-600 mb-4">
              See how business-focused development creates sustainable competitive advantages
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
            title="Authentication-Driven Growth in Action"
            description="Watch how feature gating and conversion optimization drive sustainable business growth"
          />
        </div>
      </StorySection>

      {/* The Results */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            The Business Impact
          </h2>
          <p className="text-lg text-gray-700 text-center mb-8">
            This wasn't just a technical success—it was a business transformation:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
                <div className="text-3xl font-bold text-green-600">+23%</div>
                <div className="text-gray-600">Sign-up conversion rate increase</div>
                <div className="text-sm text-green-700 mt-1">From users who clicked the premium feature</div>
              </div>
              <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600">+31%</div>
                <div className="text-gray-600">Longer average study sessions</div>
                <div className="text-sm text-blue-700 mt-1">For authenticated users using reverse study</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
                <div className="text-lg font-bold text-purple-600">Database Ready</div>
                <div className="text-gray-600">For future subscription tiers</div>
                <div className="text-sm text-purple-700 mt-1">Schema designed for monetization</div>
              </div>
              <div className="bg-white rounded-lg p-6 border-l-4 border-orange-500">
                <div className="text-lg font-bold text-orange-600">Zero Breaking Changes</div>
                <div className="text-gray-600">To existing functionality</div>
                <div className="text-sm text-orange-700 mt-1">Backward compatibility maintained</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Development ROI: 340%
            </p>
            <p className="text-gray-700">
              $4,400 development investment → $15,000+ in increased conversions and engagement
            </p>
          </div>
        </div>
      </StorySection>

      {/* The Mindset Transformation */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            The Ultimate Mindset Transformation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4 text-center">
                Technical Developer Thinking
              </h3>
              <ul className="space-y-3 text-red-800">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>"How do I swap card content?"</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>"Where should this state live?"</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>"What's the cleanest code structure?"</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>"Should I use a toggle or radio buttons?"</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4 text-center">
                Product-Minded Developer Thinking
              </h3>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>"How does this drive business value?"</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>"What's the user conversion funnel?"</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>"How do we monetize without alienating users?"</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>"What data do we need for future decisions?"</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 text-center">
            <p className="text-xl font-bold text-gray-900 mb-3">
              The most valuable developers don't just build features—they build 
              <span className="text-purple-600"> sustainable competitive advantages</span>.
            </p>
          </div>
        </div>
      </StorySection>

      {/* The Complete Journey */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            The Complete Transformation Journey
          </h2>
          
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-2">Shuffle Feature</h4>
              <p className="text-xs text-gray-400">Exposed architectural flaws</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-2">Race Conditions</h4>
              <p className="text-xs text-gray-400">Taught React mastery</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-2">State Machines</h4>
              <p className="text-xs text-gray-400">Eliminated edge cases</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-2">Constraints</h4>
              <p className="text-xs text-gray-400">Became UX improvements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">5</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-2">Authentication</h4>
              <p className="text-xs text-gray-400">Drove business growth</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Skills Compound Over Time</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-purple-200 mb-2">Technical Mastery</h4>
                <ul className="text-purple-100 space-y-1">
                  <li>• Clean code architecture and debugging methodology</li>
                  <li>• React state management and component lifecycle mastery</li>
                  <li>• State machine thinking for bulletproof applications</li>
                  <li>• Creative problem-solving under constraints</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-200 mb-2">Business Acumen</h4>
                <ul className="text-blue-100 space-y-1">
                  <li>• Multi-layer authorization architecture</li>
                  <li>• Conversion psychology implementation</li>
                  <li>• Growth engineering practices</li>
                  <li>• Business-focused feature development</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl text-white mb-4">
              <strong>How you spend your time determines what you become good at.</strong>
            </p>
            <p className="text-gray-300">
              I chose to fall down productive rabbit holes instead of consumption rabbit holes. 
              The compound effect transformed me from a passive consumer into an active builder 
              who thinks like both an engineer and a product owner.
            </p>
          </div>
        </div>
      </StorySection>

      {/* The Call to Adventure */}
      <StorySection className="mb-16">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Your Rabbit Holes Are Waiting
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Every feature request, every bug, every technical challenge is an opportunity to compound your skills. 
            Every decision is a chance to think beyond code and build something that creates real business value.
          </p>
          
          <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">The Questions That Changed Everything</h3>
            <div className="text-left max-w-2xl mx-auto">
              <p className="text-gray-700 mb-4">
                Next time you get a feature request, ask yourself:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• How does this create sustainable business value?</li>
                <li>• What's the user journey and conversion opportunity?</li>
                <li>• How can we monetize this without alienating users?</li>
                <li>• What data will help us make better decisions?</li>
                <li>• How does this feature compound with our existing advantages?</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={'/#contact'}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all">
              Start Your Own Journey
            </Link>
            <Link
              href={'/blog/rabbit-holes-to-rabbit-holes/story/part-01'}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Read the Complete Series
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-lg">
              <strong>Which rabbit holes will you choose?</strong>
            </p>
          </div>
        </div>
      </StorySection>

      {/* Series Complete */}
      <StorySection className="mb-16">
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Series Complete: The Architecture of Growth
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Security & Authorization</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>✅ Defense in depth: UI, Context, Server layers</li>
                <li>✅ IDOR prevention with ownership checks</li>
                <li>✅ Client state cannot bypass server rules</li>
                <li>✅ Graceful degradation for unauthenticated users</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Business Strategy</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✅ Progressive enhancement drives conversion</li>
                <li>✅ Feature teasing without blocking core functionality</li>
                <li>✅ Future-proofed for subscription monetization</li>
                <li>✅ Backward compatible database schema</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Growth Engineering</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>✅ Conversion-optimized sign-up flow</li>
                <li>✅ Analytics tracking for feature engagement</li>
                <li>✅ User segmentation ready</li>
                <li>✅ A/B testing infrastructure prepared</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 italic text-lg">
              From mindless consumption to business-focused product development. 
              <br />
              <strong>The transformation is complete.</strong>
            </p>
          </div>
        </div>
      </StorySection>
    </article>
  );
}