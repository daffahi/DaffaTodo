import { api } from './client'
import type { MoveTaskRequest, TaskItem, TaskRequest } from '../types/task'

// POST /api/columns/{columnId}/tasks
export async function createTask(columnId: number, data: TaskRequest): Promise<TaskItem> {
  const response = await api.post<TaskItem>(`/api/columns/${columnId}/tasks`, data)
  return response.data
}

// DELETE /api/tasks/{id}
export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/tasks/${id}`)
}

// PATCH /api/tasks/{id}/move
export async function moveTask(id: number, data: MoveTaskRequest): Promise<void> {
  await api.patch(`/api/tasks/${id}/move`, data)
}