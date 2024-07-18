import './Content.css'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface DashboardProps {
  reducers: any
  apis: any
  thunks: any
}

interface Message {
  user: string
  text: string
}
export default function Dashboard({ apis, reducers, thunks }: DashboardProps) {
  const dispatch = useDispatch()
  const messages = useSelector((state: any) => state.messages)
  const auth = useSelector((state: any) => state.auth)

  const { logout, setMessages, receiveMessage } = reducers
  const { sendMessage } = thunks
  const { useClearMessagesMutation } = apis
  const [
    clearMessages, // This is the mutation trigger
    { isLoading }, // This is the destructured mutation result
  ] = useClearMessagesMutation()
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  const [token, setToken] = useState(auth.token)
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated)
  const [localMessages, setLocalMessages] = useState<Message[]>([])

  useEffect(() => {
    setToken(auth.token)
    setIsAuthenticated(auth.isAuthenticated)
    const parsedMessages = messages.messages.map((msg: string) => {
      const [user, text] = msg.split(': ')
      return { user, text }
    })
    setLocalMessages(parsedMessages)
  }, [auth, messages])

  const ws = useRef(null)

  useEffect(() => {
    // @ts-ignore
    if (token && (!ws.current || ws.current.readyState === WebSocket.CLOSED)) {
      sessionStorage.setItem('token', token)
      connectWebSocket()
    } else if (!token) {
      sessionStorage.removeItem('token')
      if (ws.current) {
        // @ts-ignore
        ws.current.close()
      }
    }
  }, [token])

  const connectWebSocket = () => {
    // @ts-ignore
    ws.current = new WebSocket(`ws://localhost:8000/ws`)

    // @ts-ignore
    ws.current.onopen = (con) => {
      console.log('WebSocket Connected', con)
      setIsConnected(true)

      // Send the token after the connection is established

      // @ts-ignore
      if (ws.current.readyState === WebSocket.OPEN) {
        // @ts-ignore
        ws.current.send(JSON.stringify({ token }))
      } else {
        console.error('WebSocket not ready, unable to send token')
      }
    }

    // @ts-ignore
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'auth_success':
          setIsAuthenticated(true)
          dispatch(receiveMessage('Connected to server'))
          break
        case 'history':
          console.log('Received history:', data.messages)
          dispatch(setMessages(data.messages))
          break
        case 'new_message':
          dispatch(receiveMessage(data.message))
          break
        case 'error':
          console.error('WebSocket error:', data.message)
          setIsAuthenticated(false)
          break
        default:
          console.warn('Unknown message type:', data.type)
      }
    }

    // @ts-ignore
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
      setIsAuthenticated(false)
    }

    // @ts-ignore
    ws.current.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
      setIsAuthenticated(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    sessionStorage.removeItem('token')
    if (ws.current) {
      // @ts-ignore
      ws.current.close()
    }
  }

  const handleClearMessages = async () => {
    try {
      await clearMessages({}).unwrap()
    } catch (error) {
      console.error('Failed to login:', error)
    }
  }

  const handleSendMessage = (e: any) => {
    e.preventDefault()
    if (inputMessage.trim() && ws.current && isAuthenticated) {
      dispatch(
        sendMessage({
          // @ts-ignore
          message: inputMessage,
          websocket: ws.current,
        }),
      )
      setInputMessage('')
    }
  }

  //Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  // ... (keep existing useEffect hooks and functions)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       sidebarRef.current &&
  //       !sidebarRef.current.contains(event.target as Node) &&
  //       isSidebarOpen
  //     ) {
  //       setIsSidebarOpen(!isSidebarOpen)
  //     }
  //   }
  //
  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

  return (
    <div className="bg-gray-100 h-screen flex overflow-hidden">
      <div
        ref={sidebarRef}
        className={`bg-gray-800 text-white w-56 min-h-screen overflow-y-auto transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ease-in-out duration-300 absolute z-20`}
      >
        <div className="p-4">
          <h3 className="text-2xl font-semibold">Sidebar</h3>
          <ul className="mt-4">
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                About
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                Services
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-56' : 'ml-0'
        }`}
      >
        <div className="bg-white shadow">
          <div className="container mx-auto">
            <div className="flex justify-between items-center py-4 px-2">
              <h1 className="text-lg font-semibold">App</h1>

              <button
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={toggleSidebar}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-gray-200 rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Connexion</h2>
                  <p className="text-sm text-gray-500">
                    Status:{' '}
                    {isConnected
                      ? isAuthenticated
                        ? 'Authenticated'
                        : 'Connected'
                      : 'Disconnected'}
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleLogout}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleClearMessages}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  >
                    Clear Messages
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="h-fit flex flex-col">
            <div className="h-144 overflow-y-auto mb-4">
              <div className="px-4 py-2">
                {localMessages.map((msg: Message, index: number) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.user === auth.user?.username
                        ? 'justify-end'
                        : 'justify-start'
                    } mb-4`}
                  >
                    {msg.user !== auth.user?.username && (
                      <img
                        className="w-8 h-8 rounded-full mr-2"
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${msg.user}`}
                        alt={`${msg.user}'s Avatar`}
                      />
                    )}
                    <div
                      className={`rounded-lg p-2 shadow max-w-sm ${
                        msg.user === auth.user?.username
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      {msg.user !== auth.user?.username && (
                        <div className="font-medium text-sm mb-1">
                          {msg.user}
                        </div>
                      )}
                      {msg.text}
                    </div>
                    {msg.user === auth.user?.username && (
                      <img
                        className="w-8 h-8 rounded-full ml-2"
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${msg.user}`}
                        alt="Your Avatar"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-2">
              <div className="flex items-center">
                <form onSubmit={handleSendMessage} className={'w-full '}>
                  <input
                    className="w-full border rounded-full py-2 px-4 mr-2 text-gray-dark"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button
                    disabled={!isAuthenticated}
                    className="my-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
