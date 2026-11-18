// Jendela edit tugas. Form-nya sama dengan AddTaskForm, ditambah isian deskripsi, dan semua isiannya diisi dari data tugas yang ada.

import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { updateTask } from '../api/tasks'
import type { TaskItem, TaskPriority, TaskRequest } from '../types/task'

interface EditTaskModalProps {
  task: TaskItem
  // Fungsi untuk menutup modal, dikirim dari TaskCard
  onClose: () => void
}

function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  // Nilai awal diambil dari data tugas. Modal hanya dibuat saat dibuka, jadi isiannya selalu segar
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  // Input tanggal butuh format "2026-12-31", sedangkan server mengirim "2026-12-31T00:00:00": ambil 10 karakter pertama
  const [dueDate, setDueDate] = useState(task.dueDate?.slice(0, 10) ?? '')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: TaskRequest) => updateTask(task.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      onClose()
    },
  })

  // Tekan Esc untuk menutup modal. Listener dipasang saat modal muncul dan dilepas saat modal hilang
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Deskripsi dan tenggat yang dikosongkan dikirim sebagai undefined, sehingga di database menjadi null
    mutation.mutate({
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate || undefined,
    })
  }

  // createPortal(isi, tujuan): menggambar isi di tujuan (body), bukan di tempat komponen ini dipanggil
  return createPortal(
    // onPointerDown + stopPropagation: mencegah dnd-kit menganggap klik/seleksi teks di modal sebagai awal drag
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg"
      >
        <h2 id="edit-task-title" className="text-lg font-semibold text-slate-800">
          Edit task
        </h2>

        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="task-title"
            type="text"
            required
            maxLength={150}
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="task-description"
            rows={4}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="task-due-date" className="block text-sm font-medium text-slate-700">
              Due date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-600">{getErrorMessage(mutation.error)}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}

export default EditTaskModal