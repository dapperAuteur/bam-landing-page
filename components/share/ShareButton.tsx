'use client'

import { useState, useEffect } from 'react'
import { Share2, X, Facebook, Twitter, Mail, Link, Camera, MessageCircle } from 'lucide-react'
import html2canvas from 'html2canvas'

interface ShareData {
  title: string
  description: string
  url: string
  screenshot?: string
}

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [shareData, setShareData] = useState<ShareData>({
    title: '',
    description: '',
    url: ''
  })
  const [isCapturing, setIsCapturing] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)

  useEffect(() => {
    // Get current page data
    const title = document.title
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'Check out this amazing content from Brand Anthony McDonald'
    const url = window.location.href

    setShareData({
      title,
      description,
      url
    })
  }, [])

  // Capture screenshot of current page
  const captureScreenshot = async () => {
    setIsCapturing(true)
    try {
      const canvas = await html2canvas(document.body, {
        height: window.innerHeight,
        width: window.innerWidth,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        allowTaint: true
      })
      
      const screenshotDataUrl = canvas.toDataURL('image/png')
      setScreenshot(screenshotDataUrl)
      return screenshotDataUrl
    } catch (error) {
      console.error('Error capturing screenshot:', error)
      return null
    } finally {
      setIsCapturing(false)
    }
  }

  // Share via Web Share API (mobile devices)
  const shareNative = async () => {
    if (navigator.share) {
      try {
        const screenshot = await captureScreenshot()
        const shareObject: any = {
          title: shareData.title,
          text: shareData.description,
          url: shareData.url
        }

        // If screenshot is available, try to share it
        if (screenshot) {
          const blob = await fetch(screenshot).then(r => r.blob())
          const file = new File([blob], 'screenshot.png', { type: 'image/png' })
          shareObject.files = [file]
        }

        await navigator.share(shareObject)
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Error copying link:', error)
    }
  }

  // Share on Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.description)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  // Share on Twitter/X
  const shareOnTwitter = () => {
    const text = `${shareData.title}\n\n${shareData.description}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.url)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  // Share on Bluesky
  const shareOnBluesky = () => {
    const text = `${shareData.title}\n\n${shareData.description}\n\n${shareData.url}`
    const url = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=600,height=600')
  }

  // Share via Email
  const shareViaEmail = async () => {
    const screenshot = await captureScreenshot()
    const subject = `Check out: ${shareData.title}`
    const body = `Hi!\n\nI thought you'd be interested in this: ${shareData.title}\n\n${shareData.description}\n\nView it here: ${shareData.url}\n\n${screenshot ? 'I\'ve also captured a screenshot to give you a preview!' : ''}`
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  // Copy content for Instagram (Instagram doesn't have URL sharing)
  const prepareForInstagram = async () => {
    const screenshot = await captureScreenshot()
    const text = `${shareData.title}\n\n${shareData.description}\n\nLink in bio: ${shareData.url}`
    
    try {
      await navigator.clipboard.writeText(text)
      alert('Content copied! You can now paste this in Instagram. The screenshot has been captured - you can manually save it for your Instagram post.')
    } catch (error) {
      console.error('Error copying content:', error)
    }
  }

  // Download screenshot
  const downloadScreenshot = async () => {
    const screenshotData = screenshot || await captureScreenshot()
    if (screenshotData) {
      const link = document.createElement('a')
      link.download = `${shareData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_screenshot.png`
      link.href = screenshotData
      link.click()
    }
  }

  return (
    <>
      {/* Floating Share Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Share this page"
        >
          {isOpen ? <X size={24} /> : <Share2 size={24} />}
        </button>
      </div>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Share This Page</h3>
            <p className="text-sm text-gray-600 mb-6">{shareData.title}</p>

            {/* Screenshot Preview */}
            {screenshot && (
              <div className="mb-4">
                <img 
                  src={screenshot} 
                  alt="Page screenshot" 
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Share Options */}
            <div className="grid grid-cols-2 gap-3">
              {/* Native Share (if available) */}
              {navigator.share && (
                <button
                  onClick={shareNative}
                  disabled={isCapturing}
                  className="flex items-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Share2 size={20} className="text-gray-600" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={copyLink}
                className="flex items-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Link size={20} className="text-gray-600" />
                <span className="text-sm font-medium">Copy Link</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareOnFacebook}
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Facebook size={20} className="text-blue-600" />
                <span className="text-sm font-medium">Facebook</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 p-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                <Twitter size={20} />
                <span className="text-sm font-medium">Twitter/X</span>
              </button>

              {/* Bluesky */}
              <button
                onClick={shareOnBluesky}
                className="flex items-center gap-2 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
              >
                <MessageCircle size={20} className="text-sky-600" />
                <span className="text-sm font-medium">Bluesky</span>
              </button>

              {/* Email */}
              <button
                onClick={shareViaEmail}
                disabled={isCapturing}
                className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <Mail size={20} className="text-green-600" />
                <span className="text-sm font-medium">Email</span>
              </button>

              {/* Instagram */}
              <button
                onClick={prepareForInstagram}
                disabled={isCapturing}
                className="flex items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <Camera size={20} className="text-pink-600" />
                <span className="text-sm font-medium">Instagram</span>
              </button>

              {/* Download Screenshot */}
              <button
                onClick={downloadScreenshot}
                disabled={isCapturing}
                className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <Camera size={20} className="text-purple-600" />
                <span className="text-sm font-medium">Screenshot</span>
              </button>
            </div>

            {/* Capture Status */}
            {isCapturing && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Capturing screenshot...
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500 text-center">
              Screenshots help make your shares more engaging!
            </div>
          </div>
        </div>
      )}
    </>
  )
}