// Halaman papan. Mengambil boardId dari alamat, memuat papan dari API, lalu menggambar kolom-kolomnya.
// Dibuat dengan nama BoardDetailPage supaya tidak tertukar dengan BoardsPage (daftar papan).

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link, useParams } from 'react-router'
import { getBoard } from '../api/boards'
import AppHeader from '../components/AppHeader'
import KanbanBoard from '../components/KanbanBoard'

function BoardDetailPage() {
  // useParams membaca bagian dinamis dari alamat. Di /boards/5, boardId = "5" (selalu berupa teks)
  const { boardId } = useParams()
  const id = Number(boardId)

  // queryKey memuat id, jadi setiap papan punya cache sendiri. Awalan 'board' dipakai untuk invalidate
  const { data: board, isPending, isError, error } = useQuery({
    queryKey: ['board', id],
    queryFn: () => getBoard(id),
  })

  // 404 = papan tidak ada atau milik orang lain, dibedakan dari error lain supaya pesannya tepat
  const isNotFound = axios.isAxiosError(error) && error.response?.status === 404

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <AppHeader />

      <main className="flex-1 p-6">
        <Link to="/boards" className="text-sm text-slate-600 hover:underline">
          &larr; Back to boards
        </Link>

        {isPending && <p className="mt-4 text-slate-500">Loading board...</p>}

        {isError && (
          <p className="mt-4 text-red-600">
            {isNotFound ? 'Board not found.' : 'Could not load this board. Please try again.'}
          </p>
        )}

        {board && (
          <>
            <div className="mt-3">
              <h1 className="text-2xl font-bold text-slate-800">{board.name}</h1>
              {board.description && <p className="mt-1 text-slate-600">{board.description}</p>}
            </div>

            {/* overflow-x-auto = kalau kolomnya banyak, area ini bisa digeser ke samping.
                items-start = tinggi tiap kolom mengikuti isinya, tidak dipaksa sama tinggi */}
            <KanbanBoard board={board} />
          </>
        )}
      </main>
    </div>
  )
}

export default BoardDetailPage