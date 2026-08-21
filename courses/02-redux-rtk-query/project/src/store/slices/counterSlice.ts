import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
})

// Counter slice with reducer and middleware compatibility
export const { increment, decrement } = counterSlice.actions
export const counterReducer = counterSlice.reducer
export default counterSlice.reducer

