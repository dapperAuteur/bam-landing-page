'use client'

import { useState } from 'react'

interface Comment {
  id?: string
  text: string
  timestamp: Date | string
  author?: string
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (text: string) => void
}

export default function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')

  const handleSubmit = () => {
    if (!newComment.trim()) return
    onAddComment(newComment.trim())
    setNewComment('')
  }

  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 max-w-md max-h-60 overflow-y-auto shadow-lg">
      <h4 className="font-bold mb-2">Comments</h4>

      {comments.length === 0 && (
        <p className="text-sm text-gray-500 mb-2">No comments yet.</p>
      )}

      {comments.map((comment, index) => (
        <div key={comment.id || index} className="mb-2 p-2 bg-gray-100 rounded">
          <p className="text-sm">{comment.text}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(comment.timestamp).toLocaleDateString()}
          </p>
        </div>
      ))}

      <div className="mt-4 flex gap-2">
        <label htmlFor="new-comment" className="sr-only">Add a comment</label>
        <input
          id="new-comment"
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Add a comment..."
          className="flex-1 text-sm border rounded px-2 py-1"
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Add
        </button>
      </div>
    </div>
  )
}
