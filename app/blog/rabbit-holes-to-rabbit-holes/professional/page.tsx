// components/blog/RabbitHolesLandingProfessional.tsx
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

export default function RabbitHolesLandingProfessional() {
  const parts = [
    {
      id: 1,
      title: "The Shuffle That Broke Everything",
      subtitle: "How a simple feature exposed architectural debt",
      skills: ["Context API", "Component Architecture", "State Management"],
      readTime: "8 min",
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-01",
      keyLearnings: ["React Context patterns", "Component ownership", "Architectural debt resolution"]
    },
    {
      id: 2,
      title: "When Fixing One Bug Reveals Another",
      subtitle: "Race conditions and React lifecycle mastery",
      skills: ["Race Conditions", "Component Lifecycle", "Debugging"],
      readTime: "12 min", 
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-02",
      keyLearnings: ["Race condition debugging", "State lifting patterns", "Component coordination"]
    },
    {
      id: 3,
      title: "The Session That Wouldn't Die",
      subtitle: "State machine architecture for bulletproof apps",
      skills: ["State Machines", "Edge Cases", "Defensive Programming"],
      readTime: "10 min",
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-03", 
      keyLearnings: ["Explicit state design", "Edge case elimination", "Predictable behavior"]
    },
    {
      id: 4,
      title: "Racing Conditions and User Experience Gold",
      subtitle: "How constraints breed creativity",
      skills: ["Creative Problem Solving", "UX Innovation", "Learning Science"],
      readTime: "15 min",
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-04",
      keyLearnings: ["Constraint-driven design", "UX psychology", "Learning science application"]
    },
    {
      id: 5,
      title: "Building Features Like a Business",
      subtitle: "Authentication boundaries and monetization strategy", 
      skills: ["Business Strategy", "Growth Engineering", "Monetization"],
      readTime: "22 min",
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-05",
      keyLearnings: ["Business-focused development", "Conversion optimization", "Growth engineering"]
    }
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Complete Development Series
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            From Rabbit Holes to Rabbit Holes
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A systematic approach to transforming from mindless consumer to purposeful developer 
          through productive technical challenges
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <span>5-Part Series</span>
          <span>•</span>
          <span>67 minutes total</span>
          <span>•</span>
          <span>React, Architecture, Business</span>
        </div>
      </header>

      {/* Series Overview */}
      <section className="bg-blue-50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Series Overview
          </h2>
          <p className="text-gray-600">
            Watch the transformation from technical debt to business value
          </p>
        </div>
        <VideoPlaceholder 
          title="From Rabbit Holes to Rabbit Holes: Complete Development Journey"
          description="How strategic technical decisions compound into career-defining skills"
        />
      </section>

      {/* Audio Introduction */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Series Introduction
          </h2>
          <p className="text-gray-600">
            Understanding the philosophy behind productive technical rabbit holes
          </p>
        </div>
        <AudioPlayer 
          title="Choosing Your Rabbit Holes: A Developer's Guide"
          description="Why the technical challenges you choose determine the developer you become"
          duration="12:34"
        />
      </section>

      {/* Skills Matrix */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Skills Development Matrix</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Mastery</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>React state management and lifecycle</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Context API and component architecture</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>State machine design patterns</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Race condition debugging</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Defensive programming practices</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Development</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>User experience design principles</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Constraint-driven innovation</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Learning science application</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Business-focused development</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Growth engineering practices</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Strategy</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Authentication and authorization</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Conversion psychology</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Monetization strategy</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Analytics and A/B testing</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Sustainable competitive advantages</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Series Parts */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Complete Series Breakdown</h2>
        
        <div className="space-y-6">
          {parts.map((part) => (
            <div key={part.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <div className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-bold mr-3">
                      PART {part.id}
                    </div>
                    <span className="text-sm text-gray-600">{part.readTime} read</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{part.title}</h3>
                  <p className="text-gray-600 mb-4">{part.subtitle}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skills Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {part.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Learnings</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {part.keyLearnings.map((learning) => (
                      <li key={learning} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {learning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <a
                  href={part.href}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Read Part {part.id}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reading Paths */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Recommended Reading Paths</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Deep Dive</h3>
            <p className="text-gray-600 mb-4">
              Focus on architecture, debugging methodology, and technical implementation patterns.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Recommended: Parts 1 → 2 → 3
            </p>
            <a href="/blog/rabbit-holes-to-rabbit-holes/professional/part-01" className="text-blue-600 font-semibold hover:text-blue-700">
              Start Technical Path →
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product & UX Focus</h3>
            <p className="text-gray-600 mb-4">
              Explore user experience innovation, design constraints, and product thinking.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Recommended: Part 4 → Part 5 → Part 1
            </p>
            <a href="/blog/rabbit-holes-to-rabbit-holes/professional/part-04" className="text-purple-600 font-semibold hover:text-purple-700">
              Start UX Path →
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Development</h3>
            <p className="text-gray-600 mb-4">
              Learn monetization strategies, growth engineering, and business-focused development.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Recommended: Part 5 → Complete series
            </p>
            <a href="/blog/rabbit-holes-to-rabbit-holes/professional/part-05" className="text-green-600 font-semibold hover:text-green-700">
              Start Business Path →
            </a>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Development Impact Metrics</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">340%</div>
            <div className="text-sm text-gray-600">Development ROI</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">+23%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">67 min</div>
            <div className="text-sm text-gray-600">Total Reading Time</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
            <div className="text-sm text-gray-600">Core Skills</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900">Begin Your Transformation</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join developers who chose productive rabbit holes over mindless consumption. 
          Start building career-defining skills today.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/blog/rabbit-holes-to-rabbit-holes/professional/part-01"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start with Part 1
          </a>
          <a
            href="/#contact"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Discuss Your Journey
          </a>
        </div>
      </section>
    </article>
  );
}