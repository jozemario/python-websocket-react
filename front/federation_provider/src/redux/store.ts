import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { combineReducers } from 'redux'
import { messageSlice, sendMessage } from './slices/messageSlice.ts'
import { authSlice } from './slices/authSlice.ts'
import { api } from './apis/mainApi.ts'

const Store = configureStore({
  reducer: combineReducers({
    auth: authSlice.reducer,
    messages: messageSlice.reducer,
    [api.reducerPath]: api.reducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

type RootState = ReturnType<typeof Store.getState>
type AppDispatch = typeof Store.dispatch
const useAppDispatch = () => useDispatch<AppDispatch>()

export { Store, authSlice, messageSlice, api, useAppDispatch, sendMessage }

export type { RootState, AppDispatch }
export default Store
