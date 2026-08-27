'use client'

import { useState } from 'react'

export default function Counter(): React.JSX.Element {
  const [count, setCount] = useState<number>(0)

  const increment = (): void => {
    setCount((prev) => prev + 1)
  }

  const decrement = (): void => {
    setCount((prev) => prev - 1)
  }

  const reset = (): void => {
    setCount(0)
  }

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '1.5rem auto',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
        Interactive Counter (Client Component)
      </h2>
      <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0070f3', margin: '0.5rem 0' }}>
        {count}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={decrement}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          - Decrement
        </button>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={increment}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#0070f3',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          + Increment
        </button>
      </div>
    </div>
  )
}
