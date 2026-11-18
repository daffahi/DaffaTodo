// File ini mengubah error dari server jadi satu kalimat yang bisa ditampilkan ke pengguna.
// Backend mengirim error dalam tiga bentuk (daftar teks dari Identity, objek message dari login, dan objek errors dari validasi),
// jadi ketiganya ditangani di satu tempat.

import axios from 'axios'

// Tiga kemungkinan bentuk isi error dari backend kita
type ApiErrorData =
  | string[]                                      // error Identity, mis. password terlalu lemah
  | { message?: string; errors?: Record<string, string[]> } // 401 login, dan validasi [Required]

export function getErrorMessage(error: unknown): string {
  // isAxiosError memastikan error ini memang berasal dari pemanggilan API
  if (axios.isAxiosError<ApiErrorData>(error)) {
    // Tidak ada response = server tidak terjangkau (API mati, atau masalah jaringan)
    if (!error.response) {
      return 'Cannot reach the server. Please try again later.'
    }

    const data = error.response.data

    if (Array.isArray(data)) {
      return data.join(' ')
    }
    if (data?.message) {
      return data.message
    }
    if (data?.errors) {
      // flat() meratakan semua pesan validasi jadi satu daftar, kita tampilkan yang pertama
      const messages = Object.values(data.errors).flat()
      if (messages.length > 0) {
        return messages[0]
      }
    }
  }

  return 'Something went wrong. Please try again.'
}