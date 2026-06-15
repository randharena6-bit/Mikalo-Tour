import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        Promise.resolve().then(() => setSocket(null))
      }
      return
    }

    const token = localStorage.getItem('mikalo_token')
    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
    })

    s.on('connect', () => console.log('[Socket] Connecté'))
    s.on('connect_error', (err) => console.error('[Socket] Erreur:', err.message))

    socketRef.current = s
    Promise.resolve().then(() => setSocket(s))

    return () => {
      s.disconnect()
    }
  }, [user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  return useContext(SocketContext)
}
