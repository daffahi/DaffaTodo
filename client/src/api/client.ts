// Folder api berisi semua kode yang memanggil backend.
// File ini membuat satu instance axios yang dipakai semua pemanggilan: alamat dasar sudah terpasang, dan token otomatis ditempel.

import axios from 'axios'

// Instance axios dengan alamat dasar dari .env.development
// Jadi di tempat lain cukup menulis '/api/boards', bukan alamat lengkapnya
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor request: kode ini jalan otomatis SEBELUM setiap request dikirim
api.interceptors.request.use((config) => {
  // Ambil token yang disimpan saat login
  const token = localStorage.getItem('token')

  // Kalau ada, tempel di header supaya server tahu siapa yang memanggil
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Kalau token kedaluwarsa (60 menit) atau tidak valid, server membalas 401, dan pengguna otomatis dikembalikan ke halaman login
// Interceptor response: jalan otomatis SETIAP KALI balasan dari server diterima
api.interceptors.response.use(
  // Balasan sukses dibiarkan lewat apa adanya
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // Request login/register juga bisa membalas 401 (password salah). Itu bukan token kedaluwarsa,
      // jadi dikecualikan supaya pesan "Invalid email or password" tetap tampil di form
      const isAuthRequest = error.config?.url?.startsWith('/api/auth')

      if (error.response?.status === 401 && !isAuthRequest) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Muat ulang ke /login. AuthProvider membaca localStorage yang sudah kosong, jadi status login ikut reset
        window.location.href = '/login'
      }
    }

    // Error tetap diteruskan supaya pemanggilnya masih bisa menanganinya
    return Promise.reject(error)
  },
)