import { useQuery } from '@tanstack/react-query'
import { getBoards } from '../api/boards'
import AppHeader from '../components/AppHeader'
import BoardCard from '../components/BoardCard'
import CreateBoardForm from '../components/CreateBoardForm'

function BoardsPage() {
  const { data: boards, isPending, isError } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  })

  return (
    <div className="min-h-screen bg-slate-100">
      <AppHeader />

      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <CreateBoardForm />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Your boards</h2>

          {isPending && <p className="text-slate-500">Loading boards...</p>}

          {isError && (
            <p className="text-red-600">Could not load your boards. Please try again.</p>
          )}

          {boards && boards.length === 0 && (
            <p className="text-slate-500">You don't have any boards yet. Create your first one above.</p>
          )}

          {boards && boards.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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