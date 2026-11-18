// Komponen yang menyimpan status login dan membagikannya ke seluruh aplikasi.
// Saat login, token dan data pengguna disimpan di localStorage supaya tetap login setelah halaman di-refresh.

import { useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth'
import { AuthContext } from './AuthContext'

// Dibaca saat aplikasi pertama dibuka: apakah ada pengguna yang sudah login sebelumnya?
function loadUser(): AuthUser | null {
  const raw = localStorage.getItem('user')
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    // Isinya rusak (mis. diedit manual), anggap belum login
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Memberi fungsi (bukan hasil panggilan) supaya loadUser hanya jalan sekali, saat pertama dibuat
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  // Simpan hasil login/registrasi. Token dibaca oleh interceptor di api/client.ts
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
    // Semua komponen di dalam "children" bisa mengakses nilai ini
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}