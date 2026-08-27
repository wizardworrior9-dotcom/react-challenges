export default function Loading(): React.JSX.Element {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <div
          style={{
            height: '2rem',
            width: '280px',
            backgroundColor: '#e2e8f0',
            borderRadius: '4px',
            marginBottom: '1rem',
            animation: 'pulse 1.5s infinite',
          }}
        />
        <div
          style={{
            height: '1rem',
            width: '400px',
            backgroundColor: '#edf2f7',
            borderRadius: '4px',
          }}
        />
      </header>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            style={{
              background: '#ffffff',
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                height: '1.25rem',
                width: '60%',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                marginBottom: '0.75rem',
              }}
            />
            <div
              style={{
                height: '0.9rem',
                width: '90%',
                backgroundColor: '#edf2f7',
                borderRadius: '4px',
                marginBottom: '0.5rem',
              }}
            />
            <div
              style={{
                height: '0.9rem',
                width: '75%',
                backgroundColor: '#edf2f7',
                borderRadius: '4px',
              }}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
