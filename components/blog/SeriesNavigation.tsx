// components/blog/SeriesNavigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

type PartColor = 'red' | 'orange' | 'purple' | 'amber' | 'green';

interface Part {
  id: number;
  title: string;
  href: string;
  color: PartColor;
  skills: string[];
  readTime: string;
}

// Series Table of Contents Component
export const SeriesTableOfContents = ({ 
  currentPart, 
  className = "" 
}: { 
  currentPart?: number; 
  className?: string; 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const parts: Part[] = [
    {
      id: 1,
      title: "The Shuffle That Broke Everything",
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-01",
      color: "red",
      skills: ["Context API", "Architecture"],
      readTime: "8 min"
    },
    {
      id: 2,
      title: "When Fixing One Bug Reveals Another", 
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-02",
      color: "orange",
      skills: ["Race Conditions", "Lifecycle"],
      readTime: "12 min"
    },
    {
      id: 3,
      title: "The Session That Wouldn't Die",
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-03",
      color: "purple", 
      skills: ["State Machines", "Edge Cases"],
      readTime: "10 min"
    },
    {
      id: 4,
      title: "Racing Conditions and User Experience Gold",
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-04",
      color: "amber",
      skills: ["UX Innovation", "Constraints"],
      readTime: "15 min"
    },
    {
      id: 5,
      title: "Building Features Like a Business",
      href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-05", 
      color: "green",
      skills: ["Business Strategy", "Growth"],
      readTime: "22 min"
    }
  ];

  const colorClasses: Record<PartColor, string> = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500", 
    amber: "bg-amber-500",
    green: "bg-green-500"
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">From Rabbit Holes to Rabbit Holes</h3>
            <p className="text-sm text-gray-600">5-part series • 67 min total</p>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200">
          {parts.map((part) => (
            <Link key={part.id} href={part.href}>
              <div className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                currentPart === part.id ? 'bg-blue-50' : ''
              }`}>
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    currentPart === part.id ? 'bg-blue-600' : colorClasses[part.color]
                  }`}>
                    <span className="text-white font-bold text-xs">{part.id}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className={`font-medium ${currentPart === part.id ? 'text-blue-900' : 'text-gray-900'}`}>
                      Part {part.id}: {part.title}
                    </h4>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <span className="mr-3">{part.readTime}</span>
                      <div className="flex space-x-1">
                        {part.skills.map((skill) => (
                          <span key={skill} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {currentPart === part.id && (
                    <div className="ml-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Part-to-Part Navigation Component  
export const PartNavigation = ({ 
  currentPart, 
  className = "" 
}: { 
  currentPart: number; 
  className?: string; 
}) => {
  const parts = [
    { id: 1, title: "The Shuffle That Broke Everything", href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-01" },
    { id: 2, title: "When Fixing One Bug Reveals Another", href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-02" },
    { id: 3, title: "The Session That Wouldn't Die", href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-03" },
    { id: 4, title: "Racing Conditions and User Experience Gold", href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-04" },
    { id: 5, title: "Building Features Like a Business", href: "/blog/rabbit-holes-to-rabbit-holes/professional/part-05" }
  ];

  const prevPart = parts.find(p => p.id === currentPart - 1);
  const nextPart = parts.find(p => p.id === currentPart + 1);

  return (
    <div className={`border-t border-gray-200 pt-8 ${className}`}>
      <div className="flex justify-between items-center">
        {prevPart ? (
          <Link href={prevPart.href} className="group flex items-center">
            <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-medium">Previous</div>
                <div className="text-lg font-semibold">Part {prevPart.id}</div>
              </div>
            </div>
          </Link>
        ) : (
          <div></div>
        )}

        <Link href="/blog/rabbit-holes" className="text-gray-600 hover:text-gray-900 transition-colors">
          <div className="text-center">
            <div className="text-sm">Series Overview</div>
            <div className="font-medium">All Parts</div>
          </div>
        </Link>

        {nextPart ? (
          <Link href={nextPart.href} className="group flex items-center">
            <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              <div className="text-right">
                <div className="text-sm font-medium">Next</div>
                <div className="text-lg font-semibold">Part {nextPart.id}</div>
              </div>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

// Series Progress Indicator
export const SeriesProgress = ({ 
  currentPart, 
  className = "" 
}: { 
  currentPart: number; 
  className?: string; 
}) => {
  const totalParts = 5;
  const progress = (currentPart / totalParts) * 100;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-900">Series Progress</span>
        <span className="text-sm text-gray-600">Part {currentPart} of {totalParts}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Start</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

// Floating Series Navigation (for mobile/tablet)
export const FloatingSeriesNav = ({ 
  currentPart, 
  isVisible = true 
}: { 
  currentPart: number; 
  isVisible?: boolean; 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 lg:hidden">
      <div className={`bg-white border border-gray-200 rounded-lg shadow-lg transition-all ${
        isExpanded ? 'w-80' : 'w-auto'
      }`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-lg"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">{currentPart}</span>
          </div>
          {isExpanded && <span className="text-sm font-medium">Part {currentPart}</span>}
          <svg 
            className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="border-t border-gray-200 p-2">
            <SeriesTableOfContents currentPart={currentPart} className="border-0" />
          </div>
        )}
      </div>
    </div>
  );
};

// Breadcrumb Navigation
export const SeriesBreadcrumb = ({ 
  currentPart, 
  className = "" 
}: { 
  currentPart: number; 
  className?: string; 
}) => {
  const currentTitle = [
    "The Shuffle That Broke Everything",
    "When Fixing One Bug Reveals Another", 
    "The Session That Wouldn't Die",
    "Racing Conditions and User Experience Gold",
    "Building Features Like a Business"
  ][currentPart - 1];

  return (
    <nav className={`flex items-center text-sm text-gray-500 ${className}`}>
      <Link href="/" className="hover:text-gray-700 transition-colors">
        Home
      </Link>
      <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      <Link href="/blog" className="hover:text-gray-700 transition-colors">
        Blog
      </Link>
      <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      <Link href="/blog/rabbit-holes" className="hover:text-gray-700 transition-colors">
        Rabbit Holes Series
      </Link>
      <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-gray-900 font-medium">
        Part {currentPart}: {currentTitle}
      </span>
    </nav>
  );
};