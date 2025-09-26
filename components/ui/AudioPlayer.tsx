// components/ui/AudioPlayer.tsx
'use client';

import { useState } from 'react';

interface AudioPlayerProps {
  title: string;
  description?: string;
  duration?: string;
  darkMode?: boolean;
  className?: string;
}

export const AudioPlayer = ({ 
  title, 
  description, 
  duration = "8:42", 
  darkMode = false, 
  className = "" 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");

  const baseClasses = darkMode 
    ? "bg-gray-800 border-gray-600" 
    : "bg-white border-gray-200";

  const textClasses = darkMode 
    ? "text-gray-100" 
    : "text-gray-900";

  const subtextClasses = darkMode 
    ? "text-gray-400" 
    : "text-gray-600";

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`border rounded-lg p-6 ${baseClasses} ${className}`}>
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className={`p-3 rounded-full ${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        }`}>
          <svg 
            className={`w-6 h-6 ${textClasses}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" 
            />
          </svg>
        </div>
        <div className="flex-grow">
          <h3 className={`font-semibold text-lg ${textClasses}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-sm mt-1 ${subtextClasses}`}>
              {description}
            </p>
          )}
          <div className={`text-xs mt-2 ${subtextClasses}`}>
            Audio Discussion • {duration}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className={`h-2 rounded-full ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        }`}>
          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <div className={`flex justify-between text-xs mt-2 ${subtextClasses}`}>
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button className={`p-2 rounded-full transition-colors ${
          darkMode 
            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" 
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        <button 
          onClick={togglePlay}
          className={`p-3 rounded-full transition-colors ${
            isPlaying 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button className={`p-2 rounded-full transition-colors ${
          darkMode 
            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" 
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>
      </div>

      {/* Placeholder Badge */}
      <div className="text-center mt-4">
        <span className={`text-xs px-3 py-1 rounded-full ${
          darkMode 
            ? "bg-gray-700 text-gray-300" 
            : "bg-gray-100 text-gray-600"
        }`}>
          Audio Placeholder
        </span>
      </div>
    </div>
  );
};