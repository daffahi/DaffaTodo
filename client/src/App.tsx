import { useState } from 'react'
import { login } from './api/auth'

function App() {
  // useState = penyimpanan data di komponen. Kalau nilainya berubah, tampilan ikut diperbarui
  const [result, setResult] = useState('')

  const handleTest = async () => {
    try {
      const data = await login({ email: 'test@example.com', password: 'Test1234' })
      setResult(`Login success: ${data.email}`)
    } catch {
      setResult('Login failed, check the browser console')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100">
      <h1 className="text-3xl font-bold text-slate-800">DaffaTodo</h1>
      <button
        onClick={handleTest}
        className="rounded bg-slate-800 px-4 py-2 text-white"
      >
        Test API
      </button>
      <p className="text-slate-700">{result}</p>
    </div>
  )
}

export default App