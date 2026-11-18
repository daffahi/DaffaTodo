// Folder api berisi semua kode yang memanggil backend.
// File ini membuat satu instance axios yang dipakai semua pemanggilan: alamat dasar sudah terpasang, dan token otomatis ditempel.

import axios from 'axios'

// Instance axios dengan alamat dasar dari .env.development
// Jadi di tempat lain cukup menulis '/api/boards', bukan alamat lengkapnya
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor: kode ini jalan otomatis SEBELUM setiap request dikirim
api.interceptors.request.use((config) => {
  // Ambil token yang disimpan saat login
  const token = localStorage.getItem('token')

  // Kalau ada, tempel di header supaya server tahu siapa yang memanggil
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})