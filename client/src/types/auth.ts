// Folder types berisi bentuk data (interface TypeScript).
// Isinya harus sama dengan DTO di backend, versi React-nya AuthResponse.cs dan teman-temannya.
// Dengan ini editor tahu field apa saja yang ada, dan salah ketik langsung ketahuan.

// Data yang dikirim saat login. Samakan dengan LoginRequest.cs di backend
export interface LoginRequest {
  email: string
  password: string
}

// Data yang dikirim saat registrasi. Samakan dengan RegisterRequest.cs
export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

// Data yang dikembalikan server setelah login atau registrasi berhasil
export interface AuthResponse {
  token: string
  email: string
  fullName: string
}