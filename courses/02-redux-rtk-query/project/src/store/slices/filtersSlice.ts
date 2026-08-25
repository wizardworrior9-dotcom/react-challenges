// middleware
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface FiltersState {
  userId: number | null
  searchText: string
}

const initialState: FiltersState = {
  userId: null,
  searchText: '',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setUserIdFilter(state, action: PayloadAction<number | null>) {
      state.userId = action.payload
    },
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload
    },
    resetFilters(state) {
      state.userId = null
      state.searchText = ''
    },
  },
})

export const { setUserIdFilter, setSearchText, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
