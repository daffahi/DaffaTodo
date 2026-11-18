// Satu papan di daftar papan. Samakan dengan BoardSummaryResponse.cs
import type { Column } from './column'

export interface BoardSummary {
  id: number
  name: string
  description: string | null
  createdAt: string
}

// Data yang dikirim saat membuat papan. Samakan dengan BoardRequest.cs
export interface BoardRequest {
  name: string
  description?: string
}

// Papan lengkap dengan kolom dan tugasnya. Samakan dengan BoardDetailResponse.cs
export interface BoardDetail {
  id: number
  name: string
  description: string | null
  createdAt: string
  columns: Column[]
}