export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface TaskItem {
  id: number
  title: string
  description: string | null
  priority: TaskPriority
  dueDate: string | null
  position: number
}

export interface TaskRequest {
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string
}

export interface MoveTaskRequest {
  boardColumnId: number
  position: number
}