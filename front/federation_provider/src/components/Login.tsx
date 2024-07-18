import './Content.css'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface LoginProps {
  apis: any
}

export const Login = ({ apis }: LoginProps) => {
  const auth = useSelector((state: any) => state.auth)
  const { useLoginMutation } = apis
  const [
    login, // This is the mutation trigger
    { isLoading, error: loginError }, // This is the destructured mutation result
  ] = useLoginMutation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(auth.error || null)
  }, [auth])

  useEffect(() => {
    if (loginError) {
      setError('Failed to login. Please check your credentials.')
    }
  }, [loginError])
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission
    setError(null) // Clear any previous errors
    try {
      await login({ username, password }).unwrap()
    } catch (error) {
      console.error('Failed to login:', error)
      setError('An error occurred during login. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-dark leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-dark mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-transparent border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login
