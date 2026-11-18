import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { deleteTask } from '../api/tasks'
import type { TaskItem, TaskPriority } from '../types/task'
import EditTaskModal from './EditTaskModal'

const priorityStyles: Record<TaskPriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
}

interface TaskCardProps {
  task: TaskItem
}

function TaskCard({ task }: TaskCardProps) {
  // Menentukan modal edit sedang tampil atau tidak
  const [isEditing, setIsEditing] = useState(false)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteTask,
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

      {/* line-clamp-2 = deskripsi dipotong setelah dua baris, supaya kartu tidak memanjang */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{task.description}</p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>

          {task.dueDate && (
            <span className="text-xs text-slate-500">
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-slate-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="text-xs text-red-600 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {mutation.isError && (
        <p className="mt-2 text-xs text-red-600">{getErrorMessage(mutation.error)}</p>
      )}

      {/* Modal hanya dibuat saat isEditing true. Setiap dibuka, isian form dimulai dari data terbaru */}
      {isEditing && <EditTaskModal task={task} onClose={() => setIsEditing(false)} />}
    </div>
  )
}

export default TaskCard