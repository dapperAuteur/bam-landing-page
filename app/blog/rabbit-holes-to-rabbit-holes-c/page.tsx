// components/blog/RabbitHolesLanding.tsx
'use client';

import { useState } from 'react';
import { VideoPlaceholder } from '@/components/ui/VideoPlaceholder';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

type PartColor = 'red' | 'orange' | 'purple' | 'amber' | 'green';

interface Part {
  id: number;
  title: string;
  subtitle: string;
  color: PartColor;
  skills: string[];
  readTime: string;
  href: string;
}

type ColorClasses = {
  [key in PartColor]: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    button: string;
  };
};

const SeriesOverview = () => {
  const [selectedPart, setSelectedPart] = useState(1);

  const parts: Part[] = [
    {
      id: 1,
      title: "The Shuffle That Broke Everything",
      subtitle: "How a simple feature exposed architectural debt",
      color: "red",
      skills: ["Context API", "Component Architecture", "State Management"],
      readTime: "8 min",
      href: "/blog/rabbit-holes-part-1"
    },
    {
      id: 2,
      title: "When Fixing One Bug Reveals Another",
      subtitle: "Race conditions and React lifecycle mastery",
      color: "orange",
      skills: ["Race Conditions", "Component Lifecycle", "Debugging"],
      readTime: "12 min",
      href: "/blog/rabbit-holes-part-2"
    },
    {
      id: 3,
      title: "The Session That Wouldn't Die",
      subtitle: "State machine architecture for bulletproof apps",
      color: "purple",
      skills: ["State Machines", "Edge Cases", "Defensive Programming"],
      readTime: "10 min",
      href: "/blog/rabbit-holes-part-3"
    },
    {
      id: 4,
      title: "Racing Conditions and User Experience Gold",
      subtitle: "How constraints breed creativity",
      color: "amber",
      skills: ["Creative Problem Solving", "UX Innovation", "Learning Science"],
      readTime: "15 min",
      href: "/blog/rabbit-holes-part-4"
    },
    {
      id: 5,
      title: "Building Features Like a Business",
      subtitle: "Authentication boundaries and monetization strategy",
      color: "green",
      skills: ["Business Strategy", "Growth Engineering", "Monetization"],
      readTime: "22 min",
      href: "/blog/rabbit-holes-part-5"
    }
  ];

  const colorClasses: ColorClasses = {
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-900",
      accent: "bg-red-500",
      button: "bg-red-600 hover:bg-red-700"
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200", 
      text: "text-orange-900",
      accent: "bg-orange-500",
      button: "bg-orange-600 hover:bg-orange-700"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-900", 
      accent: "bg-purple-500",
      button: "bg-purple-600 hover:bg-purple-700"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      accent: "bg-amber-500", 
      button: "bg-amber-600 hover:bg-amber-700"
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-900",
      accent: "bg-green-500",
      button: "bg-green-600 hover:bg-green-700"
    }
  };

  return (
    <article className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <header className="text-center mb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              From Rabbit Holes
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                to Rabbit Holes
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              My transformation from mindless social media consumer to purposeful developer 
              through productive technical rabbit holes
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>5-Part Series</span>
              <span>•</span>
              <span>67 min total read</span>
              <span>•</span>
              <span>React, Architecture, Business</span>
            </div>
          </div>
        </div>
      </header>

      {/* Series Overview Video */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              The Complete Journey
            </h2>
            <p className="text-gray-300">
              Watch how a simple shuffle feature became a masterclass in product development
            </p>
          </div>
          <VideoPlaceholder 
            title="From Rabbit Holes to Rabbit Holes: Complete Series Overview"
            description="The transformation from consumer to builder through productive technical challenges"
            darkMode={true}
          />
          <div className="mt-6">
            <AudioPlayer 
              title="Series Introduction: Choosing Your Rabbit Holes"
              description="Why the rabbit holes you choose determine the developer you become"
              duration="12:34"
              darkMode={true}
            />
          </div>
        </div>
      </section>

      {/* Interactive Series Navigator */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          The 5-Part Transformation Journey
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Part List */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {parts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPart === part.id
                      ? `${colorClasses[part.color].bg} ${colorClasses[part.color].border}`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      selectedPart === part.id ? colorClasses[part.color].accent : 'bg-gray-200'
                    }`}>
                      <span className="text-white font-bold text-sm">{part.id}</span>
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        selectedPart === part.id ? colorClasses[part.color].text : 'text-gray-900'
                      }`}>
                        Part {part.id}
                      </h3>
                      <p className="text-sm text-gray-600">{part.readTime} read</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Part Details */}
          <div className="lg:col-span-2">
            {parts.map((part) => (
              <div
                key={part.id}
                className={`${selectedPart === part.id ? 'block' : 'hidden'} ${colorClasses[part.color].bg} rounded-xl p-8 border ${colorClasses[part.color].border}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold ${colorClasses[part.color].text} mb-2`}>
                      {part.title}
                    </h3>
                    <p className="text-lg text-gray-700">{part.subtitle}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${colorClasses[part.color].accent}`}>
                    Part {part.id}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className={`font-semibold ${colorClasses[part.color].text} mb-3`}>
                    Skills You'll Learn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {part.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <a
                    href={part.href}
                    className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors ${colorClasses[part.color].button}`}
                  >
                    Read Part {part.id}
                  </a>
                  <span className="text-sm text-gray-600">{part.readTime} read</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Complete Skills Transformation
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Technical Mastery</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• React state management and lifecycle</li>
                <li>• Context API and component architecture</li>
                <li>• State machine design patterns</li>
                <li>• Race condition debugging</li>
                <li>• Defensive programming practices</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">Product Thinking</h3>
              <ul className="space-y-2 text-purple-800">
                <li>• User experience design principles</li>
                <li>• Constraint-driven innovation</li>
                <li>• Learning science application</li>
                <li>• Business-focused development</li>
                <li>• Growth engineering practices</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Business Acumen</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Authentication and authorization</li>
                <li>• Conversion psychology</li>
                <li>• Monetization strategy</li>
                <li>• Analytics and A/B testing</li>
                <li>• Sustainable competitive advantages</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Paths */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Choose Your Reading Path
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">The Developer Path</h3>
            <p className="text-gray-600 mb-4">
              Focus on technical implementation, architecture decisions, and code quality improvements.
            </p>
            <a href="/blog/rabbit-holes-part-1" className="text-blue-600 font-semibold hover:text-blue-700">
              Start with Part 1 →
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">The UX Designer Path</h3>
            <p className="text-gray-600 mb-4">
              Explore user experience innovations, constraint-driven design, and psychological principles.
            </p>
            <a href="/blog/rabbit-holes-part-4" className="text-purple-600 font-semibold hover:text-purple-700">
              Start with Part 4 →
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">The Business Path</h3>
            <p className="text-gray-600 mb-4">
              Learn monetization strategies, growth engineering, and business-focused development practices.
            </p>
            <a href="/blog/rabbit-holes-part-5" className="text-green-600 font-semibold hover:text-green-700">
              Start with Part 5 →
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Your Rabbit Holes Are Waiting
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            How you spend your time determines what you become good at. 
            Choose productive rabbit holes that compound into career-defining skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/blog/rabbit-holes-part-1"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Start the Journey
            </a>
            <a
              href="/contact"
              className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Share Your Rabbit Holes
            </a>
          </div>
        </div>
      </section>
    </article>
  );
};

export default SeriesOverview;