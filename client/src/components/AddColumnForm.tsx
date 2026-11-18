// Form menambah kolom, ditaruh di ujung kanan deretan kolom. Polanya sama dengan AddTaskForm.

import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createColumn } from '../api/columns'
import { getErrorMessage } from '../api/errors'

interface AddColumnFormProps {
  boardId: number
}

function AddColumnForm({ boardId }: AddColumnFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (columnName: string) => createColumn(boardId, { name: columnName }),
    onSuccess: () => {
      setName('')
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutation.mutate(name)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-72 shrink-0 rounded-lg bg-slate-200/60 p-3 text-left text-sm text-slate-600 hover:bg-slate-200"
      >
        + Add column
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-72 shrink-0 space-y-2 rounded-lg bg-slate-200 p-3">
      <input
        type="text"
        required
        maxLength={50}
        autoFocus
        placeholder="Column name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm focus:border-slate-500 focus:outline-none"
      />

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
          className="rounded px-3 py-1 text-sm text-slate-600 hover:bg-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddColumnForm