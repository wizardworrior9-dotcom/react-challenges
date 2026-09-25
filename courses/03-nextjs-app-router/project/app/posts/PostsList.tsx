'use client'

import { useState } from 'react'
import { useGetPostsQuery, useAddPostMutation } from '../store/apiSlice'

export default function PostsList(): React.JSX.Element {
  const { data: posts, isLoading, isError, error } = useGetPostsQuery()
  const [addPost, { isLoading: isAdding }] = useAddPostMutation()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [formFeedback, setFormFeedback] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    try {
      await addPost({ title: title.trim(), body: body.trim(), userId: 1 }).unwrap()
      setTitle('')
      setBody('')
      setFormFeedback('Post created successfully with RTK Query mutation!')
      setTimeout(() => setFormFeedback(null), 4000)
    } catch {
      setFormFeedback('Failed to create post. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        <p>Loading posts via RTK Query...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626', background: '#fef2f2', borderRadius: '8px' }}>
        <p>Failed to load posts: {JSON.stringify(error)}</p>
      </div>
    )
  }

  return (
    <section style={{ margin: '2rem 0' }}>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#111' }}>
          Add Post (RTK Query Mutation)
        </h2>
        {formFeedback && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderRadius: '6px',
              backgroundColor: formFeedback.includes('successfully') ? '#ecfdf5' : '#fef2f2',
              color: formFeedback.includes('successfully') ? '#065f46' : '#991b1b',
              fontSize: '0.9rem',
            }}
          >
            {formFeedback}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="rtk-post-title" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#374151' }}>
              Title
            </label>
            <input
              id="rtk-post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label htmlFor="rtk-post-body" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#374151' }}>
              Content
            </label>
            <textarea
              id="rtk-post-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write post content..."
              rows={3}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isAdding}
            style={{
              alignSelf: 'flex-start',
              padding: '0.6rem 1.25rem',
              background: '#0070f3',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isAdding ? 'not-allowed' : 'pointer',
              opacity: isAdding ? 0.7 : 1,
            }}
          >
            {isAdding ? 'Adding Post...' : 'Publish Post'}
          </button>
        </form>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#111' }}>
        Live Posts Feed (RTK Query Cached State)
      </h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {posts?.map((post) => (
          <article
            key={post.id}
            style={{
              background: '#ffffff',
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0070f3', marginBottom: '0.5rem' }}>
              {post.id}. {post.title}
            </h3>
            <p style={{ color: '#4b5563', lineHeight: '1.5', margin: 0 }}>
              {post.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
