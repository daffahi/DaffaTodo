import { useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth'
import { AuthContext } from './AuthContext'

function loadUser(): AuthUser | null {
  const raw = localStorage.getItem('user')
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  const saveSession = (data: AuthResponse) => {
    const authUser: AuthUser = { email: data.email, fullName: data.fullName }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(authUser))
    setUser(authUser)
  }

  const login = async (data: LoginRequest) => {
    saveSession(await authApi.login(data))
  }

  const register = async (data: RegisterRequest) => {
    saveSession(await authApi.register(data))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}