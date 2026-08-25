import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../api/apiSlice'

interface PostDetailProps {
  postId?: number | string
}

export default function PostDetail({ postId: propPostId }: PostDetailProps = {}) {
  const { postId: paramPostId } = useParams<{ postId?: string }>()
  const parsedId = propPostId !== undefined ? Number(propPostId) : (paramPostId ? Number(paramPostId) : undefined)
  const id = parsedId && !isNaN(parsedId) ? parsedId : undefined

  const { data: post, isLoading, isError, error } = useGetPostByIdQuery(id as number, {
    skip: !id,
  })

  if (!id) {
    return (
      <div id="post-detail" data-testid="post-detail">
        <p>Please select a post or provide a valid post ID.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div id="post-detail" data-testid="post-detail">
        <div id="post-detail-loading" data-testid="post-detail-loading">Loading post...</div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div id="post-detail" data-testid="post-detail">
        <div id="post-detail-error" data-testid="post-detail-error">
          {error ? (typeof error === 'string' ? error : 'Post not found.') : 'Post not found.'}
        </div>
      </div>
    )
  }

  return (
    <div id="post-detail" data-testid="post-detail">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <small>User ID: {post.userId}</small>
    </div>
  )
}

