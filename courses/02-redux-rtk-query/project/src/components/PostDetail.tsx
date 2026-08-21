import { useGetPostByIdQuery } from '../api/apiSlice'

interface PostDetailProps {
  postId: number
}

export default function PostDetail({ postId }: PostDetailProps) {
  const { data: post, isLoading, isError } = useGetPostByIdQuery(postId)

  if (isLoading) {
    return <div id="post-detail">Loading post...</div>
  }

  if (isError || !post) {
    return <div id="post-detail">Post not found.</div>
  }

  return (
    <div id="post-detail">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <small>User ID: {post.userId}</small>
    </div>
  )
}
