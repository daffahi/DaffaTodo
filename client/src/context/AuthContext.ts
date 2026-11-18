// Folder context berisi data global aplikasi.
// File ini hanya mendefinisikan “bentuk” context: data apa yang disediakan (user) dan fungsi apa yang bisa dipanggil (login, register, logout).
// Isi sebenarnya ada di AuthProvider.

import { createContext } from 'react'
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth'

export interface AuthContextValue {
  // null = belum login
  user: AuthUser | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

// Nilai awal null, karena nilai aslinya baru ada setelah AuthProvider dipasang
export const AuthContext = createContext<AuthContextValue | null>(null)