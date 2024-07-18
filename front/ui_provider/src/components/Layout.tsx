import React from 'react'
import {
  Routes,
  Route,
  Link,
  MemoryRouter,
  BrowserRouter,
} from 'react-router-dom'
import './Layout.css'
import { Image } from 'antd'
import { useSelector } from 'react-redux'

function Home() {
  return (
    <div>
      hello sub2 home page
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/detail">Detail</Link>
        </li>
      </ul>
    </div>
  )
}

function Detail() {
  return (
    <>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/detail">Detail</Link>
        </li>
      </ul>
      <div>hello sub2 detail page</div>
      <Image
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
      />
    </>
  )
}

const Layout = (info: { abc?: number }) => {
  const auth = useSelector((state: any) => state.auth)
  console.log('Layout', auth)
  return (
    <BrowserRouter basename="/remote2">
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/detail" Component={Detail} />
      </Routes>
    </BrowserRouter>
  )
}

export default Layout
