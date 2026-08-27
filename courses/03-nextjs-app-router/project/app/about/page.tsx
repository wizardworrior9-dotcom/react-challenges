import Link from 'next/link'

export default function AboutPage(): React.JSX.Element {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>About</h1>
      <p style={{ marginTop: '1rem', color: '#555', lineHeight: '1.6' }}>
        This Next.js App Router project is designed for mastering Next.js 14 features,
        including Server and Client Components, Data Fetching, Route Handlers, Server Actions,
        and state management with Redux Toolkit and RTK Query.
      </p>
      <nav style={{ marginTop: '1.5rem' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Home
        </Link>
      </nav>
    </main>
  )
}
