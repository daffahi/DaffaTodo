import { useAuth } from '../hooks/useAuth'

function BoardsPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold text-slate-800">DaffaTodo</h1>

        <div className="flex items-center gap-4">
          {/* "?." aman dipakai kalau user null. Di halaman ini user selalu ada karena dijaga ProtectedRoute */}
          <span className="text-slate-600">{user?.fullName}</span>
          {/* logout mengosongkan user, lalu ProtectedRoute otomatis mengalihkan ke /login */}
          <button
            onClick={logout}
            className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="p-6">
        <p className="text-slate-600">Your boards will appear here.</p>
      </main>
    </div>
  )
}

export default BoardsPage