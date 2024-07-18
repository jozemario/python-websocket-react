import ProviderContent from 'federation_provider/content'

import {
  api,
  authSlice,
  messageSlice,
  sendMessage,
} from 'federation_provider/store'

function Remote1() {
  const { checkStoredAuth, logout } = authSlice.actions
  const { setMessages, receiveMessage } = messageSlice.actions
  const reducers = {
    checkStoredAuth,
    setMessages,
    receiveMessage,
    logout,
  }
  const thunks = { sendMessage }
  return <ProviderContent reducers={reducers} apis={api} thunks={thunks} />
}

export default Remote1
