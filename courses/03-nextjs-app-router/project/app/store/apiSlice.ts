import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Post {
  id: number
  title: string
  body: string
  userId?: number
}

export interface NewPost {
  title: string
  body: string
  userId?: number
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'api/posts',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    addPost: builder.mutation<{ message: string; post: Post }, NewPost>({
      query: (newPost) => ({
        url: 'api/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
})

export const { useGetPostsQuery, useAddPostMutation } = apiSlice
