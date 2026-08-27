import Link from 'next/link'
import ChallengeList from './components/ChallengeList'

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
        <nav style={{ marginTop: '1rem' }}>
          <Link href="/about" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            About
          </Link>
        </nav>
      </header>
      <ChallengeList />
    </main>
  )
}
