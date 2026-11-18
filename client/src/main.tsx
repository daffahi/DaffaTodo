import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Baris ini yang memuat Tailwind ke seluruh aplikasi. Kalau hilang, semua class Tailwind tidak berefek
import './index.css'
import App from './App.tsx'

// Ambil <div id="root"> dari index.html, lalu tampilkan komponen App di dalamnya
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)