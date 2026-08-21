import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store.ts'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// Typed hooks for reducer state and middleware actions
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

