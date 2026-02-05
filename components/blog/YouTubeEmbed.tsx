'use client';

import React, { useState, useEffect } from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export const YouTubeEmbed = ({ videoId, title }: YouTubeEmbedProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-gray-100" 
      style={{ paddingBottom: '56.25%' }} // 16:9 Aspect Ratio
    >
      {isMounted && (
        <iframe
          className="absolute top-0 left-0 w-full h-full border-0"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};