import { useState } from 'react'
import { useCreatePostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [createPost, { isLoading }] = useCreatePostMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await createPost({ title, body, userId: 1 })
    setTitle('')
    setBody('')
  }

  return (
    <form id="add-post-form" onSubmit={handleSubmit}>
      <h3>Add Post</h3>
      <div>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
        />
      </div>
      <div>
        <label htmlFor="post-body">Body</label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Post body"
        />
      </div>
      <button id="add-post-submit" type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>
    </form>
  )
}
