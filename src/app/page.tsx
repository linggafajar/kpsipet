'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUserAlt, FaLock, FaSchool } from 'react-icons/fa'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulasi login (nanti ganti dengan real auth)
      // Untuk demo, kita cek username sederhana
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulasi API call

      if (username === 'admin' || username === 'petugas') {
        // Redirect ke admin dashboard
        router.push('/admin/dashboard')
      } else if (username === 'guru') {
        // Redirect ke guru dashboard
        router.push('/guru/dashboard')
      } else {
        setError('Username atau password salah')
      }
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-500">
      {/* Logo dan Judul */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 backdrop-blur-sm">
          <FaSchool className="text-5xl text-white" />
        </div>
        <h1 className="text-white text-3xl font-bold mb-2">
          Sistem Informasi Pengaduan
        </h1>
        <p className="text-white text-lg opacity-90">SMP Nusantara</p>
      </div>

      {/* Kartu Login */}
      <div className="bg-white w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
          <p className="text-gray-600 text-sm">
            Masukkan kredensial Anda untuk mengakses sistem
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Masukkan username"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Masukkan password"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Masuk ke Sistem'}
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">💡 Demo Credentials:</p>
          <div className="space-y-1 text-xs text-blue-800">
            <div className="flex justify-between">
              <span className="font-medium">Admin/Petugas:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded">admin / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Guru:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded">guru / guru123</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white text-sm mt-8 opacity-80">
        © {new Date().getFullYear()} SMP Nusantara. All rights reserved.
      </footer>
    </main>
  )
}
