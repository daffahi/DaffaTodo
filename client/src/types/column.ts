// Bentuk data tugas. Samakan dengan ColumnResponse.cs dan ColumnRequest.cs di backend

import type { TaskItem } from './task'

// Satu kolom beserta tugas di dalamnya. Samakan dengan ColumnResponse.cs
export interface Column {
  id: number
  name: string
  position: number
  tasks: TaskItem[]
}

// Data yang dikirim saat menambah kolom. Samakan dengan ColumnRequest.cs
export interface ColumnRequest {
  name: string
}