// RTK Query API
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username,password }) => ({
        url: '/token',
        method: 'POST',
        body: new URLSearchParams({
                'username': username,
                'password': password,
            }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }),
    clearMessages: builder.mutation({
      query: () => ({
        url: '/clear_messages',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
    })
  })
});

export const { useLoginMutation, useClearMessagesMutation } = api;
//export default api;