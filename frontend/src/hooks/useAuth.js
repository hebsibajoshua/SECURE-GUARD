import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '../services/auth'

export default function useAuth() {
  const [user, setUser] = useState(authService.getCurrentUser())
  const navigate = useNavigate()

  const login = useCallback(async (email, password) => {
    const u = await authService.login(email, password)
    setUser(u)
    if (u.role === 'admin') navigate('/admin/dashboard')
    else if (u.role === 'company') navigate('/company/dashboard')
    else navigate('/guard/dashboard')
    return u
  }, [navigate])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    navigate('/login')
  }, [navigate])

  return { user, login, logout }
}
