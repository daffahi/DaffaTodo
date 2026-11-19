import { api } from './client'
import type { Column, ColumnRequest } from '../types/column'

export async function createColumn(boardId: number, data: ColumnRequest): Promise<Column> {
  const response = await api.post<Column>(`/api/boards/${boardId}/columns`, data)
  return response.data
}

export async function updateColumn(id: number, data: ColumnRequest): Promise<void> {
  await api.put(`/api/columns/${id}`, data)
}

export async function deleteColumn(id: number): Promise<void> {
  await api.delete(`/api/columns/${id}`)
}