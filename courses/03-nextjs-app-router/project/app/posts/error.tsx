'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PostsError({ error, reset }: ErrorProps): React.JSX.Element {
  useEffect(() => {
    void error
  }, [error])

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '480px',
          width: '100%',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#be123c', marginBottom: '0.75rem' }}>
          Failed to load posts
        </h2>
        <p style={{ color: '#555', marginBottom: '1.5rem' }}>
          There was an error loading the requested post or list of posts.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.6rem 1.25rem',
              background: '#be123c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          <a
            href="/posts"
            style={{
              padding: '0.6rem 1.25rem',
              background: '#f1f5f9',
              color: '#374151',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            All Posts
          </a>
        </div>
      </div>
    </main>
  )
}
