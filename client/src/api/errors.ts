import axios from 'axios'

type ApiErrorData =
  | string[]                                   
  | { message?: string; errors?: Record<string, string[]> }

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorData>(error)) {
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
      const messages = Object.values(data.errors).flat()
      if (messages.length > 0) {
        return messages[0]
      }
    }
  }

  return 'Something went wrong. Please try again.'
}