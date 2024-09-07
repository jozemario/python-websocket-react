import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navigation from './navigation.tsx'
import Home from './pages/Home.tsx'
import Remote1 from './pages/remote1.tsx'
import Remote2 from './pages/remote2.tsx'
import Remote3 from './pages/remote3.tsx'

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Navigation />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/remote1" Component={() => <Remote1 />} />
        <Route path="/remote2" Component={() => <Remote2 />} />
        <Route path="/remote3" Component={() => <Remote3 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
