import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mikalo_token')
    ;(token
      ? authService.me()
          .then((res) => setUser(res.data.data))
          .catch(() => localStorage.removeItem('mikalo_token'))
      : Promise.resolve()
    ).finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password })
    const { token, user: userData } = res.data.data
    localStorage.setItem('mikalo_token', token)
    setUser(userData || res.data.data)
    return res.data
  }, [])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    const { token, user: userData } = res.data.data
    localStorage.setItem('mikalo_token', token)
    setUser(userData || res.data.data)
    return res.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mikalo_token')
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const res = await authService.me()
    setUser(res.data.data)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
