import { api } from './client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/login', data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/register', data)
  return response.data
}