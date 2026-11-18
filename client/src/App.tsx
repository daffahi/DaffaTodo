import { Navigate, Route, Routes } from 'react-router'
import { ProtectedRoute } from './components/ProtectedRoute'
import BoardsPage from './pages/BoardsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardDetailPage from './pages/BoardDetailPage'

function App() {
  return (
    <Routes>
      {/* Halaman terbuka, bisa diakses tanpa login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Halaman di dalam ProtectedRoute hanya bisa dibuka setelah login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/boards" element={<BoardsPage />} />
        {/* ":boardId" = bagian dinamis, bisa diisi angka apa saja. Dibaca di halaman lewat useParams */}
        <Route path="/boards/:boardId" element={<BoardDetailPage />} />
      </Route>

      {/* Alamat lain yang tidak dikenal dialihkan ke /boards (yang akan menuju /login kalau belum login) */}
      <Route path="*" element={<Navigate to="/boards" replace />} />
    </Routes>
  )
}

export default App