import type { TaskItem } from './task'

export interface Column {
  id: number
  name: string
  position: number
  tasks: TaskItem[]
}

export interface ColumnRequest {
  name: string
}