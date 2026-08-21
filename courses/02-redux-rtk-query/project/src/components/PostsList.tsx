import { useGetPostsQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function PostsList() {
  const { data: posts, isLoading, isError, error, refetch } = useGetPostsQuery()

  if (isLoading) {
    return (
      <div id="posts-list" data-testid="posts-list">
        <div id="posts-loading" data-testid="posts-loading">Loading posts...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div id="posts-list" data-testid="posts-list">
        <div id="posts-error" data-testid="posts-error">
          <ErrorDisplay message={typeof error === 'string' ? error : 'Failed to load posts.'} onRetry={refetch} />
        </div>
      </div>
    )
  }

  return (
    <div id="posts-list" data-testid="posts-list">
      <h2>Posts</h2>
      <button
        type="button"
        id="refetch-posts-btn"
        data-testid="refetch-posts-btn"
        onClick={() => refetch()}
        style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
      >
        Refetch Posts
      </button>
      <ul>
        {posts?.map((post) => (
          <li key={post.id} data-testid={`post-${post.id}`}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
