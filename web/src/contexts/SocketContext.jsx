import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect()
      setSocket(null)
      return
    }

    const token = localStorage.getItem('mikalo_token')
    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
    })

    s.on('connect', () => console.log('[Socket] Connecté'))
    s.on('connect_error', (err) => console.error('[Socket] Erreur:', err.message))

    setSocket(s)

    return () => s.disconnect()
  }, [user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
