// Auth Slice
import { createSlice } from '@reduxjs/toolkit'
import { api } from '../apis/mainApi.ts'

interface AuthState {
  isAuthenticated: boolean
  token: string | any
  user: { username: string } | any
  error: string | any
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: sessionStorage.getItem('token') || null,
  // @ts-ignore
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  error: null,
}
const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
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
      // @ts-ignore

      const user = JSON.parse(sessionStorage.getItem('user'))
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

export { authSlice }

export default authSlice
