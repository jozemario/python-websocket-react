import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Slice,
} from '@reduxjs/toolkit'
import type { AsyncThunk } from '@reduxjs/toolkit'
import { api } from '../apis/mainApi.ts'

export interface Message {
  id: string
  content: string
  timestamp: string
  sender: string
}

export interface MessageState {
  messages: string[]
  error: string | null
}

const initialState: MessageState = {
  messages: [],
  error: null,
}

// Thunks
export const sendMessage: AsyncThunk<
  string,
  { message: string; websocket: WebSocket },
  Record<string, never>
> = createAsyncThunk(
  'messages/sendMessage',
  async (
    { message, websocket }: { message: string; websocket: WebSocket },
    { dispatch },
  ) => {
    try {
      console.log('Sending message:', message)
      websocket.send(JSON.stringify({ message }))
      dispatch(
        messageSlice.actions.sendMessageSuccess('Message sent successfully.'),
      )
      return message
    } catch (error) {
      dispatch(
        messageSlice.actions.sendMessageFailure('Failed to send message.'),
      )
      throw error
    }
  },
)

export const messageSlice: Slice<MessageState> = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    receiveMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload)
    },
    setMessages: (state, action: PayloadAction<string[]>) => {
      state.messages = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    sendMessageSuccess: (state) => {
      state.error = null
    },
    sendMessageFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        //@ts-expect-error - User data from sessionStorage
        const message = `${JSON.parse(sessionStorage.getItem('user')).username}: ${action.payload}`
        state.messages.push(message)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to send message'
      })
    builder
      .addMatcher(api.endpoints.clearMessages.matchFulfilled, (state) => {
        state.messages = []
        state.error = null
      })
      .addMatcher(
        api.endpoints.clearMessages.matchRejected,
        (state, { error }) => {
          state.error = 'Failed to clear messages: ' + error.message
        },
      )
  },
})

export const {
  receiveMessage,
  setMessages,
  clearMessages,
  setError,
  clearError,
  sendMessageSuccess,
  sendMessageFailure,
} = messageSlice.actions

export default messageSlice
