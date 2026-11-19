import type { Column } from './column'

export interface BoardSummary {
  id: number
  name: string
  description: string | null
  createdAt: string
}

export interface BoardRequest {
  name: string
  description?: string
}

export interface BoardDetail {
  id: number
  name: string
  description: string | null
  createdAt: string
  columns: Column[]
}