import Link from 'next/link'

export default function NotFound(): React.JSX.Element {
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
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '2.5rem',
          maxWidth: '480px',
          width: '100%',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111', marginBottom: '0.5rem' }}>
          404 — Page Not Found
        </h1>
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.5rem',
            background: '#0070f3',
            color: '#fff',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
          }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
