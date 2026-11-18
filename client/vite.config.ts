// Pengaturan Vite. Di sini kita mendaftarkan plugin Tailwind.
// Tambahkan import Tailwind dan daftarkan plugin-nya.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Plugin Tailwind: memproses class Tailwind yang ditulis di komponen
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
