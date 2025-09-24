'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

interface CodeBlockProps {
  code: string
  language: string
}

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim())
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div className="relative my-6 rounded-xl overflow-hidden bg-[#1E1E1E]">
      <div className="absolute top-3 right-3">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-400 bg-gray-800/50 hover:bg-gray-700/50 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? (
            <CheckIcon className="h-5 w-5 text-green-400" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0 }}>
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  )
}
