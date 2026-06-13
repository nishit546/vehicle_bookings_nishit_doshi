import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    darkMode: localStorage.getItem('theme') === 'dark',
    globalLoading: false,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light')
    },
    setGlobalLoading: (state, action) => { state.globalLoading = action.payload },
  },
})

export const { toggleSidebar, setSidebarOpen, toggleDarkMode, setGlobalLoading } = uiSlice.actions
export default uiSlice.reducer
