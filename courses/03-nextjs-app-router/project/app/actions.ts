'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export interface CreatePostData {
  title: string
  body: string
}

export interface PostResult {
  success: boolean
  message: string
  post?: {
    id: number
    title: string
    body: string
    userId: number
  }
}

/**
 * Server Action: Create a new post and revalidate the posts page.
 * Uses revalidatePath to refresh /posts and revalidateTag to bust
 * any tagged cache entries.
 */
export async function createPost(formData: FormData): Promise<PostResult> {
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  if (!title || !body) {
    return { success: false, message: 'Title and body are required.' }
  }

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 }),
    })

    if (!res.ok) {
      return { success: false, message: 'Failed to create post on server.' }
    }

    const post = await res.json()

    // Revalidate the posts listing page so fresh data is served
    revalidatePath('/posts')
    // Revalidate posts tagged cache entries
    revalidateTag('posts')

    return { success: true, message: 'Post created successfully!', post }
  } catch {
    // Still revalidate even on network error to clear stale cache
    revalidatePath('/posts')
    revalidateTag('posts')
    return { success: false, message: 'Network error — could not reach API.' }
  }
}
