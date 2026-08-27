import Link from 'next/link'
import ChallengeList from './components/ChallengeList'
import Counter from './components/Counter'

export const dynamic = 'force-static'

export default function Home(): React.JSX.Element {
  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Next.js App Router Project</h1>
        <p>Complete the challenges to build your Next.js skills!</p>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Work on challenges by modifying code in <code>app/</code> directory.
          Run <code>npm run dev</code> to see your changes.
        </p>
        <nav style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/about" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            About
          </Link>
          <Link href="/posts" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            Posts
          </Link>
        </nav>
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <Counter />
      </section>

      <ChallengeList />
    </main>
  )
}
