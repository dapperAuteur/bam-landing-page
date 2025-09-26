// components/ui/CodeBlock.tsx
'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  darkMode?: boolean;
  className?: string;
}

export const CodeBlock = ({ 
  code, 
  language, 
  darkMode = false, 
  className = "" 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseClasses = darkMode 
    ? "bg-gray-900 text-gray-100 border border-gray-700" 
    : "bg-gray-50 text-gray-900 border border-gray-200";

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
      }`}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className={`text-sm font-mono ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            {language}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            copied 
              ? (darkMode ? "bg-green-800 text-green-200" : "bg-green-100 text-green-800")
              : (darkMode 
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                )
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code Content */}
      <div className={`${baseClasses}`}>
        <pre className="p-4 overflow-x-auto">
          <code className="font-mono text-sm leading-relaxed whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

