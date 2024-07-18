import './Content.css'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Login from './Login.tsx'
import Dashboard from './Dashboard.tsx'

interface ContentProps {
  reducers: any
  apis: any
  thunks: any
}

export default function Content({ reducers, apis, thunks }: ContentProps) {
  const auth = useSelector((state: any) => state.auth)
  const { checkStoredAuth } = reducers
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isAuthenticated)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkStoredAuth())
  }, [dispatch])

  useEffect(() => {
    setIsLoggedIn(auth.isAuthenticated)
  }, [auth])

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard reducers={reducers} apis={apis} thunks={thunks} />
      ) : (
        <Login apis={apis} />
      )}
    </div>
  )
}
