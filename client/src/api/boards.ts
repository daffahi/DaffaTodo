import { api } from './client'
import type { BoardRequest, BoardSummary } from '../types/board'

// GET /api/boards
export async function getBoards(): Promise<BoardSummary[]> {
  const response = await api.get<BoardSummary[]>('/api/boards')
  return response.data
}

// POST /api/boards
export async function createBoard(data: BoardRequest): Promise<BoardSummary> {
  const response = await api.post<BoardSummary>('/api/boards', data)
  return response.data
}

// DELETE /api/boards/{id}
export async function deleteBoard(id: number): Promise<void> {
  await api.delete(`/api/boards/${id}`)
}