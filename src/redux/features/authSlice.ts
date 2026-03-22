import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/interface'

export type AuthState = {
  token: string | null
  user: User | null
  isLoggedIn: boolean
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoggedIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isLoggedIn = true
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isLoggedIn = false
    },
  },
})

export const { setCredentials, setUser, logout } = authSlice.actions
export default authSlice.reducer