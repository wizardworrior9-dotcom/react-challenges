import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface PageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

async function getPost(id: string): Promise<Post | null> {
  // Reject clearly non-numeric IDs
  const numericId = parseInt(id, 10)
  if (isNaN(numericId) || numericId <= 0) {
    return null
  }

  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok || res.status === 404) {
      return null
    }

    const data = await res.json()
    // JSONPlaceholder returns {} for out-of-range IDs
    if (!data || !data.id) {
      return null
    }

    return data as Post
  } catch {
    // On network errors fallback for known IDs only
    if (numericId >= 1 && numericId <= 100) {
      return {
        id: numericId,
        title: `Dynamic Post #${id}`,
        body: `This is the body content for post ID ${id}, rendered dynamically using Next.js App Router dynamic route segments.`,
        userId: 1,
      }
    }
    return null
  }
}

export default async function PostDetailPage({ params }: PageProps): Promise<React.JSX.Element> {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <nav style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <Link href="/posts" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          ← Back to Posts
        </Link>
        <Link href="/" style={{ color: '#666', textDecoration: 'underline' }}>
          Home
        </Link>
      </nav>

      <article
        style={{
          background: '#ffffff',
          border: '1px solid #eaeaea',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            backgroundColor: '#0070f3',
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            fontWeight: 600,
          }}
        >
          Post ID: {params.id}
        </div>

        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#111' }}>
          {post.title}
        </h1>

        <p style={{ color: '#444', lineHeight: '1.7', fontSize: '1.1rem' }}>
          {post.body}
        </p>
      </article>
    </main>
  )
}
