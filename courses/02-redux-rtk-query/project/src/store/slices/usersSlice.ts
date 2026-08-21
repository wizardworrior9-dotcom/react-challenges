import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { mockApi } from '../../api/mockServer.ts'
import type { User } from '../../api/mockServer.ts'

interface UsersState {
  list: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
}

// Async thunk for fetching users via middleware
export const fetchUsers = createAsyncThunk('users/fetchUsers', () =>
  mockApi.getUsers()
)

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Failed to fetch users'
      })
  },
})

export const usersReducer = usersSlice.reducer
export default usersSlice.reducer
