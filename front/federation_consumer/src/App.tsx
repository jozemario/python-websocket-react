import './App.css'

// // The remote component provided by federation_provider
// import ProviderButton from 'federation_provider/button'
// import ProviderContent from 'federation_provider/content'
// import {
//   authSlice,
//   messageSlice,
//   api,
//   sendMessage,
// } from 'federation_provider/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navigation from './navigation.tsx'
import Home from './pages/Home.tsx'
import Remote1 from './pages/remote1.tsx'
import Remote2 from './pages/remote2.tsx'

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Navigation />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/remote1" Component={() => <Remote1 />} />
        <Route path="/remote2" Component={() => <Remote2 />} />
      </Routes>
    </BrowserRouter>
  )
}
// const App2 = () => {
//   const { checkStoredAuth, logout } = authSlice.actions
//   const { setMessages, receiveMessage } = messageSlice.actions
//   const reducers = {
//     checkStoredAuth,
//     setMessages,
//     receiveMessage,
//     logout,
//   }
//   const thunks = { sendMessage }
//
//   return (
//     <div className="content">
//       <h1>Rsbuild with React</h1>
//       <p>Start building amazing things with Rsbuild.</p>
//       <div>
//         <ProviderButton />
//       </div>
//       <div>
//         <ProviderContent reducers={reducers} apis={api} thunks={thunks} />
//       </div>
//     </div>
//   )
// }

export default App
