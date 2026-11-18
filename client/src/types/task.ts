// Bentuk data tugas. Samakan dengan TaskResponse.cs dan TaskRequest.cs di backend
// Pilihan prioritas. Memakai union type, bukan enum, karena tsconfig proyek melarang enum (erasableSyntaxOnly)
export type TaskPriority = 'Low' | 'Medium' | 'High'

// Satu tugas yang diterima dari server. Samakan dengan TaskResponse.cs
// Namanya TaskItem, mengikuti nama entity di backend
export interface TaskItem {
  id: number
  title: string
  description: string | null
  priority: TaskPriority
  dueDate: string | null
  position: number
}

// Data yang dikirim saat membuat tugas. Samakan dengan TaskRequest.cs
export interface TaskRequest {
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string
}