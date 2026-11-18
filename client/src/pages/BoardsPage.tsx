import { useQuery } from '@tanstack/react-query'
import { getBoards } from '../api/boards'
import BoardCard from '../components/BoardCard'
import CreateBoardForm from '../components/CreateBoardForm'
import { useAuth } from '../hooks/useAuth'

function BoardsPage() {
  const { user, logout } = useAuth()

  // queryKey = "nama" data ini di cache. Harus sama dengan yang dipakai di invalidateQueries
  const { data: boards, isPending, isError } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  })

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold text-slate-800">DaffaTodo</h1>

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

      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <CreateBoardForm />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Your boards</h2>

          {/* Tiga keadaan data: sedang dimuat, gagal, atau berhasil */}
          {isPending && <p className="text-slate-500">Loading boards...</p>}

          {isError && (
            <p className="text-red-600">Could not load your boards. Please try again.</p>
          )}

          {boards && boards.length === 0 && (
            <p className="text-slate-500">You don't have any boards yet. Create your first one above.</p>
          )}

          {boards && boards.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* key wajib unik di setiap item daftar, supaya React tahu item mana yang berubah */}
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default BoardsPage