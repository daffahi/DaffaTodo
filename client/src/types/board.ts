// Satu papan di daftar papan. Samakan dengan BoardSummaryResponse.cs
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