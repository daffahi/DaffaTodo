import { api } from './client'
import type { TaskItem, TaskRequest } from '../types/task'

// POST /api/columns/{columnId}/tasks
export async function createTask(columnId: number, data: TaskRequest): Promise<TaskItem> {
  const response = await api.post<TaskItem>(`/api/columns/${columnId}/tasks`, data)
  return response.data
}

// DELETE /api/tasks/{id}
export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/tasks/${id}`)
}