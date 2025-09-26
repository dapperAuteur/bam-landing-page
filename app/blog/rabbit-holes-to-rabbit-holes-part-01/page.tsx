import { CodeBlock } from '@/components/blog/CodeBlock'

const shuffleArrayCode = `
// /src/lib/utils/arrayUtils.ts
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
};
`

const handleStartSessionCode = `
// In StudySessionSetup.tsx (initial buggy version)
const handleStartSession = async () => {
  const shuffledCards = shuffleArray(flashcardSet.flashcards);
  onStartSession(sessionId, shuffledCards);
};
`

const studySessionContextCode = `
// /src/contexts/StudySessionContext.tsx
interface StudySessionState {
  sessionId: string | null;
  flashcards: Flashcard[];
  currentIndex: number;
  isComplete: boolean;
  // ... other state

  // Actions
  startSession: (listId: string) => Promise<void>;
  recordCardResult: (isCorrect: boolean, timeSeconds: number) => Promise<void>;
  resetSession: () => void;
}

export const StudySessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  // ... other state

  const startSession = useCallback(async (listId: string) => {
    // Fetch data, shuffle it, set all state in one place
    const response = await fetch('/api/study/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  const value = {
    sessionId, flashcards, currentIndex, isComplete,
    startSession, recordCardResult, resetSession
  };

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
};
`

const studySessionSetupCode = `
// StudySessionSetup.tsx - now just UI
export default function StudySessionSetup() {
  const { startSession, isLoading } = useStudySession();

  const handleStartSession = async () => {
    if (!selectedListId) return;
    await startSession(selectedListId); // Context handles everything
  };

  return (
    // Just UI, no complex state logic
    <div>
      {/* list selection UI */}
      <button onClick={handleStartSession}>Start Studying</button>
    </div>
  );
}
`

