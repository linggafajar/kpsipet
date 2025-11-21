'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import GuruLayout from '@/app/components/guru/GuruLayout'
import GuruHeader from '@/app/components/guru/GuruHeader'
import { ToastProvider, useToast } from '@/app/components/ui/ToastContainer'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import { ArrowLeft, Send } from 'lucide-react'

interface Siswa {
  id_siswa: number
  nisn: string
  nama_siswa: string
  kelas: string
}

interface Guru {
  id_guru: number
  nama_guru: string
  nip: string
}

function PengaduanPageContent() {
  const router = useRouter()
  const { showToast } = useToast()
  const [siswa, setSiswa] = useState<Siswa[]>([])
  const [guru, setGuru] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id_siswa: '',
    id_guru: '',
    deskripsi_masalah: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [siswaRes, guruRes] = await Promise.all([
        fetch('/api/siswa'),
        fetch('/api/guru')
      ])

      const [siswaData, guruData] = await Promise.all([
        siswaRes.json(),
        guruRes.json()
      ])

      setSiswa(siswaData)
      setGuru(guruData)

      // Auto-select first guru if available (untuk demo)
      if (guruData.length > 0) {
        setFormData(prev => ({ ...prev, id_guru: guruData[0].id_guru.toString() }))
      }
    } catch (error) {
      showToast('Gagal memuat data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/pengaduan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_siswa: parseInt(formData.id_siswa),
          id_guru: parseInt(formData.id_guru)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat pengaduan')
      }

      showToast('Pengaduan berhasil dibuat', 'success')
      setTimeout(() => {
        router.push('/guru/riwayat')
      }, 1500)
    } catch (error: any) {
      showToast(error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <GuruLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Memuat data..." />
        </div>
      </GuruLayout>
    )
  }

  return (
    <GuruLayout>
      <GuruHeader
        title="Buat Pengaduan Baru"
        subtitle="Laporkan masalah perilaku siswa"
        action={
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        }
      />

      <div className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Siswa */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Siswa <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.id_siswa}
                onChange={(e) => setFormData({ ...formData, id_siswa: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Pilih Siswa --</option>
                {siswa.map(s => (
                  <option key={s.id_siswa} value={s.id_siswa}>
                    {s.nama_siswa} ({s.nisn}) - {s.kelas}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Pilih siswa yang dilaporkan
              </p>
            </div>

            {/* Pilih Guru Pelapor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guru Pelapor <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.id_guru}
                onChange={(e) => setFormData({ ...formData, id_guru: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Pilih Guru --</option>
                {guru.map(g => (
                  <option key={g.id_guru} value={g.id_guru}>
                    {g.nama_guru} ({g.nip})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Pilih nama Anda sebagai guru yang melaporkan
              </p>
            </div>

            {/* Deskripsi Masalah */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Masalah <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                placeholder="Jelaskan secara detail masalah atau pelanggaran yang dilakukan siswa..."
                value={formData.deskripsi_masalah}
                onChange={(e) => setFormData({ ...formData, deskripsi_masalah: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimal 20 karakter. Sertakan informasi tanggal, waktu, dan kronologi kejadian.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Catatan:</strong> Pengaduan yang Anda buat akan diteruskan ke Bimbingan Konseling (BK)
                untuk ditindaklanjuti. Pastikan informasi yang Anda berikan akurat dan lengkap.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Pengaduan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GuruLayout>
  )
}

export default function PengaduanPage() {
  return (
    <ToastProvider>
      <PengaduanPageContent />
    </ToastProvider>
  )
}
