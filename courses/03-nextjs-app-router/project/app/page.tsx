import Link from 'next/link'
import Image from 'next/image'
import ChallengeList from './components/ChallengeList'
import Counter from './components/Counter'

export const dynamic = 'force-static'

export default function Home(): React.JSX.Element {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Image
            src="/hero.svg"
            alt="Next.js App Router Hero Banner"
            width={600}
            height={200}
            priority
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
          />
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111', marginBottom: '0.5rem' }}>
          Next.js App Router Project
        </h1>
        <p style={{ color: '#555', fontSize: '1.1rem' }}>
          Complete the challenges to build your Next.js skills!
        </p>
        <nav style={{ marginTop: '1.25rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link href="/about" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600 }}>
            About
          </Link>
          <Link href="/posts" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600 }}>
            Posts
          </Link>
          <Link href="/dashboard" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600 }}>
            Dashboard
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
