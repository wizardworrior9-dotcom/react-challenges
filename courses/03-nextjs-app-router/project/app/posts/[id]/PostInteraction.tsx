'use client'

import { useState } from 'react'

interface PostInteractionProps {
  postId: number
}

export default function PostInteraction({ postId }: PostInteractionProps): React.JSX.Element {
  const [likes, setLikes] = useState<number>(0)
  const [liked, setLiked] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')
  const [comments, setComments] = useState<string[]>([])
  const [bookmarked, setBookmarked] = useState<boolean>(false)

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => Math.max(0, prev - 1))
      setLiked(false)
    } else {
      setLikes((prev) => prev + 1)
      setLiked(true)
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setComments((prev) => [...prev, comment.trim()])
    setComment('')
  }

  return (
    <div
      style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={handleLike}
          aria-label="Like post"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: liked ? '#ef4444' : '#f3f4f6',
            color: liked ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
          }}
        >
          <span>{liked ? '❤️ Liked' : '🤍 Like'}</span>
          <span>({likes})</span>
        </button>

        <button
          type="button"
          onClick={() => setBookmarked((prev) => !prev)}
          aria-label="Bookmark post"
          style={{
            padding: '0.5rem 1rem',
            background: bookmarked ? '#0070f3' : '#f3f4f6',
            color: bookmarked ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          {bookmarked ? '🔖 Saved' : '🔖 Bookmark'}
        </button>
      </div>

      <section style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111' }}>
          Interactive Discussion (Client Component)
        </h3>
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a thought or comment..."
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.9rem',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              background: '#0070f3',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Post
          </button>
        </form>

        {comments.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
            {comments.map((c, i) => (
              <li
                key={i}
                style={{
                  padding: '0.6rem 0.8rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.9rem',
                  color: '#374151',
                }}
              >
                <strong>Feedback #{postId}-{i + 1}:</strong> {c}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
