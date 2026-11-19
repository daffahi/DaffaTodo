import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBoard } from '../api/boards'
import { getErrorMessage } from '../api/errors'

function CreateBoardForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      setName('')
      setDescription('')
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutation.mutate({ name, description: description || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-4 shadow">
      <h2 className="font-semibold text-slate-800">New board</h2>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          required
          maxLength={100}
          placeholder="Board name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
        />
        <input
          type="text"
          maxLength={500}
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 rounded border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>

      {mutation.isError && (
        <p className="mt-2 text-sm text-red-600">{getErrorMessage(mutation.error)}</p>
      )}
    </form>
  )
}

export default CreateBoardForm