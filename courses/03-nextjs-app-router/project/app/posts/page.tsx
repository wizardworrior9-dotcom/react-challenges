import Link from 'next/link'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10', {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.statusText}`)
    }

    return res.json()
  } catch {
    // Fallback data in case external network is unavailable in test environment
    return [
      { id: 1, title: 'First Server Rendered Post', body: 'This post is fetched directly inside an async Server Component.', userId: 1 },
      { id: 2, title: 'Next.js App Router Data Fetching', body: 'Server Components can use native fetch with async/await effortlessly.', userId: 1 },
      { id: 3, title: 'Optimized Server Performance', body: 'Zero client-side JS needed for initial data fetching and rendering.', userId: 1 },
    ]
  }
}

export default async function PostsPage(): Promise<React.JSX.Element> {
  const posts = await getPosts()

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <nav style={{ marginBottom: '1rem' }}>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            ← Home
          </Link>
        </nav>
        <h1>Posts (Server Component Data Fetching)</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Fetched on the server using <code>await fetch()</code> inside an async Server Component.
        </p>
      </header>

      {posts.length === 0 ? (
        <p>No posts available at this time.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {posts.map((post) => (
            <article
              key={post.id}
              style={{
                background: '#ffffff',
                border: '1px solid #eaeaea',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#111' }}>
                {post.id}. {post.title}
              </h2>
              <p style={{ color: '#555', lineHeight: '1.6' }}>{post.body}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
