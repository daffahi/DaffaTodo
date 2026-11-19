import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteColumn, updateColumn } from '../api/columns'
import { getErrorMessage } from '../api/errors'
import type { Column } from '../types/column'

interface ColumnHeaderProps {
  column: Column
}

function ColumnHeader({ column }: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(column.name)

  const queryClient = useQueryClient()

  const renameMutation = useMutation({
    mutationFn: (newName: string) => updateColumn(column.id, { name: newName }),
    onSuccess: () => {
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['board'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteColumn(column.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] }),
  })

  const startEditing = () => {
    setName(column.name)
    renameMutation.reset()
    setIsEditing(true)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim() === column.name) {
      setIsEditing(false)
      return
    }
    renameMutation.mutate(name.trim())
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    const count = column.tasks.length
    const message =
      count === 0
        ? `Delete column "${column.name}"?`
        : `Delete column "${column.name}" and its ${count} task${count === 1 ? '' : 's'}?`

    if (window.confirm(message)) {
      deleteMutation.mutate()
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          type="text"
          required
          maxLength={50}
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm font-semibold focus:border-slate-500 focus:outline-none"
        />

        {renameMutation.isError && (
          <p className="mt-1 text-xs text-red-600">{getErrorMessage(renameMutation.error)}</p>
        )}

        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            disabled={renameMutation.isPending}
            className="rounded bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {renameMutation.isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded px-3 py-1 text-xs text-slate-600 hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">{column.name}</h2>
        <span className="text-sm text-slate-500">{column.tasks.length}</span>
      </div>

      <div className="mt-1 flex gap-3">
        <button onClick={startEditing} className="text-xs text-slate-600 hover:underline">
          Rename
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="text-xs text-red-600 hover:underline disabled:opacity-50"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {deleteMutation.isError && (
        <p className="mt-1 text-xs text-red-600">{getErrorMessage(deleteMutation.error)}</p>
      )}
    </div>
  )
}

export default ColumnHeader