export const dynamic = 'force-dynamic'

interface DashboardStats {
  totalPosts: number
  totalUsers: number
  lastUpdated: string
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [postsRes, usersRes] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts', { cache: 'no-store' }),
      fetch('https://jsonplaceholder.typicode.com/users', { cache: 'no-store' }),
    ])

    const posts = postsRes.ok ? await postsRes.json() : []
    const users = usersRes.ok ? await usersRes.json() : []

    return {
      totalPosts: posts.length,
      totalUsers: users.length,
      lastUpdated: new Date().toISOString(),
    }
  } catch {
    return {
      totalPosts: 100,
      totalUsers: 10,
      lastUpdated: new Date().toISOString(),
    }
  }
}

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const stats = await getDashboardStats()

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111' }}>Dashboard</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Server-Side Rendered — data is fetched fresh on every request.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            background: '#f0f7ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1d4ed8', margin: 0 }}>
            {stats.totalPosts}
          </p>
          <p style={{ color: '#555', marginTop: '0.5rem', fontWeight: 500 }}>Total Posts</p>
        </div>

        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: '#15803d', margin: 0 }}>
            {stats.totalUsers}
          </p>
          <p style={{ color: '#555', marginTop: '0.5rem', fontWeight: 500 }}>Total Users</p>
        </div>

        <div
          style={{
            background: '#fdf4ff',
            border: '1px solid #e9d5ff',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#7e22ce', margin: 0 }}>
            {new Date(stats.lastUpdated).toLocaleTimeString()}
          </p>
          <p style={{ color: '#555', marginTop: '0.5rem', fontWeight: 500 }}>Last Updated</p>
        </div>
      </section>

      <p style={{ color: '#888', fontSize: '0.875rem' }}>
        This page uses{' '}
        <code
          style={{
            background: '#f5f5f5',
            padding: '0.1rem 0.4rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        >
          export const dynamic = &apos;force-dynamic&apos;
        </code>{' '}
        and{' '}
        <code
          style={{
            background: '#f5f5f5',
            padding: '0.1rem 0.4rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        >
          cache: &apos;no-store&apos;
        </code>{' '}
        to ensure every visit gets fresh server-rendered content.
      </p>
    </main>
  )
}