export default function BlogPost() {
  return (
    <article className="prose prose-lg mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">
        From Rabbit Holes to Rabbit Holes:</h1> <h1 className="text-3xl font-bold mb-4">Part 1 - The Shuffle That Broke Everything</h1>
      <p className="text-lg italic text-gray-600">
        A developer's journey from mindless scrolling to meaningful problem-solving
      </p>

      <h2 className="text-3xl font-bold mt-12 mb-4">The Realization</h2>
      <p>
        I had an uncomfortable realization the other day while catching myself three videos deep in a "people falling down" compilation on YouTube at 2 AM. I was thinking about how I spend my time, and more importantly, what I'm getting good at.
      </p>
      <p>
        Do I want to be the world's most efficient consumer of random content? Or do I want to build things that matter?
      </p>
      <p className="font-semibold">
        The math is simple but harsh: How you spend your time determines what you become good at. I was spending hours perfecting my ability to mindlessly scroll, getting dopamine hits from content I'd forget in minutes.
      </p>
      <p>
        I decided to redirect that rabbit hole energy somewhere more productive. Instead of falling down endless social media rabbit holes, I'd dive deep into the rabbit holes that start with feature implementations and lead to architectural discoveries, bug hunts, and better code.
      </p>
      <p>
        This is my developer superhero origin story. It started with what I thought was a simple feature for my Flashlearn AI app: randomizing study cards.
      </p>

      <h2 className="text-3xl font-bold mt-12 mb-4">The "Simple" Feature</h2>
      <p>
        Flashlearn AI is my language learning app where users create flashcard sets and study them. The feature request seemed straightforward: <strong>"Shuffle the cards before each study session so users don't memorize the order."</strong>
      </p>
      <p>
        Easy, right? Just randomize an array. I've done this a hundred times.
      </p>
      <p>
        My first instinct was to keep the logic clean and reusable. I created a utility function using the Fisher-Yates shuffle algorithm:
      </p>
      <CodeBlock code={shuffleArrayCode} language="typescript" />
      <p>
        <strong>Why a separate utility function?</strong> Three reasons:
      </p>
      <ol className="list-decimal list-inside">
        <li><strong>Single Responsibility Principle</strong> - The shuffle logic has one job</li>
        <li><strong>Reusability</strong> - Other features might need array shuffling</li>
        <li><strong>Testability</strong> - Pure functions are easy to unit test</li>
      </ol>
      <p>
        I imported this into my <code>StudySessionSetup</code> component and called it when the user clicked "Start Session":
      </p>
      <CodeBlock code={handleStartSessionCode} language="typescript" />
      <p>
        I tested it. The cards shuffled perfectly. I shipped it.
      </p>
      <p>
        <strong>Two days later, users started reporting a weird bug.</strong>
      </p>

      <p>
        <strong>The Bug That Exposed Everything</strong>
      </p>

      <p>Users would start a study session, see the cards were properly randomized, then suddenly the app would "refresh" and show the original, unshuffled order. They'd lose their progress and have to start over.</p>

      <p>I captured a video of the bug in action:</p>

      <p>*[Video comig soon: Study session starts → Cards are shuffled → Screen refreshes → Back to setup with original card order]*</p>

      <p>This wasn't just annoying—it was breaking the core user experience. But the real problem was deeper than the bug itself. This "simple" shuffle feature had exposed a critical flaw in my app's architecture.</p>

      <p>
        <strong>The Root Cause: A State Management Anti-Pattern</strong>
      </p>

      <p>After hours of debugging, I found the culprit. My component architecture had a fundamental problem:</p>

      <ol>
        <li>1. <code>StudySession</code> component manages the overall session state</li>
        <li>2. <code>StudySessionSetup</code>   (a child component) fetches and holds the flashcard data</li>
        <li>3. When <code>StudySessionSetup</code>  triggers <code>onStartSession</code> the parent updates its state</li>
        <li>4. The parent re-renders and <b>unmounts</b> <code>StudySessionSetup</code></li>
        <li>5. Later, when the session needs to reset or encounters an error, the parent <b>re-mounts</b><code>StudySessionSetup</code> </li>
        <li>6. The freshly mounted <code>StudySessionSetup</code>  fetches the data again from the API</li>
        <li>7. <b>Fresh API data = original, unshuffled order</b></li>
      </ol>

      <p>The problem wasn't the shuffle function—it was that the component responsible for data fetching was getting destroyed and recreated, losing all the work the shuffle function had done.</p>

      <p>This is a classic React anti-pattern: <b>letting temporary child components own critical data.</b></p>

      <p><strong>Three Ways to Fix It (And Why I Chose the Hard One)</strong></p>

      <p>I had three options:</p>

      <h3>Option 1: Lift State Up</h3>
      <p>Move the data fetching from <code>StudySessionSetup</code> to its parent <code>StudySession</code>. Simple, quick fix.</p>

      <p><strong>Pros:</strong> Follows React best practices, minimal code changes</p>

      <p><strong>Cons:</strong> Makes the parent component more complex, doesn't scale well</p>

      <h3>Option 2: Component Composition</h3>
      <p>Create a new parent container that manages both the setup and session components.</p>

      <p><strong>Pros:</strong> Clear separation of concerns, each component stays focused</p>

      <p><strong>Cons:</strong> Adds another layer, requires more architectural planning</p>
      
      <h3>Option 3: Context API</h3>
      <p>Create a centralized state management context for the entire study feature.</p>

      <p><strong>Pros:</strong> True single source of truth, highly scalable, completely decoupled components</p>

      <p><strong>Cons:</strong> More upfront complexity, requires learning Context API patterns</p>

      <p><b>I chose Option 3.</b> Here's why.</p>

      <p><strong>The Long-Term Thinking</strong></p>

      <p>I could have taken the quick fix with Option 1. It would have solved the immediate problem and gotten users back to studying. But I'm not building this app for just today—I'm building it for the long haul.</p>

      <p>The Context API provided the most robust foundation for future features:
        <ol>
          <li>Multiple components could share session state without prop drilling</li>
          <li>The architecture would be predictable and maintainable
          </li>
          <li>New features wouldn't risk breaking existing ones</li>
          <li>Other developers could easily understand the data flow</li>
        </ol>
      </p>
      
      <p>More importantly, <b>this was exactly the kind of rabbit hole I wanted to fall down.</b> Instead of mindlessly consuming content, I was deep in a problem that would make me a better architect and developer.</p>

      <h2>The Context API Solution</h2>

      <p>Here's the core of what I built:</p>

      <CodeBlock code={studySessionContextCode} language="typescript" />

      <p>Now my components became simple and focused:</p>

      <CodeBlock code={studySessionSetupCode} language="typescript" />

      <h2>The Fix Worked (But Revealed Another Bug)</h2>

      <p>The Context API refactor completely solved the shuffle bug. Users could now study randomized cards without any mysterious "refreshes." The architecture was cleaner, more maintainable, and ready for future features.</p>

      <p>But here's the thing about falling down productive rabbit holes: <b>fixing one problem often reveals another.</b></p>

      <p>As soon as I deployed the Context API solution, I discovered a much more subtle bug. Users were reporting that sometimes they'd see the *answer* to a flashcard before they could even read the <i>question</i>.</p>

      <p>This was a race condition in my UI state management—and it led to the next rabbit hole in my developer journey.</p>

      <h2>The Transformation</h2>

      <p>Three months ago, I was spending hours perfecting my ability to consume other people's content. Now I spend that same energy diving deep into problems that make me better at my craft.</p>

      <p>The shuffle feature rabbit hole taught me:</p>

      <ul>
        <li>-<strong>Clean code principles</strong> (utility functions, pure functions)</li>
        <li>-<strong>React architecture patterns</strong> (Context API vs alternatives)  </li>
        <li>-<strong>State management debugging</strong> (component lifecycle, data flow)</li>
        <li>-<strong>Long-term technical decision making</strong> (choosing harder but more scalable solutions)</li>
      </ul>

      <p>More importantly, it showed me what happens when you redirect rabbit hole energy toward building instead of consuming.</p>

      <p><b>In the next post, I'll dive into the race condition bug that the Context API refactor revealed, and how fixing architecture problems often uncovers UI timing issues you never knew existed.</b></p>

      ---

      <p><b>Want to see more technical deep dives and architectural decisions? Follow me on [BlueSky/LinkedIn] for updates when new posts in this series drop. Next up: "When Fixing One Bug Reveals Another" - the race condition that taught me about React's rendering lifecycle.</b></p>

      ---

      <h2>Code Quality & Security Review</h2>

      <b>Clean Code Principles Demonstrated:</b>
      <ul>
        <li>- ✅ Pure functions with single responsibility</li>
        <li>- ✅ Immutable data patterns (array copying)</li>
        <li>- ✅ Descriptive naming conventions</li>
        <li>- ✅ Separation of concerns (UI vs logic)</li>
      </ul>

      <b>Security Considerations:</b>
      <ul>
        <li>- ✅ No data mutation side effects</li>
        <li>- ✅ Proper error boundaries planned</li>
        <li>- ✅ Context API prevents prop drilling vulnerabilities</li>
        <li>- 🔄 API authorization checks needed (covered in later posts)</li>
      </ul>

      <b>Architecture Benefits:</b>
      <ul>
        <li>- ✅ Single source of truth for session state</li>
        <li>- ✅ Predictable unidirectional data flow</li>
        <li>- ✅ Component decoupling enables easier testing</li>
        <li>- ✅ Scalable foundation for future features</li>
      </ul>

    </article>
  )
}