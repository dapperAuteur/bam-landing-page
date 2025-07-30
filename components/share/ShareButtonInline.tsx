'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Mail, Link, MessageCircle } from 'lucide-react'
import html2canvas from 'html2canvas'

interface InlineShareProps {
  title?: string
  description?: string
  className?: string
}

export default function ShareButtonInline({ 
  title, 
  description, 
  className = '' 
}: InlineShareProps) {
  const [isSharing, setIsSharing] = useState(false)

  const shareData = {
    title: title || document.title,
    description: description || 'Check out this content from Brand Anthony McDonald',
    url: typeof window !== 'undefined' ? window.location.href : ''
  }

  const captureAndShare = async (platform: string) => {
    setIsSharing(true)
    
    try {
      // Capture screenshot
      const canvas = await html2canvas(document.body, {
        height: window.innerHeight,
        width: window.innerWidth,
        useCORS: true
      })
      
      const screenshot = canvas.toDataURL('image/png')
      
      // Platform-specific sharing
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank')
          break
        case 'twitter':
          const twitterText = `${shareData.title}\n\n${shareData.description}`
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareData.url)}`, '_blank')
          break
        case 'bluesky':
          const blueskyText = `${shareData.title}\n\n${shareData.description}\n\n${shareData.url}`
          window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(blueskyText)}`, '_blank')
          break
        case 'email':
          const emailBody = `Check out: ${shareData.title}\n\n${shareData.description}\n\n${shareData.url}`
          window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(emailBody)}`
          break
        case 'copy':
          await navigator.clipboard.writeText(shareData.url)
          alert('Link copied to clipboard!')
          break
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 font-medium">Share:</span>
      
      <button
        onClick={() => captureAndShare('facebook')}
        disabled={isSharing}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
        title="Share on Facebook"
      >
        <Facebook size={18} />
      </button>
      
      <button
        onClick={() => captureAndShare('twitter')}
        disabled={isSharing}
        className="p-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title="Share on Twitter/X"
      >
        <Twitter size={18} />
      </button>
      
      <button
        onClick={() => captureAndShare('bluesky')}
        disabled={isSharing}
        className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors disabled:opacity-50"
        title="Share on Bluesky"
      >
        <MessageCircle size={18} />
      </button>
      
      <button
        onClick={() => captureAndShare('email')}
        disabled={isSharing}
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
        title="Share via Email"
      >
        <Mail size={18} />
      </button>
      
      <button
        onClick={() => captureAndShare('copy')}
        disabled={isSharing}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title="Copy Link"
      >
        <Link size={18} />
      </button>

      {isSharing && (
        <div className="ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}