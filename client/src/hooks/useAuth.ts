// Folder hooks berisi fungsi bantu React yang dipakai ulang.
// Hook ini jalan pintas supaya halaman cukup menulis useAuth() untuk mengambil data login.

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)

  // Terjadi kalau useAuth dipakai di luar AuthProvider. Pesan ini membantu menemukan kesalahan pemasangan
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}