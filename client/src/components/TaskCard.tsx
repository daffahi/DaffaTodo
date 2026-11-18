// Satu kartu tugas: judul, label prioritas berwarna, tenggat, dan tombol hapus.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { deleteTask } from '../api/tasks'
import type { TaskItem, TaskPriority } from '../types/task'

// Warna label per prioritas. Class Tailwind harus ditulis utuh (tidak boleh disambung dari potongan teks),
// kalau tidak Tailwind tidak menemukannya saat membaca kode
const priorityStyles: Record<TaskPriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
}

interface TaskCardProps {
  task: TaskItem
}

function TaskCard({ task }: TaskCardProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteTask,
    // ['board'] cocok dengan semua data berawalan 'board' (['board', 5], ['board', 8], dst.),
    // jadi tidak perlu mengoper id papan sampai ke komponen ini
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] }),
  })

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      mutation.mutate(task.id)
    }
  }

  return (
    <div className="rounded bg-white p-3 shadow-sm">
      <p className="font-medium text-slate-800">{task.title}</p>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>

          {/* Tenggat hanya tampil kalau diisi */}
          {task.dueDate && (
            <span className="text-xs text-slate-500">
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={mutation.isPending}
          className="text-xs text-red-600 hover:underline disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {mutation.isError && (
        <p className="mt-2 text-xs text-red-600">{getErrorMessage(mutation.error)}</p>
      )}
    </div>
  )
}

export default TaskCard