import { NextResponse } from 'next/server'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Understanding Next.js 14 Route Handlers',
    body: 'Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs.',
    userId: 1,
  },
  {
    id: 2,
    title: 'Server Components vs Client Components',
    body: 'Server Components execute exclusively on the server, producing static or streamed HTML without shipping JavaScript.',
    userId: 1,
  },
  {
    id: 3,
    title: 'Data Fetching & Caching Strategies',
    body: 'Next.js extends fetch to automatically configure caching and revalidation behaviors for each request.',
    userId: 1,
  },
]

export async function GET(): Promise<NextResponse<Post[]>> {
  return NextResponse.json(mockPosts, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(request: Request): Promise<NextResponse<{ message: string; post?: Post }>> {
  try {
    const body = await request.json()
    const newPost: Post = {
      id: mockPosts.length + 1,
      title: body.title || 'Untitled Post',
      body: body.body || 'No description provided.',
      userId: body.userId || 1,
    }

    mockPosts.push(newPost)

    return NextResponse.json(
      { message: 'Post created successfully', post: newPost },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    )
  }
}
