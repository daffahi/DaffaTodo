// Header yang tadinya ada di BoardsPage dipindah ke komponen sendiri, karena sekarang dipakai dua halaman

import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

function AppHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      {/* Logo jadi link ke daftar papan, supaya mudah kembali dari halaman mana pun */}
      <Link to="/boards" className="text-xl font-bold text-slate-800">
        DaffaTodo
      </Link>

      <div className="flex items-center gap-4">
        <span className="text-slate-600">{user?.fullName}</span>
        <button
          onClick={logout}
          className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
        >
          Log out
        </button>
      </div>
    </header>
  )
}

export default AppHeader