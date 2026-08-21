import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice.ts'
import uiReducer from './slices/uiSlice.ts'
import usersReducer from './slices/usersSlice.ts'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
