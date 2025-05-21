// RTK Query API
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

export interface LoginResponse {
  access_token: string
  username: string
}

export interface LoginRequest {
  username: string
  password: string
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://k3s-websocket.mghcloud.com', // Replace with your API base URL
  }) as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ username, password }) => ({
        url: '/token',
        method: 'POST',
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
    clearMessages: builder.mutation<void, void>({
      query: () => ({
        url: '/clear_messages',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }),
    }),
  }),
})

// Type the hooks explicitly
type LoginMutation = ReturnType<typeof api.useLoginMutation>
type ClearMessagesMutation = ReturnType<typeof api.useClearMessagesMutation>

//export const { useLoginMutation, useClearMessagesMutation } = api
//export default api
