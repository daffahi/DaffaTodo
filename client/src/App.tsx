// Komponen = fungsi yang mengembalikan tampilan. Nama komponen selalu diawali huruf besar
function App() {
  return (
    // className berisi class Tailwind:
    // flex + items-center + justify-center = isi ditaruh tepat di tengah layar
    // min-h-screen = tinggi minimal setinggi layar, bg-slate-100 = latar abu-abu muda
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      {/* text-3xl = ukuran huruf besar, font-bold = tebal, text-slate-800 = abu-abu tua */}
      <h1 className="text-3xl font-bold text-slate-800">DaffaTodo</h1>
    </div>
  )
}

// export default = membuat komponen ini bisa di-import oleh main.tsx
export default App