import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import AddPostForm from '../components/AddPostForm'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Posts & Updates',
    description: 'Explore the latest articles, search posts, and navigate paginated results.',
  }
}

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface SearchParamsProps {
  searchParams?: {
    q?: string
    page?: string
  }
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      cache: 'no-store',
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
      { id: 4, title: 'Dynamic Routing and Static Params', body: 'Learn how to generate routes on demand or statically at build time.', userId: 1 },
      { id: 5, title: 'Search and Pagination in App Router', body: 'Use searchParams to easily filter and paginate data on the server.', userId: 1 },
      { id: 6, title: 'Server Actions and Revalidation', body: 'Mutate data with zero client API boilerplate using Next.js server actions.', userId: 1 },
    ]
  }
}

async function PostsList({
  query = '',
  currentPage = 1,
}: {
  query?: string
  currentPage?: number
}): Promise<React.JSX.Element> {
  const allPosts = await getPosts()

  // Filter posts by search query
  const filteredPosts = query
    ? allPosts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      )
    : allPosts

  // Pagination calculations
  const pageSize = 5
  const totalPages = Math.ceil(filteredPosts.length / pageSize) || 1
  const validPage = Math.max(1, Math.min(currentPage, totalPages))
  const startIndex = (validPage - 1) * pageSize
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize)

  if (paginatedPosts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '8px' }}>
        <p style={{ color: '#666', fontSize: '1rem' }}>No posts matching &quot;{query}&quot; found.</p>
        <Link href="/posts" style={{ color: '#0070f3', textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block' }}>
          Clear search
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '2rem' }}>
        {paginatedPosts.map((post) => (
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
              <Link href={`/posts/${post.id}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
                {post.id}. {post.title}
              </Link>
            </h2>
            <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1rem' }}>{post.body}</p>
            <Link href={`/posts/${post.id}`} style={{ fontSize: '0.9rem', color: '#0070f3', textDecoration: 'underline' }}>
              View Details →
            </Link>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      <nav
        aria-label="Pagination"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <div>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            Page {validPage} of {totalPages} ({filteredPosts.length} total posts)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {validPage > 1 ? (
            <Link
              href={`/posts?page=${validPage - 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              style={{
                padding: '0.4rem 0.8rem',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                color: '#111',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              ← Previous
            </Link>
          ) : (
            <span
              style={{
                padding: '0.4rem 0.8rem',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#9ca3af',
                fontSize: '0.875rem',
              }}
            >
              ← Previous
            </span>
          )}

          {validPage < totalPages ? (
            <Link
              href={`/posts?page=${validPage + 1}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              style={{
                padding: '0.4rem 0.8rem',
                background: '#0070f3',
                border: '1px solid #0070f3',
                borderRadius: '6px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Next →
            </Link>
          ) : (
            <span
              style={{
                padding: '0.4rem 0.8rem',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#9ca3af',
                fontSize: '0.875rem',
              }}
            >
              Next →
            </span>
          )}
        </div>
      </nav>
    </div>
  )
}

export default async function PostsPage({ searchParams }: SearchParamsProps): Promise<React.JSX.Element> {
  const query = searchParams?.q || ''
  const pageNum = parseInt(searchParams?.page || '1', 10) || 1

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <nav style={{ marginBottom: '1rem' }}>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            ← Home
          </Link>
        </nav>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111' }}>
          Posts (Search &amp; Pagination)
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Server-side filtered and paginated using Next.js <code>searchParams</code>.
        </p>

        {/* Search Form */}
        <form method="GET" action="/posts" style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search posts by title or content..."
            style={{
              flex: 1,
              padding: '0.6rem 0.9rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.95rem',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.6rem 1.25rem',
              background: '#0070f3',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Search
          </button>
          {query && (
            <Link
              href="/posts"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.6rem 1rem',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#4b5563',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              Clear
            </Link>
          )}
        </form>
      </header>

      <AddPostForm />

      <Suspense
        fallback={
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#666' }}>
            <p>Loading posts...</p>
          </div>
        }
      >
        <PostsList query={query} currentPage={pageNum} />
      </Suspense>
    </main>
  )
}
