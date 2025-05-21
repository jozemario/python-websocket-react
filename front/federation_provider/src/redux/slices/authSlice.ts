// Auth Slice
import { createSlice, Slice } from '@reduxjs/toolkit'
import { api } from '../apis/mainApi.ts'

export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: { username: string } | null
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: sessionStorage.getItem('token') || null,
  user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  error: null,
}

export const authSlice: Slice<AuthState> = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      state.token = null
      state.user = null
      state.error = null
      state.isAuthenticated = false
    },
    checkStoredAuth: (state) => {
      const token = sessionStorage.getItem('token')
      const user = JSON.parse(sessionStorage.getItem('user') || 'null')
      if (token && user) {
        state.token = token
        state.user = user
        state.isAuthenticated = true
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.isAuthenticated = true
        state.token = payload.access_token
        state.user = { username: payload.username }
        state.error = null
        sessionStorage.setItem('token', payload.access_token)
        sessionStorage.setItem(
          'user',
          JSON.stringify({ username: payload.username }),
        )
      })
      .addMatcher(api.endpoints.login.matchRejected, (state, { error }) => {
        state.error = error.message || 'An error occurred during login.'
      })
  },
})

export const { checkStoredAuth, logout } = authSlice.actions

export default authSlice
