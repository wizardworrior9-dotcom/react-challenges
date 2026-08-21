import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice.ts'
import uiReducer from './slices/uiSlice.ts'
import usersReducer from './slices/usersSlice.ts'
import filtersReducer from './slices/filtersSlice.ts'
import { apiSlice } from '../api/apiSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer,
    users: usersReducer,
    filters: filtersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
