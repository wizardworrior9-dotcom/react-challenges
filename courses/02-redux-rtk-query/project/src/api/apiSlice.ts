import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi } from './mockServer'
import type { User, Post } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    // Users
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        const data = await mockApi.getUsers()
        return { data }
      },
      providesTags: ['User'],
    }),

    getUserById: builder.query<User, number>({
      queryFn: async (id) => {
        const data = await mockApi.getUserById(id)
        return { data }
      },
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<User, Omit<User, 'id'>>({
      queryFn: async (user) => {
        const data = await mockApi.createUser(user)
        return { data }
      },
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<User, { id: number; updates: Partial<User> }>({
      queryFn: async ({ id, updates }) => {
        const data = await mockApi.updateUser(id, updates)
        return { data }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getUsers', undefined, (draft) => {
            const user = draft.find((u) => u.id === id)
            if (user) Object.assign(user, updates)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    deleteUser: builder.mutation<void, number>({
      queryFn: async (id) => {
        await mockApi.deleteUser(id)
        return { data: undefined }
      },
      invalidatesTags: ['User'],
    }),

    // Posts
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        const data = await mockApi.getPosts()
        return { data }
      },
      providesTags: ['Post'],
    }),

    getPostById: builder.query<Post, number>({
      queryFn: async (id) => {
        const data = await mockApi.getPostById(id)
        return { data }
      },
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),

    createPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (post) => {
        const data = await mockApi.createPost(post)
        return { data }
      },
      invalidatesTags: ['Post'],
    }),

    updatePost: builder.mutation<Post, { id: number; updates: Partial<Post> }>({
      queryFn: async ({ id, updates }) => {
        const data = await mockApi.updatePost(id, updates)
        return { data }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Post', id }],
    }),

    deletePost: builder.mutation<void, number>({
      queryFn: async (id) => {
        await mockApi.deletePost(id)
        return { data: undefined }
      },
      invalidatesTags: ['Post'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = apiSlice
