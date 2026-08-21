import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  sidebarOpen: boolean
}

const initialState: UiState = {
  sidebarOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
  },
})

// UI slice reducer and middleware compatibility
export const { toggleSidebar } = uiSlice.actions
export const uiReducer = uiSlice.reducer
export default uiSlice.reducer

