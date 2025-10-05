// components/blog/RabbitHolePart5.tsx
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { SeriesProgress } from '@/components/blog/SeriesNavigation';
import Link from 'next/link';

export default function RabbitHolePart5() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-6">
        {/* <SeriesTableOfContents currentPart={5}  className="sticky top-4" /> */}
        {/* <PartNavigation currentPart={5} className="mt-12" />
        <SeriesBreadcrumb currentPart={5} className="mb-8" /> */}
        {/* <FloatingSeriesNav currentPart={5} /> */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
            From Rabbit Holes to Rabbit Holes: Part 5
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Building Features Like a Business
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          How authentication boundaries and monetization strategy shape feature architecture
        </p>
        <SeriesProgress currentPart={5} className="mt-4" />
      </header>

      {/* App Demo Section */}
      <section className="bg-blue-50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Experience the Business-Focused Solution
          </h2>
          <p className="text-gray-600 mb-4">
            See how authentication boundaries drive growth while maintaining user experience
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
          title="Authentication-Driven Growth in Action"
          description="Watch how feature gating drives conversions while preserving UX"
        />
      </section>

      {/* Audio Discussion */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Business-Minded Development Deep Dive
          </h2>
          <p className="text-gray-600">
            How to think like both an engineer and a product owner
          </p>
        </div>
        <AudioPlayer 
          title="From Code to Business Value"
          description="Technical discussion on building features that drive sustainable growth"
          duration="22:18"
        />
      </section>

      {/* Beyond Bug Fixes */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Beyond Bug Fixes: Real-World Requirements</h2>
        <div className="prose prose-lg prose-gray max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            After solving the race condition with feedback screens in <a href="/blog/rabbit-holes-part-4" className="text-blue-600 hover:text-blue-800">Part 4</a>, 
            my flashcard app was technically solid. But real applications aren't just about elegant code—they're about business sustainability.
          </p>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
            <p className="text-lg font-semibold text-green-900">
              A user requested: "Can I study cards in reverse? Sometimes I want to see my native language 
              and guess the translation, other times the opposite."
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            This rabbit hole would teach me how authentication boundaries, feature flags, and monetization 
            strategy fundamentally shape software architecture.
          </p>
        </div>
      </section>

      {/* The Feature */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Feature: Study Direction</h2>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Requirements</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Immediate</h4>
              <p className="text-blue-800 text-sm">Only authenticated users can access reverse study</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Future</h4>
              <p className="text-purple-800 text-sm">Make this a paid feature with existing users grandfathered in</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">UX</h4>
              <p className="text-green-800 text-sm">Unauthenticated users should see the feature but be encouraged to sign up</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">The Value Proposition</h3>
          <p className="text-yellow-800">
            For language learners, reverse study doubles the value. Instead of just recognizing translations, 
            they can practice both directions of recall: native → foreign and foreign → native.
          </p>
        </div>
      </section>

      {/* Architecture Decision */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Architecture Decision: Defense in Depth</h2>
        
        <p className="text-lg text-gray-700">
          I implemented three layers of protection to ensure security while optimizing for conversion:
        </p>

        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Layer 1: UI Teasing</h3>
            <CodeBlock
              language="javascript"
              code={`// StudySessionSetup.tsx - Show but gate the feature
export default function StudySessionSetup() {
  const { studyDirection, setStudyDirection } = useStudySession();
  const { status } = useSession();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleDirectionChange = (direction) => {
    if (status !== 'authenticated' && direction === 'back-to-front') {
      setShowSignUpModal(true); // Encourage sign-up
      Logger.log(LogContext.STUDY, "Unauthenticated user clicked premium feature");
    } else {
      setStudyDirection(direction);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-gray-300">
        Study Direction
      </label>
      <div className="flex w-full rounded-md bg-gray-700 p-1">
        <button
          onClick={() => handleDirectionChange('front-to-back')}
          className={studyDirection === 'front-to-back' ? 'bg-blue-600 text-white' : 'text-gray-300'}
        >
          Front → Back
        </button>
        <button
          onClick={() => handleDirectionChange('back-to-front')}
          className={clsx(
            studyDirection === 'back-to-front' ? 'bg-blue-600 text-white' : 'text-gray-300',
            status !== 'authenticated' && 'opacity-60 cursor-not-allowed'
          )}
        >
          Back → Front
          {status !== 'authenticated' && <LockIcon className="w-4 h-4 ml-2" />}
        </button>
      </div>
    </div>
  );
}`}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Layer 2: Context Business Logic</h3>
            <CodeBlock
              language="javascript"
              code={`// StudySessionContext.tsx - Server communication
const startSession = useCallback(async (listId, direction) => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/study/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        listId, 
        studyDirection: direction // Send preference to server
      })
    });

    const data = await response.json();
    const shuffledCards = shuffleArray(data.flashcards);
    
    setStudyDirection(direction);
    setFlashcards(shuffledCards);
    // ... other state updates
  } catch (err) {
    // ... error handling
  }
}, []);`}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Layer 3: Server-Side Authorization</h3>
            <CodeBlock
              language="javascript"
              code={`// /api/study/sessions/route.ts - Business rule enforcement
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const { listId, studyDirection } = await request.json();

  // Verify user owns the list (IDOR prevention)
  const list = await db.collection('flashcard_sets').findOne({
    _id: new ObjectId(listId),
    $or: [
      { isPublic: true },
      { userId: session?.user?.id }
    ]
  });

  if (!list) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Business rule: Reverse study requires authentication
  if (studyDirection === 'back-to-front' && !session?.user) {
    return NextResponse.json({ 
      error: 'Authentication required for reverse study' 
    }, { status: 401 });
  }

  // Create session with validated parameters
  const studySession = await db.collection('study_sessions').insertOne({
    userId: session?.user?.id || null,
    listId: new ObjectId(listId),
    studyDirection: studyDirection || 'front-to-back',
    startTime: new Date(),
    isActive: true
  });

  const flashcards = studyDirection === 'back-to-front' 
    ? list.cards.map(card => ({ ...card, front: card.back, back: card.front }))
    : list.cards;

  return NextResponse.json({
    sessionId: studySession.insertedId,
    flashcards,
    studyDirection
  });
}`}
            />
          </div>
        </div>
      </section>

      {/* Sign-up Modal */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Conversion-Optimized Sign-up Modal</h2>
        
        <CodeBlock
          language="javascript"
          code={`// SignUpModal.tsx - Convert friction into growth
export default function SignUpModal({ onClose }) {
  const router = useRouter();

  return (
    <Dialog open={true} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <ArrowPathIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Unlock Reverse Study
              </h3>
              <p className="text-sm text-gray-600">
                Practice both directions for better retention
              </p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 mr-2" />
                Study Front → Back AND Back → Front
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 mr-2" />
                Track progress across both directions
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 mr-2" />
                Create unlimited flashcard sets
              </li>
            </ul>
            <div className="mt-3 text-center">
              <p className="text-xs text-blue-600">
                Create a free account to unlock this and other powerful study tools!
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={onClose} className="px-3 py-2 text-gray-900 border rounded-md">
              Maybe Later
            </button>
            <button 
              onClick={() => router.push('/signup')}
              className="px-3 py-2 bg-blue-600 text-white rounded-md"
            >
              Sign Up for Free
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}`}
        />
      </section>

      {/* Database Schema */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Database Schema: Future-Proofing</h2>
        
        <CodeBlock
          language="javascript"
          code={`// StudySession model update
const StudySessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listId: { type: Schema.Types.ObjectId, ref: 'List', required: true },
  
  // New field - optional for backward compatibility
  studyDirection: {
    type: String,
    enum: ['front-to-back', 'back-to-front'],
    default: 'front-to-back'
  },
  
  startTime: { type: Date, default: Date.now },
  // ... other fields
}, { timestamps: true });`}
        />

        <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Future Monetization Ready</h3>
          <p className="text-purple-800 mb-3">
            When ready to make this a paid feature:
          </p>
          <CodeBlock
            language="javascript"
            code={`// Future enhancement - check subscription status
const canUseReverse = status === 'authenticated' && 
  (user.isLegacyUser || user.subscription.tier === 'premium');`}
          />
        </div>
      </section>

      {/* Why This Architecture Matters */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Why This Architecture Matters</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progressive Enhancement</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Unauthenticated users get the core experience</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Authentication unlocks additional value</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>No blocking of core functionality</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security by Design</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>UI shows locked state clearly</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Context validates business rules</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Server enforces authorization</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Business Impact</h2>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Measurable Results</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                <div className="text-2xl font-bold text-green-600">23%</div>
                <div className="text-sm text-gray-600">increase in sign-up conversions from study page</div>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <div className="text-2xl font-bold text-blue-600">31%</div>
                <div className="text-sm text-gray-600">longer average study sessions for authenticated users</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                <div className="text-lg font-bold text-purple-600">Database Ready</div>
                <div className="text-sm text-gray-600">for future subscription tiers</div>
              </div>
              <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                <div className="text-lg font-bold text-orange-600">Zero Breaking Changes</div>
                <div className="text-sm text-gray-600">for existing functionality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Final Lesson */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Think Like a Product Owner</h2>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-lg text-gray-700 mb-6">
            This rabbit hole taught me to think beyond technical implementation:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Technical Developer Thinking</h3>
              <ul className="space-y-2 text-red-800 text-sm">
                <li>• "How do I swap card content?"</li>
                <li>• "Where should this state live?"</li>
                <li>• "What's the cleanest code structure?"</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Product-Minded Developer Thinking</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• "How does this drive business value?"</li>
                <li>• "What's the user conversion funnel?"</li>
                <li>• "How do we monetize without alienating users?"</li>
                <li>• "What data do we need for future decisions?"</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
          <p className="text-lg font-semibold text-blue-900">
            The most valuable developers don't just build features—they build 
            <strong> sustainable competitive advantages</strong>.
          </p>
        </div>
      </section>

      {/* Transformation Complete */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">The Transformation Complete</h2>
        
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            From Mindless Scrolling to Strategic Building
          </h3>
          
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-sm">Shuffle Feature</h4>
              <p className="text-xs text-gray-600">Exposed architectural flaws</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-sm">Race Conditions</h4>
              <p className="text-xs text-gray-600">Taught React mastery</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-sm">State Machines</h4>
              <p className="text-xs text-gray-600">Eliminated edge cases</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="font-semibold text-sm">Constraints</h4>
              <p className="text-xs text-gray-600">Became UX improvements</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">5</span>
              </div>
              <h4 className="font-semibold text-sm">Authentication</h4>
              <p className="text-xs text-gray-600">Drove business growth</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              <strong>How you spend your time determines what you become good at.</strong>
            </p>
            <p className="text-gray-600">
              I chose to fall down productive rabbit holes instead of consumption rabbit holes. 
              The compound effect transformed me from a passive consumer into an active builder 
              who thinks like both an engineer and a product owner.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900">Your Rabbit Holes Are Waiting</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Every feature request, every bug, every technical challenge is an opportunity to compound your skills. 
          Which rabbit holes will you choose?
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href={'/#contact'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Start Your Own Journey
          </Link>
          {/* <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Subscribe for Updates
          </button> */}
          <Link
            href={'/blog/rabbit-holes-to-rabbit-holes-part-01-professional'}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-50 transition-colors">
            Read the Complete Series
          </Link>
        </div>
      </section>

      {/* Code Quality Review */}
      <section className="bg-gray-900 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Code Quality & Business Review</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3">Security & Authorization</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ Defense in depth: UI, Context, Server layers</li>
              <li>✅ IDOR prevention with ownership checks</li>
              <li>✅ Client state cannot bypass server rules</li>
              <li>✅ Graceful degradation for unauthenticated users</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Business Strategy</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ Progressive enhancement drives conversion</li>
              <li>✅ Feature teasing without blocking core functionality</li>
              <li>✅ Future-proofed for subscription monetization</li>
              <li>✅ Backward compatible database schema</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Growth Engineering</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✅ Conversion-optimized sign-up flow</li>
              <li>✅ Analytics tracking for feature engagement</li>
              <li>✅ User segmentation ready</li>
              <li>✅ A/B testing infrastructure prepared</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 italic text-lg">
            Series Complete: From random consumption to business-focused product development
          </p>
        </div>
      </section>
    </article>
  );
}