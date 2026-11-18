import { api } from './client'
import type { Column, ColumnRequest } from '../types/column'

// POST /api/boards/{boardId}/columns
export async function createColumn(boardId: number, data: ColumnRequest): Promise<Column> {
  const response = await api.post<Column>(`/api/boards/${boardId}/columns`, data)
  return response.data
}