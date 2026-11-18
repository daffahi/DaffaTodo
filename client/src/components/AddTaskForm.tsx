// Form menambah tugas di dalam satu kolom. Awalnya hanya tombol “+ Add task”, kalau diklik berubah jadi form.

import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { createTask } from '../api/tasks'
import type { TaskPriority, TaskRequest } from '../types/task'

interface AddTaskFormProps {
  columnId: number
}

function AddTaskForm({ columnId }: AddTaskFormProps) {
  // isOpen menentukan yang tampil: tombol "+ Add task" atau form lengkapnya
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [dueDate, setDueDate] = useState('')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    // Dibungkus fungsi karena createTask butuh dua argumen (columnId dan data), sedangkan mutate hanya mengirim satu
    mutationFn: (data: TaskRequest) => createTask(columnId, data),
    onSuccess: () => {
      // Kosongkan isian dan tutup form
      setTitle('')
      setPriority('Medium')
      setDueDate('')
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Tenggat kosong dikirim sebagai undefined, bukan teks kosong
    mutation.mutate({ title, priority, dueDate: dueDate || undefined })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded px-2 py-1 text-left text-sm text-slate-600 hover:bg-slate-300"
      >
        + Add task
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded bg-white p-3 shadow-sm">
      <input
        type="text"
        required
        maxLength={150}
        autoFocus
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none"
      />

      <div className="flex gap-2">
        {/* "as TaskPriority" memberi tahu TypeScript bahwa nilai dari select pasti salah satu dari tiga pilihan */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
        />
      </div>

      {mutation.isError && (
        <p className="text-xs text-red-600">{getErrorMessage(mutation.error)}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Adding...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddTaskForm