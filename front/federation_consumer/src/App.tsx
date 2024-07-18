import './App.css'

// The remote component provided by federation_provider
import ProviderButton from 'federation_provider/button'
import ProviderContent from 'federation_provider/content'
import {
  authSlice,
  messageSlice,
  api,
  sendMessage,
} from 'federation_provider/store'

const App = () => {
  const { checkStoredAuth, logout } = authSlice.actions
  const { setMessages, receiveMessage } = messageSlice.actions
  const reducers = {
    checkStoredAuth,
    setMessages,
    receiveMessage,
    logout,
  }
  const thunks = { sendMessage }

  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <div>
        <ProviderButton />
      </div>
      <div>
        <ProviderContent reducers={reducers} apis={api} thunks={thunks} />
      </div>
    </div>
  )
}

export default App
