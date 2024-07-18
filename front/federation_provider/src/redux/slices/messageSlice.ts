import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../apis/mainApi.ts'

export interface MessagesState {
  messages: string[]
  error: string | null
}

const initialState: MessagesState = {
  messages: [],
  error: null,
}
// Thunks
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (
    { message, websocket }: { message: string; websocket: WebSocket },
    { dispatch },
  ) => {
    try {
      console.log('Sending message:', message)
      websocket.send(JSON.stringify({ message }))
      dispatch(messageSlice.actions.sendMessageSuccess())
      return message
    } catch (error) {
      dispatch(
        messageSlice.actions.sendMessageFailure('Failed to send message.'),
      )
      throw error
    }
  },
)

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    receiveMessage: (state, action) => {
      //state.messages.push(action.payload)
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    sendMessageSuccess: (state) => {
      state.error = null
    },
    sendMessageFailure: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        //@ts-ignore
        let message = `${JSON.parse(sessionStorage.getItem('user')).username}: ${action.payload}`
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
  sendMessageSuccess,
  sendMessageFailure,
} = messageSlice.actions

export { messageSlice }

export default messageSlice
