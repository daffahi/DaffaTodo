import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { deleteBoard } from '../api/boards'
import { getErrorMessage } from '../api/errors'
import type { BoardSummary } from '../types/board'

interface BoardCardProps {
  board: BoardSummary
}

function BoardCard({ board }: BoardCardProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boards'] }),
  })

  const handleDelete = () => {
    // Konfirmasi dulu, karena menghapus papan juga menghapus semua kolom dan tugas di dalamnya
    if (window.confirm(`Delete "${board.name}" and all its tasks?`)) {
      mutation.mutate(board.id)
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-lg bg-white p-4 shadow">
      <Link to={`/boards/${board.id}`} className="block">
        <h3 className="font-semibold text-slate-800">{board.name}</h3>
        {/* Deskripsi hanya tampil kalau ada isinya */}
        {board.description && (
          <p className="mt-1 text-sm text-slate-600">{board.description}</p>
        )}
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {/* Dari teks ISO menjadi tanggal yang mudah dibaca, mis. "Nov 17, 2026" */}
          {new Date(board.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <button
          onClick={handleDelete}
          disabled={mutation.isPending}
          className="text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {mutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {mutation.isError && (
        <p className="mt-2 text-sm text-red-600">{getErrorMessage(mutation.error)}</p>
      )}
    </div>
  )
}

export default BoardCard