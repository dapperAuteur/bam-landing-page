// components/ui/VideoPlaceholder.tsx
'use client';

interface VideoPlaceholderProps {
  title: string;
  description?: string;
  darkMode?: boolean;
  className?: string;
}

export const VideoPlaceholder = ({ 
  title, 
  description, 
  darkMode = false, 
  className = "" 
}: VideoPlaceholderProps) => {
  const baseClasses = darkMode 
    ? "bg-gray-800 border-gray-600" 
    : "bg-gray-100 border-gray-300";

  const textClasses = darkMode 
    ? "text-gray-100" 
    : "text-gray-900";

  const subtextClasses = darkMode 
    ? "text-gray-400" 
    : "text-gray-600";

  return (
    <div className={`relative aspect-video rounded-lg border-2 border-dashed ${baseClasses} ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        {/* Play Button Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          darkMode ? "bg-gray-700" : "bg-white"
        } shadow-lg`}>
          <svg 
            className={`w-6 h-6 ml-1 ${textClasses}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-semibold mb-2 ${textClasses}`}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className={`text-sm max-w-md ${subtextClasses}`}>
            {description}
          </p>
        )}

        {/* Video Badge */}
        <div className={`mt-4 px-3 py-1 rounded-full text-xs font-medium ${
          darkMode 
            ? "bg-gray-700 text-gray-300" 
            : "bg-gray-200 text-gray-700"
        }`}>
          Video Placeholder
        </div>
      </div>

      {/* Corner indicator */}
      <div className="absolute top-3 right-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          darkMode ? "bg-gray-700" : "bg-white"
        } shadow-sm`}>
          <svg 
            className={`w-4 h-4 ${subtextClasses}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};