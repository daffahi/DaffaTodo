// Folder components berisi potongan tampilan yang dipakai ulang.
// Ini penjaga pintu: kalau belum login, pengguna dilempar ke /login. Kalau sudah, halaman di dalamnya ditampilkan.

import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { user } = useAuth()

  if (!user) {
    // replace = alamat /boards tidak dicatat di riwayat, jadi tombol Back tidak mengulang pengalihan
    return <Navigate to="/login" replace />
  }

  // Outlet = tempat halaman anak (mis. BoardsPage) ditampilkan
  return <Outlet />
}