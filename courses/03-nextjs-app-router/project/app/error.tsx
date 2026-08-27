'use client'

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorPageProps): React.JSX.Element {
  useEffect(() => {
    // Log error to an external service in production
    void error
  }, [error])

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '12px',
          padding: '2.5rem',
          maxWidth: '480px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#be123c', marginBottom: '0.75rem' }}>
          Something went wrong
        </h1>
        <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          An unexpected error occurred. You can try again or go back to the home page.
        </p>
        {error.digest && (
          <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
            Error ID: {error.digest}
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            id="error-retry-btn"
            onClick={reset}
            style={{
              padding: '0.6rem 1.5rem',
              background: '#be123c',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              padding: '0.6rem 1.5rem',
              background: '#f1f5f9',
              color: '#374151',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    </main>
  )
}
