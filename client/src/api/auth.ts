// Fungsi-fungsi pemanggil endpoint auth.
// Halaman login nanti cukup memanggil login(...) tanpa tahu alamat atau cara kerja HTTP-nya.

import { api } from './client'
// "import type" dipakai untuk interface, karena interface hilang saat build dan hanya berguna untuk pengecekan tipe
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

// POST /api/auth/login
export async function login(data: LoginRequest): Promise<AuthResponse> {
  // <AuthResponse> memberi tahu TypeScript bentuk data yang akan dikembalikan server
  const response = await api.post<AuthResponse>('/api/auth/login', data)
  return response.data
}

// POST /api/auth/register
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/register', data)
  return response.data
}