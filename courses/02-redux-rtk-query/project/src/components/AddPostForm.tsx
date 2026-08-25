import { useState } from 'react'
import { useCreatePostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [createPost, { isLoading }] = useCreatePostMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await createPost({ title, body, userId: 1 })
    setTitle('')
    setBody('')
    setSuccessMsg('Post created successfully!')
  }

  return (
    <form id="add-post-form" data-testid="add-post-form" onSubmit={handleSubmit}>
      <h3>Add Post</h3>
      {successMsg && <div id="add-post-success" data-testid="add-post-success">{successMsg}</div>}
      <div>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          data-testid="post-title-input"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (successMsg) setSuccessMsg('')
          }}
          placeholder="Post title"
        />
      </div>
      <div>
        <label htmlFor="post-body">Body</label>
        <textarea
          id="post-body"
          data-testid="post-body-input"
          value={body}
          onChange={(e) => {
            setBody(e.target.value)
            if (successMsg) setSuccessMsg('')
          }}
          placeholder="Post body"
        />
      </div>
      <button id="add-post-submit" data-testid="add-post-submit" type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Post'}
      </button>
    </form>
  )
}
