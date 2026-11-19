import { api } from './client'
import type { BoardDetail, BoardRequest, BoardSummary } from '../types/board'

export async function getBoards(): Promise<BoardSummary[]> {
  const response = await api.get<BoardSummary[]>('/api/boards')
  return response.data
}

export async function createBoard(data: BoardRequest): Promise<BoardSummary> {
  const response = await api.post<BoardSummary>('/api/boards', data)
  return response.data
}

export async function deleteBoard(id: number): Promise<void> {
  await api.delete(`/api/boards/${id}`)
}

export async function getBoard(id: number): Promise<BoardDetail> {
  const response = await api.get<BoardDetail>(`/api/boards/${id}`)
  return response.data
}