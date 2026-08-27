'use client'

import { useRef, useState, useTransition } from 'react'
import { createPost } from '../actions'
import type { PostResult } from '../actions'

export default function AddPostForm(): React.JSX.Element {
  const formRef = useRef<HTMLFormElement>(null)
  const [result, setResult] = useState<PostResult | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createPost(formData)
      setResult(res)
      if (res.success) {
        formRef.current?.reset()
      }
    })
  }

  return (
    <section
      style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>
        Add New Post
      </h2>

      <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label
            htmlFor="post-title"
            style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}
          >
            Title
          </label>
          <input
            id="post-title"
            name="title"
            type="text"
            required
            placeholder="Enter post title..."
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="post-body"
            style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}
          >
            Body
          </label>
          <textarea
            id="post-body"
            name="body"
            required
            rows={3}
            placeholder="Enter post content..."
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.9rem',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          id="add-post-submit"
          type="submit"
          disabled={isPending}
          style={{
            alignSelf: 'flex-start',
            padding: '0.5rem 1.25rem',
            background: isPending ? '#9ca3af' : '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {isPending ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            background: result.success ? '#ecfdf5' : '#fef2f2',
            color: result.success ? '#15803d' : '#dc2626',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {result.message}
          {result.success && result.post && (
            <span style={{ marginLeft: '0.5rem', color: '#555' }}>
              (ID: {result.post.id})
            </span>
          )}
        </div>
      )}
    </section>
  )
}
