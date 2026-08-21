import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../api/apiSlice'

interface PostDetailProps {
  postId?: number
}

export default function PostDetail({ postId: propPostId }: PostDetailProps = {}) {
  const { postId: paramPostId } = useParams<{ postId?: string }>()
  const id = propPostId ?? (paramPostId ? Number(paramPostId) : 1)
  const { data: post, isLoading, isError } = useGetPostByIdQuery(id)

  if (isLoading) {
    return <div id="post-detail" data-testid="post-detail">Loading post...</div>
  }

  if (isError || !post) {
    return <div id="post-detail" data-testid="post-detail">Post not found.</div>
  }

  return (
    <div id="post-detail" data-testid="post-detail">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <small>User ID: {post.userId}</small>
    </div>
  )
}
